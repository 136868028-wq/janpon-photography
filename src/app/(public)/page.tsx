import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CalendarCheck2,
  Camera,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/public/section-heading";
import { ImageMock } from "@/components/shared/image-mock";
import { BookingSteps } from "@/components/booking/booking-steps";
import { DayStatusPill } from "@/components/booking/slot-status";
import { mockImages, mockServices, mockPackages, mockPortfolio, mockReviews, FAQS } from "@/lib/mock-data";
import { BOOKING_CODE_ALPHABET, BUSINESS } from "@/constants/booking";

const BOOKING_POINTS = [
  { icon: CalendarCheck2, title: "เลือกวันเวลาว่างเอง", desc: "เห็นคิวว่างแบบเรียลไทม์ ไม่ต้องโทรถาม" },
  { icon: Wallet, title: "มัดจำ 500 บาท", desc: "ชำระผ่าน PromptPay และอัปโหลดสลิปในระบบ" },
  { icon: ShieldCheck, title: "คิวถูกล็อก 10 นาที", desc: "ระหว่างชำระเงิน คิวของคุณจะปลอดภัย" },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-coal text-white">
        {/* Background Banner Image */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <Image
            src="/images/header-banner.png"
            alt="Star X-Press Photo Studio Hero Banner"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-30 filter brightness-95"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-coal via-coal/65 to-coal/45" />
          <div className="absolute inset-0 bg-gradient-to-r from-coal/90 via-coal/50 to-coal/90" />
        </div>
        <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-start gap-10 px-4 py-16 sm:py-24 lg:flex-row lg:items-center">
          <div className="max-w-xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
              <Sparkles className="size-3.5 text-brand" />
              สตูดิโอถ่ายภาพครบวงจร ณ อ.ตากใบ จ.นราธิวาส
            </p>
            <h1 className="mt-5 font-heading text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              บันทึกทุกโมเมนต์
              <br />
              <span className="text-brand">สำคัญของคุณ</span>
            </h1>
            <p className="mt-4 text-base leading-relaxed text-white/70 sm:text-lg">
              งานแต่ง รับปริญญา พอร์ต และอีเวนต์ — จองคิวออนไลน์ได้ทันที
              ตรวจวันว่าง เลือกช่างภาพ และชำระมัดจำผ่าน PromptPay ในหน้าเดียว
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/book">
                <Button size="lg" className="h-11 w-full bg-brand px-6 text-base font-bold text-brand-fg hover:bg-brand-strong sm:w-auto">
                  จองคิวถ่ายภาพ <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link href="/portfolio">
                <Button size="lg" variant="outline" className="h-11 w-full border-white/25 bg-transparent px-6 text-base hover:bg-white/10 sm:w-auto">
                  ดูผลงาน
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/60">
              <span>⭐ 4.9/5 จากรีวิวลูกค้า</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="size-4 text-brand" /> ยืนยันคิวภายใน 1 ชม.</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="size-4 text-brand" /> จองล่วงหน้า 90 วัน</span>
            </div>
          </div>
          <div className="w-full flex-1 lg:max-w-md">
            <ImageMock image={mockImages.hero} aspect="aspect-[4/3]" className="shadow-2xl shadow-black/50" />
            <div className="mt-4 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur">
              <div className="flex items-center gap-2 text-sm">
                <Camera className="size-4 text-brand" />
                ตัวอย่างคิวว่างวันนี้
              </div>
              <DayStatusPill status="both_free" />
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="relative mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-xs font-semibold text-brand-strong">
              <Sparkles className="size-3.5" /> บริการยอดนิยม
            </span>
            <h2 className="mt-3 font-heading text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
              เลือกบริการที่ใช่สำหรับวันสำคัญของคุณ
            </h2>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              มัดจำเริ่มต้น 500 บาท · เช็ควันว่างและจองคิวออนไลน์ได้ตลอด 24 ชั่วโมง
            </p>
          </div>
          <Link href="/packages" className="shrink-0">
            <Button variant="outline" className="h-9 gap-1.5 text-xs font-semibold sm:h-10 sm:text-sm">
              ดูแพ็กเกจทั้งหมด <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {mockServices.map((service) => (
            <div
              key={service.id}
              className="group flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-brand/50 hover:shadow-xl"
            >
              {/* Image Thumbnail & Badges */}
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <ImageMock
                  image={service.image}
                  rounded={false}
                  aspect="aspect-[4/3]"
                  showCaption={false}
                  className="transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none" />

                {/* Top Badges */}
                <div className="absolute inset-x-3 top-3 flex items-center justify-between gap-2">
                  {service.badge && (
                    <span className="rounded-full border border-white/20 bg-black/60 px-2.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur-md">
                      {service.badge}
                    </span>
                  )}
                  <span className="ml-auto rounded-full bg-brand px-2.5 py-0.5 text-[11px] font-bold text-brand-fg shadow-sm">
                    มัดจำ {service.deposit.toLocaleString("th-TH")} ฿
                  </span>
                </div>

                {/* Title overlay at bottom of image */}
                <div className="absolute inset-x-3 bottom-3 text-white">
                  <h3 className="font-heading text-lg font-bold drop-shadow-sm">{service.name}</h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
                <div>
                  <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {service.description}
                  </p>

                  {/* Highlights Tags */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {service.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border border-border bg-muted/60 px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                      >
                        ✓ {tag}
                      </span>
                    ))}
                  </div>

                  {/* Time Slot Info */}
                  <div className="mt-3.5 flex items-center gap-1.5 rounded-lg bg-sand/60 px-2.5 py-1.5 text-[11px] text-muted-foreground">
                    <Clock className="size-3.5 text-brand-strong shrink-0" />
                    <span>ช่วงเช้า 09:00-13:00 / บ่าย 13:00-17:00</span>
                  </div>
                </div>

                {/* Pricing & CTA */}
                <div className="mt-5 border-t pt-4">
                  <div className="flex items-baseline justify-between mb-3">
                    <span className="text-xs text-muted-foreground">ราคาเริ่มต้น</span>
                    <div>
                      <span className="font-heading text-xl font-extrabold text-brand-strong">
                        {service.basePrice.toLocaleString("th-TH")}
                      </span>
                      <span className="text-xs text-muted-foreground ml-1">บาท</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Link href={`/services/${service.slug}`} className="w-full">
                      <Button size="sm" variant="black" className="h-9 w-full text-xs">
                        ดูแพ็กเกจ
                      </Button>
                    </Link>
                    <Link href={`/book?service=${service.slug}`} className="w-full">
                      <Button size="sm" className="h-9 w-full bg-brand text-xs font-bold text-brand-fg hover:bg-brand-strong">
                        จองคิว <ArrowRight className="size-3 ml-0.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Booking steps */}
      <section className="bg-sand">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <SectionHeading
            eyebrow="จองง่ายใน 6 ขั้นตอน"
            title="จากเลือกบริการ ถึงยืนยันคิว ใช้เวลาไม่ถึง 5 นาที"
          />
          <div className="mx-auto mt-10 max-w-3xl">
            <BookingSteps current={5} />
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {BOOKING_POINTS.map((point) => (
                <div key={point.title} className="rounded-xl border bg-background p-5">
                  <point.icon className="size-6 text-brand-strong" />
                  <h3 className="mt-3 font-heading text-sm font-bold">{point.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{point.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio preview */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeading
            align="left"
            eyebrow="ผลงานล่าสุด"
            title="โมเมนต์จริงจากลูกค้าของเรา"
          />
          <Link href="/portfolio" className="text-sm font-semibold text-brand-strong hover:underline">
            ดูผลงานทั้งหมด →
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {mockPortfolio.slice(0, 8).map((item) => (
            <Link key={item.id} href="/portfolio" className="group">
              <ImageMock image={item.image} aspect="aspect-[3/4]" className="transition-all group-hover:-translate-y-1 group-hover:shadow-lg" />
              <p className="mt-2 text-xs font-medium">{item.title}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Packages preview */}
      <section className="bg-coal text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <SectionHeading
            eyebrow="แพ็กเกจยอดนิยม"
            title="เลือกแพ็กเกจที่เหมาะกับงบประมาณคุณ"
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {mockPackages.filter((p) => p.popular).map((pkg) => {
              const service = mockServices.find((s) => s.slug === pkg.serviceSlug);
              return (
                <Card key={pkg.id} className="relative border-white/15 bg-white/5 text-white backdrop-blur">
                  <span className="absolute -top-3 left-4 rounded-full bg-brand px-3 py-0.5 text-xs font-bold text-brand-fg">
                    แพ็กเกจขายดี
                  </span>
                  <CardContent className="p-6">
                    <p className="text-xs font-medium text-white/60">{service?.name}</p>
                    <h3 className="mt-1 font-heading text-lg font-bold">{pkg.name}</h3>
                    <p className="mt-2 text-sm text-white/60">{pkg.description}</p>
                    <p className="mt-4">
                      <span className="font-heading text-2xl font-extrabold text-brand">{pkg.price.toLocaleString("th-TH")}</span>
                      <span className="text-sm text-white/60"> บาท</span>
                    </p>
                    <ul className="mt-4 space-y-2">
                      {pkg.deliverables.map((d) => (
                        <li key={d} className="flex items-center gap-2 text-xs text-white/70">
                          <CheckCircle2 className="size-3.5 shrink-0 text-brand" /> {d}
                        </li>
                      ))}
                    </ul>
                    <Link href="/book" className="mt-5 block">
                      <Button size="lg" variant="black" className="h-10 w-full border border-white/25 font-semibold">
                        จองแพ็กเกจนี้
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Reviews preview */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <SectionHeading
          eyebrow="เสียงจากลูกค้า"
          title="ลูกค้าไว้วางใจเราในทุกงาน"
          subtitle="ร่วมแบ่งปันความประทับใจและให้คะแนนดาวกับ Star X-Press Photo Studio"
        />
        {mockReviews.length > 0 ? (
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {mockReviews.slice(0, 3).map((review) => (
              <Card key={review.id}>
                <CardContent className="p-5">
                  <div className="flex text-sm text-amber-500" aria-label={`${review.rating} ดาว`}>
                    {"★".repeat(review.rating)}
                    <span className="text-muted-foreground/40">{"★".repeat(5 - review.rating)}</span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/90">“{review.comment}”</p>
                  <p className="mt-4 text-xs font-semibold">{review.customerName}</p>
                  <p className="text-xs text-muted-foreground">{review.service}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border bg-sand/40 p-8 text-center sm:p-10">
            <div className="flex justify-center text-amber-400 text-xl tracking-widest">
              ★★★★★
            </div>
            <h3 className="mt-3 font-heading text-lg font-bold">ร่วมเป็นคนแรกที่เขียนรีวิวให้เรา!</h3>
            <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
              เคยใช้บริการกับเราแล้วใช่ไหม? แบ่งปันความประทับใจและให้คะแนนดาวเพื่อช่วยให้ลูกค้าท่านอื่นตัดสินใจได้ง่ายขึ้น
            </p>
            <div className="mt-5">
              <Link href="/reviews">
                <Button size="lg" className="h-10 bg-brand text-brand-fg hover:bg-brand-strong font-semibold">
                  เขียนรีวิวและให้คะแนนดาว <ArrowRight className="size-4 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* FAQ preview */}
      <section className="bg-sand">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:py-20">
          <SectionHeading eyebrow="คำถามที่พบบ่อย" title="มีข้อสงสัยอะไร รวบรวมไว้ให้แล้ว" />
          <div className="mt-8 space-y-3">
            {FAQS.slice(0, 4).map((faq) => (
              <details key={faq.q} className="group rounded-xl border bg-background p-4 open:shadow-sm">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold">
                  {faq.q}
                  <span className="text-brand-strong transition-transform group-open:rotate-45">＋</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
              </details>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            ยังมีคำถาม? <Link href="/faq" className="font-semibold text-brand-strong hover:underline">ดูคำถามทั้งหมด</Link>
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <div className="relative overflow-hidden rounded-2xl bg-coal px-6 py-12 text-center text-white sm:py-16">
          <div className="absolute inset-0" style={{ backgroundImage: mockImages.camera.gradient, opacity: 0.4 }} aria-hidden />
          <div className="relative">
            <h2 className="font-heading text-2xl font-extrabold sm:text-3xl">พร้อมเก็บความทรงจำครั้งสำคัญของคุณแล้วหรือยัง?</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-white/70">
              คิวของเดือนนี้อาจเต็มเร็ว — เช็ควันว่างและจองได้เลยตอนนี้
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/book">
                <Button size="lg" className="h-11 w-full bg-brand px-8 text-base font-bold text-brand-fg hover:bg-brand-strong sm:w-auto">
                  จองเลย <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link href="/availability">
                <Button size="lg" variant="outline" className="h-11 w-full border-white/25 bg-transparent px-8 text-base hover:bg-white/10 sm:w-auto">
                  ตรวจวันว่างก่อน
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-xs text-white/50">รหัสจองของระบบ ตัวอย่าง: {BOOKING_CODE_ALPHABET.slice(0, 4)}-•••• • {BUSINESS.name}</p>
          </div>
        </div>
      </section>
    </>
  );
}
