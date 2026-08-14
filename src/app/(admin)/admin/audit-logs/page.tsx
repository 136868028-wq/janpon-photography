import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { mockAuditLogs } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const metadata = { title: "บันทึกการใช้งาน" };

const ACTION_STYLE: Record<string, string> = {
  "payment.verified": "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  "payment.slip_uploaded": "bg-sky-500/10 text-sky-700 dark:text-sky-300",
  "payment.rejected": "bg-red-500/10 text-red-700 dark:text-red-300",
  "booking.cancelled": "bg-red-500/10 text-red-700 dark:text-red-300",
  "booking.confirmed": "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  "hold.expired": "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  "availability.blocked": "bg-violet-500/10 text-violet-700 dark:text-violet-300",
};

export default function AdminAuditLogsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">บันทึกการใช้งาน (Audit Log)</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          บันทึกการเปลี่ยนแปลงสำคัญของระบบ — อ่านอย่างเดียว แก้ไขไม่ได้จากหน้าจอทั่วไป
        </p>
      </div>

      <Card>
        <CardContent className="space-y-4 p-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex-1">
              <Input placeholder="ค้นหาตาม action / รหัสการจอง / ผู้กระทำ..." aria-label="ค้นหา audit log" />
            </div>
            <div className="flex gap-2">
              <Input type="date" aria-label="วันที่เริ่มต้น" className="sm:w-36" />
              <Input type="date" aria-label="วันที่สิ้นสุด" className="sm:w-36" />
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
                  <th className="p-3 font-medium">เวลา</th>
                  <th className="p-3 font-medium">ผู้กระทำ</th>
                  <th className="p-3 font-medium">Action</th>
                  <th className="p-3 font-medium">รายการ</th>
                  <th className="p-3 font-medium">รายละเอียด / การเปลี่ยนแปลง</th>
                </tr>
              </thead>
              <tbody>
                {mockAuditLogs.map((log) => (
                  <tr key={log.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="whitespace-nowrap p-3 text-xs text-muted-foreground">{log.time}</td>
                    <td className="p-3 font-medium">{log.actor}</td>
                    <td className="p-3">
                      <span className={cn("inline-flex rounded-full px-2 py-0.5 font-mono text-[11px] font-semibold", ACTION_STYLE[log.action] ?? "bg-muted text-muted-foreground")}>
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3 text-xs">{log.entity}</td>
                    <td className="p-3 text-xs text-muted-foreground">{log.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <p>แสดง 8 รายการล่าสุด · ข้อมูลตัวอย่าง (mock)</p>
            <div className="flex gap-2">
              <Badge variant="outline" className="h-6">‹ ก่อนหน้า</Badge>
              <Badge variant="outline" className="h-6">ถัดไป ›</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}