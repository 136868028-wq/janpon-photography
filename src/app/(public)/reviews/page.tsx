import Link from "next/link";
import { Quote, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/public/section-heading";
import { mockReviews } from "@/lib/mock-data";

export const metadata = { title: "รีวิวจากลูกค้า" };

export default function ReviewsPage() {
  const avg = (mockReviews.reduce((sum, r) => sum + r.rating, 0) / mockReviews.length).toFixed(1);

  return (
    <>
      <section className="bg-coal py-14 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading eyebrow="รีวิวจากลูกค้า" title="เสียงจริงจากคนที่ไว้วางใจเรา" />
          <div className="mx-auto mt-6 flex max-w-xl items-center justify-center gap-6 rounded-2xl border border-white/10 bg-white/5 p-5 text-center">
            <div>
              <p className="font-heading text-4xl font-extrabold text-brand">{avg}</p>
              <p className="text-xs text-white/60">จาก 5 ดาว</p>
            </div>
            <div className="text-sm">
              <p className="text-amber-400 text-lg tracking-widest">★★★★★</p>
              <p className="mt-1 text-white/70">{mockReviews.length} รีวิว</p>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {mockReviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-5">
                <Quote className="size-6 text-brand/50" />
                <div className="mt-3 text-sm text-amber-500" aria-label={`${review.rating} ดาว`}>
                  {"★".repeat(review.rating)}
                  <span className="text-muted-foreground/40">{"★".repeat(5 - review.rating)}</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed">“{review.comment}”</p>
                <div className="mt-4 flex items-center justify-between border-t pt-4">
                  <div>
                    <p className="flex items-center gap-1 text-sm font-semibold">
                      {review.customerName} <BadgeCheck className="size-4 text-sky-500" aria-label="ยืนยันการจองจริง" />
                    </p>
                    <p className="text-xs text-muted-foreground">{review.service} · {review.date}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-12 rounded-2xl bg-sand p-6 text-center sm:p-8">
          <h2 className="font-heading text-lg font-bold">มีประสบการณ์ดีๆ กับเราบ้างไหม?</h2>
          <p className="mt-2 text-sm text-muted-foreground">รีวิวของคุณช่วยให้เพื่อนๆ กล้าจองมากขึ้น</p>
          <Link href="/contact" className="mt-4 inline-block">
            <Button size="lg" className="h-10">แชร์ประสบการณ์กับเรา</Button>
          </Link>
        </div>
      </section>
    </>
  );
}