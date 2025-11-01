import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from "@/lib/themprovider.tsx"
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { firebaseConfig as fbc } from './constast.ts';

const { vapidKey, ...firebaseConfig } = fbc

const queryClient = new QueryClient();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/firebase-messaging-sw.js")
      .then((registration) => {
        console.log('posting message:', firebaseConfig);
        registration.active?.postMessage({
          type: "INIT_FIREBASE",
          config: firebaseConfig
        })
        console.log("Service Worker registered with scope:", registration.scope);
      })
      .catch((err) => {
        console.log("Service Worker registration failed:", err);
      });
  });
}

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </QueryClientProvider>
)