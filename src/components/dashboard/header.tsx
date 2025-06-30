"use client";

import { Menu, Users, Clock, LayoutDashboard, Settings } from "lucide-react";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";
import { useSettings } from "@/components/providers/settings-provider";
import { cloneElement } from "react";
import { UserNav } from "./user-nav";

const pageTitles: { [key: string]: string } = {
    '/dashboard': 'Dashboard',
    '/dashboard/attendance': 'Attendance Management',
    '/dashboard/users': 'User Management',
    '/dashboard/settings': 'Settings',
    '/dashboard/profile': 'My Profile',
    '/report': 'Attendance Report'
}

export function AppHeader() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { appName, LogoComponent } = useSettings();
  
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
       <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/dashboard"
              className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
            >
              {LogoComponent && cloneElement(LogoComponent as any, { className: "h-5 w-5 transition-all group-hover:scale-110" })}
              <span className="sr-only">{appName}</span>
            </Link>
            <Link href="/dashboard" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
              <LayoutDashboard className="h-5 w-5" />
              Dashboard
            </Link>
            <Link href="/dashboard/attendance" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
              <Clock className="h-5 w-5" />
              Attendance
            </Link>
            {user?.role === 'Owner' && (
              <>
                <Link href="/dashboard/users" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
                    <Users className="h-5 w-5" />
                    Users
                </Link>
                <Link href="/dashboard/settings" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
                    <Settings className="h-5 w-5" />
                    Settings
                </Link>
              </>
            )}
          </nav>
        </SheetContent>
      </Sheet>
      
      <div className="flex-1">
        <h1 className="font-semibold text-lg">{pageTitles[pathname] || 'Dashboard'}</h1>
      </div>

      <UserNav />
    </header>
  );
}
