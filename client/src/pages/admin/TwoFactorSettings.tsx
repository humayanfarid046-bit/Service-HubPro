import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Shield, Search, Loader2, CheckCircle, XCircle, 
  Smartphone, Mail, Key, Settings, Lock, User
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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

interface UserWithSettings {
  userId: number;
  fullName: string | null;
  phone: string;
  role: string;
  settings: {
    is2FAEnabled: boolean;
    twoFAMethod: string | null;
    lastVerifiedAt: string | null;
  } | null;
}

export default function AdminTwoFactorSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<UserWithSettings | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [enable2FA, setEnable2FA] = useState(false);
  const [method, setMethod] = useState("sms");

  const { data: usersWithSettings = [], isLoading } = useQuery<UserWithSettings[]>({
    queryKey: ["/api/security-settings"],
    queryFn: async () => {
      const res = await fetch("/api/security-settings");
      if (!res.ok) throw new Error("Failed to fetch settings");
      return res.json();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: { userId: number; is2FAEnabled: boolean; twoFAMethod: string }) => {
      const res = await fetch("/api/security-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update settings");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/security-settings"] });
      toast({ title: "Success", description: "2FA settings updated!" });
      setIsDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const filteredUsers = usersWithSettings.filter(user => {
    const matchesSearch = 
      user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const enabledCount = usersWithSettings.filter(u => u.settings?.is2FAEnabled).length;
  const disabledCount = usersWithSettings.filter(u => !u.settings?.is2FAEnabled).length;

  const handleEditSettings = (user: UserWithSettings) => {
    setSelectedUser(user);
    setEnable2FA(user.settings?.is2FAEnabled || false);
    setMethod(user.settings?.twoFAMethod || "sms");
    setIsDialogOpen(true);
  };

  const handleSaveSettings = () => {
    if (!selectedUser) return;
    updateMutation.mutate({
      userId: selectedUser.userId,
      is2FAEnabled: enable2FA,
      twoFAMethod: method,
    });
  };

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case "ADMIN": return "bg-purple-100 text-purple-700";
      case "WORKER": return "bg-blue-100 text-blue-700";
      case "CUSTOMER": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">2FA Settings</h1>
          <p className="text-slate-500 mt-1">Manage two-factor authentication for all users.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Total Users</p>
              <p className="text-xl font-bold text-slate-900">{usersWithSettings.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50 border-emerald-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">2FA Enabled</p>
              <p className="text-xl font-bold text-slate-900">{enabledCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 border-amber-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 text-amber-600 rounded-xl">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">2FA Disabled</p>
              <p className="text-xl font-bold text-slate-900">{disabledCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 border-purple-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">SMS Method</p>
              <p className="text-xl font-bold text-slate-900">
                {usersWithSettings.filter(u => u.settings?.twoFAMethod === "sms").length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-100 shadow-sm">
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle>User Security Settings</CardTitle>
          <div className="flex flex-wrap gap-3">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search users..."
                className="pl-9 bg-slate-50 border-slate-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search-2fa"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="WORKER">Worker</SelectItem>
                <SelectItem value="CUSTOMER">Customer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              No users found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">User</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Role</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">2FA Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Method</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Last Verified</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr 
                      key={user.userId} 
                      className="border-b border-slate-50 hover:bg-slate-50"
                      data-testid={`row-user-2fa-${user.userId}`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-slate-500" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{user.fullName || "No Name"}</p>
                            <p className="text-xs text-slate-500">{user.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getRoleBadgeStyle(user.role)}>{user.role}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={cn(
                          user.settings?.is2FAEnabled 
                            ? "bg-emerald-100 text-emerald-700" 
                            : "bg-slate-100 text-slate-500"
                        )}>
                          {user.settings?.is2FAEnabled ? (
                            <><CheckCircle className="w-3 h-3 mr-1" /> Enabled</>
                          ) : (
                            <><XCircle className="w-3 h-3 mr-1" /> Disabled</>
                          )}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        {user.settings?.twoFAMethod ? (
                          <div className="flex items-center gap-1 text-sm text-slate-600">
                            {user.settings.twoFAMethod === "sms" ? (
                              <><Smartphone className="w-4 h-4" /> SMS</>
                            ) : (
                              <><Mail className="w-4 h-4" /> App</>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-500">
                        {user.settings?.lastVerifiedAt 
                          ? new Date(user.settings.lastVerifiedAt).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="py-3 px-4">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditSettings(user)}
                        >
                          <Settings className="w-4 h-4 mr-1" /> Configure
                        </Button>
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
            <DialogTitle>Configure 2FA Settings</DialogTitle>
            <DialogDescription>
              {selectedUser?.fullName || selectedUser?.phone}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 mt-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Enable 2FA</p>
                  <p className="text-xs text-slate-500">Require verification code on login</p>
                </div>
              </div>
              <Switch
                checked={enable2FA}
                onCheckedChange={setEnable2FA}
              />
            </div>

            {enable2FA && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Verification Method</label>
                <Select value={method} onValueChange={setMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sms">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4" /> SMS
                      </div>
                    </SelectItem>
                    <SelectItem value="app">
                      <div className="flex items-center gap-2">
                        <Key className="w-4 h-4" /> Authenticator App
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSettings} disabled={updateMutation.isPending}>
              {updateMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
