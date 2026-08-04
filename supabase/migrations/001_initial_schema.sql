-- SmartMart Motors – Initial PostgreSQL schema
-- Mirrors prisma/schema.prisma with RLS policies
-- Apply via Supabase SQL editor or: psql $DATABASE_URL -f supabase/migrations/001_initial_schema.sql
--
-- NOTE: Admin writes should use the Supabase service role key (bypasses RLS).
-- Authenticated app users with JWT claims can be wired later; public SELECT is open for catalogue data.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enums
DO $$ BEGIN
  CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'EDITOR', 'USER');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "StockStatus" AS ENUM ('IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK', 'PRE_ORDER');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "MessageStatus" AS ENUM ('NEW', 'READ', 'REPLIED', 'ARCHIVED', 'SPAM');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Users
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  "passwordHash" TEXT,
  role "Role" NOT NULL DEFAULT 'USER',
  image TEXT,
  "emailVerified" TIMESTAMPTZ,
  "rememberToken" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS users_role_idx ON users (role);
CREATE INDEX IF NOT EXISTS users_createdAt_idx ON users ("createdAt");

-- Accounts (NextAuth)
CREATE TABLE IF NOT EXISTS accounts (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at INTEGER,
  token_type TEXT,
  scope TEXT,
  id_token TEXT,
  session_state TEXT,
  UNIQUE (provider, "providerAccountId")
);

CREATE INDEX IF NOT EXISTS accounts_userId_idx ON accounts ("userId");

-- Sessions (NextAuth)
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "sessionToken" TEXT NOT NULL UNIQUE,
  "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS sessions_userId_idx ON sessions ("userId");

-- Verification tokens (NextAuth)
CREATE TABLE IF NOT EXISTS verification_tokens (
  identifier TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires TIMESTAMPTZ NOT NULL,
  UNIQUE (identifier, token)
);

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image TEXT,
  "parentId" TEXT REFERENCES categories(id) ON DELETE SET NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "seoTitle" TEXT,
  "seoDescription" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS categories_slug_idx ON categories (slug);
CREATE INDEX IF NOT EXISTS categories_parentId_idx ON categories ("parentId");
CREATE INDEX IF NOT EXISTS categories_isActive_idx ON categories ("isActive");
CREATE INDEX IF NOT EXISTS categories_sortOrder_idx ON categories ("sortOrder");

