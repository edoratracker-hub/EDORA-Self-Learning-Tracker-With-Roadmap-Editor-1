"use client";

import { useState } from "react";
import { SettingsSidebar } from "./settings-sidebar";
import { ProfileSettings } from "./profile-settings";
import { AccountSettings } from "./account-settings";
import { PrivacySettings } from "./privacy-settings";
import { ResumeBuilder } from "../../../resume/resume-builder";

export type SettingsSection =
    | "profile"
    | "account"
    | "privacy"
    | "resume"

export function MentorSettingsLayout() {
    const [activeSection, setActiveSection] =
        useState<SettingsSection>("profile");

    const renderSection = () => {
        switch (activeSection) {
            case "profile":
                return <ProfileSettings />;
            case "account":
                return <AccountSettings />;
            case "privacy":
                return <PrivacySettings />;
            case "resume":
                return <ResumeBuilder />;
            default:
                return <ProfileSettings />;
        }
    };

    return (
        <div className="flex flex-col space-y-6">
            <div className=" ">
                <SettingsSidebar
                    activeSection={activeSection}
                    onSectionChange={setActiveSection}
                />
            </div>

            <main className="w-full">
                <div className="">{renderSection()}</div>
            </main>
        </div>
    );
}
