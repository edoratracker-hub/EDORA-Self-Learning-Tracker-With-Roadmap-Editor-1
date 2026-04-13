import Beams from "@/components/animations/Beams";
import { RecruiterOrganizationForm } from "./_components/recruiter-organization-form";
import Galaxy from "@/components/animations/Galaxy";

export default function RecruiterOrganizationPage() {
  return (
    <div className="relative flex min-h-svh w-full flex-col items-center justify-center overflow-hidden bg-background p-6 md:p-10">
      <div className="absolute inset-0 z-0">
        <Beams
          beamWidth={2}
          beamHeight={15}
          beamNumber={15}
          lightColor="#ffffff"
          speed={2}
          noiseIntensity={1.75}
          scale={0.2}
          rotation={0}
        />
      </div>
      <div className="relative z-10 w-full max-w-xl">
        <RecruiterOrganizationForm />
      </div>
    </div>
  );
}
