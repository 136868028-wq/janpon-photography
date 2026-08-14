import Link from "next/link";
import { ArrowRight, CalendarDays, Clock, AlertTriangle, XCircle, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/admin/stat-card";
import { BookingRevenueAreaChart, DistributionBarChart } from "@/components/admin/charts";
import { BookingStatusBadge, PaymentStatusBadge } from "@/components/shared/status-badge";
import { mockAnalytics, mockBookings, mockPayments, mockBlockedDates } from "@/lib/mock-data";
import { HOLD_DURATION_MINUTES } from "@/constants/booking";

export const metadata = { title: "แดชบอร์ด" };

export default function AdminDashboardPage() {
  const pendingPayments = mockPayments.filter((p) => p.status === "slip_uploaded" || p.status === "pending");
  const cancelled = mockBookings.filter((b) => b.status === "cancelled" || b.status === "no_show").slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">แดชบอร์ด</h1>
          <p className="mt-1 text-sm text-muted-foreground">ภาพรวมธุรกิจ · ข้อมูล ณ 14 ส.ค. 2569 09:30 น.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">สัปดาห์นี้</Button>
          <Button size="sm" className="bg-brand text-brand-fg hover:bg-brand-strong">เดือนนี้</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {mockAnalytics.kpis.map((kpi) => (
          <StatCard key={kpi.label} label={kpi.label} value={kpi.value} change={kpi.change} trend={kpi.trend} />
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base">แนวโน้มการจองและรายได้</CardTitle>
            <Button variant="ghost" size="sm" className="text-xs" asChild>
              <Link href="/admin/analytics">ดูรายละเอียด <ArrowRight className="size-3.5" /></Link>
            </Button>
          </CardHeader>
          <CardContent>
            <BookingRevenueAreaChart data={mockAnalytics.bookingTrend} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">สัดส่วนบริการ</CardTitle>
          </CardHeader>
          <CardContent>
            <DistributionBarChart data={mockAnalytics.serviceDistribution} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarDays className="size-4 text-brand-strong" /> ตารางวันนี้ (14 ส.ค.)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockBookings
              .filter((b) => b.date === "2026-08-14" && b.status !== "cancelled" && b.status !== "expired")
              .map((b) => (
                <div key={b.id} className="rounded-lg border p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-bold">{b.startTime} - {b.endTime} น.</p>
                    <BookingStatusBadge status={b.status} />
                  </div>
                  <p className="mt-1 text-sm">{b.customerName} · {b.serviceName}</p>
                  <p className="text-xs text-muted-foreground">{b.photographer}</p>
                </div>
              ))}
            {mockBlockedDates.filter((d) => d.date === "2026-08-14").length > 0 && (
              <div className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">⛔ ปิดรับจองช่วงเช้า</div>
            )}
            <Link href="/admin/calendar" className="block pt-1 text-sm font-semibold text-brand-strong hover:underline">
              เปิดปฏิทินทั้งหมด →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Wallet className="size-4 text-brand-strong" /> หลักฐานรอตรวจสอบ
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingPayments.slice(0, 4).map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-2 rounded-lg border p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{p.customerName}</p>
                  <p className="text-xs text-muted-foreground">{p.code} · {p.amount.toLocaleString("th-TH")} บาท · {p.uploadedAt}</p>
                </div>
                <PaymentStatusBadge status={p.status} />
              </div>
            ))}
            <Link href="/admin/payments" className="block pt-1 text-sm font-semibold text-brand-strong hover:underline">
              ไปตรวจสอบหลักฐานทั้งหมด →
            </Link>
          </CardContent>
        </Card>

        <div className="space-y-5">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="size-4 text-amber-600" /> คิวล็อกใกล้หมดอายุ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {mockBookings.filter((b) => b.status === "holding" || b.status === "pending_payment").map((b) => (
                <div key={b.id} className="flex items-center justify-between gap-2 rounded-lg border border-amber-600/25 bg-amber-500/5 p-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{b.customerName} · {b.serviceName}</p>
                    <p className="text-xs text-muted-foreground">{b.date} {b.startTime}-{b.endTime} น. · {b.code}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-bold text-amber-700 dark:text-amber-300">
                    เหลือ {HOLD_DURATION_MINUTES - 3} นาที
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertTriangle className="size-4 text-muted-foreground" /> ยกเลิก/คืนเงินล่าสุด
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {cancelled.map((b) => (
                <div key={b.id} className="flex items-center justify-between gap-2 rounded-lg border p-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{b.customerName}</p>
                    <p className="text-xs text-muted-foreground">{b.serviceName} · {b.date}</p>
                  </div>
                  <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                    <XCircle className="size-3.5 text-red-500" /> {b.paymentStatus === "refunded" ? "คืนเงินแล้ว" : "ยกเลิก"}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}