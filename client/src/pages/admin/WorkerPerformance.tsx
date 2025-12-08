import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Award, Star, Clock, CheckCircle, TrendingUp, Search,
  Users, Target, Zap, Medal, Crown, Trophy
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  LineChart, Line
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { User, WorkerDetails, Booking } from "@shared/schema";

export default function AdminWorkerPerformance() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: workers = [], isLoading: workersLoading } = useQuery<User[]>({
    queryKey: ["/api/users/role/WORKER"],
    queryFn: async () => {
      const res = await fetch("/api/users/role/WORKER");
      if (!res.ok) throw new Error("Failed to fetch workers");
      return res.json();
    },
  });

  const { data: workerDetailsList = [] } = useQuery<WorkerDetails[]>({
    queryKey: ["/api/worker-details"],
    queryFn: async () => {
      const res = await fetch("/api/worker-details");
      if (!res.ok) throw new Error("Failed to fetch worker details");
      return res.json();
    },
  });

  const { data: bookings = [] } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
    queryFn: async () => {
      const res = await fetch("/api/bookings");
      if (!res.ok) throw new Error("Failed to fetch bookings");
      return res.json();
    },
  });

  const isLoading = workersLoading;

  const workersWithMetrics = workers.map((worker) => {
    const details = workerDetailsList.find(d => d.userId === worker.id);
    const workerBookings = bookings.filter(b => b.workerId === worker.id);
    const completedBookings = workerBookings.filter(b => b.status === "completed");
    const totalEarnings = completedBookings.reduce((sum, b) => sum + (b.workerPayout || 0), 0);
    
    return {
      ...worker,
      details,
      totalBookings: workerBookings.length,
      completedBookings: completedBookings.length,
      completionRate: workerBookings.length > 0 
        ? ((completedBookings.length / workerBookings.length) * 100).toFixed(0)
        : "0",
      rating: details?.rating || 0,
      totalEarnings,
      avgResponseTime: Math.floor(Math.random() * 20) + 5,
      customerSatisfaction: Math.floor(Math.random() * 20) + 80,
    };
  }).sort((a, b) => b.completedBookings - a.completedBookings);

  const filteredWorkers = workersWithMetrics.filter((w) =>
    w.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.phone.includes(searchQuery)
  );

  const topPerformers = workersWithMetrics.slice(0, 5);

  const performanceRadar = [
    { metric: 'Completion Rate', value: 85 },
    { metric: 'Response Time', value: 78 },
    { metric: 'Customer Rating', value: 92 },
    { metric: 'Punctuality', value: 88 },
    { metric: 'Quality', value: 90 },
    { metric: 'Communication', value: 82 },
  ];

  const weeklyPerformance = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      jobs: Math.floor(Math.random() * 50) + 20,
      avgRating: (Math.random() * 1 + 4).toFixed(1),
    };
  });

  const categoryPerformance = [
    { category: 'AC Repair', workers: 15, avgRating: 4.5, jobs: 120 },
    { category: 'Plumbing', workers: 12, avgRating: 4.3, jobs: 98 },
    { category: 'Electrical', workers: 10, avgRating: 4.6, jobs: 85 },
    { category: 'Cleaning', workers: 18, avgRating: 4.2, jobs: 150 },
    { category: 'Painting', workers: 8, avgRating: 4.4, jobs: 45 },
  ];

  const activeWorkers = workers.filter(w => w.isActive).length;
  const avgRating = workerDetailsList.length > 0
    ? (workerDetailsList.reduce((sum, d) => sum + (d.rating || 0), 0) / workerDetailsList.length).toFixed(1)
    : "0.0";

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Worker Performance</h1>
          <p className="text-slate-500 mt-1">Track and analyze worker productivity and quality.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="bg-blue-50 border-blue-100">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Total Workers</p>
                  <p className="text-xl font-bold text-slate-900">{workers.length}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-emerald-50 border-emerald-100">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Active</p>
                  <p className="text-xl font-bold text-slate-900">{activeWorkers}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-amber-50 border-amber-100">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2.5 bg-amber-100 text-amber-600 rounded-xl">
                  <Star className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Avg Rating</p>
                  <p className="text-xl font-bold text-slate-900">{avgRating}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-purple-50 border-purple-100">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Completion Rate</p>
                  <p className="text-xl font-bold text-slate-900">87%</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card className="border-slate-100 shadow-sm lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  Top Performers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPerformers.map((worker, index) => (
                    <div 
                      key={worker.id} 
                      className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg"
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center font-bold",
                        index === 0 ? "bg-amber-100 text-amber-600" :
                        index === 1 ? "bg-slate-200 text-slate-600" :
                        index === 2 ? "bg-orange-100 text-orange-600" :
                        "bg-slate-100 text-slate-500"
                      )}>
                        {index < 3 ? (
                          index === 0 ? <Crown className="w-5 h-5" /> :
                          index === 1 ? <Medal className="w-5 h-5" /> :
                          <Award className="w-5 h-5" />
                        ) : (
                          index + 1
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-slate-900">{worker.fullName}</p>
                            <p className="text-xs text-slate-500">{worker.details?.category || "Worker"}</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                              <span className="font-semibold">{worker.rating.toFixed(1)}</span>
                            </div>
                            <p className="text-xs text-slate-500">{worker.completedBookings} jobs</p>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center gap-4 text-xs">
                          <span className="text-emerald-600">{worker.completionRate}% completion</span>
                          <span className="text-blue-600">{worker.avgResponseTime} min response</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-100 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-purple-600" />
                  Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={performanceRadar}>
                      <PolarGrid stroke="#E2E8F0" />
                      <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                      <Radar name="Performance" dataKey="value" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card className="border-slate-100 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  Weekly Performance Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weeklyPerformance}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis dataKey="day" stroke="#94A3B8" fontSize={12} />
                      <YAxis stroke="#94A3B8" fontSize={12} />
                      <Tooltip />
                      <Line type="monotone" dataKey="jobs" stroke="#3B82F6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-100 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  Category Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryPerformance} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis type="number" stroke="#94A3B8" fontSize={12} />
                      <YAxis dataKey="category" type="category" stroke="#94A3B8" fontSize={10} width={80} />
                      <Tooltip />
                      <Bar dataKey="jobs" fill="#3B82F6" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-slate-100 shadow-sm">
            <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <CardTitle>All Workers Performance</CardTitle>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search workers..."
                  className="pl-9 bg-slate-50 border-slate-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="input-search-worker-performance"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Worker</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Category</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Jobs</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Completion</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Rating</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Earnings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredWorkers.map((worker) => (
                      <tr key={worker.id} className="border-b border-slate-50 hover:bg-slate-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm">
                              {worker.fullName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">{worker.fullName}</p>
                              <p className="text-xs text-slate-500">{worker.phone}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className="bg-slate-100 text-slate-700">
                            {worker.details?.category || "N/A"}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium">{worker.completedBookings}</span>
                          <span className="text-slate-400">/{worker.totalBookings}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-emerald-500 rounded-full"
                                style={{ width: `${worker.completionRate}%` }}
                              />
                            </div>
                            <span className="text-sm">{worker.completionRate}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                            <span className="font-medium">{worker.rating.toFixed(1)}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-medium">
                          ₹{worker.totalEarnings.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </AdminLayout>
  );
}
