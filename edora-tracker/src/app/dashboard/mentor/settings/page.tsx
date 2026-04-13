import React from "react";
import { Separator } from "@/components/ui/separator";
import { MentorSettingsLayout } from "./_components/mentor-settings-layout";

const SettingsPage = () => {
    return (
        <div className="p-6 space-y-6">
            <div className="mb-4">
                <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground text-sm mt-1">
                    Manage your account settings and preferences
                </p>
            </div>

            <Separator className="w-full bg-blue-500 rounded-full" />

            <MentorSettingsLayout />
        </div>
    );
};

export default SettingsPage;