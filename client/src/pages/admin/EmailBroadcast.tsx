import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Mail, Send, Loader2, Clock, CheckCircle, Edit2, 
  Plus, Users, Trash2, MoreVertical
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
import type { EmailBroadcast } from "@shared/schema";

export default function AdminEmailBroadcast() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBroadcast, setEditingBroadcast] = useState<EmailBroadcast | null>(null);
  const [form, setForm] = useState({
    subject: "",
    body: "",
    targetAudience: "all",
  });

  const { data: broadcasts = [], isLoading } = useQuery<EmailBroadcast[]>({
    queryKey: ["/api/email-broadcasts"],
    queryFn: async () => {
      const res = await fetch("/api/email-broadcasts");
      if (!res.ok) throw new Error("Failed to fetch broadcasts");
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof form) => {
      const res = await fetch("/api/email-broadcasts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, status: "draft" }),
      });
      if (!res.ok) throw new Error("Failed to create broadcast");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/email-broadcasts"] });
      setIsDialogOpen(false);
      resetForm();
      toast({ title: "Success", description: "Email broadcast created!" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<EmailBroadcast> }) => {
      const res = await fetch(`/api/email-broadcasts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update broadcast");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/email-broadcasts"] });
      setIsDialogOpen(false);
      setEditingBroadcast(null);
      resetForm();
      toast({ title: "Success", description: "Broadcast updated!" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/email-broadcasts/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete broadcast");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/email-broadcasts"] });
      toast({ title: "Success", description: "Broadcast deleted!" });
    },
  });

  const resetForm = () => {
    setForm({ subject: "", body: "", targetAudience: "all" });
  };

  const handleEdit = (broadcast: EmailBroadcast) => {
    setEditingBroadcast(broadcast);
    setForm({
      subject: broadcast.subject,
      body: broadcast.body,
      targetAudience: broadcast.targetAudience,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBroadcast) {
      updateMutation.mutate({ id: editingBroadcast.id, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const handleSend = (broadcast: EmailBroadcast) => {
    updateMutation.mutate({
      id: broadcast.id,
      data: { status: "sent", sentAt: new Date() },
    });
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "draft": return "bg-slate-100 text-slate-700";
      case "scheduled": return "bg-blue-100 text-blue-700";
      case "sending": return "bg-amber-100 text-amber-700";
      case "sent": return "bg-emerald-100 text-emerald-700";
      case "failed": return "bg-red-100 text-red-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  const draftCount = broadcasts.filter(b => b.status === "draft").length;
  const sentCount = broadcasts.filter(b => b.status === "sent").length;

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Email Broadcast</h1>
          <p className="text-slate-500 mt-1">Send bulk emails to your users.</p>
        </div>
        <Button 
          className="bg-primary shadow-lg shadow-primary/25"
          onClick={() => { setEditingBroadcast(null); resetForm(); setIsDialogOpen(true); }}
          data-testid="button-create-broadcast"
        >
          <Plus className="w-4 h-4 mr-2" /> Create Broadcast
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Total</p>
              <p className="text-xl font-bold text-slate-900">{broadcasts.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-50 border-slate-200">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-slate-200 text-slate-600 rounded-xl">
              <Edit2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Drafts</p>
              <p className="text-xl font-bold text-slate-900">{draftCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50 border-emerald-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Sent</p>
              <p className="text-xl font-bold text-slate-900">{sentCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 border-purple-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Recipients</p>
              <p className="text-xl font-bold text-slate-900">
                {broadcasts.reduce((sum, b) => sum + (b.sentCount || 0), 0)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-100 shadow-sm">
        <CardHeader>
          <CardTitle>Email Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : broadcasts.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              No email broadcasts yet. Create your first campaign.
            </div>
          ) : (
            <div className="space-y-4">
              {broadcasts.map((broadcast) => (
                <div 
                  key={broadcast.id} 
                  className="flex items-start justify-between p-4 bg-slate-50 rounded-lg"
                  data-testid={`row-broadcast-${broadcast.id}`}
                >
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">{broadcast.subject}</h4>
                      <p className="text-sm text-slate-600 mt-1 line-clamp-2">{broadcast.body}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <Badge className={getStatusBadgeStyle(broadcast.status)}>
                          {broadcast.status}
                        </Badge>
                        <span className="text-xs text-slate-500 capitalize">
                          {broadcast.targetAudience}
                        </span>
                        <span className="text-xs text-slate-400">
                          {new Date(broadcast.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {broadcast.status === "draft" && (
                      <Button 
                        size="sm"
                        onClick={() => handleSend(broadcast)}
                        disabled={updateMutation.isPending}
                      >
                        <Send className="w-4 h-4 mr-1" /> Send
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(broadcast)}>
                          <Edit2 className="w-4 h-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600" 
                          onClick={() => deleteMutation.mutate(broadcast.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{editingBroadcast ? "Edit Broadcast" : "Create Email Broadcast"}</DialogTitle>
            <DialogDescription>
              Compose an email to send to your users.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Subject *</Label>
              <Input
                placeholder="e.g., Important Update from ServiceHub Pro"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                data-testid="input-email-subject"
              />
            </div>
            <div className="space-y-2">
              <Label>Email Body *</Label>
              <Textarea
                placeholder="Write your email content..."
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                rows={6}
              />
            </div>
            <div className="space-y-2">
              <Label>Target Audience</Label>
              <Select value={form.targetAudience} onValueChange={(v) => setForm({ ...form, targetAudience: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="customers">Customers Only</SelectItem>
                  <SelectItem value="workers">Workers Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending || !form.subject || !form.body}>
                {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {editingBroadcast ? "Update" : "Save as Draft"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
