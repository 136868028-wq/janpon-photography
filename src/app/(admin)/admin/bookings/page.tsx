"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Download,
  Eye,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Phone,
  User,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BookingStatusBadge, PaymentStatusBadge } from "@/components/shared/status-badge";
import {
  getAdminBookingsAction,
  createManualBookingAction,
  updateBookingStatusAction,
  deleteBookingAction,
} from "@/actions/admin";
import { formatThaiDate } from "@/lib/thai-calendar";
import { BOOKING_STATUS_LABEL_TH, type BookingStatus } from "@/constants/booking";
import { cn } from "@/lib/utils";

const FILTER_STATUS: (BookingStatus | "all")[] = [
  "all",
  "confirmed",
  "pending_verification",
  "pending_payment",
  "holding",
  "completed",
  "cancelled",
];

const SERVICE_OPTIONS = [
  { name: "ถ่ายงานแต่งงาน", price: 3500, deposit: 500 },
  { name: "ถ่ายรับปริญญา", price: 4500, deposit: 500 },
  { name: "ถ่ายพอร์ต", price: 250, deposit: 300 },
  { name: "ถ่ายอีเวนต์", price: 3500, deposit: 1000 },
];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [date, setDate] = useState("");

  // Modals state
  const [openNewModal, setOpenNewModal] = useState<boolean>(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // New Booking Form state
  const [newBooking, setNewBooking] = useState({
    serviceName: SERVICE_OPTIONS[0].name,
    packageName: "แพ็กเกจมาตรฐาน",
    date: new Date().toISOString().split("T")[0],
    slot: "morning",
    totalPrice: SERVICE_OPTIONS[0].price,
    depositAmount: SERVICE_OPTIONS[0].deposit,
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    customerLine: "",
    customerNote: "",
    status: "confirmed",
  });

  const loadBookings = async () => {
    setLoading(true);
    try {
      const res = await getAdminBookingsAction();
      if (res.success && res.bookings) {
        setBookings(res.bookings);
      }
    } catch (err) {
      console.error("Failed to load bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateBookingStatusAction(id, newStatus);
      await loadBookings();
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("คุณแน่ใจหรือไม่ว่าต้องการลบรายการจองนี้?")) {
      try {
        await deleteBookingAction(id);
        setSelectedBooking(null);
        await loadBookings();
      } catch (err) {
        console.error("Delete error:", err);
      }
    }
  };

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBooking.customerName.trim() || !newBooking.customerPhone.trim()) {
      alert("กรุณากรอกชื่อและเบอร์โทรลูกค้า");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createManualBookingAction(newBooking);
      if (res.success) {
        setOpenNewModal(false);
        setNewBooking({
          serviceName: SERVICE_OPTIONS[0].name,
          packageName: "แพ็กเกจมาตรฐาน",
          date: new Date().toISOString().split("T")[0],
          slot: "morning",
          totalPrice: SERVICE_OPTIONS[0].price,
          depositAmount: SERVICE_OPTIONS[0].deposit,
          customerName: "",
          customerPhone: "",
          customerEmail: "",
          customerLine: "",
          customerNote: "",
          status: "confirmed",
        });
        await loadBookings();
      } else {
        alert(res.error || "เกิดข้อผิดพลาดในการสร้างการจอง");
      }
    } catch (err: any) {
      alert(err?.message || "ไม่สามารถเชื่อมต่อฐานข้อมูลได้");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = bookings.filter((b) => {
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      b.code?.toLowerCase().includes(q) ||
      b.customer_name?.toLowerCase().includes(q) ||
      b.customer_phone?.includes(q);
    const matchesStatus = status === "all" || b.status === status;
    const matchesDate = !date || b.date === date;
    return matchesQuery && matchesStatus && matchesDate;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">รายการจองคิวถ่ายภาพ</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            จัดการและติดตามการจองทั้งหมด บันทึกและดึงข้อมูลสดจาก Supabase ({bookings.length} รายการ)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadBookings} disabled={loading} className="gap-1.5">
            <RefreshCw className={cn("size-3.5", loading && "animate-spin")} /> รีเฟรช
          </Button>
          <Button
            size="sm"
            onClick={() => setOpenNewModal(true)}
            className="bg-brand text-brand-fg hover:bg-brand-strong gap-1.5 font-semibold"
          >
            <Plus className="size-4" /> เพิ่มการจองด้วยตนเอง
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex-1">
              <Input
                placeholder="ค้นหารหัสจอง, ชื่อลูกค้า, เบอร์โทร..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="ค้นหาการจอง"
              />
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
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                aria-label="กรองวันที่"
                className="sm:w-40"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>รหัส</TableHead>
                  <TableHead>ลูกค้า</TableHead>
                  <TableHead>บริการ & แพ็กเกจ</TableHead>
                  <TableHead className="whitespace-nowrap">วันและรอบเวลา</TableHead>
                  <TableHead>มัดจำ / ยอดรวม</TableHead>
                  <TableHead>สถานะการจอง</TableHead>
                  <TableHead>เปลี่ยนสถานะ</TableHead>
                  <TableHead className="text-right">จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-32 text-center text-sm text-muted-foreground">
                      กำลังโหลดข้อมูลจากฐานข้อมูล...
                    </TableCell>
                  </TableRow>
                ) : filtered.map((b) => (
                  <TableRow key={b.id} className="hover:bg-muted/40">
                    <TableCell className="font-mono text-xs font-bold tracking-wider text-brand-strong">
                      {b.code}
                    </TableCell>
                    <TableCell>
                      <p className="text-xs font-bold text-foreground">{b.customer_name}</p>
                      <p className="text-[11px] text-muted-foreground">{b.customer_phone}</p>
                    </TableCell>
                    <TableCell className="text-xs">
                      <p className="font-semibold">{b.service_name}</p>
                      {b.package_name && <p className="text-[11px] text-muted-foreground">{b.package_name}</p>}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-xs">
                      <p className="font-semibold">{formatThaiDate(b.date, "short")}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {b.slot === "morning" ? "09:00 - 13:00 น." : b.slot === "evening" ? "13:00 - 17:00 น." : "เต็มวัน (09:00-17:00)"}
                      </p>
                    </TableCell>
                    <TableCell className="text-xs">
                      <p className="font-bold text-emerald-600 dark:text-emerald-400">
                        มัดจำ {b.deposit_amount?.toLocaleString("th-TH")} ฿
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        รวม {b.total_price?.toLocaleString("th-TH")} ฿
                      </p>
                    </TableCell>
                    <TableCell>
                      <BookingStatusBadge status={b.status} />
                    </TableCell>
                    <TableCell>
                      <select
                        value={b.status}
                        onChange={(e) => handleStatusChange(b.id, e.target.value)}
                        className="h-8 rounded-lg border bg-background px-2 text-xs font-medium text-foreground focus:ring-1 focus:ring-brand"
                      >
                        <option value="holding">คิวถูกล็อกชั่วคราว</option>
                        <option value="pending_payment">รอชำระเงิน</option>
                        <option value="pending_verification">รอตรวจสลิป</option>
                        <option value="confirmed">ยืนยันคิวแล้ว</option>
                        <option value="completed">เสร็จสิ้นงาน</option>
                        <option value="cancelled">ยกเลิกคิว</option>
                      </select>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setSelectedBooking(b)}
                          aria-label="ดูรายละเอียด"
                        >
                          <Eye className="size-4" />
                        </Button>
                        <Link href={`/booking/${b.code}`} target="_blank">
                          <Button variant="ghost" size="icon-sm" aria-label="ดูหน้าลูกค้า">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {!loading && filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="h-32 text-center text-sm text-muted-foreground">
                      ไม่พบรายการจองที่ตรงกับเงื่อนไข
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Booking Details Modal Dialog */}
      <Dialog open={Boolean(selectedBooking)} onOpenChange={(open) => !open && setSelectedBooking(null)}>
        <DialogContent className="max-w-md sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg font-bold flex items-center justify-between">
              <span>รายละเอียดการจอง {selectedBooking?.code}</span>
              {selectedBooking && <BookingStatusBadge status={selectedBooking.status} />}
            </DialogTitle>
            <DialogDescription>
              บันทึกเมื่อ {selectedBooking?.created_at ? new Date(selectedBooking.created_at).toLocaleString("th-TH") : "-"}
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-4 text-xs sm:text-sm">
              <div className="rounded-xl bg-sand p-3.5 space-y-2">
                <div className="flex justify-between"><span className="text-muted-foreground">ชื่อลูกค้า:</span><span className="font-bold">{selectedBooking.customer_name}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">เบอร์โทรศัพท์:</span><span className="font-bold">{selectedBooking.customer_phone}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">LINE ID:</span><span>{selectedBooking.customer_line || "-"}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">อีเมล:</span><span>{selectedBooking.customer_email || "-"}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">การยินยอมเผยแพร่ภาพ:</span><span className="font-semibold">{selectedBooking.photo_consent ? "✓ ยินยอม (Facebook & IG)" : "✕ ไม่ยินยอม"}</span></div>
                {selectedBooking.customer_note && (
                  <div className="border-t pt-2 mt-2">
                    <span className="text-muted-foreground">หมายเหตุ:</span>
                    <p className="mt-0.5 font-medium text-foreground">{selectedBooking.customer_note}</p>
                  </div>
                )}
              </div>

              <div className="rounded-xl border p-3.5 space-y-2">
                <div className="flex justify-between"><span className="text-muted-foreground">บริการ:</span><span className="font-bold">{selectedBooking.service_name}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">แพ็กเกจ:</span><span>{selectedBooking.package_name || "-"}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">วันที่ถ่าย:</span><span className="font-bold">{formatThaiDate(selectedBooking.date, "full")}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">ช่วงเวลา:</span><span>{selectedBooking.slot === "morning" ? "09:00 - 13:00 น. (ช่วงเช้า)" : selectedBooking.slot === "evening" ? "13:00 - 17:00 น. (ช่วงบ่าย)" : "เต็มวัน (09:00 - 17:00 น.)"}</span></div>
                <div className="flex justify-between border-t pt-2"><span className="text-muted-foreground">ยอดรวม:</span><span className="font-bold">{selectedBooking.total_price?.toLocaleString("th-TH")} บาท</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">มัดจำ:</span><span className="font-extrabold text-brand-strong">{selectedBooking.deposit_amount?.toLocaleString("th-TH")} บาท</span></div>
              </div>
            </div>
          )}

          <DialogFooter className="flex justify-between items-center sm:justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="text-rose-600 hover:text-rose-700"
              onClick={() => handleDelete(selectedBooking?.id)}
            >
              <Trash2 className="size-4 mr-1" /> ลบการจองนี้
            </Button>
            <Button size="sm" onClick={() => setSelectedBooking(null)}>
              ปิดหน้าต่าง
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Manual Booking Modal Dialog */}
      <Dialog open={openNewModal} onOpenChange={setOpenNewModal}>
        <DialogContent className="max-w-md sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg font-bold">
              เพิ่มการจองด้วยตนเอง (Manual Booking)
            </DialogTitle>
            <DialogDescription>
              สำหรับบันทึกคิวจากลูกค้าที่ติดต่อผ่าน LINE / หน้าร้าน / โทรศัพท์
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateBooking} className="space-y-3.5 text-xs sm:text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">บริการ *</Label>
                <select
                  value={newBooking.serviceName}
                  onChange={(e) => {
                    const found = SERVICE_OPTIONS.find((s) => s.name === e.target.value);
                    setNewBooking({
                      ...newBooking,
                      serviceName: e.target.value,
                      totalPrice: found ? found.price : newBooking.totalPrice,
                      depositAmount: found ? found.deposit : newBooking.depositAmount,
                    });
                  }}
                  className="h-9 w-full rounded-lg border bg-background px-3 text-xs font-medium focus:ring-1 focus:ring-brand"
                >
                  {SERVICE_OPTIONS.map((s) => (
                    <option key={s.name} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">รอบเวลา *</Label>
                <select
                  value={newBooking.slot}
                  onChange={(e) => setNewBooking({ ...newBooking, slot: e.target.value })}
                  className="h-9 w-full rounded-lg border bg-background px-3 text-xs font-medium focus:ring-1 focus:ring-brand"
                >
                  <option value="morning">ช่วงเช้า (09:00 - 13:00 น.)</option>
                  <option value="evening">ช่วงบ่าย (13:00 - 17:00 น.)</option>
                  <option value="fullday">เต็มวัน (09:00 - 17:00 น.)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">วันที่ถ่ายภาพ *</Label>
                <Input
                  type="date"
                  value={newBooking.date}
                  onChange={(e) => setNewBooking({ ...newBooking, date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">สถานะเริ่มต้น</Label>
                <select
                  value={newBooking.status}
                  onChange={(e) => setNewBooking({ ...newBooking, status: e.target.value })}
                  className="h-9 w-full rounded-lg border bg-background px-3 text-xs font-medium focus:ring-1 focus:ring-brand"
                >
                  <option value="confirmed">ยืนยันคิวแล้ว (รับมัดจำแล้ว)</option>
                  <option value="pending_payment">รอชำระมัดจำ</option>
                  <option value="completed">เสร็จสิ้นงานแล้ว</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">ชื่อ-นามสกุล ลูกค้า *</Label>
                <Input
                  placeholder="เช่น คุณกฤษณะ"
                  value={newBooking.customerName}
                  onChange={(e) => setNewBooking({ ...newBooking, customerName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">เบอร์โทรศัพท์ *</Label>
                <Input
                  placeholder="08x-xxx-xxxx"
                  value={newBooking.customerPhone}
                  onChange={(e) => setNewBooking({ ...newBooking, customerPhone: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">ยอดรวม (บาท)</Label>
                <Input
                  type="number"
                  value={newBooking.totalPrice}
                  onChange={(e) => setNewBooking({ ...newBooking, totalPrice: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">ยอดมัดจำ (บาท)</Label>
                <Input
                  type="number"
                  value={newBooking.depositAmount}
                  onChange={(e) => setNewBooking({ ...newBooking, depositAmount: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">หมายเหตุเพิ่มเติม</Label>
              <Textarea
                rows={2}
                placeholder="เช่น สถานที่ถ่าย, โอนผ่านบัญชีร้านแล้ว..."
                value={newBooking.customerNote}
                onChange={(e) => setNewBooking({ ...newBooking, customerNote: e.target.value })}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setOpenNewModal(false)}>
                ยกเลิก
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-brand text-brand-fg hover:bg-brand-strong font-bold"
              >
                {isSubmitting ? "กำลังบันทึก..." : "บันทึกการจอง"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}