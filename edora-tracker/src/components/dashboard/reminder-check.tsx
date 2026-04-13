"use client";

import { useEffect } from "react";
import { checkAndSendTodayReminders } from "@/app/actions/calendar-actions";

export function ReminderCheck() {
  useEffect(() => {
    // Only run if it's "morning" (e.g., first login of the day)
    // We could store the last check date in localStorage to avoid redundant calls
    const lastCheck = localStorage.getItem("last_reminder_check");
    const today = new Date().toDateString();

    if (lastCheck !== today) {
      checkAndSendTodayReminders().then((res) => {
        if (res.success) {
          localStorage.setItem("last_reminder_check", today);
        }
      });
    }
  }, []);

  return null;
}
