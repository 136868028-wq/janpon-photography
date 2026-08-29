import type { BookingStatus, PaymentStatus, Role } from "@/constants/booking";

export type MockImage = {
  /** CSS gradient used as a stand-in photo for mockups (no image provided). */
  gradient?: string;
  /** Real photo path under /public when the image is provided by the studio. */
  src?: string;
  caption: string;
};

const g = (a: string, b: string, caption: string): MockImage => ({ gradient: `linear-gradient(135deg, ${a}, ${b})`, caption });
const p = (src: string, caption: string): MockImage => ({ src, caption });

export const mockImages = {
  wedding: g("#7c4a3a", "#1d130f", "ภาพเจ้าบ่าวเจ้าสาว ณ โบสถ์"),
  wedding2: g("#a67c52", "#3d2b1f", "แฟชั่นเจ้าสาว"),
  grad: g("#243b53", "#0d1b2a", "ภาพรับปริญญา"),
  grad2: g("#3a5a8c", "#16283f", "ถ่ายรูปครอบครัววันรับปริญญา"),
  portfolio: g("#2b2b33", "#0e0e12", "พอร์ตโมเดล"),
  event: g("#543c2f", "#221510", "คอนเสิร์ต/อีเวนต์"),
  event2: g("#4a2f3d", "#1c0f16", "งานเปิดตัวสินค้า"),
  hero: p("/portfolio/wedding-2.jpg", "Star X-Press Photo Studio"),
  camera: g("#1c1c22", "#0a0a0d", "อุปกรณ์ถ่ายภาพ"),
  qr: g("#ffffff", "#e8e4dc", "QR พร้อมเพย์"),
  slip: g("#f4f1ea", "#d8d2c4", "สลิปโอนเงินตัวอย่าง"),
} satisfies Record<string, MockImage>;

/** Real portfolio photos supplied by the studio (public/portfolio/*). */
export const portfolioPhotos = {
  wedding1: p("/portfolio/wedding-1.jpg", "งานแต่งงาน"),
  wedding2: p("/portfolio/wedding-2.jpg", "งานแต่งงาน"),
  portrait1: p("/portfolio/portrait-1.jpg", "พอร์ต"),
  portrait2: p("/portfolio/portrait-2.jpg", "พอร์ต"),
  graduation1: p("/portfolio/graduation-1.jpg", "รับปริญญา"),
  graduation2: p("/portfolio/graduation-2.jpg", "รับปริญญา"),
  event1: p("/portfolio/event-1.jpg", "อีเวนต์"),
  event2: p("/portfolio/event-2.jpg", "อีเวนต์"),
} satisfies Record<string, MockImage>;

/** Real PromptPay QR codes for deposit by service / amount (public/qr/*). */
export const depositQrs = {
  portrait: p("/qr/deposit-300.png", "QR พร้อมเพย์ 300 บาท สำหรับงานถ่ายพอร์ต"),
  gradAndPort: p("/qr/deposit-500.jpg", "QR พร้อมเพย์ 500 บาท สำหรับงานถ่ายรับปริญญาและแต่งงานครึ่งวัน"),
  wedding: p("/qr/deposit-1000.png", "QR พร้อมเพย์ 1,000 บาท สำหรับงานแต่งงาน (แพ็กเกจเต็มวัน)"),
  weddingPremium: p("/qr/deposit-5000.png", "QR พร้อมเพย์ 5,000 บาท สำหรับงานแต่งงาน (แพ็กเกจพรีเมียม)"),
  event: p("/qr/deposit-1500.png", "QR พร้อมเพย์ 1,500 บาท สำหรับงานอีเวนต์"),
} satisfies Record<string, MockImage>;

export const paymentQr: MockImage = depositQrs.gradAndPort;

/** Get the matching deposit PromptPay QR code for a service slug/name or deposit amount */
export function getDepositQr(serviceSlugOrName?: string, depositAmount?: number): MockImage {
  if (depositAmount === 5000) {
    return depositQrs.weddingPremium;
  }
  if (
    depositAmount === 300 ||
    serviceSlugOrName === "portfolio" ||
    serviceSlugOrName === "ถ่ายพอร์ต"
  ) {
    return depositQrs.portrait;
  }
  if (depositAmount === 500) {
    return depositQrs.gradAndPort;
  }
  if (
    depositAmount === 1500 ||
    serviceSlugOrName === "event" ||
    serviceSlugOrName === "ถ่ายอีเวนต์"
  ) {
    return depositQrs.event;
  }
  if (
    depositAmount === 1000 ||
    serviceSlugOrName === "wedding" ||
    serviceSlugOrName === "ถ่ายงานแต่งงาน"
  ) {
    return depositQrs.wedding;
  }
  // Default to 500 บาท QR
  return depositQrs.gradAndPort;
}

