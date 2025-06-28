"use client";

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
import { HardHat, Printer, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

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

export default function ReportPage() {
  const totalMonthHours = attendanceData.reduce((acc, entry) => acc + parseFloat(entry.totalHours), 0).toFixed(2);

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <header className="flex items-center justify-between mb-8 no-print">
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
            <div className="flex items-center justify-between pb-6 border-b mb-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <HardHat className="h-10 w-10 text-primary" />
                        <h1 className="text-3xl font-bold font-headline">HourHarvester</h1>
                    </div>
                    <p className="text-muted-foreground">Monthly Attendance Report - July 2024</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-muted-foreground">Report Generated:</p>
                    <p className="font-semibold">{new Date().toLocaleDateString()}</p>
                </div>
            </div>

            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Monthly Summary</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-secondary p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground">Employee</p>
                        <p className="text-lg font-semibold">John Doe</p>
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
                    <TableHead>Check In</TableHead>
                    <TableHead>Check Out</TableHead>
                    <TableHead className="text-right">Total Hours</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceData.map((entry) => (
                    <TableRow key={entry.date}>
                      <TableCell className="font-medium">{entry.date}</TableCell>
                      <TableCell>{entry.checkIn}</TableCell>
                      <TableCell>{entry.checkOut}</TableCell>
                      <TableCell className="text-right">{entry.totalHours} hrs</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={3} className="font-bold text-right">Total Monthly Hours</TableCell>
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
