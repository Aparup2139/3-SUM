import { Outlet } from "react-router-dom";

import { Toaster } from "@/components/ui/sonner";
import { AppSidebar } from "@/components/sidebar/sidebar";
import { useState } from "react";
import AIChatModal, { FloatingAIButton } from "@/components/aiModal";

export const RootLayout: React.FC = () => {
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  return (
    <main className="flex h-dvh w-screen bg-background text-foreground">
      <AppSidebar />
      <Outlet />
      {isAiModalOpen && <AIChatModal setIsAiModalOpen={setIsAiModalOpen} />}
      {!isAiModalOpen && (
        <FloatingAIButton setIsAiModalOpen={setIsAiModalOpen} />
      )}
      <Toaster closeButton richColors position="top-center" />
    </main>
  );
};
