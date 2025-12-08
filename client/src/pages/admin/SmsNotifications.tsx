import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  MessageSquare, Send, Loader2, CheckCircle, XCircle, 
  Plus, Search, Phone
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
import type { SmsLog } from "@shared/schema";

export default function AdminSmsNotifications() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [form, setForm] = useState({
    recipientPhone: "",
    recipientName: "",
    message: "",
  });

  const { data: smsLogs = [], isLoading } = useQuery<SmsLog[]>({
    queryKey: ["/api/sms-logs"],
    queryFn: async () => {
      const res = await fetch("/api/sms-logs");
      if (!res.ok) throw new Error("Failed to fetch SMS logs");
      return res.json();
    },
  });

  const sendMutation = useMutation({
    mutationFn: async (data: typeof form) => {
      const res = await fetch("/api/sms-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, status: "sent", sentAt: new Date() }),
      });
      if (!res.ok) throw new Error("Failed to send SMS");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sms-logs"] });
      setIsDialogOpen(false);
      setForm({ recipientPhone: "", recipientName: "", message: "" });
      toast({ title: "Success", description: "SMS sent successfully!" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "pending": return "bg-amber-100 text-amber-700";
      case "sent": return "bg-blue-100 text-blue-700";
      case "delivered": return "bg-emerald-100 text-emerald-700";
      case "failed": return "bg-red-100 text-red-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  const filteredLogs = smsLogs.filter(log => 
    log.recipientPhone.includes(searchQuery) ||
    log.recipientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sentCount = smsLogs.filter(l => l.status === "sent" || l.status === "delivered").length;
  const failedCount = smsLogs.filter(l => l.status === "failed").length;

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">SMS Notifications</h1>
          <p className="text-slate-500 mt-1">Send and manage SMS notifications.</p>
        </div>
        <Button 
          className="bg-primary shadow-lg shadow-primary/25"
          onClick={() => setIsDialogOpen(true)}
          data-testid="button-send-sms"
        >
          <Plus className="w-4 h-4 mr-2" /> Send SMS
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Total SMS</p>
              <p className="text-xl font-bold text-slate-900">{smsLogs.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50 border-emerald-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Delivered</p>
              <p className="text-xl font-bold text-slate-900">{sentCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-red-100 text-red-600 rounded-xl">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Failed</p>
              <p className="text-xl font-bold text-slate-900">{failedCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 border-purple-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Today</p>
              <p className="text-xl font-bold text-slate-900">
                {smsLogs.filter(l => {
                  const today = new Date().toDateString();
                  return new Date(l.createdAt).toDateString() === today;
                }).length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-100 shadow-sm">
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle>SMS History</CardTitle>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search SMS..."
              className="pl-9 bg-slate-50 border-slate-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search-sms"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              No SMS logs found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Recipient</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Message</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Sent At</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => (
                    <tr 
                      key={log.id} 
                      className="border-b border-slate-50 hover:bg-slate-50"
                      data-testid={`row-sms-${log.id}`}
                    >
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-slate-900">{log.recipientName || "Unknown"}</p>
                          <p className="text-xs text-slate-500">{log.recipientPhone}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm text-slate-600 max-w-xs truncate">{log.message}</p>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusBadgeStyle(log.status)}>
                          {log.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-500">
                        {log.sentAt ? new Date(log.sentAt).toLocaleString() : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Send SMS</DialogTitle>
            <DialogDescription>
              Send an SMS to a specific phone number.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); sendMutation.mutate(form); }} className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Phone Number *</Label>
                <Input
                  placeholder="e.g., 9876543210"
                  value={form.recipientPhone}
                  onChange={(e) => setForm({ ...form, recipientPhone: e.target.value })}
                  data-testid="input-sms-phone"
                />
              </div>
              <div className="space-y-2">
                <Label>Recipient Name</Label>
                <Input
                  placeholder="e.g., John Doe"
                  value={form.recipientName}
                  onChange={(e) => setForm({ ...form, recipientName: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Message *</Label>
              <Textarea
                placeholder="Write your SMS message..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={3}
                maxLength={160}
              />
              <p className="text-xs text-slate-500">{form.message.length}/160 characters</p>
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={sendMutation.isPending || !form.recipientPhone || !form.message}>
                {sendMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                <Send className="w-4 h-4 mr-2" /> Send
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
