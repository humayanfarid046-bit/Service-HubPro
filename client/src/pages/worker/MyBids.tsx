import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, IndianRupee, Clock, MapPin, CheckCircle, XCircle,
  Home, Laptop, Eye, Loader2, Award
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import type { Bid, Job } from "@shared/schema";

interface BidWithJob extends Bid {
  job?: Job;
}

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

  // Fetch job details for each bid
  const { data: jobsMap = {} } = useQuery<Record<number, Job>>({
    queryKey: ["bid-jobs", bids.map(b => b.jobId)],
    queryFn: async () => {
      const jobIds = [...new Set(bids.map(b => b.jobId))];
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending": return { color: "bg-amber-100 text-amber-700", label: "Pending", icon: Loader2 };
      case "accepted": return { color: "bg-emerald-100 text-emerald-700", label: "Accepted", icon: CheckCircle };
      case "rejected": return { color: "bg-red-100 text-red-700", label: "Rejected", icon: XCircle };
      case "withdrawn": return { color: "bg-slate-100 text-slate-700", label: "Withdrawn", icon: XCircle };
      default: return { color: "bg-slate-100 text-slate-700", label: status, icon: Clock };
    }
  };

  const filteredBids = activeTab === "all" ? bids : bids.filter(b => b.status === activeTab);

  const stats = {
    total: bids.length,
    pending: bids.filter(b => b.status === "pending").length,
    accepted: bids.filter(b => b.status === "accepted").length,
    rejected: bids.filter(b => b.status === "rejected").length,
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  const getJobCity = (jobId: number) => {
    const job = jobsMap[jobId];
    if (!job?.address) return null;
    const addr = job.address as any;
    return addr.city || addr.street || null;
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="sticky top-0 z-10 bg-white border-b border-slate-100 px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => setLocation("/worker/dashboard")}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-lg font-semibold">My Bids</h1>
          <p className="text-xs text-slate-500">{bids.length} total bids placed</p>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-4 gap-2 mb-4">
          <Card className="bg-blue-50 border-blue-100">
            <CardContent className="p-3 text-center">
              <p className="text-xl font-bold text-blue-700">{stats.total}</p>
              <p className="text-xs text-slate-500">Total</p>
            </CardContent>
          </Card>
          <Card className="bg-amber-50 border-amber-100">
            <CardContent className="p-3 text-center">
              <p className="text-xl font-bold text-amber-700">{stats.pending}</p>
              <p className="text-xs text-slate-500">Pending</p>
            </CardContent>
          </Card>
          <Card className="bg-emerald-50 border-emerald-100">
            <CardContent className="p-3 text-center">
              <p className="text-xl font-bold text-emerald-700">{stats.accepted}</p>
              <p className="text-xs text-slate-500">Accepted</p>
            </CardContent>
          </Card>
          <Card className="bg-red-50 border-red-100">
            <CardContent className="p-3 text-center">
              <p className="text-xl font-bold text-red-700">{stats.rejected}</p>
              <p className="text-xs text-slate-500">Rejected</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-4 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="accepted">Accepted</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-3">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : filteredBids.length === 0 ? (
              <Card className="border-dashed border-slate-200">
                <CardContent className="p-8 text-center">
                  <Award className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">No bids found</p>
                  <Button className="mt-4" onClick={() => setLocation("/worker/browse-jobs")}>
                    Browse Jobs
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredBids.map((bid) => {
                const statusBadge = getStatusBadge(bid.status);
                const StatusIcon = statusBadge.icon;
                const job = jobsMap[bid.jobId];
                const city = getJobCity(bid.jobId);
                return (
                  <Card 
                    key={bid.id} 
                    className={`border-slate-100 shadow-sm overflow-hidden ${bid.status === 'accepted' ? 'border-l-4 border-l-emerald-500' : ''}`}
                    data-testid={`card-bid-${bid.id}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className={job?.category === "HOME_VISIT" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-purple-50 text-purple-700 border-purple-200"}>
                              {job?.category === "HOME_VISIT" ? <Home className="w-3 h-3 mr-1" /> : <Laptop className="w-3 h-3 mr-1" />}
                              {job?.category === "HOME_VISIT" ? "Home Visit" : "Remote"}
                            </Badge>
                            <Badge className={statusBadge.color}>
                              <StatusIcon className={`w-3 h-3 mr-1 ${bid.status === 'pending' ? 'animate-spin' : ''}`} />
                              {statusBadge.label}
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-slate-900">{job?.title || "Loading..."}</h3>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-emerald-600">₹{bid.amount}</p>
                          <p className="text-xs text-slate-400">Your bid</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-3">
                        {city && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {city}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(bid.createdAt)}
                        </span>
                      </div>

                      {bid.status === "accepted" && (
                        <div className="mt-4 pt-3 border-t border-slate-100">
                          <Button className="w-full gap-2" onClick={() => setLocation(`/worker/job/${bid.jobId}`)}>
                            <Eye className="w-4 h-4" />
                            View Job Details
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
