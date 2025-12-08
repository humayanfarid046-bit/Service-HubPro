import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, Eye, MapPin, Loader2, UserPlus, RefreshCw, 
  Clock, CheckCircle, XCircle, PlayCircle, ListFilter,
  ShoppingBag, IndianRupee, Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
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
import type { Booking, User, Service } from "@shared/schema";

type BookingStatus = "all" | "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";

export default function AdminOrders() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<BookingStatus>("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>("");

  const { data: bookings = [], isLoading } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
    queryFn: async () => {
      const res = await fetch("/api/bookings");
      if (!res.ok) throw new Error("Failed to fetch bookings");
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

  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ["/api/services"],
    queryFn: async () => {
      const res = await fetch("/api/services");
      if (!res.ok) throw new Error("Failed to fetch services");
      return res.json();
    },
  });

  const updateBookingMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<Booking> }) => {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update booking");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      toast({ title: "Success", description: "Booking updated successfully!" });
      setIsAssignOpen(false);
      setIsDetailsOpen(false);
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const workers = users.filter(u => u.role === "WORKER");
  const customers = users.filter(u => u.role === "CUSTOMER");

  const getCustomerName = (id: number) => customers.find(c => c.id === id)?.fullName || "Unknown";
  const getWorkerName = (id: number | null) => {
    if (!id) return null;
    return workers.find(w => w.id === id)?.fullName || "Unknown";
  };
  const getServiceName = (id: number) => services.find(s => s.id === id)?.name || "Unknown Service";

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "pending": return "bg-amber-100 text-amber-700";
      case "confirmed": return "bg-blue-100 text-blue-700";
      case "in_progress": return "bg-purple-100 text-purple-700";
      case "completed": return "bg-emerald-100 text-emerald-700";
      case "cancelled": return "bg-red-100 text-red-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="w-3 h-3" />;
      case "confirmed": return <CheckCircle className="w-3 h-3" />;
      case "in_progress": return <PlayCircle className="w-3 h-3" />;
      case "completed": return <CheckCircle className="w-3 h-3" />;
      case "cancelled": return <XCircle className="w-3 h-3" />;
      default: return null;
    }
  };

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = 
      getCustomerName(b.customerId).toLowerCase().includes(searchQuery.toLowerCase()) ||
      getServiceName(b.serviceId).toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.id.toString().includes(searchQuery);
    
    const matchesTab = activeTab === "all" || b.status === activeTab;
    
    return matchesSearch && matchesTab;
  });

  const pendingCount = bookings.filter(b => b.status === "pending").length;
  const confirmedCount = bookings.filter(b => b.status === "confirmed").length;
  const inProgressCount = bookings.filter(b => b.status === "in_progress").length;
  const completedCount = bookings.filter(b => b.status === "completed").length;
  const cancelledCount = bookings.filter(b => b.status === "cancelled").length;
  const totalRevenue = bookings
    .filter(b => b.paymentStatus === "paid")
    .reduce((sum, b) => sum + parseFloat(b.totalAmount || "0"), 0);

  const handleAssignWorker = () => {
    if (!selectedBooking || !selectedWorkerId) return;
    updateBookingMutation.mutate({
      id: selectedBooking.id,
      updates: { 
        workerId: parseInt(selectedWorkerId),
        status: selectedBooking.status === "pending" ? "confirmed" : selectedBooking.status 
      },
    });
  };

  const handleStatusChange = (bookingId: number, newStatus: string) => {
    updateBookingMutation.mutate({
      id: bookingId,
      updates: { status: newStatus },
    });
  };

  const openAssignDialog = (booking: Booking) => {
    setSelectedBooking(booking);
    setSelectedWorkerId(booking.workerId?.toString() || "");
    setIsAssignOpen(true);
  };

  const openDetailsDialog = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailsOpen(true);
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Booking Management</h1>
          <p className="text-slate-500 mt-1">Track and manage all bookings, assign workers.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Card className="bg-amber-50 border-amber-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 text-amber-600 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Pending</p>
              <p className="text-xl font-bold text-slate-900">{pendingCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 border-purple-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl">
              <PlayCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">In Progress</p>
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
              <p className="text-xs text-slate-500 font-medium">Completed</p>
              <p className="text-xl font-bold text-slate-900">{completedCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-red-100 text-red-600 rounded-xl">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Cancelled</p>
              <p className="text-xl font-bold text-slate-900">{cancelledCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
              <IndianRupee className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Revenue</p>
              <p className="text-xl font-bold text-slate-900">₹{totalRevenue.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-100 shadow-sm">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as BookingStatus)}>
          <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-0">
            <TabsList className="flex-wrap">
              <TabsTrigger value="all" className="gap-1.5">
                <ListFilter className="w-4 h-4" /> All ({bookings.length})
              </TabsTrigger>
              <TabsTrigger value="pending" className="gap-1.5">
                <Clock className="w-4 h-4" /> Pending ({pendingCount})
              </TabsTrigger>
              <TabsTrigger value="in_progress" className="gap-1.5">
                <PlayCircle className="w-4 h-4" /> Ongoing ({inProgressCount})
              </TabsTrigger>
              <TabsTrigger value="completed" className="gap-1.5">
                <CheckCircle className="w-4 h-4" /> Completed ({completedCount})
              </TabsTrigger>
              <TabsTrigger value="cancelled" className="gap-1.5">
                <XCircle className="w-4 h-4" /> Cancelled ({cancelledCount})
              </TabsTrigger>
            </TabsList>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search bookings..."
                className="pl-9 bg-slate-50 border-slate-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search-bookings"
              />
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                No bookings found.
              </div>
            ) : (
              <div className="rounded-xl border border-slate-100 overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 font-medium">
                    <tr>
                      <th className="px-6 py-4">Booking ID</th>
                      <th className="px-6 py-4">Service</th>
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Assigned Worker</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors" data-testid={`row-booking-${booking.id}`}>
                        <td className="px-6 py-4 font-mono text-slate-600 font-medium">
                          #{booking.id}
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-slate-900">{getServiceName(booking.serviceId)}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-slate-900">{getCustomerName(booking.customerId)}</p>
                        </td>
                        <td className="px-6 py-4">
                          {booking.workerId ? (
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                                {getWorkerName(booking.workerId)?.charAt(0)}
                              </div>
                              <span className="text-slate-700">{getWorkerName(booking.workerId)}</span>
                            </div>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs h-7 text-amber-600 border-amber-200 hover:bg-amber-50"
                              onClick={() => openAssignDialog(booking)}
                              data-testid={`button-assign-${booking.id}`}
                            >
                              <UserPlus className="w-3 h-3 mr-1" /> Assign
                            </Button>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <Badge className={cn("font-medium gap-1", getStatusBadgeStyle(booking.status))}>
                            {getStatusIcon(booking.status)}
                            {booking.status.replace("_", " ")}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-bold text-slate-900">₹{booking.totalAmount}</p>
                            <p className={cn(
                              "text-xs",
                              booking.paymentStatus === "paid" ? "text-emerald-600" : "text-amber-600"
                            )}>
                              {booking.paymentStatus}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-500 text-xs">
                          {new Date(booking.bookingDate).toLocaleDateString("en-IN", {
                            day: "numeric", month: "short", year: "numeric"
                          })}
                          {booking.scheduledTime && (
                            <p className="text-slate-400">{booking.scheduledTime}</p>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-1">
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-8 w-8 text-slate-400 hover:text-primary"
                              onClick={() => openDetailsDialog(booking)}
                              data-testid={`button-view-${booking.id}`}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {booking.workerId && booking.status !== "completed" && booking.status !== "cancelled" && (
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="h-8 w-8 text-slate-400 hover:text-blue-600"
                                onClick={() => openAssignDialog(booking)}
                                title="Reassign Worker"
                              >
                                <RefreshCw className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Tabs>
      </Card>

      {/* Assign/Reassign Worker Dialog */}
      <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>
              {selectedBooking?.workerId ? "Reassign Worker" : "Assign Worker"}
            </DialogTitle>
            <DialogDescription>
              Select a worker to {selectedBooking?.workerId ? "reassign" : "assign"} for booking #{selectedBooking?.id}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            {selectedBooking && (
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-500">Service</p>
                <p className="font-semibold text-slate-900">{getServiceName(selectedBooking.serviceId)}</p>
                <p className="text-sm text-slate-500 mt-2">Customer</p>
                <p className="font-semibold text-slate-900">{getCustomerName(selectedBooking.customerId)}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label>Select Worker</Label>
              <Select value={selectedWorkerId} onValueChange={setSelectedWorkerId}>
                <SelectTrigger data-testid="select-worker">
                  <SelectValue placeholder="Choose a worker..." />
                </SelectTrigger>
                <SelectContent>
                  {workers.length === 0 ? (
                    <SelectItem value="none" disabled>No workers available</SelectItem>
                  ) : (
                    workers.map((worker) => (
                      <SelectItem key={worker.id} value={worker.id.toString()}>
                        {worker.fullName} ({worker.phone})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsAssignOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAssignWorker}
              disabled={!selectedWorkerId || updateBookingMutation.isPending}
            >
              {updateBookingMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {selectedBooking?.workerId ? "Reassign" : "Assign"} Worker
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Booking Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              Booking #{selectedBooking?.id} - {selectedBooking && getServiceName(selectedBooking.serviceId)}
            </DialogDescription>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Customer</p>
                  <p className="font-semibold">{getCustomerName(selectedBooking.customerId)}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Worker</p>
                  <p className="font-semibold">{getWorkerName(selectedBooking.workerId) || "Not assigned"}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Amount</p>
                  <p className="font-semibold">₹{selectedBooking.totalAmount}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Payment</p>
                  <p className={cn(
                    "font-semibold",
                    selectedBooking.paymentStatus === "paid" ? "text-emerald-600" : "text-amber-600"
                  )}>
                    {selectedBooking.paymentMethod || "N/A"} - {selectedBooking.paymentStatus}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">Scheduled Date & Time</p>
                <p className="font-semibold">
                  {new Date(selectedBooking.bookingDate).toLocaleDateString("en-IN", {
                    weekday: "long", day: "numeric", month: "long", year: "numeric"
                  })}
                  {selectedBooking.scheduledTime && ` at ${selectedBooking.scheduledTime}`}
                </p>
              </div>

              {selectedBooking.address && (
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500">Address</p>
                  <p className="font-semibold">
                    {typeof selectedBooking.address === "object" 
                      ? Object.values(selectedBooking.address as Record<string, string>).filter(Boolean).join(", ")
                      : String(selectedBooking.address)
                    }
                  </p>
                </div>
              )}

              {selectedBooking.customerNotes && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-xs text-blue-600">Customer Notes</p>
                  <p className="text-slate-700">{selectedBooking.customerNotes}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label>Update Status</Label>
                <Select 
                  value={selectedBooking.status} 
                  onValueChange={(v) => handleStatusChange(selectedBooking.id, v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
              Close
            </Button>
            {selectedBooking && !selectedBooking.workerId && (
              <Button onClick={() => { setIsDetailsOpen(false); openAssignDialog(selectedBooking); }}>
                <UserPlus className="w-4 h-4 mr-2" /> Assign Worker
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
