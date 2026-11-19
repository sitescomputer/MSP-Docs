# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

`AGENTS.md` is the authoritative product brief (entities, roles, dashboard urgency rules, visual direction, MVP scope, build order). Read the relevant section before building a feature.

## Commands

```bash
npm install
npm run prisma:generate      # required before build/typecheck (Prisma client)
npm run dev                  # http://localhost:3000
npm run lint
npm test                     # vitest run (src/**/*.test.ts, node env, globals on)
npx vitest run src/lib/lifecycle.test.ts        # single file
npx vitest run -t "overdue"                     # single test by name
npm run build                # Next standalone output (used by Dockerfile)
npm run prisma:migrate       # needs DATABASE_URL (see .env.example)
npm run prisma:seed
```

The README uses `npm.cmd` because the primary dev/production target is Windows Server; `npm` is equivalent elsewhere.

## Current state of the code

This is an early prototype. Keep the gap between the plan and the code in mind:

- `prisma/schema.prisma` defines the full planned data model (~21 models), but **no app code reads from the database yet** and there are no migrations committed. NextAuth and the Prisma adapter are installed but not wired up.
- The entire UI is one client component, `src/app/page.tsx`. It switches between views (`AppView`) and customer filters (`CustomerScope`) using local state, and the sidebar lives in `src/components/app-shell.tsx`. There are no per-section routes yet.
- All displayed data comes from `src/lib/demo-data.ts`. It defines its own TypeScript record types (not the Prisma types) and computes derived fields such as lifecycle status and completeness when the module loads.
- Styling is hand-written CSS in `src/app/globals.css` (Tailwind/shadcn are recommended in AGENTS.md but not installed). Status colours go through `StatusPill`.

When adding real features, move toward the structure suggested in AGENTS.md: routes under `src/app/<section>/`, data access in `src/server/queries` and `src/server/actions`, and auth and permission logic in `src/lib/`.

## Domain logic

Business rules live in pure modules under `src/lib/`, kept out of the UI, and are covered by tests:

- `lifecycle.ts`: the replacement date is the manual override if set, otherwise installed date + interval months (clamped to the end of the month). Status is `retired` > `unknown` (no date) > `overdue` (before today) > `due-soon` (within `dueSoonDays`, default 90) > `healthy`. Dates are `YYYY-MM-DD` strings parsed as local midnight. Pass `today` in tests.
- `completeness.ts`: the completion percent is the sum of min(completed, required) divided by the sum of required, and is 100 when nothing is required.

New urgency or permission rules (contracts, warranties, customer-scoped access) should follow the same pattern: a pure function in `src/lib` plus a Vitest file next to it.

## Hard constraints

- Never add fields or features that store passwords, shared secrets, Wi-Fi/VPN keys, private keys, API keys, recovery or MFA codes. Wi-Fi SSIDs are fine. Do not add LastPass reference fields in the MVP.
- One MSP organization per install. Don't add SaaS multi-tenancy.
- Authorization must be enforced on the server and scoped per customer (`CustomerUserAccess`), not only in the UI.
- Uploaded files go to local disk (`FILE_STORAGE_PATH`, `/app/uploads` volume in Docker), are never served from `public/`, and are downloaded through authenticated, audited routes. The default max upload size is 25 MB. No S3 in the MVP.
- No email alerts in the MVP. Alerts appear only on the dashboard and can be snoozed or dismissed without resolving the underlying issue.
- UI direction: dark, dense, table-first operations console (Level.io-like), with green, amber, red and grey status pills and 6–8px corner radii.
- Every schema change goes through a Prisma migration. Keep app name and branding configurable (no hardcoded company specifics). MIT license.

## Deployment

The app is built with `next build` in standalone mode and shipped through the `Dockerfile`. `docker-compose.yml` runs one app service, PostgreSQL and an uploads volume. Windows Server operator notes are in `docs/windows-server.md`. Any new deployment docs must cover setup, backup and restore.
