# Documentation Platform Project Brief

## Product Goal

Build a self-hosted IT MSP customer documentation platform for tracking customer environments, hardware lifecycles, internet services, service contracts, files, and operational notes. The product should feel intuitive and fast to navigate, taking inspiration from documentation tools such as Hudu and IT Glue while remaining focused on the needs of this MSP.

The platform must not store passwords or secrets. Passwords are managed separately in LastPass.

## Target Users

- MSP technicians documenting and servicing customer environments.
- Account managers reviewing contracts, service renewals, and replacement timelines.
- Administrators managing customers, users, permissions, and platform settings.

## Core Product Principles

- Self-hostable on the user's own server.
- Open-source friendly out of the box.
- Assume one MSP organization per installation, managing many customer/client records.
- Easy to navigate with customer-first organization.
- Dashboard-first visibility into urgent lifecycle issues.
- Structured enough for reporting, but flexible enough for real MSP documentation.
- No password vault functionality.
- Avoid storing sensitive secrets such as passwords, API keys, private keys, recovery codes, or MFA backup codes.
- Make replacement planning obvious and actionable.

## Primary Entities

### Customers

Each customer should have a central profile page that acts as the hub for all documentation.

Suggested fields:

- Customer name
- Legal name
- Customer folder/category, such as managed, unmanaged, prospect, archived, or other configurable groups
- Primary contact
- Billing contact
- Technical contact
- Main phone number
- Main email
- Website
- Physical addresses
- Notes
- Status: active, onboarding, inactive, archived
- Assigned account manager
- Assigned primary technician
- Tags

Customer pages should link clearly to:

- Documentation pages
- Hardware
- Locations
- Internet services
- Service contracts
- Files
- Contacts
- Network documentation
- Vendors
- Licenses
- Notes
- Activity history

### Locations

Customers may have one or more physical locations.

Suggested fields:

- Location name
- Address
- Phone number
- Time zone
- Site contact
- Notes
- Associated hardware
- Associated internet services

### Hardware Assets

Hardware tracking is a core feature. Assets must include installation dates and recommended replacement dates.

Suggested fields:

- Customer
- Location
- Asset name
- Asset type
- Manufacturer
- Model
- Serial number
- Asset tag
- Status: active, spare, retired, missing, warranty repair
- Installed date
- Purchase date
- Warranty expiration date
- Recommended replacement date
- Replacement interval in months
- Vendor
- Support contract
- Notes
- Attachments

Common asset types:

- Server
- Workstation
- Laptop
- Firewall
- Switch
- Access point
- UPS
- NAS / storage
- Printer
- VoIP phone
- Camera / NVR
- Other

Default replacement interval examples:

- UPS: 36 months
- Firewall: 60 months
- Switch: 60 months
- Access point: 48 months
- Server: 60 months
- Workstation: 48 months
- Laptop: 36 months
- Printer: 60 months

The platform should calculate recommended replacement dates from installed date plus replacement interval, while still allowing manual override when needed.

### Internet Services

Track customer internet, WAN, and telecom services.

Suggested fields:

- Customer
- Location
- Provider
- Service type: fiber, cable, DSL, fixed wireless, LTE/5G, MPLS, SIP, phone, other
- Circuit ID
- Account number
- Public static IPs
- Speed
- Monthly cost
- Contract start date
- Contract end date
- Renewal notice date
- Support phone
- Support portal URL
- Notes
- Attachments

Do not store provider portal passwords.

### Service Contracts

Track MSP agreements and third-party service contracts.

Suggested fields:

- Customer
- Contract name
- Vendor or provider
- Contract type
- Start date
- End date
- Renewal date
- Cancellation notice deadline
- Monthly or annual cost
- Status: active, expiring soon, expired, cancelled
- Internal owner
- Notes
- Attachments

Contract pages should make upcoming renewals and cancellation windows easy to see.

### Files And Attachments

The system should support customer-specific file storage in an intuitive structure.

Suggested organization:

