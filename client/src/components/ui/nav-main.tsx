import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { ChevronRight, FileText, type LucideIcon } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
  }[];
}) {
  const { pathname } = useLocation();
  const docsPaths = ["/docs", "/examples"];
  const isDocsGroupActive = docsPaths.includes(pathname);

  return (
    <SidebarGroup>
      <SidebarMenu className="flex flex-col gap-2 pt-4">
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
                      className={`min-w-[1.20rem] min-h-[1.20rem] ${
                        isActive ? "text-primary" : "text-muted-foreground"
                      }`}
                      strokeWidth={1.8}
                    />
                  )}
                  <span className="text-sm tracking-wide font-sans">
                    {item.title}
                  </span>
                </SidebarMenuButton>
              )}
            </NavLink>
          </SidebarMenuItem>
        ))}

        <Collapsible
          asChild
          defaultOpen={isDocsGroupActive}
          className="group/collapsible"
        >
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton
                tooltip="Docs"
                className="flex items-center gap-3 px-2 py-3 cursor-pointer"
              >
                <FileText
                  className={`min-w-[1.20rem] min-h-[1.20rem] ${
                    isDocsGroupActive ? "text-primary" : "text-muted-foreground"
                  }`}
                  strokeWidth={1.8}
                />
                <span className="text-sm tracking-wide font-sans">Docs</span>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <NavLink to="/docs">
                    {({ isActive }) => (
                      <SidebarMenuSubButton
                        className={`text-sm tracking-wide font-sans ${
                          isActive ? "text-primary font-semibold" : ""
                        }`}
                      >
                        API Reference
                      </SidebarMenuSubButton>
                    )}
                  </NavLink>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <NavLink to="/docs/examples">
                    {({ isActive }) => (
                      <SidebarMenuSubButton
                        className={`text-sm tracking-wide font-sans ${
                          isActive ? "text-primary font-semibold" : ""
                        }`}
                      >
                        Examples
                      </SidebarMenuSubButton>
                    )}
                  </NavLink>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  );
}
