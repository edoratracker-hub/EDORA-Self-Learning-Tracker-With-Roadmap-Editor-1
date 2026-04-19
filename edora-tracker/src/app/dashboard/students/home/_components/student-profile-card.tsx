"use client";

import { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangleIcon, XIcon } from "lucide-react";
import Link from "next/link";

export const StudentProfileCard = () => {
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Automatically close the alert after 5 seconds (5000ms)
    const timer = setTimeout(() => {
      setIsDismissed(true);
    }, 5000);

    // Cleanup the timer if the component unmounts or is manually dismissed
    return () => clearTimeout(timer);
  }, []);

  if (isDismissed) {
    return null;
  }


};
