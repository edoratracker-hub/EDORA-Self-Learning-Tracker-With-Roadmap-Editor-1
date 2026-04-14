import React from "react";
import { db } from "@/drizzle/db";
import { payments, user } from "@/drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { format } from "date-fns";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TagIcon, TrendingUpIcon, UsersIcon } from "lucide-react";

// Helper to deduce plan and coupon from amount
// Based on Pricing Section (USD * 85 INR)
// Pro Monthly: 765, Pro Yearly: 7650
// Pro Plus Monthly: 1615, Pro Plus Yearly: 16150
const getPlanDetails = (amount: number | null) => {
    if (!amount) return { plan: "Manual/Free", coupon: "None" };

    // Adjusting for Razorpay which might store amount in paise (amount * 100), but based on schema and context it might be direct INR.
    // We check standard amounts. If it doesn't match standard, we assume a coupon was applied.
    let plan = "Unknown";
    let coupon = "None";

    // Usually Razorpay stores paise so 765 INR = 76500
    const normalized = amount > 50000 ? amount / 100 : amount;

    if (normalized === 765) plan = "Pro (Monthly)";
    else if (normalized === 7650) plan = "Pro (Yearly)";
    else if (normalized === 1615) plan = "Pro Plus (Monthly)";
    else if (normalized === 16150) plan = "Pro Plus (Yearly)";
    else {
        // If we have random amounts, trying to guess
        if (normalized < 765) plan = "Pro (Monthly)";
        else plan = "Pro Plus";
        coupon = "Applied";
    }

    return { plan, coupon };
};

const SubscriptionsPage = async () => {
    const allPayments = await db
        .select({
            payment: payments,
            user: user,
        })
        .from(payments)
        .leftJoin(user, eq(payments.userId, user.id))
        .orderBy(desc(payments.createdAt));

    // Analytics
    let totalRevenue = 0;
    const planCounts: Record<string, number> = {};
    let couponsUsed = 0;

    allPayments.forEach(({ payment }) => {
        // calculate actual amount assuming Razorpay paise or straight INR
        const val = (payment.amount || 0);
        // If val is super huge, like 76500, it's paise.
        const realAmount = val > 50000 ? val / 100 : val;
        totalRevenue += realAmount;

        const { plan, coupon } = getPlanDetails(payment.amount);
        planCounts[plan] = (planCounts[plan] || 0) + 1;
        if (coupon !== "None") couponsUsed++;
    });

    const mostPopularPlan = Object.keys(planCounts).reduce(
        (a, b) => (planCounts[a] > planCounts[b] ? a : b),
        "N/A"
    );

    return (
        <div className="flex-1 space-y-6 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Subscriptions</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{totalRevenue.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">
                            Lifetime profit overview
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
                        <UsersIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{allPayments.length}</div>
                        <p className="text-xs text-muted-foreground">
                            Active subscriptions
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Most Popular</CardTitle>
                        <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{mostPopularPlan}</div>
                        <p className="text-xs text-muted-foreground">
                            Top choice among users
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Coupons Used</CardTitle>
                        <TagIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{couponsUsed}</div>
                        <p className="text-xs text-muted-foreground">
                            Discounts applied
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>
                        A detailed log of all subscription payments and associated users.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {allPayments.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                            No subscriptions found yet.
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Plan Type</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Coupon</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {allPayments.map(({ payment, user }) => {
                                    const { plan, coupon } = getPlanDetails(payment.amount);
                                    const normalizedAmount =
                                        (payment.amount || 0) > 50000
                                            ? (payment.amount || 0) / 100
                                            : payment.amount || 0;

                                    return (
                                        <TableRow key={payment.id}>
                                            <TableCell className="font-medium">
                                                {user?.name || "Unknown User"}
                                            </TableCell>
                                            <TableCell>{user?.email || "N/A"}</TableCell>
                                            <TableCell>{plan}</TableCell>
                                            <TableCell>₹{normalizedAmount.toFixed(2)}</TableCell>
                                            <TableCell>
                                                {coupon !== "None" ? (
                                                    <Badge variant="secondary" className="text-green-500 bg-green-500/10 hover:bg-green-500/20">Active</Badge>
                                                ) : (
                                                    <span className="text-muted-foreground">None</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        payment.status === "captured" || payment.status === "success"
                                                            ? "bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20"
                                                            : "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border-yellow-500/20"
                                                    }
                                                >
                                                    {payment.status || "Completed"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {payment.createdAt
                                                    ? format(new Date(payment.createdAt), "MMM d, yyyy")
                                                    : "N/A"}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default SubscriptionsPage;