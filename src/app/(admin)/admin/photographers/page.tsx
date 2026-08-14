"use client";

import { useState } from "react";
import { Camera, Pencil, Plus, Star, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { RoleBadge } from "@/components/shared/status-badge";
import { mockPhotographers } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function AdminPhotographersPage() {
  const [active, setActive] = useState<Record<string, boolean>>(
    Object.fromEntries(mockPhotographers.map((p) => [p.id, p.isActive])),
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">ช่างภาพ</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            จัดทีมช่างภาพและสิทธิ์การเข้าถึงระบบ — ช่างภาพ = ดูคิวของตัวเองเท่านั้น
          </p>
        </div>
        <Button size="sm" className="bg-brand text-brand-fg hover:bg-brand-strong">
          <Plus className="size-4" /> เพิ่มช่างภาพ
        </Button>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {mockPhotographers.map((p) => (
          <Card key={p.id} className={cn("", !active[p.id] && "opacity-70")}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex size-12 items-center justify-center rounded-full bg-coal text-brand">
                    <UserRound className="size-6" />
                  </span>
                  <div>
                    <p className="flex items-center gap-2 font-heading text-base font-bold">
                      {p.displayName}
                      {p.isDefault && <Badge className="bg-brand text-brand-fg">ค่าเริ่มต้น</Badge>}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Star className="size-3.5 text-amber-500" /> {p.rating.toFixed(1)} · {p.bookings} งาน
                    </p>
                  </div>
                </div>
                <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Switch
                    checked={active[p.id]}
                    onCheckedChange={(v) => setActive((prev) => ({ ...prev, [p.id]: v }))}
                    aria-label={`เปิด/ปิดช่าง ${p.displayName}`}
                  />
                  {active[p.id] ? "ใช้งาน" : "พักงาน"}
                </label>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <RoleBadge role={p.role} />
                <span className="text-xs text-muted-foreground">{p.phone}</span>
              </div>
              <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{p.bio}</p>
              <div className="mt-4 flex items-center justify-between border-t pt-3">
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Camera className="size-3.5" /> ตารางคิว: ดูเฉพาะคิวของตัวเอง
                </p>
                <Button size="sm" variant="outline" className="h-8"><Pencil className="size-3.5" /> แก้ไข</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}