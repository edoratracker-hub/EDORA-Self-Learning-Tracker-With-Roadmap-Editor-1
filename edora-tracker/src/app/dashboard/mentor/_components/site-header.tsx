"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MentorDashboardPaths } from "@/lib/mentor-dashboard-paths";

import { CommandManyItems } from "./searchbar-command";
import { Button } from "@/components/ui/button";
import { BellIcon, Calendar1Icon, SettingsIcon } from "lucide-react";

export function SiteHeader() {
  const pathname = usePathname();

  // Generate breadcrumbs from pathname
  const generateBreadcrumbs = () => {
    const paths = pathname.split("/").filter(Boolean);
    const breadcrumbs = [];

    // Build cumulative paths
    let currentPath = "";
    for (let i = 0; i < paths.length; i++) {
      currentPath += `/${paths[i]}`;

      // Find matching nav item for better labels
      const navItem = MentorDashboardPaths.navMain.find(
        (item) => item.url === currentPath,
      );

      breadcrumbs.push({
        label:
          navItem?.title ||
          paths[i].charAt(0).toUpperCase() + paths[i].slice(1),
        href: currentPath,
        isLast: i === paths.length - 1,
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) px-6 rounded-t-xl">
      <div className="flex w-full items-center gap-1 lg:gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.href} className="flex items-center gap-2">
                <BreadcrumbItem>
                  {crumb.isLast ? (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={crumb.href}>{crumb.label}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
              </div>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <CommandManyItems />

      <Button variant="outline" size="icon" asChild>
        <Link href="/dashboard/mentor/settings">
          <SettingsIcon />
        </Link>
      </Button>

      <Button variant="outline" size="icon" asChild>
        <Link href="/dashboard/mentor/calendar">
          <Calendar1Icon />
        </Link>
      </Button>


    </header>
  );
}
