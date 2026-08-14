"use client";

import { useState } from "react";
import { CheckCircle2, Pencil, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockPackages, mockServices } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function AdminPackagesPage() {
  const [active, setActive] = useState<Record<string, boolean>>(
    Object.fromEntries(mockPackages.map((p) => [p.id, true])),
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">แพ็กเกจ</h1>
          <p className="mt-1 text-sm text-muted-foreground">แพ็กเกจผูกกับบริการ — ลูกค้าเห็นเฉพาะแพ็กเกจของบริการที่เลือก</p>
        </div>
        <Button size="sm" className="bg-brand text-brand-fg hover:bg-brand-strong">
          <Plus className="size-4" /> เพิ่มแพ็กเกจ
        </Button>
      </div>

      <Tabs defaultValue={mockServices[0].id}>
        <TabsList className="flex-wrap">
          {mockServices.map((s) => (
            <TabsTrigger key={s.id} value={s.id}>{s.name}</TabsTrigger>
          ))}
        </TabsList>
        {mockServices.map((s) => {
          const pkgs = mockPackages.filter((p) => p.serviceSlug === s.slug);
          return (
            <TabsContent key={s.id} value={s.id} className="space-y-3">
              {pkgs.map((pkg) => (
                <Card key={pkg.id} className={cn("", !active[pkg.id] && "opacity-70")}>
                  <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-heading text-base font-bold">{pkg.name}</h3>
                        {pkg.popular && <Badge className="bg-brand text-brand-fg"><Sparkles className="size-3" /> ยอดนิยม</Badge>}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{pkg.description}</p>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span className="font-semibold text-foreground">{pkg.price.toLocaleString("th-TH")} บาท</span>
                        <span>มัดจำ {pkg.deposit.toLocaleString("th-TH")} บาท</span>
                        <span>{pkg.durationMinutes} นาที</span>
                      </div>
                      <ul className="mt-2 flex flex-wrap gap-1.5">
                        {pkg.deliverables.map((d) => (
                          <li key={d} className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                            <CheckCircle2 className="size-3 text-emerald-600" /> {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Switch
                          checked={active[pkg.id]}
                          onCheckedChange={(v) => setActive((prev) => ({ ...prev, [pkg.id]: v }))}
                          aria-label={`เปิด/ปิดแพ็กเกจ ${pkg.name}`}
                        />
                        {active[pkg.id] ? "เปิด" : "ปิด"}
                      </label>
                      <Button variant="outline" size="sm" className="h-8"><Pencil className="size-3.5" /> แก้ไข</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}