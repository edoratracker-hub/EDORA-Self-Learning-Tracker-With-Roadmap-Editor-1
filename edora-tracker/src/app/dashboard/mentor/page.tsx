"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function MentorDashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home page
    router.replace("/dashboard/mentor/home");
  }, [router]);

  return (
    <div className="flex h-[50vh] w-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}
