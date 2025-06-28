import { TimeClock } from "@/components/dashboard/time-clock";
import { StatCard } from "@/components/dashboard/stat-card";
import { AttendanceTable } from "@/components/dashboard/attendance-table";
import { Clock, Calendar, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const attendanceData = [
  { date: "2024-07-22", checkIn: "09:03 AM", checkOut: "05:05 PM", totalHours: "8.03" },
  { date: "2024-07-21", checkIn: "08:55 AM", checkOut: "05:00 PM", totalHours: "8.08" },
  { date: "2024-07-20", checkIn: "09:15 AM", checkOut: "05:30 PM", totalHours: "8.25" },
  { date: "2024-07-19", checkIn: "09:00 AM", checkOut: "04:45 PM", totalHours: "7.75" },
  { date: "2024-07-18", checkIn: "09:08 AM", checkOut: "05:10 PM", totalHours: "8.03" },
  { date: "2024-07-17", checkIn: "09:00 AM", checkOut: "05:00 PM", totalHours: "8.00" },
  { date: "2024-07-16", checkIn: "09:12 AM", checkOut: "05:12 PM", totalHours: "8.00" },
  { date: "2024-07-15", checkIn: "08:45 AM", checkOut: "05:15 PM", totalHours: "8.50" },
];

export default function AttendancePage() {
  const totalMonthHours = attendanceData.reduce((acc, entry) => acc + parseFloat(entry.totalHours), 0).toFixed(2);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <TimeClock />
        <StatCard title="Today's Hours" value="0.00" icon={<Clock className="h-6 w-6 text-muted-foreground" />} description="You are currently checked out" />
        <StatCard title="This Month's Total" value={`${totalMonthHours} hrs`} icon={<Calendar className="h-6 w-6 text-muted-foreground" />} description="Based on recorded hours" />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Attendance History</CardTitle>
            <CardDescription>View and manage employee attendance records.</CardDescription>
          </div>
          <Button asChild variant="outline">
            <Link href="/report">
              <Download className="mr-2 h-4 w-4" />
              Generate Report
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <AttendanceTable data={attendanceData} />
        </CardContent>
      </Card>
    </div>
  );
}
