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
  DownloadIcon,
  Loader,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { jsPDF } from "jspdf";

interface EventCardProps {
  pastEvent: boolean;
  _id?: string;
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
  qrCodeUrl?: string;
  currentPrice?: number;
  loading?: boolean;
}

export default function BookedTicketCard({
  pastEvent,
  _id,
  title = "Tech Innovators Summit 2025",
  short_description = "A premier event showcasing future technology trends.",
  start_date = new Date("2025-02-15T09:00:00Z"),
  end_date = new Date("2025-02-17T17:00:00Z"),
  location = "Bangalore International Exhibition Centre, India",
  totalTickets = 500,
  ticketsSold = 320,
  currentPrice = 2200,
  qrCodeUrl,
  loading = false,
}: EventCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };
  const [isDownloading, setIsDownloading] = useState(false);
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
  const handleDownloadTicket = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();
    setIsDownloading(true);
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();

      pdf.setFillColor(255, 255, 255);
      pdf.rect(15, 15, pageWidth - 30, 160, "F");
      pdf.setDrawColor(229, 231, 235);
      pdf.setLineWidth(0.5);
      pdf.roundedRect(15, 15, pageWidth - 30, 160, 3, 3, "S");

      pdf.setFontSize(20);
      pdf.setFont("helvetica", "bold");
      pdf.text(title || "Event Ticket", pageWidth / 2, 30, { align: "center" });

      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      let yPos = 45;

      pdf.text("Location:", 25, yPos);
      pdf.setFont("helvetica", "normal");
      pdf.text(location || "N/A", 55, yPos);

      yPos += 10;
      pdf.setFont("helvetica", "bold");
      pdf.text("Start Date:", 25, yPos);
      pdf.setFont("helvetica", "normal");
      pdf.text(formatDate(start_date), 55, yPos);

      yPos += 10;
      pdf.setFont("helvetica", "bold");
      pdf.text("End Date:", 25, yPos);
      pdf.setFont("helvetica", "normal");
      pdf.text(formatDate(end_date), 55, yPos);

      yPos += 10;
      pdf.setFont("helvetica", "bold");
      pdf.text("Ticket ID:", 25, yPos);
      pdf.setFont("helvetica", "normal");
      pdf.text(_id || "N/A", 55, yPos);

      yPos += 10;
      pdf.setFont("helvetica", "bold");
      pdf.text("Price Paid:", 25, yPos);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Rs. ${currentPrice?.toLocaleString() || "0"}`, 55, yPos);

      if (qrCodeUrl) {
        try {
          const img = new Image();
          img.crossOrigin = "anonymous";

          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = qrCodeUrl;
          });

          const qrSize = 40;
          const qrX = (pageWidth - qrSize) / 2;
          pdf.addImage(img, "PNG", qrX, yPos + 15, qrSize, qrSize);

          yPos += 60;
        } catch (error) {
          console.error("Failed to load QR code:", error);
          yPos += 15;
        }
      }

      pdf.setFontSize(9);
      pdf.setFont("helvetica", "italic");
      pdf.text(
        "Please present this ticket at entry.",
        pageWidth / 2,
        yPos + 10,
        { align: "center" }
      );

      pdf.save(`ticket-${_id || "event"}.pdf`);
    } catch (error) {
      console.error("Error generating ticket PDF:", error);
      alert("Failed to generate ticket. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Card
      onClick={() => navigate("/home/event/" + _id)}
      className="overflow-x border-slate-800 bg-slate-900/60 backdrop-blur w-full max-w-3xl shadow-md hover:shadow-lg transition-all duration-300"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=400&fit=crop"
          alt={title}
          className="w-full h-full object-cover opacity-90"
        />

        <div className="absolute top-3 right-3 flex gap-2">
          <Badge className="bg-fuchsia-600 text-white border-0">
            {pastEvent ? "Past Event" : "Ongoing/Upcoming Event"}
          </Badge>
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
            <p className="text-xs text-slate-500 mb-1">Bought at</p>
            <p className="text-lg font-bold text-white">
              ₹{currentPrice.toLocaleString()}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Learn More
            </Button>
            <Button
              className="bg-gradient-to-r  from-purple-600 to-fuchsia-600 text-white border-0 disabled:opacity-50"
              onClick={handleDownloadTicket}
            >
              {isDownloading ? (
                <>
                  <Loader /> Downloading...
                </>
              ) : (
                <>
                  <DownloadIcon /> Download Ticket
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
