import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2, ShieldCheck, ShieldAlert, Clock, CheckCircle, XCircle, Eye, FileText, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import type { User, WorkerDetails } from "@shared/schema";

export default function AdminKYC() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWorker, setSelectedWorker] = useState<{ user: User; details: WorkerDetails } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");

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

  const updateWorkerMutation = useMutation({
    mutationFn: async ({ userId, isVerified }: { userId: number; isVerified: boolean }) => {
      const res = await fetch(`/api/workers/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVerified }),
      });
      if (!res.ok) throw new Error("Failed to update worker");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workers"] });
      toast({ title: "Updated!", description: "KYC status updated successfully." });
      setIsDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const workers = users.filter(u => u.role === "WORKER");
  const getWorkerDetails = (userId: number) => workerDetails.find(w => w.userId === userId);

  const pendingWorkers = workers.filter(w => {
    const details = getWorkerDetails(w.id);
    return details && !details.isVerified;
  });

  const verifiedWorkers = workers.filter(w => {
    const details = getWorkerDetails(w.id);
    return details && details.isVerified;
  });

  const filteredPending = pendingWorkers.filter(w =>
    w.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.phone.includes(searchQuery)
  );

  const filteredVerified = verifiedWorkers.filter(w =>
    w.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.phone.includes(searchQuery)
  );

  const handleViewKYC = (worker: User) => {
    const details = getWorkerDetails(worker.id);
    if (details) {
      setSelectedWorker({ user: worker, details });
      setIsDialogOpen(true);
    }
  };

  const handleApprove = () => {
    if (selectedWorker) {
      updateWorkerMutation.mutate({ userId: selectedWorker.user.id, isVerified: true });
    }
  };

  const handleReject = () => {
    if (selectedWorker) {
      updateWorkerMutation.mutate({ userId: selectedWorker.user.id, isVerified: false });
    }
  };

  const DocumentLink = ({ url, label }: { url: string | null; label: string }) => {
    if (!url) return <span className="text-slate-400 text-sm">Not uploaded</span>;
    return (
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-primary hover:underline text-sm"
      >
        <FileText className="w-4 h-4" />
        {label}
        <ExternalLink className="w-3 h-3" />
      </a>
    );
  };

  const WorkerRow = ({ worker, showApproveButton }: { worker: User; showApproveButton: boolean }) => {
    const details = getWorkerDetails(worker.id);
    return (
      <tr className="hover:bg-slate-50/50 transition-colors" data-testid={`row-kyc-${worker.id}`}>
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm border border-blue-200">
              {worker.fullName.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-slate-900">{worker.fullName}</p>
              <p className="text-xs text-slate-500">{worker.phone}</p>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 text-slate-600">{details?.category || "-"}</td>
        <td className="px-6 py-4">
          <span className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
            details?.idProof ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
          )}>
            {details?.idProof ? "Uploaded" : "Missing"}
          </span>
        </td>
        <td className="px-6 py-4">
          <span className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
            details?.policeVerification ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
          )}>
            {details?.policeVerification ? "Uploaded" : "Missing"}
          </span>
        </td>
        <td className="px-6 py-4">
          {details?.isVerified ? (
            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
              <ShieldCheck className="w-3 h-3 mr-1" /> Verified
            </Badge>
          ) : (
            <Badge className="bg-orange-100 text-orange-700 border-orange-200">
              <Clock className="w-3 h-3 mr-1" /> Pending
            </Badge>
          )}
        </td>
        <td className="px-6 py-4 text-right">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleViewKYC(worker)}
            data-testid={`button-view-kyc-${worker.id}`}
          >
            <Eye className="w-4 h-4 mr-1" /> View
          </Button>
        </td>
      </tr>
    );
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">KYC Verification</h1>
          <p className="text-slate-500 mt-1">Review and verify worker documents for platform access.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-orange-50 border-orange-100">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Pending Review</p>
              <p className="text-2xl font-bold text-slate-900">{pendingWorkers.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50 border-emerald-100">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Verified Workers</p>
              <p className="text-2xl font-bold text-slate-900">{verifiedWorkers.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Workers</p>
              <p className="text-2xl font-bold text-slate-900">{workers.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-100 shadow-sm">
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-0">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input 
              placeholder="Search workers..." 
              className="pl-9 bg-slate-50 border-slate-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search-kyc"
            />
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="pending" className="gap-2">
                <Clock className="w-4 h-4" /> Pending ({pendingWorkers.length})
              </TabsTrigger>
              <TabsTrigger value="verified" className="gap-2">
                <ShieldCheck className="w-4 h-4" /> Verified ({verifiedWorkers.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : filteredPending.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  No pending KYC requests.
                </div>
              ) : (
                <div className="rounded-xl border border-slate-100 overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium">
                      <tr>
                        <th className="px-6 py-4">Worker</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">ID Proof</th>
                        <th className="px-6 py-4">Police Verification</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredPending.map(worker => (
                        <WorkerRow key={worker.id} worker={worker} showApproveButton />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>

            <TabsContent value="verified">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : filteredVerified.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  No verified workers.
                </div>
              ) : (
                <div className="rounded-xl border border-slate-100 overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium">
                      <tr>
                        <th className="px-6 py-4">Worker</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">ID Proof</th>
                        <th className="px-6 py-4">Police Verification</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredVerified.map(worker => (
                        <WorkerRow key={worker.id} worker={worker} showApproveButton={false} />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>KYC Verification Details</DialogTitle>
            <DialogDescription>
              Review the worker's documents and verify their identity.
            </DialogDescription>
          </DialogHeader>
          
          {selectedWorker && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xl border border-blue-200">
                  {selectedWorker.user.fullName.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-lg text-slate-900">{selectedWorker.user.fullName}</p>
                  <p className="text-sm text-slate-500">{selectedWorker.user.phone}</p>
                  <Badge className="mt-1 bg-blue-100 text-blue-700">{selectedWorker.details.category}</Badge>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="text-slate-600">ID Proof</span>
                  <DocumentLink url={selectedWorker.details.idProof} label="View Document" />
                </div>
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="text-slate-600">Police Verification</span>
                  <DocumentLink url={selectedWorker.details.policeVerification} label="View Document" />
                </div>
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="text-slate-600">Skill Certificate</span>
                  <DocumentLink url={selectedWorker.details.skillCertificate} label="View Document" />
                </div>
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="text-slate-600">Experience</span>
                  <span className="font-medium">{selectedWorker.details.experience || 0} years</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-slate-600">Current Status</span>
                  {selectedWorker.details.isVerified ? (
                    <Badge className="bg-emerald-100 text-emerald-700">
                      <ShieldCheck className="w-3 h-3 mr-1" /> Verified
                    </Badge>
                  ) : (
                    <Badge className="bg-orange-100 text-orange-700">
                      <Clock className="w-3 h-3 mr-1" /> Pending
                    </Badge>
                  )}
                </div>
              </div>

              <DialogFooter className="gap-2">
                {!selectedWorker.details.isVerified ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={handleReject}
                      disabled={updateWorkerMutation.isPending}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <XCircle className="w-4 h-4 mr-2" /> Reject
                    </Button>
                    <Button
                      onClick={handleApprove}
                      disabled={updateWorkerMutation.isPending}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      {updateWorkerMutation.isPending ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4 mr-2" />
                      )}
                      Approve KYC
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    onClick={handleReject}
                    disabled={updateWorkerMutation.isPending}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <XCircle className="w-4 h-4 mr-2" /> Revoke Verification
                  </Button>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
