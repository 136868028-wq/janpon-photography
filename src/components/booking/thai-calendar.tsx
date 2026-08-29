"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DayStatusPill } from "@/components/booking/slot-status";
import {
  THAI_MONTHS_FULL,
  THAI_DAYS_SHORT,
  getDaysInMonth,
  getFirstDayOfWeek,
  toBuddhistYear,
  getDayAvailability,
  formatThaiDate,
} from "@/lib/thai-calendar";
import { cn } from "@/lib/utils";

interface ThaiBookingCalendarProps {
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  className?: string;
}

export function ThaiBookingCalendar({
  selectedDate,
  onSelectDate,
  className,
}: ThaiBookingCalendarProps) {
  // Parse initial year and month from selectedDate or default to 2026 (August / month index 7)
  const initialDateObj = selectedDate
    ? new Date(selectedDate)
    : new Date(2026, 7, 15);

  const [currentYear, setCurrentYear] = useState<number>(initialDateObj.getFullYear() || 2026);
  const [currentMonth, setCurrentMonth] = useState<number>(
    isNaN(initialDateObj.getMonth()) ? 7 : initialDateObj.getMonth(),
  );

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfWeek = getFirstDayOfWeek(currentYear, currentMonth);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleMonthChange = (newMonth: number) => {
    setCurrentMonth(newMonth);
  };

  const handleYearChange = (newYear: number) => {
    setCurrentYear(newYear);
  };

  const availableYears = [2026, 2027, 2028];

  return (
    <div className={cn("rounded-2xl border bg-card p-4 sm:p-6 shadow-sm", className)}>
      {/* Calendar Top Navigation Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-brand/15 text-brand-strong">
            <CalendarIcon className="size-5" />
          </span>
          <div>
            <h3 className="font-heading text-lg font-bold">
              {THAI_MONTHS_FULL[currentMonth]} {toBuddhistYear(currentYear)}
            </h3>
            <p className="text-xs text-muted-foreground">ปฏิทินแสดงคิวว่างล่วงหน้า 12 เดือน (วันที่ 1 - {daysInMonth})</p>
          </div>
        </div>

        {/* Month & Year Selectors with Next/Prev Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handlePrevMonth}
            aria-label="เดือนก่อนหน้า"
            className="size-8"
          >
            <ChevronLeft className="size-4" />
          </Button>

          {/* 12 Months Dropdown */}
          <select
            value={currentMonth}
            onChange={(e) => handleMonthChange(Number(e.target.value))}
            className="h-8 rounded-lg border border-input bg-background px-2.5 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-brand"
            aria-label="เลือกเดือน"
          >
            {THAI_MONTHS_FULL.map((monthName, idx) => (
              <option key={idx} value={idx}>
                {monthName}
              </option>
            ))}
          </select>

          {/* Year Dropdown in Buddhist Era */}
          <select
            value={currentYear}
            onChange={(e) => handleYearChange(Number(e.target.value))}
            className="h-8 rounded-lg border border-input bg-background px-2.5 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-brand"
            aria-label="เลือกปี"
          >
            {availableYears.map((year) => (
              <option key={year} value={year}>
                พ.ศ. {toBuddhistYear(year)}
              </option>
            ))}
          </select>

          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleNextMonth}
            aria-label="เดือนถัดไป"
            className="size-8"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="my-4 flex flex-wrap items-center justify-center gap-2 border-b pb-4 text-xs">
        <DayStatusPill status="both_free" />
        <DayStatusPill status="morning_only" />
        <DayStatusPill status="evening_only" />
        <DayStatusPill status="full" />
        <DayStatusPill status="closed" />
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1.5 text-center">
        {THAI_DAYS_SHORT.map((dayName, idx) => (
          <div
            key={dayName}
            className={cn(
              "py-1.5 text-xs font-bold",
              idx === 0
                ? "text-red-500" // อาทิตย์
                : idx === 6
                  ? "text-purple-600 dark:text-purple-400" // เสาร์
                  : "text-muted-foreground",
            )}
          >
            {dayName}
          </div>
        ))}

        {/* Empty cells before day 1 */}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="min-h-16 rounded-lg bg-muted/20" aria-hidden />
        ))}

        {/* Days 1 to 31 */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNumber = i + 1;
          const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(dayNumber).padStart(2, "0")}`;
          const { status } = getDayAvailability(dateString);
          const isSelected = selectedDate === dateString;
          const isDisabled = status === "past" || status === "closed" || status === "full";

          return (
            <button
              key={dateString}
              type="button"
              disabled={isDisabled}
              onClick={() => onSelectDate(dateString)}
              aria-pressed={isSelected}
              className={cn(
                "group relative flex min-h-16 flex-col items-center justify-between rounded-xl border p-1 text-center transition-all",
                isSelected
                  ? "border-brand bg-brand/10 ring-2 ring-brand/50 shadow-sm"
                  : "border-border/80 bg-card hover:border-brand/50 hover:bg-muted/40",
                isDisabled && "cursor-not-allowed opacity-40 hover:border-border hover:bg-transparent",
                status === "both_free" && !isSelected && "hover:bg-emerald-500/5",
                status === "morning_only" && !isSelected && "hover:bg-sky-500/5",
                status === "evening_only" && !isSelected && "hover:bg-violet-500/5",
              )}
            >
              {/* Day Number (1-31) */}
              <span
                className={cn(
                  "text-sm font-extrabold",
                  isSelected
                    ? "text-brand-strong"
                    : isDisabled
                      ? "text-muted-foreground"
                      : "text-foreground",
                )}
              >
                {dayNumber}
              </span>

              {/* Status Badge */}
              <span
                className={cn(
                  "w-full truncate rounded px-1 py-0.5 text-[9px] font-medium sm:text-[10px]",
                  status === "both_free" && "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
                  status === "morning_only" && "bg-sky-500/10 text-sky-700 dark:text-sky-300",
                  status === "evening_only" && "bg-violet-500/10 text-violet-700 dark:text-violet-300",
                  status === "full" && "bg-red-500/10 text-red-700 dark:text-red-300",
                  status === "closed" && "bg-muted text-muted-foreground",
                  status === "past" && "bg-muted/40 text-muted-foreground/60",
                )}
              >
                {status === "both_free"
                  ? "เช้า/บ่าย"
                  : status === "morning_only"
                    ? "เช้าว่าง"
                    : status === "evening_only"
                      ? "บ่ายว่าง"
                      : status === "full"
                        ? "เต็ม"
                        : status === "closed"
                          ? "ปิด"
                          : "ผ่านมา"}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Date Notice */}
      {selectedDate && (
        <div className="mt-4 rounded-xl bg-brand/10 p-3 text-center text-xs font-semibold text-brand-strong sm:text-sm">
          ✓ เลือกวันที่: <span className="font-bold">{formatThaiDate(selectedDate, "full")}</span>
        </div>
      )}
    </div>
  );
}
