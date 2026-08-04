# SmartMart Motors

Premium enterprise web platform for **SmartMart Motors** — genuine vehicle spare parts imported from China and supplied across Sri Lanka.

Built with Next.js 15, React 19, TypeScript, Tailwind CSS, Prisma, Supabase PostgreSQL, NextAuth, Cloudinary, and Framer Motion.

## Features

- Dark glassmorphism public storefront (Home, Products, Categories, About, Contact, FAQ, legal)
- Role-based admin dashboard (products, categories, brands, media, messages, content, SEO, analytics, users, logs)
- Prisma + PostgreSQL schema with Supabase SQL/RLS migrations
- NextAuth credentials auth (JWT), protected `/admin` routes, security headers
- Cloudinary image uploads, SEO (sitemap, robots, JSON-LD helpers), GA4/GTM/Clarity hooks
- Contact form with rate limiting, WhatsApp CTA (`0775475141`)

## Stack

| Layer      | Technology                                                             |
| ---------- | ---------------------------------------------------------------------- |
| Frontend   | Next.js 15 App Router, React 19, Tailwind, Framer Motion, shadcn/Radix |
| Auth       | NextAuth v5 (Auth.js), bcrypt                                          |
| ORM / DB   | Prisma 6, PostgreSQL (Supabase)                                        |
| Media      | Cloudinary                                                             |
| Validation | Zod, React Hook Form                                                   |
| Data       | TanStack Query (client), Server Components / Server Actions            |
| Deploy     | Vercel + GitHub Actions                                                |

## Quick start

### 1. Install

```bash
npm install
cp .env.example .env.local
```

### 2. Configure `.env.local`

Minimum for local development:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/postgres"
AUTH_SECRET="generate-with-openssl-rand-base64-32"
AUTH_URL="http://localhost:3000"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Optional: Supabase keys, Cloudinary, analytics IDs (see `.env.example`).

### 3. Database

```bash
npm run db:push
npm run db:seed
```

Or apply the SQL migration in `supabase/migrations/001_initial_schema.sql` inside the Supabase SQL editor, then seed.

### 4. Run

```bash
npm run dev
```

- Storefront: [http://localhost:3000](http://localhost:3000)
- Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

**Seed admin**

| Field    | Value                       |
| -------- | --------------------------- |
| Email    | `admin@smartmartmotors.com` |
| Password | `Admin@123456`              |

Change this password immediately in production.

## Scripts

| Command              | Description                        |
| -------------------- | ---------------------------------- |
| `npm run dev`        | Dev server (Turbopack)             |
| `npm run build`      | Prisma generate + production build |
| `npm run start`      | Start production server            |
| `npm run lint`       | ESLint                             |
| `npm run typecheck`  | TypeScript check                   |
| `npm run format`     | Prettier                           |
| `npm run db:push`    | Push Prisma schema                 |
| `npm run db:migrate` | Create/apply migrations            |
| `npm run db:seed`    | Seed catalogue + admin             |
| `npm run db:studio`  | Prisma Studio                      |

## Project structure

```
src/
  app/
    (site)/          # Public pages
    admin/           # Admin login + dashboard
    api/             # Auth, contact, catalogue, upload, analytics
  components/        # UI, layout, home, products, admin
  lib/               # auth, prisma, supabase, cloudinary, data, actions
  middleware.ts      # Admin protection + security headers
prisma/
  schema.prisma
  seed.ts
supabase/migrations/
```

## Company

- **Phone:** 0775475141
- **Email:** smartmartmotors@gmail.com
- **WhatsApp:** [wa.me/94775475141](https://wa.me/94775475141)

## Deployment (Vercel)

1. Push to GitHub.
2. Import the repo in Vercel.
3. Set all environment variables from `.env.example`.
4. Build command: `npm run build` (default).
5. Connect your domain; SSL is automatic.
6. Preview deployments run on pull requests.

### Supabase production checklist

1. Create a Supabase project.
2. Copy the Postgres connection string into `DATABASE_URL`.
3. Run `npm run db:push` (or apply SQL migration + RLS).
4. Run `npm run db:seed` once.
5. Rotate seed admin password.

### Cloudinary

1. Create a Cloudinary account and upload folder (`smartmart-motors`).
2. Set `CLOUDINARY_*` and `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`.
3. Admin product/media upload uses `/api/upload`.

## Docker (optional)

```bash
docker compose up --build
```

Requires `DATABASE_URL` (and other env vars) available to the app service. Prefer Vercel for the Next.js app and managed Postgres via Supabase.

## CI/CD

GitHub Actions (`.github/workflows/ci.yml`) runs lint, typecheck, and build on push/PR to `main`.

## Security

- Env-based secrets; never commit `.env.local`
- RLS policies in Supabase migration
- Auth middleware on `/admin`
- Rate-limited contact API
- Security headers (CSP, X-Frame-Options, HSTS, etc.)
- Zod validation on inputs

## License

Proprietary — SmartMart Motors. All rights reserved.
