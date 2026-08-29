import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/public/page-header";

export const metadata = { title: "ข้อตกลงการใช้บริการ" };

const SECTIONS = [
  { title: "1. การจองคิว", body: "การจองจะสมบูรณ์เมื่อชำระมัดจำและได้รับการยืนยันจากทีมงานเท่านั้น การล็อกคิวชั่วคราว (10 นาที) ไม่ถือเป็นการยืนยันการจอง" },
  { title: "2. มัดจำและค่าบริการ", body: "มัดจำตามแพ็กเกจที่เลือก (เริ่มต้น 500 บาท) ชำระผ่าน PromptPay และส่งหลักฐานในระบบ ค่าบริการส่วนที่เหลือชำระหลังรับงานเสร็จตามกำหนดในใบแจ้งยอด" },
  { title: "3. การยกเลิก", body: "แจ้งยกเลิกล่วงหน้า 7 วันขึ้นไป คืนมัดจำเต็มจำนวน / ภายใน 7 วัน คืน 50% / ยกเลิกวันถ่าย ไม่คืนมัดจำ ยกเว้นกรณีทางร้านเป็นฝ่ายยกเลิก ซึ่งจะคืนเต็มจำนวนเสมอ" },
  { title: "4. การเลื่อนนัด", body: "เลื่อนได้ครั้งละ 1 ครั้งโดยไม่มีค่าใช้จ่าย หากแจ้งล่วงหน้า 48 ชั่วโมง และมีวันที่ว่างในระบบ" },
  { title: "5. การรับงานและสิทธิ์ในภาพถ่าย", body: "ไฟล์ที่ส่งให้ลูกค้ามีสิทธิ์ใช้ส่วนตัวได้ ไม่รวมการขายหรือใช้เชิงพาณิชย์โดยไม่ได้รับอนุญาต ทางร้านสงวนสิทธิ์ใช้ภาพตัวอย่างเพื่อประชาสัมพันธ์ เว้นแต่ลูกค้าแจ้งขอไม่เผยแพร่เป็นลายลักษณ์อักษร" },
  { title: "6. ความรับผิด", body: "กรณีเหตุสุดวิสัย (ฟ้าฝน อุปกรณ์ขัดข้อง) ทางร้านจะเสนอวันถ่ายใหม่หรือคืนเงินตามความเหมาะสม โดยไม่รับผิดชอบค่าเสียหายทางอ้อม" },
];

export default function TermsPage() {
  return (
    <>
      <PageHeader
        eyebrow="ข้อตกลง"
        title="ข้อตกลงการใช้บริการ"
        subtitle="อัปเดตล่าสุด: 14 สิงหาคม 2569"
      />
      <section className="mx-auto max-w-3xl px-4 py-12">
        <div className="space-y-6">
          {SECTIONS.map((s) => (
            <div key={s.title} className="rounded-xl border bg-background p-5">
              <h2 className="font-heading text-base font-bold">{s.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-muted-foreground">
          มีข้อสงสัยเกี่ยวกับข้อตกลง?{" "}
          <a href="mailto:hello@starxpress.studio" className="font-semibold text-brand-strong hover:underline">ติดต่อทีมงาน</a>
        </p>
        <div className="mt-4 text-center">
          <Button variant="outline">ดาวน์โหลดข้อตกลงฉบับเต็ม</Button>
        </div>
      </section>
    </>
  );
}