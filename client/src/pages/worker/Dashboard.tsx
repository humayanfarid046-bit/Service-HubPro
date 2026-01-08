import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { 
  MapPin, Clock, CheckCircle2, TrendingUp, Star, Bell,
  ShieldCheck, ChevronRight, Briefcase, Wallet, Users, 
  Calendar, IndianRupee, Target, Award, Eye, Zap, ArrowUpRight
} from "lucide-react";
import { useState } from "react";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";

const EARNINGS_DATA = [
  { name: "Mon", amount: 1200 },
  { name: "Tue", amount: 2000 },
  { name: "Wed", amount: 1500 },
  { name: "Thu", amount: 3000 },
  { name: "Fri", amount: 2500 },
  { name: "Sat", amount: 3800 },
  { name: "Sun", amount: 1800 },
];

export default function WorkerDashboard() {
  const { user } = useAuth();
  const [isOnline, setIsOnline] = useState(true);
  const [, setLocation] = useLocation();

  const { data: myBids = [] } = useQuery({
    queryKey: ["worker-bids", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const res = await fetch(`/api/bids?workerId=${user.id}`);
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!user?.id,
  });

  const { data: openJobs = [] } = useQuery({
    queryKey: ["open-jobs"],
    queryFn: async () => {
      const res = await fetch("/api/jobs?status=open");
      if (!res.ok) return [];
      return res.json();
    },
  });

  const pendingBids = myBids.filter((b: any) => b.status === "pending").length;
  const acceptedBids = myBids.filter((b: any) => b.status === "accepted").length;

  const quickStats = [
    { label: "Open Jobs", value: openJobs.length, icon: Briefcase, color: "from-blue-500 to-blue-600", shadow: "shadow-blue-500/30" },
    { label: "My Bids", value: myBids.length, icon: Target, color: "from-purple-500 to-purple-600", shadow: "shadow-purple-500/30" },
    { label: "Accepted", value: acceptedBids, icon: CheckCircle2, color: "from-emerald-500 to-emerald-600", shadow: "shadow-emerald-500/30" },
    { label: "Pending", value: pendingBids, icon: Clock, color: "from-amber-500 to-orange-500", shadow: "shadow-amber-500/30" },
  ];

  const menuItems = [
    { icon: Briefcase, label: "Browse Jobs", desc: "Find new work", path: "/worker/browse-jobs", color: "bg-blue-500" },
    { icon: Target, label: "My Bids", desc: "Track your bids", path: "/worker/my-bids", color: "bg-purple-500" },
    { icon: Wallet, label: "Earnings", desc: "View payouts", path: "/worker/earnings", color: "bg-emerald-500" },
    { icon: Calendar, label: "Schedule", desc: "Manage time", path: "/worker/schedule", color: "bg-orange-500" },
    { icon: Star, label: "Reviews", desc: "Your ratings", path: "/worker/reviews", color: "bg-amber-500" },
    { icon: Users, label: "Profile", desc: "Edit details", path: "/worker/profile", color: "bg-slate-700" },
  ];

  return (
    <div className="pb-24 bg-gradient-to-b from-slate-50 to-white min-h-screen">
      <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 pt-8 pb-20 px-5 rounded-b-[2.5rem] shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        
        <div className="flex justify-between items-start mb-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg overflow-hidden">
                {user?.profilePhoto ? (
                  <img src={user.profilePhoto} alt="" className="w-full h-full object-cover" />
                ) : (
                  (user?.fullName || "W").charAt(0).toUpperCase()
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-slate-900 flex items-center gap-0.5">
                <Star className="w-2.5 h-2.5 fill-current" /> 4.8
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">{user?.fullName || "Worker"}</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs font-medium text-slate-400">Verified Partner</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center"
              onClick={() => setLocation("/worker/notifications")}
            >
              <Bell className="w-5 h-5 text-white" />
            </button>
            <button 
              className={cn(
                "flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full transition-all border backdrop-blur-md",
                isOnline 
                  ? "bg-emerald-500/20 border-emerald-500/30" 
                  : "bg-red-500/20 border-red-500/30"
              )}
              onClick={() => setIsOnline(!isOnline)}
            >
              <div className={cn(
                "w-2.5 h-2.5 rounded-full",
                isOnline ? "bg-emerald-400 shadow-[0_0_8px_#34d399]" : "bg-red-400 shadow-[0_0_8px_#f87171]"
              )} />
              <span className={cn(
                "text-xs font-bold uppercase tracking-wide",
                isOnline ? "text-emerald-400" : "text-red-400"
              )}>
                {isOnline ? "Online" : "Offline"}
              </span>
            </button>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 relative z-10">
          <div className="flex justify-between text-center">
            <div className="flex-1 border-r border-white/10">
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Today</p>
              <p className="text-xl font-bold text-white">3</p>
            </div>
            <div className="flex-1 border-r border-white/10">
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">This Week</p>
              <p className="text-xl font-bold text-white">12</p>
            </div>
            <div className="flex-1">
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Earnings</p>
              <p className="text-xl font-bold text-emerald-400">₹15,800</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 -mt-10 relative z-20 space-y-6">
        <div className="grid grid-cols-2 gap-3">
          {quickStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "bg-gradient-to-br p-4 rounded-2xl text-white shadow-lg cursor-pointer active:scale-[0.98] transition-transform",
                stat.color, stat.shadow
              )}
              onClick={() => {
                if (stat.label === "Open Jobs") setLocation("/worker/browse-jobs");
                if (stat.label === "My Bids") setLocation("/worker/my-bids");
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <stat.icon className="w-5 h-5" />
                </div>
                <span className="text-2xl font-bold">{stat.value}</span>
              </div>
              <p className="font-semibold text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-5 text-white shadow-lg shadow-indigo-500/30 cursor-pointer"
          onClick={() => setLocation("/worker/browse-jobs")}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4" />
                <span className="text-xs font-bold text-indigo-200 uppercase tracking-wider">New Opportunities</span>
              </div>
              <p className="font-semibold text-lg mb-1">{openJobs.length} Jobs Available</p>
              <p className="text-sm text-white/80">Browse and place your bids now</p>
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
              <ArrowUpRight className="w-7 h-7" />
            </div>
          </div>
        </motion.div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {menuItems.map((item, i) => (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * i }}
                className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all text-center group"
                onClick={() => setLocation(item.path)}
                data-testid={`menu-${item.label.toLowerCase().replace(' ', '-')}`}
              >
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2 text-white shadow-lg group-hover:scale-110 transition-transform",
                  item.color
                )}>
                  <item.icon className="w-6 h-6" />
                </div>
                <p className="font-semibold text-sm text-slate-900">{item.label}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{item.desc}</p>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900">Weekly Earnings</h3>
              <p className="text-xs text-slate-500">Last 7 days performance</p>
            </div>
            <button 
              className="text-sm text-blue-600 font-semibold flex items-center gap-1"
              onClick={() => setLocation("/worker/earnings")}
            >
              Details <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div>
              <p className="text-3xl font-bold text-slate-900">₹15,800</p>
              <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" /> +12% from last week
              </p>
            </div>
          </div>
          <div className="h-24">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={EARNINGS_DATA}>
                <defs>
                  <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: any) => [`₹${value}`, 'Earnings']}
                />
                <Area type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorEarnings)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-500/30">
              <Award className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900">Your Performance</h3>
              <p className="text-sm text-slate-600">4.8 rating • 145 jobs completed</p>
            </div>
            <Button variant="outline" size="sm" className="rounded-xl" onClick={() => setLocation("/worker/reviews")}>
              View
            </Button>
          </div>
        </div>

        {acceptedBids > 0 && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              <h3 className="font-bold text-slate-900">Active Jobs</h3>
            </div>
            <p className="text-sm text-slate-600 mb-3">You have {acceptedBids} accepted bid(s) to complete</p>
            <Button 
              className="w-full bg-emerald-600 hover:bg-emerald-700 rounded-xl"
              onClick={() => setLocation("/worker/my-bids?status=accepted")}
            >
              View Active Jobs
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
