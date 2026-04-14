import { getAllUsers, getSystemLogs } from "@/app/actions/admin-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ActivityIcon,
  ShieldCheckIcon,
  UserCheckIcon,
  UserPlusIcon,
  UsersIcon,
  LogInIcon,
} from "lucide-react";
import { formatDistanceToNow, format, subMonths } from "date-fns";
import { ChartLineMultiple } from "./_components/chart-line-multiple";

const AdminDashboardHomePage = async () => {
  const [usersResult, logsResult] = await Promise.all([
    getAllUsers(),
    getSystemLogs()
  ]);

  const users = usersResult.success ? usersResult.data || [] : [];
  const logs = logsResult.success ? logsResult.data || [] : [];

  const chartData = Array.from({ length: 6 }).map((_, i) => {
    const d = subMonths(new Date(), 5 - i);
    const monthStr = format(d, "MMMM");
    const signupsCount = users.filter(
      (u) =>
        u.createdAt &&
        new Date(u.createdAt).getMonth() === d.getMonth() &&
        new Date(u.createdAt).getFullYear() === d.getFullYear()
    ).length;
    const signinsCount = logs.filter(
      (l) =>
        l.createdAt &&
        new Date(l.createdAt).getMonth() === d.getMonth() &&
        new Date(l.createdAt).getFullYear() === d.getFullYear()
    ).length;
    return { month: monthStr, signups: signupsCount, signins: signinsCount };
  });

  const stats = [
    {
      title: "Total Users",
      value: users.length,
      icon: UsersIcon,
      description: "Across all roles",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Admins",
      value: users.filter((u) => u.role === "admin").length,
      icon: ShieldCheckIcon,
      description: "Platform managers",
      color: "text-red-500",
      bg: "bg-red-500/10",
    },
    {
      title: "Mentors",
      value: users.filter((u) => u.role === "mentor").length,
      icon: UserPlusIcon,
      description: "Active educators",
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      title: "Students",
      value: users.filter((u) => u.role === "student").length,
      icon: UserCheckIcon,
      description: "Learning community",
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
  ];

  return (
    <div className="@container/main flex flex-1 flex-col gap-2 p-6 space-y-6">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight">
          Admin Overview
        </h1>
        <p className="text-muted-foreground text-sm ">
          Monitor your platform's growth and user activity at a glance.
        </p>
      </div>

      <Separator className="bg-blue-500" />

      <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
        {stats.map((stat) => (
          <Card key={stat.title} className="">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div
                className={`p-2 rounded-xl ${stat.bg} ${stat.color} transition-colors group-hover:bg-opacity-20`}
              >
                <stat.icon className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <ActivityIcon className="h-3 w-3 text-green-500" />
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartLineMultiple chartData={chartData} />

        <Card className="">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LogInIcon className="h-5 w-5 text-primary" />
              Recent Sign-ins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {logs.slice(0, 4).map((log) => {
                const user = log.user;
                return (
                  <div
                    key={log.id}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center font-bold text-primary">
                      {user.name?.[0] || user.email[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">
                        {user.name || "Anonymous"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        Signed in{" "}
                        {log.createdAt
                          ? formatDistanceToNow(new Date(log.createdAt), {
                            addSuffix: true,
                          })
                          : "unknown time ago"}
                      </p>
                    </div>
                    <div className="text-[10px] font-medium bg-primary/10 text-primary px-2 py-1 rounded-full uppercase">
                      {user.role}
                    </div>
                  </div>
                );
              })}
              {logs.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-8">
                  No sign-ins found
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardHomePage;
