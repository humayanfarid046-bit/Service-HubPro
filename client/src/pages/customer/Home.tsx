import { SERVICES, Service } from "@/lib/mock-data";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { 
  Search, MapPin, Star, Plus, Briefcase, TrendingUp, Home, Laptop,
  Calendar, Clock, Bell, User, ChevronRight, Sparkles, Gift,
  CheckCircle, Zap, Shield, Heart, ArrowRight
} from "lucide-react";
import { useState } from "react";

export default function CustomerHome() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: myJobs = [] } = useQuery({
    queryKey: ["jobs", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const res = await fetch(`/api/jobs?customerId=${user.id}`);
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!user?.id,
  });

  const filteredServices = SERVICES.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openJobs = myJobs.filter((j: any) => j.status === "open").length;
  const assignedJobs = myJobs.filter((j: any) => j.status === "assigned").length;

  return (
    <div className="pb-24 bg-gradient-to-b from-slate-50 to-white min-h-screen">
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 pt-8 pb-16 px-5 rounded-b-[2.5rem] shadow-xl shadow-blue-900/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        
        <div className="flex justify-between items-start mb-6 relative z-10">
          <div>
            <p className="text-blue-200 text-xs font-semibold uppercase tracking-wider mb-1">Welcome back</p>
            <h1 className="text-xl font-bold text-white">{user?.fullName || "Guest"}</h1>
            <div className="flex items-center text-blue-200 text-sm gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>Kolkata, West Bengal</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center"
              onClick={() => setLocation("/customer/notifications")}
            >
              <Bell className="w-5 h-5 text-white" />
            </button>
            <button 
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center overflow-hidden"
              onClick={() => setLocation("/customer/profile")}
            >
              {user?.profilePhoto ? (
                <img src={user.profilePhoto} alt="" className="w-full h-full object-cover" />
              ) : (
                <User className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </div>

        <div className="relative z-10">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input 
              className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white border-0 shadow-lg text-slate-900 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-white/50 text-base"
              placeholder="Search for services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              data-testid="input-search"
            />
          </div>
        </div>
      </div>

      <div className="px-5 -mt-8 relative z-20 space-y-6">
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-orange-500 to-rose-500 p-4 rounded-2xl text-white shadow-lg shadow-orange-500/30 cursor-pointer active:scale-[0.98] transition-transform"
            onClick={() => setLocation("/customer/my-jobs")}
            data-testid="card-my-jobs"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold">{myJobs.length}</span>
            </div>
            <p className="font-semibold text-sm">My Jobs</p>
            <p className="text-xs text-white/80">{openJobs} open, {assignedJobs} assigned</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-violet-500 to-purple-600 p-4 rounded-2xl text-white shadow-lg shadow-violet-500/30 cursor-pointer active:scale-[0.98] transition-transform"
            onClick={() => setLocation("/customer/bookings")}
            data-testid="card-bookings"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold">0</span>
            </div>
            <p className="font-semibold text-sm">Bookings</p>
            <p className="text-xs text-white/80">Active appointments</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-5 text-white shadow-lg shadow-emerald-500/30 cursor-pointer active:scale-[0.98] transition-transform"
          onClick={() => setLocation("/customer/post-job")}
          data-testid="banner-post-job"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4" />
                <span className="text-xs font-bold text-emerald-100 uppercase tracking-wider">Post a New Job</span>
              </div>
              <p className="font-semibold mb-1">Need something done?</p>
              <p className="text-sm text-white/80">Post your job and get bids from experts</p>
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center ml-4">
              <Plus className="w-7 h-7" />
            </div>
          </div>
        </motion.div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Job Categories</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm cursor-pointer hover:shadow-md transition-all group"
              onClick={() => setLocation("/customer/post-job?type=HOME_VISIT")}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-3 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                <Home className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-slate-900 mb-1">Home Visit</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Worker comes to your location</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm cursor-pointer hover:shadow-md transition-all group"
              onClick={() => setLocation("/customer/post-job?type=REMOTE")}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-3 shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
                <Laptop className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-slate-900 mb-1">Remote</h3>
              <p className="text-xs text-slate-500 leading-relaxed">No home visit needed</p>
            </motion.div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-slate-900">Popular Services</h2>
            <button className="text-sm text-blue-600 font-semibold flex items-center gap-1">
              See All <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {filteredServices.slice(0, 6).map((service, idx) => (
              <ServiceCard 
                key={service.id} 
                service={service} 
                index={idx}
                onClick={() => setLocation(`/customer/book/${service.id}`)} 
              />
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl p-5 relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 opacity-20">
            <Gift className="w-32 h-32 -mr-8 -mt-8" />
          </div>
          <div className="relative z-10">
            <Badge className="bg-white/20 text-white border-0 mb-2">Limited Offer</Badge>
            <h3 className="text-white font-bold text-xl mb-1">25% OFF</h3>
            <p className="text-white/90 text-sm mb-4">On your first home cleaning service</p>
            <Button className="bg-white text-orange-600 hover:bg-white/90 font-semibold rounded-xl shadow-lg">
              Claim Now
            </Button>
          </div>
        </motion.div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Why Choose Us?
          </h3>
          <div className="space-y-3">
            {[
              { icon: CheckCircle, text: "Verified & background-checked workers", color: "text-emerald-600" },
              { icon: Star, text: "4.8+ rated service professionals", color: "text-amber-500" },
              { icon: Clock, text: "On-time service guarantee", color: "text-blue-600" },
              { icon: Heart, text: "100% satisfaction promise", color: "text-rose-500" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <item.icon className={cn("w-5 h-5", item.color)} />
                <span className="text-sm text-slate-600">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ServiceCard({ service, onClick, index }: { service: Service; onClick: () => void; index: number }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
      onClick={onClick}
      className="flex flex-col items-start p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all active:scale-[0.98] text-left w-full"
      data-testid={`card-service-${service.id}`}
    >
      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-3 shadow-sm", service.color)}>
        <service.icon className="w-6 h-6" />
      </div>
      <h3 className="font-bold text-slate-900 text-sm mb-1 line-clamp-1">{service.title}</h3>
      <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">{service.description}</p>
      
      <div className="mt-auto w-full flex items-center justify-between pt-2 border-t border-slate-100">
        <span className="text-sm font-bold text-slate-900">₹{service.price}</span>
        <div className="flex items-center gap-1 text-xs font-medium text-slate-500">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          {service.rating}
        </div>
      </div>
    </motion.button>
  );
}
