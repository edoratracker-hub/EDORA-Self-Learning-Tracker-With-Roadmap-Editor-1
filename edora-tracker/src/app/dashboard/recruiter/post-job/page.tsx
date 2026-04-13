import { JobVacancyPostForm } from "./_components/job-vacancy-post-form";
import { getJobOpportunity } from "@/app/actions/recruiter-actions";
import NotFound from "./not-found";


export const metadata = {
    title: "Post a Job | Edora Recruiter",
    description: "Create a new job posting for your organization.",
};

interface PageProps {
    searchParams: Promise<{ id?: string }>;
}

const PostJobPage = async ({ searchParams }: PageProps) => {
    const params = await searchParams;
    const jobId = params.id;
    let jobData = null;
    let mode: "create" | "edit" = "create";

    // If jobId is provided, fetch the job data for editing
    if (jobId) {
        mode = "edit";
        const result = await getJobOpportunity(jobId);

        if (!result.success || !result.job) {
            NotFound();
        }

        jobData = result.job;
    }

    return (
        <div className="container max-w-4xl mx-auto p-6 lg:p-10">
            <div className="space-y-6">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">
                        {mode === "edit" ? "Edit Job Posting" : "Post a New Job"}
                    </h1>
                    <p className="text-muted-foreground">
                        {mode === "edit"
                            ? "Update the details of your job posting below."
                            : "Fill in the details below to create a new job posting for your organization."}
                    </p>
                </div>

                <JobVacancyPostForm mode={mode} jobId={jobId} initialData={jobData} />
            </div>
        </div>
    );
};

export default PostJobPage;
