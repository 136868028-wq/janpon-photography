"use client";

import { useState } from "react";
import { Check, Eye, Star, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockReviews } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function AdminReviewsPage() {
  const [published, setPublished] = useState<Record<string, boolean>>(
    Object.fromEntries(mockReviews.map((r) => [r.id, true])),
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">รีวิว</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          ตรวจสอบและเลือกเผยแพร่รีวิว — เฉพาะรีวิวที่เผยแพร่แล้วเท่านั้นที่จะแสดงบนหน้า /reviews
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {mockReviews.map((r) => {
          const isPub = published[r.id];
          return (
            <Card key={r.id} className={cn("", !isPub && "opacity-70")}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="flex items-center gap-2 text-sm font-bold">
                      {r.customerName}
                      <Badge variant="outline" className="h-5">งาน: {r.service}</Badge>
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">{r.date}</p>
                  </div>
                  <div className="text-sm text-amber-500" aria-label={`${r.rating} ดาว`}>
                    {"★".repeat(r.rating)}
                    <span className="text-muted-foreground/40">{"★".repeat(5 - r.rating)}</span>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">“{r.comment}”</p>
                <div className="mt-4 flex items-center justify-between border-t pt-3">
                  <span className={cn("text-xs font-semibold", isPub ? "text-emerald-600" : "text-muted-foreground")}>
                    {isPub ? "กำลังแสดงบนเว็บไซต์" : "ซ่อนจากเว็บไซต์"}
                  </span>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant={isPub ? "outline" : "default"}
                      className="h-8"
                      onClick={() => setPublished((prev) => ({ ...prev, [r.id]: !prev[r.id] }))}
                    >
                      {isPub ? <><X className="size-3.5" /> ซ่อน</> : <><Check className="size-3.5" /> เผยแพร่</>}
                    </Button>
                    <Button variant="ghost" size="icon-sm" aria-label={`ดู ${r.customerName}`}><Eye className="size-4" /></Button>
                    <Button variant="ghost" size="icon-sm" className="hover:text-red-600" aria-label={`ลบรีวิว ${r.customerName}`}>
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Star className="size-4 text-amber-500" /> สรุปรีวิวทั้งหมด
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <p className="text-muted-foreground">
            เฉลี่ย <strong>4.8/5</strong> จากรีวิวที่เผยแพร่ {mockReviews.length} รายการ · รีวิวใหม่ (รอตรวจ) 0 รายการ
          </p>
        </CardContent>
      </Card>
    </div>
  );
}