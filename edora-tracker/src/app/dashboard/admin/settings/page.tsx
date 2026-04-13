import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Settings, Shield, Bell, Database, Globe } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function AdminSettingsPage() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Settings className="h-8 w-8 text-primary" />
          Admin Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Configure platform-wide settings and administrative preferences.
        </p>
      </div>

      <Separator className="bg-blue-500" />

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card className="">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Security Settings
            </CardTitle>
            <CardDescription>
              Manage platform security and access control.
            </CardDescription>
          </CardHeader>

        </Card>

        <Card className="">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              System inbox
            </CardTitle>
            <CardDescription>
              Configure alerts for critical system events.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>New User Alerts</Label>
                <p className="text-xs text-muted-foreground">
                  Receive email when a new user signs up.
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Security Breach Alerts</Label>
                <p className="text-xs text-muted-foreground">
                  Immediate notification on suspicious logins.
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            Platform Configuration
          </CardTitle>
          <CardDescription>
            Global settings for the EDORA platform.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4 rounded-xl border p-4 bg-muted/20">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm">Maintenance Mode</Label>
                <p className="text-xs text-muted-foreground">
                  Disable platform access for regular users.
                </p>
              </div>
              <Switch />
            </div>
          </div>
          <div className="space-y-4 rounded-xl border p-4 bg-muted/20">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm">Public Registrations</Label>
                <p className="text-xs text-muted-foreground">
                  Allow anyone to create a new account.
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </CardContent>
        <div className="p-6 pt-0 flex justify-end">
          <Button size="lg" className="rounded-xl shadow-lg shadow-primary/20">
            Save All Changes
          </Button>
        </div>
      </Card>
    </div>
  );
}
