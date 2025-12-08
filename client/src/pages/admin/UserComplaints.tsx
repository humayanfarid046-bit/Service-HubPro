import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  MessageSquareWarning, Loader2, Search, Eye, MoreVertical, 
  Clock, CheckCircle, AlertTriangle, XCircle, Scale
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
import type { UserComplaint } from "@shared/schema";

export default function AdminUserComplaints() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedComplaint, setSelectedComplaint] = useState<UserComplaint | null>(null);
  const [showResolveDialog, setShowResolveDialog] = useState(false);
  const [resolution, setResolution] = useState("");
  const [actionTaken, setActionTaken] = useState("");

  const { data: complaints = [], isLoading } = useQuery<UserComplaint[]>({
    queryKey: ["/api/user-complaints"],
    queryFn: async () => {
      const res = await fetch("/api/user-complaints");
      if (!res.ok) throw new Error("Failed to fetch complaints");
      return res.json();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<UserComplaint> }) => {
      const res = await fetch(`/api/user-complaints/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update complaint");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user-complaints"] });
      setSelectedComplaint(null);
      setShowResolveDialog(false);
      setResolution("");
      setActionTaken("");
      toast({ title: "Success", description: "Complaint updated!" });
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending": return { bg: "bg-amber-100", text: "text-amber-700", icon: Clock };
      case "investigating": return { bg: "bg-blue-100", text: "text-blue-700", icon: Scale };
      case "resolved": return { bg: "bg-emerald-100", text: "text-emerald-700", icon: CheckCircle };
      case "dismissed": return { bg: "bg-slate-100", text: "text-slate-700", icon: XCircle };
      default: return { bg: "bg-slate-100", text: "text-slate-700", icon: Clock };
    }
  };

  const getComplaintTypeBadge = (type: string) => {
    switch (type) {
      case "fraud": return "bg-red-100 text-red-700";
      case "behavior": return "bg-orange-100 text-orange-700";
      case "service_quality": return "bg-amber-100 text-amber-700";
      case "payment": return "bg-purple-100 text-purple-700";
      default: return "bg-slate-100 text-slate-600";
    }
  };

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesSearch = 
      complaint.complaintNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.complainantName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.againstName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || complaint.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = complaints.filter(c => c.status === "pending").length;
  const investigatingCount = complaints.filter(c => c.status === "investigating").length;
  const resolvedCount = complaints.filter(c => c.status === "resolved").length;
  const fraudCount = complaints.filter(c => c.complaintType === "fraud").length;

  const handleResolve = () => {
    if (selectedComplaint) {
      updateMutation.mutate({
        id: selectedComplaint.id,
        data: { status: "resolved", resolution, actionTaken, resolvedAt: new Date() },
      });
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">User Complaints</h1>
          <p className="text-slate-500 mt-1">Handle complaints filed by users against each other.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-amber-50 border-amber-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 text-amber-600 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Pending</p>
              <p className="text-xl font-bold text-slate-900">{pendingCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Investigating</p>
              <p className="text-xl font-bold text-slate-900">{investigatingCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50 border-emerald-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Resolved</p>
              <p className="text-xl font-bold text-slate-900">{resolvedCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-red-100 text-red-600 rounded-xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Fraud Cases</p>
              <p className="text-xl font-bold text-slate-900">{fraudCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-100 shadow-sm">
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle>All Complaints</CardTitle>
          <div className="flex items-center gap-3">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search complaints..."
                className="pl-9 bg-slate-50 border-slate-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search-complaints"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="investigating">Investigating</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="dismissed">Dismissed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredComplaints.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              No complaints found.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredComplaints.map((complaint) => {
                const statusInfo = getStatusBadge(complaint.status);
                const StatusIcon = statusInfo.icon;
                return (
                  <div 
                    key={complaint.id} 
                    className="p-4 bg-slate-50 rounded-lg border border-slate-100"
                    data-testid={`row-complaint-${complaint.id}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4 flex-1">
                        <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
                          <MessageSquareWarning className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-mono text-sm text-slate-500">#{complaint.complaintNumber}</span>
                            <Badge className={cn(statusInfo.bg, statusInfo.text)}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {complaint.status}
                            </Badge>
                            <Badge className={getComplaintTypeBadge(complaint.complaintType)}>
                              {complaint.complaintType.replace("_", " ")}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600 line-clamp-2 mb-2">{complaint.description}</p>
                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            <span>By: <span className="font-medium text-slate-700">{complaint.complainantName}</span></span>
                            <span>Against: <span className="font-medium text-slate-700">{complaint.againstName}</span></span>
                            <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
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
                          <DropdownMenuItem onClick={() => setSelectedComplaint(complaint)}>
                            <Eye className="w-4 h-4 mr-2" /> View Details
                          </DropdownMenuItem>
                          {complaint.status === "pending" && (
                            <DropdownMenuItem onClick={() => updateMutation.mutate({ id: complaint.id, data: { status: "investigating" } })}>
                              <Scale className="w-4 h-4 mr-2" /> Start Investigation
                            </DropdownMenuItem>
                          )}
                          {(complaint.status === "pending" || complaint.status === "investigating") && (
                            <>
                              <DropdownMenuItem onClick={() => { setSelectedComplaint(complaint); setShowResolveDialog(true); }}>
                                <CheckCircle className="w-4 h-4 mr-2" /> Resolve
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updateMutation.mutate({ id: complaint.id, data: { status: "dismissed" } })}>
                                <XCircle className="w-4 h-4 mr-2" /> Dismiss
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedComplaint && !showResolveDialog} onOpenChange={() => setSelectedComplaint(null)}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Complaint Details</DialogTitle>
          </DialogHeader>
          {selectedComplaint && (
            <div className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm text-slate-500">#{selectedComplaint.complaintNumber}</span>
                <Badge className={cn(getStatusBadge(selectedComplaint.status).bg, getStatusBadge(selectedComplaint.status).text)}>
                  {selectedComplaint.status}
                </Badge>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-slate-700">{selectedComplaint.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-600 mb-1">Complainant</p>
                  <p className="font-medium">{selectedComplaint.complainantName}</p>
                  <p className="text-slate-500 text-xs">{selectedComplaint.complainantRole} • {selectedComplaint.complainantPhone}</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <p className="text-xs text-orange-600 mb-1">Against</p>
                  <p className="font-medium">{selectedComplaint.againstName}</p>
                  <p className="text-slate-500 text-xs">{selectedComplaint.againstRole}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500">Type</p>
                  <Badge className={getComplaintTypeBadge(selectedComplaint.complaintType)}>
                    {selectedComplaint.complaintType.replace("_", " ")}
                  </Badge>
                </div>
                <div>
                  <p className="text-slate-500">Priority</p>
                  <p className="font-medium capitalize">{selectedComplaint.priority}</p>
                </div>
                <div>
                  <p className="text-slate-500">Created</p>
                  <p className="font-medium">{new Date(selectedComplaint.createdAt).toLocaleString()}</p>
                </div>
                {selectedComplaint.bookingId && (
                  <div>
                    <p className="text-slate-500">Booking ID</p>
                    <p className="font-medium">#{selectedComplaint.bookingId}</p>
                  </div>
                )}
              </div>
              {selectedComplaint.resolution && (
                <div className="p-3 bg-emerald-50 rounded-lg">
                  <p className="text-xs text-emerald-600 mb-1">Resolution</p>
                  <p className="text-sm">{selectedComplaint.resolution}</p>
                  {selectedComplaint.actionTaken && (
                    <p className="text-xs text-slate-500 mt-1">Action: {selectedComplaint.actionTaken}</p>
                  )}
                </div>
              )}
            </div>
          )}
          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={() => setSelectedComplaint(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showResolveDialog} onOpenChange={() => { setShowResolveDialog(false); setSelectedComplaint(null); }}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Resolve Complaint</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Resolution</Label>
              <Textarea
                placeholder="Describe how the complaint was resolved..."
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Action Taken</Label>
              <Select value={actionTaken} onValueChange={setActionTaken}>
                <SelectTrigger>
                  <SelectValue placeholder="Select action..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="warning_issued">Warning Issued</SelectItem>
                  <SelectItem value="refund_processed">Refund Processed</SelectItem>
                  <SelectItem value="account_suspended">Account Suspended</SelectItem>
                  <SelectItem value="account_banned">Account Banned</SelectItem>
                  <SelectItem value="no_action">No Action Required</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={() => { setShowResolveDialog(false); setSelectedComplaint(null); }}>Cancel</Button>
            <Button onClick={handleResolve} disabled={updateMutation.isPending}>
              {updateMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Resolve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
