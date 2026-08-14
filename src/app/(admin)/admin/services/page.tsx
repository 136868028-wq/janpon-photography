"use client";

import { useState } from "react";
import { Check, Clock, Eye, Pencil, Plus, Wallet } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ImageMock } from "@/components/shared/image-mock";
import { mockServices } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function AdminServicesPage() {
  const [active, setActive] = useState<Record<string, boolean>>(
    Object.fromEntries(mockServices.map((s) => [s.id, true])),
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">บริการ</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            บริการทั้งหมดถูกดึงจากฐานข้อมูล (ไม่ hard-code ในเว็บ) — ระบบหน้าบ้านอ่านค่าจากตาราง services เสมอ
          </p>
        </div>
        <Button size="sm" className="bg-brand text-brand-fg hover:bg-brand-strong">
          <Plus className="size-4" /> เพิ่มบริการ
        </Button>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {mockServices.map((s) => (
          <Card key={s.id} className={cn("overflow-hidden", !active[s.id] && "opacity-70")}>
            <CardContent className="p-0">
              <div className="flex gap-4 p-4 sm:p-5">
                <ImageMock image={s.image} className="size-24 shrink-0" aspect="aspect-square" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h2 className="font-heading text-base font-bold">{s.name}</h2>
                      <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">slug: /{s.slug}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Switch
                          checked={active[s.id]}
                          onCheckedChange={(v) => setActive((prev) => ({ ...prev, [s.id]: v }))}
                          aria-label={`เปิด/ปิดบริการ ${s.name}`}
                        />
                        {active[s.id] ? "เปิด" : "ปิด"}
                      </label>
                    </div>
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{s.description}</p>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Wallet className="size-3.5 text-brand-strong" /> ราคา {s.basePrice.toLocaleString("th-TH")} บาท</span>
                    <span className="flex items-center gap-1"><Wallet className="size-3.5 text-brand-strong" /> มัดจำ {s.deposit.toLocaleString("th-TH")} บาท</span>
                    <span className="flex items-center gap-1"><Clock className="size-3.5 text-brand-strong" /> {s.durationMinutes} นาที</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between border-t bg-muted/30 px-4 py-2.5">
                <p className="text-xs text-muted-foreground">ลำดับแสดงผล: {s.tags.join(" · ")}</p>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" className="h-7" asChild>
                    <Link href={`/services/${s.slug}`}><Eye className="size-3.5" /> ดูหน้าเว็บ</Link>
                  </Button>
                  <Button size="sm" variant="outline" className="h-7"><Pencil className="size-3.5" /> แก้ไข</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="rounded-xl bg-sand p-4 text-xs text-muted-foreground">
        <p className="font-semibold flex items-center gap-1.5"><Check className="size-3.5 text-emerald-600" /> หมายเหตุระบบ</p>
        <p className="mt-1">
          การปิดบริการ = ลูกค้าไม่เห็นบริการนี้ในหน้า /services และ /book แต่ booking ที่มีอยู่เดิมยังคงอยู่ครบ
          — ราคาและมัดจำบริการอ่านจากฐานข้อมูลเสมอ ไม่มีค่าตายตัวในโค้ด
        </p>
      </div>
    </div>
  );
}