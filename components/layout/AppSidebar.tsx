"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  adminNavigationItems,
  agentNavigationItems,
  managerNavigationItems,
  type NavigationItem,
} from "./navigation-items";
import { cn } from "@/lib/utils/cn";
import { useAuthStore } from "@/stores/auth.store";
import { checkPermission } from "@/lib/permissions/rbac";
import { ArrowLeft } from "lucide-react";

export type AppSidebarType = "admin" | "agent" | "manager" | "all";

interface AppSidebarProps {
  type: AppSidebarType;
  title?: string;
}

function filterByPermission(items: NavigationItem[], user: { permissions?: string[]; role: string } | null): NavigationItem[] {
  if (!user) return items;
  return items.filter((item) => {
    if (!item.permission) return true;
    return checkPermission(user as Parameters<typeof checkPermission>[0], item.permission);
  });
}

function getNavigationItems(type: AppSidebarType, user: ReturnType<typeof useAuthStore.getState>["user"]): NavigationItem[] {
  switch (type) {
    case "admin":
      return filterByPermission(adminNavigationItems, user);
    case "agent":
      return filterByPermission(agentNavigationItems, user);
    case "manager":
      return filterByPermission(managerNavigationItems, user);
    case "all":
      return [
        ...filterByPermission(adminNavigationItems, user),
        ...filterByPermission(agentNavigationItems, user),
        ...filterByPermission(managerNavigationItems, user),
      ];
    default:
      return [];
  }
}

function renderMenuItem(item: NavigationItem, pathname: string | null, isCollapsed: boolean) {
  const Icon = item.icon;
  const isActive = pathname === item.url || pathname?.startsWith(item.url + "/");

  return (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        tooltip={item.title}
      >
        <Link href={item.url}>
          <Icon className="h-4 w-4" />
          <motion.span
            initial={false}
            animate={{
              opacity: isCollapsed ? 0 : 1,
              width: isCollapsed ? 0 : "auto",
            }}
            transition={{
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="overflow-hidden whitespace-nowrap"
          >
            {item.title}
          </motion.span>
          {item.badge && (
            <motion.span
              initial={false}
              animate={{
                opacity: isCollapsed ? 0 : 1,
                width: isCollapsed ? 0 : "auto",
              }}
              transition={{
                duration: 0.3,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground overflow-hidden"
            >
              {item.badge}
            </motion.span>
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function AppSidebar({ type, title }: AppSidebarProps) {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const items = getNavigationItems(type, user);
  const defaultTitle = type === "admin" ? "Admin Portal" : type === "agent" ? "Agent Interface" : type === "manager" ? "Manager Dashboard" : "All Routes";
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" variant="sidebar" >
      <SidebarHeader>
        <div className="flex h-16 items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <span className="text-sm font-bold">S</span>
          </div>
          <motion.div
            initial={false}
            animate={{
              opacity: isCollapsed ? 0 : 1,
              width: isCollapsed ? 0 : "auto",
            }}
            transition={{
              duration: 0.2,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="flex flex-col overflow-hidden"
          >
            <span className="text-sm font-semibold whitespace-nowrap">{title || defaultTitle}</span>
            <span className="text-xs text-muted-foreground whitespace-nowrap">Shunya</span>
          </motion.div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {renderMenuItem({ title: "Back", url: "/", icon: ArrowLeft }, pathname, isCollapsed)}
        </SidebarMenu>
        {type === "all" ? (
          <>
            <SidebarGroup>
              <SidebarGroupLabel>Admin</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {filterByPermission(adminNavigationItems, user).map((item) => renderMenuItem(item, pathname, isCollapsed))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Agent</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {filterByPermission(agentNavigationItems, user).map((item) => renderMenuItem(item, pathname, isCollapsed))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Manager</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {filterByPermission(managerNavigationItems, user).map((item) => renderMenuItem(item, pathname, isCollapsed))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        ) : (
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => renderMenuItem(item, pathname, isCollapsed))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
