export default function NotFound() {
    return (
        <div className="container max-w-4xl mx-auto p-6 lg:p-10">
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <h1 className="text-4xl font-bold">Job Not Found</h1>
                <p className="text-muted-foreground text-center max-w-md">
                    The job posting you're trying to edit doesn't exist or you don't have
                    permission to edit it.
                </p>
                <a
                    href="/dashboard/recruiter"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                >
                    Back to Dashboard
                </a>
            </div>
        </div>
    );
}