export type MockService = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: MockImage;
  basePrice: number;
  deposit: number;
  durationMinutes: number;
  tags: string[];
  badge?: string;
};

export const mockServices: MockService[] = [
  {
    id: "svc-wedding",
    name: "ถ่ายงานแต่งงาน",
    slug: "wedding",
    description: "บันทึกทุกโมเมนต์สำคัญของวันสำคัญ — ครึ่งวัน เต็มวัน พรีเมียม พร้อมอัลบั้มและบริการถ่ายนอกสถานที่",
    image: portfolioPhotos.wedding1,
    basePrice: 3500,
    deposit: 500,
    durationMinutes: 240,
    tags: ["ช่าง 1-3 ทีม", "ไฟล์แต่งสีครบชุด", "บริการถ่ายนอกสถานที่"],
    badge: "ยอดนิยมสำหรับคู่รัก",
  },
  {
    id: "svc-graduation",
    name: "ถ่ายรับปริญญา",
    slug: "graduation",
    description: "วันสำคัญของคนสำคัญ — ปรับแสงสีสวยทุกภาพ ถ่ายรูปครอบครัว ถ่ายได้ไม่จำกัด",
    image: portfolioPhotos.graduation1,
    basePrice: 1500,
    deposit: 500,
    durationMinutes: 60,
    tags: ["ปรับแสงสีสวยทุกภาพ", "ถ่ายรูปครอบครัว", "ถ่ายได้ไม่จำกัด"],
    badge: "ฮิตตลอดกาล",
  },
  {
    id: "svc-portfolio",
    name: "ถ่ายพอร์ต",
    slug: "portfolio",
    description: "พอร์ตสำหรับสมัครเรียน สมัครงาน หรือโมเดลลิ่ง — ปรับแสงสีสวยให้ทุกภาพ ถ่ายได้ไม่จำกัด",
    image: portfolioPhotos.portrait1,
    basePrice: 250,
    deposit: 300,
    durationMinutes: 60,
    tags: ["ชั่วโมงละ 250 บาท/คน", "ปรับแสงสีสวยให้ทุกภาพ", "ถ่ายได้ไม่จำกัด"],
    badge: "แสงสไตล์โมเดิร์น",
  },
  {
    id: "svc-event",
    name: "ถ่ายอีเวนต์",
    slug: "event",
    description: "คอนเสิร์ต งานเปิดตัว งานประชุม งานเลี้ยง — บันทึกบรรยากาศแบบไม่พลาดทุกซอกมุม",
    image: portfolioPhotos.event1,
    basePrice: 5000,
    deposit: 1500,
    durationMinutes: 180,
    tags: ["ช่างมากประสบการณ์", "ส่งงานไว", "ภาพเรียลไทม์"],
    badge: "ทีมงานพร้อมทุกสเกล",
  },
];

export type MockPackage = {
  id: string;
  serviceSlug: string;
  name: string;
  description: string;
  price: number;
  deposit: number;
  durationMinutes: number;
  deliverables: string[];
  popular?: boolean;
};

