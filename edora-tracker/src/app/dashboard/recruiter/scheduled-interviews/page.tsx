import React from "react";
import { RecruiterScheduledInterviewsList } from "./_components/recruiter-interviews-list";

export const metadata = {
    title: "Scheduled Interviews | Edora Recruiter",
    description: "View and manage all scheduled candidate interviews.",
};

const ScheduledInterviewsPage = () => {
    return (
        <div className="container mx-auto p-6 lg:p-10">
            <RecruiterScheduledInterviewsList />
        </div>
    );
};

export default ScheduledInterviewsPage;
