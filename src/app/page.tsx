
"use client";

import { LoginForm } from "@/components/auth/login-form";
import { useSettings } from "@/components/providers/settings-provider";
import { cloneElement, ReactElement, useEffect } from "react";
import { useTheme } from "next-themes";

export default function Home() {
  const { appName, LogoComponent } = useSettings();
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme("light");
  }, [setTheme]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <div className="flex items-center gap-4 mb-8">
        {LogoComponent && cloneElement(LogoComponent as ReactElement, { className: "h-12 w-12 text-primary" })}
        <h1 className="text-3xl font-bold font-headline text-foreground sm:text-4xl">
          {appName}
        </h1>
      </div>
      <LoginForm />
    </main>
  );
}
