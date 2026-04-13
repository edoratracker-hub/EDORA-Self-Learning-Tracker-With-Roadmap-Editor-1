"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { User, Settings, Bell, Shield, Palette, FileTextIcon } from "lucide-react";
import { SettingsSection } from "./settings-layout";

interface SettingsSidebarProps {
  activeSection: SettingsSection;
  onSectionChange: (section: SettingsSection) => void;
}

const navigationItems = [
  {
    id: "profile" as const,
    label: "Profile",
    icon: User,
    description: "Manage your personal information",
  },
  {
    id: "account" as const,
    label: "Account",
    icon: Settings,
    description: "Email, password and security",
  },
  {
    id: "privacy" as const,
    label: "Privacy",
    icon: Shield,
    description: "Control your privacy settings",
  },
  {
    id: "resume" as const,
    label: "Resume Builder",
    icon: FileTextIcon,
    description: "Build your resume",
  },
];

export function SettingsSidebar({
  activeSection,
  onSectionChange,
}: SettingsSidebarProps) {
  return (
    <div className=" shrink-0 overflow-y-hidden ">
      <nav className="flex items-center justify-between gap-4">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "w-full flex items-start gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors",
                isActive
                  ? "border border-primary text-primary"
                  : "border hover:border-primary",
              )}
            >
              <Icon className="size-5 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <div
                  className={cn(
                    "text-sm font-medium",
                    isActive && "text-foreground",
                  )}
                >
                  {item.label}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                  {item.description}
                </div>
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
