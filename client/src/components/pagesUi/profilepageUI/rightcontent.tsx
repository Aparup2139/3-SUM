
import { useUserStore } from "@/store/user.store"

import { UserRole} from "@/types/types";
import { Skeleton } from "@/components/ui/skeleton";
// import { useCallback } from "react";
import { TrendingEventCard } from "../profilepageUI/trendingEventCard";




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
        category: ["Literature", "Culture"],
        totalTickets: 500,
        ticketsSold: 260,
        basePrice: 700,
        priceMin: 500,
        priceMax: 1000,
        currentPrice: 800,
    },
    {
        id: uuidv4();,
        title: "AI & Robotics World Forum",
        short_description: "Discussing AI ethics and automation’s future.",
        long_description:
            "Industry experts explore machine learning, robotics, and automation trends with live demos and research showcases.",
        organizer: "67254c0a8d5f1b1234567899",
        start_date: new Date("2025-12-10T09:00:00Z"),
        end_date: new Date("2025-12-12T18:00:00Z"),
        location: "NIMHANS Convention Centre, Bangalore",
        category: ["AI", "Robotics", "Technology"],
        totalTickets: 700,
        ticketsSold: 480,
        basePrice: 2500,
        priceMin: 2000,
        priceMax: 4000,
        currentPrice: 3100,
    },
];


export const RightContent = () => {
    const role = useUserStore((state) => state.user.role);
    // const fetchFnc = useCallback(() => {
    //     //getHotEvents
    // }, [role])

    // const { data, isLoading, error } = useQuery<TopEditorsData[]>({
    //     queryKey: ["top-editors", role],
    //     queryFn: fetchFnc,
    //     enabled: 
    //     staleTime: 1000 * 60 * 10, // 10 minutes
    // });

    // if (error) {
    //     toast.error("Failed to fetch top users. Please try again later.");
    // }

    const data = sampleEvents;

    return <div className="h-full w-full flex flex-col gap-20" >
        <div className=" h-[5%] w-full mb-10 " >
            <h1>Trending Events</h1>
            <p className="opacity-70 text-sm">
                Discover the latest high-impact events where creators, editors, and YouTubers are gaining traction.
                Browse top-performing tasks, recent uploads, and trending challenges to find opportunities to collaborate or showcase your work.
            </p>
        </div>
        {role === UserRole.NORMAL && <div className=" h-[3%] flex flex-col gap-1 w-full " >
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-6 w-[70%]" />
        </div>}
        {/* 
        {isLoading ? <div className="flex w-full overflow-y-scroll gap-5 items-center flex-col h-[97%]" >
            <UserCard loading />
            <UserCard loading />
            <UserCard loading />
            <UserCard loading />

        </div>
            :
            <div className="flex w-full overflow-y-scroll gap-5 items-start pr-4 flex-col h-[97%]" >
                {data && data.length > 0 && data.map(editor => <UserCard key={editor.id} {...editor} />)}
                {data && data.length === 0 && <div className="h-full w-full flex items-center justify-center text-gray-500" >
                    No Editors Found
                </div>}
            </div>} */}

        <div className="flex  bg-whit w-full overflow-y-scroll gap-5 items-start pr-4 flex-col h-[97%]" >
            {data && data.length > 0 && data.map(editor =>
                <TrendingEventCard key={editor.id} {...editor} />)

            }
            {data && data.length === 0 && <div className="h-full w-full flex items-center justify-center text-gray-500" >
                No Editors Found
            </div>}
        </div>
    </div>
}


