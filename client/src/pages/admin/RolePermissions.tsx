import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Shield, Save, Loader2, Plus, Edit, Trash2, Users, Check, X
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
}

interface Role {
  id: number;
  name: string;
  description: string;
  permissions: string[];
  isSystem: boolean;
  userCount: number;
}

const allPermissions: Permission[] = [
  { id: "users.view", name: "View Users", description: "Can view user list", module: "Users" },
  { id: "users.create", name: "Create Users", description: "Can create new users", module: "Users" },
  { id: "users.edit", name: "Edit Users", description: "Can edit user details", module: "Users" },
  { id: "users.delete", name: "Delete Users", description: "Can delete users", module: "Users" },
  { id: "workers.view", name: "View Workers", description: "Can view workers", module: "Workers" },
  { id: "workers.manage", name: "Manage Workers", description: "Can approve/reject workers", module: "Workers" },
  { id: "bookings.view", name: "View Bookings", description: "Can view all bookings", module: "Bookings" },
  { id: "bookings.manage", name: "Manage Bookings", description: "Can manage bookings", module: "Bookings" },
  { id: "finance.view", name: "View Finance", description: "Can view financial data", module: "Finance" },
  { id: "finance.manage", name: "Manage Finance", description: "Can process payouts", module: "Finance" },
  { id: "settings.view", name: "View Settings", description: "Can view settings", module: "Settings" },
  { id: "settings.manage", name: "Manage Settings", description: "Can change settings", module: "Settings" },
];

const initialRoles: Role[] = [
  { id: 1, name: "Super Admin", description: "Full access to all features", permissions: allPermissions.map(p => p.id), isSystem: true, userCount: 1 },
  { id: 2, name: "Admin", description: "Administrative access", permissions: allPermissions.filter(p => !p.id.includes("delete")).map(p => p.id), isSystem: true, userCount: 2 },
  { id: 3, name: "Support", description: "Customer support access", permissions: ["users.view", "bookings.view", "bookings.manage"], isSystem: false, userCount: 5 },
  { id: 4, name: "Finance Manager", description: "Finance module access", permissions: ["finance.view", "finance.manage", "bookings.view"], isSystem: false, userCount: 2 },
];

export default function AdminRolePermissions() {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [showDialog, setShowDialog] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(roles[0]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: [] as string[],
  });

  const handleSave = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    toast({ title: "Success", description: "Permissions saved!" });
  };

  const handleSaveRole = () => {
    if (editingRole) {
      setRoles(roles.map(r => r.id === editingRole.id ? { ...r, ...formData } : r));
      toast({ title: "Success", description: "Role updated!" });
    } else {
      const newRole: Role = {
        id: Date.now(),
        ...formData,
        isSystem: false,
        userCount: 0,
      };
      setRoles([...roles, newRole]);
      toast({ title: "Success", description: "Role created!" });
    }
    setShowDialog(false);
    setEditingRole(null);
    setFormData({ name: "", description: "", permissions: [] });
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      description: role.description,
      permissions: role.permissions,
    });
    setShowDialog(true);
  };

  const handleDelete = (id: number) => {
    setRoles(roles.filter(r => r.id !== id));
    toast({ title: "Success", description: "Role deleted!" });
  };

  const togglePermission = (permId: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permId)
        ? prev.permissions.filter(p => p !== permId)
        : [...prev.permissions, permId]
    }));
  };

  const permissionsByModule = allPermissions.reduce((acc, perm) => {
    if (!acc[perm.module]) acc[perm.module] = [];
    acc[perm.module].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Role & Permissions</h1>
          <p className="text-slate-500 mt-1">Manage user roles and access control.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setShowDialog(true)} className="gap-2">
            <Plus className="w-4 h-4" /> Add Role
          </Button>
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-slate-100 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              Roles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {roles.map((role) => (
              <div 
                key={role.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedRole?.id === role.id 
                    ? "bg-blue-50 border border-blue-200" 
                    : "bg-slate-50 hover:bg-slate-100"
                }`}
                onClick={() => setSelectedRole(role)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-slate-900">{role.name}</p>
                      {role.isSystem && (
                        <Badge variant="outline" className="text-xs">System</Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{role.description}</p>
                  </div>
                  {!role.isSystem && (
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); handleEdit(role); }}>
                        <Edit className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={(e) => { e.stopPropagation(); handleDelete(role.id); }}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                  <Users className="w-3.5 h-3.5" />
                  {role.userCount} users
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-600" />
              Permissions for: {selectedRole?.name || "Select a role"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedRole ? (
              <div className="space-y-6">
                {Object.entries(permissionsByModule).map(([module, perms]) => (
                  <div key={module}>
                    <h4 className="font-medium text-slate-700 mb-3">{module}</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {perms.map((perm) => (
                        <div 
                          key={perm.id}
                          className={`p-3 rounded-lg border ${
                            selectedRole.permissions.includes(perm.id)
                              ? "bg-emerald-50 border-emerald-200"
                              : "bg-slate-50 border-slate-100"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-sm">{perm.name}</p>
                              <p className="text-xs text-slate-500">{perm.description}</p>
                            </div>
                            {selectedRole.permissions.includes(perm.id) ? (
                              <Check className="w-5 h-5 text-emerald-600" />
                            ) : (
                              <X className="w-5 h-5 text-slate-300" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-center py-8">Select a role to view permissions</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={showDialog} onOpenChange={() => { setShowDialog(false); setEditingRole(null); }}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingRole ? "Edit Role" : "Create New Role"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Role Name</Label>
              <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Content Manager" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Brief description of this role" />
            </div>
            <div className="space-y-3">
              <Label>Permissions</Label>
              {Object.entries(permissionsByModule).map(([module, perms]) => (
                <div key={module} className="space-y-2">
                  <p className="text-sm font-medium text-slate-600">{module}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {perms.map((perm) => (
                      <div key={perm.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={perm.id}
                          checked={formData.permissions.includes(perm.id)}
                          onCheckedChange={() => togglePermission(perm.id)}
                        />
                        <label htmlFor={perm.id} className="text-sm cursor-pointer">{perm.name}</label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={() => { setShowDialog(false); setEditingRole(null); }}>Cancel</Button>
            <Button onClick={handleSaveRole}>{editingRole ? "Update" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
