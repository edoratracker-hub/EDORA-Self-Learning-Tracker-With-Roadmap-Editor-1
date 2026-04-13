"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Download } from "lucide-react";

export function PrivacySettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Visibility</CardTitle>
          <CardDescription>
            Control who can view your profile and information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="publicProfile" className="font-medium">
                  Public Profile
                </Label>
                <p className="text-sm text-muted-foreground">
                  Make your profile visible to everyone on the platform
                </p>
              </div>
              <Checkbox id="publicProfile" defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="showEmail" className="font-medium">
                  Show Email
                </Label>
                <p className="text-sm text-muted-foreground">
                  Display your email address on your profile
                </p>
              </div>
              <Checkbox id="showEmail" />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="showLocation" className="font-medium">
                  Show Location
                </Label>
                <p className="text-sm text-muted-foreground">
                  Display your location on your profile
                </p>
              </div>
              <Checkbox id="showLocation" defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Activity Status</CardTitle>
          <CardDescription>
            Choose who can see when you're active
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="activityStatus" className="font-medium">
                  Show Activity Status
                </Label>
                <p className="text-sm text-muted-foreground">
                  Let others see when you're online
                </p>
              </div>
              <Checkbox id="activityStatus" defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Search Engine Indexing</CardTitle>
          <CardDescription>
            Control whether search engines can index your profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="searchIndexing" className="font-medium">
                  Allow Search Engine Indexing
                </Label>
                <p className="text-sm text-muted-foreground">
                  Let search engines like Google index your public profile
                </p>
              </div>
              <Checkbox id="searchIndexing" defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data & Privacy</CardTitle>
          <CardDescription>
            Manage your data and privacy preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">Download Your Data</p>
                <p className="text-sm text-muted-foreground">
                  Get a copy of all your data stored on our platform
                </p>
              </div>
              <Button variant="outline" size="sm">
                <Download className="size-4 mr-2" />
                Download
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="analytics" className="font-medium">
                  Usage Analytics
                </Label>
                <p className="text-sm text-muted-foreground">
                  Help us improve by sharing anonymous usage data
                </p>
              </div>
              <Checkbox id="analytics" defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="marketing" className="font-medium">
                  Marketing Communications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive promotional emails and updates about new features
                </p>
              </div>
              <Checkbox id="marketing" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline">Cancel</Button>
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}