- Folder-like hierarchy where useful, such as Customers > Managed > Customer Name > category/subfolder
- Customer files
- Location files
- Hardware attachments
- Internet service attachments
- Contract attachments
- General documentation files

Supported file examples:

- PDFs
- Images
- Word documents
- Excel spreadsheets
- Network diagrams
- Quotes
- Invoices
- Signed agreements
- Warranty documents

Implementation expectations:

- Files should be associated with a customer and optionally a specific entity.
- Files should have metadata such as title, description, uploader, upload date, category, and tags.
- Files should support folder-like organization in addition to tags/categories.
- Files should support versioning so updated files can retain historical versions.
- PDFs and images should be previewable in the app.
- Maximum upload size should be similar to a standard email attachment limit. Use 25 MB as the initial default unless changed later.
- Provide search and filtering.
- Do not allow files to become an unstructured dumping ground without customer/entity context.

### Documentation Pages

The platform should include rich text documentation pages, similar to knowledge base or flexible documentation articles.

Suggested features:

- Customer association
- Optional location association
- Title
- Rich text body
- Folder/category placement
- Tags
- Attachments
- Version history or edit history if practical
- Created by
- Last updated by
- Last updated date

Documentation pages should be useful for procedures, environment notes, onboarding notes, vendor instructions, escalation instructions, and other information that does not fit neatly into structured records.

### Contacts

Suggested fields:

- Customer
- Name
- Role/title
- Email
- Phone
- Mobile
- Department
- Location
- Notes
- Contact type: primary, billing, technical, escalation, vendor

### Vendors

Track vendors relevant to each customer.

Suggested fields:

- Vendor name
- Customer
- Service category
- Account number
- Support phone
- Support email
- Support portal URL
- Notes

Do not store vendor portal passwords.

### Network Documentation

Include structured network documentation without storing secrets.

Suggested fields:

- Customer
- Location
- Network name
- VLAN ID
- Subnet/CIDR
- Gateway
- DHCP range
- DNS servers
- IP address inventory
- Subnet inventory
- VLAN inventory
- Static IP assignments
- Network diagram attachments
- WAN/LAN notes
- Firewall/router references
- Switch references
- Wireless network names/SSIDs where useful
- Notes
- Related hardware

Do not store Wi-Fi passwords, VPN shared secrets, private keys, or administrative credentials. Wi-Fi SSIDs should be stored where useful, but associated passwords must not be stored.

### Software And Licenses

Track software subscriptions and license renewals where useful.

Suggested fields:

- Customer
- Product name
- Vendor
- License count
- Renewal date
- Cost
- Admin portal URL
- Notes
- Attachments

Do not store license portal passwords.

## Dashboard Requirements

The main dashboard should provide a high-level overview across all customers.

Required dashboard sections:

- Customers count
- Hardware due for replacement
- Hardware replacement overdue
- Upcoming hardware replacements
- Warranties expiring soon
- Service contracts expiring soon
- Internet service contracts expiring soon
- Documentation completeness/gaps
- Recently updated customers
- Recently uploaded files
- Open documentation gaps

Urgency logic examples:

- Overdue replacement: recommended replacement date before today.
- Replacement due soon: recommended replacement date within the next 90 days.
- Contract expiring soon: end date within the next 90 days.
- Warranty expiring soon: warranty expiration within the next 90 days.

Dashboard items should link directly to the related customer and record.

Documentation completeness should show how much of the expected customer documentation has been filled out. For example, customers should have visible completion percentages for major categories such as contacts, locations, hardware, internet services, contracts, network documentation, files, and documentation pages.

The default "due soon" window should be 90 days for hardware, warranties, and contracts, but this must be editable in settings.

Urgent dashboard items should be dismissible or snoozable. Snoozing should not delete or resolve the underlying issue; it should only suppress or defer the dashboard alert for the selected user or configured scope.

Email alerts are not part of the MVP. The first version should use dashboard alerts only.

## Customer Overview Page

Each customer should have a clear overview page with:

- Key customer details
- Urgent alerts for that customer
- Hardware lifecycle summary
- Contract summary
- Internet services summary
- Important contacts
- Recent files
- Recent activity
- Quick links to major documentation sections

