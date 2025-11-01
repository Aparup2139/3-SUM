import { Outlet } from "react-router-dom"
import { Sidebar } from "@/components/sidebar/sidebar";

import { Toaster } from "@/components/ui/sonner"
import { useScreenSizeStore } from "@/store/screenSizestate.store";

export const RootLayout: React.FC = () => {
    const mobileView = useScreenSizeStore((state) => state.mobileView);
    return (
        <main className={`flex ${mobileView && "flex-col-reverse"} h-dvh w-screen bg-background text-foreground `}>
            <Sidebar />
            <Outlet />
            <Toaster closeButton richColors position="top-center" />
        </main>
    )
}
