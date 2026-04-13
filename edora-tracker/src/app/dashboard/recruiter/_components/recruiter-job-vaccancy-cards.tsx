"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MapPin,
  Clock,
  DollarSign,
  Users,
  MoreHorizontal,
  FilePlus2,
  Calendar,
  Globe,
  AlertCircle,
  Pencil,
  Trash2,
  Loader2,
  CheckCircle2,
  PlusIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { formatDistanceToNow } from "date-fns";
import { JobStatus } from "@/app/lib/types";
import {
  useJobOpportunities,
  type JobOpportunityWithOrganization,
} from "@/app/hooks/use-job-opportunities";
import { deleteJobOpportunity } from "@/app/actions/recruiter-actions";
import Link from "next/link";
import { EditJobVacancyForm } from "../_forms/edit-job-vaccancy-form";
import { JobVacancyForm } from "../_forms/job-vaccancy-form";

export const RecruiterJobVaccancyCards = () => {
  const { data, isLoading, error, refetch } = useJobOpportunities();
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const getStatusStyles = (status: JobStatus) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100/80 border-transparent";
      case "draft":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 hover:bg-yellow-100/80 border-transparent";
      case "closed":
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-100/80 border-transparent";
      default:
        return "";
    }
  };

  const getStatusDisplay = (status: JobStatus) => {
    switch (status) {
      case "open":
        return "Active";
      case "draft":
        return "Draft";
      case "closed":
        return "Closed";
      default:
        return status;
    }
  };

  const getTypeDisplay = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1).replace("-", " ");
  };

  const getWorkModeDisplay = (mode: string) => {
    switch (mode) {
      case "remote":
        return "Remote";
      case "hybrid":
        return "Hybrid";
      case "on-site":
        return "On-site";
      default:
        return mode;
    }
  };

  const formatSalary = (job: JobOpportunityWithOrganization) => {
    if (!job.salaryMin && !job.salaryMax) return "Negotiable";

    const min = job.salaryMin
      ? formatCurrency(job.salaryMin, job.currency as string)
      : "";
    const max = job.salaryMax
      ? formatCurrency(job.salaryMax, job.currency as string)
      : "";

    if (min && max) return `${min} - ${max}`;
    if (min) return `${min}+`;
    if (max) return `Up to ${max}`;

    return "Negotiable";
  };

  const formatCurrency = (amount: number, currency: string) => {
    const symbol =
      currency === "INR"
        ? "₹"
        : currency === "USD"
          ? "$"
          : currency === "EUR"
            ? "€"
            : currency === "GBP"
              ? "£"
              : currency;

    // Format large numbers with commas
    const formatted =
      amount >= 1000 ? amount.toLocaleString() : amount.toString();

    return `${symbol}${formatted}`;
  };

  const formatLocation = (job: JobOpportunityWithOrganization) => {
    if (job.workMode === "remote") return "Remote";
    if (job.location && job.country) return `${job.location}, ${job.country}`;
    if (job.location) return job.location;
    if (job.country) return job.country;
    return "Location not specified";
  };

  const formatPostedDate = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  const truncateDescription = (
    description: string,
    maxLength: number = 100,
  ) => {
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + "...";
  };

  const handleEdit = (jobId: string) => {
    router.push(`/dashboard/recruiter/post-job?id=${jobId}`);
  };

  const handleDeleteClick = (jobId: string) => {
    setSelectedJobId(jobId);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedJobId) return;

    setIsDeleting(true);

    try {
      const result = await deleteJobOpportunity(selectedJobId);

      if (result.success) {
        toast.success("Job deleted successfully!");
        setShowDeleteDialog(false);
        setSelectedJobId(null);
        refetch(); // Refresh the job list
      } else {
        toast.error(result.error || "Failed to delete job posting");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card
            key={i}
            className="flex flex-col h-full border-muted-foreground/20"
          >
            <CardHeader className="pb-3 space-y-2">
              <div className="flex items-start justify-between gap-4">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-3.5 w-3.5 rounded-full" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 pb-4">
              <div className="grid grid-cols-2 gap-y-3 gap-x-2 mb-4">
                {[...Array(6)].map((_, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <Skeleton className="h-3.5 w-3.5 rounded-full shrink-0" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                ))}
              </div>
              <div className="space-y-2 mb-4">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-[90%]" />
                <Skeleton className="h-3 w-[80%]" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16 rounded-md" />
                <Skeleton className="h-5 w-16 rounded-md" />
                <Skeleton className="h-5 w-16 rounded-md" />
              </div>
            </CardContent>
            <CardFooter className="pt-0 gap-3">
              <Skeleton className="h-9 flex-1 rounded-md" />
              <Skeleton className="h-9 flex-1 rounded-md" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed border-red-200 rounded-lg bg-red-50 dark:bg-red-900/10">
        <AlertCircle className="h-8 w-8 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-red-700 dark:text-red-400">
          Error loading jobs
        </h3>
        <p className="text-sm text-red-600 dark:text-red-300 max-w-sm mt-2 mb-4">
          {error.message}
        </p>
        <Button variant="outline" onClick={() => refetch()}>
          Try Again
        </Button>
      </div>
    );
  }

  const vacancies = data?.data || [];

  if (!vacancies || vacancies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed rounded-lg bg-background">
        <div className="bg-muted/50 p-4 rounded-full mb-4">
          <FilePlus2 className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">No job postings found</h3>
        <p className="text-sm text-muted-foreground max-w-sm mt-2 mb-6">
          {data?.message ||
            "You haven't created any job vacancies yet. Click the button above to post your first job."}
        </p>
        <JobVacancyForm>
          <Button >
            <PlusIcon className="h-4 w-4" />
            Post New Job
          </Button>
        </JobVacancyForm>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vacancies.map((job) => (
        <Card key={job.id} className="flex flex-col h-full">
          <CardHeader className="pb-3 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3 min-w-0 flex-1">
                <Avatar className="h-10 w-10 rounded-lg border bg-muted/50 shrink-0">
                  <AvatarImage
                    src={job.organization?.companyLogo || undefined}
                    alt={job.organization?.companyName || "Company"}
                    className="object-cover"
                  />
                  <AvatarFallback className="rounded-lg">
                    {job.organization?.companyName
                      ?.substring(0, 2)
                      .toUpperCase() || "CO"}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1 min-w-0">
                  <CardTitle className="text-lg font-semibold truncate leading-tight">
                    {job.title}
                  </CardTitle>
                  <div className="flex items-center text-sm text-muted-foreground gap-1.5">
                    <span className="truncate">
                      {job.organization?.companyName || "Organization"}
                    </span>
                    {job.organization?.verified && (
                      <CheckCircle2 className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                    )}
                  </div>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 -mr-2 text-muted-foreground"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <EditJobVacancyForm jobId={job.id} initialData={job}>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit Job
                    </DropdownMenuItem>
                  </EditJobVacancyForm>
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => handleDeleteClick(job.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Job
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                className={`capitalize whitespace-nowrap ${getStatusStyles(job.status)}`}
                variant="outline"
              >
                {getStatusDisplay(job.status)}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="flex-1">
            <div className="grid grid-cols-2 gap-y-2 text-sm text-muted-foreground mb-4">
              <div className="flex items-center">
                <MapPin className="mr-1.5 h-3.5 w-3.5 text-muted-foreground/70" />
                <span className="truncate" title={formatLocation(job)}>
                  {formatLocation(job)}
                </span>
              </div>
              <div className="flex items-center">
                <DollarSign className="mr-1.5 h-3.5 w-3.5 text-muted-foreground/70" />
                <span className="truncate" title={formatSalary(job)}>
                  {formatSalary(job)}
                </span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-1.5 h-3.5 w-3.5 text-muted-foreground/70" />
                <span className="truncate">{getTypeDisplay(job.jobType || "")}</span>
              </div>
              <div className="flex items-center">
                <Globe className="mr-1.5 h-3.5 w-3.5 text-muted-foreground/70" />
                <span className="truncate">
                  {getWorkModeDisplay(job.workMode || "")}
                </span>
              </div>
              <div className="flex items-center">
                <Users className="mr-1.5 h-3.5 w-3.5 text-muted-foreground/70" />
                <span className="font-medium text-foreground">
                  {job.totalApplicants} Applicants
                </span>
              </div>
              <div className="flex items-center">
                <Calendar className="mr-1.5 h-3.5 w-3.5 text-muted-foreground/70" />
                <span className="truncate">
                  {formatPostedDate(job.createdAt)}
                </span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
              {truncateDescription(job.description || "")}
            </p>

            {/* Show skills if available */}
            {job.requiredSkills && job.requiredSkills.length > 0 && (
              <div className="mt-4">
                <div className="flex flex-wrap gap-1">
                  {job.requiredSkills.slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {job.requiredSkills.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{job.requiredSkills.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="pt-0 gap-3">
            <Button variant="outline" className="flex-1" asChild>
              <Link href={`/dashboard/recruiter/post-job/${job.id}`}>
                View Details
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the job
              posting and remove all associated data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              No
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isDeleting ? "Deleting..." : "Yes, Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
