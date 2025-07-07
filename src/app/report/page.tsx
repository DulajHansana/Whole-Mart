
"use client";

import { useState, useEffect, cloneElement, ReactElement, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { Printer, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useSettings } from "@/components/providers/settings-provider";
import { useAuth } from '@/hooks/use-auth';
import { getAttendanceRecords } from '@/app/actions/attendance.actions';
import { format, parseISO, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import type { IAttendance } from '@/models/Attendance';

type RawAttendanceData = Omit<IAttendance, '_id' | 'userId'> & { id: string, userId: string, checkIn: string, checkOut?: string, totalHours?: number, otHours?: number };

export default function ReportPage() {
  const { appName, LogoComponent, hourlyRate, otHourlyRate } = useSettings();
  const { user } = useAuth();
  const [attendanceData, setAttendanceData] = useState<RawAttendanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState<'monthly' | 'weekly'>('monthly');

  useEffect(() => {
    async function fetchAttendance() {
      if (!user) return;
      setLoading(true);
      const result = await getAttendanceRecords(user.id);
      if (result.success && result.data) {
        setAttendanceData(result.data as RawAttendanceData[]);
      }
      setLoading(false);
    }
    fetchAttendance();
  }, [user]);

  const filteredData = useMemo(() => {
    const now = new Date();
    if (reportType === 'weekly') {
      const start = startOfWeek(now, { weekStartsOn: 1 });
      const end = endOfWeek(now, { weekStartsOn: 1 });
      return attendanceData.filter(record => 
          record.checkIn && isWithinInterval(parseISO(record.checkIn), { start, end })
      );
    } else { // monthly
      const start = startOfMonth(now);
      const end = endOfMonth(now);
      return attendanceData.filter(record => 
          record.checkIn && isWithinInterval(parseISO(record.checkIn), { start, end })
      );
    }
  }, [attendanceData, reportType]);

  const totalPeriodHours = useMemo(() => 
    filteredData.reduce((acc, entry) => acc + (entry.totalHours || 0), 0),
    [filteredData]
  );
  
  const totalOtHours = useMemo(() =>
    filteredData.reduce((acc, entry) => acc + (entry.otHours || 0), 0),
    [filteredData]
  );
  
  const totalSalary = useMemo(() => {
    const regularSalary = totalPeriodHours * hourlyRate;
    const otSalary = totalOtHours * otHourlyRate;
    return (regularSalary + otSalary).toFixed(2);
  }, [totalPeriodHours, totalOtHours, hourlyRate, otHourlyRate]);
  
  const totalPeriodHoursFormatted = totalPeriodHours.toFixed(2);
  const totalOtHoursFormatted = totalOtHours.toFixed(2);

  const formattedData = useMemo(() => filteredData.map(record => {
    const regularHours = record.totalHours || 0;
    const otHours = record.otHours || 0;
    const regularSalary = regularHours * hourlyRate;
    const otSalary = otHours * otHourlyRate;
    const totalEntrySalary = (regularSalary + otSalary).toFixed(2);
    
    return {
      date: format(parseISO(record.checkIn), 'yyyy-MM-dd'),
      checkIn: record.checkIn ? format(parseISO(record.checkIn), 'p') : '—',
      checkOut: record.checkOut ? format(parseISO(record.checkOut), 'p') : '—',
      totalHours: regularHours.toFixed(2),
      otHours: otHours.toFixed(2),
      salary: `LKR ${totalEntrySalary}`,
    };
  }), [filteredData, hourlyRate, otHourlyRate]);

  const reportTitle = useMemo(() => {
    const now = new Date();
    if (reportType === 'weekly') {
      const start = startOfWeek(now, { weekStartsOn: 1 });
      const end = endOfWeek(now, { weekStartsOn: 1 });
      return `Weekly Attendance Report - ${format(start, 'MMM d')} to ${format(end, 'MMM d, yyyy')}`;
    }
    return `Monthly Attendance Report - ${format(new Date(), 'MMMM yyyy')}`;
  }, [reportType]);
    
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <Skeleton className="h-10 w-48 mb-8" />
        <Card>
            <CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader>
            <CardContent><Skeleton className="h-64 w-full" /></CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <header className="flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-between gap-4 mb-8 no-print">
          <Button variant="outline" asChild>
            <Link href="/dashboard/attendance">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Attendance
            </Link>
          </Button>
          <Button onClick={() => window.print()} className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Printer className="mr-2 h-4 w-4" />
            Print Report
          </Button>
        </header>

        <main className="bg-card p-8 rounded-lg shadow-sm border">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b mb-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        {LogoComponent && cloneElement(LogoComponent as ReactElement, { className: "h-10 w-10 text-primary" })}
                        <h1 className="text-2xl sm:text-3xl font-bold font-headline">{appName}</h1>
                    </div>
                    <p className="text-muted-foreground">{reportTitle}</p>
                </div>
                <div className="text-left sm:text-right">
                    <p className="text-sm text-muted-foreground">Report Generated:</p>
                    <p className="font-semibold">{new Date().toLocaleDateString()}</p>
                </div>
            </div>

            <div className="flex justify-between items-center mb-8 no-print">
              <h2 className="text-lg font-semibold capitalize">{reportType} Report Summary</h2>
              <div className="flex gap-2">
                  <Button onClick={() => setReportType('weekly')} variant={reportType === 'weekly' ? 'default' : 'outline'}>Weekly</Button>
                  <Button onClick={() => setReportType('monthly')} variant={reportType === 'monthly' ? 'default' : 'outline'}>Monthly</Button>
              </div>
            </div>

            <div className="mb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-secondary p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground">Employee</p>
                        <p className="text-lg font-semibold">{user?.fullName || 'Employee'}</p>
                    </div>
                     <div className="bg-secondary p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground">Regular Hours</p>
                        <p className="text-lg font-semibold">{totalPeriodHoursFormatted} hrs</p>
                    </div>
                     <div className="bg-secondary p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground">OT Hours</p>
                        <p className="text-lg font-semibold">{totalOtHoursFormatted} hrs</p>
                    </div>
                     <div className="bg-secondary p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground">Total Salary for Period</p>
                        <p className="text-lg font-semibold">LKR {totalSalary}</p>
                    </div>
                </div>
            </div>
            
            <h2 className="text-xl font-semibold mb-4">Detailed Log</h2>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">Date</TableHead>
                    <TableHead className="hidden sm:table-cell">Check In</TableHead>
                    <TableHead className="hidden sm:table-cell">Check Out</TableHead>
                    <TableHead className="text-right">Regular Hours</TableHead>
                    <TableHead className="text-right">OT Hours</TableHead>
                    <TableHead className="text-right">Total Salary</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {formattedData.length > 0 ? (
                    formattedData.map((entry, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{entry.date}</TableCell>
                        <TableCell className="hidden sm:table-cell">{entry.checkIn}</TableCell>
                        <TableCell className="hidden sm:table-cell">{entry.checkOut}</TableCell>
                        <TableCell className="text-right">{entry.totalHours} hrs</TableCell>
                        <TableCell className="text-right">{entry.otHours} hrs</TableCell>
                        <TableCell className="text-right">{entry.salary}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No attendance records for this period.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={3} className="font-bold text-right">Total for Period</TableCell>
                        <TableCell className="text-right font-bold">
                          <Badge variant="secondary" className="text-base">{totalPeriodHoursFormatted} hrs</Badge>
                        </TableCell>
                         <TableCell className="text-right font-bold">
                          <Badge variant="outline" className="text-base">{totalOtHoursFormatted} hrs</Badge>
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          <Badge variant="default" className="text-base">LKR {totalSalary}</Badge>
                        </TableCell>
                    </TableRow>
                </TableFooter>
              </Table>
            </div>
        </main>
      </div>
    </div>
  );
}
