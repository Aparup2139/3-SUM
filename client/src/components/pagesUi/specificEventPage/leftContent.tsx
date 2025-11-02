import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";


export const LeftContent = () => {
  const { eventId: id } = useParams();


  const { data: event, isLoading } = useQuery<TaskDataType>({
    queryKey: ["fetchEventDetail", id],
    queryFn: () => fetchEventsSpecific(baseUrl + `events/${id}`),
    enabled: !!id,
  })


  console.log("Event data in left content:", event, isLoading);

  return (
    <div className="h-full w-full flex flex-col justify-center items-center">

      {isLoading ?
        <EventPage loading={isLoading} /> : <EventPage {...event} />
      }
    </div>
  );
};

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Clock, Star, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import TicketBookingModal from "@/components/ticketBookingModal";
import { useQuery } from "@tanstack/react-query";
import type { TaskDataType } from "@/types/types";
import { fetchEvents, fetchEventsSpecific, fetchReviewsOfEvent } from "@/httpfnc/user";
import { baseUrl } from "@/constast";
import { callGemini } from "@/httpfnc/gemini";



interface EventPageProps {
  _id?: string;
  title?: string;
  short_description?: string;
  long_description?: string;
  organizer?: string;
  start_date?: Date;
  end_date?: Date;
  location?: string;
  category?: string;
  totalTickets?: number;
  ticketsSold?: number;
  currentPrice?: number;
  priceMin?: number;
  priceMax?: number;
  loading?: boolean;
  eventImageUrl?: string;
}

export default function EventPage({
  _id,
  title = "Tech Innovators Summit 2025",
  short_description = "A premier event showcasing future technology trends.",
  long_description = "Join global leaders, engineers, and developers to explore the latest in AI, IoT, and robotics. Includes workshops, networking, and panel discussions.",
  start_date = new Date("2025-02-15T09:00:00Z"),
  end_date = new Date("2025-02-17T17:00:00Z"),
  location = "Bangalore International Exhibition Centre, India",
  category,
  totalTickets = 500,
  ticketsSold = 320,
  currentPrice = 2200,
  loading = false,
  eventImageUrl,
}: EventPageProps) {

  const handleAISummary = async () => {
    try {
      setAiLoading(true);

      const allReviews = ReviewData.map((rev: any) => rev.comment).join("\n");
      const summary = await callGemini(
        `Summarize the following event reviews into a short paragraph highlighting overall sentiment, strengths, and weaknesses:\n${allReviews}`
      );
      if (summary)
        setAiSummary(summary);
    } catch (error) {
      console.error("AI Summary Error:", error);
      setAiSummary("Failed to generate AI summary.");
    } finally {
      setAiLoading(false);
    }
  };

  const [aiLoading, setAiLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  console.log('title:', title)
  const { data: ReviewData, isLoading } = useQuery({
    queryKey: ["getReveiewsOfEvents", _id],
    queryFn: () => fetchReviewsOfEvent(baseUrl + `reviews/event/${_id}`),
    enabled: !!_id
  })

  console.log("review Data:", ReviewData)

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


  const formatDate = (date?: string | Date) => {
    const d = date instanceof Date ? date : new Date(date);
    if (!date) return "N/A";
    if (isNaN(d.getTime())) return "Inval_id date";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(d);
  };

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
          eventId={_id as string}
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
          {category && (
            <Badge key={category} className="bg-fuchsia-600 text-white border-0">
              {category}
            </Badge>
          )}
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



      {isLoading ? (
        // 🔄 Skeleton while fetching review data
        <div className="max-w-5xl mx-auto px-6 pb-10 space-y-4">
          <h2 className="text-xl font-semibold text-white">Reviews</h2>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-4 bg-slate-900/50 rounded-lg border border-slate-800 space-y-3">
              <Skeleton className="h-4 w-3/4 bg-slate-800" />
              <Skeleton className="h-4 w-1/2 bg-slate-800" />
            </div>
          ))}
        </div>
      ) : ReviewData && ReviewData.length > 0 && (
        <div className="max-w-5xl mx-auto px-6 pb-10 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Reviews</h2>

            {/* ⚡ Sexy AI Button */}
            <Button
              onClick={handleAISummary}
              disabled={aiLoading}
              className={`flex items-center gap-2 transition-all duration-300 ${aiLoading
                ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                : "bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white hover:shadow-[0_0_15px_rgba(217,70,239,0.6)]"
                }`}
            >
              <Sparkles className="h-4 w-4" />
              {aiLoading ? "Summarizing..." : "Get AI Review Summary"}
            </Button>
          </div>

          {/* AI Response Output */}
          {aiLoading && (
            <div className="space-y-2 bg-slate-900/40 p-4 rounded-lg border border-slate-800">
              <Skeleton className="h-4 w-5/6 bg-slate-800" />
              <Skeleton className="h-4 w-4/6 bg-slate-800" />
              <Skeleton className="h-4 w-3/6 bg-slate-800" />
            </div>
          )}
          {!isLoading && aiSummary && (
            <div className="p-4 bg-slate-900/40 rounded-lg border border-slate-800 animate-fadeIn">
              <h3 className="font-semibold text-fuchsia-400 mb-2">AI Summary:</h3>
              <p className="text-slate-300 whitespace-pre-line">{aiSummary}</p>
            </div>
          )}

          {/* Reviews */}
          <div className="space-y-4">
            {ReviewData.map((review: any) => (
              <div
                key={review._id}
                className="p-4 bg-slate-900/50 rounded-lg border border-slate-800"
              >
                <p className="text-slate-300">{review.comment}</p>
                <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < review.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-slate-600"
                          }`}
                      />
                    ))}
                  </div>
                  <span className="italic text-slate-400">
                    — {review.user?.fullName || "Anonymous"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}


    </div>
  );
}
