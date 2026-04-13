import { Button } from "@/components/ui/button";
import JobDetailsView from "./_components/job-details-view";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const RecruiterJobDetailsPage = () => {
  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/recruiter">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Job Details</h1>
          <p className="text-muted-foreground">Job Details & Applicants</p>
        </div>
      </div>
      <JobDetailsView />
    </div>
  );
};

export default RecruiterJobDetailsPage;
