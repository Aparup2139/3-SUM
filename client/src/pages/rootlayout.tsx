import { Outlet } from "react-router-dom";

import { Toaster } from "@/components/ui/sonner";
import { AppSidebar } from "@/components/sidebar/sidebar";

export const RootLayout: React.FC = () => {
  return (
    <main className="flex h-dvh w-screen bg-background text-foreground">
      <AppSidebar />
      <Outlet />
      <Toaster closeButton richColors position="top-center" />
    </main>
  );
};
