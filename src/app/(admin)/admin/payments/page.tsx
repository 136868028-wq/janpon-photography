"use client";

import { useState } from "react";
import { Check, Eye, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ImageMock } from "@/components/shared/image-mock";
import { PaymentStatusBadge } from "@/components/shared/status-badge";
import { mockPayments, mockImages, mockBookings } from "@/lib/mock-data";
import type { MockPayment } from "@/lib/mock-data";

export default function AdminPaymentsPage() {
  const [selected, setSelected] = useState<MockPayment | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const queue = mockPayments.filter((p) => p.status === "slip_uploaded" || p.status === "pending");
  const history = mockPayments.filter((p) => p.status !== "slip_uploaded" && p.status !== "pending");

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">ตรวจสอบหลักฐานการชำระเงิน</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          ตรวจสอบสลิป → อนุมัติ หรือ แจ้งปฏิเสธ — ทุกการกระทำจะถูกบันทึกใน Audit Log
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            คิวรอตรวจสอบ
            <Badge className="bg-amber-500">{queue.length} รายการ</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {queue.map((p) => (
              <div key={p.id} className="rounded-xl border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold">{p.customerName}</p>
                    <p className="text-xs text-muted-foreground">{p.code} · {p.uploadedAt}</p>
                  </div>
                  <PaymentStatusBadge status={p.status} />
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">ยอดมัดจำที่ต้องชำระ</span>
                  <span className="font-heading text-lg font-extrabold text-brand-strong">{p.amount.toLocaleString("th-TH")} บาท</span>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="outline" className="h-9 flex-1" onClick={() => setSelected(p)}>
                    <Eye className="size-4" /> ดูสลิป
                  </Button>
                </div>
              </div>
            ))}
            {queue.length === 0 && (
              <p className="col-span-full rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                ไม่มีรายการรอตรวจสอบ — สบายใจได้
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">ประวัติการตรวจสอบ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="pb-2 font-medium">รหัส</th>
                  <th className="pb-2 font-medium">ลูกค้า</th>
                  <th className="pb-2 font-medium">ยอด</th>
                  <th className="pb-2 font-medium">สถานะ</th>
                  <th className="pb-2 font-medium">สาเหตุ/หมายเหตุ</th>
                </tr>
              </thead>
              <tbody>
                {history.map((p) => (
                  <tr key={p.id} className="border-b last:border-0">
                    <td className="py-2.5 font-mono text-xs font-bold tracking-wider">{p.code}</td>
                    <td className="py-2.5">{p.customerName}</td>
                    <td className="py-2.5">{p.amount.toLocaleString("th-TH")} บาท</td>
                    <td className="py-2.5"><PaymentStatusBadge status={p.status} /></td>
                    <td className="py-2.5 text-xs text-muted-foreground">{p.rejectionReason ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={selected !== null} onOpenChange={(open) => { if (!open) setSelected(null); }}>
        {selected && (
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>ตรวจสอบหลักฐาน · {selected.code}</DialogTitle>
              <DialogDescription>
                {selected.customerName} · อัปโหลดเมื่อ {selected.uploadedAt}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="rounded-xl bg-sand p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">มัดจำต้องชำระ</span>
                  <span className="font-heading text-xl font-extrabold text-brand-strong">{selected.amount.toLocaleString("th-TH")} บาท</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">อ้างอิง: {mockBookings.find((b) => b.code === selected.code)?.serviceName ?? "-"}</p>
              </div>
              <div>
                <p className="mb-1.5 text-xs font-semibold text-muted-foreground">สลิปการโอนเงิน (ไฟล์ส่วนตัว)</p>
                <div className="overflow-hidden rounded-xl border bg-white p-2">
                  <ImageMock image={mockImages.slip} aspect="aspect-[3/4]" rounded={false} />
                </div>
                <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <ShieldCheck className="size-3.5 text-emerald-600" />
                  มองเห็นได้เฉพาะผู้มีสิทธิ์ตรวจสอบ (signed URL · หมดอายุอัตโนมัติ)
                </p>
              </div>
              <Separator />
              {selected.status === "rejected" ? (
                <div className="rounded-lg border border-red-600/25 bg-red-500/5 p-3 text-sm">
                  <p className="font-semibold text-red-700 dark:text-red-300">หลักฐานนี้ถูกปฏิเสธไปแล้ว</p>
                  <p className="mt-1 text-xs text-red-700/80 dark:text-red-300/80">สาเหตุ: {selected.rejectionReason}</p>
                </div>
              ) : (
                <>
                  <div className="space-y-1.5">
                    <Label htmlFor="reject-reason">เหตุผลปฏิเสธ (ถ้ามี)</Label>
                    <Input
                      id="reject-reason"
                      placeholder="เช่น ยอดเงินไม่ตรง / สลิปไม่ชัดเจน / ตรวจไม่พบการโอน"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    เมื่ออนุมัติ → payment: <strong>verified</strong>, booking: <strong>confirmed</strong> และแจ้งลูกค้าอัตโนมัติ
                  </p>
                </>
              )}
            </div>
            <DialogFooter className="gap-2 sm:justify-between">
              {selected.status !== "rejected" && (
                <>
                  <Button variant="destructive" className="h-9" onClick={() => { setSelected(null); setRejectReason(""); }}>
                    <X className="size-4" /> ปฏิเสธหลักฐาน
                  </Button>
                  <Button size="lg" className="h-9 bg-emerald-600 hover:bg-emerald-700" onClick={() => { setSelected(null); setRejectReason(""); }}>
                    <Check className="size-4" /> ยืนยันการชำระเงิน
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}