import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  UserX, Loader2, Search, Eye, MoreVertical, Clock, 
  CheckCircle, AlertTriangle, Ban, AlertOctagon, ShieldAlert
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
import type { ReportedUser } from "@shared/schema";

export default function AdminReportedUsers() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedReport, setSelectedReport] = useState<ReportedUser | null>(null);
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [actionType, setActionType] = useState("");
  const [adminNotes, setAdminNotes] = useState("");

  const { data: reports = [], isLoading } = useQuery<ReportedUser[]>({
    queryKey: ["/api/reported-users"],
    queryFn: async () => {
      const res = await fetch("/api/reported-users");
      if (!res.ok) throw new Error("Failed to fetch reports");
      return res.json();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<ReportedUser> }) => {
      const res = await fetch(`/api/reported-users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update report");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reported-users"] });
      setSelectedReport(null);
      setShowActionDialog(false);
      setActionType("");
      setAdminNotes("");
      toast({ title: "Success", description: "Report updated!" });
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending": return { bg: "bg-amber-100", text: "text-amber-700", icon: Clock };
      case "reviewed": return { bg: "bg-blue-100", text: "text-blue-700", icon: Eye };
      case "action_taken": return { bg: "bg-red-100", text: "text-red-700", icon: AlertOctagon };
      case "dismissed": return { bg: "bg-slate-100", text: "text-slate-700", icon: CheckCircle };
      default: return { bg: "bg-slate-100", text: "text-slate-700", icon: Clock };
    }
  };

  const getReasonBadge = (reason: string) => {
    switch (reason) {
      case "fraud": return "bg-red-100 text-red-700";
      case "harassment": return "bg-orange-100 text-orange-700";
      case "spam": return "bg-amber-100 text-amber-700";
      case "fake_profile": return "bg-purple-100 text-purple-700";
      case "inappropriate": return "bg-pink-100 text-pink-700";
      default: return "bg-slate-100 text-slate-600";
    }
  };

  const filteredReports = reports.filter((report) => {
    const matchesSearch = 
      report.reportedUserName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reportedByName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reportedUserPhone?.includes(searchQuery);
    const matchesStatus = statusFilter === "all" || report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = reports.filter(r => r.status === "pending").length;
  const actionTakenCount = reports.filter(r => r.status === "action_taken").length;
  const fraudCount = reports.filter(r => r.reportReason === "fraud").length;
  const harassmentCount = reports.filter(r => r.reportReason === "harassment").length;

  const handleTakeAction = () => {
    if (selectedReport) {
      updateMutation.mutate({
        id: selectedReport.id,
        data: { 
          status: "action_taken", 
          actionTaken: actionType, 
          adminNotes,
          reviewedAt: new Date() 
        },
      });
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Reported Users</h1>
          <p className="text-slate-500 mt-1">Review and take action on reported user accounts.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-amber-50 border-amber-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 text-amber-600 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Pending Review</p>
              <p className="text-xl font-bold text-slate-900">{pendingCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-red-100 text-red-600 rounded-xl">
              <Ban className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Action Taken</p>
              <p className="text-xl font-bold text-slate-900">{actionTakenCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-orange-50 border-orange-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-orange-100 text-orange-600 rounded-xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Fraud Reports</p>
              <p className="text-xl font-bold text-slate-900">{fraudCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 border-purple-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Harassment</p>
              <p className="text-xl font-bold text-slate-900">{harassmentCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-100 shadow-sm">
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle>All Reports</CardTitle>
          <div className="flex items-center gap-3">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search reports..."
                className="pl-9 bg-slate-50 border-slate-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search-reported-users"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="action_taken">Action Taken</SelectItem>
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
          ) : filteredReports.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              No reported users found.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredReports.map((report) => {
                const statusInfo = getStatusBadge(report.status);
                const StatusIcon = statusInfo.icon;
                return (
                  <div 
                    key={report.id} 
                    className="p-4 bg-slate-50 rounded-lg border border-slate-100"
                    data-testid={`row-reported-user-${report.id}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4 flex-1">
                        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold">
                          {report.reportedUserName?.charAt(0) || "U"}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-semibold text-slate-900">{report.reportedUserName}</h4>
                            <Badge className={cn(statusInfo.bg, statusInfo.text)}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {report.status.replace("_", " ")}
                            </Badge>
                            <Badge className={getReasonBadge(report.reportReason)}>
                              {report.reportReason.replace("_", " ")}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600 mb-2">
                            {report.description || "No description provided"}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            <span>{report.reportedUserPhone}</span>
                            <span className="capitalize">{report.reportedUserRole}</span>
                            <span>Reported by: {report.reportedByName}</span>
                            <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                          </div>
                          {report.actionTaken && (
                            <div className="mt-2">
                              <Badge className="bg-red-100 text-red-700">
                                Action: {report.actionTaken}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedReport(report)}>
                            <Eye className="w-4 h-4 mr-2" /> View Details
                          </DropdownMenuItem>
                          {report.status === "pending" && (
                            <>
                              <DropdownMenuItem onClick={() => { setSelectedReport(report); setShowActionDialog(true); }}>
                                <Ban className="w-4 h-4 mr-2" /> Take Action
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updateMutation.mutate({ id: report.id, data: { status: "dismissed", reviewedAt: new Date() } })}>
                                <CheckCircle className="w-4 h-4 mr-2" /> Dismiss
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

      <Dialog open={!!selectedReport && !showActionDialog} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Report Details</DialogTitle>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-4 mt-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold text-2xl">
                  {selectedReport.reportedUserName?.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{selectedReport.reportedUserName}</h3>
                  <p className="text-slate-500">{selectedReport.reportedUserPhone}</p>
                  <Badge className="capitalize mt-1">{selectedReport.reportedUserRole}</Badge>
                </div>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span className="font-medium text-red-700">Report Reason: {selectedReport.reportReason.replace("_", " ")}</span>
                </div>
                <p className="text-slate-700">{selectedReport.description || "No additional details"}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500">Reported By</p>
                  <p className="font-medium">{selectedReport.reportedByName}</p>
                </div>
                <div>
                  <p className="text-slate-500">Date</p>
                  <p className="font-medium">{new Date(selectedReport.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-slate-500">Status</p>
                  <Badge className={cn(getStatusBadge(selectedReport.status).bg, getStatusBadge(selectedReport.status).text)}>
                    {selectedReport.status.replace("_", " ")}
                  </Badge>
                </div>
                {selectedReport.actionTaken && (
                  <div>
                    <p className="text-slate-500">Action Taken</p>
                    <Badge className="bg-red-100 text-red-700">{selectedReport.actionTaken}</Badge>
                  </div>
                )}
              </div>
              {selectedReport.adminNotes && (
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">Admin Notes</p>
                  <p className="text-sm">{selectedReport.adminNotes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={() => setSelectedReport(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showActionDialog} onOpenChange={() => { setShowActionDialog(false); setSelectedReport(null); }}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-red-600">Take Action</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="font-medium">{selectedReport?.reportedUserName}</p>
              <p className="text-sm text-slate-500">{selectedReport?.reportReason.replace("_", " ")}</p>
            </div>
            <div className="space-y-2">
              <Label>Action Type</Label>
              <Select value={actionType} onValueChange={setActionType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select action..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="warning">Issue Warning</SelectItem>
                  <SelectItem value="suspended">Suspend Account</SelectItem>
                  <SelectItem value="banned">Ban Account</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Admin Notes</Label>
              <Textarea
                placeholder="Add notes about this action..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={() => { setShowActionDialog(false); setSelectedReport(null); }}>Cancel</Button>
            <Button 
              className="bg-red-600 hover:bg-red-700" 
              onClick={handleTakeAction}
              disabled={!actionType || updateMutation.isPending}
            >
              {updateMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Take Action
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
