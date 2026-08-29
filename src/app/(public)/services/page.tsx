import Link from "next/link";
import { ArrowRight, Clock, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/public/page-header";
import { ImageMock } from "@/components/shared/image-mock";
import { mockServices } from "@/lib/mock-data";

export const metadata = { title: "บริการทั้งหมด" };

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="บริการทั้งหมด"
        title="บริการถ่ายภาพของเรา"
        subtitle="ทุกบริการมีช่างภาพมืออาชีพ ไฟล์คุณภาพสูง และราคาโปร่งใส"
      />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="grid gap-6 sm:grid-cols-2">
          {mockServices.map((service) => (
            <div
              key={service.id}
              className="group flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/50 hover:shadow-xl"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                <ImageMock
                  image={service.image}
                  rounded={false}
                  aspect="aspect-[16/9]"
                  showCaption={false}
                  className="transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute inset-x-4 top-4 flex items-center justify-between">
                  {service.badge && (
                    <span className="rounded-full border border-white/20 bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                      {service.badge}
                    </span>
                  )}
                  <span className="ml-auto rounded-full bg-brand px-3 py-1 text-xs font-bold text-brand-fg shadow-sm">
                    มัดจำ {service.deposit.toLocaleString("th-TH")} บาท
                  </span>
                </div>
                <div className="absolute inset-x-4 bottom-4 text-white">
                  <h2 className="font-heading text-2xl font-bold drop-shadow-sm">{service.name}</h2>
                </div>
              </div>

              <CardContent className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <p className="text-sm leading-relaxed text-muted-foreground">{service.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {service.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-lg border border-border bg-muted/60 px-2.5 py-1 text-xs font-medium text-muted-foreground"
                      >
                        ✓ {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center gap-2 rounded-xl bg-sand/60 px-3 py-2 text-xs text-muted-foreground">
                    <Clock className="size-4 text-brand-strong shrink-0" />
                    <span>ช่วงเช้า 09:00 - 13:00 น. / ช่วงบ่าย 13:00 - 17:00 น.</span>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
                  <div>
                    <span className="text-xs text-muted-foreground">ราคาเริ่มต้น</span>
                    <p className="font-heading text-2xl font-extrabold text-brand-strong">
                      {service.basePrice.toLocaleString("th-TH")} <span className="text-sm font-normal text-muted-foreground">บาท</span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/services/${service.slug}`}>
                      <Button variant="outline" size="sm" className="h-10 text-xs">
                        ดูแพ็กเกจ
                      </Button>
                    </Link>
                    <Link href={`/book?service=${service.slug}`}>
                      <Button size="sm" className="h-10 bg-brand text-xs font-bold text-brand-fg hover:bg-brand-strong">
                        จองคิวนี้ <ArrowRight className="size-3.5 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </div>
          ))}
        </div>
        <div className="mt-12 rounded-2xl bg-sand p-6 text-center sm:p-8">
          <h2 className="font-heading text-lg font-bold">ไม่แน่ใจว่าเลือกบริการไหนดี?</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">ทักไลน์มาได้เลย เรายินดีช่วยแนะนำแพ็กเกจที่เหมาะกับงานของคุณ</p>
          <div className="mt-4 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/contact">
              <Button size="lg" className="h-10 w-full sm:w-auto">ติดต่อเรา</Button>
            </Link>
            <Link href="/book">
              <Button size="lg" variant="outline" className="h-10 w-full sm:w-auto">จองเลยทันที</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