## Navigation Requirements

The application should be organized around customers first.

Recommended navigation:

- Dashboard
- Customers
- Hardware
- Contracts
- Internet Services
- Files
- Documentation
- Reports
- Admin / Settings

Within a customer, use clear section tabs or side navigation:

- Overview
- Documentation
- Contacts
- Locations
- Hardware
- Internet
- Contracts
- Network
- Software
- Files
- Notes
- Activity

## Search And Filtering

Search should be available globally and within customers.

Search should cover:

- Customers
- Hardware names, serial numbers, models, asset tags
- Contracts
- Internet services
- Contacts
- Files and file metadata
- Notes

Useful filters:

- Customer
- Location
- Asset type
- Status
- Replacement due date
- Warranty expiration
- Contract expiration
- Vendor
- Tags

## Reporting Requirements

Initial useful reports:

- Hardware due for replacement by customer
- Hardware due for replacement by date range
- Expired or soon-expiring warranties
- Expiring service contracts
- Internet services by provider
- Customer asset inventory
- Files uploaded by customer

Reports should support export to CSV at minimum.

## Security Requirements

- No password storage.
- No secret storage.
- Authentication required for all app access.
- First version should use simple email/password login.
- Role-based access control is required.
- Users should be restrictable to specific customers depending on role and assignment.
- Audit important actions such as create, update, delete, upload, and download.
- Store uploaded files outside the public web root or behind authenticated access checks.
- Validate uploads by size and type.
- Use HTTPS in production.
- Support backups of database and uploaded files.
- MFA is not required for the first version, but should be planned as a future enhancement.
- Do not add LastPass item link/reference fields in the MVP.

Suggested roles:

- Admin: full access and settings.
- Technician: manage customer documentation.
- Viewer: read-only access.
- Account Manager: customer, contract, and service visibility.

Permission expectations:

- Admins can manage all customers, users, roles, settings, and records.
- Technicians can be granted access to all customers or selected customers.
- Viewers should be read-only and may be limited to selected customers.
- Account Managers may be limited to selected customers and should have strong visibility into contracts, services, replacement timelines, and customer overview data.
- Authorization checks must be enforced server-side, not only in the UI.

## Self-Hosting Requirements

The platform should be deployable on the user's own server.

Preferred deployment characteristics:

- Docker-based deployment if practical.
- Single app service plus database service.
- Persistent volume for uploaded files.
- Uploaded files should use local disk storage only for the first version.
- Environment variables for configuration.
- Documented backup and restore process.
- Runs behind a reverse proxy such as Nginx, Caddy, Traefik, or a firewall/reverse proxy appliance.
- Initial production target is Windows Server.

Configuration should include:

- App URL
- Database connection string
- File storage path
- Max upload size
- Session secret
- Email/SMTP settings if notifications are implemented

## Suggested Technical Direction

This repo is currently at project-planning stage. Future agents should inspect the repository before assuming a stack.

Recommended stack:

- Full-stack TypeScript application using Next.js.
- PostgreSQL for the primary database.
- Prisma for schema management, migrations, and database access.
- Tailwind CSS with shadcn/ui or Radix-based components for the interface.
- Auth.js / NextAuth or a simple credentials-based authentication layer.
- Local filesystem storage for uploaded files by default.
- Optional S3-compatible storage later for MinIO, Backblaze B2, Wasabi, AWS S3, or NAS-backed object storage.
- Docker Compose for self-hosted deployment.
- Vitest for unit tests.
- Playwright for important UI and workflow tests.

Alternative stack options if there is a strong reason to avoid Next.js:

- Python Django app using PostgreSQL.
- Laravel app using PostgreSQL or MySQL.

Choose a stack that supports:

- Strong CRUD workflows
- Authentication and authorization
- File uploads
- Database migrations
- Server-side rendering or fast app navigation
- Easy Docker deployment

For this project, prioritize maintainability and self-hosting simplicity over novelty.

