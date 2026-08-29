"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/public/page-header";
import { ImageMock } from "@/components/shared/image-mock";
import { mockPortfolio } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { key: "all", label: "ทั้งหมด" },
  { key: "wedding", label: "งานแต่งงาน" },
  { key: "graduation", label: "รับปริญญา" },
  { key: "portfolio", label: "พอร์ต" },
  { key: "event", label: "อีเวนต์" },
] as const;

export default function PortfolioPage() {
  const [category, setCategory] = useState<string>("all");
  const items = category === "all" ? mockPortfolio : mockPortfolio.filter((i) => i.category === category);

  return (
    <>
      <PageHeader
        eyebrow="ผลงานของเรา"
        title="ผลงานจริงจากลูกค้าจริง"
        subtitle="คลิกดูผลงานแต่ละหมวดหมู่ เพื่อให้เห็นสไตล์ของช่างของเรา"
      />
      <section className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="หมวดหมู่ผลงาน">
          {CATEGORIES.map((cat) => (
            <Button
              key={cat.key}
              role="tab"
              aria-selected={category === cat.key}
              variant={category === cat.key ? "default" : "outline"}
              size="lg"
              className="h-9"
              onClick={() => setCategory(cat.key)}
            >
              {cat.label}
            </Button>
          ))}
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <figure key={item.id} className="group">
              <ImageMock image={item.image} aspect="aspect-[3/4]" className="transition-all group-hover:-translate-y-1 group-hover:shadow-lg" />
              <figcaption className="mt-2">
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.date}</p>
              </figcaption>
            </figure>
          ))}
        </div>
        {items.length === 0 && (
          <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
            ยังไม่มีผลงานในหมวดนี้
          </div>
        )}
        <p className={cn("mt-8 text-center text-sm text-muted-foreground")}>
          ภาพทั้งหมดถ่ายโดยทีมงาน {`Star X-Press Photo Studio`} — ขออนุญาตลูกค้าแล้วทุกภาพ
        </p>
      </section>
    </>
  );
}
