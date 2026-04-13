"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { JobOpportunity } from "@/lib/type"
import { applyForJob } from "@/app/actions/students/apply-job"
import { AlertCircle, CheckCircle, Briefcase, Building, MapPin } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface JobApplicationFormProps {
  job: JobOpportunity
  studentId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function JobApplicationForm({
  job,
  studentId,
  open,
  onOpenChange,
  onSuccess
}: JobApplicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const result = await applyForJob(job.id)

      if (result.success) {
        setSuccess(true)
        setTimeout(() => {
          onSuccess()
          onOpenChange(false)
        }, 2000)
      } else {
        setError(result.error || "Failed to submit application")
      }
    } catch (err) {
      setError("An unexpected error occurred")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatSalary = () => {
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

  if (success) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <div className="text-center py-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <DialogTitle className="text-xl">Application Submitted!</DialogTitle>
            <DialogDescription className="mt-2">
              Your application for <span className="font-semibold">{job.title}</span> at{" "}
              <span className="font-semibold">{job.company}</span> has been submitted successfully.
            </DialogDescription>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Apply for Job</DialogTitle>
          <DialogDescription>
            Submit your application for this position
          </DialogDescription>
        </DialogHeader>

        {/* Job Summary */}
        <div className="bg-muted/50 p-4 rounded-lg mb-4">
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 p-2 rounded">
              <Briefcase className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{job.title}</h3>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <Building className="h-3.5 w-3.5 mr-1" />
                {job.company}
              </div>
              {job.location && (
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <MapPin className="h-3.5 w-3.5 mr-1" />
                  {job.location}
                </div>
              )}
              <div className="mt-2 text-sm">
                <span className="font-medium">Salary:</span> {formatSalary()}
              </div>
            </div>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="coverLetter">Cover Letter (Optional)</Label>
            <Textarea
              id="coverLetter"
              placeholder="Tell the employer why you're a good fit for this position..."
              className="min-h-[120px] resize-y"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="resumeLink">Resume Link (Optional)</Label>
            <Input
              id="resumeLink"
              placeholder="Paste a link to your resume or portfolio..."
              type="url"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn Profile (Optional)</Label>
            <Input
              id="linkedin"
              placeholder="Your LinkedIn profile URL..."
              type="url"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⟳</span>
                  Submitting...
                </>
              ) : (
                "Submit Application"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}