export const mockPackages: MockPackage[] = [
  {
    id: "pkg-wed-1",
    serviceSlug: "wedding",
    name: "แพ็กเกจครึ่งวัน",
    description: "ช่าง 1 คน ถ่ายได้ไม่จำกัด ปรับแสงสีสวยให้ทุกภาพ บริการถ่ายนอกสถานที่",
    price: 3500,
    deposit: 500,
    durationMinutes: 240,
    deliverables: [
      "ช่าง 1 คน",
      "ถ่ายได้ไม่จำกัด",
      "ปรับแสงสีสวยให้ทุกภาพ",
      "บริการถ่ายนอกสถานที่",
    ],
  },
  {
    id: "pkg-wed-2",
    serviceSlug: "wedding",
    name: "แพ็กเกจเต็มวัน",
    description: "ช่างภาพ 2 คน พร้อมวิดิโอ 1-2 นาที และรูปขนาด 8*12 จำนวน 2 แผ่น",
    price: 6000,
    deposit: 1000,
    durationMinutes: 480,
    deliverables: [
      "ช่างภาพ 2 คน",
      "เพิ่ม วิดิโอ 1-2 นาที",
      "มีรูปขนาด 8*12 2แผ่น",
    ],
    popular: true,
  },
  {
    id: "pkg-wed-3",
    serviceSlug: "wedding",
    name: "แพ็กเกจพรีเมียม",
    description: "เต็มวัน + เอากราฟเฟอร์ + โดรน",
    price: 15000,
    deposit: 5000,
    durationMinutes: 600,
    deliverables: ["ช่าง 3 ทีม", "ไฟล์แต่งสี 800 รูป", "อัลบั้ม 2 เล่ม", "วีดีโอ 10 นาที"],
  },
  {
    id: "pkg-grad-1",
    serviceSlug: "graduation",
    name: "แพ็กเกจครึ่งวัน",
    description: "ปรับแสงสีสวยทุกภาพ ถ่ายรูปครอบครัว ถ่ายได้ไม่จำกัด",
    price: 4500,
    deposit: 500,
    durationMinutes: 240,
    deliverables: [
      "ปรับแสงสีสวยทุกภาพ",
      "ถ่ายรูปครอบครัว",
      "ถ่ายได้ไม่จำกัด",
    ],
  },
  {
    id: "pkg-grad-2",
    serviceSlug: "graduation",
    name: "แพ็กเกจเต็มวัน",
    description: "ปรับแสงสีสวยทุกภาพ ถ่ายรูปครอบครัว ถ่ายได้ไม่จำกัด",
    price: 5500,
    deposit: 500,
    durationMinutes: 480,
    deliverables: [
      "ปรับแสงสีสวยทุกภาพ",
      "ถ่ายรูปครอบครัว",
      "ถ่ายได้ไม่จำกัด",
    ],
    popular: true,
  },
  {
    id: "pkg-grad-3",
    serviceSlug: "graduation",
    name: "แพ็กเกจถ่ายชั่วโมง",
    description: "ชั่วโมงละ 1,500 บาท ปรับแสงสีสวยทุกภาพ ถ่ายรูปครอบครัว ถ่ายได้ไม่จำกัด",
    price: 1500,
    deposit: 500,
    durationMinutes: 60,
    deliverables: [
      "ชั่วโมงละ 1,500 บาท",
      "ปรับแสงสีสวยทุกภาพ",
      "ถ่ายรูปครอบครัว",
      "ถ่ายได้ไม่จำกัด",
    ],
  },
  {
    id: "pkg-port-1",
    serviceSlug: "portfolio",
    name: "แพ็กเกจถ่ายพอร์ทแบบชั่วโมง",
    description: "ชั่วโมงละ 250 บาท ต่อคน ปรับแสงสีสวยให้ทุกภาพ ถ่ายได้ไม่จำกัด",
    price: 250,
    deposit: 300,
    durationMinutes: 60,
    deliverables: [
      "ชั่วโมงละ 250 บาท ต่อคน",
      "ปรับแสงสีสวยให้ทุกภาพ",
      "ถ่ายได้ไม่จำกัด",
    ],
    popular: true,
  },
  {
    id: "pkg-evt-1",
    serviceSlug: "event",
    name: "อีเวนต์เล็ก",
    description: "งานเลี้ยง งานประชุม ไม่เกิน 3 ชม.",
    price: 5000,
    deposit: 1500,
    durationMinutes: 180,
    deliverables: ["ช่าง 1 ทีม", "ไฟล์แต่งสี 100 รูป", "ส่งงานใน 3 วัน"],
  },
  {
    id: "pkg-evt-2",
    serviceSlug: "event",
    name: "อีเวนต์ใหญ่",
    description: "คอนเสิร์ต งานเปิดตัว ทั้งวัน",
    price: 15000,
    deposit: 1500,
    durationMinutes: 480,
    deliverables: ["ช่าง 2 ทีม", "ไฟล์แต่งสี 500 รูป", "คลิปไฮไลท์ 3 นาที", "ภาพเรียลไทม์"],
    popular: true,
  },
];

export type MockPortfolio = {
  id: string;
  title: string;
  category: "wedding" | "graduation" | "portfolio" | "event";
  image: MockImage;
  date: string;
};

export const mockPortfolio: MockPortfolio[] = [
  { id: "pf-1", title: "งานแต่ง อ้อม & เอิร์ธ", category: "wedding", image: portfolioPhotos.wedding1, date: "2026-07-20" },
  { id: "pf-2", title: "รับปริญญา ม.กรุงเทพ", category: "graduation", image: portfolioPhotos.graduation1, date: "2026-07-12" },
  { id: "pf-3", title: "พอร์ตโมเดล ฟ้า", category: "portfolio", image: portfolioPhotos.portrait1, date: "2026-07-05" },
  { id: "pf-4", title: "คอนเสิร์ต Night Fest", category: "event", image: portfolioPhotos.event1, date: "2026-06-28" },
  { id: "pf-5", title: "งานแต่ง มิน & เบียร์", category: "wedding", image: portfolioPhotos.wedding2, date: "2026-06-18" },
  { id: "pf-6", title: "รับปริญญา ม.รังสิต", category: "graduation", image: portfolioPhotos.graduation2, date: "2026-06-10" },
  { id: "pf-7", title: "พอร์ตนางแบบ แพรว", category: "portfolio", image: portfolioPhotos.portrait2, date: "2026-05-30" },
  { id: "pf-8", title: "เปิดตัวสินค้าใหม่", category: "event", image: portfolioPhotos.event2, date: "2026-05-22" },
  { id: "pf-9", title: "แต่งงานหมู่ บาบิลอน", category: "wedding", image: mockImages.wedding, date: "2026-05-14" },
];

