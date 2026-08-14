import Link from "next/link";
import { Camera, Phone, Mail, MapPin } from "lucide-react";
import { BUSINESS } from "@/constants/booking";

const COLUMNS = [
  {
    title: "บริการ",
    links: [
      { href: "/services/wedding", label: "ถ่ายงานแต่งงาน" },
      { href: "/services/graduation", label: "ถ่ายรับปริญญา" },
      { href: "/services/portfolio", label: "ถ่ายพอร์ต" },
      { href: "/services/event", label: "ถ่ายอีเวนต์" },
    ],
  },
  {
    title: "เว็บไซต์",
    links: [
      { href: "/availability", label: "ตรวจวันว่าง" },
      { href: "/packages", label: "แพ็กเกจ" },
      { href: "/portfolio", label: "ผลงาน" },
      { href: "/my-booking", label: "ค้นหาการจอง" },
    ],
  },
  {
    title: "ข้อมูล",
    links: [
      { href: "/about", label: "เกี่ยวกับเรา" },
      { href: "/faq", label: "คำถามที่พบบ่อย" },
      { href: "/terms", label: "ข้อตกลงการใช้บริการ" },
      { href: "/privacy", label: "นโยบายความเป็นส่วนตัว" },
    ],
  },
];

export function PublicFooter() {
  return (
    <footer className="bg-coal text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-xl bg-white/10 text-brand">
              <Camera className="size-5" />
            </span>
            <span className="font-heading text-lg font-bold">{BUSINESS.name}</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-white/60">
            บันทึกทุกโมเมนต์สำคัญของคุณ อย่างมีคุณภาพ ราคาที่โปร่งใส และบริการที่ใส่ใจในทุกรายละเอียด
          </p>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li className="flex items-center gap-2"><Phone className="size-4 text-brand" /> {BUSINESS.phone}</li>
            <li className="flex items-center gap-2"><Mail className="size-4 text-brand" /> {BUSINESS.email}</li>
            <li className="flex items-center gap-2"><MapPin className="size-4 text-brand" /> {BUSINESS.address}</li>
          </ul>
        </div>

        {COLUMNS.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h3 className="font-heading text-sm font-semibold text-brand">{col.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/60 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-white/40 sm:flex-row">
          <p>© 2026 {BUSINESS.name} สงวนลิขสิทธิ์</p>
          <Link href="/book" className="hover:text-white">จองคิวถ่ายภาพได้ที่หน้าเว็บนี้ 24 ชม.</Link>
        </div>
      </div>
    </footer>
  );
}