## Architecture Recommendation

Use a conventional self-hosted monolithic web application.

Recommended high-level architecture:

```text
Browser
  |
Next.js application
  |-- Server-rendered pages and app UI
  |-- Server actions or API routes
  |-- Authentication and session handling
  |-- Authorization checks
  |-- File upload and download handling
  |
PostgreSQL database
  |
Local uploads volume or S3-compatible object storage
```

Recommended self-hosted deployment:

```text
docker-compose.yml
  |
  |-- app container
  |-- postgres container
  |-- uploads volume
```

The app should run behind a reverse proxy such as Caddy, Nginx, Traefik, or an existing firewall/reverse proxy appliance.

Avoid microservices for the initial product. This project is primarily CRUD workflows, file uploads, lifecycle calculations, dashboard reporting, search, and permissions. A clean monolith will be easier to build, easier to maintain, and easier for other MSPs to self-host.

The first supported deployment target should be Windows Server. Docker Compose remains preferred if Windows Server can support it cleanly, but the documentation should account for a Windows Server operator.

## Database Recommendation

Use PostgreSQL rather than MongoDB for the main application database.

Reasons PostgreSQL is the better default:

- The data is highly relational: customers, locations, hardware, contracts, internet services, files, contacts, vendors, and users all relate to each other.
- Dashboard queries need reliable date filtering and aggregation.
- Reports need joins and filtering across customers, assets, contracts, and services.
- Foreign keys help preserve data integrity.
- Database migrations are straightforward with Prisma.
- PostgreSQL is mature, widely supported, and easy to self-host.

MongoDB is not recommended as the primary database for this project. It can work, but it is better suited to mostly document-shaped data with unpredictable schemas. This platform has structured business data with clear relationships.

Use PostgreSQL `JSONB` columns selectively when flexible custom fields are useful. For example, hardware assets may eventually support customer-specific custom fields without abandoning the relational data model.

Example:

```text
hardware_assets
  id
  customer_id
  asset_type_id
  serial_number
  installed_date
  replacement_interval_months
  recommended_replacement_date
  custom_fields JSONB
```

## File Storage Architecture

Do not store PDFs, images, spreadsheets, or other uploaded files directly in PostgreSQL by default.

Store file metadata in PostgreSQL and store the actual file bytes in local filesystem storage or S3-compatible object storage.

PostgreSQL should store:

- File ID
- Customer ID
- Optional related entity type and ID
- Original filename
- Stored filename or storage key
- MIME type
- File size
- Upload date
- Uploaded by user
- File category
- Description
- Tags
- Access/audit metadata

File storage should store:

- PDFs
- Images
- Word documents
- Excel spreadsheets
- Network diagrams
- Quotes
- Invoices
- Signed agreements
- Warranty documents

Example local storage layout:

```text
uploads/
  customers/
    customer-id/
      file-id-original-name.pdf
      file-id-network-diagram.png
```

Uploaded files must not be served directly from a public static directory. Downloads should go through the application so permissions and audit logging can be enforced.

The first version should support local filesystem storage through a persistent Docker volume. Later versions may add optional S3-compatible storage.

Do not include S3-compatible storage in the MVP. Disk-backed storage through a Docker volume or configured local path is sufficient for the first version.

## Suggested Project Structure

If using Next.js, a reasonable project structure is:

```text
src/
  app/
    dashboard/
    customers/
    hardware/
    contracts/
    internet-services/
    files/
    reports/
    admin/
  components/
    ui/
    layout/
    customers/
    hardware/
    contracts/
    files/
  lib/
    auth.ts
    db.ts
    permissions.ts
    lifecycle.ts
    files.ts
  server/
    actions/
    queries/
prisma/
  schema.prisma
```

Keep lifecycle calculations and permission logic out of UI components. For example, hardware replacement status should live in a reusable module such as `src/lib/lifecycle.ts` and have focused tests.

## Open Source Readiness

The project is for internal use first, but must be open-source ready out of the box so other MSPs can self-host their own instances.

