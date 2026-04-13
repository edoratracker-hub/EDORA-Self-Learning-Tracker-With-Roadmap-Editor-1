"use client";

import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangleIcon, X, XIcon } from "lucide-react";
import Link from "next/link";

export const StudentProfileCard = () => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) {
    return null;
  }

  return (
    <Alert className="relative border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50">
      <AlertTriangleIcon />
      <AlertTitle>Profile Setup Incomplete</AlertTitle>
      <AlertDescription>
        Complete your profile to unlock personalized recommendations and get the
        most out of your learning experience.
      </AlertDescription>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-6 w-6 text-amber-900 hover:bg-amber-100 dark:text-amber-50 dark:hover:bg-amber-900"
        onClick={() => setIsDismissed(true)}
        aria-label="Dismiss alert"
      >
        <XIcon className="h-4 w-4" />
      </Button>

      <div className="mt-4 ">
        <Button className="" asChild>
          <Link href="/dashboard/professionals/onboarding">
            Complete Profile
          </Link>
        </Button>
      </div>
    </Alert>
  );
};
