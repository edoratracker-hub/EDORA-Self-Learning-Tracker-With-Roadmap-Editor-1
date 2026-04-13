"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Building2,
  MapPin,
  DollarSign,
  Clock,
  Globe,
  Eye,
  Calendar,
  Briefcase,
  GraduationCap,
  Users,
  CheckCircle2,
  Sparkles,
  Layers,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Job } from "@/app/hooks/use-job-detail";

interface JobDetailsCardProps {
  job: Job;
}

export function JobDetailsCard({ job }: JobDetailsCardProps) {
  const formatSalary = () => {
    if (!job.salaryMin && !job.salaryMax) return "Negotiable";
    const symbol = job.currency === "INR" ? "₹" : "$";
    if (job.salaryMin && job.salaryMax) {
      return `${symbol}${job.salaryMin.toLocaleString()} - ${symbol}${job.salaryMax.toLocaleString()}`;
    }
    if (job.salaryMin) return `${symbol}${job.salaryMin.toLocaleString()}+`;
    if (job.salaryMax)
      return `Up to ${symbol}${job.salaryMax.toLocaleString()}`;
    return "Negotiable";
  };

  return (
    <Card className="border-border/60 shadow-sm">
      <div className="p-6 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge
                variant={job.status === "open" ? "default" : "secondary"}
                className="h-5 px-2 text-[10px] uppercase tracking-wider font-semibold rounded-md"
              >
                {job.status}
              </Badge>
              <div className="h-4 w-px bg-border/60 mx-1" />
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" /> {job.views || 0}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" /> {job.totalApplicants || 0}{" "}
                  applicants
                </span>
              </div>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {job.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5 text-foreground/80">
                <Building2 className="h-3.5 w-3.5 text-primary" />
                <span className="font-medium">
                  {job.organization?.companyName || "Organization"}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                <span>
                  Posted{" "}
                  {formatDistanceToNow(new Date(job.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 md:justify-end md:max-w-sm">
            {[
              {
                icon: MapPin,
                label: job.location || "Remote",
              },
              {
                icon: DollarSign,
                label: formatSalary(),
              },
              {
                icon: Briefcase,
                label: job.jobType || "Full-time",
                capitalize: true,
              },
              {
                icon: Globe,
                label: job.workMode || "On-site",
                capitalize: true,
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded border bg-muted/20 text-muted-foreground text-xs font-medium ${item.capitalize ? "capitalize" : ""
                  }`}
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
