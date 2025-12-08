import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calendar, Clock, CheckCircle, XCircle, TrendingUp,
  BarChart3, PieChart as PieChartIcon, ArrowUpRight, ArrowDownRight
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area
} from "recharts";
import type { Booking } from "@shared/schema";
import { Badge } from "@/components/ui/badge";

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function AdminBookingStats() {
  const { data: bookings = [], isLoading } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
    queryFn: async () => {
      const res = await fetch("/api/bookings");
      if (!res.ok) throw new Error("Failed to fetch bookings");
      return res.json();
    },
  });

  const totalBookings = bookings.length;
  const completedBookings = bookings.filter(b => b.status === "completed");
  const pendingBookings = bookings.filter(b => b.status === "pending");
  const cancelledBookings = bookings.filter(b => b.status === "cancelled");
  const confirmedBookings = bookings.filter(b => b.status === "confirmed");

  const completionRate = totalBookings > 0 
    ? ((completedBookings.length / totalBookings) * 100).toFixed(1) 
    : "0";

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short' }),
      bookings: Math.floor(Math.random() * 30) + 5,
      completed: Math.floor(Math.random() * 20) + 3,
    };
  });

  const statusDistribution = [
    { name: 'Completed', value: completedBookings.length, color: '#10B981' },
    { name: 'Pending', value: pendingBookings.length, color: '#F59E0B' },
    { name: 'Confirmed', value: confirmedBookings.length, color: '#3B82F6' },
    { name: 'Cancelled', value: cancelledBookings.length, color: '#EF4444' },
  ].filter(s => s.value > 0);

  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    return {
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      bookings: Math.floor(Math.random() * 200) + 50,
      revenue: Math.floor(Math.random() * 50000) + 10000,
    };
  });

  const peakHours = [
    { hour: '9 AM', bookings: 45 },
    { hour: '10 AM', bookings: 78 },
    { hour: '11 AM', bookings: 92 },
    { hour: '12 PM', bookings: 65 },
    { hour: '2 PM', bookings: 88 },
    { hour: '3 PM', bookings: 95 },
    { hour: '4 PM', bookings: 82 },
    { hour: '5 PM', bookings: 70 },
    { hour: '6 PM', bookings: 55 },
  ];

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Booking Stats</h1>
          <p className="text-slate-500 mt-1">Analyze booking patterns and performance metrics.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <Card className="bg-blue-50 border-blue-100">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Total</p>
                  <p className="text-xl font-bold text-slate-900">{totalBookings}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-emerald-50 border-emerald-100">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Completed</p>
                  <p className="text-xl font-bold text-slate-900">{completedBookings.length}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-amber-50 border-amber-100">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2.5 bg-amber-100 text-amber-600 rounded-xl">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Pending</p>
                  <p className="text-xl font-bold text-slate-900">{pendingBookings.length}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-red-50 border-red-100">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2.5 bg-red-100 text-red-600 rounded-xl">
                  <XCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Cancelled</p>
                  <p className="text-xl font-bold text-slate-900">{cancelledBookings.length}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-purple-50 border-purple-100">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Success Rate</p>
                  <p className="text-xl font-bold text-slate-900">{completionRate}%</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card className="border-slate-100 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Daily Booking Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={last7Days}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis dataKey="date" stroke="#94A3B8" fontSize={12} />
                      <YAxis stroke="#94A3B8" fontSize={12} />
                      <Tooltip />
                      <Area type="monotone" dataKey="bookings" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.2} />
                      <Area type="monotone" dataKey="completed" stroke="#10B981" fill="#10B981" fillOpacity={0.2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-100 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5 text-purple-600" />
                  Booking Status Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {statusDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-4 mt-2">
                  {statusDistribution.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-slate-600">{item.name}: {item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card className="border-slate-100 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-600" />
                  Peak Booking Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={peakHours}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis dataKey="hour" stroke="#94A3B8" fontSize={10} />
                      <YAxis stroke="#94A3B8" fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="bookings" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-100 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  Monthly Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
                      <YAxis stroke="#94A3B8" fontSize={12} />
                      <Tooltip />
                      <Line type="monotone" dataKey="bookings" stroke="#3B82F6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="border-slate-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Today's Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-slate-600">New Bookings</span>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-lg">12</span>
                      <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                    <span className="text-slate-600">Completed</span>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-lg">8</span>
                      <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <span className="text-slate-600">Cancelled</span>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-lg">1</span>
                      <ArrowDownRight className="w-4 h-4 text-red-600" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Average Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Avg. Booking Value</span>
                    <span className="font-semibold">₹850</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Avg. Completion Time</span>
                    <span className="font-semibold">2.5 hrs</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Avg. Wait Time</span>
                    <span className="font-semibold">15 min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Repeat Booking Rate</span>
                    <span className="font-semibold text-emerald-600">42%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Top Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">AC Repair</span>
                    <Badge className="bg-blue-100 text-blue-700">32 bookings</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Plumbing</span>
                    <Badge className="bg-emerald-100 text-emerald-700">28 bookings</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Electrical</span>
                    <Badge className="bg-amber-100 text-amber-700">24 bookings</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Cleaning</span>
                    <Badge className="bg-purple-100 text-purple-700">18 bookings</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
