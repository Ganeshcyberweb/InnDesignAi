"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import {
  RiSparklingLine,
  RiGalleryLine,
  RiHistoryLine,
  RiPaletteLine,
  RiBookOpenLine,
  RiQuestionLine,
  RiSettings3Line,
  RiHeartLine,
  RiCamera3Line,
} from "@remixicon/react";
import { ChevronRight } from "lucide-react";
import { useDesignHistoryStore } from "@/stores/design-history-store";
import { formatDistanceToNow } from "date-fns";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// Interior Design navigation data
const data = {
  navMain: [
    {
      title: "My Studio",
      url: "#",
      items: [
        {
          title: "Design Assistant",
          url: "/dashboard",
          icon: RiSparklingLine,
        },
        {
          title: "Design History",
          url: "/dashboard/history",
          icon: RiHistoryLine,
          hasSubItems: true,
        },
      ],
    },
    {
      title: "More",
      url: "#",
      items: [
        {
          title: "Design Guide",
          url: "/guide",
          icon: RiBookOpenLine,
        },
        {
          title: "Help & Support",
          url: "/help",
          icon: RiQuestionLine,
        },
        {
          title: "Settings",
          url: "/settings",
          icon: RiSettings3Line,
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { getAllDesigns, refreshIfStale } = useDesignHistoryStore();
  const [isHistoryOpen, setIsHistoryOpen] = React.useState(true);

  // Load recent designs when component mounts
  React.useEffect(() => {
    refreshIfStale();
  }, [refreshIfStale]);

  const recentDesigns = getAllDesigns().slice(0, 5); // Get last 5 designs

  return (
    <Sidebar {...props} className="dark border-sidebar-border bg-sidebar">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-3 px-2 py-2">
              <div className="flex aspect-square size-9 items-center justify-center rounded-md overflow-hidden bg-primary text-primary-foreground relative after:rounded-[inherit] after:absolute after:inset-0 after:shadow-[0_1px_2px_0_rgb(0_0_0/.05),inset_0_1px_0_0_rgb(255_255_255/.12)] after:pointer-events-none">
                <img
                  src="https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp2/logo-01_upxvqe.png"
                  width={36}
                  height={36}
                  alt="InnDesign"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid flex-1 text-left text-base leading-tight">
                <span className="truncate font-medium text-sidebar-foreground">
                  InnDesign
                </span>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* We only show the first parent group */}
        <SidebarGroup>
          <SidebarGroupLabel className="uppercase text-sidebar-foreground/50">
            {data.navMain[0]?.title}
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            <SidebarMenu>
              {data.navMain[0]?.items.map((item) => {
                // For /dashboard, only match exact path, not sub-routes
                // For other routes, match exact or sub-routes
                const isActive = item.url === '/dashboard'
                  ? pathname === item.url
                  : pathname === item.url || pathname?.startsWith(`${item.url}/`);

                // Special handling for Design History with dropdown
                if (item.hasSubItems) {
                  return (
                    <Collapsible
                      key={item.title}
                      open={isHistoryOpen}
                      onOpenChange={setIsHistoryOpen}
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            className="group/menu-button font-medium gap-3 h-9 rounded-md text-sidebar-foreground data-[active=true]:hover:bg-transparent data-[active=true]:bg-gradient-to-b data-[active=true]:from-sidebar-primary data-[active=true]:to-sidebar-primary/70 data-[active=true]:shadow-[0_1px_2px_0_rgb(0_0_0/.05),inset_0_1px_0_0_rgb(255_255_255/.12)] [&>svg]:size-auto data-[active=true]:text-white"
                            isActive={isActive}
                          >
                            <Link href={item.url} className="flex items-center gap-3 flex-1">
                              {item.icon && (
                                <item.icon
                                  className="text-sidebar-foreground/70 group-data-[active=true]/menu-button:text-white"
                                  size={22}
                                  aria-hidden="true"
                                />
                              )}
                              <span className="group-data-[active=true]/menu-button:text-white">{item.title}</span>
                            </Link>
                            <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub className="overflow-hidden">
                            {recentDesigns.length > 0 ? (
                              recentDesigns.map((design) => (
                                <SidebarMenuSubItem key={design.id}>
                                  <SidebarMenuSubButton asChild className="h-auto py-2 w-full overflow-hidden">
                                    <Link href={`/designs/${design.id}/history`} className="flex flex-col items-start gap-1 w-full min-w-0 max-w-full overflow-hidden">
                                      <div className="flex items-center justify-between w-full min-w-0 gap-2">
                                        <span className="truncate text-xs font-medium flex-shrink min-w-0 max-w-[70%]">
                                          Design #{design.id.slice(0, 6)}
                                        </span>
                                        <span className="text-xs text-sidebar-foreground/50 flex-shrink-0 text-right">
                                          {formatDistanceToNow(new Date(design.createdAt), {
                                            addSuffix: false,
                                          }).replace('about ', '')}
                                        </span>
                                      </div>
                                      <div>
                                        {design.description && (
                                        <span className="text-xs text-sidebar-foreground/60 line-clamp-2 w-full text-left break-all overflow-hidden hyphens-auto leading-tight">
                                          {design.description.length > 120 ? `${design.description.substring(0, 120)}...` : design.description}
                                        </span>
                                      )}
                                      </div>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))
                            ) : (
                              <SidebarMenuSubItem>
                                <SidebarMenuSubButton asChild>
                                  <div className="pointer-events-none">
                                    <span className="text-xs text-sidebar-foreground/50">
                                      No designs yet
                                    </span>
                                  </div>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            )}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }

                // Regular menu items
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className="group/menu-button font-medium gap-3 h-9 rounded-md text-sidebar-foreground data-[active=true]:hover:bg-transparent data-[active=true]:bg-gradient-to-b data-[active=true]:from-sidebar-primary data-[active=true]:to-sidebar-primary/70 data-[active=true]:shadow-[0_1px_2px_0_rgb(0_0_0/.05),inset_0_1px_0_0_rgb(255_255_255/.12)] [&>svg]:size-auto data-[active=true]:text-white"
                      isActive={isActive}
                    >
                      <Link href={item.url}>
                        {item.icon && (
                          <item.icon
                            className="text-sidebar-foreground/70 group-data-[active=true]/menu-button:text-white"
                            size={22}
                            aria-hidden="true"
                          />
                        )}
                        <span className="group-data-[active=true]/menu-button:text-white">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {/* Secondary Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="uppercase text-sidebar-foreground/50">
            {data.navMain[1]?.title}
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            <SidebarMenu>
              {data.navMain[1]?.items.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className="group/menu-button font-medium gap-3 h-9 rounded-md text-sidebar-foreground [&>svg]:size-auto"
                      isActive={isActive}
                    >
                      <Link href={item.url}>
                        {item.icon && (
                          <item.icon
                            className="text-sidebar-foreground/70 group-data-[active=true]/menu-button:text-sidebar-accent-foreground"
                            size={22}
                            aria-hidden="true"
                          />
                        )}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
