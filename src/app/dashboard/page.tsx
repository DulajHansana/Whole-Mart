import { StatCard } from "@/components/dashboard/stat-card";
import { AttendanceTable } from "@/components/dashboard/attendance-table";
import { Calendar, Users, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="This Month's Total" value={`${totalMonthHours} hrs`} icon={<Calendar className="h-6 w-6 text-muted-foreground" />} description="Total hours recorded" />
        <StatCard title="Active Users" value="12" icon={<Users className="h-6 w-6 text-muted-foreground" />} description="Manage users in the users tab" />
      </div>
       <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Recent Attendance</CardTitle>
            <Button asChild size="sm" variant="outline">
                <Link href="/dashboard/attendance">View All <ArrowUpRight className="h-4 w-4 ml-2" /></Link>
            </Button>
        </CardHeader>
        <CardContent>
            <AttendanceTable data={attendanceData} />
        </CardContent>
       </Card>
    </div>
  );
}
