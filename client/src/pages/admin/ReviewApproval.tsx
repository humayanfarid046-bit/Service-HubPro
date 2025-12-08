import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Star, Loader2, CheckCircle, XCircle, Clock, ThumbsUp, ThumbsDown
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import type { Review } from "@shared/schema";

export default function AdminReviewApproval() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const { data: reviews = [], isLoading } = useQuery<Review[]>({
    queryKey: ["/api/reviews/status/pending"],
    queryFn: async () => {
      const res = await fetch("/api/reviews/status/pending");
      if (!res.ok) throw new Error("Failed to fetch pending reviews");
      return res.json();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Review> }) => {
      const res = await fetch(`/api/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update review");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
      queryClient.invalidateQueries({ queryKey: ["/api/reviews/status/pending"] });
      setSelectedReview(null);
      setActionType(null);
      setRejectionReason("");
      toast({ title: "Success", description: "Review updated!" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const handleApprove = (review: Review) => {
    updateMutation.mutate({
      id: review.id,
      data: { status: "approved", approvedAt: new Date() },
    });
  };

  const handleReject = () => {
    if (!selectedReview) return;
    updateMutation.mutate({
      id: selectedReview.id,
      data: { status: "rejected", rejectionReason },
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "w-4 h-4",
              star <= rating ? "text-amber-400 fill-amber-400" : "text-slate-200"
            )}
          />
        ))}
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Review Approval</h1>
          <p className="text-slate-500 mt-1">Approve or reject pending customer reviews.</p>
        </div>
        <Badge className="bg-amber-100 text-amber-700 text-lg px-4 py-2">
          <Clock className="w-4 h-4 mr-2" />
          {reviews.length} Pending
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card className="bg-amber-50 border-amber-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 text-amber-600 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Pending</p>
              <p className="text-xl font-bold text-slate-900">{reviews.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50 border-emerald-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Today Approved</p>
              <p className="text-xl font-bold text-slate-900">0</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-red-100 text-red-600 rounded-xl">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Today Rejected</p>
              <p className="text-xl font-bold text-slate-900">0</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-100 shadow-sm">
        <CardHeader>
          <CardTitle>Pending Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 mx-auto text-emerald-300 mb-4" />
              <p className="text-lg font-medium text-slate-700">All caught up!</p>
              <p className="text-slate-500">No pending reviews to approve.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div 
                  key={review.id} 
                  className="p-4 bg-slate-50 rounded-lg border border-slate-100"
                  data-testid={`row-pending-review-${review.id}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4 flex-1">
                      <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-lg">
                        {review.customerName?.charAt(0) || "C"}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-semibold text-slate-900">{review.customerName || "Customer"}</h4>
                          {renderStars(review.rating)}
                        </div>
                        <p className="text-slate-600 mb-2">{review.reviewText || "No review text"}</p>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-slate-500">
                            Worker: <span className="font-medium">{review.workerName || "N/A"}</span>
                          </span>
                          <span className="text-xs text-slate-500">
                            Service: <span className="font-medium">{review.serviceName || "N/A"}</span>
                          </span>
                          <span className="text-xs text-slate-400">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        className="bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => handleApprove(review)}
                        disabled={updateMutation.isPending}
                      >
                        <ThumbsUp className="w-4 h-4 mr-1" /> Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-red-200 text-red-600 hover:bg-red-50"
                        onClick={() => { setSelectedReview(review); setActionType("reject"); }}
                      >
                        <ThumbsDown className="w-4 h-4 mr-1" /> Reject
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={actionType === "reject" && !!selectedReview} onOpenChange={() => { setActionType(null); setSelectedReview(null); }}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Reject Review</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting this review.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">{selectedReview?.customerName}</span>
                {selectedReview && renderStars(selectedReview.rating)}
              </div>
              <p className="text-sm text-slate-600">{selectedReview?.reviewText}</p>
            </div>
            <div className="space-y-2">
              <Label>Rejection Reason</Label>
              <Textarea
                placeholder="Enter reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => { setActionType(null); setSelectedReview(null); }}>
              Cancel
            </Button>
            <Button 
              className="bg-red-600 hover:bg-red-700" 
              onClick={handleReject}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Reject Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
