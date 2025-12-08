import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertTriangle, CheckCircle, Clock, XCircle, Loader2, 
  Eye, MoreVertical, Search, MessageSquare
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Dispute, User, Booking } from "@shared/schema";

type DisputeTab = "all" | "open" | "in_progress" | "resolved" | "closed";

export default function AdminDisputes() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<DisputeTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [resolution, setResolution] = useState("");
  const [newStatus, setNewStatus] = useState("");

  const { data: disputes = [], isLoading } = useQuery<Dispute[]>({
    queryKey: ["/api/disputes"],
    queryFn: async () => {
      const res = await fetch("/api/disputes");
      if (!res.ok) throw new Error("Failed to fetch disputes");
      return res.json();
    },
  });

  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["/api/users"],
    queryFn: async () => {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    },
  });

  const { data: bookings = [] } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
    queryFn: async () => {
      const res = await fetch("/api/bookings");
      if (!res.ok) throw new Error("Failed to fetch bookings");
      return res.json();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<Dispute> }) => {
      const res = await fetch(`/api/disputes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update dispute");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/disputes"] });
      toast({ title: "Success", description: "Dispute updated!" });
      setIsDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const getCustomerName = (id: number) => users.find(u => u.id === id)?.fullName || "Unknown";
  const getWorkerName = (id: number | null) => {
    if (!id) return "N/A";
    return users.find(u => u.id === id)?.fullName || "Unknown";
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "open": return "bg-red-100 text-red-700";
      case "in_progress": return "bg-amber-100 text-amber-700";
      case "resolved": return "bg-emerald-100 text-emerald-700";
      case "closed": return "bg-slate-100 text-slate-500";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  const getPriorityBadgeStyle = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-700";
      case "medium": return "bg-amber-100 text-amber-700";
      case "low": return "bg-blue-100 text-blue-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "quality": return <AlertTriangle className="w-5 h-5" />;
      case "delay": return <Clock className="w-5 h-5" />;
      case "payment": return <AlertTriangle className="w-5 h-5" />;
      case "behavior": return <MessageSquare className="w-5 h-5" />;
      default: return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const filteredDisputes = disputes.filter(d => {
    const matchesSearch = 
      getCustomerName(d.customerId).toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || d.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const openCount = disputes.filter(d => d.status === "open").length;
  const inProgressCount = disputes.filter(d => d.status === "in_progress").length;
  const resolvedCount = disputes.filter(d => d.status === "resolved").length;

  const handleViewDispute = (dispute: Dispute) => {
    setSelectedDispute(dispute);
    setResolution(dispute.resolution || "");
    setNewStatus(dispute.status);
    setIsDialogOpen(true);
  };

  const handleUpdateDispute = () => {
    if (!selectedDispute) return;
    updateMutation.mutate({
      id: selectedDispute.id,
      updates: {
        status: newStatus,
        resolution: resolution || null,
        resolvedAt: newStatus === "resolved" || newStatus === "closed" ? new Date() : null,
      },
    });
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Disputes & Support</h1>
          <p className="text-slate-500 mt-1">Resolve customer complaints and worker issues.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-red-50 border-red-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-red-100 text-red-600 rounded-xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Open</p>
              <p className="text-xl font-bold text-slate-900">{openCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 border-amber-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 text-amber-600 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">In Progress</p>
              <p className="text-xl font-bold text-slate-900">{inProgressCount}</p>
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
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Total</p>
              <p className="text-xl font-bold text-slate-900">{disputes.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-100 shadow-sm">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as DisputeTab)}>
          <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-0">
            <TabsList>
              <TabsTrigger value="all">All ({disputes.length})</TabsTrigger>
              <TabsTrigger value="open" className="gap-1.5">
                <AlertTriangle className="w-4 h-4" /> Open ({openCount})
              </TabsTrigger>
              <TabsTrigger value="in_progress" className="gap-1.5">
                <Clock className="w-4 h-4" /> In Progress ({inProgressCount})
              </TabsTrigger>
              <TabsTrigger value="resolved" className="gap-1.5">
                <CheckCircle className="w-4 h-4" /> Resolved ({resolvedCount})
              </TabsTrigger>
            </TabsList>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search disputes..."
                className="pl-9 bg-slate-50 border-slate-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search-disputes"
              />
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredDisputes.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                No disputes found.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredDisputes.map((dispute) => (
                  <Card 
                    key={dispute.id} 
                    className={cn(
                      "border-l-4 shadow-sm hover:shadow-md transition-shadow",
                      dispute.priority === "high" ? "border-l-red-500" :
                      dispute.priority === "medium" ? "border-l-amber-500" : "border-l-blue-500"
                    )}
                    data-testid={`card-dispute-${dispute.id}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-4">
                          <div className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center",
                            dispute.type === "quality" ? "bg-orange-50 text-orange-600" :
                            dispute.type === "delay" ? "bg-amber-50 text-amber-600" :
                            dispute.type === "payment" ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
                          )}>
                            {getTypeIcon(dispute.type)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-bold text-slate-900">{dispute.subject}</h3>
                              <Badge className={getPriorityBadgeStyle(dispute.priority || "medium")}>
                                {dispute.priority || "medium"}
                              </Badge>
                              <Badge className={getStatusBadgeStyle(dispute.status)}>
                                {dispute.status.replace("_", " ")}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-500 mb-2">
                              {dispute.bookingId ? `Booking #${dispute.bookingId}` : "General"} • 
                              Reported by {getCustomerName(dispute.customerId)} • 
                              {new Date(dispute.createdAt).toLocaleDateString()}
                            </p>
                            {dispute.description && (
                              <p className="text-slate-700 bg-slate-50 p-3 rounded-lg text-sm max-w-2xl">
                                "{dispute.description}"
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewDispute(dispute)}
                          >
                            <Eye className="w-4 h-4 mr-2" /> View
                          </Button>
                          {dispute.status === "open" && (
                            <Button 
                              size="sm"
                              onClick={() => {
                                setSelectedDispute(dispute);
                                setNewStatus("in_progress");
                                updateMutation.mutate({ id: dispute.id, updates: { status: "in_progress" } });
                              }}
                            >
                              Take Action
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Tabs>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Dispute Details</DialogTitle>
            <DialogDescription>
              #{selectedDispute?.id} - {selectedDispute?.subject}
            </DialogDescription>
          </DialogHeader>
          
          {selectedDispute && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Customer</p>
                  <p className="font-semibold">{getCustomerName(selectedDispute.customerId)}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Worker</p>
                  <p className="font-semibold">{getWorkerName(selectedDispute.workerId)}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Type</p>
                  <p className="font-semibold capitalize">{selectedDispute.type}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Priority</p>
                  <Badge className={getPriorityBadgeStyle(selectedDispute.priority || "medium")}>
                    {selectedDispute.priority || "medium"}
                  </Badge>
                </div>
              </div>

              {selectedDispute.description && (
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500 mb-1">Description</p>
                  <p className="text-slate-700">{selectedDispute.description}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label>Update Status</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Resolution Notes</Label>
                <Textarea
                  placeholder="Add resolution details..."
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={handleUpdateDispute} disabled={updateMutation.isPending}>
              {updateMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Update Dispute
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
