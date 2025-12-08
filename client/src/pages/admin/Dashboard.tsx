import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, ShoppingBag, TrendingUp, AlertCircle, ArrowUpRight, ArrowDownRight, Clock, IndianRupee, Loader2, Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import type { Booking, User, Service, WorkerDetails } from "@shared/schema";

export default function AdminDashboard() {
  const { data: bookings = [], isLoading: bookingsLoading } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
    queryFn: async () => {
      const res = await fetch("/api/bookings");
      if (!res.ok) throw new Error("Failed to fetch bookings");
      return res.json();
    },
  });

  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["/api/users"],
    queryFn: async () => {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    },
  });

  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ["/api/services"],
    queryFn: async () => {
      const res = await fetch("/api/services");
      if (!res.ok) throw new Error("Failed to fetch services");
      return res.json();
    },
  });

  const { data: workerDetails = [] } = useQuery<WorkerDetails[]>({
    queryKey: ["/api/workers"],
    queryFn: async () => {
      const res = await fetch("/api/workers");
      if (!res.ok) throw new Error("Failed to fetch workers");
      return res.json();
    },
  });

  const customers = users.filter(u => u.role === "CUSTOMER");
  const workers = users.filter(u => u.role === "WORKER");
  const verifiedWorkers = workerDetails.filter(w => w.isVerified);

  const totalRevenue = bookings
    .filter(b => b.paymentStatus === "paid")
    .reduce((sum, b) => sum + parseFloat(b.totalAmount || "0"), 0);

  const pendingBookings = bookings.filter(b => b.status === "pending").length;
  const completedBookings = bookings.filter(b => b.status === "completed").length;
  const cancelledBookings = bookings.filter(b => b.status === "cancelled").length;

  const stats = [
    { 
      title: "Total Revenue", 
      value: `₹${totalRevenue.toLocaleString()}`, 
      change: "+20.1%", 
      trend: "up", 
      icon: IndianRupee,
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    },
    { 
      title: "Total Bookings", 
      value: bookings.length.toString(), 
      change: `${completedBookings} completed`, 
      trend: "up", 
      icon: ShoppingBag,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    { 
      title: "Active Workers", 
      value: verifiedWorkers.length.toString(), 
      change: `${workers.length} total`, 
      trend: "up", 
      icon: Users,
      color: "text-indigo-600",
      bg: "bg-indigo-50"
    },
    { 
      title: "Customers", 
      value: customers.length.toString(), 
      change: "Active users", 
      trend: "up", 
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-50"
    },
  ];

  const getServiceName = (id: number) => services.find(s => s.id === id)?.name || "Unknown";
  const getUserName = (id: number) => users.find(u => u.id === id)?.fullName || "Unknown";

  const bookingStatusData = [
    { name: "Pending", value: pendingBookings, color: "#f59e0b" },
    { name: "Completed", value: completedBookings, color: "#10b981" },
    { name: "Cancelled", value: cancelledBookings, color: "#ef4444" },
    { name: "In Progress", value: bookings.filter(b => b.status === "in_progress").length, color: "#3b82f6" },
  ].filter(d => d.value > 0);

  const serviceBookingData = services.map(service => ({
    name: service.name.length > 10 ? service.name.substring(0, 10) + "..." : service.name,
    bookings: bookings.filter(b => b.serviceId === service.id).length,
    revenue: bookings
      .filter(b => b.serviceId === service.id && b.paymentStatus === "paid")
      .reduce((sum, b) => sum + parseFloat(b.totalAmount || "0"), 0),
  })).filter(s => s.bookings > 0);

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  const dailyRevenueData = last7Days.map(date => {
    const dayBookings = bookings.filter(b => {
      const bookingDate = new Date(b.createdAt).toISOString().split('T')[0];
      return bookingDate === date && b.paymentStatus === "paid";
    });
    return {
      date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      revenue: dayBookings.reduce((sum, b) => sum + parseFloat(b.totalAmount || "0"), 0),
      bookings: dayBookings.length,
    };
  });

  if (bookingsLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Analytics Dashboard</h1>
          <p className="text-slate-500 mt-1">Real-time insights and performance metrics.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-white">Export Report</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="border-slate-100 shadow-sm hover:shadow-md transition-shadow" data-testid={`stat-card-${i}`}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={cn("p-3 rounded-xl", stat.bg, stat.color)}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  {stat.change}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-slate-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-bold">Revenue Trend (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4">
              {dailyRevenueData.some(d => d.revenue > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyRevenueData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400">
                  No revenue data yet. Revenue will appear when bookings are paid.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Booking Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              {bookingStatusData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={bookingStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {bookingStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [value, 'Bookings']} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400">
                  No bookings yet
                </div>
              )}
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {bookingStatusData.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-slate-600">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-slate-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-bold">Service Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              {serviceBookingData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={serviceBookingData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                    <XAxis type="number" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} width={80} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      formatter={(value: number, name: string) => [value, name === 'bookings' ? 'Bookings' : `₹${value.toLocaleString()}`]}
                    />
                    <Bar dataKey="bookings" fill="#3b82f6" radius={[0, 6, 6, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400">
                  No service bookings yet. Add services and create bookings to see performance.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {bookings.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                No bookings yet. Bookings will appear when customers book services.
              </div>
            ) : (
              bookings.slice(0, 5).map((booking) => (
                <div key={booking.id} className="flex items-start gap-4 p-3 rounded-xl bg-slate-50/50 border border-slate-100">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0 border",
                    booking.status === "completed" ? "bg-emerald-50 border-emerald-100 text-emerald-600" :
                    booking.status === "pending" ? "bg-amber-50 border-amber-100 text-amber-600" :
                    booking.status === "cancelled" ? "bg-red-50 border-red-100 text-red-600" :
                    "bg-blue-50 border-blue-100 text-blue-600"
                  )}>
                    {booking.status === "completed" ? <ShoppingBag className="w-5 h-5" /> : 
                     booking.status === "pending" ? <Clock className="w-5 h-5" /> :
                     <TrendingUp className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {getServiceName(booking.serviceId)}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {getUserName(booking.customerId)} • {booking.status}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900">₹{booking.totalAmount}</p>
                    <p className="text-xs text-slate-400">{new Date(booking.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            )}
            
            {bookings.length > 5 && (
              <Button variant="ghost" className="w-full text-primary text-sm font-medium hover:bg-primary/5">
                View All Bookings
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-slate-100 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Completion Rate</p>
                <p className="text-2xl font-bold">
                  {bookings.length > 0 ? Math.round((completedBookings / bookings.length) * 100) : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-100 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <IndianRupee className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Avg. Order Value</p>
                <p className="text-2xl font-bold">
                  ₹{bookings.length > 0 ? Math.round(totalRevenue / (completedBookings || 1)).toLocaleString() : 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-100 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Active Services</p>
                <p className="text-2xl font-bold">{services.filter(s => s.isActive).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
