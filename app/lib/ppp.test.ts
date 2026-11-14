import { describe, it, expect } from "vitest";
import {
  getTierForCountry,
  getDiscountForCountry,
  calculateEffectivePrice,
  getCountryTierInfo,
  checkPppAccess,
} from "./ppp";

describe("PPP Config", () => {
  // ─── Tier Mapping ───

  describe("getTierForCountry", () => {
    it("returns tier 1 for US", () => {
      expect(getTierForCountry("US")).toBe(1);
    });

    it("returns tier 2 for Poland", () => {
      expect(getTierForCountry("PL")).toBe(2);
    });

    it("returns tier 3 for India", () => {
      expect(getTierForCountry("IN")).toBe(3);
    });

    it("returns tier 4 for Nigeria", () => {
      expect(getTierForCountry("NG")).toBe(4);
    });

    it("returns tier 1 for unmapped countries", () => {
      expect(getTierForCountry("XX")).toBe(1);
      expect(getTierForCountry("ZZ")).toBe(1);
    });

    it("returns tier 1 for null", () => {
      expect(getTierForCountry(null)).toBe(1);
    });

    it("is case-insensitive", () => {
      expect(getTierForCountry("in")).toBe(3);
      expect(getTierForCountry("Us")).toBe(1);
    });
  });

  // ─── Discount ───

  describe("getDiscountForCountry", () => {
    it("returns 0 for tier 1 countries", () => {
      expect(getDiscountForCountry("US")).toBe(0);
    });

    it("returns 0.3 for tier 2 countries", () => {
      expect(getDiscountForCountry("BR")).toBe(0.3);
    });

    it("returns 0.5 for tier 3 countries", () => {
      expect(getDiscountForCountry("IN")).toBe(0.5);
    });

    it("returns 0.7 for tier 4 countries", () => {
      expect(getDiscountForCountry("NG")).toBe(0.7);
    });

    it("returns 0 for null country", () => {
      expect(getDiscountForCountry(null)).toBe(0);
    });
  });

  // ─── Price Calculation ───

  describe("calculateEffectivePrice", () => {
    it("returns full price for tier 1", () => {
      expect(calculateEffectivePrice(4999, "US")).toBe(4999);
    });

    it("applies 30% discount for tier 2", () => {
      expect(calculateEffectivePrice(4999, "BR")).toBe(3499);
    });

    it("applies 50% discount for tier 3", () => {
      expect(calculateEffectivePrice(4999, "IN")).toBe(2500);
    });

    it("applies 70% discount for tier 4", () => {
      expect(calculateEffectivePrice(4999, "NG")).toBe(1500);
    });

    it("returns 0 for free courses", () => {
      expect(calculateEffectivePrice(0, "IN")).toBe(0);
    });

    it("returns full price for null country", () => {
      expect(calculateEffectivePrice(4999, null)).toBe(4999);
    });
  });

  // ─── Tier Info ───

  describe("getCountryTierInfo", () => {
    it("returns tier, discount, and label", () => {
      const info = getCountryTierInfo("IN");
      expect(info).toEqual({ tier: 3, discount: 0.5, label: "50% off" });
    });

    it("returns full price info for null", () => {
      const info = getCountryTierInfo(null);
      expect(info).toEqual({ tier: 1, discount: 0, label: "Full Price" });
    });
  });

  // ─── PPP Access Guard ───

  describe("checkPppAccess", () => {
    // --- Free courses are never locked ---

    it("allows access to free courses regardless of country", () => {
      const result = checkPppAccess(0, true, "IN", "US");
      expect(result.locked).toBe(false);
    });

    // --- PPP-disabled courses are never locked ---

    it("allows access when PPP is disabled on course", () => {
      const result = checkPppAccess(4999, false, "IN", "US");
      expect(result.locked).toBe(false);
    });

    // --- No purchase country recorded ---

    it("allows access when purchase country is null", () => {
      const result = checkPppAccess(4999, true, null, "US");
      expect(result.locked).toBe(false);
    });

    // --- Tier 1 (full price) purchases are never locked ---

    it("allows Tier 1 purchase from any country", () => {
      const result = checkPppAccess(4999, true, "US", "IN");
      expect(result.locked).toBe(false);
    });

    it("allows Tier 1 purchase when current country is null", () => {
      const result = checkPppAccess(4999, true, "US", null);
      expect(result.locked).toBe(false);
    });

    // --- Discounted purchase — matching country ---

    it("allows Tier 2 purchase when country matches", () => {
      const result = checkPppAccess(4999, true, "PL", "PL");
      expect(result.locked).toBe(false);
    });

    it("allows Tier 3 purchase when country matches", () => {
      const result = checkPppAccess(4999, true, "IN", "IN");
      expect(result.locked).toBe(false);
    });

    it("allows Tier 4 purchase when country matches", () => {
      const result = checkPppAccess(4999, true, "NG", "NG");
      expect(result.locked).toBe(false);
    });

    // --- Discounted purchase — mismatching country ---

    it("blocks Tier 2 purchase when accessed from different country", () => {
      const result = checkPppAccess(4999, true, "PL", "DE");
      expect(result.locked).toBe(true);
      expect(result.lockedCountry).toBe("DE");
      expect(result.purchaseCountry).toBe("PL");
    });

    it("blocks Tier 3 purchase when accessed from different country", () => {
      const result = checkPppAccess(4999, true, "IN", "US");
      expect(result.locked).toBe(true);
      expect(result.lockedCountry).toBe("US");
      expect(result.purchaseCountry).toBe("IN");
    });

    it("blocks Tier 4 purchase when accessed from different country", () => {
      const result = checkPppAccess(4999, true, "NG", "GB");
      expect(result.locked).toBe(true);
      expect(result.lockedCountry).toBe("GB");
      expect(result.purchaseCountry).toBe("NG");
    });

    // --- Discounted purchase — current country unknown ---

    it("allows discounted purchase when current country is null", () => {
      const result = checkPppAccess(4999, true, "IN", null);
      expect(result.locked).toBe(false);
    });

    // --- Return value shape ---

    it("returns null fields when not locked", () => {
      const result = checkPppAccess(4999, true, "US", "IN");
      expect(result).toEqual({
        locked: false,
        lockedCountry: null,
        purchaseCountry: null,
      });
    });

    it("returns country details when locked", () => {
      const result = checkPppAccess(4999, true, "IN", "US");
      expect(result).toEqual({
        locked: true,
        lockedCountry: "US",
        purchaseCountry: "IN",
      });
    });
  });
});
