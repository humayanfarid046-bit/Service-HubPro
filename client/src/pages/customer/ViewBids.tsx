import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { 
  ChevronLeft, Star, IndianRupee, Clock, Calendar, MessageSquare,
  CheckCircle, Briefcase, MapPin, Loader2, User, Award
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-24">
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-lg border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => setLocation("/customer/my-jobs")}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg font-bold text-slate-900">View Bids</h1>
            <p className="text-xs text-slate-500">{bids.length} workers have bid</p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-3" />
          <p className="text-sm text-slate-500">Loading bids...</p>
        </div>
      ) : (
        <div className="px-5 py-4 space-y-4">
          {job && (
            <Card className="border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                    <Briefcase className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 line-clamp-1">{job.title}</h3>
                    <p className="text-sm text-slate-600 mt-1 line-clamp-2">{job.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                      {job.budget && (
                        <span className="flex items-center gap-1 font-semibold text-emerald-600">
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
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {bids.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">No bids yet</h3>
              <p className="text-sm text-slate-500">Workers will start bidding on your job soon.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {bids.map((bid, index) => (
                <motion.div
                  key={bid.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="border-slate-100 shadow-sm rounded-2xl overflow-hidden" data-testid={`card-bid-${bid.id}`}>
                    <CardContent className="p-0">
                      <div className="p-4">
                        <div className="flex items-start gap-3 mb-4">
                          <Avatar className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg">
                            <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white font-bold text-lg">
                              {(bid.workerName || "W").split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="font-bold text-slate-900">{bid.workerName || "Worker"}</h4>
                              <div className="text-right">
                                <span className="text-xl font-bold text-emerald-600">₹{bid.amount}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              {bid.workerRating && (
                                <div className="flex items-center gap-1 text-amber-500">
                                  <Star className="w-4 h-4 fill-current" />
                                  <span className="text-sm font-semibold">{bid.workerRating}</span>
                                </div>
                              )}
                              {bid.workerCategory && (
                                <Badge variant="outline" className="text-xs">
                                  {bid.workerCategory}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        {bid.coverLetter && (
                          <div className="bg-slate-50 rounded-xl p-3 mb-4">
                            <p className="text-sm text-slate-600 leading-relaxed">{bid.coverLetter}</p>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-2 mb-4">
                          {bid.proposedDate && (
                            <Badge variant="outline" className="text-xs bg-white">
                              <Calendar className="w-3 h-3 mr-1" />
                              {bid.proposedDate}
                            </Badge>
                          )}
                          {bid.proposedTime && (
                            <Badge variant="outline" className="text-xs bg-white">
                              <Clock className="w-3 h-3 mr-1" />
                              {bid.proposedTime}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {bid.status === "pending" && job?.status === "open" && (
                        <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
                          <Button 
                            className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20" 
                            onClick={() => handleSelectWorker(bid)}
                            data-testid={`button-select-worker-${bid.id}`}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Select This Worker
                          </Button>
                          <Button variant="outline" size="icon" className="rounded-xl">
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                      
                      {bid.isSelected && (
                        <div className="px-4 py-3 bg-emerald-50 border-t border-emerald-100">
                          <Badge className="bg-emerald-500 text-white">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Selected Worker
                          </Badge>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Confirm Selection</DialogTitle>
            <DialogDescription>
              Are you sure you want to select <strong>{selectedBid?.workerName || "this worker"}</strong> for this job?
            </DialogDescription>
          </DialogHeader>
          <div className="bg-slate-50 rounded-xl p-4 my-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600">Bid Amount</span>
              <span className="font-bold text-xl text-emerald-600">₹{selectedBid?.amount}</span>
            </div>
            {selectedBid?.workerRating && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Worker Rating</span>
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-semibold">{selectedBid.workerRating}</span>
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" className="rounded-xl" onClick={() => setShowConfirmDialog(false)}>Cancel</Button>
            <Button 
              className="rounded-xl bg-blue-600 hover:bg-blue-700"
              onClick={confirmSelection} 
              disabled={selectBidMutation.isPending}
              data-testid="button-confirm-selection"
            >
              {selectBidMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Confirm Selection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
