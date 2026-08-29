import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock,
  Copy,
  FileUp,
  MessageCircle,
  Package,
  Phone,
  ShieldCheck,
  Sparkles,
  Ticket,
  Wallet,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookingStatusBadge, PaymentStatusBadge } from "@/components/shared/status-badge";
import { getBookingByCodeAction } from "@/actions/booking";
import { formatThaiDate } from "@/lib/thai-calendar";
import { BUSINESS } from "@/constants/booking";
import { cn } from "@/lib/utils";

type TrackingStep = {
  step: number;
  title: string;
  desc: string;
  dateStr?: string;
  status: "completed" | "current" | "upcoming" | "error";
};

export default async function ParcelTrackingPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const cleanCode = code.toUpperCase();

  const res = await getBookingByCodeAction(cleanCode);
  if (!res.success || !res.booking) {
    notFound();
  }

  const booking = res.booking;
  const payment = booking.payments?.[0];

  const isHolding = booking.status === "holding";
  const isPendingPay = booking.status === "pending_payment";
  const isSlipUploaded = booking.status === "pending_verification" || payment?.status === "slip_uploaded";
  const isConfirmed = booking.status === "confirmed";
  const isCompleted = booking.status === "completed";
  const isRejected = payment?.status === "rejected";
  const isCancelled = booking.status === "cancelled";

  // Build the 6-stage parcel tracking timeline
  const trackingSteps: TrackingStep[] = [
    {
      step: 1,
      title: "ส่งคำขอจองคิวเข้าระบบ",
      desc: "ระบบได้รับข้อมูลการจองและล็อกคิวชั่วคราว",
      dateStr: booking.created_at ? new Date(booking.created_at).toLocaleString("th-TH") : "-",
      status: "completed",
    },
    {
      step: 2,
      title: "ชำระเงินมัดจำ & อัปโหลดสลิป",
      desc: payment?.slip_url
        ? "ระบบได้รับหลักฐานการโอนเงินเรียบร้อยแล้ว"
        : "รอการชำระเงินมัดจำผ่าน PromptPay",
      dateStr: payment?.uploaded_at ? new Date(payment.uploaded_at).toLocaleString("th-TH") : undefined,
      status: isHolding || isPendingPay ? "current" : "completed",
    },
    {
      step: 3,
      title: "ตรวจสอบหลักฐานการชำระเงิน",
      desc: isRejected
        ? `หลักฐานไม่ถูกต้อง: ${payment?.admin_note || "กรุณาอัปโหลดสลิปใหม่"}`
        : isSlipUploaded
          ? "เจ้าหน้าที่กำลังตรวจสอบยอดเงินในระบบ"
          : isConfirmed || isCompleted
            ? "ตรวจสอบยอดเงินมัดจำถูกต้องเรียบร้อย"
            : "รอส่งหลักฐานการชำระเงิน",
      dateStr: payment?.verified_at ? new Date(payment.verified_at).toLocaleString("th-TH") : undefined,
      status: isRejected ? "error" : isSlipUploaded ? "current" : isConfirmed || isCompleted ? "completed" : "upcoming",
    },
    {
      step: 4,
      title: "อนุมัติคิวถ่ายภาพ (ยืนยันคิว)",
      desc: isConfirmed || isCompleted
        ? "คิวงานได้รับการยืนยันเรียบร้อย ช่างภาพเตรียมพร้อมสำหรับวันงาน"
        : isRejected
          ? "คิวรอการแก้ไขหลักฐานการชำระเงิน"
          : "รอดำเนินการอนุมัติหลังตรวจสลิป",
      status: isConfirmed || isCompleted ? "completed" : isRejected ? "error" : "upcoming",
    },
    {
      step: 5,
      title: "วันถ่ายภาพตามนัดหมาย",
      desc: `นัดหมายวันที่ ${formatThaiDate(booking.date, "full")} (${booking.slot === "morning" ? "09:00 - 13:00 น." : booking.slot === "evening" ? "13:00 - 17:00 น." : "เต็มวัน 09:00 - 17:00 น."})`,
      status: isCompleted ? "completed" : isConfirmed ? "current" : "upcoming",
    },
    {
      step: 6,
      title: "แต่งภาพ & ส่งมอบงานเสร็จสมบูรณ์",
      desc: isCompleted ? "ส่งมอบไฟล์ภาพคุณภาพสูงให้ลูกค้าเรียบร้อย" : "ปรับแต่งแสงสีและส่งมอบไฟล์ภาพ",
      status: isCompleted ? "completed" : "upcoming",
    },
  ];

  return (
    <div className="bg-sand/40 min-h-screen pb-16">
      {/* Top Banner */}
      <div className="bg-coal text-white py-8 px-4">
        <div className="mx-auto max-w-4xl">
          <Link href="/track" className="inline-flex items-center gap-1.5 text-xs text-white/70 hover:text-white mb-4">
            <ArrowLeft className="size-3.5" /> ค้นหารหัสอื่น
          </Link>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-brand px-2 py-0.5 text-xs font-bold text-brand-fg">
                  PARCEL TRACKING
                </span>
                <BookingStatusBadge status={booking.status} />
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight mt-2 flex items-center gap-2">
                {booking.code}
              </h1>
              <p className="text-xs text-white/70 mt-1">
                ลูกค้า: <strong>{booking.customer_name}</strong> · บริการ: {booking.service_name}
              </p>
            </div>

            <div className="flex flex-col items-start sm:items-end gap-1 text-right">
              <p className="text-xs text-white/60">ยอดมัดจำที่ชำระ</p>
              <p className="font-heading text-2xl font-extrabold text-brand">
                {booking.deposit_amount?.toLocaleString("th-TH")} ฿
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 -mt-4">
        {/* Status Callout Banner */}
        {isConfirmed && (
          <Card className="border-2 border-emerald-600 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200 shadow-md mb-6">
            <CardContent className="p-4 sm:p-5 flex items-start gap-3">
              <CheckCircle2 className="size-6 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h2 className="font-heading text-base font-bold text-emerald-800 dark:text-emerald-300">
                  🎉 คิวถ่ายภาพของคุณได้รับการอนุมัติเรียบร้อยแล้ว!
                </h2>
                <p className="text-xs sm:text-sm mt-1 text-emerald-700 dark:text-emerald-400 leading-relaxed">
                  ทีมงานตรวจสอบหลักฐานการชำระเงินมัดจำเรียบร้อย และได้ล็อกคิวช่างภาพในวันที่{" "}
                  <strong>{formatThaiDate(booking.date, "full")}</strong> เรียบร้อยแล้วครับ
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {isSlipUploaded && !isConfirmed && (
          <Card className="border-2 border-amber-500 bg-amber-500/10 text-amber-900 dark:text-amber-200 shadow-md mb-6">
            <CardContent className="p-4 sm:p-5 flex items-start gap-3">
              <Clock className="size-6 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h2 className="font-heading text-base font-bold text-amber-800 dark:text-amber-300">
                  ⏳ สลิปของคุณอยู่ในคิวรอการตรวจสอบจากทีมงาน
                </h2>
                <p className="text-xs sm:text-sm mt-1 text-amber-700 dark:text-amber-400 leading-relaxed">
                  เราได้รับหลักฐานการโอนเงินแล้ว เจ้าหน้าที่จะทำการตรวจสอบและกดอนุมัติคิวให้คุณโดยเร็ว (ปกติภายใน 1 ชั่วโมง ในเวลาทำการ)
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {isRejected && (
          <Card className="border-2 border-rose-500 bg-rose-500/10 text-rose-900 dark:text-rose-200 shadow-md mb-6">
            <CardContent className="p-4 sm:p-5 flex items-start gap-3">
              <XCircle className="size-6 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h2 className="font-heading text-base font-bold text-rose-800 dark:text-rose-300">
                  ⚠️ หลักฐานการชำระเงินไม่ถูกต้อง
                </h2>
                <p className="text-xs sm:text-sm mt-1 text-rose-700 dark:text-rose-400">
                  สาเหตุ: <strong>{payment?.admin_note || "ยอดเงินไม่ตรงกับมัดจำ หรือสลิปไม่ชัดเจน"}</strong>
                </p>
                <Link href={`/payment/${booking.code}`} className="mt-3 inline-block">
                  <Button size="sm" className="bg-rose-600 hover:bg-rose-700 text-white font-bold h-9">
                    <FileUp className="size-4 mr-1.5" /> อัปโหลดสลิปใหม่ทันที
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 md:grid-cols-3">
          {/* Left 2 Cols: Visual Tracking Timeline Stepper */}
          <div className="md:col-span-2 space-y-6">
            <Card className="border shadow-sm">
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Package className="size-4 text-brand-strong" />
                  ไทม์ไลน์ขั้นตอนสถานะคิวงาน (Live Timeline)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {trackingSteps.map((s, idx) => (
                    <div key={s.step} className="relative flex gap-4">
                      {/* Timeline connecting line */}
                      {idx < trackingSteps.length - 1 && (
                        <div
                          className={cn(
                            "absolute left-4 top-8 -bottom-6 w-0.5",
                            s.status === "completed" ? "bg-emerald-500" : "bg-border",
                          )}
                          aria-hidden="true"
                        />
                      )}

                      {/* Icon Bubble */}
                      <div
                        className={cn(
                          "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all",
                          s.status === "completed" && "bg-emerald-600 text-white ring-4 ring-emerald-500/20",
                          s.status === "current" && "bg-brand text-brand-fg ring-4 ring-brand/30 animate-pulse",
                          s.status === "error" && "bg-rose-600 text-white ring-4 ring-rose-500/20",
                          s.status === "upcoming" && "bg-muted text-muted-foreground border",
                        )}
                      >
                        {s.status === "completed" ? (
                          <CheckCircle2 className="size-4" />
                        ) : s.status === "error" ? (
                          <XCircle className="size-4" />
                        ) : (
                          s.step
                        )}
                      </div>

                      {/* Step Details */}
                      <div className="flex-1 pb-1">
                        <div className="flex flex-wrap items-center justify-between gap-1">
                          <h3
                            className={cn(
                              "text-sm font-bold",
                              s.status === "completed" && "text-foreground",
                              s.status === "current" && "text-brand-strong font-extrabold",
                              s.status === "error" && "text-rose-600",
                              s.status === "upcoming" && "text-muted-foreground",
                            )}
                          >
                            {s.title}
                          </h3>
                          {s.dateStr && (
                            <span className="text-[11px] font-mono text-muted-foreground">
                              {s.dateStr}
                            </span>
                          )}
                        </div>
                        <p
                          className={cn(
                            "text-xs mt-1 leading-relaxed",
                            s.status === "upcoming" ? "text-muted-foreground/80" : "text-muted-foreground",
                          )}
                        >
                          {s.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right 1 Col: Booking Summary & Quick Help */}
          <div className="space-y-4">
            <Card className="border shadow-sm">
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <CalendarDays className="size-4 text-brand-strong" /> ข้อมูลการนัดหมาย
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 text-xs space-y-3">
                <div>
                  <span className="text-muted-foreground">บริการที่เลือก:</span>
                  <p className="font-bold text-sm text-foreground">{booking.service_name}</p>
                  {booking.package_name && (
                    <p className="text-xs text-muted-foreground">{booking.package_name}</p>
                  )}
                </div>

                <div className="border-t pt-2">
                  <span className="text-muted-foreground">วันนัดถ่ายภาพ:</span>
                  <p className="font-bold text-foreground">{formatThaiDate(booking.date, "full")}</p>
                  <p className="text-xs text-brand-strong font-semibold mt-0.5">
                    {booking.slot === "morning"
                      ? "ช่วงเช้า (09:00 - 13:00 น.)"
                      : booking.slot === "evening"
                        ? "ช่วงบ่าย (13:00 - 17:00 น.)"
                        : "เต็มวัน (09:00 - 17:00 น.)"}
                  </p>
                </div>

                <div className="border-t pt-2">
                  <span className="text-muted-foreground">การเงิน:</span>
                  <div className="flex justify-between mt-1">
                    <span>ยอดรวมค่าบริการ:</span>
                    <strong>{booking.total_price?.toLocaleString("th-TH")} ฿</strong>
                  </div>
                  <div className="flex justify-between mt-1 text-emerald-600 font-bold">
                    <span>ชำระมัดจำแล้ว:</span>
                    <span>{booking.deposit_amount?.toLocaleString("th-TH")} ฿</span>
                  </div>
                  <div className="flex justify-between mt-1 text-muted-foreground">
                    <span>คงเหลือชำระวันงาน:</span>
                    <span>{Math.max(0, (booking.total_price || 0) - (booking.deposit_amount || 0)).toLocaleString("th-TH")} ฿</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-sand/60 p-4 text-xs space-y-2">
              <h4 className="font-bold text-foreground flex items-center gap-1.5">
                <MessageCircle className="size-4 text-emerald-600" /> ต้องการความช่วยเหลือ?
              </h4>
              <p className="text-muted-foreground leading-relaxed">
                หากมีข้อสงสัยหรือต้องการเลื่อนนัดหมาย สามารถติดต่อทีมงานได้ตลอดเวลา
              </p>
              <div className="pt-1">
                <a
                  href={`https://line.me/ti/p/~${BUSINESS.lineId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button size="sm" variant="outline" className="w-full h-8 text-xs font-semibold">
                    <MessageCircle className="size-3.5 mr-1 text-emerald-600" /> ติดต่อทาง LINE: {BUSINESS.lineId}
                  </Button>
                </a>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
