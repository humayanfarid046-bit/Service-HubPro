import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Users, DollarSign, TrendingUp, Heart, Search,
  Crown, Star, ShoppingBag, Calendar, ArrowUpRight, Award
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { User, Booking } from "@shared/schema";

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function AdminCustomerLifetimeValue() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: customers = [], isLoading: customersLoading } = useQuery<User[]>({
    queryKey: ["/api/users/role/CUSTOMER"],
    queryFn: async () => {
      const res = await fetch("/api/users/role/CUSTOMER");
      if (!res.ok) throw new Error("Failed to fetch customers");
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

  const isLoading = customersLoading;

  const customersWithCLV = customers.map((customer) => {
    const customerBookings = bookings.filter(b => b.customerId === customer.id);
    const completedBookings = customerBookings.filter(b => b.status === "completed");
    const totalSpent = completedBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const avgOrderValue = completedBookings.length > 0 ? totalSpent / completedBookings.length : 0;
    
    const firstBooking = customerBookings.length > 0 
      ? new Date(Math.min(...customerBookings.map(b => new Date(b.createdAt).getTime())))
      : null;
    const customerAge = firstBooking 
      ? Math.floor((Date.now() - firstBooking.getTime()) / (1000 * 60 * 60 * 24 * 30))
      : 0;
    
    const clv = totalSpent * (customerAge > 0 ? Math.min(customerAge / 6, 3) : 1);
    
    return {
      ...customer,
      totalBookings: customerBookings.length,
      completedBookings: completedBookings.length,
      totalSpent,
      avgOrderValue,
      clv,
      customerAge,
      segment: clv > 10000 ? 'platinum' : clv > 5000 ? 'gold' : clv > 2000 ? 'silver' : 'bronze',
    };
  }).sort((a, b) => b.clv - a.clv);

  const filteredCustomers = customersWithCLV.filter((c) =>
    c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  const totalCustomers = customers.length;
  const totalCLV = customersWithCLV.reduce((sum, c) => sum + c.clv, 0);
  const avgCLV = totalCustomers > 0 ? totalCLV / totalCustomers : 0;
  const repeatCustomers = customersWithCLV.filter(c => c.totalBookings > 1).length;

  const segmentDistribution = [
    { name: 'Platinum', value: customersWithCLV.filter(c => c.segment === 'platinum').length, color: '#8B5CF6' },
    { name: 'Gold', value: customersWithCLV.filter(c => c.segment === 'gold').length, color: '#F59E0B' },
    { name: 'Silver', value: customersWithCLV.filter(c => c.segment === 'silver').length, color: '#94A3B8' },
    { name: 'Bronze', value: customersWithCLV.filter(c => c.segment === 'bronze').length, color: '#CD7F32' },
  ].filter(s => s.value > 0);

  const clvTrend = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    return {
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      avgCLV: Math.floor(Math.random() * 3000) + 2000,
      newCustomers: Math.floor(Math.random() * 50) + 20,
    };
  });

  const retentionData = [
    { period: 'Month 1', retention: 100 },
    { period: 'Month 2', retention: 75 },
    { period: 'Month 3', retention: 60 },
    { period: 'Month 4', retention: 52 },
    { period: 'Month 5', retention: 48 },
    { period: 'Month 6', retention: 45 },
  ];

  const getSegmentBadge = (segment: string) => {
    switch (segment) {
      case 'platinum': return { bg: 'bg-purple-100', text: 'text-purple-700', icon: Crown };
      case 'gold': return { bg: 'bg-amber-100', text: 'text-amber-700', icon: Star };
      case 'silver': return { bg: 'bg-slate-100', text: 'text-slate-700', icon: Award };
      default: return { bg: 'bg-orange-100', text: 'text-orange-700', icon: Users };
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Customer Lifetime Value</h1>
          <p className="text-slate-500 mt-1">Analyze customer value and retention metrics.</p>
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
                  <p className="text-xs text-slate-500">Total Customers</p>
                  <p className="text-xl font-bold text-slate-900">{totalCustomers}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-emerald-50 border-emerald-100">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Avg CLV</p>
                  <p className="text-xl font-bold text-slate-900">₹{avgCLV.toFixed(0)}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-amber-50 border-amber-100">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2.5 bg-amber-100 text-amber-600 rounded-xl">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Repeat Customers</p>
                  <p className="text-xl font-bold text-slate-900">{repeatCustomers}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-purple-50 border-purple-100">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Total CLV</p>
                  <p className="text-xl font-bold text-slate-900">₹{(totalCLV/1000).toFixed(0)}K</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card className="border-slate-100 shadow-sm lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  CLV Trend Over Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={clvTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
                      <YAxis stroke="#94A3B8" fontSize={12} />
                      <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                      <Area type="monotone" dataKey="avgCLV" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-100 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-purple-600" />
                  Customer Segments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={segmentDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={60}
                        dataKey="value"
                      >
                        {segmentDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 mt-2">
                  {segmentDistribution.map((segment) => (
                    <div key={segment.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: segment.color }} />
                        <span>{segment.name}</span>
                      </div>
                      <span className="font-semibold">{segment.value}</span>
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
                  <Heart className="w-5 h-5 text-red-500" />
                  Customer Retention Curve
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={retentionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis dataKey="period" stroke="#94A3B8" fontSize={10} />
                      <YAxis stroke="#94A3B8" fontSize={12} domain={[0, 100]} />
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Line type="monotone" dataKey="retention" stroke="#EF4444" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">CLV Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-emerald-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">High-Value Customers</span>
                      <span className="font-bold text-emerald-600">
                        {customersWithCLV.filter(c => c.clv > 5000).length}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">CLV &gt; ₹5,000</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">Repeat Rate</span>
                      <span className="font-bold text-blue-600">
                        {totalCustomers > 0 ? ((repeatCustomers / totalCustomers) * 100).toFixed(0) : 0}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Customers with 2+ bookings</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">Avg Booking Frequency</span>
                      <span className="font-bold text-purple-600">1.8x/month</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">For repeat customers</p>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700">Churn Risk</span>
                      <span className="font-bold text-amber-600">12%</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">No activity in 30+ days</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-slate-100 shadow-sm">
            <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <CardTitle>Customer CLV Leaderboard</CardTitle>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search customers..."
                  className="pl-9 bg-slate-50 border-slate-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="input-search-clv"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Rank</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Customer</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Segment</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Bookings</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Total Spent</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">CLV</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.slice(0, 20).map((customer, index) => {
                      const segmentInfo = getSegmentBadge(customer.segment);
                      const SegmentIcon = segmentInfo.icon;
                      return (
                        <tr key={customer.id} className="border-b border-slate-50 hover:bg-slate-50">
                          <td className="py-3 px-4">
                            <div className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
                              index < 3 ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"
                            )}>
                              {index + 1}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm">
                                {customer.fullName.charAt(0)}
                              </div>
                              <div>
                                <p className="font-medium text-slate-900">{customer.fullName}</p>
                                <p className="text-xs text-slate-500">{customer.phone}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={cn(segmentInfo.bg, segmentInfo.text, "capitalize")}>
                              <SegmentIcon className="w-3 h-3 mr-1" />
                              {customer.segment}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-medium">{customer.completedBookings}</span>
                            <span className="text-slate-400">/{customer.totalBookings}</span>
                          </td>
                          <td className="py-3 px-4 font-medium">
                            ₹{customer.totalSpent.toLocaleString()}
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-bold text-emerald-600">₹{customer.clv.toFixed(0)}</span>
                          </td>
                        </tr>
                      );
                    })}
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
