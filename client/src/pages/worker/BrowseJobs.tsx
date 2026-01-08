import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, ChevronLeft, Briefcase, Clock, MapPin, IndianRupee,
  Users, Home, Laptop, Filter, Flame, TrendingUp, Loader2
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

  const getUrgencyBadge = (urgency: string | null) => {
    switch (urgency) {
      case "urgent": return { color: "bg-red-100 text-red-700", icon: Flame };
      case "normal": return { color: "bg-blue-100 text-blue-700", icon: Clock };
      case "flexible": return { color: "bg-slate-100 text-slate-700", icon: Clock };
      default: return { color: "bg-slate-100 text-slate-700", icon: Clock };
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeTab === "all" || job.category === activeTab;
    const matchesService = categoryFilter === "all" || job.serviceType === categoryFilter;
    return matchesSearch && matchesCategory && matchesService;
  });

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

  const getAddress = (job: Job) => {
    if (!job.address) return null;
    const addr = job.address as any;
    return addr.city || addr.street || null;
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="sticky top-0 z-10 bg-white border-b border-slate-100 px-4 py-3">
        <div className="flex items-center gap-3 mb-3">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/worker/dashboard")}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold">Browse Jobs</h1>
            <p className="text-xs text-slate-500">{filteredJobs.length} jobs available</p>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search jobs..." 
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search-jobs"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-32">
              <Filter className="w-4 h-4 mr-1" />
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

      <div className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-3 mb-4">
            <TabsTrigger value="all">All Jobs</TabsTrigger>
            <TabsTrigger value="HOME_VISIT" className="gap-1">
              <Home className="w-3 h-3" />
              Home Visit
            </TabsTrigger>
            <TabsTrigger value="REMOTE" className="gap-1">
              <Laptop className="w-3 h-3" />
              Remote
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-3">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : filteredJobs.length === 0 ? (
              <Card className="border-dashed border-slate-200">
                <CardContent className="p-8 text-center">
                  <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">No jobs found matching your criteria</p>
                </CardContent>
              </Card>
            ) : (
              filteredJobs.map((job) => {
                const urgencyBadge = getUrgencyBadge(job.urgency);
                const UrgencyIcon = urgencyBadge.icon;
                const city = getAddress(job);
                return (
                  <Card 
                    key={job.id} 
                    className="border-slate-100 shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setLocation(`/worker/job/${job.id}/bid`)}
                    data-testid={`card-job-${job.id}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <Badge variant="outline" className={job.category === "HOME_VISIT" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-purple-50 text-purple-700 border-purple-200"}>
                              {job.category === "HOME_VISIT" ? <Home className="w-3 h-3 mr-1" /> : <Laptop className="w-3 h-3 mr-1" />}
                              {job.category === "HOME_VISIT" ? "Home Visit" : "Remote"}
                            </Badge>
                            {job.urgency === "urgent" && (
                              <Badge className={urgencyBadge.color}>
                                <UrgencyIcon className="w-3 h-3 mr-1" />
                                Urgent
                              </Badge>
                            )}
                          </div>
                          <h3 className="font-semibold text-slate-900">{job.title}</h3>
                          <p className="text-sm text-slate-500 line-clamp-2 mt-1">{job.description}</p>
                        </div>
                        {job.budget && (
                          <div className="text-right ml-3">
                            <p className="text-lg font-bold text-emerald-600">₹{job.budget}</p>
                            <p className="text-xs text-slate-400">{job.budgetType || "fixed"}</p>
                          </div>
                        )}
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
                          {formatDate(job.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {job.totalBids || 0} bids
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                        <span className="text-xs text-slate-400">Posted by Customer</span>
                        <Button size="sm" data-testid={`button-bid-${job.id}`}>
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Place Bid
                        </Button>
                      </div>
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
