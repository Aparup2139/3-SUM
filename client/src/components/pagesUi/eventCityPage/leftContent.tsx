import { useState } from "react"
import { Separator } from "@/components/ui/separator"
import { motion } from "framer-motion"
import { BrushCleaning } from "lucide-react"
import EventCard from "../tasksPageUI/eventCard"
import { useParams } from "react-router-dom"


export const LeftContent = () => {
    const [activeTab, setActiveTab] = useState<number>(1)

    const { cityName } = useParams();
    const { data: sampleEvents, isLoading } = useQuery<TaskDataType[]>({
        queryKey: ["fetchAllEvents", cityName],
        queryFn: () => fetchEvents(baseUrl + `events?city=${cityName}`),

    })


    const now = new Date()
    const upcomingEvents = sampleEvents
        ? sampleEvents.filter(event => new Date(event.start_date) > now)
        : [];

    const ongoingEvents = sampleEvents
        ? sampleEvents.filter(
            event =>
                new Date(event.start_date) <= now &&
                new Date(event.end_date) >= now
        )
        : [];

    const pastEvents = sampleEvents
        ? sampleEvents.filter(event => new Date(event.end_date) < now)
        : [];
    const renderEmptyState = (label: string) => (
        <div className="text-muted-foreground h-full text-sm flex flex-col gap-5 items-center justify-center">
            <h1 className="text-lg">No {label.toLowerCase()}.</h1>
            <BrushCleaning size={30} />
        </div>
    )

    const renderEvents = (events: typeof sampleEvents, label: string) => {
        console.log("Events to render:", events);
        if (!events) return renderEmptyState(label)
        if (isLoading) return Array.from({ length: 3 }).map((_, i) => <EventCard key={i} loading />)

        if (events.length === 0) return renderEmptyState(label)
        return events.map((event) => <EventCard key={event.id} {...event} />)
    }

    return (
        <div className="h-full w-full flex flex-col justify-center items-center">

            <div className="h-96 w-full mb- border-b border-secondary">
                <CityShowcase cityName={cityName || "Bangalore"} />
            </div>
            <div className="w-full">
                <div className="flex relative h-12 sm:h-10 w-full items-center text-xs sm:text-sm">
                    <Tab text="Upcoming Events" isActive={activeTab === 1} onClick={() => setActiveTab(1)} />
                    <Tab text="Ongoing Events" isActive={activeTab === 2} onClick={() => setActiveTab(2)} />
                    <Tab text="Past Events" isActive={activeTab === 3} onClick={() => setActiveTab(3)} />
                </div>
                <Separator orientation="horizontal" className="w-full" />
            </div>

            <div className="flex h-full py-5 items-center w-full flex-col gap-6 overflow-y-auto">
                {activeTab === 1 && renderEvents(upcomingEvents, "upcoming events")}
                {activeTab === 2 && renderEvents(ongoingEvents, "ongoing events")}
                {activeTab === 3 && renderEvents(pastEvents, "past events")}
            </div>

            <div className="w-full h-6">
                <Separator orientation="horizontal" className="w-full" />
            </div>

            <div className="text-xs text-muted-foreground w-full text-center mt-2">
                {activeTab === 1
                    ? "Upcoming events you can explore"
                    : activeTab === 2
                        ? "Events happening right now"
                        : "Past events that have concluded"}
            </div>
        </div>
    )
}

const Tab = ({
    text,
    isActive,
    onClick,
}: {
    text: string
    isActive: boolean
    onClick: () => void
}) => (
    <motion.div
        key={text}
        onClick={onClick}
        layout
        initial="initial"
        animate="animate"
        exit="exit"
        whileHover="hover"
        variants={{
            initial: { opacity: 0 },
            animate: { opacity: 1 },
        }}
        transition={{
            duration: 0.1,
            ease: "easeInOut",
        }}
        className={`cursor-pointer h-full flex justify-center items-center border-r px-5 transition-colors duration-300 ${isActive ? "bg-foreground/80 text-background border-border" : ""
            }`}
    >
        {text}
    </motion.div>
)


