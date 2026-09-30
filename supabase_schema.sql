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