The application should assume one MSP organization per installation, managing many customers. Do not build hosted SaaS-style multi-tenancy unless explicitly requested later.

Use a placeholder application name until a final name is chosen.

Open-source readiness requirements:

- Use the MIT license.
- Provide `.env.example`.
- Provide `docker-compose.yml`.
- Provide seed/demo data.
- Provide clear installation documentation.
- Provide backup and restore documentation.
- Avoid hardcoded company-specific assumptions.
- Make app name and branding configurable where practical.
- Support configurable branding/logo for other MSPs.
- Use database migrations for all schema changes.
- Keep setup simple for a technical MSP admin.
- Include Windows Server-oriented deployment notes.

License guidance:

- MIT maximizes adoption and allows broad commercial use.
- Use MIT for this project unless the user explicitly changes the licensing decision later.

## Development Priorities

Build order should favor useful internal value quickly:

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
13. Docker/Windows Server deployment documentation.

Use tests for:

- Hardware replacement date calculations.
- Due soon and overdue lifecycle status.
- Contract expiration logic.
- Permission checks.
- File upload/download access checks.
- Dashboard urgency queries.
- Customer-scoped access restrictions.
- Documentation completeness calculations.

## Data Model Notes

Core tables or models will likely include:

- users
- roles
- customers
- customer_contacts
- locations
- hardware_assets
- hardware_asset_types
- internet_services
- service_contracts
- vendors
- network_records
- software_licenses
- files
- file_versions
- folders
- documentation_pages
- documentation_page_versions
- notes
- tags
- activity_events
- customer_user_access
- documentation_requirements
- documentation_completion_items

Most records should belong to a customer. Many records may optionally belong to a location.

Files should support polymorphic attachment or a clear association table so they can attach to customers, hardware, contracts, internet services, and other records.

Folders should be supported where useful, especially for customer organization and file/documentation browsing. Example hierarchy: Customers > Managed > Customer Name > Files or Documentation.

## Lifecycle Rules

Hardware replacement dates should be computed from:

- installed_date
- replacement_interval_months
- optional manually overridden recommended_replacement_date

If a user selects an asset type with a default replacement interval, the form should prefill that interval but allow editing.

Replacement intervals must be editable. Users should be able to override replacement intervals per asset type and per individual asset.

Status categories:

- Healthy: no urgent lifecycle issue.
- Due soon: replacement date within 90 days.
- Overdue: replacement date is in the past.
- Unknown: missing installed date or replacement interval.
- Retired: removed from active views by default.

Retired hardware should be hidden from normal active asset lists by default, but users should be able to view retired assets in history and restore them if needed.

## Notification Ideas

Notifications are not required for the first version, but the design should allow them later.

Possible future notifications:

- Hardware replacement due soon
- Warranty expiring soon
- Contract expiring soon
- Internet service renewal deadline approaching
- Missing critical documentation fields
- MFA enrollment and recovery flows

## UX Expectations

- The first screen after login should be the dashboard.
- Customer pages should be fast to scan.
- Important dates should use clear visual states.
- Forms should be structured and not overwhelming.
- Tables should support sort and filter.
- Empty states should explain what can be added next.
- Avoid hiding critical information behind too many clicks.
- Use consistent terminology throughout the app.

## Visual And Interaction Direction

The user provided screenshots from Level.io RMM as a strong aesthetic and usability reference. The documentation platform should closely resemble the operational feel, layout density, and navigation clarity shown in those screenshots, without copying Level branding.

Preferred visual style:

- Dark-first interface.
- Deep navy/charcoal app background.
- Slightly lighter dark sidebars and table surfaces.
- Subtle borders between panels, rows, and columns.
- High-contrast white or near-white primary text.
- Muted gray secondary text.
- Bright blue primary action buttons.
- Compact spacing suitable for daily operational use.
- Rounded corners should be restrained, generally 6px to 8px.
- Avoid marketing-style gradients, oversized hero areas, decorative cards, and empty visual flourishes.

Layout direction:

