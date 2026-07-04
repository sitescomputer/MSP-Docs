# MSP Docs

MSP Docs is a self-hosted documentation platform for managed service providers. It is designed for one MSP organization per installation, managing many customer environments from a single internal operations console.

The project is in early implementation. The detailed implementation brief lives in [AGENTS.md](./AGENTS.md).

## Current Status

The repository currently includes:

- A Next.js/TypeScript app shell.
- A dark operations-console dashboard UI.
- Demo data for customers, hardware, contracts, internet services, documentation pages, and files.
- Hardware lifecycle and documentation completeness calculation utilities.
- Focused tests for lifecycle and completeness rules.
- A Prisma schema for the planned PostgreSQL data model.
- Docker Compose and Windows Server deployment notes.

Real authentication, database-backed CRUD, file uploads, and rich text editing are planned next steps.

## Local Development

Install dependencies:

```powershell
npm.cmd install
```

Generate the Prisma client:

```powershell
npm.cmd run prisma:generate
```

Start the development server:

```powershell
npm.cmd run dev
```

Open:

```text
http://localhost:3000
```

Run verification:

```powershell
npm.cmd run lint
npm.cmd test
npm.cmd run build
```

## Goals

- Track customer documentation in one place.
- Track hardware assets, installation dates, warranties, and recommended replacement dates.
- Show upcoming and overdue hardware replacements on a dashboard.
- Track internet services, service contracts, vendors, contacts, locations, software licenses, files, and network documentation.
- Show documentation gaps and completion percentages by customer.
- Provide rich text documentation pages for procedures, notes, and flexible customer knowledge.
- Store PDFs, images, spreadsheets, diagrams, contracts, and warranty documents with folder organization and versioning.
- Support in-app PDF and image previews.
- Provide role-based access with customer-specific permissions.
- Be easy to self-host and open-source friendly from the start.

## Non-Goals

- MSP Docs is not a password manager.
- It must not store passwords, API secrets, private keys, recovery codes, MFA backup codes, VPN shared secrets, or Wi-Fi passwords.
- It is not intended to replace LastPass or another password vault.
- Ticketing is not part of the core product.
- RMM functionality is not part of the core product.

## Core Features Planned For The MVP

- Simple email/password authentication.
- User roles: Admin, Technician, Viewer, and Account Manager.
- Customer-scoped user permissions.
- Customer, location, contact, hardware, internet service, and service contract management.
- Hardware lifecycle tracking with editable replacement intervals.
- Dashboard alerts for overdue and due-soon hardware, warranties, and contracts.
- Editable default due-soon window, initially 90 days.
- Dismissible or snoozable dashboard alerts.
- Documentation completeness and gap tracking.
- Rich text documentation pages.
- File uploads with folders, versioning, customer/entity association, and authenticated downloads.
- In-app previews for PDFs and images.
- Local disk file storage for the first version.
- Global or customer-scoped search.
- Docker-based self-hosting documentation with Windows Server as the first production target.

## Architecture Direction

The preferred architecture is a conventional full-stack monolith:

```text
Browser
  |
Next.js application
  |-- Server-rendered UI
  |-- Server actions or API routes
  |-- Authentication and sessions
  |-- Server-side authorization checks
  |-- File upload, preview, and download handling
  |
PostgreSQL
  |
Local uploads volume
```

Recommended stack:

- Next.js
- TypeScript
- PostgreSQL
- Prisma
- Tailwind CSS
- shadcn/ui or Radix-based components
- Auth.js / NextAuth or a simple credentials-based auth layer
- Docker Compose
- Vitest
- Playwright

PostgreSQL stores structured records and file metadata. Uploaded files should be stored on local disk through a Docker volume or configured server path. S3-compatible storage may be added later, but it is not part of the MVP.

## Why PostgreSQL

The platform is centered on relational business data:

- Customers have locations.
- Locations have hardware, internet services, and network records.
- Hardware has lifecycle dates, warranties, vendors, files, and contracts.
- Contracts and warranties need date-based reporting.
- Files attach to customers and other records.
- Users need role-based and customer-scoped permissions.

PostgreSQL is the best default for these relationships, reporting needs, migrations, and data integrity. Flexible custom fields can be added later with PostgreSQL `JSONB` where useful.

## File Storage

Files are not intended to be stored directly in PostgreSQL. The database should store metadata such as:

- File ID
- Customer ID
- Related record
- Original filename
- Stored filename/path
- MIME type
- File size
- Version
- Upload date
- Uploader
- Category, folder, tags, and audit metadata

The actual PDFs, images, spreadsheets, diagrams, and contracts should be stored on disk behind authenticated application access.

The initial upload size limit should be 25 MB, similar to a standard email attachment limit.

## Security Principles

- Authentication is required for all access.
- Authorization must be enforced server-side.
- Uploaded files must not be served directly from a public static folder.
- Important actions should be audited, including create, update, delete, upload, and download.
- HTTPS should be used in production.
- MFA is not required for the MVP, but should be planned as a future enhancement.
- Wi-Fi SSIDs may be documented; Wi-Fi passwords must not be stored.

## UX Direction

The interface should feel like a professional internal operations console:

- Dark-first UI.
- Persistent left navigation.
- Customer-first organization.
- Dense table/list views rather than card-heavy layouts.
- Search, filters, bulk actions, export, and column controls above major tables.
- Compact status pills for active, due soon, overdue, expired, retired, and archived states.
- Clear customer dashboards with replacement alerts, contract alerts, and documentation completion.
- Configurable branding/logo for other MSPs.

The visual direction is inspired by operational tools such as Hudu, IT Glue, and Level.io RMM, without copying any product branding.

## Deployment Target

The first production target is Windows Server using Docker where possible.

The intended self-hosted shape is:

```text
docker-compose.yml
  |
  |-- app container
  |-- postgres container
  |-- uploads volume
```

The app should run behind a reverse proxy such as Caddy, Nginx, Traefik, or an existing firewall/reverse proxy appliance.

## Open Source

This project should be open-source ready out of the box.

Planned open-source defaults:

- MIT license.
- Placeholder app name until a final name is chosen.
- Configurable branding/logo.
- `.env.example`.
- Docker Compose setup.
- Seed/demo data.
- Setup, backup, restore, and Windows Server deployment documentation.

## Roadmap

Initial build order:

1. Authentication and app shell.
2. Customer CRUD.
3. Locations and contacts.
4. Hardware assets with replacement-date logic.
5. Dashboard alerts for overdue and due-soon hardware.
6. Internet services.
7. Service contracts.
8. Documentation completeness/gap tracking.
9. Rich text documentation pages.
10. File uploads, authenticated downloads, previews, folders, and versioning.
11. Dismissible/snoozable dashboard alerts.
12. Search and filtering.
13. Docker and Windows Server deployment documentation.

Future enhancements may include email alerts, advanced reporting, SSO, MFA, custom fields, customer portal access, diagram tooling, warranty lookup integrations, and S3-compatible file storage.
