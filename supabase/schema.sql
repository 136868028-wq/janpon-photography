-- ==============================================================================
-- STAR X-PRESS PHOTO STUDIO — CLEAN SETUP (RUN IN SUPABASE SQL EDITOR)
-- ==============================================================================

-- 1. Enable Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Drop existing tables & triggers (Clean Reset)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.packages CASCADE;
DROP TABLE IF EXISTS public.services CASCADE;
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.photographers CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 3. Profiles Table (Connected to Supabase Auth)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    role TEXT NOT NULL DEFAULT 'admin',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger function for new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        COALESCE(NEW.raw_user_meta_data->>'role', 'admin')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Services Table
CREATE TABLE public.services (
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

-- 5. Packages Table
CREATE TABLE public.packages (
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

-- 6. Bookings Table
CREATE TABLE public.bookings (
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

-- 7. Payments Table
CREATE TABLE public.payments (
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

-- 8. Reviews Table
CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name TEXT NOT NULL,
    service TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    date_formatted TEXT NOT NULL,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Photographers Table
CREATE TABLE public.photographers (
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

-- 10. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photographers ENABLE ROW LEVEL SECURITY;

-- 11. Create Open / Secure Policies
CREATE POLICY "Public can view profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Public can view services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Public can view packages" ON public.packages FOR SELECT USING (true);
CREATE POLICY "Public can view published reviews" ON public.reviews FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view photographers" ON public.photographers FOR SELECT USING (is_active = true);

CREATE POLICY "Public can create bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view their booking by code" ON public.bookings FOR SELECT USING (true);
CREATE POLICY "Public can update booking" ON public.bookings FOR UPDATE USING (true);

CREATE POLICY "Public can create payments" ON public.payments FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view payments" ON public.payments FOR SELECT USING (true);
CREATE POLICY "Public can update payments" ON public.payments FOR UPDATE USING (true);

CREATE POLICY "Public can submit reviews" ON public.reviews FOR INSERT WITH CHECK (true);

-- 12. Insert Services (Initial Data)
INSERT INTO public.services (slug, name, badge, base_price, deposit, description, tags, image_url)
VALUES
    ('wedding', 'ถ่ายงานแต่งงาน', 'ยอดนิยม', 3500, 500, 'เก็บบรรยากาศแห่งความรัก พิธีเช้า งานเลี้ยง และช่วงเวลาแห่งความสุขของครอบครัว', ARRAY['ช่างภาพมืออาชีพ', 'ไฟล์แต่งสีครบทุกรูป', 'ส่งงานรวดเร็ว'], '/portfolio/wedding-1.jpg'),
    ('graduation', 'ถ่ายรับปริญญา', 'คิวเต็มเร็ว', 4500, 500, 'บันทึกความภาคภูมิใจในวันแห่งความสำเร็จ ทั้งเดี่ยวและกลุ่มเพื่อน', ARRAY['ถ่ายรูปครอบครัว', 'ปรับแสงสีสวยทุกภาพ', 'ถ่ายได้ไม่จำกัด'], '/portfolio/graduation-1.jpg'),
    ('portfolio', 'ถ่ายพอร์ต', 'คิดเป็นรายชั่วโมง', 250, 300, 'ภาพถ่ายโปรไฟล์ สมัครงาน และสร้าง Portfolio ส่วนตัวแบบมืออาชีพ', ARRAY['ชั่วโมงละ 250 บาท ต่อคน', 'ปรับแสงสีสวยให้ทุกภาพ', 'ถ่ายได้ไม่จำกัด'], '/portfolio/portrait-1.jpg'),
    ('event', 'ถ่ายอีเวนต์', 'รับงานองค์กร', 3500, 1000, 'งานเปิดตัวสินค้า สัมมนา ปาร์ตี้บริษัท และคอนเสิร์ต ภาพคมชัดทุกจังหวะสำคัญ', ARRAY['ปรับแสงสีสวยทุกภาพ', 'ถ่ายได้ไม่จำกัด', 'ส่งรูปภาพไม่เกิน 3 วัน'], '/portfolio/event-1.jpg')
ON CONFLICT (slug) DO NOTHING;

-- 13. Insert Packages (Initial Data)
INSERT INTO public.packages (service_slug, name, price, deposit, popular, description, deliverables)
VALUES
    ('wedding', 'แพ็กเกจครึ่งวัน', 3500, 500, true, 'ช่างภาพ 1 คน ถ่ายได้ไม่จำกัด ปรับแสงสีสวยให้ทุกภาพ พร้อมบริการถ่ายนอกสถานที่', ARRAY['ช่างภาพ 1 คน', 'ถ่ายได้ไม่จำกัด', 'ปรับแสงสีสวยให้ทุกภาพ', 'บริการถ่ายนอกสถานที่']),
    ('wedding', 'แพ็กเกจเต็มวัน', 6000, 1000, false, 'ช่างภาพ 2 คน พร้อมวิดิโอ 1-2 นาที และรูปขนาด 8*12 จำนวน 2 แผ่น', ARRAY['ช่างภาพ 2 คน', 'เพิ่ม วิดิโอ 1-2 นาที', 'มีรูปขนาด 8*12 2 แผ่น']),
    ('wedding', 'แพ็กเกจพรีเมียม', 15000, 5000, false, 'จัดเต็มทั้งงานเช้าและงานเลี้ยง ช่างภาพ 3 ทีม ไฟล์ภาพพร้อมอัลบั้มและวีดีโอไฮไลท์', ARRAY['ช่าง 3 ทีม', 'ไฟล์แต่งสี 800 รูป', 'อัลบั้ม 2 เล่ม', 'วีดีโอ 10 นาที']),
    ('graduation', 'แพ็กเกจครึ่งวัน', 4500, 500, true, 'ปรับแสงสีสวยทุกภาพ ถ่ายรูปครอบครัว ถ่ายได้ไม่จำกัด', ARRAY['ปรับแสงสีสวยทุกภาพ', 'ถ่ายรูปครอบครัว', 'ถ่ายได้ไม่จำกัด']),
    ('graduation', 'แพ็กเกจเต็มวัน', 5500, 500, false, 'ปรับแสงสีสวยทุกภาพ ถ่ายรูปครอบครัว ถ่ายได้ไม่จำกัด', ARRAY['ปรับแสงสีสวยทุกภาพ', 'ถ่ายรูปครอบครัว', 'ถ่ายได้ไม่จำกัด']),
    ('graduation', 'แพ็กเกจถ่ายเป็นชั่วโมง', 1500, 500, false, 'ปรับแสงสีสวยทุกภาพ ถ่ายรูปครอบครัว ถ่ายได้ไม่จำกัด', ARRAY['ปรับแสงสีสวยทุกภาพ', 'ถ่ายรูปครอบครัว', 'ถ่ายได้ไม่จำกัด']),
    ('portfolio', 'แพ็กเกจถ่ายพอร์ทแบบชั่วโมง', 250, 300, true, 'ชั่วโมงละ 250 บาท ต่อคน ปรับแสงสีสวยให้ทุกภาพ ถ่ายได้ไม่จำกัด', ARRAY['ชั่วโมงละ 250 บาท ต่อคน', 'ปรับแสงสีสวยให้ทุกภาพ', 'ถ่ายได้ไม่จำกัด']),
    ('event', 'อีเวนต์งานเล็ก (ครึ่งวัน)', 3500, 1000, true, 'ปรับแสงสีสวยทุกภาพ ถ่ายได้ไม่จำกัด ส่งรูปภาพไม่เกิน 3 วัน', ARRAY['ปรับแสงสีสวยทุกภาพ', 'ถ่ายได้ไม่จำกัด', 'ส่งรูปภาพไม่เกิน 3 วัน']),
    ('event', 'อีเวนต์งานใหญ่ (เต็มวัน)', 6000, 1500, false, 'ปรับแสงสีสวยทุกภาพ ถ่ายได้ไม่จำกัด ส่งรูปภาพไม่เกิน 3 วัน', ARRAY['ปรับแสงสีสวยทุกภาพ', 'ถ่ายได้ไม่จำกัด', 'ส่งรูปภาพไม่เกิน 3 วัน']),
    ('event', 'งานอีเวนต์ ฮารีรายอ (บ้านนี้มีรัก)', 500, 500, false, 'คิดเป็น ชั่วโมงละ 500 บาท ถ่ายรูปไม่จำกัด ปรับแสงสีสวยทุกรูป แถมวิดิโอ 1-2 นาที ได้ 1 คลิป', ARRAY['คิดเป็น ชั่วโมงละ 500 บาท', 'ถ่ายรูปไม่จำกัด', 'ปรับแสงสีสวยทุกรูป', 'แถมวิดิโอ 1-2 นาที ได้ 1 คลิป'])
ON CONFLICT DO NOTHING;
