import React from "react";
import { getSystemLogs } from "@/app/actions/admin-actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollText, Clock, Monitor, Globe } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default async function AdminLogsPage() {
  const result = await getSystemLogs();

  if (!result.success || !result.data) {
    return (
      <div className="p-8 text-center text-destructive">
        {result.error || "Failed to load system logs"}
      </div>
    );
  }

  const logs = result.data;

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <ScrollText className="h-8 w-8 text-primary" />
          System Logs
        </h1>
        <p className="text-muted-foreground mt-1">
          Monitor real-time user session activity and login details.
        </p>
      </div>

      <Separator className="bg-blue-500" />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead>User</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Device / Browser</TableHead>
              <TableHead>Login Time</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No active sessions found.
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log: any) => (
                <TableRow
                  key={log.id}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">
                        {log.user?.name || "Anonymous"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {log.user?.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="h-3 w-3 text-muted-foreground" />
                      {log.ipAddress || "Unknown"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground max-w-[200px] truncate">
                      <Monitor className="h-3 w-3" />
                      {log.userAgent || "Unknown Device"}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-medium">
                    {new Date(log.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-green-500/10 text-green-500 border-green-500/20"
                    >
                      Active
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
