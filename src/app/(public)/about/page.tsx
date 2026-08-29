import Link from "next/link";
import { ArrowRight, Award, Heart, Users, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/public/page-header";
import { SectionHeading } from "@/components/public/section-heading";
import { ImageMock } from "@/components/shared/image-mock";
import { mockImages } from "@/lib/mock-data";
import { BUSINESS } from "@/constants/booking";

export const metadata = { title: "เกี่ยวกับเรา" };

const VALUES = [
  { icon: Heart, title: "ใส่ใจทุกดีเทล", desc: "จากมุมแสง จนถึงช็อตครอบครัว เราทำอย่างตั้งใจในทุกเฟรม" },
  { icon: Camera, title: "มืออาชีพในทุกงาน", desc: "อุปกรณ์พร้อม มีช่างสำรอง เผื่อเหตุสุดวิสัยเสมอ" },
  { icon: Users, title: "คุยกับคนจริง", desc: "ไม่ได้แค่รับออเดอร์ — เราให้คำแนะนำแบบคนรู้จัก" },
  { icon: Award, title: "โปร่งใส ตรงเวลา", desc: "ราคาชัดเจน ส่งงานตามกำหนด และยืนยันคิวเร็ว" },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="เกี่ยวกับเรา"
        title="กว่า 10 ปีที่เราเก็บความทรงจำให้คนไทย"
      />

      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <ImageMock image={mockImages.wedding} aspect="aspect-[4/3]" />
          <div>
            <h2 className="font-heading text-2xl font-bold">Star X-Press Photo Studio</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              เริ่มต้นจากช่างภาพคนเดียวกับกล้องตัวเดียวที่ อ.ตากใบ จ.นราธิวาส วันนี้เรากลายเป็นทีมช่างภาพ 3 คน
              ที่ถ่ายภาพมากกว่า 2,000 งาน — ทั้งงานแต่ง รับปริญญา พอร์ต และอีเวนต์
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              เราเชื่อว่าภาพถ่ายที่ดีไม่ใช่แค่ภาพสวย แต่คือการบันทึกความรู้สึกในช่วงเวลานั้นไว้ได้จริง
              ทุกงานเราจึงคุยกับลูกค้าก่อนเสมอ เพื่อให้ได้ภาพที่ตรงใจที่สุด
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              <li className="rounded-xl bg-sand p-4"><p className="font-heading text-2xl font-extrabold text-brand-strong">2,000+</p><p className="text-xs text-muted-foreground">งานที่ถ่ายแล้ว</p></li>
              <li className="rounded-xl bg-sand p-4"><p className="font-heading text-2xl font-extrabold text-brand-strong">4.9/5</p><p className="text-xs text-muted-foreground">คะแนนจากลูกค้า</p></li>
              <li className="rounded-xl bg-sand p-4"><p className="font-heading text-2xl font-extrabold text-brand-strong">10 ปี</p><p className="text-xs text-muted-foreground">ประสบการณ์</p></li>
              <li className="rounded-xl bg-sand p-4"><p className="font-heading text-2xl font-extrabold text-brand-strong">3 ช่าง</p><p className="text-xs text-muted-foreground">ในทีมของเรา</p></li>
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-sand">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <SectionHeading eyebrow="สิ่งที่เราเชื่อ" title="คุณค่าที่เรายึดถือในทุกงาน" />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-xl border bg-background p-5">
                <v.icon className="size-6 text-brand-strong" />
                <h3 className="mt-3 font-heading text-sm font-bold">{v.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{v.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/book">
              <Button size="lg" className="h-11 bg-brand px-6 text-base font-bold text-brand-fg hover:bg-brand-strong">
                มาสร้างความทรงจำด้วยกัน <ArrowRight className="size-4" />
              </Button>
            </Link>
            <p className="mt-2 text-xs text-muted-foreground">{BUSINESS.openDays} · {BUSINESS.address}</p>
          </div>
        </div>
      </section>
    </>
  );
}