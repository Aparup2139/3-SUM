import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { ComapanyTitle } from "../ui/company-title";
import { dashboardOptions } from "@/constast";
import { NavMain } from "../ui/nav-main";
import { NavUser } from "../ui/nav-user";

const user = {
  name: "John Doe",
  email: "john.doe@example.com",
  avatar: "https://via.placeholder.com/150",
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="bg-sidebar-accent text-sidebar-accent-foreground border-sidebar-border">
        <ComapanyTitle />
      </SidebarHeader>
      <SidebarContent className="bg-sidebar-accent text-sidebar-accent-foreground border-sidebar-border">
        <NavMain items={dashboardOptions.navMain} />
      </SidebarContent>
      <SidebarFooter className="bg-sidebar-accent text-sidebar-accent-foreground border-sidebar-border">
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
