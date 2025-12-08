import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileCheck, FileX, Clock, CheckCircle, XCircle, Loader2, 
  Eye, Search, Download, User, IdCard, FileText
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
import type { WorkerDocument, User as UserType } from "@shared/schema";

type DocTab = "all" | "pending" | "approved" | "rejected";

export default function AdminWorkerVerification() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<DocTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<WorkerDocument | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const { data: documents = [], isLoading } = useQuery<WorkerDocument[]>({
    queryKey: ["/api/worker-documents"],
    queryFn: async () => {
      const res = await fetch("/api/worker-documents");
      if (!res.ok) throw new Error("Failed to fetch documents");
      return res.json();
    },
  });

  const { data: users = [] } = useQuery<UserType[]>({
    queryKey: ["/api/users"],
    queryFn: async () => {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<WorkerDocument> }) => {
      const res = await fetch(`/api/worker-documents/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update document");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/worker-documents"] });
      toast({ title: "Success", description: "Document status updated!" });
      setIsDialogOpen(false);
      setRejectionReason("");
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const getWorkerName = (id: number) => users.find(u => u.id === id)?.fullName || "Unknown";

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "pending": return "bg-amber-100 text-amber-700";
      case "approved": return "bg-emerald-100 text-emerald-700";
      case "rejected": return "bg-red-100 text-red-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  const getDocTypeIcon = (type: string) => {
    switch (type) {
      case "aadhaar": return <IdCard className="w-5 h-5" />;
      case "pan": return <FileText className="w-5 h-5" />;
      case "photo": return <User className="w-5 h-5" />;
      default: return <FileCheck className="w-5 h-5" />;
    }
  };

  const getDocTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      aadhaar: "Aadhaar Card",
      pan: "PAN Card",
      license: "License",
      certificate: "Certificate",
      photo: "Profile Photo",
    };
    return labels[type] || type;
  };

  const filteredDocs = documents.filter(d => {
    const matchesSearch = getWorkerName(d.workerId).toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || d.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const pendingCount = documents.filter(d => d.status === "pending").length;
  const approvedCount = documents.filter(d => d.status === "approved").length;
  const rejectedCount = documents.filter(d => d.status === "rejected").length;

  const handleApprove = (doc: WorkerDocument) => {
    updateMutation.mutate({
      id: doc.id,
      updates: { status: "approved", reviewedAt: new Date() },
    });
  };

  const handleReject = () => {
    if (!selectedDoc) return;
    updateMutation.mutate({
      id: selectedDoc.id,
      updates: { status: "rejected", rejectionReason, reviewedAt: new Date() },
    });
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Worker Document Verification</h1>
          <p className="text-slate-500 mt-1">Review and verify worker submitted documents.</p>
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
        <Card className="bg-emerald-50 border-emerald-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl">
              <CheckCircle className="w-5 h-5" />
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
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Rejected</p>
              <p className="text-xl font-bold text-slate-900">{rejectedCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Total</p>
              <p className="text-xl font-bold text-slate-900">{documents.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-100 shadow-sm">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as DocTab)}>
          <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-0">
            <TabsList>
              <TabsTrigger value="all">All ({documents.length})</TabsTrigger>
              <TabsTrigger value="pending" className="gap-1.5">
                <Clock className="w-4 h-4" /> Pending ({pendingCount})
              </TabsTrigger>
              <TabsTrigger value="approved" className="gap-1.5">
                <CheckCircle className="w-4 h-4" /> Approved ({approvedCount})
              </TabsTrigger>
              <TabsTrigger value="rejected" className="gap-1.5">
                <XCircle className="w-4 h-4" /> Rejected ({rejectedCount})
              </TabsTrigger>
            </TabsList>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search by worker name..."
                className="pl-9 bg-slate-50 border-slate-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search-documents"
              />
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredDocs.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                No documents found.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDocs.map((doc) => (
                  <Card 
                    key={doc.id} 
                    className="border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                    data-testid={`card-document-${doc.id}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center",
                            doc.documentType === "aadhaar" ? "bg-blue-50 text-blue-600" :
                            doc.documentType === "pan" ? "bg-amber-50 text-amber-600" :
                            "bg-purple-50 text-purple-600"
                          )}>
                            {getDocTypeIcon(doc.documentType)}
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-900">{getDocTypeLabel(doc.documentType)}</h4>
                            <p className="text-xs text-slate-500">{getWorkerName(doc.workerId)}</p>
                          </div>
                        </div>
                        <Badge className={getStatusBadgeStyle(doc.status)}>
                          {doc.status}
                        </Badge>
                      </div>
                      
                      {doc.documentNumber && (
                        <p className="text-sm text-slate-600 mb-3">Doc #: {doc.documentNumber}</p>
                      )}
                      
                      <div className="text-xs text-slate-500 mb-4">
                        Submitted: {new Date(doc.submittedAt).toLocaleDateString()}
                      </div>

                      <div className="flex gap-2">
                        {doc.fileUrl && (
                          <Button variant="outline" size="sm" className="flex-1" asChild>
                            <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                              <Eye className="w-4 h-4 mr-1" /> View
                            </a>
                          </Button>
                        )}
                        {doc.status === "pending" && (
                          <>
                            <Button 
                              size="sm" 
                              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                              onClick={() => handleApprove(doc)}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" /> Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              className="flex-1"
                              onClick={() => { setSelectedDoc(doc); setIsDialogOpen(true); }}
                            >
                              <XCircle className="w-4 h-4 mr-1" /> Reject
                            </Button>
                          </>
                        )}
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
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Reject Document</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this document.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Rejection Reason</Label>
              <Textarea
                placeholder="e.g., Document is unclear, information doesn't match..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={updateMutation.isPending}>
              {updateMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Reject Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