export type MockReview = {
  id: string;
  customerName: string;
  service: string;
  rating: number;
  comment: string;
  date: string;
};

export const mockReviews: MockReview[] = [
  { id: "rv-1", customerName: "นิ้ง นภัสสร", service: "ถ่ายรับปริญญา", rating: 5, comment: "ช่างถ่ายเก่งมาก ถ่ายออกมาสวยทุกใบ ยิ้มให้กับทาง่าย ครอบครัวชอบมากค่ะ", date: "2026-07-25" },
  { id: "rv-2", customerName: "พี่โอ๊ต", service: "ถ่ายงานแต่งงาน", rating: 5, comment: "ราคาเหมาะสมกับคุณภาพ ได้ไฟล์ครบตามแพ็กเกจ แก้ไขรูปไวมาก", date: "2026-07-18" },
  { id: "rv-3", customerName: "เจนนิเฟอร์", service: "ถ่ายพอร์ต", rating: 5, comment: "ได้พอร์ตสวยติดมหาลัยเลย ขอบคุณพี่ช่างที่แนะนำท่าทางเก่งมาก", date: "2026-07-10" },
  { id: "rv-4", customerName: "บอส ปรเมศร์", service: "ถ่ายอีเวนต์", rating: 4, comment: "งานส่งไวมาก ภาพสวย ราคาโอเค รออีกนิดเรื่องการคัดรูปก็คือเพอร์เฟกต์", date: "2026-07-02" },
  { id: "rv-5", customerName: "ป่าน บุตรี", service: "ถ่ายรับปริญญา", rating: 5, comment: "ตอนแรกไม่มั่นใจ แต่เห็นผลงานแล้วประทับใจมาก แนะนำเพื่อนให้ไปถ่ายต่อเลย", date: "2026-06-27" },
  { id: "rv-6", customerName: "เพชร รวิภาส", service: "ถ่ายงานแต่งงาน", rating: 5, comment: "ทีมงานมืออาชีพ วางท่าให้ทุกช็อต ภาพออกมาอลังการมาก", date: "2026-06-19" },
];

export type MockPhotographer = {
  id: string;
  displayName: string;
  role: Role;
  phone: string;
  bio: string;
  isActive: boolean;
  isDefault?: boolean;
  bookings: number;
  rating: number;
};

export const mockPhotographers: MockPhotographer[] = [
  { id: "pg-1", displayName: "ช่างเก่ง (หัวหน้าทีม)", role: "owner", phone: "081-234-5678", bio: "ช่างมากประสบการณ์ 10 ปี งาน wedding และ commercial", isActive: true, isDefault: true, bookings: 214, rating: 4.9 },
  { id: "pg-2", displayName: "พี่แนน", role: "photographer", phone: "082-345-6789", bio: "ถนัดงาน portrait และรับปริญญา", isActive: true, bookings: 168, rating: 4.8 },
  { id: "pg-3", displayName: "พี่มิกซ์", role: "photographer", phone: "083-456-7890", bio: "ถนัดงานอีเวนต์และคอนเสิร์ต", isActive: true, bookings: 97, rating: 4.7 },
  { id: "pg-4", displayName: "คุณจอย", role: "staff", phone: "084-567-8901", bio: "ดูแลการตลาดและลูกค้า", isActive: false, bookings: 0, rating: 0 },
];

export type MockBooking = {
  id: string;
  code: string;
  customerName: string;
  phone: string;
  serviceName: string;
  packageName?: string;
  date: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  deposit: number;
  remaining: number;
  source: string;
  photographer: string;
  note?: string;
};

