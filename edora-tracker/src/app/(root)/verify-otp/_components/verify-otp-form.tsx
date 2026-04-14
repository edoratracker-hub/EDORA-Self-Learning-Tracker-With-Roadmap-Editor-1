"use client";

import { ComponentProps, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, GalleryVerticalEnd } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { authClient } from "@/app/lib/auth-client";
import { checkUserStatus } from "@/app/actions/sign-in";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldLabel,
  FieldGroup,
  FieldError,
  FieldDescription,
} from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const verifyOtpSchema = z.object({
  email: z.string().email(),
  code: z.string().min(6, { message: "OTP must be 6 digits" }),
});

type VerifyOtpValues = z.infer<typeof verifyOtpSchema>;

export const VerifyOtpForm = ({
  className,
  ...props
}: {
  className?: string;
} & ComponentProps<"div">) => {
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const role = searchParams.get("role") || undefined;

  const form = useForm<VerifyOtpValues>({
    resolver: zodResolver(verifyOtpSchema as any),
    defaultValues: {
      email,
      code: "",
    },
  });

  const handleResendOtp = async () => {
    if (!email) return;

    setResending(true);
    try {
      const { error } = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "sign-in",
      });

      if (error) {
        toast.error(error.message || "Failed to resend OTP");
      } else {
        toast.success("OTP resent successfully");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setResending(false);
    }
  };

  const onSubmit = async (data: VerifyOtpValues) => {
    setLoading(true);
    try {
      const { data: sessionData, error: signInError } =
        await authClient.signIn.emailOtp({
          email: data.email,
          otp: data.code,
        });

      if (signInError) {
        toast.error(signInError.message || "Failed to verify OTP");
        setLoading(false);
        return;
      }

      toast.success("Signed in successfully");

      let userRole = role;
      if (!userRole) {
        const statusRes = await checkUserStatus(data.email);
        userRole = statusRes.role ?? undefined;
      }

      if (userRole === "recruiter") {

        const { checkRecruiterOrganizationStatus } = await import("@/app/actions/recruiter-actions");
        const { hasOrganization, organization } = await checkRecruiterOrganizationStatus();

        if (!hasOrganization) {

          router.push("/recruiter-landing-page");
        } else if (organization && !organization.verified) {

          router.push("/recruiter-organization-completed");
        } else {

          router.push("/dashboard/recruiter");
        }
      } else if (userRole === "student") {
        router.push("/dashboard/students");
      } else if (userRole === "professional") {
        router.push("/dashboard/mentor-professional/profile-setup");
      } else if (userRole === "admin") {
        router.push("/dashboard/admin");
      } else {
        router.push("/");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <Link
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <span className="sr-only">EDORA.</span>
            </Link>
            <h1 className="text-xl font-bold">Enter verification code</h1>
            <FieldDescription>
              We sent a 6-digit code to {email || "your email"}
            </FieldDescription>
          </div>

          <Field>
            <FieldLabel htmlFor="otp" className="sr-only">
              Verification code
            </FieldLabel>
            <Controller
              control={form.control}
              name="code"
              render={({ field }) => (
                <InputOTP
                  maxLength={6}
                  id="otp"
                  required
                  containerClassName="gap-4 justify-center"
                  {...field}
                  onChange={(value) => {
                    field.onChange(value);
                    if (value.length === 6) {
                      form.handleSubmit(onSubmit)();
                    }
                  }}
                >
                  <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:h-16 *:data-[slot=input-otp-slot]:w-12 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:text-xl">
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:h-16 *:data-[slot=input-otp-slot]:w-12 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:text-xl">
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              )}
            />
            <FieldError>{form.formState.errors.code?.message}</FieldError>
            <FieldDescription className="text-center">
              Didn&apos;t receive the code?{" "}
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resending}
                className="text-primary hover:underline disabled:opacity-50"
              >
                {resending ? "Resending..." : "Resend"}
              </button>
            </FieldDescription>
          </Field>

          <Field>
            <Button type="submit" disabled={loading} className="w-full">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verify
            </Button>
          </Field>
        </FieldGroup>
      </form>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
};
