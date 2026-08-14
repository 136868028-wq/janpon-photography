import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/public/section-heading";
import { FAQS } from "@/lib/mock-data";

export const metadata = { title: "คำถามที่พบบ่อย" };

export default function FaqPage() {
  return (
    <>
      <section className="bg-coal py-14 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading eyebrow="FAQ" title="คำถามที่พบบ่อย" subtitle="รวมคำถามที่ลูกค้ามักถาม — ถ้ายังไม่เคลียร์ ทักหาผ่านช่องทางติดต่อได้เลย" />
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
        <div className="space-y-3">
          {FAQS.map((faq) => (
            <details key={faq.q} className="group rounded-xl border bg-background p-4 open:shadow-sm">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold">
                {faq.q}
                <span className="text-brand-strong transition-transform group-open:rotate-45">＋</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
            </details>
          ))}
        </div>
        <div className="mt-10 rounded-2xl bg-sand p-6 text-center">
          <h2 className="font-heading text-lg font-bold">ยังมีคำถามอยู่ใช่ไหม?</h2>
          <p className="mt-2 text-sm text-muted-foreground">ทีมงานยินดีตอบทุกข้อสงสัย</p>
          <div className="mt-4 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/contact"><Button size="lg" className="h-10 w-full sm:w-auto">ติดต่อเรา</Button></Link>
            <Link href="/book"><Button size="lg" variant="outline" className="h-10 w-full sm:w-auto">จองเลย</Button></Link>
          </div>
        </div>
      </section>
    </>
  );
}