export const mockBookings: MockBooking[] = [
  { id: "bk-1", code: "JN7F2K9Q", customerName: "นิ้ง นภัสสร", phone: "089-111-2233", serviceName: "ถ่ายรับปริญญา", packageName: "แพ็กเกจเต็มวัน", date: "2026-08-20", startTime: "09:00", endTime: "13:00", status: "confirmed", paymentStatus: "verified", deposit: 500, remaining: 5000, source: "facebook", photographer: "พี่แนน" },
  { id: "bk-2", code: "JN4M8T2W", customerName: "อ้อม วนิดา", phone: "089-222-3344", serviceName: "ถ่ายงานแต่งงาน", packageName: "แพ็กเกจพรีเมียม", date: "2026-08-21", startTime: "09:00", endTime: "13:00", status: "pending_verification", paymentStatus: "slip_uploaded", deposit: 5000, remaining: 10000, source: "instagram", photographer: "ช่างเก่ง", note: "ลูกค้าขอถ่ายที่บ้านเจ้าสาวก่อน" },
  { id: "bk-3", code: "JN9X5C3R", customerName: "เจนนิเฟอร์ ลี", phone: "089-333-4455", serviceName: "ถ่ายพอร์ต", packageName: "แพ็กเกจถ่ายพอร์ทแบบชั่วโมง", date: "2026-08-21", startTime: "13:00", endTime: "17:00", status: "holding", paymentStatus: "pending", deposit: 300, remaining: 200, source: "line", photographer: "ช่างเก่ง" },
  { id: "bk-4", code: "JN2P6H8D", customerName: "บอส ปรเมศร์", phone: "089-444-5566", serviceName: "ถ่ายอีเวนต์", packageName: "อีเวนต์เล็ก", date: "2026-08-18", startTime: "13:00", endTime: "17:00", status: "confirmed", paymentStatus: "verified", deposit: 1500, remaining: 3500, source: "tiktok", photographer: "พี่มิกซ์" },
  { id: "bk-5", code: "JN8B1V9M", customerName: "ป่าน บุตรี", phone: "089-555-6677", serviceName: "ถ่ายรับปริญญา", packageName: "แพ็กเกจครึ่งวัน", date: "2026-08-14", startTime: "09:00", endTime: "13:00", status: "completed", paymentStatus: "verified", deposit: 500, remaining: 4000, source: "poster", photographer: "พี่แนน" },
  { id: "bk-6", code: "JN5G3K7L", customerName: "เพชร รวิภาส", phone: "089-666-7788", serviceName: "ถ่ายงานแต่งงาน", packageName: "แพ็กเกจเต็มวัน", date: "2026-08-14", startTime: "13:00", endTime: "17:00", status: "cancelled", paymentStatus: "refunded", deposit: 1000, remaining: 0, source: "facebook", photographer: "ช่างเก่ง", note: "ลูกค้าขอยกเลิกเพราะเหตุจำเป็น" },
  { id: "bk-7", code: "JN7H4Q2W", customerName: "เฟิร์น ฟาง", phone: "089-777-8899", serviceName: "ถ่ายพอร์ต", packageName: "แพ็กเกจถ่ายพอร์ทแบบชั่วโมง", date: "2026-08-13", startTime: "09:00", endTime: "13:00", status: "expired", paymentStatus: "expired", deposit: 300, remaining: 0, source: "google", photographer: "พี่แนน" },
  { id: "bk-8", code: "JN3J6Z9X", customerName: "มิน ลลนา", phone: "089-888-9900", serviceName: "ถ่ายรับปริญญา", packageName: "แพ็กเกจถ่ายชั่วโมง", date: "2026-09-05", startTime: "09:00", endTime: "13:00", status: "confirmed", paymentStatus: "verified", deposit: 500, remaining: 1000, source: "qr_offline", photographer: "ช่างเก่ง" },
  { id: "bk-9", code: "JN6C2F5P", customerName: "โอม ชลสิทธิ์", phone: "089-999-0011", serviceName: "ถ่ายอีเวนต์", packageName: "อีเวนต์ใหญ่", date: "2026-09-12", startTime: "09:00", endTime: "13:00", status: "pending_payment", paymentStatus: "pending", deposit: 1500, remaining: 13500, source: "direct", photographer: "พี่มิกซ์" },
  { id: "bk-10", code: "JN1D4G8T", customerName: "แพรว พิมพ์ชนก", phone: "090-111-2233", serviceName: "ถ่ายพอร์ต", packageName: "แพ็กเกจถ่ายพอร์ทแบบชั่วโมง", date: "2026-08-22", startTime: "09:00", endTime: "13:00", status: "pending_verification", paymentStatus: "rejected", deposit: 300, remaining: 200, source: "instagram", photographer: "พี่แนน", note: "สลิปไม่ชัดเจน ขออัปโหลดใหม่" },
];

export type MockPayment = {
  id: string;
  code: string;
  customerName: string;
  amount: number;
  status: PaymentStatus;
  uploadedAt: string;
  rejectionReason?: string;
};

