"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ShieldCheck, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/public/page-header";
import { mockBookings } from "@/lib/mock-data";
import { getBookingByCodeAction } from "@/actions/booking";

export default function MyBookingPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const normalized = code.trim().toUpperCase();

    try {
      // 1. Check Supabase DB
      const res = await getBookingByCodeAction(normalized);
      if (res.success && res.booking) {
        const cleanInputPhone = phone.replace(/[^0-9]/g, "");
        const cleanDbPhone = (res.booking.customer_phone || "").replace(/[^0-9]/g, "");

        if (!cleanInputPhone || cleanDbPhone.includes(cleanInputPhone) || cleanInputPhone.includes(cleanDbPhone)) {
          router.push(`/booking/${normalized}`);
          return;
        } else {
          setError("เบอร์โทรศัพท์ไม่ตรงกับข้อมูลในระบบ กรุณาตรวจสอบอีกครั้ง");
          setLoading(false);
          return;
        }
      }

      // 2. Check Mock Data
      const match = mockBookings.find((b) => b.code === normalized);
      if (match) {
        router.push(`/booking/${normalized}`);
      } else {
        setError("ไม่พบการจอง กรุณาตรวจสอบรหัสและเบอร์โทรอีกครั้ง");
      }
    } catch {
      setError("เกิดข้อผิดพลาดในการค้นหา กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="ค้นหาการจอง"
        title="เช็คสถานะการจองของคุณ"
        subtitle="กรอกเบอร์โทรและรหัสการจอง (บันทึกในระบบฐานข้อมูล Supabase)"
      />
      <section className="mx-auto max-w-xl px-4 py-12">
        <Card>
          <CardContent className="p-6 sm:p-8">
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="lookup-code">รหัสการจอง</Label>
                <Input
                  id="lookup-code"
                  placeholder="เช่น SX7M8T2W"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="font-mono text-lg tracking-widest uppercase"
                  maxLength={10}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lookup-phone">เบอร์โทรศัพท์ที่ใช้จอง</Label>
                <Input
                  id="lookup-phone"
                  inputMode="tel"
                  placeholder="08x-xxx-xxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              {error && (
                <p role="alert" className="rounded-lg bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-300">
                  {error}
                </p>
              )}
              <Button size="lg" className="h-10 w-full bg-brand text-brand-fg hover:bg-brand-strong font-bold" disabled={loading}>
                <Search className="size-4" /> {loading ? "กำลังค้นหาในฐานข้อมูล..." : "ค้นหาการจอง"}
              </Button>
            </form>
            <div className="mt-5 space-y-3 border-t pt-5">
              <p className="flex items-center gap-2 text-sm font-semibold">
                <Ticket className="size-4 text-brand-strong" /> ตัวอย่างรหัสการจอง
              </p>
              <div className="grid grid-cols-2 gap-2">
                {mockBookings.slice(0, 4).map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => { setCode(b.code); setPhone(b.phone); }}
                    className="rounded-lg border p-2.5 text-left text-xs transition-colors hover:border-brand/50 hover:bg-muted/50"
                  >
                    <p className="font-mono font-bold tracking-wider">{b.code}</p>
                    <p className="mt-0.5 text-muted-foreground">{b.serviceName}</p>
                  </button>
                ))}
              </div>
            </div>
            <p className="mt-5 flex items-start gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" />
              เพื่อความปลอดภัย ระบบจะแสดงข้อมูลเมื่อระบุทั้งรหัสการจองและเบอร์โทรที่ตรงกันเท่านั้น
            </p>
          </CardContent>
        </Card>
      </section>
    </>
  );
}