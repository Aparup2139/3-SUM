import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";


export const LeftContent = () => {
  const { eventId: id } = useParams();


  const { data: event, isLoading } = useQuery<TaskDataType>({
    queryKey: ["fetchEventDetail", id],
    queryFn: () => fetchEvents(baseUrl + `events/${id}`),
    enabled: !!id,
  })


  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      <EventPage loading={isLoading} {...event} />
    </div>
  );
};

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import TicketBookingModal from "@/components/ticketBookingModal";
import { useQuery } from "@tanstack/react-query";
import type { TaskDataType } from "@/types/types";
import { fetchEvents } from "@/httpfnc/user";
import { baseUrl } from "@/constast";



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
  eventImageUrl?: string;
}

export default function EventPage({
  id ,
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
  eventImageUrl,
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
          src={eventImageUrl}
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
