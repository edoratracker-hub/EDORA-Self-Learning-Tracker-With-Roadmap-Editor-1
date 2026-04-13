import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

export const ExploreSectionSkeleton = () => {
    return (
        <div className="mx-auto max-w-3xl pt-6 space-y-6">            {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-xl border border-[#30363d] bg-[#161b22] p-5 space-y-4">
                <div className="flex items-center space-x-3">
                    <Skeleton className="h-10 w-10 rounded-full bg-[#30363d]" />
                    <div className="space-y-2">
                        <Skeleton className="h-3 w-[200px] bg-[#30363d]" />
                        <Skeleton className="h-2 w-[120px] bg-[#30363d]" />
                    </div>
                </div>
                <div className="space-y-2 py-2">
                    <Skeleton className="h-3 w-full bg-[#30363d]" />
                    <Skeleton className="h-3 w-[85%] bg-[#30363d]" />
                    <Skeleton className="h-3 w-[60%] bg-[#30363d]" />
                </div>
                <div className="flex gap-4 pt-2">
                    <Skeleton className="h-8 w-16 rounded-md bg-[#30363d]" />
                    <Skeleton className="h-8 w-16 rounded-md bg-[#30363d]" />
                    <Skeleton className="h-8 w-16 rounded-md bg-[#30363d]" />
                </div>
            </div>
        ))}
        </div>
    )
}
