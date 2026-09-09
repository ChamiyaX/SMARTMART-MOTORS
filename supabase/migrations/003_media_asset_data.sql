-- Fallback file storage in Postgres when Cloudinary / Supabase Storage are not configured.
ALTER TABLE media_assets ADD COLUMN IF NOT EXISTS data BYTEA;
