"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Quote, BadgeCheck, Star, Send, CheckCircle2, MessageSquareHeart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/public/page-header";
import { SectionHeading } from "@/components/public/section-heading";
import { MockReview, mockReviews } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const SERVICES_OPTIONS = [
  "ถ่ายงานแต่งงาน",
  "ถ่ายรับปริญญา",
  "ถ่ายพอร์ต",
  "ถ่ายอีเวนต์",
];

const STAR_LABELS = [
  "",
  "1 ดาว - ต้องปรับปรุง",
  "2 ดาว - พอใช้",
  "3 ดาว - ปานกลาง",
  "4 ดาว - ดีมาก",
  "5 ดาว - ยอดเยี่ยม ประทับใจมาก!",
];

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<MockReview[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Form State
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [customerName, setCustomerName] = useState<string>("");
  const [service, setService] = useState<string>(SERVICES_OPTIONS[0]);
  const [comment, setComment] = useState<string>("");
  const [submittedSuccess, setSubmittedSuccess] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load reviews from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("starxpress_reviews");
      if (saved) {
        setReviews(JSON.parse(saved));
      } else {
        setReviews(mockReviews);
      }
    } catch {
      setReviews(mockReviews);
    }
    setIsLoaded(true);
  }, []);

  const avg = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "5.0";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setErrorMsg("กรุณากรอกชื่อของคุณ");
      return;
    }
    if (!comment.trim()) {
      setErrorMsg("กรุณาพิมพ์ความคิดเห็นหรือความประทับใจ");
      return;
    }
    if (rating <= 0) {
      setErrorMsg("กรุณากดให้คะแนนดาว");
      return;
    }

    const today = new Date();
    const thaiMonths = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
    const formattedDate = `${today.getDate()} ${thaiMonths[today.getMonth()]} ${today.getFullYear() + 543}`;

    const newReview: MockReview = {
      id: `user-rv-${Date.now()}`,
      customerName: customerName.trim(),
      service,
      rating,
      comment: comment.trim(),
      date: formattedDate,
    };

    const updated = [newReview, ...reviews];
    setReviews(updated);
    try {
      localStorage.setItem("starxpress_reviews", JSON.stringify(updated));
    } catch {
      // ignore
    }

    // Reset form
    setComment("");
    setCustomerName("");
    setRating(5);
    setErrorMsg(null);
    setSubmittedSuccess(true);

    setTimeout(() => {
      setSubmittedSuccess(false);
    }, 5000);
  };

  return (
    <>
      <PageHeader>
        <SectionHeading
          eyebrow="รีวิวจากลูกค้า"
          title="เสียงจริงจากคนที่ไว้วางใจเรา"
          subtitle="ร่วมแบ่งปันประสบการณ์จริงและความประทับใจของคุณกับเราได้ที่นี่"
          className="[&_h2]:text-white [&_p]:text-white/80"
        />

        {/* Rating Summary Bar */}
        <div className="mx-auto mt-6 flex max-w-xl items-center justify-center gap-6 rounded-2xl border border-white/15 bg-white/10 p-5 text-center backdrop-blur-md">
          {reviews.length > 0 ? (
            <>
              <div>
                <p className="font-heading text-4xl font-extrabold text-brand">{avg}</p>
                <p className="text-xs text-white/70">จาก 5 ดาว</p>
              </div>
              <div className="text-sm">
                <div className="flex justify-center text-lg text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "size-5",
                        i < Math.round(Number(avg)) ? "fill-amber-400 text-amber-400" : "text-white/40",
                      )}
                    />
                  ))}
                </div>
                <p className="mt-1 text-white/80">{reviews.length} รีวิวจากลูกค้าจริง</p>
              </div>
            </>
          ) : (
            <div className="py-1 text-center">
              <p className="font-heading text-lg font-bold text-white">ยังไม่มีรีวิว</p>
              <p className="mt-0.5 text-xs text-white/80">ร่วมเป็นคนแรกที่เขียนรีวิวและให้คะแนนผลงานของเรา!</p>
            </div>
          )}
        </div>
      </PageHeader>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Review Submission Form (1 Column on desktop) */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 border-brand/40 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-brand-strong">
                  <MessageSquareHeart className="size-5" />
                  <h2 className="font-heading text-lg font-bold text-foreground">เขียนรีวิวให้เรา</h2>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  แชร์ความประทับใจและให้คะแนนดาว เพื่อเป็นกำลังใจให้ทีมงาน
                </p>

                {submittedSuccess && (
                  <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 className="size-4 shrink-0" />
                    <span>ส่งรีวิวสำเร็จ ขอบคุณสำหรับข้อความรีวิวครับ! ✨</span>
                  </div>
                )}

                {errorMsg && (
                  <div className="mt-4 rounded-xl bg-rose-500/10 p-3 text-xs font-semibold text-rose-600 dark:text-rose-400">
                    ⚠️ {errorMsg}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                  {/* Star Rating Interactive Selector */}
                  <div className="space-y-1.5 text-center sm:text-left">
                    <Label className="text-xs font-semibold">ให้คะแนนดาว *</Label>
                    <div className="flex items-center justify-center sm:justify-start gap-1 pt-1">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const isFilled = (hoverRating || rating) >= star;
                        return (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="p-1 transition-transform hover:scale-125 focus:outline-none"
                            aria-label={`${star} ดาว`}
                          >
                            <Star
                              className={cn(
                                "size-7 transition-colors",
                                isFilled
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-muted-foreground/30 hover:text-amber-300",
                              )}
                            />
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-[11px] font-medium text-amber-700 dark:text-amber-300">
                      {STAR_LABELS[hoverRating || rating]}
                    </p>
                  </div>

                  {/* Customer Name */}
                  <div className="space-y-1.5">
                    <Label htmlFor="rv-name" className="text-xs font-semibold">ชื่อของคุณ *</Label>
                    <Input
                      id="rv-name"
                      placeholder="เช่น คุณกานต์ หรือ คุณฟ้า"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
                  </div>

                  {/* Service Choice */}
                  <div className="space-y-1.5">
                    <Label htmlFor="rv-service" className="text-xs font-semibold">บริการที่ใช้บริการ *</Label>
                    <select
                      id="rv-service"
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      className="h-9 w-full rounded-lg border border-input bg-background px-3 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-brand"
                    >
                      {SERVICES_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Comment */}
                  <div className="space-y-1.5">
                    <Label htmlFor="rv-comment" className="text-xs font-semibold">ข้อความรีวิว / ความประทับใจ *</Label>
                    <Textarea
                      id="rv-comment"
                      rows={4}
                      placeholder="พิมพ์ความประทับใจ เช่น ช่างภาพเป็นกันเอง ถ่ายภาพสวย ปรับแสงสีถูกใจมาก..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                  </div>

                  <Button type="submit" size="lg" className="h-10 w-full bg-brand text-brand-fg hover:bg-brand-strong font-bold">
                    <Send className="size-4 mr-1.5" /> ส่งรีวิว
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Review List (2 Columns on desktop) */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-xl font-bold">
                รีวิวทั้งหมด ({reviews.length})
              </h3>
            </div>

            {reviews.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {reviews.map((review) => (
                  <Card key={review.id} className="transition-all hover:shadow-md">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between">
                        <Quote className="size-5 text-brand" />
                        <div className="flex items-center gap-0.5" aria-label={`${review.rating} ดาว`}>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "size-4",
                                i < review.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30",
                              )}
                            />
                          ))}
                        </div>
                      </div>

                      <p className="mt-3 text-sm leading-relaxed text-foreground/90">
                        “{review.comment}”
                      </p>

                      <div className="mt-4 flex items-center justify-between border-t pt-3">
                        <div>
                          <p className="flex items-center gap-1 text-sm font-bold text-foreground">
                            {review.customerName}
                            <BadgeCheck className="size-4 text-sky-500" aria-label="ยืนยันการใช้บริการจริง" />
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {review.service} · {review.date}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border-2 border-dashed p-10 text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                  <Star className="size-6" />
                </div>
                <h4 className="mt-3 font-heading text-base font-bold text-foreground">ยังไม่มีรีวิวในขณะนี้</h4>
                <p className="mt-1 text-xs text-muted-foreground">
                  ร่วมเป็นคนแรกที่แชร์ประสบการณ์ความประทับใจกับเราผ่านแบบฟอร์มด้านข้างนี้ได้เลยครับ!
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-14 rounded-2xl bg-sand p-6 text-center sm:p-8">
          <h2 className="font-heading text-lg font-bold">พร้อมสร้างความประทับใจร่วมกับเราแล้วหรือยัง?</h2>
          <p className="mt-2 text-sm text-muted-foreground">จองคิวถ่ายภาพล่วงหน้าง่ายๆ พร้อมรับประกันไฟล์ภาพคุณภาพสูง</p>
          <div className="mt-4 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/book">
              <Button size="lg" variant="black" className="h-10 w-full sm:w-auto font-medium">จองคิวถ่ายภาพ</Button>
            </Link>
            <Link href="/packages">
              <Button size="lg" variant="outline" className="h-10 w-full sm:w-auto">ดูแพ็กเกจทั้งหมด</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}