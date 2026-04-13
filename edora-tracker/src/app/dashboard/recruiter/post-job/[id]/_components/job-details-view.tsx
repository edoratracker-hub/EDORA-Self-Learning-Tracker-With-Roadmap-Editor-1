"use client";

import { useParams, useRouter } from "next/navigation";
import { useJobDetail } from "@/app/hooks/use-job-detail";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { JobDetailsCard } from "./JobDetailsCard";
import { ApplicantsTable } from "./ApplicantsTable";
import { JobDetailSkeleton } from "./job-details-skeleton";

export default function JobDetailsView() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const { data, isLoading, error } = useJobDetail(jobId);

  if (isLoading) {
    return <JobDetailSkeleton />;
  }

  if (error || !data?.success || !data.job) {
    return (
      <div className="container p-6 lg:p-10">
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed border-red-200 rounded-lg bg-red-50 dark:bg-red-900/10">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-xl font-semibold text-red-700 dark:text-red-400">
            Error loading job details
          </h3>
          <p className="text-sm text-red-600 dark:text-red-300 max-w-sm mt-2 mb-6">
            {error?.message || data?.error || "Job not found"}
          </p>
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const { job, applicants } = data;

  return (
    <div className="container space-y-6">
      {/* Header */}

      <JobDetailsCard job={job} />
      <ApplicantsTable applicants={applicants} job={job} />
    </div>
  );
}
