# Coding standards

## Fail with a thrown response, not a return value

A loader or an action that cannot continue throws. It does not return an
error shape for the component to unpack.

```ts
if (!course) throw data("Course not found", { status: 404 });
```

The route then has one success path. A returned error shape gives every
component a second path to forget about.

## Parse untrusted input with a schema

Form data, search parameters and request bodies get a zod schema before the
values reach any query. Do not read `formData.get("x") as string`. The cast
is a lie the type checker believes.

## Do not write `any`, and do not write `!`

Both switch the type checker off at the exact point you are least sure. If a
value can be missing, narrow it with a check. If you cannot name the type,
the shape is wrong — fix the shape.

## UI casing

Headings, buttons and tabs use Title Case: "Sign In", "Sales Copy" (as a
tab or section heading), "Sign In Required" (an error page title). Table
headers, badges, form labels and body text use sentence case: "Sales copy"
(as a label), "Unclaimed" and "Claimed by …" in a table cell. Badges use the
state names in GLOSSARY.md, such as "Requested" and "Unclaimed".

## Vocabulary

Identifiers, tables, columns and routes use GLOSSARY.md terms. Never use an
_Avoid_ term from GLOSSARY.md in code, a schema or a path. The only exceptions
are the legacy redirects in `app/routes.ts`, which must keep the old paths
(see ADR 0001), and migration files already in `drizzle/`.
