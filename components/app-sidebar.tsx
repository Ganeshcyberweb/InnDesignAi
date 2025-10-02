import * as React from "react";

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
          isActive: true,
        },
        {
          title: "Design History",
          url: "/dashboard/history",
          icon: RiHistoryLine,
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
              {data.navMain[0]?.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="group/menu-button font-medium gap-3 h-9 rounded-md text-sidebar-foreground data-[active=true]:hover:bg-transparent data-[active=true]:bg-gradient-to-b data-[active=true]:from-sidebar-primary data-[active=true]:to-sidebar-primary/70 data-[active=true]:shadow-[0_1px_2px_0_rgb(0_0_0/.05),inset_0_1px_0_0_rgb(255_255_255/.12)] [&>svg]:size-auto"
                    isActive={item.isActive}
                  >
                    <a href={item.url}>
                      {item.icon && (
                        <item.icon
                          className="text-sidebar-foreground/70 group-data-[active=true]/menu-button:text-sidebar-primary-foreground"
                          size={22}
                          aria-hidden="true"
                        />
                      )}
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
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
              {data.navMain[1]?.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="group/menu-button font-medium gap-3 h-9 rounded-md text-sidebar-foreground [&>svg]:size-auto"
                    isActive={item.isActive}
                  >
                    <a href={item.url}>
                      {item.icon && (
                        <item.icon
                          className="text-sidebar-foreground/70 group-data-[active=true]/menu-button:text-sidebar-accent-foreground"
                          size={22}
                          aria-hidden="true"
                        />
                      )}
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
