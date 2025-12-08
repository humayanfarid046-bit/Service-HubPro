import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Star, Loader2, Flag, AlertTriangle, CheckCircle, 
  XCircle, Eye, Trash2, MoreVertical
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Review } from "@shared/schema";

export default function AdminReviewReport() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [adminNotes, setAdminNotes] = useState("");

  const { data: reportedReviews = [], isLoading } = useQuery<Review[]>({
    queryKey: ["/api/reviews/reported"],
    queryFn: async () => {
      const res = await fetch("/api/reviews/reported");
      if (!res.ok) throw new Error("Failed to fetch reported reviews");
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
      queryClient.invalidateQueries({ queryKey: ["/api/reviews/reported"] });
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
      setSelectedReview(null);
      setAdminNotes("");
      toast({ title: "Success", description: "Report resolved!" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete review");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews/reported"] });
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
      toast({ title: "Success", description: "Review deleted!" });
    },
  });

  const handleDismissReport = (review: Review) => {
    updateMutation.mutate({
      id: review.id,
      data: { isReported: false, adminNotes: "Report dismissed" },
    });
  };

  const handleRemoveReview = () => {
    if (selectedReview) {
      deleteMutation.mutate(selectedReview.id);
      setSelectedReview(null);
    }
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
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Reported Reviews</h1>
          <p className="text-slate-500 mt-1">Handle reviews that have been flagged by users.</p>
        </div>
        <Badge className="bg-red-100 text-red-700 text-lg px-4 py-2">
          <Flag className="w-4 h-4 mr-2" />
          {reportedReviews.length} Reports
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card className="bg-red-50 border-red-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-red-100 text-red-600 rounded-xl">
              <Flag className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Active Reports</p>
              <p className="text-xl font-bold text-slate-900">{reportedReviews.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 border-amber-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 text-amber-600 rounded-xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Needs Review</p>
              <p className="text-xl font-bold text-slate-900">{reportedReviews.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50 border-emerald-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Resolved Today</p>
              <p className="text-xl font-bold text-slate-900">0</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-100 shadow-sm">
        <CardHeader>
          <CardTitle>Reported Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : reportedReviews.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 mx-auto text-emerald-300 mb-4" />
              <p className="text-lg font-medium text-slate-700">No reported reviews!</p>
              <p className="text-slate-500">All reviews are in good standing.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reportedReviews.map((review) => (
                <div 
                  key={review.id} 
                  className="p-4 bg-red-50 rounded-lg border border-red-100"
                  data-testid={`row-reported-review-${review.id}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4 flex-1">
                      <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                        <Flag className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-semibold text-slate-900">{review.customerName || "Customer"}</h4>
                          {renderStars(review.rating)}
                        </div>
                        <p className="text-slate-600 mb-2">{review.reviewText || "No review text"}</p>
                        <div className="p-2 bg-red-100 rounded-md mb-2">
                          <p className="text-sm font-medium text-red-700">Report Reason:</p>
                          <p className="text-sm text-red-600">{review.reportReason || "No reason specified"}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-slate-500">
                            Worker: <span className="font-medium">{review.workerName || "N/A"}</span>
                          </span>
                          <span className="text-xs text-slate-400">
                            Reported: {review.reportedAt ? new Date(review.reportedAt).toLocaleDateString() : "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDismissReport(review)}
                        disabled={updateMutation.isPending}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" /> Dismiss
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-red-600 hover:bg-red-700"
                        onClick={() => setSelectedReview(review)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" /> Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedReview} onOpenChange={() => setSelectedReview(null)}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="text-red-600">Remove Review</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this review? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-4 mt-4">
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{selectedReview.customerName}</span>
                  {renderStars(selectedReview.rating)}
                </div>
                <p className="text-sm text-slate-600">{selectedReview.reviewText}</p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <p className="text-sm font-medium text-red-700">Report Reason:</p>
                <p className="text-sm text-red-600">{selectedReview.reportReason}</p>
              </div>
              <div className="space-y-2">
                <Label>Admin Notes (optional)</Label>
                <Textarea
                  placeholder="Add notes about this action..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={2}
                />
              </div>
            </div>
          )}
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => setSelectedReview(null)}>
              Cancel
            </Button>
            <Button 
              className="bg-red-600 hover:bg-red-700" 
              onClick={handleRemoveReview}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Remove Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
