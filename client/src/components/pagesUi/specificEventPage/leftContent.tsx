import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';


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
    id: uuidv4(),
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
  const { eventId: id } = useParams();

  const event = sampleEvents.find((e) => e.id == id);

  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      <EventPage {...event} />
    </div>
  );
};

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import TicketBookingModal from "@/components/ticketBookingModal";



interface EventPageProps {
  id?: string;
  title?: string;
  short_description?: string;
  long_description?: string;
  organizer?: string;
  start_date?: Date;
  end_date?: Date;
  location?: string;
  category?: string[];
  totalTickets?: number;
  ticketsSold?: number;
  currentPrice?: number;
  priceMin?: number;
  priceMax?: number;
  loading?: boolean;
}

export default function EventPage({
  id : id = uuidv4(),
  title = "Tech Innovators Summit 2025",
  short_description = "A premier event showcasing future technology trends.",
  long_description = "Join global leaders, engineers, and developers to explore the latest in AI, IoT, and robotics. Includes workshops, networking, and panel discussions.",
  start_date = new Date("2025-02-15T09:00:00Z"),
  end_date = new Date("2025-02-17T17:00:00Z"),
  location = "Bangalore International Exhibition Centre, India",
  category = ["Technology", "Conference"],
  totalTickets = 500,
  ticketsSold = 320,
  currentPrice = 2200,
  loading = false,
}: EventPageProps) {
  const [isBooking, setIsBooking] = useState(false);
  const copyLnkToClipboard = (url?: string) => {
    try {
      const link = url || window.location.href;

      navigator.clipboard
        .writeText(link)
        .then(() => {
          toast.success("Link copied to clipboard!");
        })
        .catch(() => {
          // Fallback if clipboard API fails
          const textArea = document.createElement("textarea");
          textArea.value = link;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand("copy");
          document.body.removeChild(textArea);
          toast.success("Link copied (fallback mode)");
        });
    } catch (err) {
      console.error("Clipboard copy failed:", err);
      toast.error("Failed to copy link");
    }
  };

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);

  const ticketsAvailable = totalTickets - ticketsSold;
  const soldPercentage = ((ticketsSold / totalTickets) * 100).toFixed(1);
  const availabilityStatus =
    ticketsAvailable > 100
      ? "Available"
      : ticketsAvailable > 0
      ? "Limited"
      : "Sold Out";

  if (loading) {
    return (
      <div className="p-10 max-w-5xl mx-auto space-y-6">
        <Skeleton className="h-72 w-full rounded-xl bg-slate-800" />
        <Skeleton className="h-8 w-2/3 bg-slate-800" />
        <Skeleton className="h-4 w-full bg-slate-800" />
      </div>
    );
  }
  const handleTicketBooking = () => {
    setIsBooking(true);
  };
  return (
    <div className="w-full bg-slate-950 text-slate-100 h-full overflow-y-scroll">
      {isBooking && (
        <TicketBookingModal
          eventId={id as string}
          eventName={title}
          isOpen={isBooking}
          onClose={setIsBooking}
          ticketPrice={currentPrice}
        />
      )}
      <div className="relative w-full h-80 ">
        <img
          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600&h=600&fit=crop"
          alt={title}
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>

        <div className="absolute top-4 right-4 flex flex-wrap gap-2">
          {category.map((cat) => (
            <Badge key={cat} className="bg-fuchsia-600 text-white border-0">
              {cat}
            </Badge>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">
        {/* Title and Description */}
        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
          <p className="text-slate-300 text-lg leading-relaxed">
            {short_description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-slate-300 text-sm bg-slate-900/50 p-6 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-400" />
            <span>
              {formatDate(start_date)} → {formatDate(end_date)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-orange-400" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-400" />
            <span>
              {soldPercentage}% sold ({ticketsSold}/{totalTickets})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-green-400" />
            <span>
              {availabilityStatus} ({ticketsAvailable} left)
            </span>
          </div>
        </div>

        {/* Long Description */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white">About the Event</h2>
          <p className="text-slate-300 leading-relaxed">{long_description}</p>
        </div>

        {/* Pricing and Actions */}
        <div className="flex flex-wrap items-center justify-between gap-6 p-6 rounded-xl bg-slate-900/40 border border-slate-800">
          <div>
            <p className="text-xs text-slate-500 mb-1">Current Price</p>
            <p className="text-2xl font-bold text-white">
              ₹{currentPrice.toLocaleString()}
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => copyLnkToClipboard()}
              variant="outline"
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Share Event
            </Button>
            <Button
              disabled={ticketsAvailable === 0}
              className="bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white border-0 disabled:opacity-50"
              onClick={handleTicketBooking}
            >
              {ticketsAvailable === 0 ? "Sold Out" : "Book Tickets"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
