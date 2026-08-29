"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Download,
  FileUp,
  ShieldCheck,
  Sparkles,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageMock } from "@/components/shared/image-mock";
import { BookingSteps } from "@/components/booking/booking-steps";
import { SlotChip, DayStatusPill } from "@/components/booking/slot-status";
import { mockServices, mockPackages, mockAvailabilityDays, mockPaymentSettings, getDepositQr } from "@/lib/mock-data";
import { HOLD_DURATION_MINUTES, SLOT_MORNING, SLOT_EVENING, BUSINESS } from "@/constants/booking";
import { cn } from "@/lib/utils";

type WizardStep = 1 | 2 | 3 | 4 | 5 | 6;

const THAI_MONTHS = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];

export default function BookPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-sm text-muted-foreground">กำลังโหลด...</div>}>
      <BookWizard />
    </Suspense>
  );
}

function BookWizard() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState<WizardStep>(1);

  const [serviceId, setServiceId] = useState<string>(() => {
    const s = searchParams.get("service");
    return mockServices.find((x) => x.slug === s)?.id ?? mockServices[0].id;
  });
  const [packageId, setPackageId] = useState<string | null>(() => searchParams.get("package"));
  const [date, setDate] = useState<string | null>(() => searchParams.get("date"));
  const [slot, setSlot] = useState<string | null>(null);
  const [customer, setCustomer] = useState({ fullName: "", phone: "", email: "", lineUserId: "", note: "" });
  const [paid, setPaid] = useState(false);

  const service = mockServices.find((s) => s.id === serviceId)!;
  const availablePackages = useMemo(
    () => mockPackages.filter((p) => p.serviceSlug === service.slug),
    [service.slug],
  );
  const selectedPackage =
    availablePackages.find((p) => p.id === packageId) ?? availablePackages[0];

  const selectedDay = mockAvailabilityDays.find((d) => d.date === date);
  const { minutes, seconds, secondsLeft } = useHoldCountdown(step === 5);

  const canContinue = useMemo(() => {
    if (step === 1) return true;
    if (step === 2) return Boolean(date && slot);
    if (step === 3) return customer.fullName.trim().length > 0 && customer.phone.trim().length >= 9;
    return true;
  }, [step, date, slot, customer]);

  const bookingCode = "JN4M8T2W";
  const totalPrice = selectedPackage ? selectedPackage.price : service.basePrice;
  const deposit = selectedPackage ? selectedPackage.deposit : service.deposit;

  const handleSelectService = (id: string) => {
    setServiceId(id);
    const target = mockServices.find((s) => s.id === id);
    if (target) {
      const pkgs = mockPackages.filter((p) => p.serviceSlug === target.slug);
      if (pkgs.length > 0) setPackageId(pkgs[0].id);
    }
  };

  const goTo = (next: WizardStep) => {
    if (step === 3 && next === 4) {
      // mock: ล็อกคิวชั่วคราวเมื่อกดไปชำระเงิน
      setStep(4);
      return;
    }
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-sand/60">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
        <div className="mx-auto mb-8 max-w-2xl">
          <BookingSteps current={step} />
        </div>

        <Card>
          <CardContent className="p-5 sm:p-8">
            {step === 1 && (
              <div>
                <h1 className="font-heading text-xl font-bold">เลือกบริการและแพ็กเกจ</h1>
                <p className="mt-1 text-sm text-muted-foreground">มีคำถามเรื่องแพ็กเกจ? <Link href="/faq" className="font-semibold text-brand-strong hover:underline">อ่านคำถามที่พบบ่อย</Link></p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {mockServices.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => handleSelectService(s.id)}
                      aria-pressed={serviceId === s.id}
                      className={cn(
                        "flex items-center gap-3 rounded-xl border p-3 text-left transition-all",
                        serviceId === s.id ? "border-brand bg-brand/5 ring-2 ring-brand/30" : "border-border hover:border-brand/40",
                      )}
                    >
                      <ImageMock image={s.image} className="size-16 shrink-0" aspect="aspect-square" rounded />
                      <div className="min-w-0">
                        <p className="text-sm font-bold">{s.name}</p>
                        <p className="text-xs text-muted-foreground">เริ่ม {s.basePrice.toLocaleString("th-TH")} บาท · มัดจำ {s.deposit.toLocaleString("th-TH")} บาท</p>
                      </div>
                    </button>
                  ))}
                </div>

                {availablePackages.length > 0 && (
                  <div className="mt-6">
                    <p className="text-sm font-semibold">แพ็กเกจของ {service.name}</p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                      {availablePackages.map((pkg) => (
                        <button
                          key={pkg.id}
                          type="button"
                          onClick={() => setPackageId(pkg.id)}
                          aria-pressed={selectedPackage?.id === pkg.id}
                          className={cn(
                            "flex flex-col justify-between rounded-xl border p-4 text-left transition-all",
                            selectedPackage?.id === pkg.id
                              ? "border-brand bg-brand/5 ring-2 ring-brand/30"
                              : "border-border hover:border-brand/40",
                          )}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-1">
                              <p className="text-sm font-bold">{pkg.name}</p>
                              {pkg.popular && (
                                <span className="rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold text-brand-fg">
                                  ยอดนิยม
                                </span>
                              )}
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">{pkg.description}</p>
                          </div>
                          <div className="mt-3 border-t pt-2">
                            <p className="text-base font-extrabold text-brand-strong">
                              {pkg.price.toLocaleString("th-TH")}{" "}
                              <span className="text-xs font-normal text-muted-foreground">บาท</span>
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              มัดจำ {pkg.deposit.toLocaleString("th-TH")} บาท
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <div>
                <h1 className="font-heading text-xl font-bold">เลือกวันและเวลา</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  บริการ: <span className="font-semibold">{service.name}</span> · สถานะคิวอัปเดตแบบเรียลไทม์
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  <DayStatusPill status="both_free" />
                  <DayStatusPill status="morning_only" />
                  <DayStatusPill status="evening_only" />
                  <DayStatusPill status="full" />
                  <DayStatusPill status="closed" />
                </div>
                <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
                  {mockAvailabilityDays.map((day) => {
                    const disabled = day.status === "past" || day.status === "closed" || day.status === "full";
                    return (
                      <button
                        key={day.date}
                        type="button"
                        disabled={disabled}
                        onClick={() => { setDate(day.date); setSlot(null); }}
                        aria-pressed={date === day.date}
                        className={cn(
                          "flex min-h-16 flex-col items-center justify-center gap-0.5 rounded-lg border p-1.5 text-center transition-all",
                          date === day.date ? "border-brand bg-brand/10 ring-2 ring-brand/30" : "border-border hover:border-brand/40",
                          disabled && "cursor-not-allowed opacity-40 hover:border-border",
                        )}
                      >
                        <span className="text-[11px] text-muted-foreground">{day.dayName}</span>
                        <span className="text-sm font-bold">{Number(day.date.slice(-2))} {THAI_MONTHS[Number(day.date.slice(5, 7)) - 1]}</span>
                        <span className={cn(
                          "text-[10px] font-medium",
                          day.status === "both_free" && "text-emerald-600 dark:text-emerald-400",
                          day.status === "morning_only" && "text-sky-600 dark:text-sky-400",
                          day.status === "evening_only" && "text-violet-600 dark:text-violet-400",
                          day.status === "full" && "text-red-600 dark:text-red-400",
                          day.status === "closed" && "text-muted-foreground",
                        )}>
                          {day.status === "both_free" ? "เช้า/บ่ายว่าง" : day.status === "morning_only" ? "ช่วงเช้าว่าง" : day.status === "evening_only" ? "ช่วงบ่ายว่าง" : day.status === "full" ? "เต็ม" : "ปิด"}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {date && selectedDay && (
                  <div className="mt-6">
                    <p className="text-sm font-semibold">
                      เลือกช่วงเวลา · <span className="text-muted-foreground">{Number(date.slice(-2))} {THAI_MONTHS[Number(date.slice(5, 7)) - 1]}</span>
                    </p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <SlotChip
                        label={SLOT_MORNING.label}
                        range={SLOT_MORNING.rangeLabel}
                        selected={slot === "morning"}
                        disabled={selectedDay.status === "evening_only" || selectedDay.status === "full"}
                        onSelect={() => setSlot("morning")}
                      />
                      <SlotChip
                        label={SLOT_EVENING.label}
                        range={SLOT_EVENING.rangeLabel}
                        selected={slot === "evening"}
                        disabled={selectedDay.status === "morning_only" || selectedDay.status === "full"}
                        onSelect={() => setSlot("evening")}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div>
                <h1 className="font-heading text-xl font-bold">ข้อมูลผู้จอง</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  ข้อมูลนี้ใช้สำหรับยืนยันตัวตนและติดต่อเรื่องคิวเท่านั้น — ไม่เปิดเผยต่อสาธารณะ
                </p>
                <div className="mt-5 space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="bk-name">ชื่อ-นามสกุล *</Label>
                    <Input id="bk-name" placeholder="เช่น วรรณนิสา จันทร์ศรี" value={customer.fullName} onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="bk-phone">เบอร์โทรศัพท์ *</Label>
                    <Input id="bk-phone" inputMode="tel" placeholder="08x-xxx-xxxx" value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="bk-email">อีเมล <span className="text-muted-foreground">(ไม่บังคับ)</span></Label>
                      <Input id="bk-email" type="email" placeholder="you@example.com" value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="bk-line">LINE <span className="text-muted-foreground">(ไม่บังคับ)</span></Label>
                      <Input id="bk-line" placeholder="LINE ID ของคุณ" value={customer.lineUserId} onChange={(e) => setCustomer({ ...customer, lineUserId: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="bk-note">หมายเหตุเพิ่มเติม <span className="text-muted-foreground">(ไม่บังคับ)</span></Label>
                    <Textarea id="bk-note" rows={3} placeholder="เช่น ต้องการถ่ายที่บ้านก่อน ใส่ชุดไทย 2 ชุด..." value={customer.note} onChange={(e) => setCustomer({ ...customer, note: e.target.value })} />
                  </div>
                  <p className="rounded-lg bg-muted/70 p-3 text-xs leading-relaxed text-muted-foreground">
                    <ShieldCheck className="mr-1 inline size-3.5 text-emerald-600" />
                    ข้อมูลของคุณถูกเก็บเป็นความลับ ตามนโยบายความเป็นส่วนตัว (PDPA) —{" "}
                    <Link href="/privacy" className="underline">อ่านนโยบาย</Link>
                  </p>
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <h1 className="font-heading text-xl font-bold">ตรวจสอบข้อมูลก่อนจอง</h1>
                <p className="mt-1 text-sm text-muted-foreground">ตรวจสอบให้เรียบร้อย — เมื่อกดจอง คิวจะถูกล็อก 10 นาที</p>
                <dl className="mt-5 divide-y rounded-xl border">
                  {[
                    ["บริการ", service.name],
                    ["แพ็กเกจ", selectedPackage ? selectedPackage.name : "-"],
                    ["ช่วงเวลา", date && selectedDay ? `${selectedDay.dayName} ${Number(date.slice(-2))} ${THAI_MONTHS[Number(date.slice(5, 7)) - 1]} · ${slot === "morning" ? SLOT_MORNING.label : SLOT_EVENING.label} (${slot === "morning" ? SLOT_MORNING.rangeLabel : SLOT_EVENING.rangeLabel})` : "-"],
                    ["ชื่อผู้จอง", customer.fullName],
                    ["เบอร์โทร", customer.phone],
                    ["อีเมล", customer.email || "-"],
                    ["LINE", customer.lineUserId || "-"],
                    ["หมายเหตุ", customer.note || "-"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-start justify-between gap-4 px-4 py-3">
                      <dt className="text-sm text-muted-foreground">{k}</dt>
                      <dd className="text-right text-sm font-medium">{v}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-5 rounded-xl bg-sand p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">ค่าบริการเต็มจำนวน</span>
                    <span>{totalPrice.toLocaleString("th-TH")} บาท</span>
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">มัดจำที่ต้องชำระตอนนี้</span>
                    <span className="font-heading text-lg font-extrabold text-brand-strong">{deposit.toLocaleString("th-TH")} บาท</span>
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">ชำระภายหลัง</span>
                    <span>{(totalPrice - deposit).toLocaleString("th-TH")} บาท</span>
                  </div>
                </div>
                <p className="mt-4 flex items-center gap-2 rounded-lg border border-emerald-600/20 bg-emerald-500/5 p-3 text-xs text-emerald-700 dark:text-emerald-300">
                  <ShieldCheck className="size-4 shrink-0" />
                  เมื่อกดจอง คิวจะถูกล็อกไว้ <strong>{HOLD_DURATION_MINUTES} นาที</strong> เพื่อให้ชำระเงิน — คนอื่นจะจองคิวนี้ไม่ได้
                </p>
              </div>
            )}

            {step === 5 && (
              <div className="text-center">
                <h1 className="font-heading text-xl font-bold">ชำระมัดจำ {deposit.toLocaleString("th-TH")} บาท</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  รหัสการจอง <span className="font-bold tracking-wider text-foreground">{bookingCode}</span>
                </p>

                {secondsLeft > 0 ? (
                  <div className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full border border-amber-600/30 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-700 dark:text-amber-300">
                    <Clock className="size-4" />
                    คิวถูกล็อก · เหลือเวลาชำระเงิน {minutes}:{String(seconds).padStart(2, "0")}
                  </div>
                ) : (
                  <div className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full border border-red-600/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-700 dark:text-red-300">
                    คิวหมดอายุแล้ว — ลองเลือกเวลาอื่นดู
                  </div>
                )}

                <div className="mx-auto mt-5 max-w-sm">
                  <div className="relative overflow-hidden rounded-2xl border bg-white p-4 shadow-sm">
                    <div className="mx-auto w-full max-w-[280px]">
                      <ImageMock
                        image={getDepositQr(service.slug, deposit)}
                        aspect="aspect-[729/1024]"
                        showCaption={false}
                        objectFit="contain"
                        className="rounded-xl border shadow-sm"
                      />
                    </div>
                    <div className="mt-3 text-center">
                      <p className="text-xs font-medium text-foreground">
                        PromptPay / {mockPaymentSettings.bankName} · {mockPaymentSettings.accountName}
                      </p>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        สแกน QR ผ่านแอปธนาคารใดก็ได้เพื่อชำระเงินมัดจำ {deposit.toLocaleString("th-TH")} บาท
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between rounded-xl border bg-card p-3 text-left text-sm">
                    <span className="text-muted-foreground">บันทึก QR ไว้สแกน</span>
                    {getDepositQr(service.slug, deposit).src ? (
                      <a
                        href={getDepositQr(service.slug, deposit).src}
                        download={`promptpay-deposit-${service.slug}-${deposit}thb`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button size="sm" variant="outline" className="h-8">
                          <Download className="size-3.5" /> บันทึก QR
                        </Button>
                      </a>
                    ) : (
                      <Button size="sm" variant="outline" className="h-8">
                        <Download className="size-3.5" /> บันทึก QR
                      </Button>
                    )}
                  </div>
                </div>

                {!paid ? (
                  <div className="mx-auto mt-5 max-w-sm rounded-xl border-2 border-dashed p-6">
                    <Upload className="mx-auto size-8 text-muted-foreground" />
                    <p className="mt-2 text-sm font-semibold">อัปโหลดสลิปการชำระเงิน</p>
                    <p className="text-xs text-muted-foreground">PNG/JPG/PDF ไม่เกิน 5 MB</p>
                    <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-coal py-2.5 text-sm font-semibold text-white">
                      <FileUp className="size-4" /> เลือกไฟล์สลิป
                      <input
                        type="file"
                        accept="image/png,image/jpeg,application/pdf"
                        className="sr-only"
                        onChange={() => { setPaid(true); }}
                      />
                    </label>
                    <p className="mt-3 text-xs text-muted-foreground">
                      เมื่ออัปโหลดแล้ว ระบบจะส่งหลักฐานให้แอดมินตรวจสอบ — การยืนยันคิวจะแจ้งหลังตรวจสอบแล้วเท่านั้น
                    </p>
                  </div>
                ) : (
                  <div className="mx-auto mt-5 max-w-sm rounded-2xl border border-emerald-600/25 bg-emerald-500/5 p-6">
                    <CheckCircle2 className="mx-auto size-10 text-emerald-600" />
                    <h2 className="mt-3 font-heading text-lg font-bold">ได้รับหลักฐานการชำระเงินแล้ว</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      กำลังรอการตรวจสอบจากทีมงาน (ปกติภายใน 1 ชั่วโมง ในเวลาทำการ)
                    </p>
                    <p className="mt-3 text-xs text-emerald-700 dark:text-emerald-300">
                      หมายเหตุ: ยังไม่ถือว่าชำระสำเร็จจนกว่าจะผ่านการตรวจสอบ
                    </p>
                  </div>
                )}
              </div>
            )}

            {step === 6 && (
              <div className="py-6 text-center">
                <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-500/10">
                  <CheckCircle2 className="size-9 text-emerald-600" />
                </div>
                <h1 className="mt-4 font-heading text-2xl font-extrabold">จองคิวสำเร็จ!</h1>
                <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                  รหัสการจองของคุณคือ <span className="font-heading text-lg font-bold tracking-widest text-foreground">{bookingCode}</span>
                  <br />
                  เราได้ส่งรายละเอียดให้คุณทางอีเมล/ไลน์แล้ว
                </p>
                <div className="mx-auto mt-6 max-w-sm rounded-xl border bg-sand p-4 text-left text-sm">
                  <div className="flex justify-between py-1"><span className="text-muted-foreground">บริการ</span><span className="font-medium">{service.name}</span></div>
                  {selectedPackage && (
                    <div className="flex justify-between py-1"><span className="text-muted-foreground">แพ็กเกจ</span><span className="font-medium">{selectedPackage.name}</span></div>
                  )}
                  <div className="flex justify-between py-1"><span className="text-muted-foreground">วันเวลา</span><span className="font-medium">{slot === "morning" ? SLOT_MORNING.rangeLabel : SLOT_EVENING.rangeLabel} ({slot === "morning" ? SLOT_MORNING.label : SLOT_EVENING.label})</span></div>
                  <div className="flex justify-between py-1"><span className="text-muted-foreground">มัดจำ</span><span className="font-medium">{deposit.toLocaleString("th-TH")} บาท</span></div>
                  <div className="flex justify-between py-1"><span className="text-muted-foreground">สถานะ</span><span className="font-medium text-sky-600 dark:text-sky-400">รอตรวจสอบหลักฐาน</span></div>
                </div>
                <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                  <Link href={`/booking/${bookingCode}`}>
                    <Button size="lg" className="h-10 w-full sm:w-auto">ติดตามสถานะการจอง</Button>
                  </Link>
                  <Link href="/">
                    <Button size="lg" variant="outline" className="h-10 w-full sm:w-auto">กลับหน้าแรก</Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sticky footer CTA */}
        <div className="sticky bottom-4 mt-4">
          <Card className="border shadow-lg">
            <CardContent className="flex items-center justify-between gap-3 p-3 sm:p-4">
              <div className="min-w-0 text-sm">
                {step === 5 ? (
                  <p className="truncate font-semibold">มัดจำ {deposit.toLocaleString("th-TH")} บาท · <span className="text-muted-foreground font-normal">คิวล็อก {minutes}:{String(seconds).padStart(2, "0")} นาที</span></p>
                ) : step === 6 ? (
                  <p className="truncate text-muted-foreground">ขอบคุณที่ใช้บริการ {BUSINESS.name} 💛</p>
                ) : (
                  <p className="truncate">
                    <span className="font-semibold">{service.name}</span>
                    {selectedPackage && <span className="text-muted-foreground"> ({selectedPackage.name})</span>}
                    {date && <span className="text-muted-foreground"> · {slot === "morning" ? SLOT_MORNING.label : SLOT_EVENING.label}</span>}
                    <span className="text-muted-foreground"> · มัดจำ {deposit.toLocaleString("th-TH")} บาท</span>
                  </p>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {step > 1 && step <= 5 && (
                  <Button variant="ghost" size="lg" className="h-10" onClick={() => goTo((step - 1) as WizardStep)}>
                    <ArrowLeft className="size-4" /> <span className="hidden sm:inline">ย้อนกลับ</span>
                  </Button>
                )}
                {step < 4 && (
                  <Button size="lg" className="h-10 bg-brand px-6 text-brand-fg hover:bg-brand-strong" disabled={!canContinue} onClick={() => goTo((step + 1) as WizardStep)}>
                    ต่อไป <ArrowRight className="size-4" />
                  </Button>
                )}
                {step === 4 && (
                  <Button size="lg" className="h-10 bg-brand px-6 text-brand-fg hover:bg-brand-strong" onClick={() => goTo(5)}>
                    <Sparkles className="size-4" /> ล็อกคิวและไปชำระเงิน
                  </Button>
                )}
                {step === 5 && !paid && (
                  <Button size="lg" variant="outline" className="h-10" onClick={() => setPaid(true)} disabled={secondsLeft === 0}>
                    ฉันชำระเงินแล้ว
                  </Button>
                )}
                {step === 5 && paid && (
                  <Button size="lg" className="h-10" onClick={() => goTo(6)}>ไปหน้าเสร็จสิ้น</Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          มีปัญหาการชำระเงิน? <Link href="/contact" className="font-semibold text-brand-strong hover:underline">ติดต่อเรา</Link> ·{" "}
          <Link href="/my-booking" className="hover:underline">ค้นหาการจองของคุณ</Link>
        </p>
      </div>
    </div>
  );
}

function useHoldCountdown(active: boolean) {
  const [secondsLeft, setSecondsLeft] = useState(HOLD_DURATION_MINUTES * 60);
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [active]);
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  return { minutes, seconds, secondsLeft };
}
