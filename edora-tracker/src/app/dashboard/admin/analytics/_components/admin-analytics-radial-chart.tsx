"use client"

import { TrendingUp } from "lucide-react"
import { LabelList, RadialBar, RadialBarChart } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"

export const description = "A radial chart with a label"

const chartConfig = {
    visitors: {
        label: "Visitors",
    },
    admin: {
        label: "Admin",
        color: "var(--chart-1)",
    },
    recruiter: {
        label: "Recruiter",
        color: "var(--chart-2)",
    },
    student: {
        label: "Student",
        color: "var(--chart-3)",
    },
    mentor: {
        label: "Mentor",
        color: "var(--chart-4)",
    },
    professional: {
        label: "Professional",
        color: "var(--chart-5)",
    },
    other: {
        label: "Other",
        color: "var(--chart-1)"
    }
} satisfies ChartConfig

export function AdminAnalyticsRadialChart({ chartData = [] }: { chartData?: any[] }) {
    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Role Distribution</CardTitle>
                <CardDescription>All-time user roles</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <RadialBarChart
                        data={chartData}
                        startAngle={-90}
                        endAngle={380}
                        innerRadius={30}
                        outerRadius={110}
                    >
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel nameKey="role" />}
                        />
                        <RadialBar dataKey="visitors" background>
                            <LabelList
                                position="insideStart"
                                dataKey="role"
                                className="fill-white capitalize mix-blend-luminosity"
                                fontSize={11}
                            />
                        </RadialBar>
                    </RadialBarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 leading-none font-medium">
                    Total users across platform <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                    Showing distribution of different user types
                </div>
            </CardFooter>
        </Card>
    )
}
