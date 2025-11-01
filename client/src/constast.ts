const baseUrl = import.meta.env.VITE_API_BASE_URL;
const socketUrl = import.meta.env.VITE_SOCKET_URL;

const apiKey = import.meta.env.VITE_apiKey;
const authDomain = import.meta.env.VITE_authDomain;
const projectId = import.meta.env.VITE_projectId;
const storageBucket = import.meta.env.VITE_storageBucket;
const messagingSenderId = import.meta.env.VITE_messagingSenderId;
const appId = import.meta.env.VITE_appId;
const measurementId = import.meta.env.VITE_measurementId;
const vapidKey = import.meta.env.VITE_vapidKey;
const fallback_bannerImg = "https://images.unsplash.com/photo-1506765515384-028b60a970df?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
import fallback_profileImg from "@/assets/pfp.png"
const noPfpImg = "http://localhost:5173/src/assets/pfp.png"
import logo from "/favicon.png"
import googleIcon from "@/assets/google.svg"

export {
    fallback_profileImg,
    socketUrl,
    baseUrl,
    noPfpImg,
    fallback_bannerImg,
    logo,
    googleIcon,
}
import {
  BrainCircuit,
  ChartColumn,
  CreditCard,
  GalleryVerticalEnd,
  House,
  Key,
} from "lucide-react";

export const dashboardOptions = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  title: [
    {
      name: "PhotoGPT Devs",
      logo: GalleryVerticalEnd,
      plan: "",
    },
  ],
  navMain: [
    {
      title: "Home",
      url: "/dashboard",
      icon: House,
      isActive: true,
    },
    {
      title: "API Keys",
      url: "/dashboard/api-keys",
      icon: Key,
    },
    {
      title: "Usage",
      url: "/dashboard/usage",
      icon: ChartColumn,
    },
    {
      title: "Billings",
      url: "/dashboard/billing",
      icon: CreditCard,
    },
    {
      title: "Models",
      url: "/dashboard/models",
      icon: BrainCircuit,
    },
  ],
};

export const firebaseConfig = {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
    measurementId,
    vapidKey
}
