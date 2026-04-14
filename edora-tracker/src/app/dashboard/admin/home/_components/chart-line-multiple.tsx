"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

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

export const description = "A multiple line chart"

const chartConfig = {
    signins: {
        label: "Sign-ins",
        color: "var(--chart-1)",
    },
    signups: {
        label: "Signups",
        color: "var(--chart-2)",
    },
} satisfies ChartConfig

export function ChartLineMultiple({
    chartData,
}: {
    chartData: { month: string; signins: number; signups: number }[]
}) {
    // Basic trend analysis for the footer
    const currentMonth = chartData[chartData.length - 1];
    const previousMonth = chartData[chartData.length - 2];
    
    let trend = 0;
    if (currentMonth && previousMonth && previousMonth.signins > 0) {
        trend = ((currentMonth.signins - previousMonth.signins) / previousMonth.signins) * 100;
    }

    return (
        <Card className="">
            <CardHeader>
                <CardTitle>Platform Activity</CardTitle>
                <CardDescription>Last 6 Months</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="max-h-[300px] w-full">
                    <LineChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: -20,
                            right: 12,
                            top: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <YAxis 
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        <Line
                            dataKey="signins"
                            type="monotone"
                            stroke="var(--color-signins)"
                            strokeWidth={2}
                            dot={false}
                        />
                        <Line
                            dataKey="signups"
                            type="monotone"
                            stroke="var(--color-signups)"
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
            <CardFooter>
                <div className="flex w-full items-start gap-2 text-sm">
                    <div className="grid gap-2">
                        {trend > 0 ? (
                            <div className="flex items-center gap-2 leading-none font-medium">
                                Trending up by {trend.toFixed(1)}% this month <TrendingUp className="h-4 w-4 text-green-500" />
                            </div>
                        ) : trend < 0 ? (
                            <div className="flex items-center gap-2 leading-none font-medium text-red-500">
                                Trending down by {Math.abs(trend).toFixed(1)}% this month
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 leading-none font-medium">
                                Activity is stable this month
                            </div>
                        )}
                        <div className="flex items-center gap-2 leading-none text-muted-foreground">
                            Showing total sign-ins and signups
                        </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}
