import { RecruiterHero } from "./_components/recruiter-hero";
import { RecruiterFeatures } from "./_components/recruiter-features";
import { RecruiterCTA } from "./_components/recruiter-cta";

export const metadata = {
  title: "Recruiters | Edora",
  description:
    "Hire the best talent with Edora's AI-powered recruitment platform.",
};

const RecruiterLandingPage = async () => {
  // This page is accessible to everyone, including recruiters without organizations
  // Client-side checks in RecruiterHero will handle proper redirects based on org status

  return (
    <div className="flex flex-col min-h-screen">
      <RecruiterHero />
      <RecruiterFeatures />
      <RecruiterCTA />
    </div>
  );
};

export default RecruiterLandingPage;
