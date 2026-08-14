"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Download,
  FileUp,
  ShieldCheck,
  Upload,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ImageMock } from "@/components/shared/image-mock";
import { BookingStatusBadge, PaymentStatusBadge } from "@/components/shared/status-badge";
import { mockBookings, mockPaymentSettings } from "@/lib/mock-data";
import { HOLD_DURATION_MINUTES, BUSINESS } from "@/constants/booking";

export default function PaymentPage() {
  const params = useParams<{ code: string }>();
  const booking = mockBookings.find((b) => b.code === params.code.toUpperCase());
  if (!booking) notFound();

  const [slipUploaded, setSlipUploaded] = useState(booking.status === "pending_verification");
  const [minutesLeft, setMinutesLeft] = useState(HOLD_DURATION_MINUTES);

  useEffect(() => {
    if (slipUploaded) return;
    const id = setInterval(() => setMinutesLeft((m) => Math.max(0, m - 1)), 60000);
    return () => clearInterval(id);
  }, [slipUploaded]);

  const amount = booking.deposit;

  return (
    <div className="bg-sand/60">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
        <Link href={`/booking/${booking.code}`} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> กลับไปหน้ารายละเอียดการจอง
        </Link>

        <div className="mt-4">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-heading text-xl font-bold sm:text-2xl">ชำระมัดจำ</h1>
            <BookingStatusBadge status={booking.status} />
            <PaymentStatusBadge status={booking.paymentStatus} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            การจอง <span className="font-bold tracking-widest text-foreground">{booking.code}</span> · {booking.serviceName} · {booking.date}
          </p>
        </div>

        {booking.status === "expired" || booking.status === "cancelled" ? (
          <Card className="mt-6">
            <CardContent className="p-8 text-center">
              <XCircle className="mx-auto size-10 text-muted-foreground" />
              <h2 className="mt-3 font-heading text-lg font-bold">ไม่สามารถชำระเงินได้</h2>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                การจองนี้ถูกยกเลิกหรือหมดอายุแล้ว — คิวถูกปล่อยกลับคืน หากต้องการจองใหม่ กรุณาเลือกวันเวลาใหม่
              </p>
              <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
                <Link href="/book"><Button size="lg" className="h-10">จองใหม่</Button></Link>
                <Link href="/my-booking"><Button size="lg" variant="outline" className="h-10">ติดต่อทีมงาน</Button></Link>
              </div>
            </CardContent>
          </Card>
        ) : slipUploaded ? (
          <Card className="mt-6">
            <CardContent className="p-8 text-center">
              <CheckCircle2 className="mx-auto size-12 text-emerald-600" />
              <h2 className="mt-4 font-heading text-xl font-bold">ได้รับหลักฐานการชำระเงินแล้ว</h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                ขอบคุณที่ชำระเงิน ขณะนี้หลักฐานของคุณอยู่ระหว่างการตรวจสอบจากทีมงาน
                (ปกติภายใน 1 ชั่วโมง ในเวลาทำการ) — เมื่อตรวจสอบเรียบร้อยจะแจ้งยืนยันคิวทันที
              </p>
              <div className="mx-auto mt-5 max-w-sm rounded-xl border border-amber-600/25 bg-amber-500/5 p-4 text-sm text-amber-700 dark:text-amber-300">
                หมายเหตุ: การจองจะถือว่า “ยืนยันแล้ว” ต่อเมื่อทีมงานตรวจสอบหลักฐานเรียบร้อยเท่านั้น
              </div>
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <Link href={`/booking/${booking.code}`}>
                  <Button size="lg" className="h-10 w-full sm:w-auto">ติดตามสถานะการจอง</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {minutesLeft > 0 ? (
              <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-amber-600/30 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-700 dark:text-amber-300">
                <Clock className="size-4" /> คิวถูกล็อก · เหลือเวลาชำระเงิน {minutesLeft} นาที
              </div>
            ) : (
              <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-red-600/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-700 dark:text-red-300">
                คิวหมดอายุ — กรุณาจองใหม่
              </div>
            )}

            <div className="mt-4 grid gap-5 lg:grid-cols-2">
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-xs font-medium text-muted-foreground">ยอดชำระ (มัดจำ)</p>
                  <p className="mt-1 font-heading text-4xl font-extrabold tracking-tight">
                    {amount.toLocaleString("th-TH")} <span className="text-lg font-medium">บาท</span>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">PromptPay / {mockPaymentSettings.bankName}</p>
                  <div className="mx-auto mt-5 w-56">
                    <ImageMock image={mockPaymentSettings.qrImage} aspect="aspect-square" className="border" />
                  </div>
                  <p className="mt-4 text-sm font-semibold">{mockPaymentSettings.accountName}</p>
                  <p className="text-xs text-muted-foreground">เลขพร้อมเพย์ {mockPaymentSettings.promptpayId}</p>
                  <Button size="sm" variant="outline" className="mt-4 h-8">
                    <Download className="size-3.5" /> บันทึก QR
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="flex items-center gap-2 font-heading text-base font-bold">
                    <Upload className="size-4 text-brand-strong" /> อัปโหลดสลิปการชำระเงิน
                  </h2>
                  <ol className="mt-4 space-y-2.5 text-sm text-muted-foreground">
                    {[
                      "โอนเงินตามยอดด้านซ้ายผ่านแอปธนาคาร",
                      "บันทึกภาพสลิปโอนเงิน (PNG/JPG) หรือ PDF",
                      "อัปโหลดไฟล์ด้านล่าง",
                      "รอทีมงานตรวจสอบ ภายใน 1 ชม. (เวลาทำการ)",
                    ].map((text, i) => (
                      <li key={text} className="flex items-start gap-2.5">
                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand/10 text-xs font-bold text-brand-strong">{i + 1}</span>
                        {text}
                      </li>
                    ))}
                  </ol>
                  <label className="mt-5 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 text-center transition-colors hover:border-brand/50 hover:bg-muted/40">
                    <FileUp className="size-7 text-muted-foreground" />
                    <span className="text-sm font-semibold">แตะเพื่อเลือกไฟล์สลิป</span>
                    <span className="text-xs text-muted-foreground">PNG / JPG / PDF · ไม่เกิน 5 MB</span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,application/pdf"
                      className="sr-only"
                      onChange={() => setSlipUploaded(true)}
                    />
                  </label>
                  <p className="mt-4 flex items-start gap-2 rounded-lg bg-muted/70 p-3 text-xs leading-relaxed text-muted-foreground">
                    <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                    สลิปของคุณถูกเก็บเป็นความลับ มีเพียงทีมงานที่ตรวจสอบการชำระเงินเท่านั้นที่เห็นได้
                  </p>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        <p className="mt-6 text-center text-xs text-muted-foreground">
          มีปัญหาการชำระเงิน? โทร <span className="font-semibold">{BUSINESS.phone}</span> หรือ{" "}
          <Link href="/contact" className="font-semibold text-brand-strong hover:underline">ติดต่อทีมงาน</Link>
        </p>
      </div>
    </div>
  );
}
