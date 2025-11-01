import { Bell, CalendarArrowDown, Home, House, Info, LogOutIcon, MessageCircle, StickyNote, UserRoundPen, } from "lucide-react"
import { useEffect, useState, type ReactNode } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useScreenSizeStore } from "@/store/screenSizestate.store"
import { LogoutBox } from "../dialogbox/logout"
import { useUserStore } from "@/store/user.store"
import { Skeleton } from "../ui/skeleton"

import { fallback_profileImg } from "@/constast"

interface SidebarItem {
    text: string;
    icon: ReactNode;
}

export const Sidebar = () => {
    const { mobileView, changeMobileView } = useScreenSizeStore()
    const [ICON_SIZE, setIconSize] = useState<number>(25);
    const [logoSize, setLogoSize] = useState<number>(40);
    const [UppersidebarItems, setUppersidebarItems] = useState<SidebarItem[]>([]);

    useEffect(() => {
        if (mobileView) {
            setUppersidebarItems([
                {
                    text: "home",
                    icon: <House size={ICON_SIZE} />
                },
                {
                    text: "orders",
                    icon: <CalendarArrowDown size={ICON_SIZE} />
                },
                {
                    text: "Profile",
                    icon: <img
                        className="h-10 rounded-full  aspect-square object-cover"
                        src={useUserStore.getState().user.profileImgUrl || fallback_profileImg}>
                    </img>

                },
                {
                    text: "help",
                    icon: <Info size={ICON_SIZE} />
                },
                {
                    text: "Logout",
                    icon: <LogOutIcon size={ICON_SIZE} />
                }
            ]);
        }
        else {
            setUppersidebarItems([
                {
                    text: "",
                    icon: <svg width="36" height="40" viewBox="0 0 56 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M43 0C50.1797 6.44277e-07 56 5.8203 56 13C56 20.1797 50.1797 26 43 26H34.4844L48.4844 40H31.5156L15.7578 24.2422C14.672 23.1564 14 21.6569 14 20C14 16.6863 16.6863 14 20 14H43C43.5523 14 44 13.5523 44 13C44 12.4477 43.5523 12 43 12H20C15.5817 12 12 15.5817 12 20C12 22.3901 13.0482 24.5347 14.71 26H14.6875L28.6875 40H20C8.95431 40 0 31.0457 0 20C0 8.95431 8.9543 0 20 0H43Z" fill="#3902FF"></path>
                        <path d="M56 28V40H51.3125L39.3125 28H56Z" fill="#3902FF"></path>
                    </svg>
                },
                {
                    text: "home",
                    icon: <House size={ICON_SIZE} />
                },
                {
                    text: "Profile",
                    icon: <UserRoundPen size={ICON_SIZE} />
                },
                {
                    text: "orders",
                    icon: <CalendarArrowDown size={ICON_SIZE} />
                },
                {
                    text: "help",
                    icon: <Info size={ICON_SIZE} />
                },
                {
                    text: "Logout",
                    icon: <LogOutIcon size={ICON_SIZE} />
                }
            ]);
        }
    }, [mobileView, ICON_SIZE, logoSize]);


    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1100) {
                changeMobileView(true);
                setIconSize(20);
                setLogoSize(8);
            }
            else if (window.innerWidth < 400) {
                changeMobileView(true);
                setIconSize(18);
                setLogoSize(6);
            }
            else {
                changeMobileView(false);
                setIconSize(25);
                setLogoSize(10);
            }

        }
        handleResize()
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    return (<nav className={`flex  ${mobileView ? "sm:px-1  rounded-tr-2xl rounded-tl-2xl sm:pt-4 w-screen h-[10vh] flex-row" : "h-full  rounded-br-2xl  rounded-tr-2xl  w-fit pb-2 pt-1 px-4 flex-col xl:px-6"} 
       border border-sidebar-border 
    justify-between bg-popover text-popover-foreground`} >
        <ul className={`flex ${mobileView ? "flex-row items-center w-full" : "flex-col"} justify-center gap-4 p-2`} >
            {UppersidebarItems.map(item => <NavItem mobileView={mobileView} key={item.text} {...item} />)}
        </ul>
    </nav>)
}

const NavItem = ({ mobileView, text, icon }: { mobileView: boolean, text: string, icon: ReactNode }) => {
    const navRoute = useLocation().pathname.split('/');
    const navigation = useNavigate()
    const username = useUserStore((state) => state.user.name);

    let selected = false;
    if (text.toLowerCase() === "profile" && navRoute.length === 4) {
        selected = true;
    }
    else {
        selected = text.toLowerCase() === navRoute[navRoute.length - 1]
    }

    const handleNavigate = () => {
        if (!username) return;
        navigation("/" + text.toLowerCase())
    }

    const JSX = <span
        className={`${selected ? "bg-sidebar-accent text-sidebar-accent-foreground border-sidebar-border"
            : "border-transparent text-foreground"} items-center border rounded-sm flex py-2 cursor-pointer ${text === "Tubespace" ?
                `mb-6 gap-2 ${!mobileView ? "pl-3 pr-2" : ""}` : `gap-4 ${mobileView ? "px-2" : "px-5"} hover:border-sidebar-border `}" `} >
        <span>{icon}</span>
        {!mobileView && <h2 className={`${text === "Tubespace" && "mt-1 ml-1"}`} >{text}</h2>}

    </span>

    if (text.toLowerCase() === "logout")
        return <LogoutBox TriggerJsx={JSX} />

    return (<span
        onClick={handleNavigate}
        className={`${selected && username ? "bg-sidebar-accent text-sidebar-accent-foreground border-sidebar-border"
            : "border-transparent text-foreground"} items-center border rounded-sm flex py-2 cursor-pointer ${text === "Tubespace" ?
                `mb-6 gap-2 ${!mobileView ? "pl-3 pr-2" : ""}` : `gap-4 ${mobileView ? "px-2" : "px-5"} hover:border-sidebar-border `}" `} >
        {!username && text.toLowerCase() !== "tubespace" && <Skeleton className="h-[25px] w-[25px] rounded-full" />}
        {!username && !mobileView && text.toLowerCase() !== "tubespace" && <Skeleton className="h-[25px] w-[100px] rounded-sm" />}
        {(username || text.toLowerCase() === "tubespace") && <span>{icon}</span>}
        {(username || text.toLowerCase() === "tubespace") && !mobileView && <h2 className={`${text === "Tubespace" && "mt-1 ml-1"}`} >{text}</h2>}

    </span>)
}