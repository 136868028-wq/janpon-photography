"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  BookOpen,
  Users,
  Wallet,
  Image as ImageIcon,
  Package,
  Camera,
  Clock,
  Sparkles,
  Star,
  BarChart3,
  Settings,
  ScrollText,
  Menu,
  Camera as CameraLogo,
  Search,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { BUSINESS } from "@/constants/booking";

const NAV_SECTIONS = [
  {
    label: "ภาพรวม",
    items: [
      { href: "/admin/dashboard", label: "แดชบอร์ด", icon: LayoutDashboard },
      { href: "/admin/analytics", label: "วิเคราะห์", icon: BarChart3 },
    ],
  },
  {
    label: "การจอง",
    items: [
      { href: "/admin/bookings", label: "รายการจอง", icon: BookOpen },
      { href: "/admin/calendar", label: "ปฏิทิน", icon: CalendarDays },
      { href: "/admin/payments", label: "ตรวจสอบหลักฐาน", icon: Wallet },
    ],
  },
  {
    label: "ลูกค้า",
    items: [{ href: "/admin/customers", label: "ลูกค้า", icon: Users }],
  },
  {
    label: "เนื้อหา",
    items: [
      { href: "/admin/services", label: "บริการ", icon: Sparkles },
      { href: "/admin/packages", label: "แพ็กเกจ", icon: Package },
      { href: "/admin/photographers", label: "ช่างภาพ", icon: Camera },
      { href: "/admin/availability", label: "เวลาเปิดให้บริการ", icon: Clock },
      { href: "/admin/portfolio", label: "ผลงาน", icon: ImageIcon },
      { href: "/admin/reviews", label: "รีวิว", icon: Star },
    ],
  },
  {
    label: "ระบบ",
    items: [
      { href: "/admin/settings", label: "ตั้งค่า", icon: Settings },
      { href: "/admin/audit-logs", label: "บันทึกการใช้งาน", icon: ScrollText },
    ],
  },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4" aria-label="เมนูแอดมิน">
      {NAV_SECTIONS.map((section) => (
        <div key={section.label}>
          <p className="px-3 pb-1.5 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
            {section.label}
          </p>
          <ul className="space-y-0.5">
            {section.items.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
                    )}
                  >
                    <item.icon className="size-4 shrink-0" />
                    {item.label}
                    {item.href === "/admin/payments" && (
                      <span className="ml-auto rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-300">
                        2
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 flex-col border-r bg-sidebar lg:flex">
        <div className="flex h-16 items-center gap-2 border-b px-4">
          <span className="flex size-9 items-center justify-center rounded-xl bg-coal text-brand">
            <CameraLogo className="size-5" />
          </span>
          <div>
            <p className="font-heading text-sm font-bold leading-tight">{BUSINESS.name}</p>
            <p className="text-[11px] text-muted-foreground">ระบบบริหารจัดการ</p>
          </div>
        </div>
        <NavLinks />
        <div className="border-t p-3">
          <div className="flex items-center gap-2.5 rounded-lg bg-muted/60 p-2.5">
            <Avatar className="size-8">
              <AvatarFallback className="bg-coal text-brand text-xs font-bold">ก</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">ช่างเก่ง</p>
              <p className="truncate text-[11px] text-muted-foreground">เจ้าของร้าน</p>
            </div>
          </div>
        </div>
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon-lg" className="lg:hidden" aria-label="เปิดเมนูแอดมิน">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <SheetTitle className="sr-only">เมนูแอดมิน</SheetTitle>
          <div className="flex h-16 items-center gap-2 border-b px-4">
            <span className="flex size-9 items-center justify-center rounded-xl bg-coal text-brand">
              <CameraLogo className="size-5" />
            </span>
            <div>
              <p className="font-heading text-sm font-bold leading-tight">{BUSINESS.name}</p>
              <p className="text-[11px] text-muted-foreground">ระบบบริหารจัดการ</p>
            </div>
          </div>
          <NavLinks onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b bg-background/85 px-4 backdrop-blur-md">
          <div className="hidden sm:block lg:hidden">
            <Button variant="ghost" size="icon-lg" aria-label="เปิดเมนู">
              <Menu />
            </Button>
          </div>
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input placeholder="ค้นหาการจอง รหัสลูกค้า เบอร์โทร..." className="pl-9" aria-label="ค้นหา" />
          </div>
          <div className="ml-auto flex items-center gap-1">
            <Button variant="ghost" size="icon-lg" className="relative" aria-label="การแจ้งเตือน">
              <Bell className="size-5" />
              <span className="absolute right-2 top-2 size-2 rounded-full bg-red-500" aria-hidden />
            </Button>
            <Link href="/" className="hidden sm:block">
              <Button variant="outline" size="sm">ดูเว็บไซต์</Button>
            </Link>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
