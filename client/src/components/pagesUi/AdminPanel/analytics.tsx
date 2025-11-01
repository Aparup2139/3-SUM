import { PageWrapper2 } from "@/components/pagesWrapper/pagesWrapper"
import { CreateTaskSheet } from "@/components/dialogbox/createTaskSheet"

export const AnalyticsPage = () => {

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  
  const id = searchParams.get("id");
  const title = searchParams.get("title");
  console.log("title:", title)

  return (<PageWrapper2
    headerText={"Analytics of "+ title}
    HeaderJSX={<CreateTaskSheet />}
    leftContent={<DashboardContent />}
    rightContent={<></>}
  />)
}

import React, { useState, useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, Legend
} from 'recharts';
import { Users, Ticket, DollarSign, Clock, Menu, X, ChevronDown, CheckCircle } from 'lucide-react';
import { useLocation } from "react-router-dom";

// --- Data Interfaces ---

interface TicketStatus {
  [key: string]: any;
  name: string;
  value: number;
}

interface GenderData {
  gender: string;
  tickets: number;
  fill: string;
}

interface AgeGroupData {
  name: string;
  sales: number;
}

interface PriceRangeData {
  range: string;
  tickets: number;
}

interface TimeSeriesData {
  day: string;
  sales: number;
}

// --- Mock Data ---

const TICKET_STATUS_DATA: TicketStatus[] = [
  { name: 'Sold', value: 12450 },
  { name: 'Unsold', value: 3550 },
];

const GENDER_DATA: GenderData[] = [
  { gender: 'Male', tickets: 6800, fill: '#8884d8' }, // Indigo-like for Dark mode
  { gender: 'Female', tickets: 5650, fill: '#82ca9d' }, // Green-like for Dark mode
];

const AGE_GROUP_DATA: AgeGroupData[] = [
  { name: '18-24', sales: 3200 },
  { name: '25-34', sales: 4800 },
  { name: '35-49', sales: 3000 },
  { name: '50+', sales: 1450 },
];

const PRICE_RANGE_DATA: PriceRangeData[] = [
  { range: '$20 - $50', tickets: 5100 },
  { range: '$51 - $100', tickets: 4500 },
  { range: '$101 - $250', tickets: 2100 },
  { range: '$251+', tickets: 750 },
];

const TIME_SERIES_DATA: TimeSeriesData[] = [
  { day: 'Mon', sales: 450 },
  { day: 'Tue', sales: 800 },
  { day: 'Wed', sales: 1200 },
  { day: 'Thu', sales: 1050 },
  { day: 'Fri', sales: 1800 },
  { day: 'Sat', sales: 2500 },
  { day: 'Sun', sales: 1500 },
];

const KEY_STATS = {
  totalSold: TICKET_STATUS_DATA[0].value,
  avgPrice: 78.55,
  avgAge: 32,
  totalCapacity: TICKET_STATUS_DATA[0].value + TICKET_STATUS_DATA[1].value,
};

const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#3b82f6']; // Tailwind Green, Red, Amber, Blue
const PIE_COLORS = ['#3b82f6', '#475569']; // Blue for Sold, Slate/Gray for Unsold

// --- Utility Components (Card & Button) ---

const Card: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className = '' }) => (
  <div className={`bg-card text-card-foreground border border-border rounded-xl shadow-lg p-6 ${className}`}>
    <h3 className="text-lg font-semibold mb-4 text-primary">{title}</h3>
    {children}
  </div>
);

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; description: string }> = ({ title, value, icon, description }) => (
  <Card title={title} className="hover:shadow-xl transition-shadow duration-300">
    <div className="flex items-center space-x-4">
      <div className="p-3 rounded-full bg-primary/20 text-primary">
        {icon}
      </div>
      <div>
        <div className="text-3xl font-bold tracking-tight">{value}</div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  </Card>
);

// --- Chart Components ---

