"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HardHat, Users, Clock, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/attendance", icon: Clock, label: "Attendance" },
  { href: "/dashboard/users", icon: Users, label: "Users" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-60 flex-col border-r bg-background sm:flex">
        <div className="flex h-16 items-center border-b px-6">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                <HardHat className="h-6 w-6 text-primary" />
                <span className="text-foreground">HourHarvester</span>
            </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-4 text-sm font-medium">
                {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                    pathname.startsWith(item.href) && item.href !== '/dashboard' && "bg-accent text-accent-foreground hover:text-accent-foreground",
                    pathname === item.href && item.href === '/dashboard' && "bg-accent text-accent-foreground hover:text-accent-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
        </div>
    </aside>
  );
}
