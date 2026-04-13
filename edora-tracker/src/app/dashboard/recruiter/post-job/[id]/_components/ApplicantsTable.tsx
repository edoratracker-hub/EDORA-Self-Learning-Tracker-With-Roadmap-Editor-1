"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users, CheckCircle, XCircle, Calendar, RefreshCw } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import type { JobApplicant } from "@/app/hooks/use-job-detail";
import type { Job } from "@/app/hooks/use-job-detail";
import { ScheduleInterviewSheet } from "./ScheduleInterviewSheet";
import { RescheduleInterviewSheet } from "./RescheduleInterviewSheet";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

interface ApplicantsTableProps {
  applicants: JobApplicant[];
  job: Job;
}

export function ApplicantsTable({ applicants, job }: ApplicantsTableProps) {
  const queryClient = useQueryClient();

  const handleScheduled = () => {
    // Refetch job details to update the table
    queryClient.invalidateQueries({ queryKey: ["job-detail", job.id] });
  };

  if (!applicants || applicants.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Applicants</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            No applicants yet for this position
          </p>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Waiting for candidates to apply...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Applicants</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {applicants.length} {applicants.length === 1 ? 'candidate has' : 'candidates have'} applied for this position
            </p>
          </div>
          <Badge variant="secondary" className="text-base px-3 py-1">
            <Users className="h-4 w-4 mr-1" />
            {applicants.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="w-[120px]">Applied Date</TableHead>
                <TableHead className="w-[180px]">Interview Scheduled</TableHead>
                <TableHead className="text-right w-[220px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applicants.map((applicant) => (
                <TableRow key={applicant.id}>
                  <TableCell className="font-medium">
                    {applicant.studentName}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {applicant.email}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(applicant.appliedAt), {
                      addSuffix: true
                    })}
                  </TableCell>
                  <TableCell>
                    {applicant.interviewDate && applicant.interviewTime ? (
                      <Link href="/dashboard/recruiter/calendar">
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400">
                            <Calendar className="h-3.5 w-3.5" />
                            <span className="font-medium">
                              {format(new Date(applicant.interviewDate), "MMM d, yyyy")}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground pl-5">
                            {format(new Date(applicant.interviewTime), "h:mm a")}
                          </span>
                        </div>
                      </Link>
                    ) : (
                      <span className="text-sm text-muted-foreground">Not scheduled</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {applicant.interviewDate && applicant.interviewTime ? (
                        <>
                          <Badge variant="outline" className="text-blue-600 border-blue-200">
                            <Calendar className="h-3 w-3 mr-1" />
                            Scheduled
                          </Badge>
                          <RescheduleInterviewSheet
                            interviewId={applicant.id}
                            currentDate={applicant.interviewDate}
                            currentTime={applicant.interviewTime}
                            studentName={applicant.studentName}
                            jobTitle={job.title}
                            onRescheduled={handleScheduled}
                          >
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
                            >
                              <RefreshCw className="h-4 w-4 mr-1" />
                              Reschedule
                            </Button>
                          </RescheduleInterviewSheet>
                        </>
                      ) : (
                        <>
                          <ScheduleInterviewSheet
                            applicant={applicant}
                            job={job}
                            onScheduled={handleScheduled}
                          >
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Accept
                            </Button>
                          </ScheduleInterviewSheet>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
