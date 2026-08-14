import Link from "next/link";
import { ArrowRight, Clock, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/public/section-heading";
import { ImageMock } from "@/components/shared/image-mock";
import { mockServices } from "@/lib/mock-data";

export const metadata = { title: "บริการทั้งหมด" };

export default function ServicesPage() {
  return (
    <>
      <section className="bg-coal py-14 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading
            eyebrow="บริการทั้งหมด"
            title="บริการถ่ายภาพของเรา"
            subtitle="ทุกบริการมีช่างภาพมืออาชีพ ไฟล์คุณภาพสูง และราคาโปร่งใส"
          />
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="grid gap-6 sm:grid-cols-2">
          {mockServices.map((service) => (
            <Card key={service.id} className="overflow-hidden">
              <Link href={`/services/${service.slug}`} className="group">
                <ImageMock image={service.image} rounded={false} aspect="aspect-[16/9]" className="rounded-t-xl" />
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-heading text-lg font-bold group-hover:text-brand-strong">{service.name}</h2>
                      <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{service.description}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Wallet className="size-3.5 text-brand-strong" />
                      มัดจำ {service.deposit.toLocaleString("th-TH")} บาท
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="size-3.5 text-brand-strong" />
                      ประมาณ {service.durationMinutes} นาที
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t pt-4">
                    <p className="text-sm">
                      เริ่มต้น <span className="font-heading text-xl font-bold text-brand-strong">{service.basePrice.toLocaleString("th-TH")} บาท</span>
                    </p>
                    <Button size="sm" className="h-9 bg-brand text-brand-fg hover:bg-brand-strong">
                      ดูรายละเอียด <ArrowRight className="size-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Link>
            </Card>
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
