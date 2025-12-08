import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DollarSign, TrendingUp, TrendingDown, CreditCard, Wallet,
  ArrowUpRight, ArrowDownRight, PiggyBank, Receipt, Percent
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, ComposedChart
} from "recharts";
import type { Booking } from "@shared/schema";
import { Badge } from "@/components/ui/badge";

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function AdminRevenueStats() {
  const { data: bookings = [], isLoading } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
    queryFn: async () => {
      const res = await fetch("/api/bookings");
      if (!res.ok) throw new Error("Failed to fetch bookings");
      return res.json();
    },
  });

  const completedBookings = bookings.filter(b => b.status === "completed");
  const totalRevenue = completedBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const totalCommission = completedBookings.reduce((sum, b) => sum + (b.platformFee || 0), 0);
  const avgOrderValue = completedBookings.length > 0 ? totalRevenue / completedBookings.length : 0;

  const monthlyRevenue = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    return {
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      revenue: Math.floor(Math.random() * 100000) + 50000,
      commission: Math.floor(Math.random() * 15000) + 5000,
      orders: Math.floor(Math.random() * 200) + 50,
    };
  });

  const paymentMethods = [
    { name: 'Online', value: 65, color: '#3B82F6' },
    { name: 'COD', value: 25, color: '#10B981' },
    { name: 'Wallet', value: 10, color: '#F59E0B' },
  ];

  const dailyRevenue = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short' }),
      revenue: Math.floor(Math.random() * 20000) + 5000,
      target: 15000,
    };
  });

  const categoryRevenue = [
    { category: 'AC Repair', revenue: 45000, growth: 12 },
    { category: 'Plumbing', revenue: 38000, growth: 8 },
    { category: 'Electrical', revenue: 32000, growth: 15 },
    { category: 'Cleaning', revenue: 28000, growth: -3 },
    { category: 'Painting', revenue: 22000, growth: 22 },
  ];

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Revenue Stats</h1>
          <p className="text-slate-500 mt-1">Track revenue, commission and financial performance.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="bg-emerald-50 border-emerald-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div className="flex items-center text-emerald-600 text-sm">
                    <ArrowUpRight className="w-4 h-4" />
                    <span>12%</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500">Total Revenue</p>
                <p className="text-2xl font-bold text-slate-900">₹{totalRevenue.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card className="bg-blue-50 border-blue-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <Percent className="w-5 h-5" />
                  </div>
                  <div className="flex items-center text-emerald-600 text-sm">
                    <ArrowUpRight className="w-4 h-4" />
                    <span>8%</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500">Commission Earned</p>
                <p className="text-2xl font-bold text-slate-900">₹{totalCommission.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card className="bg-amber-50 border-amber-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div className="flex items-center text-emerald-600 text-sm">
                    <ArrowUpRight className="w-4 h-4" />
                    <span>5%</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500">Avg Order Value</p>
                <p className="text-2xl font-bold text-slate-900">₹{avgOrderValue.toFixed(0)}</p>
              </CardContent>
            </Card>
            <Card className="bg-purple-50 border-purple-100">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                    <PiggyBank className="w-5 h-5" />
                  </div>
                  <div className="flex items-center text-red-600 text-sm">
                    <ArrowDownRight className="w-4 h-4" />
                    <span>2%</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500">Refunds</p>
                <p className="text-2xl font-bold text-slate-900">₹2,450</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card className="border-slate-100 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  Revenue Trend (6 Months)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={monthlyRevenue}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
                      <YAxis stroke="#94A3B8" fontSize={12} />
                      <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                      <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                      <Line type="monotone" dataKey="commission" stroke="#10B981" strokeWidth={2} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-100 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  Payment Methods
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center">
                  <div className="w-1/2">
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={paymentMethods}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={70}
                          dataKey="value"
                        >
                          {paymentMethods.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="w-1/2 space-y-4">
                    {paymentMethods.map((method) => (
                      <div key={method.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: method.color }} />
                          <span className="text-slate-600">{method.name}</span>
                        </div>
                        <span className="font-semibold">{method.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card className="border-slate-100 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-amber-600" />
                  Daily Revenue vs Target
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dailyRevenue}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis dataKey="date" stroke="#94A3B8" fontSize={12} />
                      <YAxis stroke="#94A3B8" fontSize={12} />
                      <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                      <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                      <Line type="monotone" dataKey="target" stroke="#EF4444" strokeDasharray="5 5" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Revenue by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryRevenue.map((cat) => (
                    <div key={cat.category} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-slate-700 font-medium">{cat.category}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">₹{cat.revenue.toLocaleString()}</span>
                            <span className={`text-xs flex items-center ${cat.growth >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                              {cat.growth >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                              {Math.abs(cat.growth)}%
                            </span>
                          </div>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${(cat.revenue / 50000) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="border-slate-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Today's Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <p className="text-4xl font-bold text-emerald-600">₹18,450</p>
                  <p className="text-slate-500 mt-1">Target: ₹15,000</p>
                  <Badge className="mt-2 bg-emerald-100 text-emerald-700">+23% above target</Badge>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Orders Today</span>
                    <span className="font-semibold">24</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">This Week</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <p className="text-4xl font-bold text-blue-600">₹95,230</p>
                  <p className="text-slate-500 mt-1">vs Last Week: ₹88,450</p>
                  <Badge className="mt-2 bg-blue-100 text-blue-700">+7.6% growth</Badge>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Commission</span>
                    <span className="font-semibold">₹14,285</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-100 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <p className="text-4xl font-bold text-purple-600">₹3,45,600</p>
                  <p className="text-slate-500 mt-1">Target: ₹4,00,000</p>
                  <Badge className="mt-2 bg-amber-100 text-amber-700">86% achieved</Badge>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Days Remaining</span>
                    <span className="font-semibold">12</span>
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
