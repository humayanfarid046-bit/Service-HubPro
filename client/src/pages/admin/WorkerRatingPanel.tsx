import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Star, Loader2, Search, Users, TrendingUp, Award, Eye
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import type { Review, User, WorkerDetails } from "@shared/schema";

interface WorkerWithRating {
  user: User;
  workerDetails: WorkerDetails | null;
  reviews: Review[];
  avgRating: number;
  totalReviews: number;
}

export default function AdminWorkerRatingPanel() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWorker, setSelectedWorker] = useState<WorkerWithRating | null>(null);

  const { data: workers = [], isLoading: workersLoading } = useQuery<User[]>({
    queryKey: ["/api/users/role/WORKER"],
    queryFn: async () => {
      const res = await fetch("/api/users/role/WORKER");
      if (!res.ok) throw new Error("Failed to fetch workers");
      return res.json();
    },
  });

  const { data: allReviews = [], isLoading: reviewsLoading } = useQuery<Review[]>({
    queryKey: ["/api/reviews"],
    queryFn: async () => {
      const res = await fetch("/api/reviews");
      if (!res.ok) throw new Error("Failed to fetch reviews");
      return res.json();
    },
  });

  const { data: workerDetailsList = [] } = useQuery<WorkerDetails[]>({
    queryKey: ["/api/worker-details"],
    queryFn: async () => {
      const res = await fetch("/api/worker-details");
      if (!res.ok) throw new Error("Failed to fetch worker details");
      return res.json();
    },
  });

  const isLoading = workersLoading || reviewsLoading;

  const workersWithRatings: WorkerWithRating[] = workers.map((worker) => {
    const workerReviews = allReviews.filter(r => r.workerId === worker.id && r.status === "approved");
    const avgRating = workerReviews.length > 0
      ? workerReviews.reduce((sum, r) => sum + r.rating, 0) / workerReviews.length
      : 0;
    const workerDetails = workerDetailsList.find(wd => wd.userId === worker.id) || null;
    return {
      user: worker,
      workerDetails,
      reviews: workerReviews,
      avgRating,
      totalReviews: workerReviews.length,
    };
  }).sort((a, b) => b.avgRating - a.avgRating);

  const filteredWorkers = workersWithRatings.filter((w) =>
    w.user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.user.phone.includes(searchQuery)
  );

  const topRatedWorkers = workersWithRatings.filter(w => w.avgRating >= 4).length;
  const totalReviewsCount = allReviews.filter(r => r.status === "approved").length;
  const overallAvgRating = workersWithRatings.length > 0 && workersWithRatings.some(w => w.totalReviews > 0)
    ? (workersWithRatings.filter(w => w.totalReviews > 0).reduce((sum, w) => sum + w.avgRating, 0) / 
       workersWithRatings.filter(w => w.totalReviews > 0).length).toFixed(1)
    : "0.0";

  const renderStars = (rating: number, size: "sm" | "md" = "sm") => {
    const iconSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              iconSize,
              star <= rating ? "text-amber-400 fill-amber-400" : "text-slate-200"
            )}
          />
        ))}
      </div>
    );
  };

  const getRatingBadge = (rating: number) => {
    if (rating >= 4.5) return { bg: "bg-emerald-100", text: "text-emerald-700", label: "Excellent" };
    if (rating >= 4) return { bg: "bg-blue-100", text: "text-blue-700", label: "Very Good" };
    if (rating >= 3) return { bg: "bg-amber-100", text: "text-amber-700", label: "Good" };
    if (rating >= 2) return { bg: "bg-orange-100", text: "text-orange-700", label: "Average" };
    return { bg: "bg-red-100", text: "text-red-700", label: "Poor" };
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Worker Rating Panel</h1>
          <p className="text-slate-500 mt-1">View and analyze worker ratings and reviews.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Total Workers</p>
              <p className="text-xl font-bold text-slate-900">{workers.length}</p>
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
              <p className="text-xl font-bold text-slate-900">{overallAvgRating}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50 border-emerald-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Top Rated (4+)</p>
              <p className="text-xl font-bold text-slate-900">{topRatedWorkers}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 border-purple-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Total Reviews</p>
              <p className="text-xl font-bold text-slate-900">{totalReviewsCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-100 shadow-sm">
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle>Worker Ratings</CardTitle>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search workers..."
              className="pl-9 bg-slate-50 border-slate-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search-worker-ratings"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredWorkers.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              No workers found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Rank</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Worker</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Category</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Rating</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Reviews</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWorkers.map((worker, index) => {
                    const ratingBadge = getRatingBadge(worker.avgRating);
                    return (
                      <tr 
                        key={worker.user.id} 
                        className="border-b border-slate-50 hover:bg-slate-50"
                        data-testid={`row-worker-rating-${worker.user.id}`}
                      >
                        <td className="py-3 px-4">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
                            index === 0 ? "bg-amber-100 text-amber-700" :
                            index === 1 ? "bg-slate-200 text-slate-700" :
                            index === 2 ? "bg-orange-100 text-orange-700" :
                            "bg-slate-100 text-slate-500"
                          )}>
                            {index + 1}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                              {worker.user.fullName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">{worker.user.fullName}</p>
                              <p className="text-xs text-slate-500">{worker.user.phone}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className="bg-slate-100 text-slate-700">
                            {worker.workerDetails?.category || "N/A"}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {renderStars(Math.round(worker.avgRating))}
                            <span className="font-semibold text-slate-900">
                              {worker.avgRating.toFixed(1)}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-slate-600">{worker.totalReviews}</span>
                        </td>
                        <td className="py-3 px-4">
                          {worker.totalReviews > 0 ? (
                            <Badge className={cn(ratingBadge.bg, ratingBadge.text)}>
                              {ratingBadge.label}
                            </Badge>
                          ) : (
                            <Badge className="bg-slate-100 text-slate-500">No Reviews</Badge>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setSelectedWorker(worker)}
                          >
                            <Eye className="w-4 h-4 mr-1" /> View
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedWorker} onOpenChange={() => setSelectedWorker(null)}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Worker Rating Details</DialogTitle>
          </DialogHeader>
          {selectedWorker && (
            <div className="space-y-4 mt-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-2xl">
                  {selectedWorker.user.fullName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-slate-900">{selectedWorker.user.fullName}</h3>
                  <p className="text-slate-500">{selectedWorker.workerDetails?.category || "Worker"}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {renderStars(Math.round(selectedWorker.avgRating), "md")}
                    <span className="font-bold text-lg text-slate-900">
                      {selectedWorker.avgRating.toFixed(1)}
                    </span>
                    <span className="text-slate-500">({selectedWorker.totalReviews} reviews)</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = selectedWorker.reviews.filter(r => r.rating === star).length;
                  const percentage = selectedWorker.totalReviews > 0
                    ? (count / selectedWorker.totalReviews) * 100
                    : 0;
                  return (
                    <div key={star} className="text-center">
                      <div className="flex items-center justify-center gap-1 text-sm font-medium text-slate-700">
                        {star} <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      </div>
                      <div className="h-20 bg-slate-100 rounded-lg mt-1 flex items-end overflow-hidden">
                        <div 
                          className="w-full bg-amber-400 rounded-b-lg transition-all"
                          style={{ height: `${percentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{count}</p>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-3 max-h-48 overflow-y-auto">
                <h4 className="font-medium text-slate-900">Recent Reviews</h4>
                {selectedWorker.reviews.length === 0 ? (
                  <p className="text-slate-500 text-sm">No reviews yet.</p>
                ) : (
                  selectedWorker.reviews.slice(0, 5).map((review) => (
                    <div key={review.id} className="p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{review.customerName}</span>
                        {renderStars(review.rating)}
                      </div>
                      <p className="text-sm text-slate-600">{review.reviewText || "No comment"}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={() => setSelectedWorker(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