export const mockPayments: MockPayment[] = [
  { id: "pay-1", code: "JN4M8T2W", customerName: "อ้อม วนิดา", amount: 5000, status: "slip_uploaded", uploadedAt: "2026-08-14 10:32" },
  { id: "pay-2", code: "JN1D4G8T", customerName: "แพรว พิมพ์ชนก", amount: 500, status: "rejected", uploadedAt: "2026-08-13 19:05", rejectionReason: "ยอดเงินไม่ตรงกับมัดจำที่ต้องชำระ" },
  { id: "pay-3", code: "JN7H4Q2W", customerName: "เฟิร์น ฟาง", amount: 500, status: "pending", uploadedAt: "-" },
  { id: "pay-4", code: "JN2P6H8D", customerName: "บอส ปรเมศร์", amount: 1500, status: "verified", uploadedAt: "2026-08-12 14:20" },
];

export type MockCustomer = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  lineUserId?: string;
  totalBookings: number;
  totalSpent: number;
  lastBooking: string;
  notes?: string;
};

export const mockCustomers: MockCustomer[] = [
  { id: "cs-1", name: "นิ้ง นภัสสร", phone: "089-111-2233", email: "ning@example.com", lineUserId: "ning-n", totalBookings: 3, totalSpent: 12500, lastBooking: "2026-08-20" },
  { id: "cs-2", name: "อ้อม วนิดา", phone: "089-222-3344", email: "aom@example.com", totalBookings: 1, totalSpent: 1000, lastBooking: "2026-08-21" },
  { id: "cs-3", name: "เจนนิเฟอร์ ลี", phone: "089-333-4455", lineUserId: "jennifer.lee", totalBookings: 2, totalSpent: 5600, lastBooking: "2026-08-21" },
  { id: "cs-4", name: "บอส ปรเมศร์", phone: "089-444-5566", email: "boss@example.com", totalBookings: 1, totalSpent: 5000, lastBooking: "2026-08-18" },
  { id: "cs-5", name: "ป่าน บุตรี", phone: "089-555-6677", email: "pan@example.com", totalBookings: 4, totalSpent: 18200, lastBooking: "2026-08-14", notes: "ลูกค้าประจำ แนะนำเพื่อนมา 2 คน" },
  { id: "cs-6", name: "เพชร รวิภาส", phone: "089-666-7788", totalBookings: 1, totalSpent: 1000, lastBooking: "2026-08-14" },
];

export type MockAuditEntry = {
  id: string;
  time: string;
  actor: string;
  action: string;
  entity: string;
  detail: string;
};

export const mockAuditLogs: MockAuditEntry[] = [
  { id: "au-1", time: "2026-08-14 10:35", actor: "ช่างเก่ง", action: "payment.verified", entity: "booking JN4M8T2W", detail: "อนุมัติสลิป 1,000 บาท → booking เปลี่ยนเป็น confirmed" },
  { id: "au-2", time: "2026-08-14 10:32", actor: "ลูกค้า", action: "payment.slip_uploaded", entity: "booking JN4M8T2W", detail: "อัปโหลดสลิป 1,000 บาท" },
  { id: "au-3", time: "2026-08-13 19:12", actor: "พี่แนน", action: "payment.rejected", entity: "booking JN1D4G8T", detail: "ปฏิเสธสลิป: ยอดเงินไม่ตรง" },
  { id: "au-4", time: "2026-08-13 19:05", actor: "ลูกค้า", action: "payment.slip_uploaded", entity: "booking JN1D4G8T", detail: "อัปโหลดสลิป 500 บาท" },
  { id: "au-5", time: "2026-08-13 15:00", actor: "ช่างเก่ง", action: "booking.cancelled", entity: "booking JN5G3K7L", detail: "ยกเลิก booking งานแต่ง → คืนเงินมัดจำ 1,000 บาท" },
  { id: "au-6", time: "2026-08-13 09:12", actor: "system", action: "hold.expired", entity: "booking JN7H4Q2W", detail: "hold หมดอายุ 10 นาที → slot กลับว่าง" },
  { id: "au-7", time: "2026-08-12 16:40", actor: "พี่มิกซ์", action: "availability.blocked", entity: "date 2026-08-27", detail: "ปิดรับจองทั้งวัน (เหตุ: ออกงานอื่น)" },
  { id: "au-8", time: "2026-08-12 14:21", actor: "ช่างเก่ง", action: "booking.confirmed", entity: "booking JN2P6H8D", detail: "ยืนยัน booking อีเวนต์เล็ก" },
];

