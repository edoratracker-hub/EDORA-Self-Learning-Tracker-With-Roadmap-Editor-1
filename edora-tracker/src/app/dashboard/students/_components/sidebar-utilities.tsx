"use client";

import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { getNotifications } from "@/app/actions/collaboration-actions";

export function SidebarUtilities({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    external?: boolean;
  }[];
}) {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);

  // Poll for unread notification count
  useEffect(() => {
    const load = async () => {
      try {
        const res = await getNotifications();
        if (res.success) {
          const count = (res.notifications ?? []).filter((n: any) => !n.read).length;
          setUnreadCount(count);
        }
      } catch { /* ignore */ }
    };

    load();
    const interval = setInterval(load, 15_000); // poll every 15s
    return () => clearInterval(interval);
  }, []);

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col">
        <SidebarMenu className="">
          {items.map((item) => {
            const isInbox = item.title === "Inbox";
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  asChild
                  isActive={pathname === item.url}
                >
                  <Link href={item.url} {...(item.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
                {isInbox && unreadCount > 0 && (
                  <SidebarMenuBadge className="bg-blue-600 text-white text-[10px] font-semibold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </SidebarMenuBadge>
                )}
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
