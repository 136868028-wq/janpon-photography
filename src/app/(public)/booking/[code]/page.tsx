import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock,
  FileUp,
  MessageCircle,
  RotateCcw,
  ShieldCheck,
  Wallet,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BookingStatusBadge, PaymentStatusBadge } from "@/components/shared/status-badge";
import { mockBookings } from "@/lib/mock-data";
import { BUSINESS } from "@/constants/booking";

const TIMELINE: Record<string, { label: string; desc: string }[]> = {
  pending_verification: [
    { label: "จองคิว", desc: "เลือกรายละเอียดการจองเรียบร้อย" },
    { label: "ล็อกคิวและชำระเงิน", desc: "ชำระมัดจำผ่าน PromptPay เรียบร้อย" },
    { label: "อัปโหลดหลักฐาน", desc: "ระบบได้รับสลิปแล้ว" },
    { label: "รอตรวจสอบ", desc: "ทีมงานกำลังตรวจสอบหลักฐาน" },
  ],
  confirmed: [
    { label: "จองคิว", desc: "เลือกรายละเอียดการจองเรียบร้อย" },
    { label: "ล็อกคิวและชำระเงิน", desc: "ชำระมัดจำผ่าน PromptPay เรียบร้อย" },
    { label: "อัปโหลดหลักฐาน", desc: "ระบบได้รับสลิปแล้ว" },
    { label: "ยืนยันคิวแล้ว", desc: "ทีมงานตรวจสอบหลักฐานเรียบร้อย" },
  ],
  rejected_fallback: [
    { label: "หลักฐานไม่ถูกต้อง", desc: "ทีมงานแจ้งว่าสลิปมีปัญหา กรุณาอัปโหลดใหม่" },
  ],
};

