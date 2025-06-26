"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, LogIn, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function TimeClock() {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [lastActionTime, setLastActionTime] = useState<Date | null>(null);
  const { toast } = useToast();

  const handleToggle = () => {
    const newStatus = !isCheckedIn;
    setIsCheckedIn(newStatus);
    setLastActionTime(new Date());

    toast({
      title: `Successfully ${newStatus ? 'Checked In' : 'Checked Out'}`,
      description: `Your status has been updated.`,
    });
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
            <p className="text-2xl font-semibold">{statusText}</p>
            {lastActionTime && (
                <p className="text-sm text-muted-foreground">
                    Last action at: {lastActionTime.toLocaleTimeString()}
                </p>
            )}
        </div>
        <Button
          onClick={handleToggle}
          size="lg"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 transform hover:scale-105"
        >
          <ButtonIcon className="mr-2 h-5 w-5" />
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
}
