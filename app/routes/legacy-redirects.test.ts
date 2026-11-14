import { describe, it, expect } from "vitest";
import { loader as redeemLoader } from "./legacy.redeem.$code";
import { loader as loginLoader } from "./legacy.login";
import { loader as signupLoader } from "./legacy.signup";

// These redirects serve links already shared with people, so they are
// permanent (301) and must keep their query strings. See ADR 0001.

// Loader args carry router context this test does not use, so only the
// fields the redirects read are supplied.
function callRedeem(url: string, code: string) {
  return redeemLoader({
    request: new Request(url),
    params: { code },
  } as Parameters<typeof redeemLoader>[0]) as Response;
}

function callLogin(url: string) {
  return loginLoader({
    request: new Request(url),
  } as Parameters<typeof loginLoader>[0]) as Response;
}

function callSignup(url: string) {
  return signupLoader({
    request: new Request(url),
  } as Parameters<typeof signupLoader>[0]) as Response;
}

describe("legacy redirects", () => {
  it("redirects /redeem/:code to /claim/:code with 301", () => {
    const res = callRedeem("http://localhost/redeem/ABC-123", "ABC-123");
    expect(res.status).toBe(301);
    expect(res.headers.get("Location")).toBe("/claim/ABC-123");
  });

  it("keeps the query string when redirecting /redeem/:code", () => {
    const res = callRedeem("http://localhost/redeem/ABC-123?utm=mail&x=1", "ABC-123");
    expect(res.status).toBe(301);
    expect(res.headers.get("Location")).toBe("/claim/ABC-123?utm=mail&x=1");
  });

  it("redirects /login to /sign-in with 301 and keeps the query string", () => {
    const res = callLogin("http://localhost/login?redirectTo=%2Fdashboard");
    expect(res.status).toBe(301);
    expect(res.headers.get("Location")).toBe("/sign-in?redirectTo=%2Fdashboard");
  });

  it("redirects /signup to /sign-up with 301 and keeps the query string", () => {
    const res = callSignup("http://localhost/signup?redirectTo=%2Fcourses");
    expect(res.status).toBe(301);
    expect(res.headers.get("Location")).toBe("/sign-up?redirectTo=%2Fcourses");
  });
});
