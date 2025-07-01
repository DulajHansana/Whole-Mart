"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, LogIn, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { checkIn, checkOut, getLatestAttendanceRecord } from "@/app/actions/attendance.actions";

export function TimeClock() {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [currentAttendanceId, setCurrentAttendanceId] = useState<string | null>(null);
  const [lastActionTime, setLastActionTime] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchLatestRecord = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      };
      setIsLoading(true);
      const result = await getLatestAttendanceRecord(user.id);
      if (result.success && result.data) {
        // If there's a record and it doesn't have a checkOut time, user is checked in
        if (!result.data.checkOut) {
          setIsCheckedIn(true);
          setCurrentAttendanceId(result.data.id);
          setLastActionTime(new Date(result.data.checkIn));
        } else {
          setIsCheckedIn(false);
          setCurrentAttendanceId(null);
        }
      } else if (!result.success) {
        toast({ title: "Error", description: result.message, variant: "destructive" });
      } else {
        // No records found, so they are checked out.
        setIsCheckedIn(false);
        setCurrentAttendanceId(null);
      }
      setIsLoading(false);
    };

    fetchLatestRecord();
  }, [user, toast]);

  const handleToggle = async () => {
    if (!user) {
      toast({ title: "Error", description: "You must be logged in.", variant: "destructive" });
      return;
    }

    setIsLoading(true);

    if (isCheckedIn) {
      // User is checking out
      if (!currentAttendanceId) return;
      const result = await checkOut(currentAttendanceId);
      if (result.success && result.data) {
        setIsCheckedIn(false);
        setLastActionTime(new Date(result.data.checkOut!));
        setCurrentAttendanceId(null);
        toast({ title: "Successfully Checked Out", description: "Your status has been updated." });
      } else {
        toast({ title: "Error", description: result.message, variant: "destructive" });
      }
    } else {
      // User is checking in
      const result = await checkIn(user.id);
      if (result.success && result.data) {
        setIsCheckedIn(true);
        setCurrentAttendanceId(result.data.id);
        setLastActionTime(new Date(result.data.checkIn));
        toast({ title: "Successfully Checked In", description: "Your status has been updated." });
      } else {
        toast({ title: "Error", description: result.message, variant: "destructive" });
      }
    }
    setIsLoading(false);
    // Reload the page to reflect changes everywhere.
    window.location.reload();
  };

  const buttonText = isCheckedIn ? "Check Out" : "Check In";
  const ButtonIcon = isCheckedIn ? LogOut : LogIn;
  const statusText = isCheckedIn ? "You are checked in." : "You are checked out.";

  return (
    <Card className="flex flex-col justify-between shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-6 w-6 text-muted-foreground" />
          Time Clock
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center text-center space-y-4 flex-1">
        <div className="space-y-1">
          <p className="text-xl sm:text-2xl font-semibold">{isLoading ? 'Loading...' : statusText}</p>
          {lastActionTime && !isLoading && (
            <p className="text-sm text-muted-foreground">
              Last action at: {lastActionTime.toLocaleTimeString()}
            </p>
          )}
        </div>
        <Button
          onClick={handleToggle}
          size="lg"
          disabled={isLoading || !user}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 transform hover:scale-105"
        >
          <ButtonIcon className="mr-2 h-5 w-5" />
          {isLoading ? 'Please wait...' : buttonText}
        </Button>
      </CardContent>
    </Card>
  );
}
