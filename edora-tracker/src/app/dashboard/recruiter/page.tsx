"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getRecruiterOrganization } from "@/app/actions/recruiter-actions";
import { RecruiterHero } from "./_components/recruiter-hero";
import { RecruiterJobVaccancyCards } from "./_components/recruiter-job-vaccancy-cards";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const Recruiter = () => {
  const router = useRouter();
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    async function checkVerification() {
      const { organization, error } = await getRecruiterOrganization();

      if (error || !organization) {
        toast.error("Organization not found");
        router.push("/recruiter-organization");
        return;
      }

      if (!organization.verified) {
        toast.error("Organization Not Verified", {
          description:
            "Your organization is pending admin verification. You'll be redirected.",
          duration: 4000,
        });
        setTimeout(() => {
          router.push("/recruiter-organization-completed");
        }, 1500);
        return;
      }

      setVerified(true);
    }

    checkVerification();
  }, [router]);

  return (
    <div className="">
      <section className="container p-6 space-y-8 max-w-7xl mx-auto">
        <RecruiterHero />

        {/* Job Vacancies Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Your Job Postings</h2>
          <RecruiterJobVaccancyCards />
        </div>
      </section>
    </div>
  );
};

export default Recruiter;