-- Brands
CREATE TABLE IF NOT EXISTS brands (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  logo TEXT,
  description TEXT,
  website TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS brands_slug_idx ON brands (slug);
CREATE INDEX IF NOT EXISTS brands_isActive_idx ON brands ("isActive");
CREATE INDEX IF NOT EXISTS brands_sortOrder_idx ON brands ("sortOrder");

-- Products
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  sku TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  "richDescription" TEXT,
  price NUMERIC(12, 2) NOT NULL,
  "compareAtPrice" NUMERIC(12, 2),
  discount NUMERIC(5, 2),
  "stockStatus" "StockStatus" NOT NULL DEFAULT 'IN_STOCK',
  "stockQuantity" INTEGER NOT NULL DEFAULT 0,
  "isFeatured" BOOLEAN NOT NULL DEFAULT FALSE,
  "isNewArrival" BOOLEAN NOT NULL DEFAULT FALSE,
  "isPopular" BOOLEAN NOT NULL DEFAULT FALSE,
  "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
  "categoryId" TEXT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  "brandId" TEXT NOT NULL REFERENCES brands(id) ON DELETE RESTRICT,
  "metaTitle" TEXT,
  "metaDescription" TEXT,
  specifications JSONB,
  "compatibleModels" TEXT[] NOT NULL DEFAULT '{}',
  tags TEXT[] NOT NULL DEFAULT '{}',
  "viewCount" INTEGER NOT NULL DEFAULT 0,
  "inquiryCount" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS products_slug_idx ON products (slug);
CREATE INDEX IF NOT EXISTS products_sku_idx ON products (sku);
CREATE INDEX IF NOT EXISTS products_categoryId_idx ON products ("categoryId");
CREATE INDEX IF NOT EXISTS products_brandId_idx ON products ("brandId");
CREATE INDEX IF NOT EXISTS products_isActive_idx ON products ("isActive");
CREATE INDEX IF NOT EXISTS products_isFeatured_idx ON products ("isFeatured");
CREATE INDEX IF NOT EXISTS products_isNewArrival_idx ON products ("isNewArrival");
CREATE INDEX IF NOT EXISTS products_isPopular_idx ON products ("isPopular");
CREATE INDEX IF NOT EXISTS products_stockStatus_idx ON products ("stockStatus");
CREATE INDEX IF NOT EXISTS products_createdAt_idx ON products ("createdAt");
CREATE INDEX IF NOT EXISTS products_price_idx ON products (price);

-- Product images
CREATE TABLE IF NOT EXISTS product_images (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "productId" TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  "publicId" TEXT,
  alt TEXT,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "isPrimary" BOOLEAN NOT NULL DEFAULT FALSE,
  width INTEGER,
  height INTEGER,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS product_images_productId_idx ON product_images ("productId");
CREATE INDEX IF NOT EXISTS product_images_sortOrder_idx ON product_images ("sortOrder");
CREATE INDEX IF NOT EXISTS product_images_isPrimary_idx ON product_images ("isPrimary");

-- Messages / inquiries
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  "productId" TEXT REFERENCES products(id) ON DELETE SET NULL,
  status "MessageStatus" NOT NULL DEFAULT 'NEW',
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS messages_status_idx ON messages (status);
CREATE INDEX IF NOT EXISTS messages_productId_idx ON messages ("productId");
CREATE INDEX IF NOT EXISTS messages_createdAt_idx ON messages ("createdAt");
CREATE INDEX IF NOT EXISTS messages_email_idx ON messages (email);

-- Settings
CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  "group" TEXT,
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS settings_group_idx ON settings ("group");

-- Page content CMS
CREATE TABLE IF NOT EXISTS page_content (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  page TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content JSONB NOT NULL,
  "seoTitle" TEXT,
  "seoDescription" TEXT,
  "isPublished" BOOLEAN NOT NULL DEFAULT TRUE,
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS page_content_isPublished_idx ON page_content ("isPublished");

-- FAQs
CREATE TABLE IF NOT EXISTS faqs (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS faqs_isActive_idx ON faqs ("isActive");
CREATE INDEX IF NOT EXISTS faqs_sortOrder_idx ON faqs ("sortOrder");
CREATE INDEX IF NOT EXISTS faqs_category_idx ON faqs (category);

-- Analytics events
CREATE TABLE IF NOT EXISTS analytics_events (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  event TEXT NOT NULL,
  path TEXT,
  referrer TEXT,
  "userAgent" TEXT,
  "ipHash" TEXT,
  metadata JSONB,
  "productId" TEXT REFERENCES products(id) ON DELETE SET NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS analytics_events_event_idx ON analytics_events (event);
CREATE INDEX IF NOT EXISTS analytics_events_productId_idx ON analytics_events ("productId");
CREATE INDEX IF NOT EXISTS analytics_events_createdAt_idx ON analytics_events ("createdAt");

-- Audit logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity TEXT,
  "entityId" TEXT,
  metadata JSONB,
  "ipAddress" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS audit_logs_userId_idx ON audit_logs ("userId");
CREATE INDEX IF NOT EXISTS audit_logs_action_idx ON audit_logs (action);
CREATE INDEX IF NOT EXISTS audit_logs_entity_idx ON audit_logs (entity);
CREATE INDEX IF NOT EXISTS audit_logs_createdAt_idx ON audit_logs ("createdAt");

-- Media assets
CREATE TABLE IF NOT EXISTS media_assets (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  url TEXT NOT NULL,
  "publicId" TEXT,
  filename TEXT NOT NULL,
  "mimeType" TEXT NOT NULL,
  size INTEGER NOT NULL,
  width INTEGER,
  height INTEGER,
  folder TEXT,
  alt TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS media_assets_publicId_idx ON media_assets ("publicId");
CREATE INDEX IF NOT EXISTS media_assets_folder_idx ON media_assets (folder);
CREATE INDEX IF NOT EXISTS media_assets_createdAt_idx ON media_assets ("createdAt");

-- ---------------------------------------------------------------------------
-- Row Level Security
-- Public catalogue reads for active/published content.
-- Mutations go through Next.js API routes using the Supabase service role
-- (or Prisma with DATABASE_URL), which bypasses RLS.
-- ---------------------------------------------------------------------------

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;

-- Categories: public read active
DROP POLICY IF EXISTS "Public read active categories" ON categories;
CREATE POLICY "Public read active categories"
  ON categories FOR SELECT
  USING ("isActive" = TRUE);

-- Brands: public read active
DROP POLICY IF EXISTS "Public read active brands" ON brands;
CREATE POLICY "Public read active brands"
  ON brands FOR SELECT
  USING ("isActive" = TRUE);

-- Products: public read active
DROP POLICY IF EXISTS "Public read active products" ON products;
CREATE POLICY "Public read active products"
  ON products FOR SELECT
  USING ("isActive" = TRUE);

-- Product images: public read when parent product is active
DROP POLICY IF EXISTS "Public read product images" ON product_images;
CREATE POLICY "Public read product images"
  ON product_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM products p
      WHERE p.id = product_images."productId" AND p."isActive" = TRUE
    )
  );

-- FAQs: public read active
DROP POLICY IF EXISTS "Public read active faqs" ON faqs;
CREATE POLICY "Public read active faqs"
  ON faqs FOR SELECT
  USING ("isActive" = TRUE);

-- Page content: public read published
DROP POLICY IF EXISTS "Public read published pages" ON page_content;
CREATE POLICY "Public read published pages"
  ON page_content FOR SELECT
  USING ("isPublished" = TRUE);

-- Settings: allow public read of non-sensitive groups only
DROP POLICY IF EXISTS "Public read general settings" ON settings;
CREATE POLICY "Public read general settings"
  ON settings FOR SELECT
  USING ("group" IN ('general', 'seo', 'commerce'));

-- Media: public read (CDN URLs)
DROP POLICY IF EXISTS "Public read media assets" ON media_assets;
CREATE POLICY "Public read media assets"
  ON media_assets FOR SELECT
  USING (TRUE);

-- Messages: allow anonymous INSERT (contact form); no public SELECT
DROP POLICY IF EXISTS "Public insert messages" ON messages;
CREATE POLICY "Public insert messages"
  ON messages FOR INSERT
  WITH CHECK (TRUE);

-- Analytics: allow anonymous INSERT
DROP POLICY IF EXISTS "Public insert analytics" ON analytics_events;
CREATE POLICY "Public insert analytics"
  ON analytics_events FOR INSERT
  WITH CHECK (TRUE);

-- Deny all public access to auth / admin tables (service role bypasses RLS)
-- Explicit deny policies are optional; default deny with RLS enabled is enough.
-- users, accounts, sessions, verification_tokens, audit_logs: no public policies.
