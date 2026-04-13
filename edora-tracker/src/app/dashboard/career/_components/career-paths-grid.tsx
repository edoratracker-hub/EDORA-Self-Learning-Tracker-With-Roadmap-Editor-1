"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Filter,
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Building,
  Globe,
  Users,
  Calendar,
  Loader2,
  AlertCircle,
  CheckCircle
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
// import { JobApplicationForm } from "../_forms/job-application-form"
import { JobOpportunity } from "@/lib/type"

interface ApiResponse {
  success: boolean
  data: JobOpportunity[]
  pagination: {
    total: number
    limit: number
    offset: number
    hasMore: boolean
  }
  error?: string
}

export function CareerPathsGrid({ studentId }: { studentId?: string }) {
  const [jobs, setJobs] = useState<JobOpportunity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [jobType, setJobType] = useState("all")
  const [workMode, setWorkMode] = useState("all")
  const [location, setLocation] = useState("")
  const [selectedJob, setSelectedJob] = useState<JobOpportunity | null>(null)
  const [showApplicationForm, setShowApplicationForm] = useState(false)
  const [appliedJobs, setAppliedJobs] = useState<string[]>([])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (search) params.append("search", search)
      if (jobType && jobType !== "all") params.append("type", jobType)
      if (workMode && workMode !== "all") params.append("workMode", workMode)
      if (location) params.append("location", location)

      const response = await fetch(`/api/jobs?${params.toString()}`)

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("API returned non-JSON response")
      }

      const result: ApiResponse = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to fetch jobs')
      }

      setJobs(result.data)
    } catch (err) {
      console.error('Error fetching jobs:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const fetchAppliedJobs = async () => {
    if (!studentId) return
    try {
      const response = await fetch(`/api/job-applications?studentId=${studentId}`)

      // Check if response is JSON
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        console.warn("Job applications API returned non-JSON response")
        return
      }

      const result = await response.json()

      if (result.success && result.data) {
        setAppliedJobs(result.data.map((app: any) => app.jobId))
      }
    } catch (err) {
      console.error('Error fetching applied jobs:', err)
    }
  }

  useEffect(() => {
    fetchJobs()
    if (studentId) {
      fetchAppliedJobs()
    }
  }, [studentId])

  const handleApplyClick = (job: JobOpportunity) => {
    setSelectedJob(job)
    setShowApplicationForm(true)
  }

  const handleApplicationSuccess = () => {
    setShowApplicationForm(false)
    setSelectedJob(null)
    fetchAppliedJobs() // Refresh applied jobs list
    fetchJobs() // Refresh job list to update applicant count
  }

  const formatSalary = (job: JobOpportunity) => {
    if (!job.salaryMin && !job.salaryMax) return "Negotiable"

    const min = job.salaryMin ? formatCurrency(job.salaryMin, job.currency) : ""
    const max = job.salaryMax ? formatCurrency(job.salaryMax, job.currency) : ""

    if (min && max) return `${min} - ${max}`
    if (min) return `${min}+`
    if (max) return `Up to ${max}`

    return "Negotiable"
  }

  const formatCurrency = (amount: number, currency: string) => {
    const symbol = currency === "INR" ? "₹" :
      currency === "USD" ? "$" :
        currency === "EUR" ? "€" :
          currency === "GBP" ? "£" : currency

    const formatted = amount >= 1000 ? amount.toLocaleString() : amount.toString()
    return `${symbol}${formatted}`
  }

  const formatLocation = (job: JobOpportunity) => {
    if (job.workMode === "remote") return "Remote"
    if (job.location && job.country) return `${job.location}, ${job.country}`
    if (job.location) return job.location
    if (job.country) return job.country
    return "Location not specified"
  }

  const formatJobType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1).replace("-", " ")
  }

  const formatWorkMode = (mode: string) => {
    switch (mode) {
      case "remote": return "Remote"
      case "hybrid": return "Hybrid"
      case "on-site": return "On-site"
      default: return mode
    }
  }

  const isJobApplied = (jobId: string) => {
    return appliedJobs.includes(jobId)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
        <p className="text-sm text-muted-foreground">Loading job opportunities...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed border-red-200 rounded-lg bg-red-50 dark:bg-red-900/10">
        <AlertCircle className="h-8 w-8 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-red-700 dark:text-red-400">Error loading jobs</h3>
        <p className="text-sm text-red-600 dark:text-red-300 max-w-sm mt-2 mb-4">
          {error}
        </p>
        <Button variant="outline" onClick={fetchJobs}>
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-card p-6 rounded-lg border shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search jobs by title, company, or keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button onClick={fetchJobs}>
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select value={jobType} onValueChange={setJobType}>
            <SelectTrigger>
              <SelectValue placeholder="Job Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="full-time">Full-time</SelectItem>
              <SelectItem value="part-time">Part-time</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
              <SelectItem value="internship">Internship</SelectItem>
              <SelectItem value="freelance">Freelance</SelectItem>
            </SelectContent>
          </Select>

          <Select value={workMode} onValueChange={setWorkMode}>
            <SelectTrigger>
              <SelectValue placeholder="Work Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Modes</SelectItem>
              <SelectItem value="remote">Remote</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
              <SelectItem value="on-site">On-site</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-muted-foreground">
            Showing {jobs.length} job{jobs.length !== 1 ? 's' : ''}
          </p>
          <Button variant="outline" onClick={() => {
            setSearch("")
            setJobType("all")
            setWorkMode("all")
            setLocation("")
            fetchJobs()
          }}>
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Job Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <Card key={job.id} className="flex flex-col h-full hover:shadow-lg transition-all duration-200 border-muted-foreground/20">
            <CardHeader className="pb-3 space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="capitalize">
                  {formatJobType(job.jobType)}
                </Badge>
                {isJobApplied(job.id) && (
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Applied
                  </Badge>
                )}
              </div>

              <CardTitle className="text-xl font-semibold line-clamp-2 leading-tight">
                {job.title}
              </CardTitle>

              <div className="flex items-center text-sm text-muted-foreground">
                <Building className="mr-1.5 h-3.5 w-3.5" />
                {job.company}
              </div>
            </CardHeader>

            <CardContent className="flex-1 pb-4">
              <div className="grid grid-cols-2 gap-y-3 text-sm text-muted-foreground mb-4">
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
                  <Globe className="mr-1.5 h-3.5 w-3.5 text-muted-foreground/70" />
                  <span className="truncate">
                    {formatWorkMode(job.workMode)}
                  </span>
                </div>

                <div className="flex items-center">
                  <Users className="mr-1.5 h-3.5 w-3.5 text-muted-foreground/70" />
                  <span className="font-medium text-foreground">
                    {job.totalApplicants} Applied
                  </span>
                </div>

                {job.applicationDeadline && (
                  <div className="col-span-2 flex items-center mt-1">
                    <Calendar className="mr-1.5 h-3.5 w-3.5 text-muted-foreground/70" />
                    <span className="text-xs">
                      Apply by {new Date(job.applicationDeadline).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-3">
                {job.description.substring(0, 150)}...
              </p>

              {job.requiredSkills && job.requiredSkills.length > 0 && (
                <div className="mt-3">
                  <div className="flex flex-wrap gap-1">
                    {job.requiredSkills.slice(0, 3).map((skill: string, index: number) => (
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

            <CardFooter className="pt-0">
              <Button
                className="w-full"
                onClick={() => handleApplyClick(job)}
                disabled={isJobApplied(job.id)}
              >
                {isJobApplied(job.id) ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Applied
                  </>
                ) : (
                  "Apply Now"
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {jobs.length === 0 && !loading && (
        <div className="text-center py-12">
          <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold">No jobs found</h3>
          <p className="text-muted-foreground mt-2">
            Try adjusting your search filters or check back later for new opportunities.
          </p>
        </div>
      )}

      {/* Application Form Dialog */}
      {/* {selectedJob && (
        <JobApplicationForm
          job={selectedJob}
          studentId={studentId || ""}
          open={showApplicationForm}
          onOpenChange={setShowApplicationForm}
          onSuccess={handleApplicationSuccess}
        />
      )} */}
    </div>
  )
}