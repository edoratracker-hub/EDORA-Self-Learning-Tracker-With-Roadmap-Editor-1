"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Search,
  Filter,
  Building2,
  GraduationCap,
  TrendingUp,
  Heart,
  Share2Icon,
  Loader2,
  CalendarClock,
} from "lucide-react";
import { SectionCards } from "../../_components/section-cards";
import { Separator } from "@/components/ui/separator";

import { useJobs, type JobOpportunityData } from "@/app/hooks/use-jobs";
import { useAppliedJobs, useApplyToJob } from "@/app/hooks/use-applied-jobs";
import { formatDistanceToNow } from "date-fns";
import { AppliedJobsList } from "./applied-jobs-list";
import { ScheduledInterviewsList } from "./scheduled-interviews-list";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

interface JobVacancy {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "full-time" | "part-time" | "internship" | "contract";
  salary: string;
  experience: string;
  posted: string;
  deadline: string;
  description: string;
  skills: string[];
  category: string;
  isRemote: boolean;
  isFeatured?: boolean;
}

const jobVacancies: JobVacancy[] = [
  {
    id: "1",
    title: "Frontend Developer",
    company: "Tech Solutions Inc.",
    location: "New York, NY",
    type: "full-time",
    salary: "$80k - $120k",
    experience: "2-4 years",
    posted: "2 days ago",
    deadline: "Dec 31, 2024",
    description:
      "We're seeking a talented Frontend Developer to join our innovative team and build cutting-edge web applications.",
    skills: ["React", "TypeScript", "Tailwind CSS", "Next.js"],
    category: "technology",
    isRemote: true,
    isFeatured: true,
  },
  {
    id: "2",
    title: "Marketing Intern",
    company: "Creative Agency Co.",
    location: "Los Angeles, CA",
    type: "internship",
    salary: "$20/hour",
    experience: "Entry Level",
    posted: "1 week ago",
    deadline: "Jan 15, 2025",
    description:
      "Join our dynamic marketing team and gain hands-on experience in digital marketing campaigns and social media strategy.",
    skills: ["Social Media", "Content Creation", "Analytics", "SEO"],
    category: "marketing",
    isRemote: false,
  },
  {
    id: "3",
    title: "Data Analyst",
    company: "DataViz Corporation",
    location: "Remote",
    type: "full-time",
    salary: "$70k - $95k",
    experience: "1-3 years",
    posted: "3 days ago",
    deadline: "Jan 20, 2025",
    description:
      "Analyze complex datasets and provide actionable insights to drive business decisions using advanced analytics tools.",
    skills: ["Python", "SQL", "Tableau", "Statistics"],
    category: "technology",
    isRemote: true,
  },
  {
    id: "4",
    title: "Graphic Designer",
    company: "Design Studio Pro",
    location: "Chicago, IL",
    type: "contract",
    salary: "$50/hour",
    experience: "3-5 years",
    posted: "5 days ago",
    deadline: "Dec 28, 2024",
    description:
      "Create stunning visual designs for clients across various industries. Portfolio required.",
    skills: ["Adobe Creative Suite", "Figma", "Branding", "UI/UX"],
    category: "design",
    isRemote: true,
    isFeatured: true,
  },
  {
    id: "5",
    title: "Business Development Associate",
    company: "Global Ventures Ltd.",
    location: "Boston, MA",
    type: "full-time",
    salary: "$60k - $85k",
    experience: "1-2 years",
    posted: "1 day ago",
    deadline: "Jan 10, 2025",
    description:
      "Drive business growth by identifying new opportunities and building strategic partnerships.",
    skills: ["Sales", "Negotiation", "CRM", "Communication"],
    category: "business",
    isRemote: false,
  },
  {
    id: "6",
    title: "Software Engineering Intern",
    company: "Innovation Labs",
    location: "San Francisco, CA",
    type: "internship",
    salary: "$25/hour",
    experience: "Entry Level",
    posted: "4 days ago",
    deadline: "Jan 5, 2025",
    description:
      "Work on real-world projects and learn from experienced engineers in a fast-paced startup environment.",
    skills: ["JavaScript", "Git", "Problem Solving", "Team Collaboration"],
    category: "technology",
    isRemote: false,
    isFeatured: true,
  },
  {
    id: "7",
    title: "Content Writer",
    company: "Media House Publishing",
    location: "Remote",
    type: "part-time",
    salary: "$30/hour",
    experience: "2-3 years",
    posted: "1 week ago",
    deadline: "Dec 25, 2024",
    description:
      "Create engaging content for various digital platforms including blogs, articles, and social media.",
    skills: ["Writing", "Research", "SEO", "WordPress"],
    category: "marketing",
    isRemote: true,
  },
  {
    id: "8",
    title: "UX/UI Designer",
    company: "App Innovations Inc.",
    location: "Seattle, WA",
    type: "full-time",
    salary: "$85k - $115k",
    experience: "3-5 years",
    posted: "2 days ago",
    deadline: "Jan 8, 2025",
    description:
      "Design intuitive user experiences for mobile and web applications with a focus on user-centered design.",
    skills: ["Figma", "User Research", "Prototyping", "Design Systems"],
    category: "design",
    isRemote: true,
  },
];

