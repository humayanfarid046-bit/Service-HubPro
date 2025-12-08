import { MOCK_ORDERS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { 
  MapPin, Navigation, Clock, CheckCircle2, DollarSign, 
  TrendingUp, Star, Bell, ShieldCheck, FileText, ChevronRight,
  Briefcase, Wallet, Users, AlertCircle
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const EARNINGS_DATA = [
  { name: "Mon", amount: 120 },
  { name: "Tue", amount: 200 },
  { name: "Wed", amount: 150 },
  { name: "Thu", amount: 300 },
  { name: "Fri", amount: 250 },
  { name: "Sat", amount: 380 },
  { name: "Sun", amount: 180 },
];

const REVIEWS = [
  { id: 1, user: "Alice Smith", rating: 5, text: "Excellent service! Very professional.", date: "2 days ago" },
  { id: 2, user: "Bob Jones", rating: 4, text: "Good work but arrived a bit late.", date: "1 week ago" },
];

export default function WorkerDashboard() {
  const { user } = useAuth();
  const [isOnline, setIsOnline] = useState(true);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    toast({
        title: "Status Updated",
        description: `Order ${orderId} marked as ${newStatus}`,
    });
  };

  return (
    <div className="pb-24 bg-slate-50 min-h-full font-sans">
      {/* 1. Worker Header Section */}
      <div className="bg-slate-900 text-white pt-8 pb-24 px-6 rounded-b-[2.5rem] relative overflow-hidden shadow-2xl shadow-slate-900/20">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <Briefcase className="w-64 h-64" />
        </div>
        
        <div className="flex justify-between items-start mb-8 relative z-10">
            <div className="flex items-center gap-4">
                <div className="relative">
                    <img 
                        src={user?.avatar || "https://i.pravatar.cc/150?u=worker1"} 
                        className="w-14 h-14 rounded-full border-4 border-white/10 shadow-lg"
                        alt="Profile"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-slate-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-slate-900 flex items-center gap-0.5 shadow-sm">
                        <Star className="w-2.5 h-2.5 fill-current" /> 4.8
                    </div>
                </div>
                <div>
                    <h1 className="text-xl font-bold leading-tight">{user?.name}</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-xs font-medium text-slate-300">Verified Partner</span>
                    </div>
                </div>
            </div>
            
            <button 
                className={cn(
                    "flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full transition-all border shadow-lg backdrop-blur-md",
                    isOnline 
                        ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-300" 
                        : "bg-red-500/20 border-red-500/30 text-red-300"
                )}
                onClick={() => setIsOnline(!isOnline)}
            >
                <div className={cn("w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor]", isOnline ? "bg-emerald-400" : "bg-red-400")} />
                <span className="text-xs font-bold uppercase tracking-wide">{isOnline ? "Online" : "Offline"}</span>
            </button>
        </div>

        {/* Quick Stats Bar */}
        <div className="flex justify-between bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 relative z-10">
            <div className="text-center flex-1 border-r border-white/10">
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Today's Jobs</p>
                <p className="text-xl font-bold">4</p>
            </div>
            <div className="text-center flex-1 border-r border-white/10">
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Pending</p>
                <p className="text-xl font-bold text-yellow-400">2</p>
            </div>
            <div className="text-center flex-1">
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Earned</p>
                <p className="text-xl font-bold text-emerald-400">$128</p>
            </div>
        </div>
      </div>

      <div className="px-5 -mt-16 relative z-20 space-y-8">
        
        {/* 6. New Job Requests (Priority) */}
        <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
                <h2 className="text-lg font-bold text-slate-900">New Requests <span className="text-sm font-medium text-slate-400 ml-1">(1)</span></h2>
            </div>
            <Card className="border-0 shadow-xl shadow-slate-200/50 rounded-[1.5rem] overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
                                JS
                             </div>
                             <div>
                                <h3 className="font-bold text-slate-900">James Smith</h3>
                                <p className="text-xs text-slate-500">2 mins ago</p>
                             </div>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-lg text-slate-900">$150</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Est. Price</p>
                        </div>
                    </div>
                    
                    <div className="bg-slate-50 rounded-xl p-3 mb-4 space-y-2">
                         <div className="flex items-center gap-2 text-sm text-slate-700">
                            <Briefcase className="w-4 h-4 text-slate-400" />
                            <span className="font-medium">AC Installation (Split Unit)</span>
                         </div>
                         <div className="flex items-center gap-2 text-sm text-slate-700">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            <span className="truncate">45 Park Avenue, NY</span>
                         </div>
                    </div>

                    <div className="flex gap-3">
                        <Button variant="outline" className="flex-1 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50">Reject</Button>
                        <Button className="flex-1 rounded-xl bg-slate-900 text-white shadow-lg shadow-slate-900/20 hover:bg-slate-800">Accept Request</Button>
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* 2. Earnings Summary & Graph */}
        <div className="space-y-4">
             <div className="flex items-center justify-between px-1">
                <h2 className="text-lg font-bold text-slate-900">Earnings Overview</h2>
                <button className="text-xs font-bold text-primary flex items-center" onClick={() => setLocation("/worker/earnings")}>
                    See All <ChevronRight className="w-3 h-3 ml-0.5" />
                </button>
            </div>
            <div className="bg-white p-5 rounded-[1.5rem] shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Weekly Income</p>
                        <h3 className="text-3xl font-bold text-slate-900 mt-1">$1,580.50</h3>
                        <p className="text-xs font-bold text-emerald-500 mt-1 flex items-center">
                            <TrendingUp className="w-3 h-3 mr-1" /> +12% from last week
                        </p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
                        <DollarSign className="w-6 h-6" />
                    </div>
                </div>
                
                {/* Graph */}
                <div className="h-32 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={EARNINGS_DATA}>
                            <defs>
                                <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <Tooltip 
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                            />
                            <Area type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorEarnings)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        {/* 3. Job Overview Grid */}
        <div className="grid grid-cols-2 gap-3">
             {[
                { label: "Accepted", count: 3, icon: CheckCircle2, color: "text-blue-600", bg: "bg-blue-50" },
                { label: "On the Way", count: 1, icon: Navigation, color: "text-purple-600", bg: "bg-purple-50" },
                { label: "Working", count: 1, icon:Briefcase, color: "text-orange-600", bg: "bg-orange-50" },
                { label: "Completed", count: 145, icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
             ].map((stat, i) => (
                <button key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-start hover:bg-slate-50 transition-colors text-left">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", stat.bg, stat.color)}>
                        <stat.icon className="w-5 h-5" />
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{stat.count}</p>
                    <p className="text-xs font-medium text-slate-500">{stat.label}</p>
                </button>
             ))}
        </div>

        {/* 4. Upcoming Jobs Timeline */}
        <div className="space-y-4">
             <h2 className="text-lg font-bold text-slate-900 px-1">Upcoming Schedule</h2>
             <div className="space-y-4">
                {MOCK_ORDERS.filter(o => o.workerId === "worker1" && o.status !== "Completed").slice(0, 3).map((order) => (
                    <div 
                        key={order.id} 
                        className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group active:scale-[0.98] transition-all"
                        onClick={() => setLocation(`/worker/job/${order.id}`)}
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-slate-100 rounded-xl">
                                    <Clock className="w-5 h-5 text-slate-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">Today, {order.time}</p>
                                    <p className="text-xs text-slate-500">Job ID: {order.id}</p>
                                </div>
                            </div>
                            <span className={cn(
                                "px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide",
                                order.status === "On the Way" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                            )}>
                                {order.status}
                            </span>
                        </div>
                        
                        <div className="pl-[3.25rem]">
                            <h3 className="font-bold text-slate-900 text-base mb-1">AC Repair Service</h3>
                            <p className="text-sm text-slate-500 mb-4">{order.address}</p>
                            
                            <div className="flex items-center gap-3">
                                <Button size="sm" className="bg-slate-900 text-white rounded-lg h-9 px-4 text-xs">
                                    View Details
                                </Button>
                                <Button size="sm" variant="outline" className="rounded-lg h-9 w-9 p-0 border-slate-200">
                                    <Navigation className="w-4 h-4 text-slate-600" />
                                </Button>
                                <Button size="sm" variant="outline" className="rounded-lg h-9 w-9 p-0 border-slate-200">
                                    <Users className="w-4 h-4 text-slate-600" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
             </div>
        </div>

        {/* 7. Performance & Ratings */}
        <div className="space-y-4">
             <h2 className="text-lg font-bold text-slate-900 px-1">Performance</h2>
             <Card className="border-0 shadow-sm bg-indigo-600 text-white rounded-[1.5rem] overflow-hidden">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <p className="text-indigo-200 text-xs font-bold uppercase tracking-wider mb-1">Overall Rating</p>
                            <div className="flex items-end gap-2">
                                <h3 className="text-4xl font-bold">4.8</h3>
                                <div className="flex pb-1.5 text-yellow-400">
                                    {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                             <p className="text-indigo-200 text-xs font-bold uppercase tracking-wider mb-1">Total Jobs</p>
                             <p className="text-2xl font-bold">145</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {REVIEWS.map(review => (
                            <div key={review.id} className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
                                <div className="flex justify-between items-start mb-1">
                                    <p className="text-sm font-bold">{review.user}</p>
                                    <span className="text-[10px] text-indigo-200">{review.date}</span>
                                </div>
                                <p className="text-xs text-indigo-100 leading-relaxed">"{review.text}"</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
             </Card>
        </div>

      </div>
    </div>
  );
}
