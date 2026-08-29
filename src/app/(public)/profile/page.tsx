"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Clock,
  LogOut,
  Package,
  Phone,
  RefreshCw,
  Search,
  ShieldCheck,
  Ticket,
  User,
  Wallet,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/public/page-header";
import { BookingStatusBadge, PaymentStatusBadge } from "@/components/shared/status-badge";
import { getCustomerBookingsByPhoneAction } from "@/actions/booking";
import { formatThaiDate } from "@/lib/thai-calendar";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const router = useRouter();
  const [customer, setCustomer] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("starxpress_customer");
      if (saved) {
        const parsed = JSON.parse(saved);
        setCustomer(parsed);
        fetchBookings(parsed.phone);
      } else {
        setLoading(false);
      }
    } catch {
      setLoading(false);
    }
  }, []);

  const fetchBookings = async (phone: string) => {
    setLoading(true);
    try {
      const res = await getCustomerBookingsByPhoneAction(phone);
      if (res.success && res.bookings) {
        setBookings(res.bookings);
      }
    } catch (err) {
      console.error("Failed to load customer bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("starxpress_customer");
    setCustomer(null);
    setBookings([]);
    router.push("/login");
  };

  if (!customer && !loading) {
    return (
      <>
        <PageHeader
          eyebrow="โปรไฟล์ลูกค้า"
          title="โปรไฟล์และประวัติการจอง"
          subtitle="กรุณาเข้าสู่ระบบด้วยเบอร์โทรศัพท์เพื่อดูข้อมูลและสถานะคิวงานของคุณ"
        />
        <section className="mx-auto max-w-md px-4 py-16 text-center">
          <Card className="p-8">
            <User className="mx-auto size-12 text-muted-foreground" />
            <h2 className="mt-4 font-heading text-lg font-bold">ยังไม่ได้เข้าสู่ระบบ</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              เข้าสู่ระบบด้วยเบอร์โทรศัพท์เพื่อดูประวัติการจองทั้งหมดของคุณ
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <Link href="/login">
                <Button size="lg" className="w-full bg-brand text-brand-fg hover:bg-brand-strong font-bold">
                  เข้าสู่ระบบลูกค้า <ArrowRight className="size-4 ml-1" />
                </Button>
              </Link>
              <Link href="/track">
                <Button size="lg" variant="outline" className="w-full">
                  ค้นหาด้วยรหัสติดตามสถานะคิว
                </Button>
              </Link>
            </div>
          </Card>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="ข้อมูลสมาชิก"
        title={`ยินดีต้อนรับ ${customer?.fullName || "ลูกค้าคนพิเศษ"}`}
        subtitle={`เบอร์โทรศัพท์: ${customer?.phone || "-"} · บัญชีผู้ใช้ Star X-Press Photo Studio`}
        className="[&_h2]:text-white [&_p]:text-white/80"
      />

      <section className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Left Column: Customer Profile Card */}
          <div className="md:col-span-1 space-y-4">
            <Card className="border shadow-sm">
              <CardContent className="p-5 text-center">
                <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-brand/20 text-brand-strong font-heading text-2xl font-bold">
                  {customer?.fullName?.slice(0, 1) || "U"}
                </div>
                <h2 className="mt-3 font-heading text-base font-bold text-foreground">
                  {customer?.fullName || "ลูกค้า"}
                </h2>
                <p className="mt-0.5 font-mono text-xs font-semibold text-muted-foreground">
                  {customer?.phone}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-2 border-t pt-4 text-center">
                  <div className="rounded-xl bg-sand/60 p-2.5">
                    <p className="text-[11px] text-muted-foreground">การจองทั้งหมด</p>
                    <p className="font-heading text-lg font-extrabold text-foreground">{bookings.length}</p>
                  </div>
                  <div className="rounded-xl bg-sand/60 p-2.5">
                    <p className="text-[11px] text-muted-foreground">ยืนยันแล้ว</p>
                    <p className="font-heading text-lg font-extrabold text-emerald-600">
                      {bookings.filter((b) => b.status === "confirmed" || b.status === "completed").length}
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-2">
                  <Link href="/book" className="block">
                    <Button size="sm" className="w-full bg-brand text-brand-fg hover:bg-brand-strong font-bold">
                      <Sparkles className="size-3.5 mr-1" /> จองคิวถ่ายภาพใหม่
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="w-full text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                  >
                    <LogOut className="size-3.5 mr-1" /> ออกจากระบบ
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-sand/40 p-4 text-xs text-muted-foreground space-y-2">
              <div className="flex items-center gap-1.5 font-semibold text-foreground">
                <ShieldCheck className="size-4 text-emerald-600" /> นโยบายความเป็นส่วนตัว
              </div>
              <p className="leading-relaxed">
                ข้อมูลการจองและภาพถ่ายของคุณจะถูกจัดเก็บตามมาตรฐาน PDPA ไม่เปิดเผยข้อมูลส่วนบุคคลต่อสาธารณะ
              </p>
            </Card>
          </div>

          {/* Right Column: Booking History List (Parcel-style tracking cards) */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold flex items-center gap-2">
                <Package className="size-5 text-brand-strong" /> ประวัติและสถานะการจองของคุณ ({bookings.length})
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchBookings(customer.phone)}
                disabled={loading}
                className="text-xs h-8"
              >
                <RefreshCw className={cn("size-3 mr-1", loading && "animate-spin")} /> รีเฟรช
              </Button>
            </div>

            {loading ? (
              <div className="p-12 text-center text-sm text-muted-foreground">
                กำลังค้นหาประวัติการจองของคุณ...
              </div>
            ) : bookings.length > 0 ? (
              <div className="space-y-4">
                {bookings.map((b) => (
                  <Card key={b.id} className="border-2 border-border/80 shadow-sm transition-all hover:border-brand/50">
                    <CardContent className="p-5">
                      {/* Tracking Header Banner */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
                        <div className="flex items-center gap-2">
                          <span className="flex size-7 items-center justify-center rounded-lg bg-coal text-brand text-xs font-mono font-bold">
                            <Ticket className="size-3.5" />
                          </span>
                          <div>
                            <p className="text-[11px] text-muted-foreground">รหัสติดตามสถานะคิว (Tracking Code)</p>
                            <p className="font-mono text-sm font-extrabold tracking-wider text-foreground">
                              {b.code}
                            </p>
                          </div>
                        </div>
                        <BookingStatusBadge status={b.status} />
                      </div>

                      {/* Booking Content Details */}
                      <div className="mt-3 grid gap-2 sm:grid-cols-2 text-xs sm:text-sm">
                        <div>
                          <p className="font-bold text-foreground text-sm">{b.service_name}</p>
                          {b.package_name && (
                            <p className="text-xs text-muted-foreground">{b.package_name}</p>
                          )}
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="font-bold text-foreground">
                            {formatThaiDate(b.date, "short")}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {b.slot === "morning"
                              ? "09:00 - 13:00 น. (ช่วงเช้า)"
                              : b.slot === "evening"
                                ? "13:00 - 17:00 น. (ช่วงบ่าย)"
                                : "เต็มวัน (09:00 - 17:00 น.)"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between rounded-xl bg-sand/60 px-3.5 py-2.5 text-xs">
                        <span className="text-muted-foreground">
                          มัดจำ: <strong className="text-brand-strong">{b.deposit_amount?.toLocaleString("th-TH")} ฿</strong>
                        </span>
                        <span className="text-muted-foreground">
                          ยอดรวม: <strong>{b.total_price?.toLocaleString("th-TH")} ฿</strong>
                        </span>
                      </div>

                      {/* Action buttons */}
                      <div className="mt-4 flex flex-col sm:flex-row items-center gap-2 pt-1">
                        <Link href={`/track/${b.code}`} className="w-full sm:flex-1">
                          <Button size="sm" className="w-full h-9 bg-brand text-brand-fg hover:bg-brand-strong font-bold">
                            ติดตามสถานะคิวงานละเอียด →
                          </Button>
                        </Link>
                        <Link href={`/booking/${b.code}`} className="w-full sm:w-auto">
                          <Button size="sm" variant="outline" className="w-full h-9 text-xs">
                            ดูใบเสร็จ / รายละเอียด
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-dashed p-10 text-center text-muted-foreground">
                <Package className="mx-auto size-10 text-muted-foreground/50" />
                <h3 className="mt-3 font-heading text-base font-bold text-foreground">
                  ไม่พบประวัติการจองจากเบอร์นี้ ({customer?.phone})
                </h3>
                <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
                  หากคุณเคยจองคิวด้วยเบอร์โทรศัพท์อื่น สามารถออกจากระบบแล้วเข้าสู่ระบบด้วยเบอร์ที่ใช้จองได้ครับ
                </p>
                <div className="mt-5">
                  <Link href="/book">
                    <Button size="sm" className="bg-brand text-brand-fg hover:bg-brand-strong font-bold">
                      จองคิวถ่ายภาพแรกของคุณ
                    </Button>
                  </Link>
                </div>
              </Card>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
