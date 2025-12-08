import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Ticket, Loader2, Search, Eye, MoreVertical, Clock, CheckCircle, 
  AlertCircle, XCircle, Plus, UserCircle
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
import type { SupportTicket } from "@shared/schema";

export default function AdminSupportTickets() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [showResolveDialog, setShowResolveDialog] = useState(false);
  const [resolution, setResolution] = useState("");

  const { data: tickets = [], isLoading } = useQuery<SupportTicket[]>({
    queryKey: ["/api/support-tickets"],
    queryFn: async () => {
      const res = await fetch("/api/support-tickets");
      if (!res.ok) throw new Error("Failed to fetch tickets");
      return res.json();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<SupportTicket> }) => {
      const res = await fetch(`/api/support-tickets/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update ticket");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/support-tickets"] });
      setSelectedTicket(null);
      setShowResolveDialog(false);
      setResolution("");
      toast({ title: "Success", description: "Ticket updated!" });
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open": return { bg: "bg-blue-100", text: "text-blue-700", icon: Clock };
      case "in_progress": return { bg: "bg-amber-100", text: "text-amber-700", icon: AlertCircle };
      case "resolved": return { bg: "bg-emerald-100", text: "text-emerald-700", icon: CheckCircle };
      case "closed": return { bg: "bg-slate-100", text: "text-slate-700", icon: XCircle };
      default: return { bg: "bg-slate-100", text: "text-slate-700", icon: Clock };
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-100 text-red-700";
      case "high": return "bg-orange-100 text-orange-700";
      case "medium": return "bg-amber-100 text-amber-700";
      case "low": return "bg-slate-100 text-slate-600";
      default: return "bg-slate-100 text-slate-600";
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch = 
      ticket.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.userName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openCount = tickets.filter(t => t.status === "open").length;
  const inProgressCount = tickets.filter(t => t.status === "in_progress").length;
  const resolvedCount = tickets.filter(t => t.status === "resolved").length;
  const urgentCount = tickets.filter(t => t.priority === "urgent").length;

  const handleResolve = () => {
    if (selectedTicket) {
      updateMutation.mutate({
        id: selectedTicket.id,
        data: { status: "resolved", resolution, resolvedAt: new Date() },
      });
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Support Tickets</h1>
          <p className="text-slate-500 mt-1">Manage and resolve user support requests.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
              <Ticket className="w-5 h-5" />
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
              <AlertCircle className="w-5 h-5" />
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
        <Card className="bg-red-50 border-red-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-red-100 text-red-600 rounded-xl">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Urgent</p>
              <p className="text-xl font-bold text-slate-900">{urgentCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-100 shadow-sm">
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle>All Tickets</CardTitle>
          <div className="flex items-center gap-3">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search tickets..."
                className="pl-9 bg-slate-50 border-slate-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search-tickets"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              No tickets found.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTickets.map((ticket) => {
                const statusInfo = getStatusBadge(ticket.status);
                const StatusIcon = statusInfo.icon;
                return (
                  <div 
                    key={ticket.id} 
                    className="p-4 bg-slate-50 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors"
                    data-testid={`row-ticket-${ticket.id}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4 flex-1">
                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                          <Ticket className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-mono text-sm text-slate-500">#{ticket.ticketNumber}</span>
                            <Badge className={cn(statusInfo.bg, statusInfo.text)}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {ticket.status.replace("_", " ")}
                            </Badge>
                            <Badge className={getPriorityBadge(ticket.priority)}>
                              {ticket.priority}
                            </Badge>
                          </div>
                          <h4 className="font-semibold text-slate-900 mb-1">{ticket.subject}</h4>
                          <p className="text-sm text-slate-600 line-clamp-2">{ticket.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <UserCircle className="w-3 h-3" />
                              {ticket.userName || "Unknown User"}
                            </span>
                            <span>{ticket.category}</span>
                            <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
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
                          <DropdownMenuItem onClick={() => setSelectedTicket(ticket)}>
                            <Eye className="w-4 h-4 mr-2" /> View Details
                          </DropdownMenuItem>
                          {ticket.status === "open" && (
                            <DropdownMenuItem onClick={() => updateMutation.mutate({ id: ticket.id, data: { status: "in_progress" } })}>
                              <AlertCircle className="w-4 h-4 mr-2" /> Start Progress
                            </DropdownMenuItem>
                          )}
                          {(ticket.status === "open" || ticket.status === "in_progress") && (
                            <DropdownMenuItem onClick={() => { setSelectedTicket(ticket); setShowResolveDialog(true); }}>
                              <CheckCircle className="w-4 h-4 mr-2" /> Resolve
                            </DropdownMenuItem>
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

      <Dialog open={!!selectedTicket && !showResolveDialog} onOpenChange={() => setSelectedTicket(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Ticket Details</DialogTitle>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm text-slate-500">#{selectedTicket.ticketNumber}</span>
                <Badge className={cn(getStatusBadge(selectedTicket.status).bg, getStatusBadge(selectedTicket.status).text)}>
                  {selectedTicket.status.replace("_", " ")}
                </Badge>
              </div>
              <h3 className="font-semibold text-lg">{selectedTicket.subject}</h3>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-slate-700">{selectedTicket.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500">User</p>
                  <p className="font-medium">{selectedTicket.userName || "N/A"}</p>
                </div>
                <div>
                  <p className="text-slate-500">Phone</p>
                  <p className="font-medium">{selectedTicket.userPhone || "N/A"}</p>
                </div>
                <div>
                  <p className="text-slate-500">Category</p>
                  <p className="font-medium capitalize">{selectedTicket.category}</p>
                </div>
                <div>
                  <p className="text-slate-500">Priority</p>
                  <Badge className={getPriorityBadge(selectedTicket.priority)}>
                    {selectedTicket.priority}
                  </Badge>
                </div>
                <div>
                  <p className="text-slate-500">Created</p>
                  <p className="font-medium">{new Date(selectedTicket.createdAt).toLocaleString()}</p>
                </div>
                {selectedTicket.resolution && (
                  <div className="col-span-2">
                    <p className="text-slate-500">Resolution</p>
                    <p className="font-medium">{selectedTicket.resolution}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={() => setSelectedTicket(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showResolveDialog} onOpenChange={() => { setShowResolveDialog(false); setSelectedTicket(null); }}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Resolve Ticket</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Resolution</Label>
              <Textarea
                placeholder="Enter resolution details..."
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={() => { setShowResolveDialog(false); setSelectedTicket(null); }}>Cancel</Button>
            <Button onClick={handleResolve} disabled={updateMutation.isPending}>
              {updateMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Resolve Ticket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
