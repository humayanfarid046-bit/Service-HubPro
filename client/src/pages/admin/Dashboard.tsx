import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, ShoppingBag, TrendingUp, AlertCircle, ArrowUpRight, ArrowDownRight, MoreHorizontal, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { MOCK_REVENUE_DATA, MOCK_ORDERS, MOCK_WORKERS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function AdminDashboard() {
  const stats = [
    { 
        title: "Total Revenue", 
        value: "$45,231.89", 
        change: "+20.1%", 
        trend: "up", 
        icon: TrendingUp,
        color: "text-emerald-600",
        bg: "bg-emerald-50"
    },
    { 
        title: "Active Bookings", 
        value: "2,350", 
        change: "+180.1%", 
        trend: "up", 
        icon: ShoppingBag,
        color: "text-blue-600",
        bg: "bg-blue-50"
    },
    { 
        title: "Active Workers", 
        value: "145", 
        change: "+19%", 
        trend: "up", 
        icon: Users,
        color: "text-indigo-600",
        bg: "bg-indigo-50"
    },
    { 
        title: "Pending Disputes", 
        value: "12", 
        change: "-4.5%", 
        trend: "down", 
        icon: AlertCircle,
        color: "text-rose-600",
        bg: "bg-rose-50"
    },
  ];

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
            <p className="text-slate-500 mt-1">Welcome back, here's what's happening today.</p>
        </div>
        <div className="flex gap-3">
            <Button variant="outline" className="bg-white">Export Report</Button>
            <Button className="bg-slate-900 text-white hover:bg-slate-800">Create New Order</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
            <Card key={i} className="border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className={cn("p-3 rounded-xl", stat.bg, stat.color)}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        {stat.trend === "up" ? (
                            <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                                {stat.change} <ArrowUpRight className="w-3 h-3 ml-1" />
                            </span>
                        ) : (
                            <span className="flex items-center text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-full">
                                {stat.change} <ArrowDownRight className="w-3 h-3 ml-1" />
                            </span>
                        )}
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
        {/* Revenue Chart */}
        <Card className="lg:col-span-2 border-slate-100 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-bold">Revenue Overview</CardTitle>
                <div className="flex gap-2">
                    <select className="text-sm border-none bg-slate-50 rounded-lg px-3 py-1 text-slate-600 outline-none">
                        <option>This Week</option>
                        <option>Last Week</option>
                    </select>
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={MOCK_REVENUE_DATA}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis 
                                dataKey="name" 
                                stroke="#94a3b8" 
                                fontSize={12} 
                                tickLine={false} 
                                axisLine={false} 
                            />
                            <YAxis 
                                stroke="#94a3b8" 
                                fontSize={12} 
                                tickLine={false} 
                                axisLine={false} 
                                tickFormatter={(value) => `$${value}`} 
                            />
                            <Tooltip 
                                cursor={{fill: '#f1f5f9'}}
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            />
                            <Bar 
                                dataKey="revenue" 
                                fill="hsl(221 83% 53%)" 
                                radius={[6, 6, 0, 0]} 
                                barSize={40}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>

        {/* Recent Activity / Live Orders */}
        <Card className="border-slate-100 shadow-sm">
            <CardHeader>
                <CardTitle className="text-lg font-bold">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {MOCK_ORDERS.slice(0, 4).map((order) => (
                    <div key={order.id} className="flex items-start gap-4">
                        <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center shrink-0 border",
                            order.status === "Completed" ? "bg-emerald-50 border-emerald-100 text-emerald-600" :
                            order.status === "Pending" ? "bg-amber-50 border-amber-100 text-amber-600" :
                            "bg-blue-50 border-blue-100 text-blue-600"
                        )}>
                            {order.status === "Completed" ? <ShoppingBag className="w-5 h-5" /> : 
                             order.status === "Pending" ? <Clock className="w-5 h-5" /> :
                             <TrendingUp className="w-5 h-5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">
                                {order.serviceId === "ac-repair" ? "AC Repair" : "Home Cleaning"}
                            </p>
                            <p className="text-xs text-slate-500 truncate">
                                {order.customerName} • {order.status}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-bold text-slate-900">${order.total}</p>
                            <p className="text-xs text-slate-400">{order.time}</p>
                        </div>
                    </div>
                ))}
                
                <Button variant="ghost" className="w-full text-primary text-sm font-medium hover:bg-primary/5">
                    View All Activity
                </Button>
            </CardContent>
        </Card>
      </div>

      {/* KYC Pending Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-slate-100 shadow-sm">
             <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-bold">Worker KYC Requests</CardTitle>
                <Button variant="ghost" className="text-xs text-primary">View All</Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {MOCK_WORKERS.filter(w => w.kycStatus === "Pending" || w.status === "Inactive").map(worker => (
                        <div key={worker.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <img src={worker.avatar} alt={worker.name} className="w-10 h-10 rounded-full object-cover" />
                                <div>
                                    <p className="font-bold text-slate-900 text-sm">{worker.name}</p>
                                    <p className="text-xs text-slate-500">{worker.service}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="h-8 text-xs border-slate-200">Reject</Button>
                                <Button size="sm" className="h-8 text-xs bg-slate-900 hover:bg-slate-800">Approve</Button>
                            </div>
                        </div>
                    ))}
                    {MOCK_WORKERS.filter(w => w.kycStatus === "Pending").length === 0 && (
                        <div className="text-center py-8 text-slate-400 text-sm">No pending KYC requests</div>
                    )}
                </div>
            </CardContent>
        </Card>
        
        {/* Top Services */}
        <Card className="border-slate-100 shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold">Top Services</CardTitle>
            </CardHeader>
             <CardContent>
                <div className="space-y-6">
                    {[
                        { name: "AC Repair", count: 854, color: "bg-blue-500" },
                        { name: "Home Cleaning", count: 642, color: "bg-emerald-500" },
                        { name: "Plumbing", count: 420, color: "bg-amber-500" },
                        { name: "Painting", count: 215, color: "bg-rose-500" },
                    ].map((service, i) => (
                        <div key={i} className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium text-slate-700">{service.name}</span>
                                <span className="text-slate-500">{service.count} bookings</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                    className={cn("h-full rounded-full", service.color)} 
                                    style={{ width: `${(service.count / 1000) * 100}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
             </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
