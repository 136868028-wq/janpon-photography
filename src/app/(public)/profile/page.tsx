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
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/public/page-header";
import { BookingStatusBadge, PaymentStatusBadge } from "@/components/shared/status-badge";
import { getCustomerBookingsByPhoneAction, getBookingByCodeAction } from "@/actions/booking";
import { formatThaiDate } from "@/lib/thai-calendar";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const router = useRouter();
  const [customer, setCustomer] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Quick Code Search on Profile
  const [searchCode, setSearchCode] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchMsg, setSearchMsg] = useState<string | null>(null);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    setLoading(true);
    try {
      let savedPhone = "";
      let savedCustomer = null;

      try {
        const saved = localStorage.getItem("starxpress_customer");
        if (saved) {
          savedCustomer = JSON.parse(saved);
          setCustomer(savedCustomer);
          savedPhone = savedCustomer.phone || "";
        }
      } catch {
        // ignore
      }

      // Collect all bookings from phone AND stored codes
      const bookingMap = new Map<string, any>();

      // 1. Fetch by phone if available
      if (savedPhone) {
        const res = await getCustomerBookingsByPhoneAction(savedPhone);
        if (res.success && res.bookings) {
          res.bookings.forEach((b: any) => bookingMap.set(b.code, b));
        }
      }

      // 2. Fetch by stored booking codes in localStorage
      try {
        const savedCodes: string[] = JSON.parse(localStorage.getItem("starxpress_my_codes") || "[]");
        for (const c of savedCodes) {
          if (!bookingMap.has(c)) {
            const res = await getBookingByCodeAction(c);
            if (res.success && res.booking) {
              bookingMap.set(res.booking.code, res.booking);
            }
          }
        }
      } catch {
        // ignore
      }

      const allList = Array.from(bookingMap.values());
      setBookings(allList);

      // If no customer name yet, infer from first booking
      if (!savedCustomer && allList.length > 0) {
        const first = allList[0];
        const inferred = {
          phone: first.customer_phone,
          fullName: first.customer_name,
          loggedInAt: new Date().toISOString(),
        };
        setCustomer(inferred);
        try {
          localStorage.setItem("starxpress_customer", JSON.stringify(inferred));
        } catch {
          // ignore
        }
      }
    } catch (err) {
      console.error("Failed to load profile bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBookingByCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchCode.trim().toUpperCase();
    if (!clean) return;

    setSearchLoading(true);
    setSearchMsg(null);

    try {
      const res = await getBookingByCodeAction(clean);
      if (res.success && res.booking) {
        // Save code to localStorage
        try {
          const oldCodes: string[] = JSON.parse(localStorage.getItem("starxpress_my_codes") || "[]");
          if (!oldCodes.includes(clean)) {
            localStorage.setItem("starxpress_my_codes", JSON.stringify([clean, ...oldCodes]));
          }
        } catch {
          // ignore
        }

        setBookings((prev) => {
          if (prev.some((b) => b.code === clean)) return prev;
          return [res.booking, ...prev];
        });

        setSearchCode("");
        setSearchMsg(`✓ เพิ่มการจอง ${clean} เรียบร้อยแล้ว!`);
      } else {
        setSearchMsg("⚠️ ไม่พบข้อมูลการจองตามรหัสนี้ กรุณาตรวจสอบอีกครั้ง");
      }
    } catch {
      setSearchMsg("⚠️ เกิดข้อผิดพลาดในการค้นหา");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("starxpress_customer");
    localStorage.removeItem("starxpress_my_codes");
    setCustomer(null);
    setBookings([]);
    router.push("/login");
  };

  if (!customer && !loading && bookings.length === 0) {
    return (
      <>
        <PageHeader
          eyebrow="โปรไฟล์ลูกค้า"
          title="โปรไฟล์และประวัติการจอง"
          subtitle="กรุณาเข้าสู่ระบบด้วยเบอร์โทรศัพท์เพื่อดูข้อมูลและสถานะคิวงานของคุณ"
        />
        <section className="mx-auto max-w-md px-4 py-16 text-center">
          <Card className="p-8 shadow-md">
            <User className="mx-auto size-12 text-muted-foreground" />
            <h2 className="mt-4 font-heading text-lg font-bold">ยังไม่ได้เข้าสู่ระบบ</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              เข้าสู่ระบบด้วยเบอร์โทรศัพท์ หรือระบุรหัสติดตามสถานะคิวเพื่อดูประวัติ
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <Link href="/login">
                <Button size="lg" className="w-full bg-brand text-brand-fg hover:bg-brand-strong font-bold">
                  เข้าสู่ระบบด้วยเบอร์โทรศัพท์ <ArrowRight className="size-4 ml-1" />
                </Button>
              </Link>
              <Link href="/track">
                <Button size="lg" variant="outline" className="w-full">
                  ค้นหาด้วยรหัสติดตามสถานะ (Tracking Code)
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
        title={`ยินดีต้อนรับ ${customer?.fullName || "คุณลูกค้า"}`}
        subtitle={`เบอร์โทรศัพท์: ${customer?.phone || "-"} · ข้อมูลซิงค์สดจากระบบฐานข้อมูล Supabase`}
        className="[&_h2]:text-white [&_p]:text-white/80"
      />

      <section className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Left Column: Customer Profile Card & Manual Search */}
          <div className="md:col-span-1 space-y-4">
            <Card className="border shadow-sm">
              <CardContent className="p-5 text-center">
                <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-brand/20 text-brand-strong font-heading text-2xl font-bold">
                  {customer?.fullName?.slice(0, 1) || "U"}
                </div>
                <h2 className="mt-3 font-heading text-base font-bold text-foreground">
                  {customer?.fullName || "คุณลูกค้า"}
                </h2>
                <p className="mt-0.5 font-mono text-xs font-semibold text-muted-foreground">
                  {customer?.phone || "-"}
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
                    <LogOut className="size-3.5 mr-1" /> สลับบัญชี / ออกจากระบบ
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Add Tracking Code Box */}
            <Card className="p-4 shadow-sm border space-y-3">
              <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Plus className="size-3.5 text-brand-strong" /> เพิ่มรายการจองด้วยรหัสคิว
              </h3>
              <form onSubmit={handleAddBookingByCode} className="space-y-2">
                <Input
                  placeholder="เช่น STX-26894K"
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
                  className="font-mono text-xs uppercase h-8"
                />
                <Button
                  type="submit"
                  size="sm"
                  variant="outline"
                  disabled={searchLoading}
                  className="w-full text-xs h-8"
                >
                  {searchLoading ? "กำลังค้นหา..." : "เพิ่มเข้าโปรไฟล์"}
                </Button>
              </form>
              {searchMsg && (
                <p className="text-[11px] text-muted-foreground font-medium">
                  {searchMsg}
                </p>
              )}
            </Card>

            <Card className="bg-sand/40 p-4 text-xs text-muted-foreground space-y-2">
              <div className="flex items-center gap-1.5 font-semibold text-foreground">
                <ShieldCheck className="size-4 text-emerald-600" /> นโยบายความเป็นส่วนตัว
              </div>
              <p className="leading-relaxed">
                ข้อมูลการจองและภาพถ่ายของคุณจะถูกจัดเก็บตามมาตรฐาน PDPA ปลอดภัยและเป็นส่วนตัว 100%
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
                onClick={loadProfileData}
                disabled={loading}
                className="text-xs h-8"
              >
                <RefreshCw className={cn("size-3 mr-1", loading && "animate-spin")} /> รีเฟรช
              </Button>
            </div>

            {loading ? (
              <div className="p-12 text-center text-sm text-muted-foreground">
                กำลังค้นหาประวัติการจองจากฐานข้อมูล...
              </div>
            ) : bookings.length > 0 ? (
              <div className="space-y-4">
                {bookings.map((b) => (
                  <Card key={b.id || b.code} className="border-2 border-border/80 shadow-sm transition-all hover:border-brand/50">
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
                            ติดตามสถานะคิวงานละเอียด (Tracking) →
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
                  ยังไม่พบประวัติการจอง
                </h3>
                <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
                  หากคุณเพิ่งจองคิว สามารถกรอกรหัสติดตาม (Tracking Code) ในกล่องด้านซ้ายเพื่อดึงข้อมูลมาแสดงได้ทันทีครับ
                </p>
                <div className="mt-5">
                  <Link href="/book">
                    <Button size="sm" className="bg-brand text-brand-fg hover:bg-brand-strong font-bold">
                      จองคิวถ่ายภาพใหม่
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
