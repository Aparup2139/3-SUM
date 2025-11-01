import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "@/lib/themprovider.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SidebarProvider } from "./components/ui/sidebar.tsx";
import { AuthProvider } from "./contexts/authContext.tsx";
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <SidebarProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </SidebarProvider>
    </AuthProvider>
  </QueryClientProvider>
);
