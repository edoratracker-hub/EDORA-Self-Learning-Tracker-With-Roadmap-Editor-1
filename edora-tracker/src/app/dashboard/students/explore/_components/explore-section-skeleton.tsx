import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

export const ExploreSectionSkeleton = () => {
    return (
        <div className="space-y-6 w-full">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="rounded-xl border p-5 space-y-4">
                    <div className="flex items-center space-x-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-3 w-full" />
                            <Skeleton className="h-2 w-full" />
                        </div>
                    </div>
                    <div className="space-y-2 py-2">
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-[85%]" />
                        <Skeleton className="h-3 w-[60%]" />
                    </div>
                    <div className="flex gap-4 pt-2">
                        <Skeleton className="h-8 w-16 rounded-md" />
                        <Skeleton className="h-8 w-16 rounded-md" />
                        <Skeleton className="h-8 w-16 rounded-md" />
                    </div>
                </div>
            ))}
        </div>
    )
}
