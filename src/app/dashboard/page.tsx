"use client";

import { useState, useEffect, useMemo } from 'react';
import { StatCard } from "@/components/dashboard/stat-card";
import { AttendanceTable } from "@/components/dashboard/attendance-table";
import { Calendar, Users, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/hooks/use-auth';
import { getAttendanceRecords } from '@/app/actions/attendance.actions';
import { getUsers } from '@/app/actions/user.actions';
import { format, parseISO, startOfMonth, isWithinInterval } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { user } = useAuth();
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [userCount, setUserCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      setLoading(true);

      const [attendanceResult, usersResult] = await Promise.all([
        getAttendanceRecords(user.id),
        user.role === 'Owner' ? getUsers() : Promise.resolve({ success: true, data: [] })
      ]);
      
      if (attendanceResult.success && attendanceResult.data) {
        setAttendanceData(attendanceResult.data);
      }
      
      if (usersResult.success && usersResult.data) {
        setUserCount(usersResult.data.length);
      }
      
      setLoading(false);
    }
    fetchData();
  }, [user]);

  const now = new Date();
  const startOfThisMonth = startOfMonth(now);

  const totalMonthHours = useMemo(() => attendanceData
    .filter(entry => entry.checkOut && isWithinInterval(parseISO(entry.checkIn), { start: startOfThisMonth, end: now }))
    .reduce((acc, entry) => acc + (entry.totalHours || 0), 0)
    .toFixed(2), [attendanceData, now, startOfThisMonth]);

  const recentAttendance = useMemo(() => attendanceData
    .slice(0, 5)
    .map((record: any) => ({
      date: format(parseISO(record.checkIn), 'yyyy-MM-dd'),
      checkIn: format(parseISO(record.checkIn), 'p'),
      checkOut: record.checkOut ? format(parseISO(record.checkOut), 'p') : '—',
      totalHours: record.totalHours?.toFixed(2) ?? 'In Progress',
    })), [attendanceData]);

  if (loading) {
     return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card><CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader><CardContent><Skeleton className="h-8 w-1/2" /><Skeleton className="h-4 w-full mt-1" /></CardContent></Card>
                <Card><CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader><CardContent><Skeleton className="h-8 w-1/2" /><Skeleton className="h-4 w-full mt-1" /></CardContent></Card>
            </div>
            <Card>
                <CardHeader><Skeleton className="h-8 w-1/4" /></CardHeader>
                <CardContent><Skeleton className="h-32 w-full" /></CardContent>
            </Card>
        </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="This Month's Total" value={`${totalMonthHours} hrs`} icon={<Calendar className="h-6 w-6 text-muted-foreground" />} description="Total hours recorded" />
        <StatCard title="Active Users" value={String(userCount)} icon={<Users className="h-6 w-6 text-muted-foreground" />} description="Manage users in the users tab" />
      </div>
       <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Recent Attendance</CardTitle>
            <Button asChild size="sm" variant="outline">
                <Link href="/dashboard/attendance">View All <ArrowUpRight className="h-4 w-4 ml-2" /></Link>
            </Button>
        </CardHeader>
        <CardContent>
            <AttendanceTable data={recentAttendance} />
        </CardContent>
       </Card>
    </div>
  );
}
