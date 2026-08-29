"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Clock,
  Wallet,
  CheckCircle2,
  XCircle,
  Eye,
  RefreshCw,
  Plus,
  Star,
  Users,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BookingStatusBadge, PaymentStatusBadge } from "@/components/shared/status-badge";
import { getDashboardStatsAction, updatePaymentStatusAction } from "@/actions/admin";
import { formatThaiDate } from "@/lib/thai-calendar";
import { cn } from "@/lib/utils";

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSlip, setSelectedSlip] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const loadStats = async () => {
    setLoading(true);
    try {
      const res = await getDashboardStatsAction();
      if (res.success) {
        setData(res);
      }
    } catch (err) {
      console.error("Failed to load dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleVerifyPayment = async (status: "verified" | "rejected") => {
    if (!selectedSlip) return;
    setIsProcessing(true);
    try {
      await updatePaymentStatusAction(selectedSlip.id, status, selectedSlip.bookingId);
      setSelectedSlip(null);
      await loadStats();
    } catch (err) {
      console.error("Payment status update error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const stats = data?.stats || {
    totalBookings: 0,
    confirmedCount: 0,
    pendingVerificationCount: 0,
    cancelledCount: 0,
    totalDeposits: 0,
    totalRevenue: 0,
    reviewCount: 0,
    averageRating: "5.0",
  };

  const recentBookings = data?.recentBookings || [];
  const todayBookings = data?.todayBookings || [];
  const pendingSlips = data?.pendingSlips || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">แดชบอร์ดระบบจัดการร้าน</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            ภาพรวมธุรกิจ Star X-Press Photo Studio · ข้อมูลอัปเดตแบบเรียลไทม์จาก Supabase
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadStats} disabled={loading} className="gap-1.5">
            <RefreshCw className={cn("size-3.5", loading && "animate-spin")} />
            รีเฟรชข้อมูล
          </Button>
          <Link href="/admin/bookings">
            <Button size="sm" className="bg-brand text-brand-fg hover:bg-brand-strong gap-1.5 font-semibold">
              <Plus className="size-4" /> จัดการการจอง
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-brand">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-muted-foreground">การจองทั้งหมด</p>
              <Users className="size-4 text-brand-strong" />
            </div>
            <p className="mt-2 font-heading text-2xl font-extrabold sm:text-3xl">
              {stats.totalBookings} <span className="text-sm font-normal text-muted-foreground">รายการ</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              ยืนยันแล้ว <strong className="text-emerald-600 dark:text-emerald-400">{stats.confirmedCount}</strong> รายการ
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-muted-foreground">รอตรวจสอบสลิป</p>
              <Clock className="size-4 text-amber-600" />
            </div>
            <p className="mt-2 font-heading text-2xl font-extrabold text-amber-600 sm:text-3xl dark:text-amber-400">
              {pendingSlips.length} <span className="text-sm font-normal text-muted-foreground">รายการ</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {pendingSlips.length > 0 ? "มีสลิปรอให้แอดมินอนุมัติ" : "ไม่มีสลิปค้างตรวจสอบ"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-600">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-muted-foreground">ยอดมัดจำที่รับแล้ว</p>
              <Wallet className="size-4 text-emerald-600" />
            </div>
            <p className="mt-2 font-heading text-2xl font-extrabold text-emerald-600 sm:text-3xl dark:text-emerald-400">
              {stats.totalDeposits.toLocaleString("th-TH")} <span className="text-sm font-normal text-muted-foreground">บาท</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              ยอดรวมคาดการณ์: {stats.totalRevenue.toLocaleString("th-TH")} บาท
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-sky-500">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-muted-foreground">คะแนนรีวิวจากลูกค้า</p>
              <Star className="size-4 text-amber-400 fill-amber-400" />
            </div>
            <p className="mt-2 font-heading text-2xl font-extrabold sm:text-3xl">
              {stats.averageRating} <span className="text-sm font-normal text-muted-foreground">/ 5.0</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              จากรีวิวทั้งหมด {stats.reviewCount} รายการ
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left 2 cols: Pending Slip Verification Queue + Recent Bookings */}
        <div className="space-y-6 lg:col-span-2">
          {/* Slip Verification Queue */}
          <Card className="border-amber-500/30 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-bold">
                <Wallet className="size-4 text-amber-600" />
                คิวตรวจสอบสลิปโอนเงิน
                <Badge className={cn("ml-1", pendingSlips.length > 0 ? "bg-amber-500 text-white" : "bg-muted text-muted-foreground")}>
                  {pendingSlips.length} รายการ
                </Badge>
              </CardTitle>
              <Link href="/admin/payments" className="text-xs font-semibold text-brand-strong hover:underline">
                ดูประวัติทั้งหมด →
              </Link>
            </CardHeader>
            <CardContent>
              {pendingSlips.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {pendingSlips.map((p: any) => (
                    <div key={p.id} className="rounded-xl border p-4 transition-colors hover:border-brand/40">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-bold">{p.customerName}</p>
                          <p className="font-mono text-xs font-semibold text-muted-foreground">
                            {p.code} · {p.phone}
                          </p>
                          <p className="mt-0.5 text-xs text-foreground/80">{p.serviceName}</p>
                        </div>
                        <PaymentStatusBadge status={p.status} />
                      </div>
                      <div className="mt-3 flex items-center justify-between border-t pt-2.5 text-sm">
                        <span className="text-xs text-muted-foreground">มัดจำที่ต้องชำระ</span>
                        <span className="font-heading font-extrabold text-brand-strong">
                          {p.amount.toLocaleString("th-TH")} บาท
                        </span>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8.5 w-full font-medium"
                          onClick={() => setSelectedSlip(p)}
                        >
                          <Eye className="size-3.5 mr-1" /> ตรวจสอบสลิป
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                  ✨ ไม่มีรายการสลิปค้างตรวจสอบในขณะนี้
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Bookings Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-bold">
                <CalendarDays className="size-4 text-brand-strong" />
                รายการจองล่าสุด
              </CardTitle>
              <Link href="/admin/bookings" className="text-xs font-semibold text-brand-strong hover:underline">
                ดูรายการจองทั้งหมด ({stats.totalBookings}) →
              </Link>
            </CardHeader>
            <CardContent>
              {recentBookings.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-xs text-muted-foreground">
                        <th className="pb-2 font-medium">รหัสจอง</th>
                        <th className="pb-2 font-medium">ลูกค้า</th>
                        <th className="pb-2 font-medium">บริการ</th>
                        <th className="pb-2 font-medium">วันที่ถ่าย</th>
                        <th className="pb-2 font-medium">มัดจำ</th>
                        <th className="pb-2 font-medium">สถานะ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {recentBookings.map((b: any) => (
                        <tr key={b.id} className="hover:bg-muted/40 transition-colors">
                          <td className="py-3 font-mono text-xs font-bold tracking-wider">
                            <Link href={`/booking/${b.code}`} className="text-brand-strong hover:underline" target="_blank">
                              {b.code}
                            </Link>
                          </td>
                          <td className="py-3">
                            <p className="font-semibold text-xs text-foreground">{b.customer_name}</p>
                            <p className="text-[11px] text-muted-foreground">{b.customer_phone}</p>
                          </td>
                          <td className="py-3 text-xs">{b.service_name}</td>
                          <td className="py-3 text-xs text-muted-foreground">
                            {formatThaiDate(b.date, "short")}
                          </td>
                          <td className="py-3 text-xs font-bold text-foreground">
                            {b.deposit_amount.toLocaleString("th-TH")} ฿
                          </td>
                          <td className="py-3">
                            <BookingStatusBadge status={b.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                  ยังไม่มีรายการจองในระบบ
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right 1 col: Today's Schedule & Quick Actions */}
        <div className="space-y-6">
          {/* Today's Schedule */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-bold">
                <CalendarDays className="size-4 text-brand-strong" /> คิวถ่ายภาพวันนี้
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {todayBookings.length > 0 ? (
                todayBookings.map((b: any) => (
                  <div key={b.id} className="rounded-xl border p-3.5 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-brand-strong">
                        {b.slot === "morning" ? "09:00 - 13:00 น. (เช้า)" : b.slot === "evening" ? "13:00 - 17:00 น. (บ่าย)" : "09:00 - 17:00 น. (เต็มวัน)"}
                      </p>
                      <BookingStatusBadge status={b.status} />
                    </div>
                    <p className="text-sm font-bold text-foreground">{b.customer_name}</p>
                    <p className="text-xs text-muted-foreground">{b.service_name} · {b.customer_phone}</p>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed p-6 text-center text-xs text-muted-foreground">
                  ไม่มีคิวถ่ายภาพในวันนี้
                </div>
              )}
              <Link href="/admin/calendar" className="block pt-2 text-center text-xs font-bold text-brand-strong hover:underline">
                เปิดดูปฏิทินคิวงานทั้งหมด →
              </Link>
            </CardContent>
          </Card>

          {/* Quick Admin Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold">เมนูลัดสำหรับแอดมิน</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/admin/bookings" className="block">
                <Button variant="outline" className="w-full justify-start text-xs font-semibold h-9">
                  <CalendarDays className="size-4 mr-2 text-brand-strong" /> ดูและแก้ไขรายการจองทั้งหมด
                </Button>
              </Link>
              <Link href="/admin/payments" className="block">
                <Button variant="outline" className="w-full justify-start text-xs font-semibold h-9">
                  <Wallet className="size-4 mr-2 text-emerald-600" /> ตรวจสอบสลิปและรายรับ
                </Button>
              </Link>
              <Link href="/admin/reviews" className="block">
                <Button variant="outline" className="w-full justify-start text-xs font-semibold h-9">
                  <Star className="size-4 mr-2 text-amber-500" /> จัดการรีวิวจากลูกค้า
                </Button>
              </Link>
              <Link href="/book" target="_blank" className="block">
                <Button variant="outline" className="w-full justify-start text-xs font-semibold h-9">
                  <Plus className="size-4 mr-2 text-sky-600" /> เปิดหน้าจองคิว (สำหรับลูกค้า)
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Slip Verification Modal Dialog */}
      <Dialog open={Boolean(selectedSlip)} onOpenChange={(open) => !open && setSelectedSlip(null)}>
        <DialogContent className="max-w-md sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg font-bold">
              ตรวจสอบสลิปโอนเงิน — {selectedSlip?.code}
            </DialogTitle>
            <DialogDescription>
              ลูกค้า: <strong>{selectedSlip?.customerName}</strong> ({selectedSlip?.phone})
              <br />
              บริการ: {selectedSlip?.serviceName} · ยอดมัดจำ <strong>{selectedSlip?.amount?.toLocaleString("th-TH")} บาท</strong>
            </DialogDescription>
          </DialogHeader>

          <div className="my-2 space-y-3">
            <div className="relative overflow-hidden rounded-xl border bg-black/5 p-2 text-center">
              {selectedSlip?.slipUrl ? (
                <img
                  src={selectedSlip.slipUrl}
                  alt={`สลิป ${selectedSlip.code}`}
                  className="mx-auto max-h-[380px] w-auto rounded-lg object-contain"
                />
              ) : (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  <Wallet className="mx-auto size-10 text-muted-foreground/50" />
                  <p className="mt-2 font-medium">ลูกค้าแจ้งชำระเงินแล้ว แต่ยังไม่ได้แนบรูปภาพสลิป</p>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              variant="destructive"
              disabled={isProcessing}
              onClick={() => handleVerifyPayment("rejected")}
              className="gap-1.5"
            >
              <XCircle className="size-4" /> ปฏิเสธ (สลิปไม่ถูกต้อง)
            </Button>
            <Button
              disabled={isProcessing}
              onClick={() => handleVerifyPayment("verified")}
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