const typeColors = {
  "full-time": "bg-green-600",
  "part-time": "bg-blue-600",
  internship: "bg-purple-600",
  contract: "bg-orange-600",
  freelance: "bg-pink-600",
};

const JobCard = ({
  job,
  appliedJobIds = [],
}: {
  job: JobOpportunityData;
  appliedJobIds?: string[];
}) => {
  const applyMutation = useApplyToJob();
  const isApplied = appliedJobIds.includes(job.id);

  const getExperienceText = () => {
    if (job.experienceMin && job.experienceMax) {
      return `${job.experienceMin}-${job.experienceMax} years`;
    } else if (job.experienceMin) {
      return `${job.experienceMin}+ years`;
    } else if (job.experienceMax) {
      return `Up to ${job.experienceMax} years`;
    }
    return "Entry Level";
  };

  const getSalaryText = () => {
    if (job.salaryMin && job.salaryMax) {
      return `${job.currency || "INR"} ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}`;
    } else if (job.salaryMin) {
      return `${job.currency || "INR"} ${job.salaryMin.toLocaleString()}+`;
    }
    return "Competitive";
  };

  const getPostedTime = () => {
    try {
      return formatDistanceToNow(new Date(job.createdAt), { addSuffix: true });
    } catch {
      return "Recently";
    }
  };

  const getDeadline = () => {
    if (job.applicationDeadline) {
      try {
        return new Date(job.applicationDeadline).toLocaleDateString();
      } catch {
        return "Open";
      }
    }
    return "Open";
  };

  const isRemote = job.workMode?.toLowerCase() === "remote";
  const isFeatured = false; // You can add a featured field to your schema if needed

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {isFeatured && <Badge className="bg-yellow-600">Featured</Badge>}
              {job.jobType && (
                <Badge
                  variant="outline"
                  className={
                    typeColors[job.jobType as keyof typeof typeColors] ||
                    "bg-gray-600"
                  }
                >
                  {job.jobType.charAt(0).toUpperCase() +
                    job.jobType.slice(1).replace("-", " ")}
                </Badge>
              )}
              {isRemote && <Badge variant="secondary">Remote</Badge>}
              {job.workMode && !isRemote && (
                <Badge variant="secondary">
                  {job.workMode.charAt(0).toUpperCase() + job.workMode.slice(1)}
                </Badge>
              )}
            </div>
            <CardTitle className="text-xl">{job.title}</CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1">
              <Building2 className="h-3 w-3" />
              {job.organization?.companyName || "Company"}
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {job.description || "No description available"}
        </p>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>
              {job.location ||
                job.organization?.location ||
                "Location not specified"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <DollarSign className="h-4 w-4" />
            <span>{getSalaryText()}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <GraduationCap className="h-4 w-4" />
            <span>{getExperienceText()}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Posted {getPostedTime()}</span>
          </div>
        </div>

        {job.requiredSkills && job.requiredSkills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {job.requiredSkills.slice(0, 4).map((skill, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {job.requiredSkills.length > 4 && (
              <Badge variant="secondary" className="text-xs">
                +{job.requiredSkills.length - 4} more
              </Badge>
            )}
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          Deadline: {getDeadline()}
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button
          className="flex-1"
          onClick={() => !isApplied && applyMutation.mutate(job.id)}
          disabled={isApplied || applyMutation.isPending}
          variant={isApplied ? "secondary" : "default"}
        >
          {applyMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Applying...
            </>
          ) : isApplied ? (
            "Applied"
          ) : (
            "Apply Now"
          )}
        </Button>

      </CardFooter>
    </Card>
  );
};

export function CareerContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("browse");

  const { data, isLoading, error } = useJobs({
    search: searchQuery,
    type: typeFilter,
    location:
      locationFilter !== "all" && locationFilter !== "remote"
        ? locationFilter
        : undefined,
    workMode: locationFilter === "remote" ? "remote" : undefined,
  });

  const { data: appliedJobIds = [] } = useAppliedJobs();

  // Filter out any jobs the user has already applied to
  const jobs = (data?.data || []).filter(job => !appliedJobIds.includes(job.id));
  const totalJobs = jobs.length;

  const stats = [
    {
      label: "Total Opportunities",
      value: totalJobs,
      icon: Briefcase,
    },
    {
      label: "Active Companies",
      value:
        jobs.length > 0
          ? new Set(jobs.map((j) => j.organization?.companyName || j.company))
            .size
          : 0,
      icon: Building2,
    },
    {
      label: "Remote Positions",
      value: jobs.filter((j) => j.workMode?.toLowerCase() === "remote").length,
      icon: TrendingUp,
    },
    {
      label: "This Week",
      value: jobs.filter((j) => {
        try {
          const daysDiff = Math.floor(
            (Date.now() - new Date(j.createdAt).getTime()) /
            (1000 * 60 * 60 * 24),
          );
          return daysDiff <= 7;
        } catch {
          return false;
        }
      }).length,
      icon: Clock,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Career Opportunities
        </h1>
        <p className="text-muted-foreground mt-1">
          Explore job vacancies, track applications, and manage interviews
        </p>
      </div>

      <Separator className="bg-blue-500 rounded-full" />


      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="browse">
            <Briefcase className="h-4 w-4 mr-2" />
            Browse Jobs
          </TabsTrigger>
          <TabsTrigger value="applications">
            <Clock className="h-4 w-4 mr-2" />
            My Applications
          </TabsTrigger>
          <TabsTrigger value="interviews">
            <CalendarClock className="h-4 w-4 mr-2" />
            Interviews
          </TabsTrigger>
        </TabsList>

        {/* Browse Jobs Tab */}
        <TabsContent value="browse" className="space-y-4">
          {/* Search and Filters */}
          <div className="flex gap-4">
            <InputGroup className="max-w-xs">
              <InputGroupInput placeholder="Search by title, company, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} />
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
            </InputGroup>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="full-time">Full Time</SelectItem>
                <SelectItem value="part-time">Part Time</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="freelance">Freelance</SelectItem>
              </SelectContent>
            </Select>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="New York">New York</SelectItem>
                <SelectItem value="San Francisco">San Francisco</SelectItem>
                <SelectItem value="Los Angeles">Los Angeles</SelectItem>
                <SelectItem value="Chicago">Chicago</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {isLoading ? (
                "Loading..."
              ) : (
                <>
                  Showing {jobs.length}{" "}
                  {jobs.length === 1 ? "opportunity" : "opportunities"}
                </>
              )}
            </p>
            <Select defaultValue="recent">
              <SelectTrigger className="">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="salary-high">Salary: High to Low</SelectItem>
                <SelectItem value="salary-low">Salary: Low to High</SelectItem>
                <SelectItem value="deadline">Deadline</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="col-span-2 text-center py-12">
              <Filter className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Error loading jobs</h3>
              <p className="text-muted-foreground">
                {error.message || "Failed to fetch job opportunities"}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              {jobs.length > 0 ? (
                jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    appliedJobIds={appliedJobIds}
                  />
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your filters or search terms
                  </p>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        {/* Applications Tab */}
        <TabsContent value="applications">
          <AppliedJobsList />
        </TabsContent>

        {/* Interviews Tab */}
        <TabsContent value="interviews">
          <ScheduledInterviewsList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
