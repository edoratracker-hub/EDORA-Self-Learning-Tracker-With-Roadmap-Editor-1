import React from "react";
import { Loader2, ShieldCheck } from "lucide-react";

const MentorPendingPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] p-6">
      <div className="bg-card/30 backdrop-blur-xl border border-primary/10 rounded-2xl shadow-2xl p-10 max-w-md w-full flex flex-col items-center">
        <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-6">
          <ShieldCheck className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-2xl font-bold mb-2 text-center">
          Verification Pending
        </h1>
        <p className="text-base text-muted-foreground text-center mb-6">
          Thank you for submitting your mentor profile!
          <br />
          Our team is reviewing your information. You will receive an email once
          your account is verified and approved.
        </p>
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <span className="text-xs text-muted-foreground">
          This page will update automatically once approved.
        </span>
      </div>
    </div>
  );
};

export default MentorPendingPage;
