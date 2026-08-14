import Link from "next/link";
import { CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PaymentStatusBadge } from "@/components/shared/status-badge";

export const metadata = { title: "สถานะการชำระเงิน" };

export default function PaymentSuccessPage() {
  return (
    <div className="bg-sand/60">
      <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 py-12 text-center">
        <Card className="w-full">
          <CardContent className="p-10">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-500/10">
              <CheckCircle2 className="size-9 text-emerald-600" />
            </div>
            <h1 className="mt-5 font-heading text-2xl font-extrabold">ได้รับหลักฐานการชำระเงินแล้ว</h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              ขอบคุณที่ชำระมัดจำ <strong>500 บาท</strong> — หลักฐานของคุณกำลังรอการตรวจสอบจากทีมงาน
              (ปกติภายใน 1 ชั่วโมง ในเวลาทำการ)
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-amber-600/30 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-700 dark:text-amber-300">
              <Clock className="size-4" />
              ยังไม่ถือว่า “ชำระเงินสำเร็จ” จนกว่าจะผ่านการตรวจสอบ
            </div>
            <div className="mt-6 flex items-center justify-center">
              <PaymentStatusBadge status="slip_uploaded" />
            </div>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/booking/JN4M8T2W">
                <Button size="lg" className="h-10 w-full sm:w-auto">ติดตามสถานะการจอง</Button>
              </Link>
              <Link href="/my-booking">
                <Button size="lg" variant="outline" className="h-10 w-full sm:w-auto">ค้นหาการจองอื่น</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}