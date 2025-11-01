import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function ComapanyTitle() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <Avatar className="h-7 w-7 rounded-lg">
              <AvatarImage
                src="https://www.photogptai.com/Assets/logo/logo-small-white.svg"
                className="invert dark:invert-0"
                alt="Logo"
              />
              <AvatarFallback className="text-foreground rounded-lg">
                P
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">PhotoGPT Platform</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
