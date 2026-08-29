import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/public/page-header";

export const metadata = { title: "นโยบายความเป็นส่วนตัว" };

const SECTIONS = [
  { title: "1. ข้อมูลที่เราเก็บ", body: "เราเก็บเฉพาะข้อมูลที่จำเป็นต่อการให้บริการ: ชื่อ-นามสกุล, เบอร์โทรศัพท์, อีเมล (ไม่บังคับ), LINE ID (ไม่บังคับ), รายละเอียดการจอง และหลักฐานการชำระเงิน (สลิป)" },
  { title: "2. วัตถุประสงค์การใช้ข้อมูล", body: "ใช้เพื่อบริหารการจอง ติดต่อยืนยันคิว ตรวจสอบการชำระเงิน และพัฒนาบริการ เราไม่ขายข้อมูลของคุณให้บุคคลที่สามเด็ดขาด และไม่แสดงข้อมูลส่วนตัวในหน้าสาธารณะ" },
  { title: "3. การเก็บรักษา", body: "สลิปการชำระเงินถูกเก็บในระบบพื้นที่ส่วนตัว เข้าถึงได้เฉพาะทีมงานที่ตรวจสอบ ข้อมูลการจองถูกเก็บ 2 ปีหลังงานเสร็จสิ้น และถูกลบเมื่อหมดความจำเป็น" },
  { title: "4. ความปลอดภัย", body: "ระบบใช้การเข้ารหัสระหว่างการส่งข้อมูล (TLS) ใช้สิทธิ์การเข้าถึงแบบแบ่งระดับ (RLS) และบันทึกการเข้าถึงข้อมูลสำคัญทุกครั้ง (Audit Log)" },
  { title: "5. สิทธิของคุณ (PDPA)", body: "คุณมีสิทธิ์ ขอเข้าถึงข้อมูล แก้ไข ขอสำเนา ขอให้ลบ หรือคัดค้านการใช้ข้อมูลได้ ติดต่อทีมงานเพื่อใช้สิทธิดังกล่าว ระบบจะดำเนินการภายใน 30 วันตามที่กฎหมายกำหนด" },
  { title: "6. คุกกี้", body: "เราใช้คุกกี้ที่จำเป็นเท่านั้น (สำหรับการล็อกอินและการจอง) ไม่ใช้คุกกี้โฆษณาติดตามพฤติกรรมข้ามเว็บไซต์" },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="ความเป็นส่วนตัว"
        title="นโยบายความเป็นส่วนตัว (PDPA)"
        subtitle="เราเก็บข้อมูลเท่าที่จำเป็น และปกป้องเสมอเหมือนข้อมูลของเราเอง — อัปเดตล่าสุด: 14 สิงหาคม 2569"
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
          ติดต่อเจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคล (DPO):{" "}
          <a href="mailto:dpo@starxpress.studio" className="font-semibold text-brand-strong hover:underline">dpo@starxpress.studio</a>
        </p>
        <div className="mt-4 text-center">
          <Button variant="outline">ดาวน์โหลดนโยบายฉบับเต็ม</Button>
        </div>
      </section>
    </>
  );
}