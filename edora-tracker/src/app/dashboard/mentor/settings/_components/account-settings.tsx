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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Key, Mail, Trash2 } from "lucide-react";
import { authClient } from "@/app/lib/auth-client";

export function AccountSettings() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const userEmail = user?.email ?? "";
  const emailVerified = user?.emailVerified ?? false;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <Card>
          <CardHeader>
            <CardTitle>Email Address</CardTitle>
            <CardDescription>
              Your primary email for account inbox
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">
                      {userEmail || "No email set"}
                    </p>
                    <p className="text-xs text-muted-foreground">Primary email</p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={
                    emailVerified
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-yellow-50 text-yellow-700 border-yellow-200"
                  }
                >
                  {emailVerified ? "Verified" : "Unverified"}
                </Badge>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="newEmail">Change Email</Label>
                <div className="flex gap-2">
                  <Input
                    id="newEmail"
                    type="email"
                    placeholder="newemail@example.com"
                  />
                  <Button variant="outline">Update</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>


      </div>

      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible actions for your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">Delete Account</p>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all associated data
                </p>
              </div>
              <Button
                variant="outline"
                className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <Trash2 className="size-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
