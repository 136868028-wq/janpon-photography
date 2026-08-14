"use client";

import { useState } from "react";
import { Lock, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { mockAvailabilityRules, mockBlockedDates, mockPhotographers } from "@/lib/mock-data";

export default function AdminAvailabilityPage() {
  const [blockOpen, setBlockOpen] = useState(false);
  const [rules, setRules] = useState(mockAvailabilityRules);
  const [blocks, setBlocks] = useState(mockBlockedDates);

  const toggleRule = (id: string) => setRules((prev) => prev.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r)));
  const removeBlock = (id: string) => setBlocks((prev) => prev.filter((b) => b.id !== id));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">เวลาเปิดให้บริการ</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            กำหนดช่วงเวลารับจอง (เช้า/เย็น) และวันที่ปิดรับจอง — ระบบคิดคิวว่างจากข้อมูลนี้ฝั่ง server
          </p>
        </div>
        <Button size="sm" className="bg-brand text-brand-fg hover:bg-brand-strong" onClick={() => setBlockOpen(true)}>
          <Plus className="size-4" /> บล็อกวัน/เวลา
        </Button>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">ช่วงเวลารับจอง (availability rules)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {rules.map((rule) => (
              <div key={rule.id} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <span className={rule.isActive ? "size-2.5 rounded-full bg-emerald-500" : "size-2.5 rounded-full bg-muted-foreground/40"} aria-hidden />
                  <div className="text-sm">
                    <p className="font-semibold">{rule.weekday}</p>
                    <p className="text-xs text-muted-foreground">
                      {rule.startTime} - {rule.endTime} น. · รับ {rule.maxBookings} คิว
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={rule.isActive ? "secondary" : "outline"}>{rule.isActive ? "เปิด" : "ปิด"}</Badge>
                  <Switch checked={rule.isActive} onCheckedChange={() => toggleRule(rule.id)} aria-label={`เปิด/ปิด ${rule.weekday} ${rule.startTime}`} />
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full h-9">
              <Plus className="size-4" /> เพิ่มช่วงเวลา
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">วันที่ปิดรับจอง</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {blocks.map((b) => (
              <div key={b.id} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <Lock className="size-4" />
                  </span>
                  <div className="text-sm">
                    <p className="font-semibold">{b.date} {b.startTime !== "-" && <>· {b.startTime}-{b.endTime} น.</>}</p>
                    <p className="text-xs text-muted-foreground">{b.reason} · โดย {b.by}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon-sm" aria-label={`ลบการบล็อก ${b.date}`} onClick={() => removeBlock(b.id)}>
                  <Trash2 className="size-4 text-muted-foreground hover:text-red-600" />
                </Button>
              </div>
            ))}
            {blocks.length === 0 && (
              <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">ยังไม่มีวันที่ปิดรับจอง</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="rounded-xl bg-sand p-4 text-xs text-muted-foreground">
        <p className="font-semibold">การล็อกคิวระหว่างชำระเงิน</p>
        <p className="mt-1">
          นอกเหนือจากข้อมูลนี้ ระบบยังกันคิวซ้ำด้วย “booking hold” 10 นาที ระหว่างขั้นตอนชำระเงิน —
          คิวใดถูกล็อก จะไม่ปรากฏเป็นคิวว่างให้ลูกค้าคนอื่นเห็น ทุกการบล็อกวันถูกบันทึกใน Audit Log
        </p>
      </div>

      <Dialog open={blockOpen} onOpenChange={setBlockOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>บล็อกวัน/ช่วงเวลา</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="block-date">วันที่</Label>
              <Input id="block-date" type="date" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="block-from">เริ่มเวลา</Label>
                <Select>
                  <SelectTrigger id="block-from"><SelectValue placeholder="ทั้งวัน" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทั้งวัน</SelectItem>
                    <SelectItem value="08-12">08:00 - 12:00</SelectItem>
                    <SelectItem value="13-17">13:00 - 17:00</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="block-chang">ช่างภาพ</Label>
                <Select>
                  <SelectTrigger id="block-chang"><SelectValue placeholder="ทุกคน" /></SelectTrigger>
                  <SelectContent>
                    {mockPhotographers.filter((p) => p.isActive && p.role === "photographer").map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.displayName}</SelectItem>
                    ))}
                    <SelectItem value="all">ทุกคน</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="block-reason">เหตุผล</Label>
              <Input id="block-reason" placeholder="เช่น ออกงานนอกสถานที่ / วันหยุดร้าน" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBlockOpen(false)}><X className="size-4" /> ยกเลิก</Button>
            <Button className="bg-brand text-brand-fg hover:bg-brand-strong" onClick={() => setBlockOpen(false)}>บันทึกการบล็อก</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}