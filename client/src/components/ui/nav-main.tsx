import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { type LucideIcon } from "lucide-react";
import { NavLink } from "react-router-dom";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarMenu className="flex flex-col gap-3 pt-8">
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <NavLink
              to={item.url}
              className={({ isActive }) =>
                `w-full ${
                  isActive
                    ? "bg-muted text-primary font-semibold shadow-inner rounded-lg"
                    : ""
                }`
              }
            >
              {({ isActive }) => (
                <SidebarMenuButton
                  tooltip={item.title}
                  className="flex items-center gap-3 px-2 py-3 cursor-pointer"
                >
                  {item.icon && (
                    <item.icon
                      className={`min-w-[1.25rem] min-h-[1.25rem] ${
                        isActive ? "text-primary" : "text-muted-foreground"
                      }`}
                      strokeWidth={2}
                    />
                  )}
                  <span
                    className={`text-base font-medium tracking-wide font-sans ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {item.title}
                  </span>
                </SidebarMenuButton>
              )}
            </NavLink>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