- Persistent left sidebar for primary navigation.
- Secondary sidebar or scoped navigation when useful, especially for customer groups, customer sections, or filtered record sets.
- Main content area should be table/list driven for operational records.
- Top page header should clearly show the current section, such as Customers, Hardware, Alerts, Contracts, or Files.
- Primary action button should sit in the top-right area when appropriate.
- Search, bulk actions, export, filters, and column controls should sit above major tables.
- Tables should use stable row heights, clear column headers, sortable columns, and direct row actions.
- Keep action icons aligned at the far right of table rows.

Navigation inspiration from the screenshots:

- Left sidebar entries should use icons plus labels.
- Active navigation items should have a darker highlighted background and blue accent.
- Count badges should be used for urgent or notable items such as replacements due, expiring contracts, documentation gaps, or unread alerts.
- The signed-in user/account area should be anchored near the bottom of the sidebar.
- Secondary/help links such as Documentation, Support, Status, or Changelog may live near the lower sidebar if implemented.

Table and list behavior:

- Dense tables are preferred over card-heavy layouts for assets, contracts, files, internet services, and alerts.
- Table rows should support selection checkboxes for bulk actions where useful.
- Rows should show compact metadata under primary names when helpful.
- Tags should be displayed as compact pills.
- Status should be displayed as compact colored pills.
- Use icons for quick recognition of record types and actions.
- Provide column visibility controls for larger data sets.
- Provide CSV export on major list/report screens.

Status and urgency styling:

- Healthy/online/active states should use green pills.
- Warning/due soon states should use amber/yellow pills.
- Critical/overdue/expired states should use red pills.
- Offline/inactive/archived states should use gray pills.
- Lifecycle urgency should be visually obvious in tables and dashboards.

Documentation-platform adaptations:

- Replace RMM device groups with customer/customer group navigation where useful.
- Replace device rows with customer, hardware, contract, internet service, or file rows depending on the screen.
- Use the same kind of quick filtering for:
  - All customers
  - Favorites
  - Recently updated
  - Hardware due soon
  - Hardware overdue
  - Contracts expiring soon
  - Missing documentation
- Customer pages should keep this same operational layout, with tabs or a secondary sidebar for Overview, Documentation, Contacts, Locations, Hardware, Internet, Contracts, Network, Software, Files, Notes, and Activity.

The UI should feel like a professional internal operations console: calm, fast, scannable, and optimized for repeated daily use by technicians and account managers.

## What Not To Build

- Do not build a password manager.
- Do not store passwords, shared secrets, recovery codes, private keys, or MFA backup codes.
- Do not build remote monitoring and management features unless explicitly requested later.
- Do not build ticketing as a core feature unless explicitly requested later.
- Do not assume this replaces LastPass.

## MVP Scope

The first useful version should include:

- Authentication
- Simple email/password login
- Customer CRUD
- Location CRUD
- Hardware CRUD with replacement dates
- Editable replacement intervals
- Internet service CRUD
- Service contract CRUD
- Documentation gap/completeness tracking
- Rich text documentation pages
- File upload, preview, versioning, folders, and customer/entity association
- Dashboard with urgent replacement and contract alerts
- Global search or at least customer-scoped search
- Basic roles
- Customer-scoped user permissions
- Docker/self-hosting documentation with Windows Server as the initial production target

## Future Enhancements

- Email alerts
- CSV import/export
- Advanced reporting
- Advanced documentation completeness scoring and custom requirement templates
- API access
- SSO
- MFA
- Custom fields
- Customer portal
- Diagram support
- Warranty lookup integrations
- S3-compatible file storage

## Agent Working Notes

- Always inspect the current repository before making assumptions.
- Preserve the product requirement that passwords and secrets must not be stored.
- Keep implementation choices aligned with self-hosting and maintainability.
- Prefer explicit database schema and migrations over loosely structured storage for core entities.
- Add tests around lifecycle calculations, dashboard urgency logic, permissions, and file access.
- When building UI, prioritize dense but readable operational workflows over marketing-style pages.
- Any generated documentation should include setup, deployment, backup, and restore instructions.
