
"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Trash2, PlusCircle } from "lucide-react";
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
import { AddOtDialog } from "./attendance/add-ot-dialog";
import { isToday } from "date-fns";

export type AttendanceEntry = {
  id: string;
  date: string;
  checkIn: string;
  checkOut: string;
  totalHours: string;
  otHours: string;
};

interface AttendanceTableProps {
  data: AttendanceEntry[];
  onRecordDeleted?: () => void;
}

export function AttendanceTable({ data, onRecordDeleted }: AttendanceTableProps) {
  const { toast } = useToast();
  const [isOtDialogOpen, setIsOtDialogOpen] = useState(false);
  const [selectedAttendanceId, setSelectedAttendanceId] = useState<string | null>(null);

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

  const handleAddOtClick = (attendanceId: string) => {
    setSelectedAttendanceId(attendanceId);
    setIsOtDialogOpen(true);
  }
  
  const now = new Date();
  const currentHour = now.getHours();
  const isOtTime = currentHour >= 18 && currentHour < 24;

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Date</TableHead>
              <TableHead className="hidden sm:table-cell">Check In</TableHead>
              <TableHead className="hidden sm:table-cell">Check Out</TableHead>
              <TableHead className="text-right">Total Hours</TableHead>
              <TableHead className="text-right">OT Hours</TableHead>
              <TableHead className="w-[100px] text-center">Add OT</TableHead>
              {onRecordDeleted && <TableHead className="w-[100px] text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((entry) => {
              const isEntryToday = isToday(new Date(entry.date));
              const isCheckedOut = entry.checkOut !== '—';
              const showOtButton = isEntryToday && isOtTime && isCheckedOut;
              
              return (
              <TableRow key={entry.id}>
                <TableCell className="font-medium">{entry.date}</TableCell>
                <TableCell className="hidden sm:table-cell">{entry.checkIn}</TableCell>
                <TableCell className="hidden sm:table-cell">{entry.checkOut}</TableCell>
                <TableCell className="text-right">
                  <Badge variant="secondary">{entry.totalHours} hrs</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant="outline">{entry.otHours} hrs</Badge>
                </TableCell>
                 <TableCell className="text-center">
                    {showOtButton ? (
                      <Button variant="outline" size="sm" onClick={() => handleAddOtClick(entry.id)}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add
                      </Button>
                    ) : (
                       <span className="text-xs text-muted-foreground">Unavailable</span>
                    )}
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
            )})}
          </TableBody>
        </Table>
      </div>
      {selectedAttendanceId && (
        <AddOtDialog
          isOpen={isOtDialogOpen}
          setIsOpen={setIsOtDialogOpen}
          attendanceId={selectedAttendanceId}
          onOtAdded={() => {
            if (onRecordDeleted) onRecordDeleted();
            setSelectedAttendanceId(null);
          }}
        />
      )}
    </>
  );
}
