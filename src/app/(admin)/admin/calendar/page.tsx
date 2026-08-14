"use client";

import { useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Lock, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockBookings, mockBlockedDates, mockAvailabilityDays } from "@/lib/mock-data";
import type { BookingStatus } from "@/constants/booking";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];
const THAI_MONTHS = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];

const cellStatus: Record<BookingStatus, string> = {
  confirmed: "bg-emerald-600 text-white",
  pending_verification: "bg-amber-500 text-white",
  pending_payment: "bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-600/30",
  holding: "bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-600/30",
  completed: "bg-muted text-muted-foreground",
  cancelled: "bg-red-500/15 text-red-700 dark:text-red-300 line-through",
  expired: "bg-muted/60 text-muted-foreground/70",
  draft: "bg-muted text-muted-foreground",
  rescheduled: "bg-violet-500/15 text-violet-700 dark:text-violet-300",
  no_show: "bg-red-500/15 text-red-700 dark:text-red-300",
};

export default function AdminCalendarPage() {
  const [month, setMonth] = useState(7); // สิงหาคม (0-indexed)
  const bookingsByDate = mockBookings.filter((b) => b.date.startsWith(`2026-${String(month + 1).padStart(2, "0")}`));
  const blockedByDate = mockBlockedDates.filter((b) => b.date.startsWith(`2026-${String(month + 1).padStart(2, "0")}`));
  const availability = mockAvailabilityDays.filter((d) => d.date.startsWith(`2026-${String(month + 1).padStart(2, "0")}`));
  const daysInMonth = 31;
  const firstDayOffset = 0;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">ปฏิทินการจอง</h1>
          <p className="mt-1 text-sm text-muted-foreground">ภาพรวมคิวทุกช่างภาพในเดือนนี้</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon-sm" onClick={() => setMonth((m) => Math.max(0, m - 1))} aria-label="เดือนก่อนหน้า">
            <ChevronLeft className="size-4" />
          </Button>
          <span className="min-w-40 text-center font-heading text-sm font-bold">
            {THAI_MONTHS[month]} 2569
          </span>
          <Button variant="outline" size="icon-sm" onClick={() => setMonth((m) => Math.min(11, m + 1))} aria-label="เดือนถัดไป">
            <ChevronRight className="size-4" />
          </Button>
          <Button size="sm" className="ml-2 bg-brand text-brand-fg hover:bg-brand-strong">
            <Plus className="size-4" /> เพิ่มคิว
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
        <Badge className="bg-emerald-600">ยืนยันแล้ว</Badge>
        <Badge className="bg-amber-500">รอตรวจสอบ</Badge>
        <Badge className="bg-sky-500/20 text-sky-700 border border-sky-600/30 dark:text-sky-300">ล็อกคิว (hold)</Badge>
        <Badge className="bg-muted text-muted-foreground">เสร็จสิ้น</Badge>
        <Badge className="bg-red-500/15 text-red-700 dark:text-red-300">ยกเลิก</Badge>
        <Badge className="bg-border text-foreground">ปิดรับจอง</Badge>
      </div>

      <Card>
        <CardContent className="p-3 sm:p-5">
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {WEEKDAYS.map((d) => (
              <div key={d} className="py-2 text-center text-xs font-bold text-muted-foreground">{d}</div>
            ))}
            {Array.from({ length: firstDayOffset }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-24 rounded-lg bg-muted/30" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateKey = `2026-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const dayBookings = bookingsByDate.filter((b) => b.date === dateKey);
              const blocked = blockedByDate.find((bl) => bl.date === dateKey);
              const avail = availability.find((a) => a.date === dateKey);
              const isPast = day < 14 && month === 7;

              return (
                <div
                  key={dateKey}
                  className={cn(
                    "flex min-h-24 flex-col gap-1 rounded-lg border p-1.5 sm:p-2",
                    blocked ? "border-dashed border-foreground/25 bg-muted/50" : "border-border",
                    isPast && "opacity-50",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className={cn("text-xs font-bold", isPast && "text-muted-foreground")}>{day}</span>
                    {avail && !blocked && (
                      <span className={cn(
                        "hidden rounded px-1 text-[9px] font-semibold sm:block",
                        avail.status === "full" && "bg-red-500/15 text-red-700",
                        avail.status === "closed" && "bg-muted text-muted-foreground",
                        avail.status === "evening_only" && "bg-violet-500/15 text-violet-700",
                        avail.status === "morning_only" && "bg-sky-500/15 text-sky-700",
                        avail.status === "both_free" && "bg-emerald-500/15 text-emerald-700",
                      )}>
                        {avail.status === "both_free" ? "เช้า/เย็น" : avail.status === "morning_only" ? "เช้า" : avail.status === "evening_only" ? "เย็น" : avail.status === "full" ? "เต็ม" : "ปิด"}
                      </span>
                    )}
                  </div>
                  {blocked ? (
                    <p className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground">
                      <Lock className="size-3" /> ปิดรับจอง{blocked.endTime ? ` ${blocked.startTime}-${blocked.endTime}` : ""}
                    </p>
                  ) : (
                    dayBookings.slice(0, 3).map((b) => (
                      <button
                        key={b.id}
                        className={cn("truncate rounded px-1.5 py-0.5 text-left text-[10px] font-semibold", cellStatus[b.status])}
                        title={`${b.code} · ${b.customerName} · ${b.serviceName}`}
                      >
                        {b.startTime} {b.customerName.split(" ")[0]} · {b.serviceName.replace("ถ่าย", "")}
                      </button>
                    ))
                  )}
                  {!blocked && dayBookings.length > 3 && (
                    <p className="text-[9px] text-muted-foreground">+{dayBookings.length - 3} รายการ</p>
                  )}
                  {!blocked && dayBookings.length === 0 && avail && (
                    <p className="mt-auto text-[10px] text-muted-foreground/60">{avail.status === "both_free" ? "ว่างเช้า+เย็น" : avail.status === "morning_only" ? "ว่างเช้า" : avail.status === "evening_only" ? "ว่างเย็น" : ""}</p>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <CalendarDays className="size-5 text-brand-strong" />
            <div>
              <p className="text-sm font-semibold">สัญลักษณ์ในปฏิทิน</p>
              <p className="text-xs text-muted-foreground">สีชี้บอกสถานะคร่าวๆ — รายละเอียดสถานะจริงดูที่ป้ายข้อความในแต่ละรายการ</p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <X className="size-4" /> เลิกบล็อกวันที่เลือก
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}