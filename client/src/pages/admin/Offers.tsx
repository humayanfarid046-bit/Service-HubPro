import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tag, Plus, Trash2, Edit2, Loader2, MoreVertical, Percent, IndianRupee } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import type { Coupon } from "@shared/schema";

export default function AdminOffers() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [form, setForm] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    minOrderAmount: "",
    maxDiscount: "",
    description: "",
    applicableTo: "all",
    usageLimit: "",
    isActive: true,
  });

  const { data: coupons = [], isLoading } = useQuery<Coupon[]>({
    queryKey: ["/api/coupons"],
    queryFn: async () => {
      const res = await fetch("/api/coupons");
      if (!res.ok) throw new Error("Failed to fetch coupons");
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof form) => {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          discountValue: data.discountValue,
          minOrderAmount: data.minOrderAmount || null,
          maxDiscount: data.maxDiscount || null,
          usageLimit: data.usageLimit ? parseInt(data.usageLimit) : null,
        }),
      });
      if (!res.ok) throw new Error("Failed to create coupon");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/coupons"] });
      setIsDialogOpen(false);
      resetForm();
      toast({ title: "Success", description: "Coupon created!" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Coupon> }) => {
      const res = await fetch(`/api/coupons/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update coupon");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/coupons"] });
      setIsDialogOpen(false);
      setEditingCoupon(null);
      resetForm();
      toast({ title: "Success", description: "Coupon updated!" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/coupons/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete coupon");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/coupons"] });
      toast({ title: "Success", description: "Coupon deleted!" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const resetForm = () => {
    setForm({
      code: "",
      discountType: "percentage",
      discountValue: "",
      minOrderAmount: "",
      maxDiscount: "",
      description: "",
      applicableTo: "all",
      usageLimit: "",
      isActive: true,
    });
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setForm({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue || "",
      minOrderAmount: coupon.minOrderAmount || "",
      maxDiscount: coupon.maxDiscount || "",
      description: coupon.description || "",
      applicableTo: coupon.applicableTo || "all",
      usageLimit: coupon.usageLimit?.toString() || "",
      isActive: coupon.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code || !form.discountValue) {
      toast({ title: "Error", description: "Code and discount value are required", variant: "destructive" });
      return;
    }
    if (editingCoupon) {
      updateMutation.mutate({ id: editingCoupon.id, data: form as any });
    } else {
      createMutation.mutate(form);
    }
  };

  const activeCoupons = coupons.filter(c => c.isActive);
  const totalUsage = coupons.reduce((sum, c) => sum + (c.usedCount || 0), 0);

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Offers & Coupons</h1>
          <p className="text-slate-500 mt-1">Manage discounts and promotional campaigns.</p>
        </div>
        <Button 
          className="bg-primary shadow-lg shadow-primary/25"
          onClick={() => { setEditingCoupon(null); resetForm(); setIsDialogOpen(true); }}
          data-testid="button-add-coupon"
        >
          <Plus className="w-4 h-4 mr-2" /> Create Coupon
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-emerald-50 border-emerald-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Active Coupons</p>
              <p className="text-xl font-bold text-slate-900">{activeCoupons.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
              <Percent className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Total Coupons</p>
              <p className="text-xl font-bold text-slate-900">{coupons.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 border-purple-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl">
              <IndianRupee className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Total Used</p>
              <p className="text-xl font-bold text-slate-900">{totalUsage}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : coupons.length === 0 ? (
        <Card className="border-slate-100">
          <CardContent className="py-12 text-center text-slate-500">
            No coupons found. Click "Create Coupon" to add your first coupon.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((coupon) => (
            <Card key={coupon.id} className="border-slate-100 shadow-sm relative overflow-hidden hover:shadow-md transition-shadow" data-testid={`card-coupon-${coupon.id}`}>
              <div className="absolute top-3 right-3 flex items-center gap-2">
                <Badge className={cn(
                  coupon.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                )}>
                  {coupon.isActive ? "Active" : "Inactive"}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(coupon)}>
                      <Edit2 className="w-4 h-4 mr-2" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => updateMutation.mutate({ id: coupon.id, data: { isActive: !coupon.isActive } })}
                    >
                      {coupon.isActive ? "Deactivate" : "Activate"}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600" onClick={() => deleteMutation.mutate(coupon.id)}>
                      <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardContent className="p-6 pt-12">
                <div className="w-12 h-12 bg-pink-50 rounded-full flex items-center justify-center text-pink-500 mb-4">
                  <Tag className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">{coupon.code}</h3>
                <p className="text-pink-600 font-bold text-lg mb-2">
                  {coupon.discountType === "percentage" ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} FLAT`}
                </p>
                {coupon.description && (
                  <p className="text-sm text-slate-500 mb-3">{coupon.description}</p>
                )}
                <div className="flex justify-between text-sm text-slate-500 mt-4 pt-4 border-t border-slate-100">
                  <span>{coupon.applicableTo === "all" ? "All Users" : coupon.applicableTo}</span>
                  <span>{coupon.usedCount || 0} used</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingCoupon ? "Edit Coupon" : "Create New Coupon"}</DialogTitle>
            <DialogDescription>
              {editingCoupon ? "Update the coupon details." : "Create a new promotional coupon."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Coupon Code *</Label>
                <Input
                  placeholder="e.g., SUMMER50"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  data-testid="input-coupon-code"
                />
              </div>
              <div className="space-y-2">
                <Label>Discount Type *</Label>
                <Select value={form.discountType} onValueChange={(v) => setForm({ ...form, discountType: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="flat">Flat Amount (₹)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Discount Value *</Label>
                <Input
                  type="number"
                  placeholder={form.discountType === "percentage" ? "e.g., 20" : "e.g., 100"}
                  value={form.discountValue}
                  onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                  data-testid="input-discount-value"
                />
              </div>
              <div className="space-y-2">
                <Label>Min Order Amount</Label>
                <Input
                  type="number"
                  placeholder="e.g., 500"
                  value={form.minOrderAmount}
                  onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Max Discount (for %)</Label>
                <Input
                  type="number"
                  placeholder="e.g., 200"
                  value={form.maxDiscount}
                  onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Usage Limit</Label>
                <Input
                  type="number"
                  placeholder="e.g., 100"
                  value={form.usageLimit}
                  onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Applicable To</Label>
              <Select value={form.applicableTo} onValueChange={(v) => setForm({ ...form, applicableTo: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="new_users">New Users Only</SelectItem>
                  <SelectItem value="specific_services">Specific Services</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                placeholder="e.g., Summer sale discount"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium text-slate-900">Active Status</p>
                <p className="text-xs text-slate-500">Enable this coupon</p>
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
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {editingCoupon ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
