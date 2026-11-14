# Identifiers, schema and routes follow the glossary

GLOSSARY.md is the single vocabulary for UI copy, comments and code alike, so we renamed identifiers, database tables and columns, and public routes away from avoided terms (for example `coupons` to `seats`, `redeemedByUserId` to `claimedByUserId`, `/redeem/$code` to `/claim/$code`, `/login` to `/sign-in`). We accepted a schema migration rather than leaving a split between how people talk and how the code is named, because that split is where new code keeps reintroducing the old words.

## Consequences

- `/redeem/*`, `/login` and `/signup` stay as permanent (301) redirects. Seat links already shared with Students point at `/redeem/...` and must keep working. Do not remove these redirects.
- Stored enum values (for example `"admin"`) may keep their old string where only the TypeScript name changes, to avoid a data migration with no reader-facing benefit.