import {
    Building2,
    Landmark,
    Building,
    Castle,
    Trees,
    Mountain,
    BuildingIcon,
    Waves,
    Factory,
} from "lucide-react"
import type { TaskDataType } from "@/types/types"
import { useQuery } from "@tanstack/react-query"
import { baseUrl } from "@/constast"
import { fetchEvents } from "@/httpfnc/user"


// eslint-disable-next-line react-refresh/only-export-components
export const cityMeta = [
    {
        city: "Bangalore",
        icon: Building2,
        image: "https://images.unsplash.com/photo-1709967884183-7ffa9d168508?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YmVuZ2FsdXJ1fGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600",
        tagline: "India’s Silicon Valley of innovation and startups",
    },
    {
        city: "Mumbai",
        icon: Landmark,
        image: "https://images.unsplash.com/photo-1595658658481-d53d3f999875?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bXVtYmFpfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600",
        tagline: "The city that never sleeps — business meets culture",
    },
    {
        city: "Delhi",
        icon: Building,
        image: "https://plus.unsplash.com/premium_photo-1661919589683-f11880119fb7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZGVsaGl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600",
        tagline: "Capital of India — heritage meets power",
    },
    {
        city: "Hyderabad",
        icon: Castle,
        image: "https://images.unsplash.com/photo-1551161242-b5af797b7233?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1151",
        tagline: "City of pearls and emerging tech hub",
    },
    {
        city: "Chennai",
        icon: Trees,
        image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Q2hlbm5haXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600",
        tagline: "Coastal charm meets industrial might",
    },
    {
        city: "Pune",
        icon: BuildingIcon,
        image: "https://images.unsplash.com/photo-1553064483-f10fe837615f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHVuZSUyMGNpdHl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600",
        tagline: "Youth, education, and emerging IT powerhouse",
    },
    {
        city: "Kolkata",
        icon: Landmark,
        image: "https://plus.unsplash.com/premium_photo-1697730414399-3d4d9ada98bd?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8a29sa2F0YXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600",
        tagline: "The cultural capital — literature and art alive",
    },
    {
        city: "Goa",
        icon: Waves,
        image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z29hfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600",
        tagline: "Beaches, music, and creative freedom",
    },
    {
        city: "Ahmedabad",
        icon: Factory,
        image: "https://plus.unsplash.com/premium_photo-1697729749187-ec80a3f41969?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YWhtZWRhYmFkfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600",
        tagline: "Textile hub blending tradition with enterprise",
    },
    {
        city: "Jaipur",
        icon: Mountain,
        image: "https://plus.unsplash.com/premium_photo-1661963054563-ce928e477ff3?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8amFpcHVyfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600",
        tagline: "The pink city — art, architecture, and heritage",
    },
]

export function CityShowcase({ cityName }: { cityName: string }) {
    const cityData = cityMeta.find(
        (c) => c.city.toLowerCase() === cityName?.toLowerCase()
    );

    if (!cityData)
        return (
            <div className="h-72 sm:h-96 w-full flex items-center justify-center text-gray-400 border rounded-xl bg-muted">
                <p>No city data found</p>
            </div>
        );

    const Icon = cityData.icon;

    return (
        <div className="relative w-full h-full  overflow-hidden shadow-md">
            <img
                src={cityData.image}
                alt={cityData.city}
                className="absolute inset-0 w-full h-full object-cover brightness-[0.55]"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
                <Icon size={42} className="mb-3 text-white/90" />
                <h2 className="text-2xl font-bold tracking-tight">{cityData.city}</h2>
                <p className="text-sm mt-1 text-white/80 max-w-[80%]">{cityData.tagline}</p>
            </div>
        </div>
    );
}
