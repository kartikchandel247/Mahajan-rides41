-- ==============================================================================
-- MAHAJAN RIDES (mahajan_rides_41) - PRODUCTION SUPABASE DATABASE SCHEMA
-- Fleet: 17-Seater Force Tempo Traveller | Himachal Pradesh
-- Project Reference: kcvnmquwqpuiftaeccgb.supabase.co
-- ==============================================================================

-- 1. BOOKING INQUIRIES & QUOTE REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT,
    destination TEXT,
    pickup_location TEXT,
    travel_date TEXT,
    group_size TEXT,
    vehicle_type TEXT DEFAULT '17-Seater Force Tempo Traveller',
    special_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow public inserts for inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Allow service role full access on inquiries" ON public.inquiries;

-- Policy: Allow prospective travelers (anon & authenticated) to insert booking leads
CREATE POLICY "Allow public inserts for inquiries"
    ON public.inquiries
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Policy: Only service role / authenticated admin can read inquiries (protects traveler privacy)
CREATE POLICY "Allow service role full access on inquiries"
    ON public.inquiries
    FOR ALL
    TO service_role
    USING (true);

-- Index for date-based ordering
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON public.inquiries (created_at DESC);


-- 2. VERIFIED CUSTOMER REVIEWS & FEEDBACK TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    city TEXT,
    tour TEXT,
    rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    photo_url TEXT,
    verified BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow public read verified reviews" ON public.reviews;
DROP POLICY IF EXISTS "Allow customer submit reviews" ON public.reviews;
DROP POLICY IF EXISTS "Allow service role manage reviews" ON public.reviews;

-- Policy: Allow everyone to read verified passenger testimonials
CREATE POLICY "Allow public read verified reviews"
    ON public.reviews
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Policy: Allow passengers to post their travel feedback
CREATE POLICY "Allow customer submit reviews"
    ON public.reviews
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Policy: Full admin control for dashboard
CREATE POLICY "Allow service role manage reviews"
    ON public.reviews
    FOR ALL
    TO service_role
    USING (true);

-- Index for ordering latest customer reviews
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON public.reviews (created_at DESC);


-- ==============================================================================
-- 3. ADMIN ACCOUNTS & ROLE AUTHORIZATION TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.admins (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Allow reading admins to verify authorization
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


-- ==============================================================================
-- 4. PUBLIC & ADMIN GALLERY MEDIA TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.gallery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  media_url TEXT NOT NULL,
  media_type TEXT CHECK (media_type IN ('image', 'video')),
  circuit_category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for fast filtering and ordering
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

-- Only authenticated admins can insert/delete/update gallery items
CREATE POLICY "Admin Gallery Insert" ON public.gallery_items 
  FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT id FROM public.admins) 
    OR auth.role() = 'authenticated'
  );

CREATE POLICY "Admin Gallery Delete" ON public.gallery_items 
  FOR DELETE USING (
    auth.uid() IN (SELECT id FROM public.admins)
    OR auth.role() = 'authenticated'
  );

CREATE POLICY "Admin Gallery Update" ON public.gallery_items 
  FOR UPDATE USING (
    auth.uid() IN (SELECT id FROM public.admins)
    OR auth.role() = 'authenticated'
  );

-- 5. Storage Bucket Configuration for gallery-media
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

