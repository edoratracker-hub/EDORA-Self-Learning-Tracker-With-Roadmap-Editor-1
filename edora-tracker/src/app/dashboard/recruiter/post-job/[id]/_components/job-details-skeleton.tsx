import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export function JobDetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Job Info Card Skeleton */}
      <Card className="overflow-hidden border-border/60 shadow-sm">
        <div className="bg-muted/30 p-6 md:p-8 border-b border-border/60">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-4 w-full max-w-2xl">
              <div className="flex gap-3">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full border" />
                <Skeleton className="h-6 w-24 rounded-full border" />
              </div>
              <Skeleton className="h-10 w-3/4" />
              <div className="flex gap-2 items-center">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-5 w-32" />
              </div>
            </div>
          </div>
        </div>

        <CardContent className="p-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-border/60">
            {/* Main Content Column */}
            <div className="lg:col-span-2 p-6 md:p-8 space-y-8">
              {/* Skills */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-3">
                  <Skeleton className="h-4 w-32" />
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4].map((i) => (
                      <Skeleton key={i} className="h-7 w-20 rounded-full" />
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-32" />
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-7 w-20 rounded-full" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applicants Table Skeleton */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-7 w-16 rounded-full" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            {/* Table Header */}
            <div className="border-b p-4 bg-muted/40">
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full opacity-70" />
                ))}
              </div>
            </div>
            {/* Table Body */}
            <div>
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="grid grid-cols-2 md:grid-cols-6 gap-4 p-4 border-b last:border-0 items-center"
                >
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <div className="space-y-1.5 hidden md:block">
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-4 w-20 hidden md:block" />
                  <Skeleton className="h-4 w-24 hidden md:block" />
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <div className="flex justify-end gap-2">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
