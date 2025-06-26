import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type AttendanceEntry = {
  date: string;
  checkIn: string;
  checkOut: string;
  totalHours: string;
};

interface AttendanceTableProps {
  data: AttendanceEntry[];
}

export function AttendanceTable({ data }: AttendanceTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">Date</TableHead>
            <TableHead>Check In</TableHead>
            <TableHead>Check Out</TableHead>
            <TableHead className="text-right">Total Hours</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((entry) => (
            <TableRow key={entry.date}>
              <TableCell className="font-medium">{entry.date}</TableCell>
              <TableCell>{entry.checkIn}</TableCell>
              <TableCell>{entry.checkOut}</TableCell>
              <TableCell className="text-right">
                <Badge variant="secondary">{entry.totalHours} hrs</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
