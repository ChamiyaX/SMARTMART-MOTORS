-- Public media bucket for product images when Cloudinary is not configured.
-- Run in Supabase → SQL Editor after 001_initial_schema.sql

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'smartmart-media',
  'smartmart-media',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Public read
CREATE POLICY IF NOT EXISTS "Public read smartmart media"
ON storage.objects FOR SELECT
USING (bucket_id = 'smartmart-media');

-- Service role / authenticated admin uploads (service role bypasses RLS)
CREATE POLICY IF NOT EXISTS "Authenticated upload smartmart media"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'smartmart-media'
  AND auth.role() = 'authenticated'
);

CREATE POLICY IF NOT EXISTS "Authenticated update smartmart media"
ON storage.objects FOR UPDATE
USING (bucket_id = 'smartmart-media' AND auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Authenticated delete smartmart media"
ON storage.objects FOR DELETE
USING (bucket_id = 'smartmart-media' AND auth.role() = 'authenticated');