const TicketStatusPieChart: React.FC = () => (
  <Card title="Ticket Status (Sold vs. Unsold)" className="h-[350px]">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={TICKET_STATUS_DATA}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
        >
          {TICKET_STATUS_DATA.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ backgroundColor: 'hsl(240 10% 3.9%)', border: '1px solid hsl(240 3.7% 15.9%)', borderRadius: '0.5rem' }}
          formatter={(value: any, name: string) => [`${value.toLocaleString()} tickets`, name]}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </Card>
);

const SalesActivityLineChart: React.FC = () => (
  <Card title="Weekly Sales Activity" className="h-[350px]">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={TIME_SERIES_DATA} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 3.7% 15.9%)" />
        <XAxis dataKey="day" stroke="hsl(240 5% 64.9%)" />
        <YAxis stroke="hsl(240 5% 64.9%)" tickFormatter={(value: any) => `${value / 1000}k`} />
        <Tooltip
          contentStyle={{ backgroundColor: 'hsl(240 10% 3.9%)', border: '1px solid hsl(240 3.7% 15.9%)', borderRadius: '0.5rem' }}
          formatter={(value: any) => [`${value.toLocaleString()} sales`, 'Tickets Sold']}
        />
        <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} dot={{ stroke: '#3b82f6', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  </Card>
);

const SalesByAgeChart: React.FC = () => (
  <Card title="Sales by Attendee Age Group" className="h-[350px]">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={AGE_GROUP_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="name" stroke="hsl(240 5% 64.9%)" />
        <YAxis stroke="hsl(240 5% 64.9%)" tickFormatter={(value: any) => `${value / 1000}k`} />
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 3.7% 15.9%)" />
        <Tooltip
          contentStyle={{ backgroundColor: 'hsl(240 10% 3.9%)', border: '1px solid hsl(240 3.7% 15.9%)', borderRadius: '0.5rem' }}
          formatter={(value: any) => [`${value.toLocaleString()} tickets`, 'Sales']}
        />
        <Area type="monotone" dataKey="sales" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSales)" />
      </AreaChart>
    </ResponsiveContainer>
  </Card>
);

const SalesByPriceRange: React.FC = () => (
  <Card title="Tickets by Price Range" className="h-[350px]">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={PRICE_RANGE_DATA} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 3.7% 15.9%)" />
        <XAxis dataKey="range" stroke="hsl(240 5% 64.9%)" />
        <YAxis stroke="hsl(240 5% 64.9%)" tickFormatter={(value: any) => `${value / 1000}k`} />
        <Tooltip
          contentStyle={{ backgroundColor: 'hsl(240 10% 3.9%)', border: '1px solid hsl(240 3.7% 15.9%)', borderRadius: '0.5rem' }}
          formatter={(value: any) => [`${value.toLocaleString()} tickets`, 'Tickets']}
        />
        <Bar dataKey="tickets" fill="#10b981" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </Card>
);

// --- Sidebar and Main Content ---

const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => (
  <div
    className={`fixed inset-y-0 left-0 z-50 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:w-64 bg-background border-r border-border p-6 flex flex-col justify-between`}
  >
    <div className="space-y-8">
      <div className="flex items-center space-x-2">
        <div className="p-2 bg-primary text-primary-foreground rounded-full">
          <CheckCircle size={20} />
        </div>
        <span className="text-xl font-bold">EventPulse</span>
        <button className="md:hidden absolute top-4 right-4 text-muted-foreground" onClick={onClose}>
          <X size={24} />
        </button>
      </div>

      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 rounded-full bg-slate-600 flex items-center justify-center text-white text-sm font-semibold">
          RG
        </div>
        <div>
          <div className="font-semibold text-foreground">Robert Grant</div>
          <div className="text-xs text-muted-foreground">Event Analyst</div>
        </div>
      </div>

      <nav className="space-y-2">
        {['Dashboard', 'Attendees', 'Reports', 'Settings'].map((item, index) => (
          <a
            key={item}
            href="#"
            className={`flex items-center p-3 rounded-lg text-sm transition-colors ${item === 'Dashboard'
              ? 'bg-primary/20 text-primary font-semibold'
              : 'text-muted-foreground hover:bg-muted'
              }`}
          >
            {item}
            {item === 'Dashboard' && <span className="ml-auto h-2 w-2 bg-red-500 rounded-full animate-pulse" />}
          </a>
        ))}
      </nav>
    </div>

    <button className="flex items-center p-3 rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors">
      <Clock size={16} className="mr-3" />
      Log Out
    </button>
  </div>
);

