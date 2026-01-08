import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, IndianRupee, Clock, Calendar, Send, MapPin, 
  User, Home, Briefcase, Loader2, AlertCircle, Laptop
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import type { Job } from "@shared/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";

export default function WorkerPlaceBid() {
  const [, setLocation] = useLocation();
  const params = useParams<{ id: string }>();
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const jobId = parseInt(params.id || "0");
  
  const [formData, setFormData] = useState({
    amount: "",
    proposedDate: "",
    proposedTime: "",
    estimatedDuration: "",
    coverLetter: "",
  });

  const { data: job, isLoading } = useQuery<Job>({
    queryKey: ["job", jobId],
    queryFn: async () => {
      const res = await fetch(`/api/jobs/${jobId}`);
      if (!res.ok) throw new Error("Failed to fetch job");
      return res.json();
    },
    enabled: !!jobId,
  });

  const submitBidMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/bids", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId,
          workerId: user?.id,
          amount: parseFloat(formData.amount),
          proposedDate: formData.proposedDate,
          proposedTime: formData.proposedTime,
          estimatedDuration: formData.estimatedDuration,
          coverLetter: formData.coverLetter,
          workerName: user?.fullName || user?.name || "Worker",
          workerCategory: "Service Provider",
          status: "pending",
        }),
      });
      if (!res.ok) throw new Error("Failed to submit bid");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast({ title: "Bid Placed!", description: "Your bid has been submitted. You'll be notified if selected." });
      setLocation("/worker/my-bids");
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to submit bid", variant: "destructive" });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.coverLetter) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }
    submitBidMutation.mutate();
  };

  const getAddress = () => {
    if (!job?.address) return null;
    const addr = job.address as any;
    return addr.city || addr.street || null;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-slate-50 p-4">
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">Job not found</p>
            <Button className="mt-4" onClick={() => setLocation("/worker/browse-jobs")}>
              Browse Jobs
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="sticky top-0 z-10 bg-white border-b border-slate-100 px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => setLocation("/worker/browse-jobs")}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold">Place Your Bid</h1>
      </div>

      <div className="p-4 space-y-4">
        <Card className="border-slate-100 shadow-sm bg-gradient-to-r from-blue-50 to-blue-100/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={job.category === "HOME_VISIT" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}>
                {job.category === "HOME_VISIT" ? <Home className="w-3 h-3 mr-1" /> : <Laptop className="w-3 h-3 mr-1" />}
                {job.category === "HOME_VISIT" ? "Home Visit" : "Remote"}
              </Badge>
              {job.urgency === "urgent" && (
                <Badge className="bg-red-100 text-red-700">Urgent</Badge>
              )}
            </div>
            <h3 className="font-semibold text-lg text-slate-900">{job.title}</h3>
            <p className="text-sm text-slate-600 mt-2">{job.description}</p>
            
            <div className="flex flex-wrap gap-3 mt-4 text-sm">
              {job.budget && (
                <span className="flex items-center gap-1 text-emerald-600 font-medium">
                  <IndianRupee className="w-4 h-4" />
                  Budget: ₹{job.budget} ({job.budgetType || "fixed"})
                </span>
              )}
              {getAddress() && (
                <span className="flex items-center gap-1 text-slate-500">
                  <MapPin className="w-4 h-4" />
                  {getAddress()}
                </span>
              )}
            </div>
            {(job.preferredDate || job.preferredTime) && (
              <div className="flex gap-3 mt-2 text-sm text-slate-500">
                {job.preferredDate && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {job.preferredDate}
                  </span>
                )}
                {job.preferredTime && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {job.preferredTime}
                  </span>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {(job.totalBids || 0) > 0 && (
          <Alert className="border-amber-200 bg-amber-50">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-700">
              <strong>{job.totalBids} workers</strong> have already bid on this job. Make your bid competitive!
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Card className="border-slate-100 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-emerald-600" />
                Your Bid
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Your Bid Amount (₹) *</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    type="number"
                    placeholder="Enter your bid amount"
                    className="pl-9 text-lg font-semibold"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    data-testid="input-bid-amount"
                  />
                </div>
                {job.budget && (
                  <p className="text-xs text-slate-500">Customer's budget: ₹{job.budget}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>When can you do it?</Label>
                  <Select value={formData.proposedDate} onValueChange={(v) => setFormData({ ...formData, proposedDate: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="tomorrow">Tomorrow</SelectItem>
                      <SelectItem value="in_2_days">In 2 Days</SelectItem>
                      <SelectItem value="this_week">This Week</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Preferred Time</Label>
                  <Select value={formData.proposedTime} onValueChange={(v) => setFormData({ ...formData, proposedTime: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Morning</SelectItem>
                      <SelectItem value="afternoon">Afternoon</SelectItem>
                      <SelectItem value="evening">Evening</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Estimated Duration</Label>
                <Select value={formData.estimatedDuration} onValueChange={(v) => setFormData({ ...formData, estimatedDuration: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="How long will the job take?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30_mins">30 minutes</SelectItem>
                    <SelectItem value="1_hour">1 hour</SelectItem>
                    <SelectItem value="1_2_hours">1-2 hours</SelectItem>
                    <SelectItem value="2_4_hours">2-4 hours</SelectItem>
                    <SelectItem value="half_day">Half day</SelectItem>
                    <SelectItem value="full_day">Full day</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Cover Letter / Message *</Label>
                <Textarea 
                  placeholder="Introduce yourself and explain why you're the best fit for this job. Mention your experience, skills, and what you'll bring..."
                  rows={5}
                  value={formData.coverLetter}
                  onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                  data-testid="input-cover-letter"
                />
                <p className="text-xs text-slate-500">A good cover letter increases your chances of being selected!</p>
              </div>
            </CardContent>
          </Card>

          <Button 
            type="submit" 
            className="w-full gap-2 mt-4" 
            size="lg" 
            disabled={submitBidMutation.isPending} 
            data-testid="button-submit-bid"
          >
            {submitBidMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Submit Bid
          </Button>
        </form>
      </div>
    </div>
  );
}
