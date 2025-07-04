
"use client";

import { useState, useEffect, cloneElement, ReactElement } from 'react';
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
import { format, parseISO } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { IAttendance } from '@/models/Attendance';

type RawAttendanceData = Omit<IAttendance, '_id' | 'userId'> & { id: string, userId: string, checkIn: string, checkOut?: string };

export default function ReportPage() {
  const { appName, LogoComponent } = useSettings();
  const { user } = useAuth();
  const [attendanceData, setAttendanceData] = useState<RawAttendanceData[]>([]);
  const [loading, setLoading] = useState(true);

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

  const formattedData = attendanceData.map(record => ({
    date: format(parseISO(record.checkIn), 'yyyy-MM-dd'),
    checkIn: format(parseISO(record.checkIn), 'p'),
    checkOut: record.checkOut ? format(parseISO(record.checkOut), 'p') : '—',
    totalHours: record.totalHours?.toFixed(2) ?? '0.00',
  }));

  const totalMonthHours = attendanceData
    .reduce((acc, entry) => acc + (entry.totalHours || 0), 0)
    .toFixed(2);
    
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
                    <p className="text-muted-foreground">Monthly Attendance Report - {format(new Date(), 'MMMM yyyy')}</p>
                </div>
                <div className="text-left sm:text-right">
                    <p className="text-sm text-muted-foreground">Report Generated:</p>
                    <p className="font-semibold">{new Date().toLocaleDateString()}</p>
                </div>
            </div>

            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Monthly Summary</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-secondary p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground">Employee</p>
                        <p className="text-lg font-semibold">{user?.fullName || 'Employee'}</p>
                    </div>
                     <div className="bg-secondary p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground">Total Hours</p>
                        <p className="text-lg font-semibold">{totalMonthHours} hrs</p>
                    </div>
                </div>
            </div>
            
            <h2 className="text-xl font-semibold mb-4">Detailed Log</h2>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">Date</TableHead>
                    <TableHead className="hidden sm:table-cell">Check In</TableHead>
                    <TableHead className="hidden sm:table-cell">Check Out</TableHead>
                    <TableHead className="text-right">Total Hours</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {formattedData.map((entry, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{entry.date}</TableCell>
                      <TableCell className="hidden sm:table-cell">{entry.checkIn}</TableCell>
                      <TableCell className="hidden sm:table-cell">{entry.checkOut}</TableCell>
                      <TableCell className="text-right">{entry.totalHours} hrs</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={3} className="hidden sm:table-cell font-bold text-right">Total Monthly Hours</TableCell>
                        <TableCell colSpan={1} className="sm:hidden font-bold text-right">Total</TableCell>
                        <TableCell className="text-right font-bold">
                          <Badge variant="default" className="text-base">{totalMonthHours} hrs</Badge>
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
