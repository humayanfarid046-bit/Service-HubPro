import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, ChevronLeft, Briefcase, Clock, MapPin, IndianRupee,
  Users, Home, Laptop, Eye, CheckCircle
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Job {
  id: number;
  title: string;
  description: string;
  category: string;
  serviceType: string;
  budget: number | null;
  status: string;
  totalBids: number;
  createdAt: string;
  city?: string;
}

const mockJobs: Job[] = [
  { id: 1, title: "Fix leaking tap in bathroom", description: "The tap in my bathroom is leaking continuously. Need someone to fix it.", category: "HOME_VISIT", serviceType: "plumbing", budget: 500, status: "open", totalBids: 5, createdAt: "2 hours ago", city: "Kolkata" },
  { id: 2, title: "Install ceiling fan", description: "Need to install a new ceiling fan in bedroom.", category: "HOME_VISIT", serviceType: "electrical", budget: 800, status: "open", totalBids: 3, createdAt: "5 hours ago", city: "Kolkata" },
  { id: 3, title: "Deep cleaning of 2BHK", description: "Complete deep cleaning of my 2BHK apartment.", category: "HOME_VISIT", serviceType: "cleaning", budget: 2000, status: "assigned", totalBids: 8, createdAt: "1 day ago", city: "Kolkata" },
  { id: 4, title: "Website logo design", description: "Need a professional logo for my business website.", category: "REMOTE", serviceType: "other", budget: 1500, status: "completed", totalBids: 12, createdAt: "3 days ago" },
];

export default function CustomerMyJobs() {
  const [, setLocation] = useLocation();
  const [jobs] = useState<Job[]>(mockJobs);
  const [activeTab, setActiveTab] = useState("all");

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
            {filteredJobs.length === 0 ? (
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
                        {job.city && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {job.city}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {job.createdAt}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                        <div className="flex items-center gap-1 text-sm">
                          <Users className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-blue-600">{job.totalBids} bids</span>
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
