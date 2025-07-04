
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { deleteAttendanceRecord } from "@/app/actions/attendance.actions";

export type AttendanceEntry = {
  id: string;
  date: string;
  checkIn: string;
  checkOut: string;
  totalHours: string;
};

interface AttendanceTableProps {
  data: AttendanceEntry[];
  onRecordDeleted?: () => void;
}

export function AttendanceTable({ data, onRecordDeleted }: AttendanceTableProps) {
  const { toast } = useToast();

  const handleRemove = async (attendanceId: string) => {
    const result = await deleteAttendanceRecord(attendanceId);
    if (result.success) {
      toast({
        title: "Record Removed",
        description: `The attendance record has been removed.`,
      });
      onRecordDeleted?.();
    } else {
        toast({
          title: "Error",
          description: result.message || "Failed to remove record.",
          variant: "destructive"
        });
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">Date</TableHead>
            <TableHead className="hidden sm:table-cell">Check In</TableHead>
            <TableHead className="hidden sm:table-cell">Check Out</TableHead>
            <TableHead className="text-right">Total Hours</TableHead>
            {onRecordDeleted && <TableHead className="w-[100px] text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell className="font-medium">{entry.date}</TableCell>
              <TableCell className="hidden sm:table-cell">{entry.checkIn}</TableCell>
              <TableCell className="hidden sm:table-cell">{entry.checkOut}</TableCell>
              <TableCell className="text-right">
                <Badge variant="secondary">{entry.totalHours} hrs</Badge>
              </TableCell>
              {onRecordDeleted && (
                 <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => handleRemove(entry.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Remove</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
