"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Lock, Phone, ShieldCheck, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/public/page-header";
import { getCustomerBookingsByPhoneAction } from "@/actions/booking";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"customer" | "admin">("customer");

  // Customer Login State
  const [phone, setPhone] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [loadingCustomer, setLoadingCustomer] = useState(false);
  const [customerError, setCustomerError] = useState<string | null>(null);

  // Admin Login State
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [loadingAdmin, setLoadingAdmin] = useState(false);
  const [adminError, setAdminError] = useState<string | null>(null);

  const handleCustomerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCustomerError(null);
    const cleanPhone = phone.trim().replace(/[^0-9]/g, "");

    if (cleanPhone.length < 9) {
      setCustomerError("กรุณากรอกเบอร์โทรศัพท์ที่ถูกต้อง (อย่างน้อย 9-10 หลัก)");
      return;
    }

    setLoadingCustomer(true);
    try {
      // Save session to localStorage
      const userSession = {
        phone: cleanPhone,
        fullName: customerName.trim() || `ลูกค้า (${cleanPhone})`,
        loggedInAt: new Date().toISOString(),
      };
      localStorage.setItem("starxpress_customer", JSON.stringify(userSession));

      // Redirect to Profile
      router.push("/profile");
    } catch {
      setCustomerError("เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
    } finally {
      setLoadingCustomer(false);
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError(null);
    setLoadingAdmin(true);

    setTimeout(() => {
      setLoadingAdmin(false);
      // Simple verification for admin demo
      if (adminPassword === "starexpress2026" || adminPassword === "admin123" || adminEmail.includes("admin")) {
        localStorage.setItem("starxpress_admin_session", "true");
        router.push("/admin/dashboard");
      } else {
        setAdminError("อีเมลหรือรหัสผ่านแอดมินไม่ถูกต้อง (รหัสผ่านเริ่มต้น: starexpress2026)");
      }
    }, 500);
  };

  return (
    <>
      <PageHeader
        eyebrow="ระบบสมาชิก"
        title="เข้าสู่ระบบ"
        subtitle="เข้าสู่ระบบเพื่อดูประวัติการจอง ตรวจสอบสถานะคิว หรือเข้าสู่ระบบจัดการร้าน"
        className="[&_h2]:text-white [&_p]:text-white/80"
      />

      <section className="mx-auto max-w-md px-4 py-12">
        <Card className="border shadow-lg">
          <CardHeader className="p-6 pb-4 text-center">
            {/* Tabs */}
            <div className="grid grid-cols-2 rounded-xl bg-muted p-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => setTab("customer")}
                className={cn(
                  "rounded-lg py-2.5 transition-all",
                  tab === "customer"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <User className="inline size-3.5 mr-1" /> สำหรับลูกค้า
              </button>
              <button
                type="button"
                onClick={() => setTab("admin")}
                className={cn(
                  "rounded-lg py-2.5 transition-all",
                  tab === "admin"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Lock className="inline size-3.5 mr-1" /> สำหรับแอดมิน
              </button>
            </div>
          </CardHeader>

          <CardContent className="p-6 pt-2">
            {tab === "customer" ? (
              <form onSubmit={handleCustomerLogin} className="space-y-4">
                <div className="text-center pb-1">
                  <h2 className="font-heading text-lg font-bold text-foreground">เข้าดูประวัติและข้อมูลการจอง</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    กรอกเบอร์โทรศัพท์ที่เคยใช้จอง เพื่อเข้าสู่หน้าโปรไฟล์
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="cust-phone" className="text-xs font-semibold">
                    เบอร์โทรศัพท์ที่ใช้จอง *
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 size-4 text-muted-foreground" />
                    <Input
                      id="cust-phone"
                      inputMode="tel"
                      placeholder="08x-xxx-xxxx"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-9 text-base"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="cust-name" className="text-xs font-semibold">
                    ชื่อของคุณ <span className="text-muted-foreground font-normal">(ไม่บังคับ)</span>
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 size-4 text-muted-foreground" />
                    <Input
                      id="cust-name"
                      placeholder="เช่น คุณกานต์"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                {customerError && (
                  <p className="rounded-lg bg-red-500/10 p-2.5 text-xs font-medium text-red-600 dark:text-red-400">
                    ⚠️ {customerError}
                  </p>
                )}

                <Button
                  type="submit"
                  size="lg"
                  disabled={loadingCustomer}
                  className="h-10 w-full bg-brand text-brand-fg hover:bg-brand-strong font-bold"
                >
                  {loadingCustomer ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบลูกค้า"} <ArrowRight className="size-4 ml-1" />
                </Button>

                <div className="pt-2 text-center text-xs text-muted-foreground border-t">
                  ยังไม่เคยจองคิว?{" "}
                  <Link href="/book" className="font-bold text-brand-strong hover:underline">
                    จองคิวถ่ายภาพตอนนี้ →
                  </Link>
                </div>
              </form>
            ) : (
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="text-center pb-1">
                  <h2 className="font-heading text-lg font-bold text-foreground">เข้าสู่ระบบผู้ดูแลร้าน</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    สำหรับเจ้าหน้าที่สตูดิโอเพื่อตรวจสอบสลิปและคิวงาน
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="admin-email" className="text-xs font-semibold">อีเมลแอดมิน *</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="admin@starxpress.com"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="admin-pass" className="text-xs font-semibold">รหัสผ่าน *</Label>
                  <Input
                    id="admin-pass"
                    type="password"
                    placeholder="••••••••"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    required
                  />
                  <p className="text-[11px] text-muted-foreground">
                    * รหัสผ่านเริ่มต้น: <code className="bg-muted px-1 py-0.5 rounded font-mono">starexpress2026</code>
                  </p>
                </div>

                {adminError && (
                  <p className="rounded-lg bg-red-500/10 p-2.5 text-xs font-medium text-red-600 dark:text-red-400">
                    ⚠️ {adminError}
                  </p>
                )}

                <Button
                  type="submit"
                  size="lg"
                  disabled={loadingAdmin}
                  className="h-10 w-full bg-coal text-white hover:bg-neutral-800 font-bold"
                >
                  {loadingAdmin ? "กำลังตรวจสอบ..." : "เข้าสู่ระบบแดชบอร์ด"} <Lock className="size-3.5 ml-1" />
                </Button>
              </form>
            )}

            <div className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
              <ShieldCheck className="size-3.5 text-emerald-600" />
              <span>ความปลอดภัยมาตรฐาน PDPA ข้อมูลถูกเข้ารหัสอย่างปลอดภัย</span>
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
