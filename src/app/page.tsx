"use client";

import { LoginForm } from "@/components/auth/login-form";
import { useSettings } from "@/components/providers/settings-provider";
import { cloneElement } from "react";

export default function Home() {
  const { appName, LogoComponent } = useSettings();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <div className="flex items-center gap-4 mb-8">
        {LogoComponent && cloneElement(LogoComponent as any, { className: "h-12 w-12 text-primary" })}
        <h1 className="text-4xl font-bold font-headline text-foreground">
          {appName}
        </h1>
      </div>
      <LoginForm />
    </main>
  );
}
