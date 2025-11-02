import React, { useEffect } from "react";
import { ModeToggle } from "../toggleTheme/toggletheme";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/authContext";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { UserRound } from "lucide-react";
import { ProfileImageData } from "@/constast";

export const RootPageLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const scrollToId = location.state?.scrollToId;

    if (scrollToId) {
      const el = document.getElementById(scrollToId);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location, navigate]);

  const { user, loading } = useAuth()


  return (
    <main>
      <nav
        className="flex h-[7dvh] md:h-[9dvh] text-sidebar-foreground border-sidebar-border z-50 
        fixed top-0 left-1/2 -translate-x-1/2 w-full  items-center justify-between
          border-b bg-sidebar px-10 
        "
      >
        <div className="flex gap-4 font-bold  items-center justify-start">
          <div className="hidden  sm:block">
            <Link to="/">
              <svg
                width="36"
                height="40"
                viewBox="0 0 56 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M43 0C50.1797 6.44277e-07 56 5.8203 56 13C56 20.1797 50.1797 26 43 26H34.4844L48.4844 40H31.5156L15.7578 24.2422C14.672 23.1564 14 21.6569 14 20C14 16.6863 16.6863 14 20 14H43C43.5523 14 44 13.5523 44 13C44 12.4477 43.5523 12 43 12H20C15.5817 12 12 15.5817 12 20C12 22.3901 13.0482 24.5347 14.71 26H14.6875L28.6875 40H20C8.95431 40 0 31.0457 0 20C0 8.95431 8.9543 0 20 0H43Z"
                  fill="#3902FF"
                ></path>
                <path
                  d="M56 28V40H51.3125L39.3125 28H56Z"
                  fill="#3902FF"
                ></path>
              </svg>
            </Link>
          </div>
          <div className="sm:hidden flex gap-2 items-center relative">
            <span className="opacity-0">asdf</span>

            <div className="w-fit h-full fixed top-0 flex gap-2 items-center left-10 z-[310]">
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
              ></span>
              <svg
                width="36"
                height="40"
                viewBox="0 0 56 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M43 0C50.1797 6.44277e-07 56 5.8203 56 13C56 20.1797 50.1797 26 43 26H34.4844L48.4844 40H31.5156L15.7578 24.2422C14.672 23.1564 14 21.6569 14 20C14 16.6863 16.6863 14 20 14H43C43.5523 14 44 13.5523 44 13C44 12.4477 43.5523 12 43 12H20C15.5817 12 12 15.5817 12 20C12 22.3901 13.0482 24.5347 14.71 26H14.6875L28.6875 40H20C8.95431 40 0 31.0457 0 20C0 8.95431 8.9543 0 20 0H43Z"
                  fill="#3902FF"
                ></path>
                <path
                  d="M56 28V40H51.3125L39.3125 28H56Z"
                  fill="#3902FF"
                ></path>
              </svg>
            </div>
          </div>

          <h1 className="hidden sm:block">Mid-Events</h1>
        </div>
        <li className="flex gap-3 items-center">
          <ModeToggle />

          {!loading ? !user ?
            <Button
              className="rounded-3xl"
              onClick={() => navigate("/auth")}
              variant="outline"
            >
              Signup
            </Button> :
            <Avatar className="rounded-lg">
              <AvatarImage
                src={ProfileImageData.find(i => i.id === user?.profileImgUrl)?.url || ProfileImageData[0].url}
                alt="@evilrabbit"
              />
              <AvatarFallback><UserRound /></AvatarFallback>
            </Avatar>
            :
            <Skeleton className="w-9 sm:w-10 rounded-full border border-border aspect-square object-cover" />}


        </li>
      </nav>
      <section className="flex justify-center w-screen items-center">
        <Outlet />
        <Toaster closeButton richColors position="top-center" />
      </section>
    </main>
  );
};
