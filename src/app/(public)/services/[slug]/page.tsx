import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ImageMock } from "@/components/shared/image-mock";
import { mockServices, mockPackages } from "@/lib/mock-data";

export function generateStaticParams() {
  return mockServices.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = mockServices.find((s) => s.slug === slug);
  return { title: service ? service.name : "บริการ" };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = mockServices.find((s) => s.slug === slug);
  if (!service) notFound();
  const packages = mockPackages.filter((p) => p.serviceSlug === slug);

  return (
    <>
      <section className="relative overflow-hidden bg-coal py-12 text-white sm:py-16">
        {/* Background Banner Image */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <Image
            src="/images/header-banner.png"
            alt="Star X-Press Photo Studio Banner"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-45 filter brightness-95"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-coal via-coal/60 to-coal/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-coal/85 via-coal/60 to-coal/85" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-4">
          <Link href="/packages" className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white">
            <ArrowLeft className="size-4" /> ดูแพ็กเกจทั้งหมด
          </Link>
          <div className="mt-6 grid items-start gap-8 lg:grid-cols-2">
            <div>
              <h1 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">{service.name}</h1>
              <p className="mt-3 max-w-lg text-base leading-relaxed text-white/70">{service.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {service.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/70">
                <span className="flex items-center gap-1.5"><Wallet className="size-4 text-brand" /> มัดจำ {service.deposit.toLocaleString("th-TH")} บาท</span>
              </div>
              <Link href={`/book?service=${service.slug}`} className="mt-8 inline-block">
                <Button size="lg" className="h-11 bg-brand px-6 text-base font-bold text-brand-fg hover:bg-brand-strong">
                  จองบริการนี้ <ArrowRight className="size-4" />
                </Button>
              </Link>
            </div>
            <ImageMock image={service.image} aspect="aspect-[4/3]" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <h2 className="font-heading text-xl font-bold">แพ็กเกจ {service.name}</h2>
        <p className="mt-1 text-sm text-muted-foreground">เลือกแพ็กเกจที่เหมาะกับงบประมาณ เลือกชำระมัดจำและส่วนที่เหลือหลังถ่ายเสร็จ</p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <Card key={pkg.id} className={pkg.popular ? "relative border-brand shadow-md" : ""}>
              {pkg.popular && (
                <span className="absolute -top-3 left-4 rounded-full bg-brand px-3 py-0.5 text-xs font-bold text-brand-fg">ยอดนิยม</span>
              )}
              <CardContent className="p-5">
                <h3 className="font-heading text-base font-bold">{pkg.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{pkg.description}</p>
                <p className="mt-4">
                  <span className="font-heading text-2xl font-extrabold text-brand-strong">{pkg.price.toLocaleString("th-TH")}</span>
                  <span className="text-sm text-muted-foreground"> บาท</span>
                </p>
                <p className="text-xs text-muted-foreground">มัดจำ {pkg.deposit.toLocaleString("th-TH")} บาท</p>
                <ul className="mt-4 space-y-2">
                  {pkg.deliverables.map((d) => (
                    <li key={d} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-emerald-600" /> {d}
                    </li>
                  ))}
                </ul>
                <Link href={`/book?service=${service.slug}&package=${pkg.id}`} className="mt-5 block">
                  <Button size="lg" className="h-10 w-full bg-coal font-medium text-white transition-colors hover:bg-black">
                    จองแพ็กเกจนี้
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="mt-8 rounded-xl bg-sand p-4 text-center text-sm text-muted-foreground">
          ต้องการแพ็กเกจพิเศษสำหรับงานของคุณ?{" "}
          <Link href="/contact" className="font-semibold text-brand-strong hover:underline">ปรึกษาเราได้ที่นี่</Link>
        </p>
      </section>
    </>
  );
}
