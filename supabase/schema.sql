-- ==============================================================================
-- STAR X-PRESS PHOTO STUDIO — SUPABASE DATABASE SCHEMA
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Services Table
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    badge TEXT,
    base_price INTEGER NOT NULL,
    deposit INTEGER NOT NULL,
    description TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Packages Table
CREATE TABLE IF NOT EXISTS public.packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
    service_slug TEXT NOT NULL,
    name TEXT NOT NULL,
    price INTEGER NOT NULL,
    deposit INTEGER NOT NULL,
    popular BOOLEAN DEFAULT FALSE,
    description TEXT NOT NULL,
    deliverables TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Bookings Table
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL, -- e.g. JN4M8T2W
    service_name TEXT NOT NULL,
    package_name TEXT,
    date DATE NOT NULL,
    slot TEXT NOT NULL, -- 'morning' | 'evening' | 'fullday'
    total_price INTEGER NOT NULL,
    deposit_amount INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'holding', -- 'holding' | 'pending_payment' | 'pending_verification' | 'confirmed' | 'completed' | 'cancelled'
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    customer_line TEXT,
    customer_note TEXT,
    photo_consent BOOLEAN DEFAULT FALSE,
    hold_expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Payments Table (Slips & Deposit Verification)
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    booking_code TEXT NOT NULL,
    amount INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'slip_uploaded' | 'verified' | 'rejected'
    slip_url TEXT,
    uploaded_at TIMESTAMPTZ,
    verified_at TIMESTAMPTZ,
    admin_note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Reviews Table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name TEXT NOT NULL,
    service TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    date_formatted TEXT NOT NULL,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Photographers Table
CREATE TABLE IF NOT EXISTS public.photographers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    display_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'photographer',
    phone TEXT,
    bio TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    is_default BOOLEAN DEFAULT FALSE,
    rating NUMERIC(3, 2) DEFAULT 5.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Enable Row Level Security (RLS)
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photographers ENABLE ROW LEVEL SECURITY;

-- 9. Public Read Policies (Allow anyone to view published services, packages, reviews)
CREATE POLICY "Public can view services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Public can view packages" ON public.packages FOR SELECT USING (true);
CREATE POLICY "Public can view published reviews" ON public.reviews FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view photographers" ON public.photographers FOR SELECT USING (is_active = true);

-- 10. Public Insert Policies (Allow customers to create bookings, payments, reviews)
CREATE POLICY "Public can create bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view their booking by code" ON public.bookings FOR SELECT USING (true);
CREATE POLICY "Public can update booking" ON public.bookings FOR UPDATE USING (true);

CREATE POLICY "Public can create payments" ON public.payments FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view payments" ON public.payments FOR SELECT USING (true);
CREATE POLICY "Public can update payments" ON public.payments FOR UPDATE USING (true);

CREATE POLICY "Public can submit reviews" ON public.reviews FOR INSERT WITH CHECK (true);

-- 11. Storage Bucket for Payment Slips (Run in Supabase dashboard storage)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('slips', 'slips', true) ON CONFLICT DO NOTHING;
