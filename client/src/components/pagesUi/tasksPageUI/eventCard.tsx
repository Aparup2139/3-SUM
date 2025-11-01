import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';

interface EventCardProps {
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
}

export default function EventCard({
  title = "Tech Innovators Summit 2025",
  short_description = "A premier event showcasing future technology trends.",
  start_date = new Date("2025-02-15T09:00:00Z"),
  end_date = new Date("2025-02-17T17:00:00Z"),
  location = "Bangalore International Exhibition Centre, India",
  category = ["Technology", "Conference"],
  totalTickets = 500,
  ticketsSold = 320,
  currentPrice = 2200,
  priceMin = 1500,
  priceMax = 3500,
  loading = false,
}: EventCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).format(date);
  };

  const ticketsAvailable = totalTickets - ticketsSold;
  const soldPercentage = ((ticketsSold / totalTickets) * 100).toFixed(1);
  const availabilityStatus = ticketsAvailable > 100 ? "Available" : ticketsAvailable > 0 ? "Limited" : "Sold Out";

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8 flex items-center justify-center">
        <div className="max-w-4xl w-full">
          <Card className="overflow-hidden border-slate-800 bg-slate-900/50 backdrop-blur">
            <Skeleton className="h-64 w-full bg-slate-800" />
            
            <CardHeader className="space-y-4">
              <Skeleton className="h-8 w-3/4 bg-slate-800" />
              <Skeleton className="h-4 w-full bg-slate-800" />
              <Skeleton className="h-4 w-5/6 bg-slate-800" />
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-lg bg-slate-800" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3 w-16 bg-slate-800" />
                      <Skeleton className="h-4 w-32 bg-slate-800" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="h-px bg-slate-700" />

              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-3 w-20 bg-slate-800" />
                  <Skeleton className="h-8 w-24 bg-slate-800" />
                </div>
                <div className="flex gap-3">
                  <Skeleton className="h-10 w-28 bg-slate-800" />
                  <Skeleton className="h-10 w-32 bg-slate-800" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8 flex items-center justify-center">
      <div className="max-w-4xl w-full">
        <Card className="overflow-hidden border-slate-800 bg-slate-900/50 backdrop-blur">
          <div className="relative h-64 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-orange-900/40 to-purple-900/40">
              <img 
                src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=400&fit=crop" 
                alt={title}
                className="w-full h-full object-cover mix-blend-overlay opacity-80"
              />
            </div>
            <div className="absolute top-4 right-4 flex gap-2">
              {category.map((cat) => (
                <Badge key={cat} className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white border-0">
                  {cat}
                </Badge>
              ))}
            </div>
          </div>
          
          <CardHeader className="space-y-4">
            <CardTitle className="text-3xl font-bold text-white">
              {title}
            </CardTitle>
            <CardDescription className="text-slate-300 text-base leading-relaxed">
              {short_description}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-slate-300">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <Calendar className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Event Date</p>
                  <p className="text-sm font-semibold">{formatDate(start_date)} → {formatDate(end_date)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-300">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20">
                  <MapPin className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Location</p>
                  <p className="text-sm font-semibold">{location}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-300">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Tickets Sold</p>
                  <p className="text-sm font-semibold">{soldPercentage}% ({ticketsSold}/{totalTickets})</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-300">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/20">
                  <Clock className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Availability</p>
                  <p className="text-sm font-semibold">{availabilityStatus} ({ticketsAvailable} left)</p>
                </div>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />

            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">Current Price</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-white">₹{currentPrice.toLocaleString()}</p>
                  <p className="text-xs text-slate-400">₹{priceMin.toLocaleString()} - ₹{priceMax.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  Learn More
                </Button>
                <Button 
                  disabled={ticketsAvailable === 0}
                  className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white border-0 disabled:opacity-50"
                >
                  {ticketsAvailable === 0 ? 'Sold Out' : 'Book Tickets'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}