import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/sidebar/sidebar";

import { Toaster } from "@/components/ui/sonner";
import { useScreenSizeStore } from "@/store/screenSizestate.store";
import { useState } from "react";
import AIChatModal, { FloatingAIButton } from "@/components/aiModal";

export const RootLayout: React.FC = () => {
  const mobileView = useScreenSizeStore((state) => state.mobileView);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  return (
    <main
      className={`flex ${
        mobileView && "flex-col-reverse"
      } h-dvh w-screen bg-background text-foreground `}
    >
      <Sidebar />
      <Outlet />
      {isAiModalOpen && <AIChatModal setIsAiModalOpen={setIsAiModalOpen} />}
      {!isAiModalOpen && (
        <FloatingAIButton setIsAiModalOpen={setIsAiModalOpen} />
      )}
      <Toaster closeButton richColors position="top-center" />
    </main>
  );
};
