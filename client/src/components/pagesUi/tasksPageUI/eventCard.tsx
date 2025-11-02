import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  EditIcon,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useOpenTaskUpdate } from "@/store/updateTaskSheet";
import { useState } from "react";
import TicketBookingModal from "@/components/ticketBookingModal";
import { v4 as uuidv4 } from 'uuid';

interface EventCardProps {
  admin?: boolean;
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
  basePrice?: number;
  priceMin?: number;
  priceMax?: number;
  currentPrice?: number;
  loading?: boolean;
  eventImageUrl?: string,
}

export default function EventCard({
  admin = false,
  id = uuidv4(),
  title = "Tech Innovators Summit 2025",
  short_description = "A premier event showcasing future technology trends.",
  start_date = new Date("2025-02-15T09:00:00Z"),
  end_date = new Date("2025-02-17T17:00:00Z"),
  location = "Bangalore International Exhibition Centre, India",
  category = ["Technology", "Conference"],
  totalTickets = 500,
  ticketsSold = 320,
  currentPrice = 2200,
  eventImageUrl,
  loading = false,
}: EventCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };
  console.log("admin:", admin);
  console.log("title:", title);
  const navigate = useNavigate();
  const ticketsAvailable = totalTickets - ticketsSold;
  const soldPercentage = ((ticketsSold / totalTickets) * 100).toFixed(1);
  const availabilityStatus =
    ticketsAvailable > 100
      ? "Available"
      : ticketsAvailable > 0
      ? "Limited"
      : "Sold Out";
  const setTaskId = useOpenTaskUpdate((state) => state.setTaskId);
  const [isBooking, setIsBooking] = useState(false);

  if (loading) {
    return (
      <Card className="overflow-hidden  border-slate-800 bg-slate-900/50 backdrop-blur w-full max-w-3xl">
        <Skeleton className="h-48 w-full bg-slate-800" />
        <CardHeader className="space-y-3">
          <Skeleton className="h-6 w-3/4 bg-slate-800" />
          <Skeleton className="h-4 w-full bg-slate-800" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="w-8 h-8 rounded-md bg-slate-800" />
              <Skeleton className="h-4 w-40 bg-slate-800" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }
  const handleTicketBooking = () => {
    setIsBooking(true);
  };

  return (
    <Card
      onClick={() => {
        if (!admin) {
          navigate("/home/event/" + id);
        }
      }}
      className="overflow-x border-slate-800 bg-slate-900/60 backdrop-blur w-full max-w-3xl shadow-md hover:shadow-lg transition-all duration-300"
    >
      {isBooking && (
        <TicketBookingModal
          eventId={id as string}
          eventName={title}
          ticketPrice={currentPrice}
          isOpen={isBooking}
          onClose={setIsBooking}
        />
      )}
      <div className="relative h-48 overflow-hidden">
        <img
          src={eventImageUrl}
          alt={title}
          className="w-full h-full object-cover opacity-90"
        />

        <div className="absolute top-3 right-3 flex gap-2">
          {category.map((cat) => (
            <Badge key={cat} className="bg-fuchsia-600 text-white border-0">
              {cat}
            </Badge>
          ))}
        </div>
      </div>

      <CardHeader className="space-y-2">
        <CardTitle className="text-xl font-semibold text-white">
          {title}
        </CardTitle>
        <CardDescription className="text-slate-300 text-sm leading-relaxed">
          {short_description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-300 text-sm">
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

        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-xs text-slate-500 mb-1">Current Price</p>
            <p className="text-lg font-bold text-white">
              ₹{currentPrice.toLocaleString()}
            </p>
          </div>
          <div className="flex gap-2">
            {admin ? (
              <Button
                onClick={() =>
                  navigate(`/admin-panel/analytics?id=${id}&title=${encodeURIComponent(title)}`)
                }
                variant="outline"
                className="bg-gradient-to-r from-purple-700 via-pink-700 to-orange-700 text-primary border-background hover:bg-slate-800"
              >
                <Sparkles /> Get Analytics
              </Button>
            ) : (
              <Button
                variant="outline"
                className="border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                Learn More
              </Button>
            )}
            {admin ? (
              <Button
                onClick={() => {
                  setTaskId(id as string);
                }}
                className="bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white border-0 disabled:opacity-50"
              >
                <EditIcon /> Edit Event
              </Button>
            ) : (
              <Button
                disabled={ticketsAvailable === 0}
                className="bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white border-0 disabled:opacity-50"
                onClick={handleTicketBooking}
              >
                {ticketsAvailable === 0 ? "Sold Out" : "Book Tickets"}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
