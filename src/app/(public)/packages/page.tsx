import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/public/page-header";
import { mockPackages, mockServices } from "@/lib/mock-data";

export const metadata = { title: "แพ็กเกจและราคา" };

export default function PackagesPage() {
  const grouped = mockServices.map((service) => ({
    service,
    packages: mockPackages.filter((p) => p.serviceSlug === service.slug),
  }));

  return (
    <>
      <PageHeader
        eyebrow="แพ็กเกจและราคา"
        title="ราคาชัดเจน ไม่มีค่าใช้จ่ายแอบแฝง"
        subtitle="มัดจำเริ่มต้น 500 บาท ชำระส่วนที่เหลือหลังรับงานเสร็จ"
      />

      {grouped.map(({ service, packages }) => (
        <section key={service.id} className="mx-auto max-w-6xl px-4 py-12 first:pt-16">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-heading text-xl font-bold">{service.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{service.description}</p>
            </div>
            <Link href={`/book?service=${service.slug}`}>
              <Button size="sm" variant="outline" className="h-9">จอง {service.name.split(" ")[1] ?? "บริการ"}</Button>
            </Link>
          </div>
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
                  <p className="mt-0.5 text-xs text-muted-foreground">มัดจำ {pkg.deposit.toLocaleString("th-TH")} บาท</p>
                  <ul className="mt-4 space-y-2">
                    {pkg.deliverables.map((d) => (
                      <li key={d} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-emerald-600" /> {d}
                      </li>
                    ))}
                  </ul>
                  <Link href={`/book?service=${service.slug}&package=${pkg.id}`} className="mt-5 block">
                    <Button size="lg" variant={pkg.popular ? "default" : "outline"} className="h-10 w-full">
                      เลือกแพ็กเกจนี้
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