export type MockAvailabilityDay = {
  date: string;
  dayName: string;
  status: "both_free" | "morning_only" | "evening_only" | "full" | "closed" | "past";
};

export const mockAvailabilityDays: MockAvailabilityDay[] = [
  { date: "2026-08-16", dayName: "อาทิตย์", status: "closed" },
  { date: "2026-08-17", dayName: "จันทร์", status: "both_free" },
  { date: "2026-08-18", dayName: "อังคาร", status: "evening_only" },
  { date: "2026-08-19", dayName: "พุธ", status: "both_free" },
  { date: "2026-08-20", dayName: "พฤหัสบดี", status: "morning_only" },
  { date: "2026-08-21", dayName: "ศุกร์", status: "full" },
  { date: "2026-08-22", dayName: "เสาร์", status: "both_free" },
  { date: "2026-08-23", dayName: "อาทิตย์", status: "closed" },
  { date: "2026-08-24", dayName: "จันทร์", status: "both_free" },
  { date: "2026-08-25", dayName: "อังคาร", status: "morning_only" },
  { date: "2026-08-26", dayName: "พุธ", status: "both_free" },
  { date: "2026-08-27", dayName: "พฤหัสบดี", status: "closed" },
  { date: "2026-08-28", dayName: "ศุกร์", status: "evening_only" },
  { date: "2026-08-29", dayName: "เสาร์", status: "full" },
  { date: "2026-08-30", dayName: "อาทิตย์", status: "closed" },
  { date: "2026-08-31", dayName: "จันทร์", status: "both_free" },
];

export const mockAvailabilitySlots = [
  { slot: "ช่วงเช้า", range: "09:00 - 13:00 น.", state: "available" },
  { slot: "ช่วงบ่าย", range: "13:00 - 17:00 น.", state: "available" },
] as const;

export type MockAnalytics = {
  kpis: { label: string; value: string; change: string; trend: "up" | "down" | "flat" }[];
  bookingTrend: { label: string; bookings: number; revenue: number }[];
  serviceDistribution: { name: string; value: number }[];
  sourceDistribution: { name: string; value: number }[];
  funnel: { step: string; count: number }[];
};

export const mockAnalytics: MockAnalytics = {
  kpis: [
    { label: "จองวันนี้", value: "3", change: "+1 จากเมื่อวาน", trend: "up" },
    { label: "จองเดือนนี้", value: "24", change: "+18% จากเดือนก่อน", trend: "up" },
    { label: "รอตรวจสอบหลักฐาน", value: "2", change: "ต้องรีบตรวจ", trend: "flat" },
    { label: "ยืนยันแล้ว", value: "16", change: "66% ของเดือนนี้", trend: "up" },
    { label: "เสร็จสิ้น", value: "9", change: "38% ของเดือนนี้", trend: "up" },
    { label: "ยกเลิก", value: "2", change: "8% ของเดือนนี้", trend: "down" },
    { label: "มัดจำที่รับได้", value: "12,500 บาท", change: "จาก 24 booking", trend: "up" },
    { label: "ยอดค้างชำระ", value: "89,300 บาท", change: "หักมัดจำแล้ว", trend: "flat" },
    { label: "รายได้รวม", value: "184,500 บาท", change: "+22% จากเดือนก่อน", trend: "up" },
    { label: "มูลค่าการจองเฉลี่ย", value: "7,688 บาท", change: "ต่อ booking", trend: "flat" },
  ],
  bookingTrend: [
    { label: "พ.ค.", bookings: 12, revenue: 96000 },
    { label: "มิ.ย.", bookings: 16, revenue: 128000 },
    { label: "ก.ค.", bookings: 19, revenue: 151000 },
    { label: "ส.ค.", bookings: 24, revenue: 184500 },
    { label: "ก.ย.", bookings: 11, revenue: 88000 },
  ],
  serviceDistribution: [
    { name: "ถ่ายรับปริญญา", value: 38 },
    { name: "ถ่ายงานแต่งงาน", value: 27 },
    { name: "ถ่ายพอร์ต", value: 21 },
    { name: "ถ่ายอีเวนต์", value: 14 },
  ],
  sourceDistribution: [
    { name: "Facebook", value: 34 },
    { name: "Instagram", value: 24 },
    { name: "LINE", value: 16 },
    { name: "TikTok", value: 11 },
    { name: "QR หน้างาน", value: 9 },
    { name: "อื่นๆ", value: 6 },
  ],
  funnel: [
    { step: "เข้าชมเว็บ", count: 1240 },
    { step: "เลือกบริการ", count: 620 },
    { step: "ดูปฏิทิน", count: 431 },
    { step: "เริ่มจอง", count: 212 },
    { step: "เข้าสู่ชำระเงิน", count: 138 },
    { step: "ยืนยันสำเร็จ", count: 86 },
  ],
};

