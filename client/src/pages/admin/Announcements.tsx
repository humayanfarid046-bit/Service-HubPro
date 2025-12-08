import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Megaphone, Loader2, Plus, Edit2, Trash2, MoreVertical,
  Info, AlertTriangle, Gift, Sparkles
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
import type { Announcement } from "@shared/schema";

export default function AdminAnnouncements() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [form, setForm] = useState({
    title: "",
    message: "",
    type: "info",
    targetAudience: "all",
    actionUrl: "",
    actionLabel: "",
    isActive: true,
  });

  const { data: announcements = [], isLoading } = useQuery<Announcement[]>({
    queryKey: ["/api/announcements"],
    queryFn: async () => {
      const res = await fetch("/api/announcements");
      if (!res.ok) throw new Error("Failed to fetch announcements");
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof form) => {
      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create announcement");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/announcements"] });
      setIsDialogOpen(false);
      resetForm();
      toast({ title: "Success", description: "Announcement created!" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Announcement> }) => {
      const res = await fetch(`/api/announcements/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update announcement");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/announcements"] });
      setIsDialogOpen(false);
      setEditingAnnouncement(null);
      resetForm();
      toast({ title: "Success", description: "Announcement updated!" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/announcements/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete announcement");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/announcements"] });
      toast({ title: "Success", description: "Announcement deleted!" });
    },
  });

  const resetForm = () => {
    setForm({
      title: "",
      message: "",
      type: "info",
      targetAudience: "all",
      actionUrl: "",
      actionLabel: "",
      isActive: true,
    });
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setForm({
      title: announcement.title,
      message: announcement.message,
      type: announcement.type,
      targetAudience: announcement.targetAudience,
      actionUrl: announcement.actionUrl || "",
      actionLabel: announcement.actionLabel || "",
      isActive: announcement.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAnnouncement) {
      updateMutation.mutate({ id: editingAnnouncement.id, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "info": return <Info className="w-5 h-5" />;
      case "warning": return <AlertTriangle className="w-5 h-5" />;
      case "promo": return <Gift className="w-5 h-5" />;
      case "update": return <Sparkles className="w-5 h-5" />;
      default: return <Megaphone className="w-5 h-5" />;
    }
  };

  const getTypeStyle = (type: string) => {
    switch (type) {
      case "info": return { bg: "bg-blue-50", icon: "bg-blue-100 text-blue-600", badge: "bg-blue-100 text-blue-700" };
      case "warning": return { bg: "bg-amber-50", icon: "bg-amber-100 text-amber-600", badge: "bg-amber-100 text-amber-700" };
      case "promo": return { bg: "bg-pink-50", icon: "bg-pink-100 text-pink-600", badge: "bg-pink-100 text-pink-700" };
      case "update": return { bg: "bg-purple-50", icon: "bg-purple-100 text-purple-600", badge: "bg-purple-100 text-purple-700" };
      default: return { bg: "bg-slate-50", icon: "bg-slate-100 text-slate-600", badge: "bg-slate-100 text-slate-700" };
    }
  };

  const activeCount = announcements.filter(a => a.isActive).length;

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">In-App Announcements</h1>
          <p className="text-slate-500 mt-1">Create announcements visible inside the app.</p>
        </div>
        <Button 
          className="bg-primary shadow-lg shadow-primary/25"
          onClick={() => { setEditingAnnouncement(null); resetForm(); setIsDialogOpen(true); }}
          data-testid="button-create-announcement"
        >
          <Plus className="w-4 h-4 mr-2" /> Create Announcement
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Total</p>
              <p className="text-xl font-bold text-slate-900">{announcements.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50 border-emerald-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Active</p>
              <p className="text-xl font-bold text-slate-900">{activeCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-pink-50 border-pink-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-pink-100 text-pink-600 rounded-xl">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Promos</p>
              <p className="text-xl font-bold text-slate-900">
                {announcements.filter(a => a.type === "promo").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 border-amber-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 text-amber-600 rounded-xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Warnings</p>
              <p className="text-xl font-bold text-slate-900">
                {announcements.filter(a => a.type === "warning").length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-100 shadow-sm">
        <CardHeader>
          <CardTitle>All Announcements</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : announcements.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              No announcements yet. Create your first announcement.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {announcements.map((announcement) => {
                const style = getTypeStyle(announcement.type);
                return (
                  <Card 
                    key={announcement.id} 
                    className={cn("border-0 shadow-sm", style.bg)}
                    data-testid={`card-announcement-${announcement.id}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-3">
                          <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", style.icon)}>
                            {getTypeIcon(announcement.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-slate-900">{announcement.title}</h4>
                              {!announcement.isActive && (
                                <Badge className="bg-slate-200 text-slate-500">Inactive</Badge>
                              )}
                            </div>
                            <p className="text-sm text-slate-600">{announcement.message}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge className={style.badge}>{announcement.type}</Badge>
                              <span className="text-xs text-slate-500 capitalize">{announcement.targetAudience}</span>
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
                            <DropdownMenuItem onClick={() => handleEdit(announcement)}>
                              <Edit2 className="w-4 h-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => updateMutation.mutate({ id: announcement.id, data: { isActive: !announcement.isActive } })}
                            >
                              {announcement.isActive ? "Deactivate" : "Activate"}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600" 
                              onClick={() => deleteMutation.mutate(announcement.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingAnnouncement ? "Edit Announcement" : "Create Announcement"}</DialogTitle>
            <DialogDescription>
              Create an in-app announcement for your users.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                placeholder="e.g., New Feature Available!"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                data-testid="input-announcement-title"
              />
            </div>
            <div className="space-y-2">
              <Label>Message *</Label>
              <Textarea
                placeholder="Write your announcement..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="promo">Promo</SelectItem>
                    <SelectItem value="update">Update</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Target Audience</Label>
                <Select value={form.targetAudience} onValueChange={(v) => setForm({ ...form, targetAudience: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="customers">Customers</SelectItem>
                    <SelectItem value="workers">Workers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Action URL (optional)</Label>
                <Input
                  placeholder="e.g., /offers"
                  value={form.actionUrl}
                  onChange={(e) => setForm({ ...form, actionUrl: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Action Label</Label>
                <Input
                  placeholder="e.g., View Offers"
                  value={form.actionLabel}
                  onChange={(e) => setForm({ ...form, actionLabel: e.target.value })}
                />
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium text-slate-900">Active</p>
                <p className="text-xs text-slate-500">Show this announcement</p>
              </div>
              <Switch
                checked={form.isActive}
                onCheckedChange={(v) => setForm({ ...form, isActive: v })}
              />
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending || !form.title || !form.message}>
                {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {editingAnnouncement ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
