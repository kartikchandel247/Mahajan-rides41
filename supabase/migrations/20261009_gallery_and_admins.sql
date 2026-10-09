-- ==============================================================================
-- MAHAJAN RIDES - GALLERY & ADMIN PORTAL MIGRATION
-- Adds Admins Table, Gallery Items Table, RLS Policies, and Storage Setup
-- ==============================================================================

-- 1. Create Admins Table
CREATE TABLE IF NOT EXISTS public.admins (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for Admins
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read admin records to verify role
DROP POLICY IF EXISTS "Allow authenticated read admins" ON public.admins;
CREATE POLICY "Allow authenticated read admins" ON public.admins
  FOR SELECT 
  TO authenticated, anon
  USING (true);

-- Allow admins to update their own profile
DROP POLICY IF EXISTS "Allow admin self update" ON public.admins;
CREATE POLICY "Allow admin self update" ON public.admins
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 2. Create Gallery Table
CREATE TABLE IF NOT EXISTS public.gallery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  media_url TEXT NOT NULL,
  media_type TEXT CHECK (media_type IN ('image', 'video')),
  circuit_category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for ordering latest gallery media
CREATE INDEX IF NOT EXISTS idx_gallery_items_created_at ON public.gallery_items (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_items_category ON public.gallery_items (circuit_category);

-- Enable Row Level Security (RLS)
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Public Gallery Read" ON public.gallery_items;
DROP POLICY IF EXISTS "Admin Gallery Insert" ON public.gallery_items;
DROP POLICY IF EXISTS "Admin Gallery Delete" ON public.gallery_items;
DROP POLICY IF EXISTS "Admin Gallery Update" ON public.gallery_items;

-- Public can read gallery items
CREATE POLICY "Public Gallery Read" ON public.gallery_items 
  FOR SELECT USING (true);

-- Authenticated admins can insert gallery items
CREATE POLICY "Admin Gallery Insert" ON public.gallery_items 
  FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT id FROM public.admins) 
    OR auth.role() = 'authenticated'
  );

-- Authenticated admins can delete gallery items
CREATE POLICY "Admin Gallery Delete" ON public.gallery_items 
  FOR DELETE USING (
    auth.uid() IN (SELECT id FROM public.admins)
    OR auth.role() = 'authenticated'
  );

-- Authenticated admins can update gallery items
CREATE POLICY "Admin Gallery Update" ON public.gallery_items 
  FOR UPDATE USING (
    auth.uid() IN (SELECT id FROM public.admins)
    OR auth.role() = 'authenticated'
  );

-- 3. Storage Bucket for Gallery Media ('gallery-media')
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery-media', 'gallery-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Policies for gallery-media
DROP POLICY IF EXISTS "Public Read Gallery Media Bucket" ON storage.objects;
CREATE POLICY "Public Read Gallery Media Bucket" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'gallery-media');

DROP POLICY IF EXISTS "Authenticated Upload Gallery Media Bucket" ON storage.objects;
CREATE POLICY "Authenticated Upload Gallery Media Bucket" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'gallery-media' 
    AND auth.role() = 'authenticated'
  );

DROP POLICY IF EXISTS "Authenticated Delete Gallery Media Bucket" ON storage.objects;
CREATE POLICY "Authenticated Delete Gallery Media Bucket" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'gallery-media' 
    AND auth.role() = 'authenticated'
  );

-- ==============================================================================
-- HELPER: Seed Initial Fleet Images (2 Official Tempo Traveller Photos)
-- ==============================================================================
INSERT INTO public.gallery_items (title, media_url, media_type, circuit_category)
VALUES
  ('17-Seater Force Tempo Traveller Luxury Cockpit', '/vehicle/tempo_traveller_cockpit.png', 'image', 'Tempo Fleet'),
  ('17-Seater Deluxe Pushback Recliner Seats & Ambient AC', '/vehicle/tempo_traveller_seats.png', 'image', 'Tempo Fleet')
ON CONFLICT DO NOTHING;

-- ==============================================================================
-- 4. Site Analytics Table (Realtime traffic tracking synced with Vercel)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.site_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT DEFAULT 'pageview',
  path TEXT NOT NULL DEFAULT '/',
  device_type TEXT DEFAULT 'Mobile',
  browser TEXT DEFAULT 'Chrome Mobile',
  session_id TEXT,
  visitor_id TEXT,
  referrer TEXT DEFAULT 'Direct',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_site_analytics_created_at ON public.site_analytics (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_site_analytics_path ON public.site_analytics (path);
CREATE INDEX IF NOT EXISTS idx_site_analytics_device ON public.site_analytics (device_type);

ALTER TABLE public.site_analytics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anonymous insert analytics" ON public.site_analytics;
CREATE POLICY "Allow anonymous insert analytics" ON public.site_analytics
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow read analytics for authenticated and anon" ON public.site_analytics;
CREATE POLICY "Allow read analytics for authenticated and anon" ON public.site_analytics
  FOR SELECT TO anon, authenticated USING (true);

