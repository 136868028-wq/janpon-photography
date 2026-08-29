export const BOOKING_STATUSES = [
  "draft",
  "holding",
  "pending_payment",
  "pending_verification",
  "confirmed",
  "completed",
  "expired",
  "cancelled",
  "rescheduled",
  "no_show",
] as const;

export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const PAYMENT_STATUSES = [
  "pending",
  "slip_uploaded",
  "verified",
  "rejected",
  "expired",
  "refunded",
  "partially_refunded",
] as const;

export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const BOOKING_STATUS_LABEL_TH: Record<BookingStatus, string> = {
  draft: "ร่าง",
  holding: "กำลังล็อกคิว",
  pending_payment: "รอชำระเงิน",
  pending_verification: "รอตรวจสอบหลักฐาน",
  confirmed: "ยืนยันแล้ว",
  completed: "เสร็จสิ้น",
  expired: "หมดอายุ",
  cancelled: "ยกเลิก",
  rescheduled: "เลื่อนนัด",
  no_show: "ไม่มาตามนัด",
};

export const PAYMENT_STATUS_LABEL_TH: Record<PaymentStatus, string> = {
  pending: "รอชำระเงิน",
  slip_uploaded: "ได้รับสลิปแล้ว",
  verified: "ชำระเงินแล้ว",
  rejected: "หลักฐานไม่ถูกต้อง",
  expired: "หมดอายุ",
  refunded: "คืนเงินแล้ว",
  partially_refunded: "คืนเงินบางส่วน",
};

export type BookingStatusVariant =
  | "default"
  | "warning"
  | "success"
  | "destructive"
  | "info"
  | "muted";

export const BOOKING_STATUS_VARIANT: Record<BookingStatus, BookingStatusVariant> = {
  draft: "muted",
  holding: "warning",
  pending_payment: "warning",
  pending_verification: "info",
  confirmed: "success",
  completed: "default",
  expired: "muted",
  cancelled: "destructive",
  rescheduled: "info",
  no_show: "destructive",
};

export const PAYMENT_STATUS_VARIANT: Record<PaymentStatus, BookingStatusVariant> = {
  pending: "warning",
  slip_uploaded: "info",
  verified: "success",
  rejected: "destructive",
  expired: "muted",
  refunded: "default",
  partially_refunded: "default",
};

export const ROLES = ["owner", "admin", "staff", "photographer"] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_LABEL_TH: Record<Role, string> = {
  owner: "เจ้าของร้าน",
  admin: "ผู้ดูแลระบบ",
  staff: "พนักงาน",
  photographer: "ช่างภาพ",
};

/** V1 slot definitions — configurable in DB via availability_rules. */
export const SLOT_MORNING = { start: "09:00", end: "13:00", label: "ช่วงเช้า", rangeLabel: "09:00 - 13:00 น." };
export const SLOT_EVENING = { start: "13:00", end: "17:00", label: "ช่วงบ่าย", rangeLabel: "13:00 - 17:00 น." };
export const SLOT_FULLDAY = { start: "09:00", end: "17:00", label: "เต็มวัน", rangeLabel: "09:00 - 17:00 น." };

/** Calendar day status — label is mandatory, color is supplementary. */
export type DaySlotStatus = "both_free" | "morning_only" | "evening_only" | "full" | "closed" | "past";

export const SLOT_STATUS_TEXT_TH: Record<DaySlotStatus, string> = {
  both_free: "เช้า/บ่ายว่าง",
  morning_only: "ช่วงเช้าว่าง",
  evening_only: "ช่วงบ่ายว่าง",
  full: "เต็ม",
  closed: "ปิดรับจอง",
  past: "วันที่ผ่านมา",
};

export const MARKETING_SOURCES = ["facebook", "instagram", "line", "tiktok", "google", "poster", "qr_offline", "direct"] as const;
export type MarketingSource = (typeof MARKETING_SOURCES)[number];

export const SOURCE_LABEL_TH: Record<MarketingSource, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  line: "LINE",
  tiktok: "TikTok",
  google: "Google",
  poster: "โปสเตอร์",
  qr_offline: "QR หน้างาน",
  direct: "ตรง",
};

export const HOLD_DURATION_MINUTES = 10;
export const DEPOSIT_FALLBACK_THB = 500;

/** Booking codes: unambiguous alphabet. Mirrors SQL generate_booking_code(). */
export const BOOKING_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export const BUSINESS = {
  name: "Star X-Press Photo Studio",
  nameEn: "Star X-Press Photo Studio",
  phone: "08x-xxx-xxxx",
  lineId: "@starxpress.studio",
  email: "hello@starxpress.studio",
  address: "อ.ตากใบ จ.นราธิวาส 96110",
  openDays: "ทุกวัน 09:00 - 17:00 น.",
};
