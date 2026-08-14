import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/admin/stat-card";
import {
  BookingRevenueAreaChart,
  DistributionBarChart,
  DistributionPieChart,
  FunnelBarChart,
} from "@/components/admin/charts";
import { mockAnalytics } from "@/lib/mock-data";

export const metadata = { title: "วิเคราะห์ข้อมูล" };

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">วิเคราะห์ข้อมูล</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          วิเคราะห์การจอง รายได้ แหล่งที่มาของลูกค้า และ funnel — ดึงข้อมูลจากระบบ tracking แบบเรียลไทม์
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {mockAnalytics.kpis.slice(0, 5).map((kpi) => (
          <StatCard key={kpi.label} label={kpi.label} value={kpi.value} change={kpi.change} trend={kpi.trend} />
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">แนวโน้มการจองและรายได้ (5 เดือนล่าสุด)</CardTitle>
          </CardHeader>
          <CardContent>
            <BookingRevenueAreaChart data={mockAnalytics.bookingTrend} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">สัดส่วนบริการ</CardTitle>
          </CardHeader>
          <CardContent>
            <DistributionPieChart data={mockAnalytics.serviceDistribution} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">แหล่งที่มาของการจอง (Marketing Source)</CardTitle>
          </CardHeader>
          <CardContent>
            <DistributionBarChart data={mockAnalytics.sourceDistribution} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Funnel การจอง (เข้าชม → ยืนยัน)</CardTitle>
          </CardHeader>
          <CardContent>
            <FunnelBarChart data={mockAnalytics.funnel} />
            <p className="mt-3 rounded-lg bg-sand p-3 text-xs text-muted-foreground">
              อัตราเปลี่ยนผ่านจากขั้น “เข้าสู่ชำระเงิน” ไป “ยืนยันสำเร็จ”:{" "}
              <strong className="text-foreground">62.3%</strong> · จาก “เริ่มจอง” ไป “ยืนยันสำเร็จ”:{" "}
              <strong className="text-foreground">40.6%</strong>
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">รายงานการขายตามช่องทาง (เดือนนี้)</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th className="pb-2 font-medium">แหล่งที่มา</th>
                <th className="pb-2 font-medium">เข้าชม</th>
                <th className="pb-2 font-medium">เริ่มจอง</th>
                <th className="pb-2 font-medium">ชำระเงิน</th>
                <th className="pb-2 font-medium">ยืนยัน</th>
                <th className="pb-2 font-medium">รายได้ (บาท)</th>
                <th className="pb-2 font-medium">อัตราเปลี่ยนผ่าน</th>
              </tr>
            </thead>
            <tbody>
              {mockAnalytics.sourceDistribution.map((s) => (
                <tr key={s.name} className="border-b last:border-0">
                  <td className="py-2.5 font-medium">{s.name}</td>
                  <td className="py-2.5">{(s.value * 24).toLocaleString("th-TH")}</td>
                  <td className="py-2.5">{Math.round(s.value * 4.2)}</td>
                  <td className="py-2.5">{Math.round(s.value * 2.8)}</td>
                  <td className="py-2.5">{Math.round(s.value * 1.7)}</td>
                  <td className="py-2.5">{(s.value * 9200).toLocaleString("th-TH")}</td>
                  <td className="py-2.5">{s.value * 1.7 * 100 / Math.round(s.value * 24) === 0 ? "-" : `${(s.value * 1.7 / Math.round(s.value * 4.2) * 100).toFixed(0)}%`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}