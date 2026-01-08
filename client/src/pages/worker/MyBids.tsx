import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  ChevronLeft, IndianRupee, Clock, MapPin, CheckCircle, XCircle,
  Home, Laptop, Eye, Loader2, Award, AlertCircle, TrendingUp
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import type { Bid, Job } from "@shared/schema";

export default function WorkerMyBids() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");

  const { data: bids = [], isLoading } = useQuery<Bid[]>({
    queryKey: ["worker-bids", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const res = await fetch(`/api/bids?workerId=${user.id}`);
      if (!res.ok) throw new Error("Failed to fetch bids");
      return res.json();
    },
    enabled: !!user?.id,
  });

  const { data: jobsMap = {} } = useQuery<Record<number, Job>>({
    queryKey: ["bid-jobs", bids.map(b => b.jobId)],
    queryFn: async () => {
      const jobIds = Array.from(new Set(bids.map(b => b.jobId)));
      const jobsData: Record<number, Job> = {};
      for (const jobId of jobIds) {
        try {
          const res = await fetch(`/api/jobs/${jobId}`);
          if (res.ok) {
            jobsData[jobId] = await res.json();
          }
        } catch (e) {
          console.error(`Failed to fetch job ${jobId}`);
        }
      }
      return jobsData;
    },
    enabled: bids.length > 0,
  });

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending": return { bg: "bg-amber-500", text: "text-white", label: "Pending", icon: AlertCircle };
      case "accepted": return { bg: "bg-emerald-500", text: "text-white", label: "Accepted", icon: CheckCircle };
      case "rejected": return { bg: "bg-red-500", text: "text-white", label: "Rejected", icon: XCircle };
      case "withdrawn": return { bg: "bg-slate-500", text: "text-white", label: "Withdrawn", icon: XCircle };
      default: return { bg: "bg-slate-500", text: "text-white", label: status, icon: Clock };
    }
  };

  const filteredBids = activeTab === "all" ? bids : bids.filter(b => b.status === activeTab);

  const stats = {
    total: bids.length,
    pending: bids.filter(b => b.status === "pending").length,
    accepted: bids.filter(b => b.status === "accepted").length,
    rejected: bids.filter(b => b.status === "rejected").length,
  };

  const formatDate = (dateStr: string | Date) => {
    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const getJobCity = (jobId: number) => {
    const job = jobsMap[jobId];
    if (!job?.address) return null;
    const addr = job.address as any;
    return addr.city || addr.street || null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-24">
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-lg border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => setLocation("/worker/dashboard")}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg font-bold text-slate-900">My Bids</h1>
            <p className="text-xs text-slate-500">{bids.length} total bids placed</p>
          </div>
        </div>
      </div>

      <div className="px-5 py-4 space-y-4">
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-3 text-center text-white shadow-lg shadow-blue-500/30">
            <p className="text-xl font-bold">{stats.total}</p>
            <p className="text-[10px] font-medium uppercase tracking-wide text-blue-100">Total</p>
          </div>
          <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl p-3 text-center text-white shadow-lg shadow-amber-500/30">
            <p className="text-xl font-bold">{stats.pending}</p>
            <p className="text-[10px] font-medium uppercase tracking-wide text-amber-100">Pending</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-3 text-center text-white shadow-lg shadow-emerald-500/30">
            <p className="text-xl font-bold">{stats.accepted}</p>
            <p className="text-[10px] font-medium uppercase tracking-wide text-emerald-100">Accepted</p>
          </div>
          <div className="bg-gradient-to-br from-slate-500 to-slate-600 rounded-xl p-3 text-center text-white shadow-lg shadow-slate-500/30">
            <p className="text-xl font-bold">{stats.rejected}</p>
            <p className="text-[10px] font-medium uppercase tracking-wide text-slate-300">Rejected</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-4 h-11 p-1 bg-slate-100 rounded-xl">
            <TabsTrigger value="all" className="rounded-lg text-xs font-semibold">All</TabsTrigger>
            <TabsTrigger value="pending" className="rounded-lg text-xs font-semibold">Pending</TabsTrigger>
            <TabsTrigger value="accepted" className="rounded-lg text-xs font-semibold">Accepted</TabsTrigger>
            <TabsTrigger value="rejected" className="rounded-lg text-xs font-semibold">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4 space-y-3">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-3" />
                <p className="text-sm text-slate-500">Loading your bids...</p>
              </div>
            ) : filteredBids.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">No bids found</h3>
                <p className="text-sm text-slate-500 mb-4">Start bidding on jobs to see them here</p>
                <Button className="rounded-xl" onClick={() => setLocation("/worker/browse-jobs")}>
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Browse Jobs
                </Button>
              </div>
            ) : (
              filteredBids.map((bid, index) => {
                const statusConfig = getStatusConfig(bid.status);
                const StatusIcon = statusConfig.icon;
                const job = jobsMap[bid.jobId];
                const city = getJobCity(bid.jobId);
                return (
                  <motion.div
                    key={bid.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card 
                      className={`border-slate-100 shadow-sm overflow-hidden rounded-2xl ${bid.status === 'accepted' ? 'border-l-4 border-l-emerald-500' : ''}`}
                      data-testid={`card-bid-${bid.id}`}
                    >
                      <CardContent className="p-0">
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1 min-w-0 mr-3">
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <Badge className={`${job?.category === "HOME_VISIT" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"} border-0 text-[10px] font-semibold`}>
                                  {job?.category === "HOME_VISIT" ? <Home className="w-3 h-3 mr-1" /> : <Laptop className="w-3 h-3 mr-1" />}
                                  {job?.category === "HOME_VISIT" ? "Home Visit" : "Remote"}
                                </Badge>
                                <Badge className={`${statusConfig.bg} ${statusConfig.text} border-0 text-[10px] font-semibold`}>
                                  <StatusIcon className="w-3 h-3 mr-1" />
                                  {statusConfig.label}
                                </Badge>
                              </div>
                              <h3 className="font-bold text-slate-900 text-base leading-tight mb-1 line-clamp-1">
                                {job?.title || "Loading..."}
                              </h3>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-lg font-bold text-emerald-600">₹{bid.amount}</p>
                              <p className="text-[10px] text-slate-400 uppercase">Your Bid</p>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                            {city && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5" />
                                {city}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {formatDate(bid.createdAt)}
                            </span>
                          </div>
                        </div>

                        {bid.status === "accepted" && (
                          <div className="px-4 py-3 bg-emerald-50 border-t border-emerald-100">
                            <Button 
                              className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-sm"
                              onClick={() => setLocation(`/worker/job/${bid.jobId}`)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View Job Details
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
