# Deployment Guide – SmartMart Motors

## Prerequisites

- GitHub repository
- Vercel account
- Supabase project (PostgreSQL)
- Cloudinary account (images)
- Domain (optional)

## 1. Database (Supabase)

1. Create a new Supabase project.
2. Project Settings → Database → copy the connection string (URI).
3. Put it in `DATABASE_URL` (use the pooled connection for serverless if available).
4. From your machine:

```bash
npm install
cp .env.example .env.local
# fill DATABASE_URL and AUTH_SECRET
npm run db:push
npm run db:seed
```

Alternatively, paste `supabase/migrations/001_initial_schema.sql` into the Supabase SQL editor, then run `npm run db:seed`.

5. Change the seeded admin password after first login.

## 2. Auth secrets

```bash
openssl rand -base64 32
```

Set as `AUTH_SECRET` (and keep `AUTH_URL` / `NEXTAUTH_URL` = your production URL).

## 3. Cloudinary

1. Dashboard → copy Cloud name, API Key, API Secret.
2. Set:

```
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_UPLOAD_FOLDER=smartmart-motors
```

## 4. Vercel

1. Import the GitHub repo.
2. Framework preset: Next.js.
3. Add every variable from `.env.example` (production values).
4. Deploy.
5. Assign domain → SSL is automatic.
6. Enable Preview Deployments for PRs (default).

### Function region (important for speed)

Serverless functions must sit in the same region as the Supabase database, otherwise every
query pays a cross-continent round trip and pages take seconds to render.

`vercel.json` pins functions to `bom1` (Mumbai) to match a Supabase project in `ap-south-1`.
If your Supabase project lives elsewhere, change `regions` to the matching Vercel region
(`fra1` for `eu-central-1`, `iad1` for `us-east-1`, `sin1` for `ap-southeast-1`, …) and redeploy.

Confirm the Supabase region in Dashboard → Project Settings → General → Region.

### Rollback

Vercel Dashboard → Deployments → open a previous successful deployment → Promote to Production.

## 5. Analytics (optional)

| Variable                            | Service            |
| ----------------------------------- | ------------------ |
| `NEXT_PUBLIC_GA_ID`                 | Google Analytics 4 |
| `NEXT_PUBLIC_GTM_ID`                | Google Tag Manager |
| `NEXT_PUBLIC_CLARITY_ID`            | Microsoft Clarity  |
| `NEXT_PUBLIC_FB_PIXEL_ID`           | Meta Pixel         |
| `NEXT_PUBLIC_ENABLE_ANALYTICS=true` | Master switch      |

## 6. Post-deploy checklist

- [ ] Home and products load with seeded (or real) data
- [ ] Admin login works
- [ ] Create/edit product + image upload
- [ ] Contact form stores messages
- [ ] WhatsApp button opens correct number
- [ ] `robots.txt` and `sitemap.xml` resolve
- [ ] HTTPS and security headers present

## 7. Local Docker (optional)

```bash
docker compose up --build
```

Note: run migrations/seed against the compose Postgres before using the app for real data.