export const mockPaymentSettings = {
  paymentMethod: "promptpay",
  bankName: "ธ. กรุงไทย",
  accountName: "นายนุกมัน แบนอ",
  promptpayId: "PromptPay QR",
  qrImage: depositQrs.gradAndPort,
  depositQrs,
  defaultDeposit: 500,
  isActive: true,
};

export const mockBlockedDates = [
  { id: "bd-1", date: "2026-08-16", startTime: "-", endTime: "-", reason: "วันหยุดประจำสัปดาห์", by: "ช่างเก่ง" },
  { id: "bd-2", date: "2026-08-27", startTime: "-", endTime: "-", reason: "ออกงานถ่ายนอกสถานที่", by: "พี่มิกซ์" },
  { id: "bd-3", date: "2026-08-23", startTime: "-", endTime: "-", reason: "วันหยุดประจำสัปดาห์", by: "ช่างเก่ง" },
];

export const mockAvailabilityRules = [
  { id: "ar-1", weekday: "จันทร์ - ศุกร์", startTime: "09:00", endTime: "13:00", maxBookings: 1, isActive: true },
  { id: "ar-2", weekday: "จันทร์ - ศุกร์", startTime: "13:00", endTime: "17:00", maxBookings: 1, isActive: true },
  { id: "ar-3", weekday: "เสาร์", startTime: "09:00", endTime: "13:00", maxBookings: 2, isActive: true },
  { id: "ar-4", weekday: "เสาร์", startTime: "13:00", endTime: "17:00", maxBookings: 2, isActive: true },
  { id: "ar-5", weekday: "อาทิตย์", startTime: "09:00", endTime: "13:00", maxBookings: 1, isActive: false },
];

export const FAQS = [
  { q: "จองแล้วชำระเงินยังไง?", a: "เลือกวันเวลา → กรอกข้อมูล → ล็อกคิว 10 นาที → สแกน QR พร้อมเพย์ตามยอดมัดจำของบริการ → อัปโหลดสลิป → รอแอดมินตรวจสอบ (ปกติภายใน 1 ชั่วโมงในเวลาทำการ) → รับการยืนยันคิว" },
  { q: "มัดจำเท่าไหร่ และจองล่วงหน้าได้กี่วัน?", a: "มัดจำตามแพ็กเกจ (เริ่ม 500 บาท) จองล่วงหน้าได้สูงสุด 90 วัน ทางเว็บจะแสดงวันว่างล่าสุดให้อัตโนมัติ" },
  { q: "ถ้าไม่จ่ายมัดจำทันที คิวจะยังว่างไหม?", a: "คิวจะถูกล็อกไว้ 10 นาทีเท่านั้น หลังหมดเวลา คิวจะกลับไปว่างให้คนอื่นจองได้" },
  { q: "ยกเลิกแล้วได้เงินคืนไหม?", a: "แจ้งยกเลิกล่วงหน้า 7 วันขึ้นไป คืนมัดจำเต็มจำนวน ภายใน 7 วัน คืน 50% และไม่คืนหากยกเลิกในวันที่ถ่าย" },
  { q: "วันพระ/วันหยุด จองได้ไหม?", a: "วันใดที่ปิดรับจอง ระบบจะแสดงสถานะ \"ปิดรับจอง\" ไว้ล่วงหน้า ไม่สามารถเลือกได้" },
  { q: "ขอเลื่อนวันถ่ายได้ไหม?", a: "ได้ครั้งละ 1 ครั้งโดยไม่เสียค่าใช้จ่าย หากแจ้งล่วงหน้า 48 ชั่วโมง แล้วแต่วันที่ว่างในระบบ" },
];

export const bookingSteps = [
  { step: 1, title: "เลือกบริการ" },
  { step: 2, title: "เลือกวันเวลา" },
  { step: 3, title: "ข้อมูลลูกค้า" },
  { step: 4, title: "ตรวจสอบ" },
  { step: 5, title: "ชำระเงิน" },
  { step: 6, title: "ยืนยัน" },
];

export const bookingCalendarMock = [
  { time: "ช่วงเช้า 09:00-13:00", items: [{ time: "09:00", booking: mockBookings[0], title: `${mockBookings[0].customerName} · ${mockBookings[0].serviceName}` }] },
  { time: "ช่วงบ่าย 13:00-17:00", items: [{ time: "13:00", booking: mockBookings[2], title: `${mockBookings[2].customerName} · ${mockBookings[2].serviceName}` }] },
];
