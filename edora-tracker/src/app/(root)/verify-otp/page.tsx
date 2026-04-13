import { VerifyOtpForm } from "./_components/verify-otp-form";
import { Suspense } from "react";
import { checkAndRedirectSession } from "@/app/actions/session";

const VerifyOtpPage = async () => {
  // Check if user already has an active session and redirect
  await checkAndRedirectSession();

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Suspense fallback={<div>Loading...</div>}>
          <VerifyOtpForm />
        </Suspense>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
