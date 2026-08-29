"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Calendar as CalendarIcon, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/public/page-header";
import { SectionHeading } from "@/components/public/section-heading";
import { ThaiBookingCalendar } from "@/components/booking/thai-calendar";
import { mockAvailabilitySlots } from "@/lib/mock-data";
import { formatThaiDate } from "@/lib/thai-calendar";

export default function AvailabilityPage() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<string | null>("2026-08-15");

  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
  };

  return (
    <>
      <PageHeader>
        <SectionHeading
          eyebrow="ตรวจวันว่าง"
          title="ดูความพร้อมของคิวล่วงหน้า 12 เดือน"
          subtitle="ปฏิทินไทยครบทั้ง 12 เดือน (วันที่ 1 - 31) อัปเดตสถานะคิวแบบเรียลไทม์"
          className="[&_h2]:text-white [&_p]:text-white/80"
        />
      </PageHeader>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ThaiBookingCalendar
              selectedDate={selectedDate}
              onSelectDate={handleSelectDate}
            />
          </div>

          <div className="space-y-4">
            {selectedDate && (
              <Card className="border-brand/40 shadow-md">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 text-brand-strong">
                    <CalendarIcon className="size-5" />
                    <h3 className="font-heading text-base font-bold">วันที่เลือกดูคิว</h3>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-foreground">
                    {formatThaiDate(selectedDate, "full")}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    มีคิวเปิดรับทั้งช่วงเช้า (09:00-13:00) และช่วงบ่าย (13:00-17:00)
                  </p>
                  <Link href={`/book?date=${selectedDate}`} className="mt-4 block">
                    <Button size="lg" className="h-10 w-full bg-brand text-brand-fg hover:bg-brand-strong">
                      จองคิววันนี้เลย <ArrowRight className="size-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="p-5">
                <h3 className="font-heading text-base font-bold">รอบเวลาการให้บริการ</h3>
                <div className="mt-3 space-y-2">
                  {mockAvailabilitySlots.map((s) => (
                    <div key={s.slot} className="flex items-center justify-between rounded-lg border px-3 py-2.5 text-sm">
                      <span className="font-medium">
                        {s.slot} <span className="text-xs text-muted-foreground">{s.range}</span>
                      </span>
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                        เปิดรับจอง
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <h3 className="font-heading text-base font-bold">จองคิวถ่ายภาพ</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  เลือกบริการและแพ็กเกจที่คุณต้องการ จากนั้นเลือกวันเวลาที่สะดวกได้ทันที
                </p>
                <Link href="/book" className="mt-4 block">
                  <Button size="lg" variant="black" className="h-10 w-full font-medium">
                    ไปหน้าจองคิวทั้งหมด <ArrowRight className="size-4" />
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