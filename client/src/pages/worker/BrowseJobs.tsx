import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { 
  Search, ChevronLeft, Briefcase, Clock, MapPin, IndianRupee,
  Users, Home, Laptop, Filter, Flame, TrendingUp, Loader2, Zap
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import type { Job } from "@shared/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function WorkerBrowseJobs() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { data: jobs = [], isLoading } = useQuery<Job[]>({
    queryKey: ["jobs", "open"],
    queryFn: async () => {
      const res = await fetch("/api/jobs?status=open");
      if (!res.ok) throw new Error("Failed to fetch jobs");
      return res.json();
    },
  });

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeTab === "all" || job.category === activeTab;
    const matchesService = categoryFilter === "all" || job.serviceType === categoryFilter;
    return matchesSearch && matchesCategory && matchesService;
  });

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-24">
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-lg border-b border-slate-100">
        <div className="px-5 py-4">
          <div className="flex items-center gap-3 mb-4">
            <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => setLocation("/worker/dashboard")}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-slate-900">Browse Jobs</h1>
              <p className="text-xs text-slate-500">{filteredJobs.length} jobs available</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Search jobs..." 
                className="pl-10 h-11 rounded-xl bg-slate-100 border-0 focus-visible:ring-2 focus-visible:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search-jobs"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-28 h-11 rounded-xl bg-slate-100 border-0">
                <Filter className="w-4 h-4 mr-1 text-slate-500" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="plumbing">Plumbing</SelectItem>
                <SelectItem value="electrical">Electrical</SelectItem>
                <SelectItem value="cleaning">Cleaning</SelectItem>
                <SelectItem value="ac_repair">AC Repair</SelectItem>
                <SelectItem value="painting">Painting</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="px-5 pb-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full grid grid-cols-3 h-10 p-1 bg-slate-100 rounded-xl">
              <TabsTrigger value="all" className="rounded-lg text-xs font-semibold">All Jobs</TabsTrigger>
              <TabsTrigger value="HOME_VISIT" className="rounded-lg text-xs font-semibold gap-1">
                <Home className="w-3 h-3" />
                Home Visit
              </TabsTrigger>
              <TabsTrigger value="REMOTE" className="rounded-lg text-xs font-semibold gap-1">
                <Laptop className="w-3 h-3" />
                Remote
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="px-5 py-4 space-y-3">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-3" />
            <p className="text-sm text-slate-500">Finding jobs for you...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">No jobs found</h3>
            <p className="text-sm text-slate-500">Try adjusting your filters or check back later</p>
          </div>
        ) : (
          filteredJobs.map((job, index) => {
            const city = getAddress(job);
            return (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card 
                  className="border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden rounded-2xl cursor-pointer active:scale-[0.99]"
                  onClick={() => setLocation(`/worker/job/${job.id}/bid`)}
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
                            {job.urgency === "urgent" && (
                              <Badge className="bg-red-500 text-white border-0 text-[10px] font-semibold">
                                <Flame className="w-3 h-3 mr-1" />
                                Urgent
                              </Badge>
                            )}
                          </div>
                          <h3 className="font-bold text-slate-900 text-base leading-tight mb-1 line-clamp-1">{job.title}</h3>
                          <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{job.description}</p>
                        </div>
                        {job.budget && (
                          <div className="text-right shrink-0 bg-emerald-50 px-3 py-2 rounded-xl">
                            <p className="text-lg font-bold text-emerald-600">₹{job.budget}</p>
                            <p className="text-[10px] text-emerald-600/70 uppercase font-medium">{job.budgetType || "Fixed"}</p>
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
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          {job.totalBids || 0} bids
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-blue-100">
                      <span className="text-xs text-slate-500">Tap to place your bid</span>
                      <Button size="sm" className="rounded-xl text-xs bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20" data-testid={`button-bid-${job.id}`}>
                        <Zap className="w-3.5 h-3.5 mr-1" />
                        Place Bid
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
