# Plan: align identifiers, schema and routes with GLOSSARY.md

Read first: `GLOSSARY.md`, `docs/adr/0001-glossary-aligned-identifiers.md`, `CODING_STANDARDS.md`, `.agents/skills/database-migrations/SKILL.md`.

Work phase by phase. After EVERY phase run `npm run typecheck` then `npm run test`, and fix failures before moving on. Do not commit. Use rename-aware edits: when renaming an identifier, update every reference (grep for it first). UI copy and comments were already aligned in a previous pass; only touch copy where a step says so.

## Phase 1: Schema (follow the database-migrations skill)

In `app/db/schema.ts`:
- Table `coupons` -> `seats` (TS export and SQL table name). Columns `redeemedByUserId`/`redeemedAt` -> `claimedByUserId`/`claimedAt` (SQL names too). Keep the `code` column.
- `lessons.content` -> `lessons.body` (SQL name too).
- `teamMembers`/`team_members` -> `teamAdmins`/`team_admins`.
- Enum `TeamMemberRole`: remove `Member`; rename enum to `TeamAdminRole` with `TeamAdmin = "admin"` (stored string unchanged), or drop the role column entirely if every row is admin. Prefer keeping the column, unchanged string.
- `UserRole.Admin` -> `UserRole.PlatformAdmin`; stored value stays `"admin"`.
Then generate the migration (`npm run db:generate`; answer drizzle-kit prompts as RENAME, not create/drop), update `scripts/seed.ts`, run `npm run db:migrate` and `npm run db:seed`.

## Phase 2: Identifier renames

| Old | New |
|---|---|
| generateCoupons, teamCoupons, getCouponsForTeam, CouponRow, allCoupons, couponRows, filteredCoupons | generateSeats, teamSeats, getSeatsForTeam, SeatRow, allSeats, seatRows, filteredSeats |
| redeemedByEmail, alreadyRedeemed, canRedeem, RedeemResult, redeemCoupon, redeemParamsSchema, redeemActionSchema | claimedByEmail, alreadyClaimed, canClaim, ClaimResult, claimSeat, claimParamsSchema, claimActionSchema |
| getCouponByCode | getSeatByCode |
| seatsUnredeemed, SQL alias unredeemed | seatsUnclaimed, unclaimed |
| form intent value "confirm-redeem" | "confirm-claim" |
| getCancellationOffer, loader field cancellation, CancelPurchase | getRefundEligibility, refundEligibility, RequestRefund |
| buildReversalEmail | buildRefundRequestedEmail |
| chargeback (settings.tsx loop var), pendingChargebacks | refund, requestedRefunds |
| learnerName, learnerEmail, learner | studentName, studentEmail, student |
| calculatePppPrice, pppPrice, pppPriceLabel | calculateEffectivePrice, effectivePrice, effectivePriceLabel |
| pppBlocked, pppBlockedCountry; blocked, blockedCountry (ppp.ts return) | countryLocked, countryLockCountry; locked, lockedCountry |
| spendCents, SQL alias spend | amountPaidCents, amountPaid |
| RevenueSummary, RevenuePoint, RevenueSeries, StudentRevenue, CountryRevenueRow, CourseCountryRevenue, getStudentRevenue, getRevenueOverTime, getCourseRevenueByCountry, courseRevenueRows, courseRevenue, attributedRevenue, revenuePerStudentCents, RevenueChart, RevenueByCountry, revenueRows, splitRevenue | same with `GrossRevenue`/`grossRevenue` in place of `Revenue`/`revenue` (e.g. getGrossRevenueOverTime, splitGrossRevenue) |
| revenueCents (StudentRevenue field) | amountPaidCents |
| finishedCount | completedCount |
| stoppedAt | droppedOffAt |
| reachedCount, reachedAt, previousReached | gotAsFarCount, gotAsFarAt, previousGotAsFar |
| contentHtml | bodyHtml |
| CourseContent (component) | Curriculum |
| InstructorModulePreview | InstructorModuleOverview |
| unpublished (analytics loader flag) | hasNoPublishedCourse |
| loginSchema, Login | signInSchema, SignIn |
| isStaff, requireStaff, staffReply | isCourseStaff, requireCourseStaff, courseStaffReply |
| isAdmin, requireInstructorOrAdmin | isPlatformAdmin, requireInstructorOrPlatformAdmin |
| membership (team.tsx) | teamAdmin |

## Phase 3: Routes and redirects

- Rename files: `redeem.$code.tsx` -> `claim.$code.tsx`, `login.tsx` -> `sign-in.tsx`, `signup.tsx` -> `sign-up.tsx`, `api.logout.ts` -> `api.sign-out.ts`. Update `app/routes.ts` paths to `claim/:code`, `sign-in`, `sign-up`, `api/sign-out`.
- Update every link, `redirect()`, `redirectTo=` and fetch/form `action` that points at the old paths, including `CopyButton` in `team.tsx` (`/claim/${code}`).
- Add permanent redirects (must never be removed, see ADR 0001):
  - `redeem/:code` -> 301 to `/claim/:code`, `login` -> 301 to `/sign-in`, `signup` -> 301 to `/sign-up`, each preserving the query string. Implement as small loader-only route files (`legacy.redeem.$code.ts` etc.) using `redirect(url, 301)`.
  - `api/logout` is POSTed to: register it as a second route pointing at `routes/api.sign-out.ts` with a distinct `id`, so it keeps working without a redirect.
- Add a test covering each redirect (status 301 and target, query string kept).

## Phase 4: UI changes

- Team page (`team.tsx`): rename the "Seat link" column header to "Seat". Remove the raw `<code>` cell; each row shows its state (Unclaimed, or Claimed by <email>) plus the existing Copy link button.
- Claim page (`claim.$code.tsx`): remove the "Seat link code: …" line.
- Analytics funnel copy: replace "reached" with "got as far as" and "stopped" with "dropped off", consistent with the glossary term Furthest lesson.
- Casing: page and section headings, buttons and tabs use Title Case; table headers, badges, form labels and body text use sentence case; badges use glossary state names ("Requested", "Unclaimed"). Fix `login`/`signup`/`home.tsx` "Sign In"/"Sign Up" buttons and "Sales Copy" accordingly.

## Phase 5: Standards and final check

- Add to `CODING_STANDARDS.md` a "UI casing" rule matching Phase 4, and a rule: "Identifiers, tables, columns and routes use GLOSSARY.md terms; never an _Avoid_ term."
- Final sweep: `git grep -nIiE 'coupon|redeem|chargeback|learner|enrolment|pppPrice|pppBlock|reached|stoppedAt|\blogin\b|logout'` under `app/` and `scripts/`. Every remaining hit must be a legacy redirect, a migration file, or a false positive. List them in your final report.
- `npm run typecheck`, `npm run test`. Report: files changed per phase, test results, and any decision you had to make that this plan did not cover.
