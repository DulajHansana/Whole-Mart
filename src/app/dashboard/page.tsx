import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/dashboard/header";
import { TimeClock } from "@/components/dashboard/time-clock";
import { StatCard } from "@/components/dashboard/stat-card";
import { AttendanceTable } from "@/components/dashboard/attendance-table";
import { Clock, Calendar, Download } from "lucide-react";

const attendanceData = [
  { date: "2024-07-22", checkIn: "09:03 AM", checkOut: "05:05 PM", totalHours: "8.03" },
  { date: "2024-07-21", checkIn: "08:55 AM", checkOut: "05:00 PM", totalHours: "8.08" },
  { date: "2024-07-20", checkIn: "09:15 AM", checkOut: "05:30 PM", totalHours: "8.25" },
  { date: "2024-07-19", checkIn: "09:00 AM", checkOut: "04:45 PM", totalHours: "7.75" },
  { date: "2024-07-18", checkIn: "09:08 AM", checkOut: "05:10 PM", totalHours: "8.03" },
];

export default function DashboardPage() {
  const totalMonthHours = attendanceData.reduce((acc, entry) => acc + parseFloat(entry.totalHours), 0).toFixed(2);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <TimeClock />
            <StatCard title="Today's Hours" value="0.00" icon={<Clock className="h-6 w-6 text-muted-foreground" />} description="You are currently checked out" />
            <StatCard title="This Month's Total" value={`${totalMonthHours} hrs`} icon={<Calendar className="h-6 w-6 text-muted-foreground" />} description="Based on recorded hours" />
          </div>

          <div className="bg-card p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Recent Activity</h2>
              <Button asChild variant="outline" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/report">
                  <Download className="mr-2 h-4 w-4" />
                  Generate Report
                </Link>
              </Button>
            </div>
            <AttendanceTable data={attendanceData} />
          </div>
        </div>
      </main>
    </div>
  );
}
