"use client";

import { useState } from "react";
import { Camera, CreditCard, Save, ShieldCheck, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { ImageMock } from "@/components/shared/image-mock";
import { mockPaymentSettings, depositQrs } from "@/lib/mock-data";
import { HOLD_DURATION_MINUTES, DEPOSIT_FALLBACK_THB, BUSINESS } from "@/constants/booking";

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [qrActive, setQrActive] = useState(mockPaymentSettings.isActive);
  const [hold, setHold] = useState(HOLD_DURATION_MINUTES);

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">ตั้งค่าระบบ</h1>
          <p className="mt-1 text-sm text-muted-foreground">ตั้งค่าการชำระเงิน ระบบจอง และข้อมูลร้าน</p>
        </div>
        <Button size="sm" className="bg-brand text-brand-fg hover:bg-brand-strong" onClick={save}>
          <Save className="size-4" /> {saved ? "บันทึกแล้ว ✓" : "บันทึกการตั้งค่า"}
        </Button>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <CreditCard className="size-4 text-brand-strong" /> ตั้งค่าการชำระเงิน (Payment V1 — Manual)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="set-bank">ธนาคาร</Label>
                <Input id="set-bank" defaultValue={mockPaymentSettings.bankName} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="set-name">ชื่อบัญชี / เจ้าของบัญชี</Label>
                <Input id="set-name" defaultValue={mockPaymentSettings.accountName} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="set-pp">เลขพร้อมเพย์ / ช่องทาง</Label>
                <Input id="set-pp" defaultValue={mockPaymentSettings.promptpayId} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="set-deposit">มัดจำเริ่มต้น (บาท)</Label>
                <Input id="set-deposit" type="number" defaultValue={DEPOSIT_FALLBACK_THB} />
              </div>
            </div>
            <Separator />
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">QR พร้อมเพย์สำหรับรับเงินมัดจำ (แยกตามประเภทบริการ)</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    แสดงอัตโนมัติตามบริการที่ลูกค้าเลือกในการจอง
                  </p>
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <Switch checked={qrActive} onCheckedChange={setQrActive} aria-label="เปิดใช้งาน QR" />
                  เปิดใช้งาน
                </label>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <div className="space-y-2 rounded-xl border bg-card p-3 text-center">
                  <div className="inline-flex rounded-full bg-purple-500/10 px-2 py-0.5 text-[11px] font-bold text-purple-600 dark:text-purple-400">
                    รูปที่ 1 · 300 บาท
                  </div>
                  <p className="text-xs font-semibold">ถ่ายพอร์ต</p>
                  <div className="mx-auto w-24">
                    <ImageMock
                      image={depositQrs.portrait}
                      aspect="aspect-[729/1024]"
                      showCaption={false}
                      objectFit="contain"
                      className="border shadow-sm"
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">ธ.กรุงไทย · นายนุกมัน แบนอ</p>
                </div>

                <div className="space-y-2 rounded-xl border bg-card p-3 text-center">
                  <div className="inline-flex rounded-full bg-blue-500/10 px-2 py-0.5 text-[11px] font-bold text-blue-600 dark:text-blue-400">
                    รูปที่ 2 · 500 บาท
                  </div>
                  <p className="text-xs font-semibold">รับปริญญา & แต่งงานครึ่งวัน</p>
                  <div className="mx-auto w-24">
                    <ImageMock
                      image={depositQrs.gradAndPort}
                      aspect="aspect-[729/1024]"
                      showCaption={false}
                      objectFit="contain"
                      className="border shadow-sm"
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">ธ.กรุงไทย · นายนุกมัน แบนอ</p>
                </div>

                <div className="space-y-2 rounded-xl border bg-card p-3 text-center">
                  <div className="inline-flex rounded-full bg-rose-500/10 px-2 py-0.5 text-[11px] font-bold text-rose-600 dark:text-rose-400">
                    รูปที่ 3 · 1,000 บาท
                  </div>
                  <p className="text-xs font-semibold">แต่งงานเต็มวัน & อีเวนต์เล็ก</p>
                  <div className="mx-auto w-24">
                    <ImageMock
                      image={depositQrs.wedding}
                      aspect="aspect-[729/1024]"
                      showCaption={false}
                      objectFit="contain"
                      className="border shadow-sm"
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">ธ.กรุงไทย · นายนุกมัน แบนอ</p>
                </div>

                <div className="space-y-2 rounded-xl border bg-card p-3 text-center">
                  <div className="inline-flex rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    พรีเมียม · 5,000 บาท
                  </div>
                  <p className="text-xs font-semibold">งานแต่งงาน (พรีเมียม)</p>
                  <div className="mx-auto w-24">
                    <ImageMock
                      image={depositQrs.weddingPremium}
                      aspect="aspect-[729/1024]"
                      showCaption={false}
                      objectFit="contain"
                      className="border shadow-sm"
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">ธ.กรุงไทย · นายนุกมัน แบนอ</p>
                </div>

                <div className="space-y-2 rounded-xl border bg-card p-3 text-center">
                  <div className="inline-flex rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                    รูปที่ 5 · 1,500 บาท
                  </div>
                  <p className="text-xs font-semibold">งานอีเวนต์ (งานใหญ่)</p>
                  <div className="mx-auto w-24">
                    <ImageMock
                      image={depositQrs.event}
                      aspect="aspect-[729/1024]"
                      showCaption={false}
                      objectFit="contain"
                      className="border shadow-sm"
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">ธ.กรุงไทย · นายนุกมัน แบนอ</p>
                </div>
              </div>
            </div>
            <Separator />
            <div className="rounded-lg bg-amber-500/5 border border-amber-600/25 p-3 text-xs text-amber-700 dark:text-amber-300">
              <strong>เวอร์ชันปัจจุบัน: Manual Slip Verification</strong> — ลูกค้าอัปโหลดสลิป ให้แอดมินตรวจสอบเอง
              สถาปัตยกรรมพร้อมรองรับ Payment Gateway + Webhook ในอนาคตโดยไม่ต้องแก้ booking engine
            </div>
          </CardContent>
        </Card>

        <div className="space-y-5">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Store className="size-4 text-brand-strong" /> ข้อมูลร้าน
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="set-shop">ชื่อร้าน</Label>
                <Input id="set-shop" defaultValue={BUSINESS.name} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="set-phone">เบอร์โทร</Label>
                <Input id="set-phone" defaultValue={BUSINESS.phone} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="set-line">LINE ID</Label>
                <Input id="set-line" defaultValue={BUSINESS.lineId} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Camera className="size-4 text-brand-strong" /> ระบบจอง
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="set-hold">ระยะเวลาล็อกคิว (นาที)</Label>
                <Input id="set-hold" type="number" value={hold} onChange={(e) => setHold(Number(e.target.value))} />
              </div>
              <p className="flex items-start gap-2 rounded-lg bg-muted/70 p-3 text-xs text-muted-foreground">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                ระหว่างล็อกคิว ลูกค้าคนอื่นจองคิวเดียวกันไม่ได้ — หมดเวลาคิวจะกลับว่างอัตโนมัติ
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}