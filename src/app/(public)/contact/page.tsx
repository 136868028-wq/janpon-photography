import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SectionHeading } from "@/components/public/section-heading";
import { BUSINESS } from "@/constants/booking";

export const metadata = { title: "ติดต่อเรา" };

const CHANNELS = [
  { icon: Phone, title: "โทรศัพท์", value: BUSINESS.phone, desc: "จ-ส 09:00 - 18:00 น." },
  { icon: MessageCircle, title: "LINE", value: BUSINESS.lineId, desc: "ตอบไว ในเวลาทำการ" },
  { icon: Mail, title: "อีเมล", value: BUSINESS.email, desc: "ตอบกลับภายใน 1 วันทำการ" },
  { icon: MapPin, title: "สตูดิโอ", value: BUSINESS.address, desc: "นัดหมายก่อนเข้าสตูดิโอ" },
];

export default function ContactPage() {
  return (
    <>
      <section className="bg-coal py-14 text-white">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading eyebrow="ติดต่อเรา" title="คุยกับทีมงานได้ทุกช่องทาง" subtitle="เราพร้อมตอบทุกคำถาม เรื่องแพ็กเกจ วันว่าง และขั้นตอนการจอง" />
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-2">
            {CHANNELS.map((ch) => (
              <Card key={ch.title}>
                <CardContent className="flex items-start gap-4 p-5">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand-strong">
                    <ch.icon className="size-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{ch.title}</p>
                    <p className="text-sm text-muted-foreground">{ch.value}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground/70">{ch.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="lg:col-span-3">
            <CardContent className="p-6">
              <h2 className="font-heading text-lg font-bold">ส่งข้อความหาเรา</h2>
              <p className="mt-1 text-sm text-muted-foreground">กรอกข้อมูลด้านล่าง ทีมงานจะติดต่อกลับโดยเร็วที่สุด</p>
              <form className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="name">ชื่อ-นามสกุล</Label>
                  <Input id="name" placeholder="เช่น วรรณนิสา จันทร์ศรี" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
                  <Input id="phone" inputMode="tel" placeholder="08x-xxx-xxxx" />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="subject">เรื่อง</Label>
                  <Input id="subject" placeholder="เช่น สนใจถ่ายงานแต่งงานเดือนตุลาคม" />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="message">รายละเอียด</Label>
                  <Textarea id="message" rows={5} placeholder="เล่ารายละเอียดงานที่สนใจให้เราฟังหน่อย..." />
                </div>
                <div className="sm:col-span-2">
                  <Button size="lg" className="h-10 w-full sm:w-auto bg-brand text-brand-fg hover:bg-brand-strong">
                    ส่งข้อความ
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}