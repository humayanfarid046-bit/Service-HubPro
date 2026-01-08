import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  ChevronLeft, Star, IndianRupee, Clock, Calendar, MessageSquare,
  CheckCircle, Briefcase, MapPin, Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Job, Bid } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function CustomerViewBids() {
  const [, setLocation] = useLocation();
  const params = useParams<{ id: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const jobId = parseInt(params.id || "0");

  const { data: job, isLoading: loadingJob } = useQuery<Job>({
    queryKey: ["job", jobId],
    queryFn: async () => {
      const res = await fetch(`/api/jobs/${jobId}`);
      if (!res.ok) throw new Error("Failed to fetch job");
      return res.json();
    },
    enabled: !!jobId,
  });

  const { data: bids = [], isLoading: loadingBids } = useQuery<Bid[]>({
    queryKey: ["bids", jobId],
    queryFn: async () => {
      const res = await fetch(`/api/jobs/${jobId}/bids`);
      if (!res.ok) throw new Error("Failed to fetch bids");
      return res.json();
    },
    enabled: !!jobId,
  });

  const selectBidMutation = useMutation({
    mutationFn: async (bidId: number) => {
      const res = await fetch(`/api/jobs/${jobId}/select-bid/${bidId}`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to select bid");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job", jobId] });
      queryClient.invalidateQueries({ queryKey: ["bids", jobId] });
      toast({ 
        title: "Worker Selected!", 
        description: `You have selected ${selectedBid?.workerName || 'the worker'}. They will be notified.` 
      });
      setShowConfirmDialog(false);
      setLocation("/customer/my-jobs");
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to select worker", variant: "destructive" });
    },
  });

  const handleSelectWorker = (bid: Bid) => {
    setSelectedBid(bid);
    setShowConfirmDialog(true);
  };

  const confirmSelection = () => {
    if (selectedBid) {
      selectBidMutation.mutate(selectedBid.id);
    }
  };

  const isLoading = loadingJob || loadingBids;

  const getAddress = () => {
    if (!job?.address) return null;
    const addr = job.address as any;
    return addr.city || addr.street || null;
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="sticky top-0 z-10 bg-white border-b border-slate-100 px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => setLocation("/customer/my-jobs")}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-lg font-semibold">View Bids</h1>
          <p className="text-xs text-slate-500">{bids.length} workers have bid on your job</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="p-4">
          {job && (
            <Card className="border-slate-100 shadow-sm mb-4 bg-blue-50">
              <CardContent className="p-4">
                <h3 className="font-semibold text-slate-900">{job.title}</h3>
                <p className="text-sm text-slate-600 mt-1">Select a worker from the bids below to get your job done.</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                  {job.budget && (
                    <span className="flex items-center gap-1">
                      <IndianRupee className="w-3 h-3" />
                      Budget: ₹{job.budget}
                    </span>
                  )}
                  {getAddress() && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {getAddress()}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {bids.length === 0 ? (
            <Card className="border-dashed border-slate-200">
              <CardContent className="p-8 text-center">
                <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No bids yet</p>
                <p className="text-sm text-slate-400 mt-1">Workers will start bidding on your job soon.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {bids.map((bid) => (
                <Card key={bid.id} className="border-slate-100 shadow-sm" data-testid={`card-bid-${bid.id}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <Avatar className="w-12 h-12 bg-blue-100">
                        <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                          {(bid.workerName || "W").split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-slate-900">{bid.workerName || "Worker"}</h4>
                          <span className="text-lg font-bold text-emerald-600">₹{bid.amount}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          {bid.workerRating && (
                            <>
                              <div className="flex items-center gap-1 text-amber-500">
                                <Star className="w-3.5 h-3.5 fill-current" />
                                <span className="text-sm font-medium">{bid.workerRating}</span>
                              </div>
                              <span className="text-xs text-slate-400">•</span>
                            </>
                          )}
                          {bid.workerCategory && (
                            <span className="text-xs text-slate-500">{bid.workerCategory}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {bid.coverLetter && (
                      <div className="bg-slate-50 rounded-lg p-3 mb-3">
                        <p className="text-sm text-slate-600">{bid.coverLetter}</p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 mb-3">
                      {bid.proposedDate && (
                        <Badge variant="outline" className="text-xs">
                          <Calendar className="w-3 h-3 mr-1" />
                          {bid.proposedDate}
                        </Badge>
                      )}
                      {bid.proposedTime && (
                        <Badge variant="outline" className="text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          {bid.proposedTime}
                        </Badge>
                      )}
                    </div>

                    {bid.status === "pending" && job?.status === "open" && (
                      <div className="flex items-center gap-2">
                        <Button 
                          className="flex-1 gap-1" 
                          onClick={() => handleSelectWorker(bid)}
                          data-testid={`button-select-worker-${bid.id}`}
                        >
                          <CheckCircle className="w-4 h-4" />
                          Select Worker
                        </Button>
                        <Button variant="outline" size="icon">
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                    
                    {bid.isSelected && (
                      <Badge className="bg-emerald-100 text-emerald-700">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Selected
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Selection</DialogTitle>
            <DialogDescription>
              Are you sure you want to select <strong>{selectedBid?.workerName || "this worker"}</strong> for this job?
            </DialogDescription>
          </DialogHeader>
          <div className="bg-slate-50 rounded-lg p-4 my-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Bid Amount</span>
              <span className="font-bold text-lg text-emerald-600">₹{selectedBid?.amount}</span>
            </div>
            {selectedBid?.workerRating && (
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-slate-600">Worker Rating</span>
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-medium">{selectedBid.workerRating}</span>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>Cancel</Button>
            <Button 
              onClick={confirmSelection} 
              disabled={selectBidMutation.isPending}
              data-testid="button-confirm-selection"
            >
              {selectBidMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
