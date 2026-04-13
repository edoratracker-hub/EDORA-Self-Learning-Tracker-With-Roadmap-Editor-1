import { getAllUsers } from "@/app/actions/admin-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ActivityIcon,
  ShieldCheckIcon,
  UserCheckIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react";

const AdminDashboardHomePage = async () => {
  const result = await getAllUsers();

  const users = result.success ? result.data || [] : [];

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
        <Card className="">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ActivityIcon className="h-5 w-5 text-primary" />
              Platform Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center border-2 border-dashed rounded-xl bg-muted/20">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Activity visualization coming soon
                </p>
                <div className="mt-4 flex gap-2 justify-center">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-8 bg-primary/20 rounded-t-md"
                      style={{ height: `${Math.random() * 100 + 20}px` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlusIcon className="h-5 w-5 text-primary" />
              Recent Signups
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users
                .slice(-4)
                .reverse()
                .map((user) => (
                  <div
                    key={user.id}
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
                        {user.email}
                      </p>
                    </div>
                    <div className="text-[10px] font-medium bg-primary/10 text-primary px-2 py-1 rounded-full uppercase">
                      {user.role}
                    </div>
                  </div>
                ))}
              {users.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-8">
                  No users found
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
