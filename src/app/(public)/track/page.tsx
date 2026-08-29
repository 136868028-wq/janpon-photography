"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, ShieldCheck, Ticket, PackageSearch, ArrowRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/public/page-header";
import { getBookingByCodeAction } from "@/actions/booking";

export default function TrackSearchPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = code.trim().toUpperCase();

    if (!cleanCode) {
      setError("กรุณากรอกรหัสติดตามสถานะคิว");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await getBookingByCodeAction(cleanCode);
      if (res.success && res.booking) {
        router.push(`/track/${cleanCode}`);
      } else {
        setError("ไม่พบข้อมูลคิวงานตามรหัสที่ระบุ กรุณาตรวจสอบรหัสอีกครั้ง");
      }
    } catch {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="ระบบติดตามสถานะคิวงาน"
        title="เช็คสถานะการจอง (Tracking)"
        subtitle="กรอกรหัสติดตามสถานะคิว เพื่อดูขั้นตอนการอนุมัติและไทม์ไลน์งานถ่ายภาพของคุณ"
        className="[&_h2]:text-white [&_p]:text-white/80"
      />

      <section className="mx-auto max-w-xl px-4 py-12">
        <Card className="border shadow-lg">
          <CardContent className="p-6 sm:p-8">
            <div className="text-center pb-2">
              <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-brand/15 text-brand-strong">
                <PackageSearch className="size-6" />
              </div>
              <h2 className="mt-3 font-heading text-lg font-bold text-foreground">
                ค้นหาสถานะคิวงานของคุณ
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                เหมือนการเช็คเลขพัสดุ — ตรวจสอบผลการอนุมัติสลิปและคิวงานได้แบบเรียลไทม์
              </p>
            </div>

            <form onSubmit={handleSearch} className="mt-5 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="track-code" className="text-xs font-semibold">
                  รหัสติดตามสถานะคิว (Tracking Code) *
                </Label>
                <div className="relative">
                  <Ticket className="absolute left-3 top-3 size-4 text-muted-foreground" />
                  <Input
                    id="track-code"
                    placeholder="เช่น STX-26894K หรือ JN4M8T2W"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    className="pl-9 font-mono text-base tracking-widest uppercase"
                    maxLength={15}
                    required
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  * รหัสได้รับหลังจากกดจองคิว หรืออยู่บนใบเสร็จมัดจำ
                </p>
              </div>

              {error && (
                <p className="rounded-lg bg-red-500/10 p-2.5 text-xs font-medium text-red-600 dark:text-red-400">
                  ⚠️ {error}
                </p>
              )}

              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="h-10 w-full bg-brand text-brand-fg hover:bg-brand-strong font-bold"
              >
                {loading ? "กำลังค้นหาในฐานข้อมูล..." : "ค้นหาสถานะคิวงาน"} <Search className="size-4 ml-1" />
              </Button>
            </form>

            <div className="mt-6 border-t pt-4 text-center space-y-2">
              <p className="text-xs text-muted-foreground">
                จำรหัสติดตามไม่ได้?{" "}
                <Link href="/login" className="font-bold text-brand-strong hover:underline">
                  เข้าสู่ระบบด้วยเบอร์โทรศัพท์ เพื่อดูประวัติการจองทั้งหมด →
                </Link>
              </p>
            </div>

            <div className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
              <ShieldCheck className="size-3.5 text-emerald-600" />
              <span>ข้อมูลการจองซิงค์สดจากระบบฐานข้อมูล Supabase แบบเรียลไทม์</span>
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
