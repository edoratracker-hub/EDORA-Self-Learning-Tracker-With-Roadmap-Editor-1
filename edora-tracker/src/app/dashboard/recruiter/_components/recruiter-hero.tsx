"use client";

import { Button } from "@/components/ui/button";
import {
  PlusIcon,
  Users,
  Briefcase,
  TrendingUp,
  CalendarCogIcon,
  CalendarClockIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useJobOpportunities } from "@/app/hooks/use-job-opportunities";
import { RecruiterOrganizationInfo } from "./recruiter-organization-info";
import { JobVacancyForm } from "../_forms/job-vaccancy-form";

export function RecruiterHero() {
  const { data, isLoading } = useJobOpportunities();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {isLoading ? (
            <Skeleton className="h-14 w-48 rounded-lg" />
          ) : data?.organization ? (
            <RecruiterOrganizationInfo organization={data.organization} />
          ) : null}
        </div>

        <div className="flex justify-end gap-3">
          {/* Post Job Button */}
          <JobVacancyForm>
            <Button className="shadow-sm">
              <PlusIcon className="h-4 w-4" />
              Post New Job
            </Button>
          </JobVacancyForm>

          <Button asChild variant="outline">
            <Link href="/dashboard/recruiter/calendar">
              <CalendarClockIcon className="h-4 w-4" />
              Calendar
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Stats Row - SaaS Standard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {isLoading ? (
          <>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </>
        ) : (
          <>
            <StatsCard
              label="Active Jobs"
              value={data?.stats?.activeJobs?.toString() || "0"}
              icon={Briefcase}
              trend="Live postings"
            />
            <StatsCard
              label="Total Applicants"
              value={data?.stats?.totalApplicants?.toLocaleString() || "0"}
              icon={Users}
              trend="Across all jobs"
            />
            <StatsCard
              label="Total Interviews"
              value={data?.stats?.totalInterviews?.toString() || "0"}
              icon={TrendingUp}
              trend="Scheduled/Completed"
            />
          </>
        )}
      </div>
    </div>
  );
}

function StatsCard({
  label,
  value,
  icon: Icon,
  trend,
}: {
  label: string;
  value: string;
  icon: any;
  trend: string;
}) {
  return (
    <Card>
      <CardContent className=" flex items-center justify-between space-y-0">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{trend}</p>
        </div>
        <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}