export default async function BookingDetailPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const booking = mockBookings.find((b) => b.code === code.toUpperCase());
  if (!booking) notFound();
  const rejected = booking.paymentStatus === "rejected";
  const timeline = rejected ? TIMELINE.rejected_fallback : TIMELINE[booking.status] ?? TIMELINE.pending_verification;

  return (
    <div className="bg-sand/60">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
        <Link href="/my-booking" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> ค้นหาการจอง
        </Link>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <h1 className="font-heading text-xl font-bold sm:text-2xl">การจอง {booking.code}</h1>
          <BookingStatusBadge status={booking.status} />
          <PaymentStatusBadge status={booking.paymentStatus} />
        </div>
        <p className="mt-1 text-sm text-muted-foreground">กรุณาเก็บหน้านี้หรือรหัสการจองไว้ เพื่อติดตามสถานะ</p>

        {rejected && (
          <Card className="mt-5 border-red-600/25 bg-red-500/5">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <XCircle className="mt-0.5 size-5 shrink-0 text-red-600" />
                <div>
                  <h2 className="text-sm font-bold text-red-700 dark:text-red-300">หลักฐานการชำระเงินไม่ถูกต้อง</h2>
                  <p className="mt-1 text-sm text-red-700/80 dark:text-red-300/80">
                    {booking.note ?? "ยอดเงินไม่ตรงกับมัดจำที่ต้องชำระ"} — กรุณาอัปโหลดสลิปใหม่ภายในเวลาที่กำหนด
                  </p>
                  <Link href={`/payment/${booking.code}`} className="mt-3 inline-block">
                    <Button size="sm" className="h-9">
                      <FileUp className="size-4" /> อัปโหลดสลิปใหม่
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {booking.status === "holding" || booking.status === "pending_payment" ? (
          <Card className="mt-5">
            <CardContent className="flex flex-col items-start gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 size-5 shrink-0 text-amber-600" />
                <div>
                  <h2 className="text-sm font-bold">ยังไม่ได้ชำระเงิน</h2>
                  <p className="mt-1 text-sm text-muted-foreground">คิวถูกล็อกไว้ชั่วคราว 10 นาที — ชำระมัดจำเพื่อยืนยันคิว</p>
                </div>
              </div>
              <Link href={`/payment/${booking.code}`}>
                <Button size="lg" className="h-10 shrink-0 bg-brand text-brand-fg hover:bg-brand-strong">ไปชำระเงิน</Button>
              </Link>
            </CardContent>
          </Card>
        ) : null}

        {booking.status === "confirmed" || booking.status === "completed" ? (
          <Card className="mt-5 border-emerald-600/25 bg-emerald-500/5">
            <CardContent className="flex items-start gap-3 p-5">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />
              <div>
                <h2 className="text-sm font-bold text-emerald-700 dark:text-emerald-300">คิวของคุณยืนยันเรียบร้อยแล้ว</h2>
                <p className="mt-1 text-sm text-emerald-700/80 dark:text-emerald-300/80">
                  เจอกันวันที่ {booking.date} เวลา {booking.startTime} - {booking.endTime} น. ที่ {BUSINESS.address}
                  — เราจะส่งรายละเอียดให้ก่อนวันงาน 1 วัน
                </p>
              </div>
            </CardContent>
          </Card>
        ) : null}

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Card>
            <CardContent className="p-5">
              <h2 className="flex items-center gap-2 font-heading text-base font-bold">
                <CalendarDays className="size-4 text-brand-strong" /> รายละเอียดการจอง
              </h2>
              <dl className="mt-4 space-y-2.5 text-sm">
                {[
                  ["บริการ", booking.serviceName],
                  ["แพ็กเกจ", booking.packageName ?? "-"],
                  ["ช่างภาพ", booking.photographer],
                  ["วันที่", booking.date],
                  ["เวลา", `${booking.startTime} - ${booking.endTime} น.`],
                  ["ช่องทาง", booking.source],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="text-right font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <h2 className="flex items-center gap-2 font-heading text-base font-bold">
                <Wallet className="size-4 text-brand-strong" /> การเงิน
              </h2>
              <dl className="mt-4 space-y-2.5 text-sm">
                {[
                  ["ค่าบริการ", `${(booking.deposit + booking.remaining).toLocaleString("th-TH")} บาท`],
                  ["มัดจำ", `${booking.deposit.toLocaleString("th-TH")} บาท`],
                  ["ค้างชำระ", `${booking.remaining.toLocaleString("th-TH")} บาท`],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className={k === "มัดจำ" ? "font-heading font-bold text-brand-strong" : "font-medium"}>{v}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-5">
          <CardContent className="p-5">
            <h2 className="font-heading text-base font-bold">สถานะการจอง</h2>
            <ol className="mt-5 space-y-0">
              {timeline.map((t, i) => (
                <li key={t.label} className="relative flex gap-3 pb-6 last:pb-0">
                  {i < timeline.length - 1 && <span className="absolute left-[11px] top-6 h-full w-px bg-border" aria-hidden />}
                  <span className={i === timeline.length - 1 ? "z-10 flex size-6 shrink-0 items-center justify-center rounded-full bg-brand text-brand-fg" : "z-10 flex size-6 shrink-0 items-center justify-center rounded-full bg-muted"}>
                    <CheckCircle2 className="size-3.5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{t.label}</p>
                    <p className="text-xs text-muted-foreground">{t.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        <Card className="mt-5">
          <CardContent className="p-5">
            <h2 className="font-heading text-base font-bold">ความช่วยเหลือ</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              ต้องการเลื่อนนัดหรือยกเลิกการจอง? ติดต่อทีมงานผ่านช่องทางด้านล่าง
              เจ้าหน้าที่จะช่วยเหลือและแจ้งเงื่อนไขการคืนมัดจำให้ทราบ
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm" variant="outline" className="h-9">
                <MessageCircle className="size-4" /> LINE: {BUSINESS.lineId}
              </Button>
              <Button size="sm" variant="outline" className="h-9">
                <RotateCcw className="size-4" /> ขอเลื่อนนัด
              </Button>
              <Button size="sm" variant="destructive" className="h-9">
                <XCircle className="size-4" /> ขอยกเลิกการจอง
              </Button>
            </div>
            <Separator className="my-4" />
            <p className="flex items-start gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" />
              ข้อมูลส่วนตัวของคุณถูกเก็บเป็นความลับตามนโยบาย PDPA — ไม่แสดงข้อมูลต่อสาธารณะ
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}