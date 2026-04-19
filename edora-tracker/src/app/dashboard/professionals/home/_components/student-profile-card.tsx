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


};
