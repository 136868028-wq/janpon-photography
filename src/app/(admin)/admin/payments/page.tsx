"use client";

import { useEffect, useState } from "react";
import { Check, Eye, RefreshCw, ShieldCheck, X, Wallet, CheckCircle2, XCircle } from "lucide-react";
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
import { PaymentStatusBadge } from "@/components/shared/status-badge";
import { getAdminBookingsAction, updatePaymentStatusAction } from "@/actions/admin";
import { formatThaiDate } from "@/lib/thai-calendar";
import { cn } from "@/lib/utils";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selected, setSelected] = useState<any | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const loadPayments = async () => {
    setLoading(true);
    try {
      const res = await getAdminBookingsAction();
      if (res.success && res.bookings) {
        const allPays = res.bookings.flatMap((b: any) =>
          (b.payments || []).map((p: any) => ({
            ...p,
            customerName: b.customer_name,
            phone: b.customer_phone,
            serviceName: b.service_name,
            bookingCode: b.code,
            bookingId: b.id,
          }))
        );
        setPayments(allPays);
      }
    } catch (err) {
      console.error("Failed to load payments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const handleVerify = async (status: "verified" | "rejected") => {
    if (!selected) return;
    setIsProcessing(true);
    try {
      await updatePaymentStatusAction(
        selected.id,
        status,
        selected.bookingId,
        status === "rejected" ? rejectReason : undefined
      );
      setSelected(null);
      setRejectReason("");
      await loadPayments();
    } catch (err) {
      console.error("Verification error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const queue = payments.filter((p) => p.status === "slip_uploaded" || p.status === "pending");
  const history = payments.filter((p) => p.status === "verified" || p.status === "rejected");

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">ตรวจสอบหลักฐานการชำระเงิน</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            ตรวจสอบสลิปโอนเงินมัดจำ → อนุมัติยืนยันคิว หรือ แจ้งปฏิเสธ ข้อมูลซิงค์สดจาก Supabase
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={loadPayments} disabled={loading} className="gap-1.5">
          <RefreshCw className={cn("size-3.5", loading && "animate-spin")} /> รีเฟรชข้อมูล
        </Button>
      </div>

      <Card className="border-amber-500/30">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Wallet className="size-4 text-amber-600" />
            คิวรอตรวจสอบสลิป
            <Badge className={cn(queue.length > 0 ? "bg-amber-500 text-white" : "bg-muted text-muted-foreground")}>
              {queue.length} รายการ
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {queue.map((p) => (
              <div key={p.id} className="rounded-xl border p-4 transition-colors hover:border-brand/40">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold">{p.customerName}</p>
                    <p className="font-mono text-xs font-semibold text-muted-foreground">
                      {p.bookingCode} · {p.phone}
                    </p>
                    <p className="mt-0.5 text-xs text-foreground/80">{p.serviceName}</p>
                  </div>
                  <PaymentStatusBadge status={p.status} />
                </div>
                <div className="mt-3 flex items-center justify-between text-sm border-t pt-2">
                  <span className="text-xs text-muted-foreground">ยอดมัดจำที่ต้องชำระ</span>
                  <span className="font-heading font-extrabold text-brand-strong">
                    {p.amount?.toLocaleString("th-TH")} บาท
                  </span>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="outline" className="h-8.5 w-full font-medium" onClick={() => setSelected(p)}>
                    <Eye className="size-3.5 mr-1" /> ตรวจสอบสลิป & อนุมัติ
                  </Button>
                </div>
              </div>
            ))}
            {queue.length === 0 && !loading && (
              <p className="col-span-full rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                ✨ ไม่มีรายการสลิปรอตรวจสอบในขณะนี้
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">ประวัติการตรวจสอบทั้งหมด</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="pb-2 font-medium">รหัสจอง</th>
                  <th className="pb-2 font-medium">ลูกค้า</th>
                  <th className="pb-2 font-medium">ยอดมัดจำ</th>
                  <th className="pb-2 font-medium">สถานะ</th>
                  <th className="pb-2 font-medium">วันที่ตรวจสอบ</th>
                  <th className="pb-2 font-medium">หมายเหตุ</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {history.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/40">
                    <td className="py-3 font-mono text-xs font-bold tracking-wider text-brand-strong">{p.bookingCode}</td>
                    <td className="py-3 text-xs font-semibold">{p.customerName}</td>
                    <td className="py-3 text-xs font-bold">{p.amount?.toLocaleString("th-TH")} ฿</td>
                    <td className="py-3"><PaymentStatusBadge status={p.status} /></td>
                    <td className="py-3 text-xs text-muted-foreground">
                      {p.verified_at ? new Date(p.verified_at).toLocaleString("th-TH") : "-"}
                    </td>
                    <td className="py-3 text-xs text-muted-foreground">{p.admin_note ?? "-"}</td>
                  </tr>
                ))}
                {history.length === 0 && !loading && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-xs text-muted-foreground">
                      ยังไม่มีประวัติการตรวจสอบ
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Slip Review Modal Dialog */}
      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-md sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg font-bold">
              ตรวจสอบสลิป — {selected?.bookingCode}
            </DialogTitle>
            <DialogDescription>
              ลูกค้า: <strong>{selected?.customerName}</strong> ({selected?.phone})
              <br />
              บริการ: {selected?.serviceName} · ยอดมัดจำ <strong>{selected?.amount?.toLocaleString("th-TH")} บาท</strong>
            </DialogDescription>
          </DialogHeader>

          <div className="my-2 space-y-3">
            <div className="relative overflow-hidden rounded-xl border bg-black/5 p-2 text-center">
              {selected?.slip_url ? (
                <img
                  src={selected.slip_url}
                  alt={`สลิป ${selected.bookingCode}`}
                  className="mx-auto max-h-[380px] w-auto rounded-lg object-contain"
                />
              ) : (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  <Wallet className="mx-auto size-10 text-muted-foreground/50" />
                  <p className="mt-2 font-medium">ยังไม่มีรูปภาพสลิปที่แนบมา</p>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="rej-reason" className="text-xs font-semibold">
                ระบุเหตุผล (กรณีปฏิเสธสลิป)
              </Label>
              <Input
                id="rej-reason"
                placeholder="เช่น ยอดเงินไม่ตรงกับมัดจำ, สลิปซ้ำ..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="destructive"
              disabled={isProcessing}
              onClick={() => handleVerify("rejected")}
              className="gap-1.5"
            >
              <XCircle className="size-4" /> ปฏิเสธสลิป
            </Button>
            <Button
              disabled={isProcessing}
              onClick={() => handleVerify("verified")}
              className="bg-emerald-600 text-white hover:bg-emerald-700 gap-1.5 font-bold"
            >
              <CheckCircle2 className="size-4" /> {isProcessing ? "กำลังบันทึก..." : "อนุมัติสลิป (ยืนยันคิว)"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}