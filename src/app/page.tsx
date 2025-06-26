import { LoginForm } from "@/components/auth/login-form";
import { HardHat } from "lucide-react";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <div className="flex items-center gap-4 mb-8">
        <HardHat className="h-12 w-12 text-primary" />
        <h1 className="text-4xl font-bold font-headline text-foreground">
          HourHarvester
        </h1>
      </div>
      <LoginForm />
    </main>
  );
}
