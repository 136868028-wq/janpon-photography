import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/public/section-heading";
import { DayStatusPill } from "@/components/booking/slot-status";
import { mockAvailabilityDays, mockAvailabilitySlots } from "@/lib/mock-data";

export const metadata = { title: "ตรวจวันว่าง" };

export default function AvailabilityPage() {
  return (
    <>
      <section className="bg-coal py-14 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading
            eyebrow="ตรวจวันว่าง"
            title="ดูความพร้อมของคิวล่วงหน้า 90 วัน"
            subtitle="อัปเดตแบบเรียลไทม์ — ถ้าเห็นว่าว่าง แปลว่าจองได้ทันที (คิวถูกล็อกเมื่อถึงขั้นตอนชำระเงิน)"
          />
          <div className="mx-auto mt-6 flex max-w-xl flex-wrap items-center justify-center gap-2 text-xs">
            <DayStatusPill status="both_free" />
            <DayStatusPill status="morning_only" />
            <DayStatusPill status="evening_only" />
            <DayStatusPill status="full" />
            <DayStatusPill status="closed" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="font-heading text-base font-bold">เดือนสิงหาคม 2569</h2>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" disabled aria-label="เดือนก่อนหน้า">‹</Button>
                    <Button size="sm" aria-label="เดือนถัดไป">›</Button>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-7 gap-1.5 text-center">
                  {["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"].map((d) => (
                    <div key={d} className="py-1 text-[11px] font-semibold text-muted-foreground">{d}</div>
                  ))}
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={`empty-${i}`} className="min-h-16" aria-hidden />
                  ))}
                  {mockAvailabilityDays.map((day) => (
                    <Link
                      key={day.date}
                      href={`/book?date=${day.date}`}
                      aria-label={`${day.dayName} ${day.date} สถานะ ${day.status}`}
                      className={`flex min-h-16 flex-col items-center justify-center gap-0.5 rounded-lg p-1 text-center text-[11px] transition-colors ${
                        day.status === "past" || day.status === "closed" || day.status === "full"
                          ? "bg-muted/60 text-muted-foreground opacity-60"
                          : day.status === "both_free"
                            ? "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 dark:text-emerald-300"
                            : day.status === "morning_only"
                              ? "bg-sky-500/10 text-sky-700 hover:bg-sky-500/20 dark:text-sky-300"
                              : "bg-violet-500/10 text-violet-700 hover:bg-violet-500/20 dark:text-violet-300"
                      }`}
                    >
                      <span className="font-bold">{Number(day.date.slice(-2))}</span>
                      <span className="truncate px-0.5">
                        {day.status === "both_free" ? "ว่างเช้า/เย็น" : day.status === "morning_only" ? "เช้าว่าง" : day.status === "evening_only" ? "เย็นว่าง" : day.status === "full" ? "เต็ม" : day.status === "closed" ? "ปิด" : "ผ่านมา"}
                      </span>
                    </Link>
                  ))}
                </div>
                <p className="mt-4 text-[11px] text-muted-foreground">
                  สถานะวันว่างอ้างอิงจากระบบสำรองจองแบบเรียลไทม์ — วันที่ผ่านมาและวันที่ปิดรับจองไม่สามารถเลือกได้
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardContent className="p-5">
                <h3 className="font-heading text-base font-bold">ตัวอย่างช่วงเวลาวันนี้</h3>
                <div className="mt-3 space-y-2">
                  {mockAvailabilitySlots.map((s) => (
                    <div key={s.slot} className="flex items-center justify-between rounded-lg border px-3 py-2.5 text-sm">
                      <span className="font-medium">{s.slot} <span className="text-xs text-muted-foreground">{s.range}</span></span>
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-300">ว่าง</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <h3 className="font-heading text-base font-bold">จองเลยวันนี้</h3>
                <p className="mt-2 text-sm text-muted-foreground">เห็นคิวว่างแล้วรออะไร? จองได้ในไม่กี่คลิก</p>
                <Link href="/book" className="mt-4 block">
                  <Button size="lg" className="h-10 w-full bg-brand text-brand-fg hover:bg-brand-strong">
                    ไปหน้าเลือกบริการ <ArrowRight className="size-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}