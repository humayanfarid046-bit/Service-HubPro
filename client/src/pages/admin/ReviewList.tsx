import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Star, Loader2, Search, Eye, MoreVertical, 
  ThumbsUp, ThumbsDown, Flag, Trash2, MessageSquare
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Review } from "@shared/schema";

export default function AdminReviewList() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  const { data: reviews = [], isLoading } = useQuery<Review[]>({
    queryKey: ["/api/reviews"],
    queryFn: async () => {
      const res = await fetch("/api/reviews");
      if (!res.ok) throw new Error("Failed to fetch reviews");
      return res.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete review");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
      toast({ title: "Success", description: "Review deleted!" });
    },
  });

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "pending": return "bg-amber-100 text-amber-700";
      case "approved": return "bg-emerald-100 text-emerald-700";
      case "rejected": return "bg-red-100 text-red-700";
      default: return "bg-slate-100 text-slate-700";
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

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch = 
      review.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.workerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.reviewText?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || review.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = reviews.filter(r => r.status === "pending").length;
  const approvedCount = reviews.filter(r => r.status === "approved").length;
  const reportedCount = reviews.filter(r => r.isReported).length;
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Review List</h1>
          <p className="text-slate-500 mt-1">View and manage all customer reviews.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Total Reviews</p>
              <p className="text-xl font-bold text-slate-900">{reviews.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 border-amber-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 text-amber-600 rounded-xl">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Avg Rating</p>
              <p className="text-xl font-bold text-slate-900">{avgRating}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50 border-emerald-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl">
              <ThumbsUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Approved</p>
              <p className="text-xl font-bold text-slate-900">{approvedCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-red-100 text-red-600 rounded-xl">
              <Flag className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Reported</p>
              <p className="text-xl font-bold text-slate-900">{reportedCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-100 shadow-sm">
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle>All Reviews</CardTitle>
          <div className="flex items-center gap-3">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search reviews..."
                className="pl-9 bg-slate-50 border-slate-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search-reviews"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              No reviews found.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReviews.map((review) => (
                <div 
                  key={review.id} 
                  className="flex items-start justify-between p-4 bg-slate-50 rounded-lg"
                  data-testid={`row-review-${review.id}`}
                >
                  <div className="flex gap-4 flex-1">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                      {review.customerName?.charAt(0) || "C"}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-semibold text-slate-900">{review.customerName || "Customer"}</h4>
                        {renderStars(review.rating)}
                        <Badge className={getStatusBadgeStyle(review.status)}>
                          {review.status}
                        </Badge>
                        {review.isReported && (
                          <Badge className="bg-red-100 text-red-700">
                            <Flag className="w-3 h-3 mr-1" /> Reported
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-slate-600">{review.reviewText || "No review text"}</p>
                      <div className="flex items-center gap-3 mt-2">
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelectedReview(review)}>
                        <Eye className="w-4 h-4 mr-2" /> View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600" 
                        onClick={() => deleteMutation.mutate(review.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedReview} onOpenChange={() => setSelectedReview(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Review Details</DialogTitle>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-4 mt-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-lg">
                  {selectedReview.customerName?.charAt(0) || "C"}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">{selectedReview.customerName || "Customer"}</h4>
                  <div className="flex items-center gap-2">
                    {renderStars(selectedReview.rating)}
                    <span className="text-sm text-slate-500">({selectedReview.rating}/5)</span>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-slate-700">{selectedReview.reviewText || "No review text provided"}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500">Worker</p>
                  <p className="font-medium">{selectedReview.workerName || "N/A"}</p>
                </div>
                <div>
                  <p className="text-slate-500">Service</p>
                  <p className="font-medium">{selectedReview.serviceName || "N/A"}</p>
                </div>
                <div>
                  <p className="text-slate-500">Status</p>
                  <Badge className={getStatusBadgeStyle(selectedReview.status)}>
                    {selectedReview.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-slate-500">Date</p>
                  <p className="font-medium">{new Date(selectedReview.createdAt).toLocaleString()}</p>
                </div>
              </div>
              {selectedReview.isReported && (
                <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                  <p className="text-sm font-medium text-red-700">Report Reason:</p>
                  <p className="text-sm text-red-600">{selectedReview.reportReason || "No reason provided"}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={() => setSelectedReview(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
