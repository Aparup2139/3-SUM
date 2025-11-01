import { useState } from "react"
import { Separator } from "@/components/ui/separator"
import { motion } from "framer-motion"
import { BrushCleaning } from "lucide-react"
import { useUserStore } from "@/store/user.store"
import EventCard from "./eventCard"

export const cityArray = [
    "Bangalore",
    "Mumbai",
    "Delhi",
    "Hyderabad",
    "Chennai",
    "Pune",
    "Kolkata",
    "Goa",
    "Ahmedabad",
    "Jaipur"
];



const sampleEvents = [
    {
        id: "67254c0a8d5f1b1000000001",
        title: "Tech Innovators Summit 2025",
        short_description: "A premier event showcasing future technology trends.",
        long_description:
            "Join global leaders, engineers, and developers to explore the latest in AI, IoT, and robotics. Includes workshops and panel discussions.",
        organizer: "67254c0a8d5f1b1234567890",
        start_date: new Date("2025-02-15T09:00:00Z"),
        end_date: new Date("2025-02-17T17:00:00Z"),
        location: "Bangalore International Exhibition Centre, India",
        city: "Bangalore",
        category: ["Technology", "Conference"],
        totalTickets: 500,
        ticketsSold: 320,
        basePrice: 2000,
        priceMin: 1500,
        priceMax: 3500,
        currentPrice: 2200,
    },
    {
        id: "67254c0a8d5f1b1000000002",
        title: "CodeCraft Hackathon 2025",
        short_description: "A 48-hour coding challenge for developers worldwide.",
        long_description:
            "Compete with top programmers to solve real-world problems using AI and full-stack technologies. Exciting prizes and mentorship await!",
        organizer: "67254c0a8d5f1b1234567891",
        start_date: new Date("2025-03-10T08:00:00Z"),
        end_date: new Date("2025-03-12T20:00:00Z"),
        location: "IIT Delhi, New Delhi",
        city: "Delhi",
        category: ["Hackathon", "Technology"],
        totalTickets: 300,
        ticketsSold: 290,
        basePrice: 500,
        priceMin: 300,
        priceMax: 1000,
        currentPrice: 700,
    },
    {
        id: "67254c0a8d5f1b1000000003",
        title: "Fusion Beats Fest",
        short_description: "A weekend of electrifying music and performances.",
        long_description:
            "Celebrate music across genres with top DJs, indie artists, and live bands. Food trucks and merch stalls included.",
        organizer: "67254c0a8d5f1b1234567892",
        start_date: new Date("2025-04-05T16:00:00Z"),
        end_date: new Date("2025-04-07T23:00:00Z"),
        location: "Goa Beach Arena, India",
        city: "Goa",
        category: ["Music", "Festival"],
        totalTickets: 1000,
        ticketsSold: 780,
        basePrice: 1500,
        priceMin: 1000,
        priceMax: 3000,
        currentPrice: 2200,
    },
    {
        id: "67254c0a8d5f1b1000000004",
        title: "Startup Connect Expo",
        short_description: "Where founders meet investors.",
        long_description:
            "A networking event bringing together startups, venture capitalists, and incubators for collaboration and funding opportunities.",
        organizer: "67254c0a8d5f1b1234567893",
        start_date: new Date("2025-06-20T10:00:00Z"),
        end_date: new Date("2025-06-22T18:00:00Z"),
        location: "Mumbai Convention Center",
        city: "Mumbai",
        category: ["Business", "Networking"],
        totalTickets: 600,
        ticketsSold: 410,
        basePrice: 2500,
        priceMin: 2000,
        priceMax: 4000,
        currentPrice: 2800,
    },
    {
        id: "67254c0a8d5f1b1000000005",
        title: "EcoLife Expo 2025",
        short_description: "Sustainability and green tech exhibition.",
        long_description:
            "Showcasing innovations in renewable energy, sustainable housing, and eco-friendly products with global participants.",
        organizer: "67254c0a8d5f1b1234567897",
        start_date: new Date("2025-07-12T09:00:00Z"),
        end_date: new Date("2025-07-14T17:00:00Z"),
        location: "Chennai Trade Centre",
        city: "Chennai",
        category: ["Environment", "Technology"],
        totalTickets: 600,
        ticketsSold: 390,
        basePrice: 1200,
        priceMin: 900,
        priceMax: 2000,
        currentPrice: 1500,
    },
    {
        id: "67254c0a8d5f1b1000000006",
        title: "Artistry Gala 2025",
        short_description: "An exhibition of modern art and sculpture.",
        long_description:
            "Discover the creativity of renowned and emerging artists. Includes live art performances, auctions, and workshops.",
        organizer: "67254c0a8d5f1b1234567894",
        start_date: new Date("2025-08-15T11:00:00Z"),
        end_date: new Date("2025-08-17T20:00:00Z"),
        location: "Lalit Kala Akademi, New Delhi",
        city: "Delhi",
        category: ["Art", "Exhibition"],
        totalTickets: 400,
        ticketsSold: 180,
        basePrice: 800,
        priceMin: 500,
        priceMax: 1200,
        currentPrice: 950,
    },
    {
        id: "67254c0a8d5f1b1000000007",
        title: "Fitness Fusion 2025",
        short_description: "A celebration of health and fitness.",
        long_description:
            "Experience live fitness sessions, yoga, Zumba, and nutrition workshops with experts from around the world.",
        organizer: "67254c0a8d5f1b1234567895",
        start_date: new Date("2025-09-05T07:00:00Z"),
        end_date: new Date("2025-09-06T18:00:00Z"),
        location: "Hyderabad Sports Complex",
        city: "Hyderabad",
        category: ["Health", "Fitness"],
        totalTickets: 800,
        ticketsSold: 500,
        basePrice: 1000,
        priceMin: 700,
        priceMax: 1800,
        currentPrice: 1200,
    },
    {
        id: "67254c0a8d5f1b1000000008",
        title: "CyberShield Summit",
        short_description: "Exploring the future of cybersecurity.",
        long_description:
            "An event dedicated to security experts, researchers, and IT professionals to discuss emerging threats and digital defense.",
        organizer: "67254c0a8d5f1b1234567896",
        start_date: new Date("2025-10-02T09:00:00Z"),
        end_date: new Date("2025-10-03T18:00:00Z"),
        location: "CyberCity, Pune",
        city: "Pune",
        category: ["Technology", "Security"],
        totalTickets: 350,
        ticketsSold: 220,
        basePrice: 1800,
        priceMin: 1500,
        priceMax: 2500,
        currentPrice: 2000,
    },
    {
        id: "67254c0a8d5f1b1000000009",
        title: "Global Literature Fest",
        short_description: "Where stories meet the world.",
        long_description:
            "A literary carnival featuring authors, poets, and readers from across the globe. Panel talks, book signings, and open mics await.",
        organizer: "67254c0a8d5f1b1234567898",
        start_date: new Date("2025-11-01T10:00:00Z"),
        end_date: new Date("2025-11-03T18:00:00Z"),
        location: "Kolkata Book Arena",
        city: "Kolkata",
        category: ["Literature", "Culture"],
        totalTickets: 500,
        ticketsSold: 260,
        basePrice: 700,
        priceMin: 500,
        priceMax: 1000,
        currentPrice: 800,
    },
    {
        id: "67254c0a8d5f1b1000000010",
        title: "AI & Robotics World Forum",
        short_description: "Discussing AI ethics and automation’s future.",
        long_description:
            "Industry experts explore machine learning, robotics, and automation trends with live demos and research showcases.",
        organizer: "67254c0a8d5f1b1234567899",
        start_date: new Date("2025-12-10T09:00:00Z"),
        end_date: new Date("2025-12-12T18:00:00Z"),
        location: "NIMHANS Convention Centre, Bangalore",
        city: "Bangalore",
        category: ["AI", "Robotics", "Technology"],
        totalTickets: 700,
        ticketsSold: 480,
        basePrice: 2500,
        priceMin: 2000,
        priceMax: 4000,
        currentPrice: 3100,
    },
];


export const LeftContent = () => {
    const role = useUserStore((state) => state.user.role)
    const id = useUserStore((state) => state.user.id)
    const [activeTab, setActiveTab] = useState<number>(1)
    const isLoading = false

    const now = new Date()

    const upcomingEvents = sampleEvents.filter(event => event.start_date > now)
    const ongoingEvents = sampleEvents.filter(
        event => event.start_date <= now && event.end_date >= now
    )
    const pastEvents = sampleEvents.filter(event => event.end_date < now)

    const renderEmptyState = (label: string) => (
        <div className="text-muted-foreground h-full text-sm flex flex-col gap-5 items-center justify-center">
            <h1 className="text-lg">No {label.toLowerCase()}.</h1>
            <BrushCleaning size={30} />
        </div>
    )

    const renderEvents = (events: typeof sampleEvents, label: string) => {

        if (isLoading) return Array.from({ length: 3 }).map((_, i) => <EventCard key={i} loading />)

        if (events.length === 0) return renderEmptyState(label)
        return events.map((event) => <EventCard key={event.id} {...event} />)
    }

    return (
        <div className="h-full w-full flex flex-col justify-center items-center">
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
