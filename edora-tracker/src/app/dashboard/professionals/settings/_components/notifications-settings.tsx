"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface NotificationItem {
  id: string;
  label: string;
  description: string;
  email: boolean;
  push: boolean;
}

export function inboxSettings() {
  const [inbox, setinbox] = React.useState<NotificationItem[]>([
    {
      id: "interviews",
      label: "Interview Reminders",
      description:
        "Get notified about upcoming interviews and schedule changes",
      email: true,
      push: true,
    },
    {
      id: "applications",
      label: "Application Updates",
      description: "Receive updates when your application status changes",
      email: true,
      push: false,
    },
    {
      id: "messages",
      label: "Messages",
      description: "Get notified when you receive a new message",
      email: true,
      push: true,
    },
    {
      id: "recommendations",
      label: "Job Recommendations",
      description:
        "Receive personalized job recommendations based on your profile",
      email: false,
      push: false,
    },
    {
      id: "weekly",
      label: "Weekly Digest",
      description: "Get a weekly summary of your activity and opportunities",
      email: true,
      push: false,
    },
  ]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Email inbox</CardTitle>
          <CardDescription>
            Configure which inbox you'd like to receive via email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {inbox.map((item, index) => (
              <React.Fragment key={item.id}>
                {index > 0 && <Separator />}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <Label
                      htmlFor={`email-${item.id}`}
                      className="font-medium cursor-pointer"
                    >
                      {item.label}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`email-${item.id}`}
                        checked={item.email}
                        onCheckedChange={(checked) => {
                          setinbox(
                            inbox.map((n) =>
                              n.id === item.id
                                ? { ...n, email: checked as boolean }
                                : n,
                            ),
                          );
                        }}
                      />
                      <Label
                        htmlFor={`email-${item.id}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        Email
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`push-${item.id}`}
                        checked={item.push}
                        onCheckedChange={(checked) => {
                          setinbox(
                            inbox.map((n) =>
                              n.id === item.id
                                ? { ...n, push: checked as boolean }
                                : n,
                            ),
                          );
                        }}
                      />
                      <Label
                        htmlFor={`push-${item.id}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        Push
                      </Label>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Do Not Disturb</CardTitle>
          <CardDescription>
            Set quiet hours when you don't want to receive inbox
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="dnd" className="font-medium">
                  Enable Do Not Disturb
                </Label>
                <p className="text-sm text-muted-foreground">
                  Mute all inbox during specified hours
                </p>
              </div>
              <Checkbox id="dnd" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline">Reset to Default</Button>
        <Button>Save Preferences</Button>
      </div>
    </div>
  );
}
