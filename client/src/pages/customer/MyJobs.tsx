import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  Plus, ChevronLeft, Briefcase, Clock, MapPin, IndianRupee,
  Users, Home, Laptop, Eye, CheckCircle, Loader2, AlertCircle
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import type { Job } from "@shared/schema";

export default function CustomerMyJobs() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");

  const { data: jobs = [], isLoading } = useQuery<Job[]>({
    queryKey: ["jobs", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const res = await fetch(`/api/jobs?customerId=${user.id}`);
      if (!res.ok) throw new Error("Failed to fetch jobs");
      return res.json();
    },
    enabled: !!user?.id,
  });

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "open": return { bg: "bg-emerald-500", text: "text-white", label: "Open" };
      case "assigned": return { bg: "bg-blue-500", text: "text-white", label: "Assigned" };
      case "in_progress": return { bg: "bg-amber-500", text: "text-white", label: "In Progress" };
      case "completed": return { bg: "bg-slate-500", text: "text-white", label: "Completed" };
      case "cancelled": return { bg: "bg-red-500", text: "text-white", label: "Cancelled" };
      default: return { bg: "bg-slate-500", text: "text-white", label: status };
    }
  };

  const filteredJobs = activeTab === "all" ? jobs : jobs.filter(j => j.status === activeTab);

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

  const getAddress = (job: Job) => {
    if (!job.address) return null;
    const addr = job.address as any;
    return addr.city || addr.street || null;
  };

  const stats = {
    total: jobs.length,
    open: jobs.filter(j => j.status === "open").length,
    assigned: jobs.filter(j => j.status === "assigned").length,
    completed: jobs.filter(j => j.status === "completed").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-24">
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-lg border-b border-slate-100 px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => setLocation("/customer/home")}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold text-slate-900">My Jobs</h1>
              <p className="text-xs text-slate-500">{jobs.length} total jobs posted</p>
            </div>
          </div>
          <Button size="sm" className="gap-1.5 rounded-xl shadow-lg shadow-blue-500/20" onClick={() => setLocation("/customer/post-job")} data-testid="button-new-job">
            <Plus className="w-4 h-4" />
            New Job
          </Button>
        </div>
      </div>

      <div className="px-5 py-4 space-y-4">
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: "Total", value: stats.total, color: "bg-slate-100 text-slate-700" },
            { label: "Open", value: stats.open, color: "bg-emerald-100 text-emerald-700" },
            { label: "Active", value: stats.assigned, color: "bg-blue-100 text-blue-700" },
            { label: "Done", value: stats.completed, color: "bg-slate-100 text-slate-600" },
          ].map((stat, i) => (
            <div key={i} className={`${stat.color} rounded-xl p-3 text-center`}>
              <p className="text-xl font-bold">{stat.value}</p>
              <p className="text-[10px] font-medium uppercase tracking-wide">{stat.label}</p>
            </div>
          ))}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-4 h-11 p-1 bg-slate-100 rounded-xl">
            <TabsTrigger value="all" className="rounded-lg text-xs font-semibold">All</TabsTrigger>
            <TabsTrigger value="open" className="rounded-lg text-xs font-semibold">Open</TabsTrigger>
            <TabsTrigger value="assigned" className="rounded-lg text-xs font-semibold">Assigned</TabsTrigger>
            <TabsTrigger value="completed" className="rounded-lg text-xs font-semibold">Done</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4 space-y-3">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-3" />
                <p className="text-sm text-slate-500">Loading your jobs...</p>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">No jobs found</h3>
                <p className="text-sm text-slate-500 mb-4">Post a job to get started</p>
                <Button className="rounded-xl" onClick={() => setLocation("/customer/post-job")}>
                  <Plus className="w-4 h-4 mr-1" />
                  Post Your First Job
                </Button>
              </div>
            ) : (
              filteredJobs.map((job, index) => {
                const statusConfig = getStatusConfig(job.status);
                const city = getAddress(job);
                return (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card 
                      className="border-slate-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden rounded-2xl"
                      data-testid={`card-job-${job.id}`}
                    >
                      <CardContent className="p-0">
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1 min-w-0 mr-3">
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <Badge className={`${job.category === "HOME_VISIT" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"} border-0 text-[10px] font-semibold`}>
                                  {job.category === "HOME_VISIT" ? <Home className="w-3 h-3 mr-1" /> : <Laptop className="w-3 h-3 mr-1" />}
                                  {job.category === "HOME_VISIT" ? "Home Visit" : "Remote"}
                                </Badge>
                                <Badge className={`${statusConfig.bg} ${statusConfig.text} border-0 text-[10px] font-semibold`}>
                                  {statusConfig.label}
                                </Badge>
                              </div>
                              <h3 className="font-bold text-slate-900 text-base leading-tight mb-1 line-clamp-1">{job.title}</h3>
                              <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{job.description}</p>
                            </div>
                            {job.budget && (
                              <div className="text-right shrink-0">
                                <p className="text-lg font-bold text-emerald-600">₹{job.budget}</p>
                                <p className="text-[10px] text-slate-400 uppercase">Budget</p>
                              </div>
                            )}
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
                              {formatDate(job.createdAt)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-t border-slate-100">
                          <div className="flex items-center gap-1.5">
                            <Users className="w-4 h-4 text-blue-600" />
                            <span className="font-semibold text-blue-600 text-sm">{job.totalBids || 0} bids</span>
                          </div>
                          <Button 
                            size="sm" 
                            className={`rounded-xl text-xs ${job.status === "open" ? "bg-blue-600 hover:bg-blue-700" : "bg-slate-700 hover:bg-slate-800"}`}
                            onClick={() => setLocation(`/customer/job/${job.id}/bids`)}
                            data-testid={`button-view-bids-${job.id}`}
                          >
                            {job.status === "open" ? (
                              <>
                                <Eye className="w-3.5 h-3.5 mr-1" />
                                View Bids
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-3.5 h-3.5 mr-1" />
                                Details
                              </>
                            )}
                          </Button>
                        </div>
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
