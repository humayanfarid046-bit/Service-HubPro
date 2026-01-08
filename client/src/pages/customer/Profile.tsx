import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, MapPin, Wallet, Bell, Globe, LogOut, ChevronRight, CreditCard, Shield, Plus, Pencil, Trash2, X, Home, Building2, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import type { CustomerAddress } from "@shared/schema";

export default function CustomerProfile() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [editingAddress, setEditingAddress] = useState<CustomerAddress | null>(null);
  const [addressForm, setAddressForm] = useState({
    label: "",
    house: "",
    street: "",
    city: "",
    pincode: "",
    isDefault: false
  });

  // Fetch addresses
  const { data: addresses = [], isLoading: addressesLoading } = useQuery<CustomerAddress[]>({
    queryKey: ["/api/customers", user?.id, "addresses"],
    queryFn: async () => {
      if (!user?.id) return [];
      const res = await fetch(`/api/customers/${user.id}/addresses`);
      if (!res.ok) throw new Error("Failed to fetch addresses");
      return res.json();
    },
    enabled: !!user?.id
  });

  // Create address mutation
  const createAddressMutation = useMutation({
    mutationFn: async (data: typeof addressForm) => {
      const res = await fetch(`/api/customers/${user?.id}/addresses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error("Failed to create address");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customers", user?.id, "addresses"] });
      toast({ title: "সফল!", description: "ঠিকানা সংরক্ষণ করা হয়েছে" });
      resetForm();
      setShowAddressDialog(false);
    },
    onError: (error: Error) => {
      toast({ title: "ত্রুটি", description: error.message, variant: "destructive" });
    }
  });

  // Update address mutation
  const updateAddressMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: typeof addressForm }) => {
      const res = await fetch(`/api/addresses/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, userId: user?.id })
      });
      if (!res.ok) throw new Error("Failed to update address");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customers", user?.id, "addresses"] });
      toast({ title: "সফল!", description: "ঠিকানা আপডেট হয়েছে" });
      resetForm();
      setShowAddressDialog(false);
    },
    onError: (error: Error) => {
      toast({ title: "ত্রুটি", description: error.message, variant: "destructive" });
    }
  });

  // Delete address mutation
  const deleteAddressMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/addresses/${id}?userId=${user?.id}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error("Failed to delete address");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customers", user?.id, "addresses"] });
      toast({ title: "সফল!", description: "ঠিকানা মুছে ফেলা হয়েছে" });
    },
    onError: (error: Error) => {
      toast({ title: "ত্রুটি", description: error.message, variant: "destructive" });
    }
  });

  const resetForm = () => {
    setAddressForm({ label: "", house: "", street: "", city: "", pincode: "", isDefault: false });
    setEditingAddress(null);
  };

  const handleOpenDialog = (address?: CustomerAddress) => {
    if (address) {
      setEditingAddress(address);
      setAddressForm({
        label: address.label,
        house: address.house || "",
        street: address.street || "",
        city: address.city || "",
        pincode: address.pincode || "",
        isDefault: address.isDefault
      });
    } else {
      resetForm();
    }
    setShowAddressDialog(true);
  };

  const handleSubmit = () => {
    if (!addressForm.label) {
      toast({ title: "ত্রুটি", description: "ঠিকানার নাম দিন (যেমন: বাড়ি, অফিস)", variant: "destructive" });
      return;
    }
    
    if (editingAddress) {
      updateAddressMutation.mutate({ id: editingAddress.id, data: addressForm });
    } else {
      createAddressMutation.mutate(addressForm);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("আপনি কি এই ঠিকানা মুছে ফেলতে চান?")) {
      deleteAddressMutation.mutate(id);
    }
  };

  const getLabelIcon = (label: string) => {
    const lowerLabel = label.toLowerCase();
    if (lowerLabel.includes("home") || lowerLabel.includes("বাড়ি")) return Home;
    if (lowerLabel.includes("office") || lowerLabel.includes("অফিস")) return Building2;
    return MapPin;
  };

  return (
    <div className="pb-20 bg-slate-50 min-h-full">
      {/* Header Profile Section */}
      <div className="bg-white p-6 pb-8 rounded-b-[2rem] shadow-sm border-b border-slate-100">
        <div className="flex items-center gap-4 mb-6">
            <Avatar className="w-20 h-20 border-4 border-slate-50 shadow-lg">
                <AvatarImage src={user?.profilePhoto || undefined} />
                <AvatarFallback className="bg-primary text-white text-xl">
                    {user?.fullName?.charAt(0)}
                </AvatarFallback>
            </Avatar>
            <div>
                <h1 className="text-2xl font-bold text-slate-900" data-testid="text-username">{user?.fullName}</h1>
                <p className="text-slate-500">{user?.phone}</p>
                <div className="flex items-center gap-1 mt-1 text-emerald-600 text-sm font-medium">
                    <Shield className="w-3 h-3 fill-current" /> Verified Customer
                </div>
            </div>
        </div>

        {/* Wallet Card */}
        <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-xl shadow-slate-900/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Wallet className="w-24 h-24" />
            </div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Wallet Balance</p>
            <h2 className="text-3xl font-bold mb-4">₹0.00</h2>
            <div className="flex gap-3">
                <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-md h-8 text-xs">
                    <CreditCard className="w-3 h-3 mr-1.5" /> Top Up
                </Button>
                <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-md h-8 text-xs">
                    History
                </Button>
            </div>
        </div>
      </div>

      {/* Menu Options */}
      <div className="p-6 space-y-6">
        {/* Saved Addresses Section */}
        <section>
            <div className="flex items-center justify-between mb-3 px-2">
              <h3 className="text-sm font-bold text-slate-900">সংরক্ষিত ঠিকানা</h3>
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-indigo-600 hover:text-indigo-700 h-8 text-xs font-bold"
                onClick={() => handleOpenDialog()}
                data-testid="button-add-address"
              >
                <Plus className="w-4 h-4 mr-1" /> নতুন যোগ করুন
              </Button>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              {addressesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                </div>
              ) : addresses.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <MapPin className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                  <p className="text-sm">কোনো ঠিকানা নেই</p>
                  <Button 
                    variant="link" 
                    className="text-indigo-600 mt-2"
                    onClick={() => handleOpenDialog()}
                  >
                    নতুন ঠিকানা যোগ করুন
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {addresses.map((address) => {
                    const IconComponent = getLabelIcon(address.label);
                    return (
                      <div 
                        key={address.id} 
                        className="p-4 flex items-start gap-3 hover:bg-slate-50 transition-colors"
                        data-testid={`card-address-${address.id}`}
                      >
                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-slate-900 text-sm">{address.label}</p>
                            {address.isDefault && (
                              <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">ডিফল্ট</span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5 truncate">
                            {[address.house, address.street, address.city, address.pincode].filter(Boolean).join(", ")}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-8 w-8 text-slate-400 hover:text-indigo-600"
                            onClick={() => handleOpenDialog(address)}
                            data-testid={`button-edit-address-${address.id}`}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-8 w-8 text-slate-400 hover:text-red-600"
                            onClick={() => handleDelete(address.id)}
                            data-testid={`button-delete-address-${address.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
        </section>

        {/* Account Settings */}
        <section>
            <h3 className="text-sm font-bold text-slate-900 mb-3 px-2">Account</h3>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <MenuLink icon={User} label="Edit Profile" onClick={() => {}} />
                <MenuLink icon={Bell} label="Notifications" onClick={() => {}} />
            </div>
        </section>

        {/* App Settings */}
        <section>
            <h3 className="text-sm font-bold text-slate-900 mb-3 px-2">Preferences</h3>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden p-4 space-y-4">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-600">
                            <Globe className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-slate-700">Language</span>
                    </div>
                    <span className="text-sm text-slate-400">English (US)</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-600">
                            <Bell className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-slate-700">Push Notifications</span>
                    </div>
                    <Switch defaultChecked />
                 </div>
            </div>
        </section>

        <Button 
            variant="ghost" 
            className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 h-12 rounded-xl font-medium"
            onClick={() => {
                logout();
                setLocation("/auth");
            }}
            data-testid="button-logout"
        >
            <LogOut className="w-4 h-4 mr-2" /> Log Out
        </Button>
        
        <p className="text-center text-xs text-slate-400 pb-4">Version 1.0.2 • ServiceHub Pro</p>
      </div>

      {/* Add/Edit Address Dialog */}
      <Dialog open={showAddressDialog} onOpenChange={setShowAddressDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingAddress ? "ঠিকানা সম্পাদনা" : "নতুন ঠিকানা যোগ করুন"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">ঠিকানার নাম *</Label>
              <Input 
                placeholder="যেমন: বাড়ি, অফিস, অন্যান্য"
                value={addressForm.label}
                onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                data-testid="input-address-label"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-sm font-medium">বাড়ি/ফ্ল্যাট নং</Label>
                <Input 
                  placeholder="12A"
                  value={addressForm.house}
                  onChange={(e) => setAddressForm({ ...addressForm, house: e.target.value })}
                  data-testid="input-address-house"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">পিন কোড</Label>
                <Input 
                  placeholder="700001"
                  value={addressForm.pincode}
                  onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                  data-testid="input-address-pincode"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">রাস্তা / এলাকা</Label>
              <Input 
                placeholder="রাস্তার নাম"
                value={addressForm.street}
                onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                data-testid="input-address-street"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">শহর</Label>
              <Input 
                placeholder="শহরের নাম"
                value={addressForm.city}
                onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                data-testid="input-address-city"
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch 
                checked={addressForm.isDefault}
                onCheckedChange={(checked) => setAddressForm({ ...addressForm, isDefault: checked })}
                data-testid="switch-address-default"
              />
              <Label className="text-sm">ডিফল্ট ঠিকানা হিসাবে সেট করুন</Label>
            </div>
            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  resetForm();
                  setShowAddressDialog(false);
                }}
              >
                বাতিল
              </Button>
              <Button 
                className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                onClick={handleSubmit}
                disabled={createAddressMutation.isPending || updateAddressMutation.isPending}
                data-testid="button-save-address"
              >
                {(createAddressMutation.isPending || updateAddressMutation.isPending) && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                সংরক্ষণ করুন
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MenuLink({ icon: Icon, label, subLabel, onClick }: { icon: any, label: string, subLabel?: string, onClick: () => void }) {
    return (
        <button onClick={onClick} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Icon className="w-4 h-4" />
                </div>
                <div className="text-left">
                    <p className="font-medium text-slate-900 text-sm">{label}</p>
                    {subLabel && <p className="text-xs text-slate-400">{subLabel}</p>}
                </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300" />
        </button>
    )
}
