"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useSettings, availableIcons, AvailableIconName } from "@/components/providers/settings-provider";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { appName, setAppName, appLogo, setAppLogo } = useSettings();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>About {appName}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Whole Mart is a trusted and modern supermarket located in the heart of Homagama. We offer a wide range of fresh groceries, household essentials, and daily needs at affordable prices. With a focus on quality, convenience, and friendly service, Whole Mart is your one-stop destination for everyday shopping in town.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>
            Manage common settings for the application.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="store-name">Store Name</Label>
            <Input 
              id="store-name" 
              value={appName} 
              onChange={(e) => setAppName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Application Logo</Label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 rounded-lg border p-4">
              {(Object.keys(availableIcons) as Array<AvailableIconName>).map((iconName) => {
                const Icon = availableIcons[iconName];
                return (
                  <button 
                    key={iconName}
                    onClick={() => setAppLogo(iconName)}
                    className={cn(
                      "flex flex-col items-center justify-center gap-2 p-2 rounded-md border-2 transition-colors",
                      appLogo === iconName ? "border-primary bg-primary/10" : "border-transparent hover:border-muted-foreground/50"
                    )}
                    aria-label={`Select ${iconName} logo`}
                  >
                    <Icon className="h-8 w-8 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{iconName}</span>
                  </button>
                )
              })}
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="dark-mode" className="text-base">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Enable or disable dark mode for the dashboard.
                </p>
              </div>
              <Switch id="dark-mode" />
          </div>
           <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications" className="text-base">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive email notifications for important events.
                </p>
              </div>
              <Switch id="email-notifications" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
