# Windows Server Deployment Notes

The first production target for MSP Docs is Windows Server with Docker where possible.

## Target Shape

```text
Windows Server
  |
Docker
  |-- app container
  |-- postgres container
  |-- uploads volume
  |
Reverse proxy / firewall publishing HTTPS
```

## Initial Setup

1. Install Docker on the Windows Server host.
2. Clone the repository.
3. Copy `.env.example` to `.env`.
4. Replace `AUTH_SECRET` with a long random value.
5. Review `DATABASE_URL`, `APP_URL`, `UPLOAD_DIR`, `MAX_UPLOAD_BYTES`, and `DUE_SOON_DAYS`.
6. Start the stack with Docker Compose.

## File Storage

The MVP uses local disk storage only. Uploaded files should live in a persistent Docker volume or a configured local server path.

Do not publish the uploads directory directly through IIS, Nginx, Caddy, or another static file server. Files must be served through the application so access checks and audit logging can run.

## Backup Requirements

Back up both:

- PostgreSQL database.
- Uploaded file storage volume/path.

Both are required for a complete restore.

