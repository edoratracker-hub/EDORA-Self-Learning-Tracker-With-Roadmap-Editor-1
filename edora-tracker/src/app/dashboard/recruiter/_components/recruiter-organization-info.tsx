"use client";

import {
  Building2,
  MapPin,
  Globe,
  Phone,
  LogOut,
  CheckCircle,
} from "lucide-react";
import { RecruiterOrganization } from "@/app/hooks/use-job-opportunities";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
} from "@/components/ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { Separator } from "@/components/ui/separator";

import { useRouter } from "next/navigation";
import { authClient } from "@/app/lib/auth-client";
import { toast } from "sonner";

interface RecruiterOrganizationInfoProps {
  organization: RecruiterOrganization;
  userEmail?: string;
}

export function RecruiterOrganizationInfo({
  organization,
  userEmail,
}: RecruiterOrganizationInfoProps) {
  const router = useRouter();

  const getInitials = (name: string | null) => {
    if (!name) return "CO";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSignOut = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/");
            toast.success("Signed out successfully");
          },
        },
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out");
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="gap-3 px-4 py-6 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
        >
          {organization.companyLogo ? (
            <Image
              src={organization.companyLogo}
              alt={organization.companyName || "Company Logo"}
              className="h-8 w-8 rounded-full border object-cover"
              width={40}
              height={40}
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-medium">
              {getInitials(organization.companyName)}
            </div>
          )}
          {organization.companyName}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0" align="start">
        {/* Header Section */}
        <PopoverHeader className=" bg-muted-foreground/10 p-4 flex">
          <div className="flex items-center gap-4">
            <div className="relative">
              {organization.companyLogo ? (
                <Image
                  src={organization.companyLogo}
                  alt={organization.companyName || "Company Logo"}
                  className="h-12 w-12 rounded-full border-2 border-border object-cover"
                  width={64}
                  height={64}
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-border bg-primary/10 text-primary font-semibold text-xl">
                  {getInitials(organization.companyName)}
                </div>
              )}
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg leading-none">
                  {organization.companyName || "Your Organization"}
                </h3>
                {organization.verified && (
                  <CheckCircle className="h-4 w-4 text-blue-600 fill-blue-100" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Organization Profile
              </p>
            </div>
          </div>
        </PopoverHeader>

        <Separator />

        {/* Details Section */}
        <div className="p-6 py-4 space-y-3">
          {organization.location && (
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-foreground">{organization.location}</span>
            </div>
          )}

          {organization.phoneNumber && (
            <div className="flex items-center gap-3 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-foreground">
                {organization.phoneNumber}
              </span>
            </div>
          )}

          {organization.website && (
            <div className="flex items-center gap-3 text-sm">
              <Globe className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <a
                href={organization.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline truncate"
              >
                {organization.website}
              </a>
            </div>
          )}

          {organization.createdAt && (
            <div className="flex items-center gap-3 text-sm pt-1">
              <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground text-xs">
                Member since{" "}
                {new Date(organization.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          )}

          {userEmail && (
            <div className="pt-2">
              <p className="text-xs text-muted-foreground">Signed in as</p>
              <p className="text-sm font-medium truncate">{userEmail}</p>
            </div>
          )}
        </div>

        <Separator />

        {/* Sign Out Button */}
        <div className="p-2">
          <Button
            variant="destructive"
            className="w-full justify-start hover:bg-red-600 transition-colors"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </PopoverContent>
    </Popover>
    // <div className="flex items-center gap-3 px-4 py-2 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
    //   {/* Organization Logo or Initials */}

    //   <div className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-primary/20">
    //     {organization.companyLogo ? (
    //       <Image
    //         src={organization.companyLogo}
    //         alt={organization.companyName || "Company"}
    //         className="aspect-square h-full w-full object-cover"
    //         width={40}
    //         height={40}
    //       />
    //     ) : (
    //       <div className="flex h-full w-full items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
    //         {getInitials(organization.companyName)}
    //       </div>
    //     )}
    //   </div>

    //   {/* Organization Details */}
    //   <div className="flex-1 min-w-0">
    //     <p className="font-semibold text-sm truncate">
    //       {organization.companyName || "Your Organization"}
    //     </p>
    //     {/* {organization.location && (
    //                 <div className="flex items-center gap-1 text-xs text-muted-foreground">
    //                     <MapPin className="h-3 w-3" />
    //                     <span className="truncate">{organization.location}</span>
    //                 </div>
    //             )} */}
    //   </div>
    // </div>
  );
}
