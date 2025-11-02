import { useState } from "react";
import { motion } from "framer-motion";
import { BrushCleaning } from "lucide-react";
import EventCard from "../tasksPageUI/eventCard";
import BookedTicketCard from "./bookingsCard";
import { useQuery } from "@tanstack/react-query";
import type { BookingType } from "@/types/types";
import { fetchBookedEvents } from "@/httpfnc/user";
import { baseUrl } from "@/constast";
import { Separator } from "@/components/ui/separator";

export const LeftContent = () => {
  const [activeTab, setActiveTab] = useState<number>(1);
  const { data: bookings, isLoading } = useQuery<BookingType[]>({
    queryKey: ["fetchUserEvents"],
    queryFn: () => fetchBookedEvents(baseUrl + `events/user`),
  });

  const now = new Date();

  console.log("bookings", bookings);
  const upcomingEvents = bookings
    ? bookings.filter((booking) => new Date(booking.event.start_date) > now)
    : [];

  const ongoingEvents = bookings
    ? bookings.filter(
        (booking) =>
          new Date(booking.event.start_date) <= now &&
          new Date(booking.event.end_date) >= now
      )
    : [];

  console.log("upcoing events0 ", upcomingEvents);

  const pastEvents = bookings
    ? bookings.filter((booking) => new Date(booking.event.end_date) < now)
    : [];


  console.log("upcoing events0 ", upcomingEvents);

  const renderEmptyState = (label: string) => (
    <div className="text-muted-foreground h-full text-sm flex flex-col gap-5 items-center justify-center">
      <h1 className="text-lg">No {label.toLowerCase()}.</h1>
      <BrushCleaning size={30} />
    </div>
  );

  const renderEvents = (events: BookingType[] | undefined, label: string) => {
    if (isLoading)
      return Array.from({ length: 3 }).map((_, i) => (
        <EventCard key={i} loading />
      ));

    if (events?.length === 0) return renderEmptyState(label);
    return events?.map((event) => (
      <BookedTicketCard
        pastEvent={event.event.end_date < now}
        key={event._id}
        {...event}
      />
    ));
  };

  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      <div className="w-full">
        <div className="flex relative h-12 sm:h-10 w-full items-center text-xs sm:text-sm">
          <Tab
            text="Ongoing/Upcoming Booked Events"
            isActive={activeTab === 1}
            onClick={() => setActiveTab(1)}
          />
          <Tab
            text="Past Booked Events"
            isActive={activeTab === 2}
            onClick={() => setActiveTab(2)}
          />
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
  );
};

const Tab = ({
  text,
  isActive,
  onClick,
}: {
  text: string;
  isActive: boolean;
  onClick: () => void;
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
    className={`cursor-pointer h-full flex justify-center items-center border-r px-5 transition-colors duration-300 ${
      isActive ? "bg-foreground/80 text-background border-border" : ""
    }`}
  >
    {text}
  </motion.div>
);
