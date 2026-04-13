import { Suspense } from "react";
import Galaxy from "@/components/animations/Galaxy";
import { SignInForm } from "./_components/sign-in-form";
import { checkAndRedirectSession } from "@/app/actions/session";

const SignInPage = async () => {
  // Check if user already has an active session and redirect
  await checkAndRedirectSession();

  return (
    <div className="relative flex min-h-svh w-full flex-col items-center justify-center overflow-hidden bg-background p-6 md:p-10">
      <div className="absolute inset-0 z-0">
        <Galaxy
          starSpeed={0.5}
          density={1}
          hueShift={140}
          speed={1}
          glowIntensity={0.3}
          saturation={0}
          mouseRepulsion
          repulsionStrength={2}
          twinkleIntensity={0.3}
          rotationSpeed={0.1}
          transparent
        />
      </div>
      <div className="relative z-10 w-full max-w-sm">
        <Suspense fallback={null}>
          <SignInForm />
        </Suspense>
      </div>
    </div>
  );
};

export default SignInPage;
