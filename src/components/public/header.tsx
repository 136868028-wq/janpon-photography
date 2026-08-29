"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, Camera, User, PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/packages", label: "แพ็กเกจและราคา" },
  { href: "/portfolio", label: "ผลงาน" },
  { href: "/reviews", label: "รีวิว" },
  { href: "/track", label: "ติดตามสถานะ" },
  { href: "/about", label: "เกี่ยวกับเรา" },
  { href: "/contact", label: "ติดต่อ" },
];

export function PublicHeader() {
  const [open, setOpen] = useState(false);
  const [isCustomer, setIsCustomer] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("starxpress_customer");
      if (saved) setIsCustomer(true);
    } catch {
      // ignore
    }
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-coal text-brand">
            <Camera className="size-5" />
          </span>
          <span className="font-heading text-lg font-bold tracking-tight">
            Star X-Press <span className="text-brand-strong">Photo Studio</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="เมนูหลัก">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}

          <Link href={isCustomer ? "/profile" : "/login"} className="ml-1">
            <Button variant="ghost" size="sm" className="h-9 gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground">
              <User className="size-3.5" />
              {isCustomer ? "โปรไฟล์ของฉัน" : "เข้าสู่ระบบ"}
            </Button>
          </Link>

          <Link href="/book" className="ml-1">
            <Button size="sm" className="h-9 bg-brand text-brand-fg hover:bg-brand-strong font-bold">
              จองเลย
            </Button>
          </Link>
        </nav>

        <Button
          variant="ghost"
          size="icon-lg"
          className="md:hidden"
          aria-label={open ? "ปิดเมนู" : "เปิดเมนู"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X /> : <Menu />}
        </Button>
      </div>

      <div className={cn("md:hidden", open ? "block" : "hidden")}>
        <nav className="space-y-1 border-t border-border/60 px-4 py-3" aria-label="เมนูมือถือ">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={isCustomer ? "/profile" : "/login"}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <User className="size-4" />
            {isCustomer ? "โปรไฟล์ของฉัน" : "เข้าสู่ระบบ"}
          </Link>
          <Link href="/book" onClick={() => setOpen(false)} className="block pt-2">
            <Button size="lg" className="w-full h-10 bg-brand text-brand-fg hover:bg-brand-strong font-bold">
              จองเลย
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
