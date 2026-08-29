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
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/public/page-header";
import { BookingStatusBadge, PaymentStatusBadge } from "@/components/shared/status-badge";
import {
  getCustomerBookingsByPhoneAction,
  getBookingByCodeAction,
  getAllRecentPublicBookingsAction,
} from "@/actions/booking";
import { formatThaiDate } from "@/lib/thai-calendar";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const router = useRouter();
  const [customer, setCustomer] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [recentAll, setRecentAll] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Quick Code / Phone Search on Profile
  const [searchCode, setSearchCode] = useState("");
  const [switchPhone, setSwitchPhone] = useState("");
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

      // Fetch all recent system bookings as suggestions
      const recRes = await getAllRecentPublicBookingsAction();
      if (recRes.success && recRes.bookings) {
        setRecentAll(recRes.bookings);
      }

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

  const handleClaimBooking = (b: any) => {
    // Save to my_codes and update customer
    try {
      const oldCodes: string[] = JSON.parse(localStorage.getItem("starxpress_my_codes") || "[]");
      if (!oldCodes.includes(b.code)) {
        localStorage.setItem("starxpress_my_codes", JSON.stringify([b.code, ...oldCodes]));
      }

      const newCust = {
        phone: b.customer_phone,
        fullName: b.customer_name,
        loggedInAt: new Date().toISOString(),
      };
      localStorage.setItem("starxpress_customer", JSON.stringify(newCust));
      setCustomer(newCust);
    } catch {
      // ignore
    }

    setBookings((prev) => {
      if (prev.some((x) => x.code === b.code)) return prev;
      return [b, ...prev];
    });

    setSearchMsg(`✓ ดึงรายการจอง ${b.code} เข้าโปรไฟล์เรียบร้อยแล้ว!`);
  };

  const handleSwitchPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = switchPhone.trim().replace(/[^0-9]/g, "");
    if (!clean) return;

    setSearchLoading(true);
    setSearchMsg(null);

    try {
      const res = await getCustomerBookingsByPhoneAction(clean);
      if (res.success && res.bookings && res.bookings.length > 0) {
        const first = res.bookings[0];
        const newCust = {
          phone: clean,
          fullName: first.customer_name || `ลูกค้า (${clean})`,
          loggedInAt: new Date().toISOString(),
        };
        localStorage.setItem("starxpress_customer", JSON.stringify(newCust));
        setCustomer(newCust);
        setBookings(res.bookings);
        setSwitchPhone("");
        setSearchMsg(`✓ พบประวัติการจอง ${res.bookings.length} รายการ!`);
      } else {
        setSearchMsg("⚠️ ไม่พบประวัติการจองจากเบอร์นี้ในระบบ");
      }
    } catch {
      setSearchMsg("⚠️ เกิดข้อผิดพลาดในการค้นหา");
    } finally {
      setSearchLoading(false);
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
          if (!customer) {
            const newCust = {
              phone: res.booking.customer_phone,
              fullName: res.booking.customer_name,
              loggedInAt: new Date().toISOString(),
            };
            localStorage.setItem("starxpress_customer", JSON.stringify(newCust));
            setCustomer(newCust);
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
                  {customer?.phone || "ไม่ได้ระบุเบอร์"}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-2 border-t pt-4 text-center">
                  <div className="rounded-xl bg-sand/60 p-2.5">
                    <p className="text-[11px] text-muted-foreground">การจองของคุณ</p>
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

            {/* Quick Add Tracking Code / Switch Phone Box */}
            <Card className="p-4 shadow-sm border space-y-4">
              <div>
                <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Plus className="size-3.5 text-brand-strong" /> เพิ่มรายการจองด้วยรหัสคิว
                </h3>
                <form onSubmit={handleAddBookingByCode} className="mt-2 space-y-2">
                  <Input
                    placeholder="เช่น SXPA35Y9 หรือ STX-26..."
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
              </div>

              <div className="border-t pt-3">
                <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Phone className="size-3.5 text-brand-strong" /> ค้นหาด้วยเบอร์โทรอื่น
                </h3>
                <form onSubmit={handleSwitchPhone} className="mt-2 space-y-2">
                  <Input
                    placeholder="เช่น 08x-xxx-xxxx"
                    value={switchPhone}
                    onChange={(e) => setSwitchPhone(e.target.value)}
                    className="text-xs h-8"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    variant="outline"
                    disabled={searchLoading}
                    className="w-full text-xs h-8"
                  >
                    {searchLoading ? "กำลังดึงข้อมูล..." : "สลับค้นหาเบอร์นี้"}
                  </Button>
                </form>
              </div>

              {searchMsg && (
                <p className="text-[11px] text-brand-strong font-semibold bg-brand/10 p-2 rounded-lg">
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
                กำลังค้นหาประวัติการจองจากฐานข้อมูล Supabase...
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
                          <p className="text-xs text-muted-foreground mt-0.5">
                            ผู้จอง: <strong>{b.customer_name}</strong> ({b.customer_phone})
                          </p>
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
              <div className="space-y-4">
                <Card className="border-dashed p-8 text-center text-muted-foreground">
                  <Package className="mx-auto size-10 text-muted-foreground/50" />
                  <h3 className="mt-3 font-heading text-base font-bold text-foreground">
                    ยังไม่พบประวัติการจองจากเบอร์ {customer?.phone || "ที่คุณเข้าสู่ระบบ"}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
                    หากคุณเคยจองคิวไว้ สามารถพิมพ์รหัสคิวงาน หรือคลิกเลือกรายการที่ตรงกับของคุณด้านล่างนี้ได้ทันทีครับ
                  </p>
                </Card>

                {recentAll.length > 0 && (
                  <Card className="p-4 border bg-sand/30">
                    <CardHeader className="p-0 pb-3">
                      <CardTitle className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <Clock className="size-3.5 text-brand-strong" />
                        รายการจองล่าสุดในระบบ (คลิกเพื่อดึงเข้าโปรไฟล์ของคุณ):
                      </CardTitle>
                    </CardHeader>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {recentAll.map((r) => (
                        <div
                          key={r.id}
                          className="flex items-center justify-between p-2.5 rounded-lg border bg-background text-xs hover:border-brand transition-colors"
                        >
                          <div>
                            <p className="font-mono font-bold text-brand-strong">{r.code}</p>
                            <p className="text-[11px] text-foreground font-medium">{r.customer_name} · {r.customer_phone}</p>
                            <p className="text-[10px] text-muted-foreground">{r.service_name} ({formatThaiDate(r.date, "short")})</p>
                          </div>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleClaimBooking(r)}
                            className="h-7 text-[11px] font-bold"
                          >
                            เลือกรายการนี้
                          </Button>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
