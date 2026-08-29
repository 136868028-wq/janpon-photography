import { DaySlotStatus, SLOT_STATUS_TEXT_TH } from "@/constants/booking";
import { mockAvailabilityDays } from "@/lib/mock-data";

export const THAI_MONTHS_FULL = [
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤศจิกายน",
  "ธันวาคม",
] as const;

export const THAI_MONTHS_SHORT = [
  "ม.ค.",
  "ก.พ.",
  "มี.ค.",
  "เม.ย.",
  "พ.ค.",
  "มิ.ย.",
  "ก.ค.",
  "ส.ค.",
  "ก.ย.",
  "ต.ค.",
  "พ.ย.",
  "ธ.ค.",
] as const;

export const THAI_DAYS_SHORT = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"] as const;

export const THAI_DAYS_FULL = [
  "วันอาทิตย์",
  "วันจันทร์",
  "วันอังคาร",
  "วันพุธ",
  "วันพฤหัสบดี",
  "วันศุกร์",
  "วันเสาร์",
] as const;

/** Return the number of days in a given month (1-31). monthIndex is 0-based (0 = Jan, 11 = Dec). */
export function getDaysInMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex + 1, 0).getDate();
}

/** Return the day-of-week for the 1st of the month (0 = Sunday, 1 = Monday ... 6 = Saturday). */
export function getFirstDayOfWeek(year: number, monthIndex: number): number {
  return new Date(year, monthIndex, 1).getDay();
}

/** Convert CE year to Buddhist Era (พ.ศ.) */
export function toBuddhistYear(year: number): number {
  return year + 543;
}

/** Format a YYYY-MM-DD string into formatted Thai text */
export function formatThaiDate(dateStr: string, format: "short" | "full" = "full"): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  if (!y || !m || !d) return dateStr;
  const dateObj = new Date(y, m - 1, d);
  const dayOfWeek = dateObj.getDay();
  const thaiDay = THAI_DAYS_FULL[dayOfWeek];
  const thaiMonthFull = THAI_MONTHS_FULL[m - 1];
  const thaiMonthShort = THAI_MONTHS_SHORT[m - 1];
  const thaiYear = y + 543;

  if (format === "short") {
    return `${d} ${thaiMonthShort} ${thaiYear}`;
  }
  return `${thaiDay}ที่ ${d} ${thaiMonthFull} ${thaiYear}`;
}

/** Compute availability status for any date in YYYY-MM-DD format */
export function getDayAvailability(dateStr: string): { status: DaySlotStatus; dayName: string } {
  // Check override from mock data first
  const existing = mockAvailabilityDays.find((d) => d.date === dateStr);
  if (existing) {
    return { status: existing.status, dayName: existing.dayName };
  }

  const [y, m, d] = dateStr.split("-").map(Number);
  const dateObj = new Date(y, m - 1, d);
  const dayOfWeek = dateObj.getDay();
  const dayName = THAI_DAYS_FULL[dayOfWeek];

  // Past check (assuming base reference 2026-08-15)
  const today = new Date(2026, 7, 15); // 2026-08-15
  if (dateObj < today) {
    return { status: "past", dayName };
  }

  // Deterministic realistic pattern for studio
  const daySum = (y + m * 31 + d) % 10;
  if (daySum === 0) return { status: "full", dayName };
  if (daySum === 1 || daySum === 2) return { status: "morning_only", dayName };
  if (daySum === 3 || daySum === 4) return { status: "evening_only", dayName };
  if (daySum === 9) return { status: "closed", dayName };
  return { status: "both_free", dayName };
}
