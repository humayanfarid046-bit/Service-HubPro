import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  ChevronLeft, Star, IndianRupee, Clock, Calendar, MessageSquare,
  CheckCircle, User, Briefcase, MapPin, Award
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Bid {
  id: number;
  workerId: number;
  workerName: string;
  workerRating: number;
  workerCategory: string;
  workerExperience: number;
  workerJobsCompleted: number;
  amount: number;
  proposedDate: string;
  proposedTime: string;
  estimatedDuration: string;
  coverLetter: string;
  status: string;
  createdAt: string;
}

const mockBids: Bid[] = [
  { id: 1, workerId: 101, workerName: "Rahul Kumar", workerRating: 4.8, workerCategory: "Plumber", workerExperience: 5, workerJobsCompleted: 156, amount: 450, proposedDate: "Tomorrow", proposedTime: "Morning", estimatedDuration: "1-2 hours", coverLetter: "Hi, I have 5 years of experience in plumbing. I can fix your tap quickly and efficiently. I will also check for any other issues.", status: "pending", createdAt: "1 hour ago" },
  { id: 2, workerId: 102, workerName: "Suresh Das", workerRating: 4.5, workerCategory: "Plumber", workerExperience: 3, workerJobsCompleted: 89, amount: 400, proposedDate: "Tomorrow", proposedTime: "Afternoon", estimatedDuration: "1 hour", coverLetter: "I specialize in bathroom fittings and can fix the leaking tap. Reasonable pricing guaranteed.", status: "pending", createdAt: "2 hours ago" },
  { id: 3, workerId: 103, workerName: "Amit Singh", workerRating: 4.9, workerCategory: "Plumber", workerExperience: 8, workerJobsCompleted: 312, amount: 550, proposedDate: "Today", proposedTime: "Evening", estimatedDuration: "30 mins", coverLetter: "Expert plumber with 8 years experience. I can come today evening and fix it quickly. Quality work guaranteed.", status: "pending", createdAt: "3 hours ago" },
  { id: 4, workerId: 104, workerName: "Bikash Roy", workerRating: 4.2, workerCategory: "Plumber", workerExperience: 2, workerJobsCompleted: 45, amount: 350, proposedDate: "Tomorrow", proposedTime: "Morning", estimatedDuration: "1-2 hours", coverLetter: "New to the platform but experienced. Offering competitive pricing for quality work.", status: "pending", createdAt: "4 hours ago" },
  { id: 5, workerId: 105, workerName: "Manoj Sharma", workerRating: 4.7, workerCategory: "Plumber", workerExperience: 6, workerJobsCompleted: 203, amount: 500, proposedDate: "Day after tomorrow", proposedTime: "Flexible", estimatedDuration: "1 hour", coverLetter: "Professional plumber. Will bring all necessary tools and spare parts. No hidden charges.", status: "pending", createdAt: "5 hours ago" },
];

export default function CustomerViewBids() {
  const [, setLocation] = useLocation();
  const params = useParams();
  const { toast } = useToast();
  const [bids] = useState<Bid[]>(mockBids);
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleSelectWorker = (bid: Bid) => {
    setSelectedBid(bid);
    setShowConfirmDialog(true);
  };

  const confirmSelection = () => {
    toast({ 
      title: "Worker Selected!", 
      description: `You have selected ${selectedBid?.workerName}. They will be notified.` 
    });
    setShowConfirmDialog(false);
    setLocation("/customer/my-jobs");
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

      <div className="p-4">
        <Card className="border-slate-100 shadow-sm mb-4 bg-blue-50">
          <CardContent className="p-4">
            <h3 className="font-semibold text-slate-900">Fix leaking tap in bathroom</h3>
            <p className="text-sm text-slate-600 mt-1">Select a worker from the bids below to get your job done.</p>
            <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <IndianRupee className="w-3 h-3" />
                Budget: ₹500
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                Kolkata
              </span>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          {bids.map((bid) => (
            <Card key={bid.id} className="border-slate-100 shadow-sm" data-testid={`card-bid-${bid.id}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <Avatar className="w-12 h-12 bg-blue-100">
                    <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                      {bid.workerName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-slate-900">{bid.workerName}</h4>
                      <span className="text-lg font-bold text-emerald-600">₹{bid.amount}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="text-sm font-medium">{bid.workerRating}</span>
                      </div>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-500">{bid.workerCategory}</span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-500">{bid.workerExperience} yrs exp</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-3 mb-3">
                  <p className="text-sm text-slate-600">{bid.coverLetter}</p>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="outline" className="text-xs">
                    <Calendar className="w-3 h-3 mr-1" />
                    {bid.proposedDate}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    {bid.proposedTime}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Briefcase className="w-3 h-3 mr-1" />
                    {bid.workerJobsCompleted} jobs done
                  </Badge>
                </div>

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
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Selection</DialogTitle>
            <DialogDescription>
              Are you sure you want to select <strong>{selectedBid?.workerName}</strong> for this job?
            </DialogDescription>
          </DialogHeader>
          <div className="bg-slate-50 rounded-lg p-4 my-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Bid Amount</span>
              <span className="font-bold text-lg text-emerald-600">₹{selectedBid?.amount}</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-slate-600">Worker Rating</span>
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-medium">{selectedBid?.workerRating}</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>Cancel</Button>
            <Button onClick={confirmSelection} data-testid="button-confirm-selection">Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
