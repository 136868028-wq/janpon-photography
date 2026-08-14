"use client";

import { useState } from "react";
import Link from "next/link";
import { Download, Eye, MoreHorizontal, Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BookingStatusBadge, PaymentStatusBadge } from "@/components/shared/status-badge";
import { mockBookings } from "@/lib/mock-data";
import { BOOKING_STATUS_LABEL_TH, type BookingStatus } from "@/constants/booking";

const FILTER_STATUS: (BookingStatus | "all")[] = ["all", "confirmed", "pending_verification", "pending_payment", "holding", "completed", "cancelled", "expired"];

export default function AdminBookingsPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [date, setDate] = useState("");

  const filtered = mockBookings.filter((b) => {
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      b.code.toLowerCase().includes(q) ||
      b.customerName.toLowerCase().includes(q) ||
      b.phone.includes(q);
    const matchesStatus = status === "all" || b.status === status;
    const matchesDate = !date || b.date === date;
    return matchesQuery && matchesStatus && matchesDate;
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">รายการจอง</h1>
          <p className="mt-1 text-sm text-muted-foreground">จัดการทุกการจองของร้าน</p>
        </div>
        <Button size="sm" className="bg-brand text-brand-fg hover:bg-brand-strong">
          <Plus className="size-4" /> เพิ่มการจองด้วยตนเอง
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex-1">
              <Input placeholder="ค้นหา รหัส ชื่อลูกค้า เบอร์โทร..." value={query} onChange={(e) => setQuery(e.target.value)} aria-label="ค้นหาการจอง" />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:flex">
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger aria-label="กรองสถานะ" className="w-full sm:w-48">
                  <SelectValue placeholder="สถานะทั้งหมด" />
                </SelectTrigger>
                <SelectContent>
                  {FILTER_STATUS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s === "all" ? "สถานะทั้งหมด" : BOOKING_STATUS_LABEL_TH[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} aria-label="กรองวันที่" className="sm:w-40" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>รหัส</TableHead>
                  <TableHead>ลูกค้า</TableHead>
                  <TableHead>บริการ</TableHead>
                  <TableHead className="whitespace-nowrap">วันเวลา</TableHead>
                  <TableHead>ช่างภาพ</TableHead>
                  <TableHead>สถานะจอง</TableHead>
                  <TableHead>การเงิน</TableHead>
                  <TableHead className="text-right">จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-mono text-xs font-bold tracking-wider">{b.code}</TableCell>
                    <TableCell>
                      <p className="text-sm font-semibold">{b.customerName}</p>
                      <p className="text-xs text-muted-foreground">{b.phone}</p>
                    </TableCell>
                    <TableCell className="text-sm">{b.serviceName}</TableCell>
                    <TableCell className="whitespace-nowrap text-sm">{b.date} {b.startTime}-{b.endTime}</TableCell>
                    <TableCell className="text-sm">{b.photographer}</TableCell>
                    <TableCell><BookingStatusBadge status={b.status} /></TableCell>
                    <TableCell>
                      <PaymentStatusBadge status={b.paymentStatus} />
                      <p className="mt-1 text-xs text-muted-foreground">{b.deposit.toLocaleString("th-TH")} / {b.remaining.toLocaleString("th-TH")} บาท</p>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon-sm" asChild aria-label={`ดู ${b.code}`}>
                          <Link href={`/booking/${b.code}`}><Eye className="size-4" /></Link>
                        </Button>
                        <Button variant="ghost" size="icon-sm" aria-label={`แก้ไข ${b.code}`}><Pencil className="size-4" /></Button>
                        <Button variant="ghost" size="icon-sm" aria-label="เมนูเพิ่มเติม"><MoreHorizontal className="size-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="h-32 text-center text-sm text-muted-foreground">
                      ไม่พบรายการที่ตรงกับตัวกรอง
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>แสดง {filtered.length} จาก {mockBookings.length} รายการ</p>
        <Button variant="outline" size="sm">
          <Download className="size-4" /> ส่งออก CSV
        </Button>
      </div>
    </div>
  );
}