const DashboardContent: React.FC = () => {
  const formatValue = (value: number) => {
    if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
    return value.toString();
  };

  const salesByGenderText = useMemo(() => {
    const male = GENDER_DATA.find(d => d.gender === 'Male')?.tickets || 0;
    const female = GENDER_DATA.find(d => d.gender === 'Female')?.tickets || 0;
    const total = male + female;
    const malePercent = ((male / total) * 100).toFixed(0);
    const femalePercent = ((female / total) * 100).toFixed(0);
    return `Male: ${malePercent}%, Female: ${femalePercent}%`;
  }, []);

  return (
    <div className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto">
      {/* Header Section */}
      <div className="flex justify-between items-center flex-wrap">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Event Analytics Dashboard</h1>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <div className="text-sm text-muted-foreground">
            Data refreshed every 3 hours
          </div>
          <button className="flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors">
            01-07 Nov <ChevronDown size={16} className="ml-1" />
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Tickets Sold"
          value={formatValue(KEY_STATS.totalSold)}
          icon={<Ticket size={24} />}
          description={`From ${formatValue(KEY_STATS.totalCapacity)} capacity`}
        />
        <StatCard
          title="Average Ticket Price"
          value={`$${KEY_STATS.avgPrice.toFixed(2)}`}
          icon={<DollarSign size={24} />}
          description="Revenue insight"
        />
        <StatCard
          title="Average Attendee Age"
          value={`${KEY_STATS.avgAge} yrs`}
          icon={<Users size={24} />}
          description="Demographic insight"
        />
        <StatCard
          title="Unsold Tickets"
          value={formatValue(TICKET_STATUS_DATA[1].value)}
          icon={<X size={24} />}
          description="Focus marketing efforts"
        />
      </div>

      {/* Main Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Activity/Trend Chart - Similar to the image's center piece */}
        <div className="lg:col-span-2">
          <SalesActivityLineChart />
        </div>

        {/* Top Performer / Side Card - Replaced with Ticket Status Pie Chart */}
        <div>
          <TicketStatusPieChart />
        </div>
      </div>

      {/* Bottom Charts Grid (Demographics and Pricing) */}
      <div className="grid gap-6 lg:grid-cols-2">
        <SalesByAgeChart />
        <SalesByPriceRange />
      </div>

      {/* Gender Distribution Card - Using a simple Bar Chart */}
      <Card title="Ticket Sales by Gender" className="lg:w-1/2 min-w-80">
        <div className="text-sm font-medium text-muted-foreground mb-4">
          {salesByGenderText}
        </div>
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={GENDER_DATA} layout="vertical">
            <XAxis type="number" stroke="hsl(240 5% 64.9%)" hide />
            <YAxis type="category" dataKey="gender" stroke="hsl(240 5% 64.9%)" interval={0} />
            <Tooltip
              contentStyle={{ backgroundColor: 'hsl(240 10% 3.9%)', border: '1px solid hsl(240 3.7% 15.9%)', borderRadius: '0.5rem' }}
              formatter={(value) => [`${value.toLocaleString()} tickets`, 'Tickets Sold']}
            />
            <Bar dataKey="tickets" barSize={20} radius={[0, 4, 4, 0]}>
              {GENDER_DATA.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

// --- Main App Component ---

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Apply dark theme using Tailwind's 'dark' class
  return (
    <div className="dark min-h-screen bg-background text-foreground font-sans">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        {/* Backdrop for Mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Mobile Header for Menu */}
          <header className="md:hidden sticky top-0 z-30 bg-background border-b border-border p-4 flex items-center justify-between">
            <span className="text-xl font-bold">Dashboard</span>
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 rounded-lg text-primary">
              <Menu size={24} />
            </button>
          </header>

          {/* Dashboard */}
          <DashboardContent />
        </div>
      </div>
    </div>
  );
};

export default App;
