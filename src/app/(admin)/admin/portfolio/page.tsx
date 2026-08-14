"use client";

import { useState } from "react";
import { Eye, MoreHorizontal, Pencil, Plus, Star } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageMock } from "@/components/shared/image-mock";
import { mockPortfolio } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function AdminPortfolioPage() {
  const [publishedOnly, setPublishedOnly] = useState(false);
  const [published, setPublished] = useState<Record<string, boolean>>(
    Object.fromEntries(mockPortfolio.map((p) => [p.id, true])),
  );

  const catCount = (cat: string) => mockPortfolio.filter((p) => p.category === cat).length;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">ผลงาน (Portfolio CMS)</h1>
          <p className="mt-1 text-sm text-muted-foreground">จัดการภาพผลงานที่แสดงบนเว็บไซต์สาธารณะ</p>
        </div>
        <Button size="sm" className="bg-brand text-brand-fg hover:bg-brand-strong">
          <Plus className="size-4" /> เพิ่มผลงานใหม่
        </Button>
      </div>

      <Tabs defaultValue="wedding">
        <TabsList>
          <TabsTrigger value="wedding">งานแต่งงาน ({catCount("wedding")})</TabsTrigger>
          <TabsTrigger value="graduation">รับปริญญา ({catCount("graduation")})</TabsTrigger>
          <TabsTrigger value="portfolio">พอร์ต ({catCount("portfolio")})</TabsTrigger>
          <TabsTrigger value="event">อีเวนต์ ({catCount("event")})</TabsTrigger>
          <TabsTrigger value="all">ทั้งหมด</TabsTrigger>
        </TabsList>
        {["wedding", "graduation", "portfolio", "event", "all"].map((cat) => (
          <TabsContent key={cat} value={cat}>
            <div className="flex items-center justify-between py-2">
              <p className="text-sm text-muted-foreground">
                {publishedOnly ? "แสดงเฉพาะที่เผยแพร่" : "แสดงทั้งหมด"} · คลิกสลับเพื่อ publish/unpublish ได้ทันที
              </p>
              <label className="flex items-center gap-2 text-sm">
                <Switch checked={publishedOnly} onCheckedChange={setPublishedOnly} aria-label="แสดงเฉพาะที่เผยแพร่" />
                เฉพาะที่เผยแพร่
              </label>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {mockPortfolio
                .filter((p) => cat === "all" || p.category === cat)
                .filter((p) => !publishedOnly || published[p.id])
                .map((item) => (
                  <Card key={item.id} className={cn("overflow-hidden", !published[item.id] && "opacity-60")}>
                    <div className="relative">
                      <ImageMock image={item.image} rounded={false} aspect="aspect-[3/4]" />
                      {!published[item.id] && (
                        <span className="absolute left-2 top-2 rounded-full bg-coal/90 px-2 py-0.5 text-[10px] font-bold text-white">ไม่ได้เผยแพร่</span>
                      )}
                      <button
                        type="button"
                        onClick={() => setPublished((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
                        className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 shadow-sm"
                        aria-label={published[item.id] ? "ยกเลิกการเผยแพร่" : "เผยแพร่"}
                      >
                        {published[item.id] ? <Eye className="size-4 text-emerald-600" /> : <Star className="size-4 text-muted-foreground" />}
                      </button>
                    </div>
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-semibold">{item.title}</p>
                        <div className="flex shrink-0 gap-0.5">
                          <Button variant="ghost" size="icon-xs" aria-label={`แก้ไข ${item.title}`}><Pencil className="size-3.5" /></Button>
                          <Button variant="ghost" size="icon-xs" aria-label="เมนูเพิ่มเติม"><MoreHorizontal className="size-3.5" /></Button>
                        </div>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">{item.date}</p>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="rounded-xl bg-sand p-4 text-xs text-muted-foreground">
        <p className="font-semibold">การเผยแพร่ภาพ</p>
        <p className="mt-1">ผลงานที่ “เผยแพร่” แล้วจะแสดงบนหน้า /portfolio ของเว็บไซต์สาธารณะเท่านั้น — ภาพทั้งหมดในหน้านี้เป็นตัวอย่าง (placeholder) ในเวอร์ชันจริงจะอัปโหลดจาก Storage</p>
        <div className="mt-2 flex gap-2">
          <Button size="sm" variant="outline" className="h-7" asChild>
            <Link href="/portfolio">ดูเว็บไซต์ /portfolio</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}