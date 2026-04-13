
import { AdminAnalyticsChartArea } from './_components/admin-analytics-chart-area'
import { AdminAnalyticsHeader } from './_components/admin-analytics-header'
import { Separator } from '@/components/ui/separator'
import { AdminAnalyticsBarChart } from './_components/admin-analytics-bar-chart'
import { AdminAnalyticsRadialChart } from './_components/admin-analytics-radial-chart'
import { db } from "@/drizzle/db"
import { user } from "@/drizzle/schema"
import { format, subDays, startOfMonth, subMonths, isAfter } from "date-fns"

const AdminAnalyticsPage = async () => {
    const allUsers = await db.select({
        role: user.role,
        createdAt: user.createdAt,
    }).from(user)

    const roleCounts = allUsers.reduce((acc, u) => {
        const r = u.role || 'other'
        acc[r] = (acc[r] || 0) + 1
        return acc
    }, {} as Record<string, number>)

    const radialChartData = Object.entries(roleCounts).map(([role, visitors]) => ({
        role: role.toLowerCase(),
        visitors,
        fill: `var(--color-${role.toLowerCase()})`,
    }))

    const areaChartDataMap: Record<string, { student: number; recruiter: number }> = {}
    const today = new Date()
    for (let i = 89; i >= 0; i--) {
        const d = format(subDays(today, i), "yyyy-MM-dd")
        areaChartDataMap[d] = { student: 0, recruiter: 0 }
    }
    allUsers.forEach(u => {
        if (!u.createdAt) return
        const d = format(u.createdAt, "yyyy-MM-dd")
        if (areaChartDataMap[d]) {
            if (u.role === "student") areaChartDataMap[d].student++
            else if (u.role === "recruiter") areaChartDataMap[d].recruiter++
        }
    })
    const areaChartData = Object.entries(areaChartDataMap).map(([date, counts]) => ({
        date,
        ...counts
    }))

    const barChartDataMap: Record<string, { student: number; recruiter: number }> = {}
    for (let i = 5; i >= 0; i--) {
        const m = format(subMonths(today, i), "MMM yyyy") 
        barChartDataMap[m] = { student: 0, recruiter: 0 }
    }
    const sixMonthsAgo = startOfMonth(subMonths(today, 5))
    allUsers.forEach(u => {
        if (!u.createdAt) return
        if (isAfter(u.createdAt, sixMonthsAgo) || format(u.createdAt, "yyyy-MM-dd") === format(sixMonthsAgo, "yyyy-MM-dd")) {
            const m = format(u.createdAt, "MMM yyyy")
            if (barChartDataMap[m]) {
                if (u.role === "student") barChartDataMap[m].student++
                else if (u.role === "recruiter") barChartDataMap[m].recruiter++
            }
        }
    })
    const barChartData = Object.entries(barChartDataMap).map(([month, counts]) => ({
        month,
        ...counts
    }))

    return (
        <div className='p-6 space-y-6'>
            <AdminAnalyticsHeader />

            <Separator className='bg-blue-500' />

            <AdminAnalyticsChartArea chartData={areaChartData} />

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <AdminAnalyticsBarChart chartData={barChartData} />
                <AdminAnalyticsRadialChart chartData={radialChartData} />
            </div>
        </div>
    )
}

export default AdminAnalyticsPage