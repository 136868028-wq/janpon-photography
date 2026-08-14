"use client";

import { useState } from "react";
import { Mail, MessageCircle, MoreHorizontal, Pencil, Phone, StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { mockCustomers, mockBookings } from "@/lib/mock-data";

export default function AdminCustomersPage() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(mockCustomers[0].id);

  const filtered = mockCustomers.filter(
    (c) =>
      !query.trim() ||
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.phone.includes(query.trim()) ||
      (c.email ?? "").toLowerCase().includes(query.toLowerCase()),
  );
  const selected = mockCustomers.find((c) => c.id === selectedId) ?? null;
  const selectedBookings = selected ? mockBookings.filter((b) => b.phone === selected.phone) : [];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">ลูกค้า</h1>
        <p className="mt-1 text-sm text-muted-foreground">ฐานข้อมูลลูกค้า (CRM) — ข้อมูลนี้ใช้ภายในร้านเท่านั้น</p>
      </div>

      <Card>
        <CardContent className="p-4">
          <Input placeholder="ค้นหา ชื่อ เบอร์โทร อีเมล..." value={query} onChange={(e) => setQuery(e.target.value)} aria-label="ค้นหาลูกค้า" />
        </CardContent>
      </Card>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ลูกค้า</TableHead>
                    <TableHead>ติดต่อ</TableHead>
                    <TableHead className="text-right">จำนวนครั้ง</TableHead>
                    <TableHead className="text-right">ยอดรวม</TableHead>
                    <TableHead>งานล่าสุด</TableHead>
                    <TableHead className="text-right">จัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((c) => (
                    <TableRow key={c.id} className={selectedId === c.id ? "bg-muted/50" : ""} onClick={() => setSelectedId(c.id)}>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <Avatar className="size-8">
                            <AvatarFallback className="bg-coal text-brand text-xs font-bold">{c.name.slice(0, 1)}</AvatarFallback>
                          </Avatar>
                          <p className="text-sm font-semibold">{c.name}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        <p>{c.phone}</p>
                        {c.lineUserId && <p className="text-xs text-muted-foreground">LINE: {c.lineUserId}</p>}
                      </TableCell>
                      <TableCell className="text-right text-sm">{c.totalBookings} ครั้ง</TableCell>
                      <TableCell className="text-right text-sm font-semibold">{c.totalSpent.toLocaleString("th-TH")} บาท</TableCell>
                      <TableCell className="whitespace-nowrap text-sm">{c.lastBooking}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon-sm" aria-label={`แก้ไข ${c.name}`}><Pencil className="size-4" /></Button>
                        <Button variant="ghost" size="icon-sm" aria-label="เมนูเพิ่มเติม"><MoreHorizontal className="size-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-sm text-muted-foreground">ไม่พบลูกค้า</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              {selected ? (
                <span className="flex items-center gap-3">
                  <Avatar className="size-10">
                    <AvatarFallback className="bg-coal text-brand text-sm font-bold">{selected.name.slice(0, 1)}</AvatarFallback>
                  </Avatar>
                  <span>
                    <span className="block">{selected.name}</span>
                    <span className="block text-xs font-normal text-muted-foreground">ลูกค้า ID: {selected.id}</span>
                  </span>
                </span>
              ) : (
                "รายละเอียดลูกค้า"
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!selected ? (
              <p className="text-sm text-muted-foreground">เลือกลูกค้าจากตารางเพื่อดูรายละเอียด</p>
            ) : (
              <>
                <div className="space-y-2 text-sm">
                  <p className="flex items-center gap-2"><Phone className="size-4 text-muted-foreground" /> {selected.phone}</p>
                  {selected.email && <p className="flex items-center gap-2"><Mail className="size-4 text-muted-foreground" /> {selected.email}</p>}
                  {selected.lineUserId && <p className="flex items-center gap-2"><MessageCircle className="size-4 text-muted-foreground" /> {selected.lineUserId}</p>}
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-muted p-2.5">
                    <p className="font-heading text-lg font-bold">{selected.totalBookings}</p>
                    <p className="text-[11px] text-muted-foreground">การจอง</p>
                  </div>
                  <div className="rounded-lg bg-muted p-2.5">
                    <p className="font-heading text-lg font-bold">{selected.totalSpent.toLocaleString("th-TH")}</p>
                    <p className="text-[11px] text-muted-foreground">บาทรวม</p>
                  </div>
                  <div className="rounded-lg bg-muted p-2.5">
                    <p className="font-heading text-lg font-bold">{selected.lastBooking}</p>
                    <p className="text-[11px] text-muted-foreground">ล่าสุด</p>
                  </div>
                </div>
                {selected.notes && (
                  <div className="rounded-lg border border-amber-600/25 bg-amber-500/5 p-3 text-xs">
                    <p className="flex items-center gap-1.5 font-semibold text-amber-700 dark:text-amber-300">
                      <StickyNote className="size-3.5" /> หมายเหตุ
                    </p>
                    <p className="mt-1 text-muted-foreground">{selected.notes}</p>
                  </div>
                )}
                <Separator />
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">ประวัติการจอง</p>
                  <ul className="mt-2 space-y-2">
                    {selectedBookings.map((b) => (
                      <li key={b.id} className="rounded-lg border p-2.5 text-xs">
                        <p className="font-mono font-bold tracking-wider">{b.code}</p>
                        <p className="mt-0.5 text-muted-foreground">{b.serviceName} · {b.date} {b.startTime}-{b.endTime} น.</p>
                      </li>
                    ))}
                    {selectedBookings.length === 0 && <li className="text-xs text-muted-foreground">ยังไม่มีประวัติใน mock data</li>}
                  </ul>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="h-8 flex-1">เพิ่มหมายเหตุ</Button>
                  <Button size="sm" variant="outline" className="h-8 flex-1">ส่งข้อความ</Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      <p className="text-xs text-muted-foreground">
        <Badge variant="outline" className="h-5 mr-1">PDPA</Badge>
        ข้อมูลลูกค้าเข้าถึงได้เฉพาะผู้มีสิทธิ์เท่านั้น ถูกบันทึกการเข้าถึงทุกครั้ง (Audit Log)
      </p>
    </div>
  );
}