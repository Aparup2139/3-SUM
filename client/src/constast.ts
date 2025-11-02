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
const fallback_bannerImg =
  "https://images.unsplash.com/photo-1506765515384-028b60a970df?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
import fallback_profileImg from "@/assets/pfp.png";
const noPfpImg = "http://localhost:5173/src/assets/pfp.png";
import logo from "/favicon.png";
import googleIcon from "@/assets/google.svg";

export {
  fallback_profileImg,
  socketUrl,
  baseUrl,
  noPfpImg,
  fallback_bannerImg,
  logo,
  googleIcon,
};
import { Calendar, GalleryVerticalEnd, HelpCircle, House } from "lucide-react";

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
      url: "/home",
      icon: House,
      isActive: true,
    },
    {
      title: "Bookings",
      url: "/bookings",
      icon: Calendar,
    },
    {
      title: "Help & Support",
      url: "/help-support",
      icon: HelpCircle,
    },
  ],
};
export const ProfileImageData = [
  {
    id: "1",
    url: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: "2",
    url: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: "3",
    url: "https://randomuser.me/api/portraits/men/45.jpg",
  },
  {
    id: "4",
    url: "https://randomuser.me/api/portraits/men/67.jpg",
  },
  {
    id: "5",
    url: "https://randomuser.me/api/portraits/women/12.jpg",
  },
  {
    id: "6",
    url: "https://randomuser.me/api/portraits/women/28.jpg",
  },
  {
    id: "7",
    url: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: "8",
    url: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    id: "9",
    url: "https://randomuser.me/api/portraits/women/89.jpg",
  },
];

export const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
  measurementId,
  vapidKey,
};
