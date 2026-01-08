import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, ChevronLeft, Briefcase, Clock, MapPin, IndianRupee,
  Users, Home, Laptop, Eye, CheckCircle, Loader2
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open": return { color: "bg-emerald-100 text-emerald-700", label: "Open" };
      case "assigned": return { color: "bg-blue-100 text-blue-700", label: "Assigned" };
      case "in_progress": return { color: "bg-amber-100 text-amber-700", label: "In Progress" };
      case "completed": return { color: "bg-slate-100 text-slate-700", label: "Completed" };
      case "cancelled": return { color: "bg-red-100 text-red-700", label: "Cancelled" };
      default: return { color: "bg-slate-100 text-slate-700", label: status };
    }
  };

  const filteredJobs = activeTab === "all" ? jobs : jobs.filter(j => j.status === activeTab);

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
      <div className="sticky top-0 z-10 bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/customer/home")}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold">My Jobs</h1>
        </div>
        <Button size="sm" className="gap-1" onClick={() => setLocation("/customer/post-job")} data-testid="button-new-job">
          <Plus className="w-4 h-4" />
          Post Job
        </Button>
      </div>

      <div className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-4 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="open">Open</TabsTrigger>
            <TabsTrigger value="assigned">Assigned</TabsTrigger>
            <TabsTrigger value="completed">Done</TabsTrigger>
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
                  <p className="text-slate-500">No jobs found</p>
                  <Button className="mt-4" onClick={() => setLocation("/customer/post-job")}>
                    Post Your First Job
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredJobs.map((job) => {
                const statusBadge = getStatusBadge(job.status);
                const city = getAddress(job);
                return (
                  <Card 
                    key={job.id} 
                    className="border-slate-100 shadow-sm overflow-hidden"
                    data-testid={`card-job-${job.id}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className={job.category === "HOME_VISIT" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-purple-50 text-purple-700 border-purple-200"}>
                              {job.category === "HOME_VISIT" ? <Home className="w-3 h-3 mr-1" /> : <Laptop className="w-3 h-3 mr-1" />}
                              {job.category === "HOME_VISIT" ? "Home Visit" : "Remote"}
                            </Badge>
                            <Badge className={statusBadge.color}>{statusBadge.label}</Badge>
                          </div>
                          <h3 className="font-semibold text-slate-900">{job.title}</h3>
                          <p className="text-sm text-slate-500 line-clamp-2 mt-1">{job.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-3">
                        {job.budget && (
                          <span className="flex items-center gap-1">
                            <IndianRupee className="w-3 h-3" />
                            ₹{job.budget}
                          </span>
                        )}
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
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                        <div className="flex items-center gap-1 text-sm">
                          <Users className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-blue-600">{job.totalBids || 0} bids</span>
                        </div>
                        <Button 
                          size="sm" 
                          variant={job.status === "open" ? "default" : "outline"}
                          onClick={() => setLocation(`/customer/job/${job.id}/bids`)}
                          data-testid={`button-view-bids-${job.id}`}
                        >
                          {job.status === "open" ? (
                            <>
                              <Eye className="w-3 h-3 mr-1" />
                              View Bids
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              View Details
                            </>
                          )}
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
