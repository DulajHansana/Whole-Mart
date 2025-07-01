"use client";

import { useState, useEffect, useCallback } from "react";
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
import { useAuth } from "@/hooks/use-auth";
import { getAttendanceRecords } from "@/app/actions/attendance.actions";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO, startOfMonth, isWithinInterval } from 'date-fns';

type FormattedAttendanceEntry = {
  date: string;
  checkIn: string;
  checkOut: string;
  totalHours: string;
};

export default function AttendancePage() {
  const [attendanceData, setAttendanceData] = useState<FormattedAttendanceEntry[]>([]);
  const [rawAttendanceData, setRawAttendanceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchAttendance = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    const result = await getAttendanceRecords(user.id);
    if (result.success && result.data) {
      setRawAttendanceData(result.data);
      const formattedData = result.data.map((record: any) => ({
        date: format(parseISO(record.checkIn), 'yyyy-MM-dd'),
        checkIn: format(parseISO(record.checkIn), 'p'),
        checkOut: record.checkOut ? format(parseISO(record.checkOut), 'p') : '—',
        totalHours: record.totalHours?.toFixed(2) ?? 'In Progress',
      }));
      setAttendanceData(formattedData);
    } else {
      toast({
        title: "Error",
        description: result.message || "Failed to fetch attendance records.",
        variant: "destructive",
      });
    }
    setLoading(false);
  }, [user, toast]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const now = new Date();
  const startOfThisMonth = startOfMonth(now);

  const totalMonthHours = rawAttendanceData
    .filter(entry => entry.checkOut && isWithinInterval(parseISO(entry.checkIn), { start: startOfThisMonth, end: now }))
    .reduce((acc, entry) => acc + (entry.totalHours || 0), 0)
    .toFixed(2);
    
  const todayHours = rawAttendanceData
    .filter(entry => entry.checkOut && format(parseISO(entry.checkIn), 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd'))
    .reduce((acc, entry) => acc + (entry.totalHours || 0), 0)
    .toFixed(2);
  
  const todayDescription = "Live status from Time Clock";

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <TimeClock />
        <StatCard 
          title="Today's Hours" 
          value={`${todayHours} hrs`} 
          icon={<Clock className="h-6 w-6 text-muted-foreground" />} 
          description={todayDescription} 
        />
        <StatCard 
          title="This Month's Total" 
          value={`${totalMonthHours} hrs`} 
          icon={<Calendar className="h-6 w-6 text-muted-foreground" />} 
          description="Based on recorded hours" 
        />
      </div>

      <Card>
        <CardHeader className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Attendance History</CardTitle>
            <CardDescription>View and manage your attendance records.</CardDescription>
          </div>
          <Button asChild variant="outline">
            <Link href="/report">
              <Download className="mr-2 h-4 w-4" />
              Generate Report
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <AttendanceTable data={attendanceData} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
