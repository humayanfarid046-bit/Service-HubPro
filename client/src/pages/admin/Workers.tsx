import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MoreVertical, ShieldCheck, ShieldAlert, CheckCircle2, XCircle, Loader2, Eye, Ban } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { User, WorkerDetails, Booking, Service } from "@shared/schema";

export default function AdminWorkers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWorker, setSelectedWorker] = useState<{user: User, details: WorkerDetails | null} | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
    queryFn: async () => {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    },
  });

  const { data: workerDetails = [] } = useQuery<WorkerDetails[]>({
    queryKey: ["/api/workers"],
    queryFn: async () => {
      const res = await fetch("/api/workers");
      if (!res.ok) throw new Error("Failed to fetch workers");
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

  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ["/api/services"],
    queryFn: async () => {
      const res = await fetch("/api/services");
      if (!res.ok) throw new Error("Failed to fetch services");
      return res.json();
    },
  });

  const workers = users.filter(u => u.role === "WORKER");
  const getWorkerDetails = (userId: number) => workerDetails.find(w => w.userId === userId);
  const getWorkerBookings = (userId: number) => bookings.filter(b => b.workerId === userId);
  const getServiceName = (id: number) => services.find(s => s.id === id)?.name || "Unknown";

  const filteredWorkers = workers.filter(w =>
    w.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.phone.includes(searchQuery)
  );

  const verifiedCount = workerDetails.filter(w => w.isVerified).length;
  const pendingCount = workerDetails.filter(w => !w.isVerified).length;
  const totalEarnings = workerDetails.reduce((sum, w) => sum + parseFloat(w.totalEarnings || "0"), 0);

  const handleViewWorker = (worker: User) => {
    setSelectedWorker({ user: worker, details: getWorkerDetails(worker.id) || null });
    setIsDialogOpen(true);
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Worker Management</h1>
          <p className="text-slate-500 mt-1">Manage worker profiles, KYC status, and view history.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="bg-white border-slate-100 shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Verified Workers</p>
              <p className="text-2xl font-bold text-slate-900">{verifiedCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-100 shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Pending Verification</p>
              <p className="text-2xl font-bold text-slate-900">{pendingCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-100 shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Earnings</p>
              <p className="text-2xl font-bold text-slate-900">₹{totalEarnings.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-100 shadow-sm">
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input 
              placeholder="Search workers by name or phone..." 
              className="pl-9 bg-slate-50 border-slate-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search-workers"
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
              No workers found. Workers will appear when they register.
            </div>
          ) : (
            <div className="rounded-xl border border-slate-100 overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium">
                  <tr>
                    <th className="px-6 py-4">Worker</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Verified</th>
                    <th className="px-6 py-4">Jobs Done</th>
                    <th className="px-6 py-4">Earnings</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredWorkers.map((worker) => {
                    const details = getWorkerDetails(worker.id);
                    const workerBookings = getWorkerBookings(worker.id);
                    const completedJobs = workerBookings.filter(b => b.status === "completed").length;
                    return (
                      <tr key={worker.id} className="hover:bg-slate-50/50 transition-colors" data-testid={`row-worker-${worker.id}`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold border border-slate-200">
                              {worker.fullName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{worker.fullName}</p>
                              <p className="text-xs text-slate-500">{worker.phone}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-700">
                          {details?.category || "Not set"}
                        </td>
                        <td className="px-6 py-4">
                          <Badge className={cn(
                            "font-medium border-0",
                            worker.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                          )}>
                            {worker.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5">
                            {details?.isVerified ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            ) : (
                              <XCircle className="w-4 h-4 text-orange-500" />
                            )}
                            <span className={cn(
                              "font-medium",
                              details?.isVerified ? "text-emerald-700" : "text-orange-600"
                            )}>
                              {details?.isVerified ? "Verified" : "Pending"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-900">
                          {completedJobs}
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-900">
                          ₹{parseFloat(details?.totalEarnings || "0").toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewWorker(worker)}>
                                <Eye className="w-4 h-4 mr-2" /> View Details & History
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Ban className="w-4 h-4 mr-2" /> Block Worker
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Worker Details & History</DialogTitle>
          </DialogHeader>
          {selectedWorker && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold">
                  {selectedWorker.user.fullName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{selectedWorker.user.fullName}</h3>
                  <p className="text-slate-500">{selectedWorker.user.phone}</p>
                  <Badge className={cn(
                    "mt-1",
                    selectedWorker.details?.isVerified ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700"
                  )}>
                    {selectedWorker.details?.isVerified ? "Verified" : "Pending Verification"}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-500">Category</p>
                  <p className="font-bold">{selectedWorker.details?.category || "Not set"}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-500">Experience</p>
                  <p className="font-bold">{selectedWorker.details?.experience || 0} years</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-500">Rating</p>
                  <p className="font-bold">{selectedWorker.details?.rating || "0"} / 5</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-500">Total Earnings</p>
                  <p className="font-bold text-emerald-600">₹{parseFloat(selectedWorker.details?.totalEarnings || "0").toLocaleString()}</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold mb-3">Job History</h4>
                {getWorkerBookings(selectedWorker.user.id).length === 0 ? (
                  <p className="text-slate-500 text-center py-4">No jobs yet</p>
                ) : (
                  <div className="space-y-2">
                    {getWorkerBookings(selectedWorker.user.id).map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{getServiceName(booking.serviceId)}</p>
                          <p className="text-xs text-slate-500">{new Date(booking.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">₹{booking.totalAmount}</p>
                          <Badge className={cn(
                            "text-xs",
                            booking.status === "completed" ? "bg-emerald-100 text-emerald-700" :
                            booking.status === "pending" ? "bg-orange-100 text-orange-700" :
                            "bg-blue-100 text-blue-700"
                          )}>
                            {booking.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
