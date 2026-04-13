"use client";

import { ComponentProps, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Github, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";
import { signInSchema, type SignInValues } from "@/app/lib/validations";
import { checkUserStatus } from "@/app/actions/sign-in";
import { authClient } from "@/app/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldLabel,
  FieldGroup,
  FieldSeparator,
} from "@/components/ui/field";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export const SignInForm = ({
  onSuccess,
  className,
  ...props
}: {
  onSuccess?: () => void;
  className?: string;
} & ComponentProps<typeof Card>) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || undefined;

  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema as any),
    defaultValues: {
      email: searchParams.get("email") || "",
    },
  });

  const onSubmit = async (data: SignInValues) => {
    setLoading(true);
    setError(null);

    try {
      // 1. Ensure user exists (or register them)
      const statusRes = await checkUserStatus(data.email, role);

      if (statusRes.requiresRole) {
        toast.info("Please choose a role to continue");
        router.push(`/choose-role?email=${encodeURIComponent(data.email)}`);
        return;
      }

      if (statusRes.error) {
        setError(statusRes.error || "An error occurred");
        toast.error(statusRes.error);
        setLoading(false);
        return;
      }

      // 2. Send OTP
      const { error: otpError } = await authClient.emailOtp.sendVerificationOtp(
        {
          email: data.email,
          type: "sign-in",
        },
      );

      if (otpError) {
        setError(otpError.message || "An error occurred");
        toast.error(otpError.message);
        setLoading(false);
        return;
      }

      toast.success("OTP sent to your email");
      const otpUrl = role
        ? `/verify-otp?email=${encodeURIComponent(data.email)}&role=${role}`
        : `/verify-otp?email=${encodeURIComponent(data.email)}`;
      router.push(otpUrl);
    } catch (err) {
      setError("An unexpected error occurred");
      toast.error("An unexpected error occurred");
      setLoading(false);
    }
  };

  const handleSocialSignIn = async (
    provider: "github" | "google" | "microsoft",
  ) => {
    await authClient.signIn.social({
      provider,
      callbackURL: `/api/auth/social-callback?role=${role || ""}`,
    });
  };

  return (
    <Card {...props} className="bg-card/80">
      <CardHeader className="flex flex-col items-center justify-center">
        <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
        <CardDescription className=" text-balance">
          Sign in to your EDORA account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <Button
                variant="outline"
                type="button"
                onClick={() => handleSocialSignIn("google")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
                Login with Google
              </Button>

              <Button
                variant="outline"
                type="button"
                onClick={() => handleSocialSignIn("github")}
              >
                <Github className="size-4" />
                Login with GitHub
                <span className="sr-only">Login with GitHub</span>
              </Button>
            </Field>
            <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
              Or continue with
            </FieldSeparator>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={loading}
                {...form.register("email")}
              />
            </Field>
            <Field>
              <Button type="submit" disabled={loading} className="w-full">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In with OTP
              </Button>
            </Field>
          </FieldGroup>
        </form>

        <div className="bg-muted relative hidden md:block mt-6">
          <img
            src="/placeholder.svg"
            alt="Image"
            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </div>
      </CardContent>
    </Card>
  );
};
