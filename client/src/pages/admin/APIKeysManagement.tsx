import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Key, Plus, Loader2, Copy, Trash2, Eye, EyeOff, RefreshCw, CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface APIKey {
  id: number;
  name: string;
  key: string;
  type: string;
  permissions: string[];
  createdAt: string;
  lastUsed: string | null;
  isActive: boolean;
}

const initialKeys: APIKey[] = [
  { id: 1, name: "Production API", key: "sk_live_xxxxxxxxxxxxxxxxxxxx", type: "production", permissions: ["read", "write"], createdAt: "2024-01-15", lastUsed: "2024-12-08", isActive: true },
  { id: 2, name: "Development API", key: "sk_test_xxxxxxxxxxxxxxxxxxxx", type: "development", permissions: ["read", "write"], createdAt: "2024-01-10", lastUsed: "2024-12-07", isActive: true },
  { id: 3, name: "Mobile App Key", key: "pk_live_xxxxxxxxxxxxxxxxxxxx", type: "public", permissions: ["read"], createdAt: "2024-02-01", lastUsed: "2024-12-08", isActive: true },
];

export default function AdminAPIKeysManagement() {
  const { toast } = useToast();
  const [keys, setKeys] = useState<APIKey[]>(initialKeys);
  const [showDialog, setShowDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingKey, setDeletingKey] = useState<APIKey | null>(null);
  const [showKeys, setShowKeys] = useState<Record<number, boolean>>({});
  const [newKey, setNewKey] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "development",
    permissions: ["read"],
  });

  const generateKey = (type: string) => {
    const prefix = type === "production" ? "sk_live_" : type === "development" ? "sk_test_" : "pk_live_";
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = prefix;
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleCreate = () => {
    const key = generateKey(formData.type);
    const newApiKey: APIKey = {
      id: Date.now(),
      name: formData.name,
      key,
      type: formData.type,
      permissions: formData.permissions,
      createdAt: new Date().toISOString().split('T')[0],
      lastUsed: null,
      isActive: true,
    };
    setKeys([...keys, newApiKey]);
    setNewKey(key);
    setFormData({ name: "", type: "development", permissions: ["read"] });
    toast({ title: "Success", description: "API key created!" });
  };

  const handleDelete = () => {
    if (deletingKey) {
      setKeys(keys.filter(k => k.id !== deletingKey.id));
      toast({ title: "Success", description: "API key deleted!" });
    }
    setShowDeleteDialog(false);
    setDeletingKey(null);
  };

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({ title: "Copied", description: "API key copied to clipboard!" });
  };

  const handleRegenerate = (id: number) => {
    setKeys(keys.map(k => {
      if (k.id === id) {
        const newKey = generateKey(k.type);
        toast({ title: "Success", description: "API key regenerated!" });
        return { ...k, key: newKey };
      }
      return k;
    }));
  };

  const toggleKeyVisibility = (id: number) => {
    setShowKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const maskKey = (key: string) => {
    return key.slice(0, 8) + "••••••••••••••••" + key.slice(-4);
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "production": return "bg-red-100 text-red-700";
      case "development": return "bg-amber-100 text-amber-700";
      case "public": return "bg-blue-100 text-blue-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">API Keys Management</h1>
          <p className="text-slate-500 mt-1">Manage API keys for external integrations.</p>
        </div>
        <Button onClick={() => setShowDialog(true)} className="gap-2">
          <Plus className="w-4 h-4" /> Create API Key
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Total Keys</p>
              <p className="text-xl font-bold text-slate-900">{keys.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50 border-emerald-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Active</p>
              <p className="text-xl font-bold text-slate-900">{keys.filter(k => k.isActive).length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-red-100 text-red-600 rounded-xl">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Production</p>
              <p className="text-xl font-bold text-slate-900">{keys.filter(k => k.type === "production").length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-100 shadow-sm">
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {keys.map((apiKey) => (
              <div 
                key={apiKey.id}
                className="p-4 bg-slate-50 rounded-lg border border-slate-100"
                data-testid={`row-apikey-${apiKey.id}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-200 rounded-lg">
                      <Key className="w-4 h-4 text-slate-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{apiKey.name}</p>
                      <p className="text-xs text-slate-500">Created: {apiKey.createdAt}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getTypeBadge(apiKey.type)}>{apiKey.type}</Badge>
                    {apiKey.permissions.map(p => (
                      <Badge key={p} variant="outline" className="text-xs">{p}</Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-100">
                  <code className="flex-1 text-sm font-mono text-slate-700">
                    {showKeys[apiKey.id] ? apiKey.key : maskKey(apiKey.key)}
                  </code>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleKeyVisibility(apiKey.id)}>
                    {showKeys[apiKey.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCopy(apiKey.key)}>
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleRegenerate(apiKey.id)}>
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-red-500" 
                    onClick={() => { setDeletingKey(apiKey); setShowDeleteDialog(true); }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                {apiKey.lastUsed && (
                  <p className="text-xs text-slate-500 mt-2">Last used: {apiKey.lastUsed}</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New API Key</DialogTitle>
          </DialogHeader>
          {newKey ? (
            <div className="space-y-4 mt-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                <p className="text-sm text-emerald-700 mb-2">Your API key has been created. Copy it now - you won't be able to see it again!</p>
                <div className="flex items-center gap-2 bg-white p-3 rounded border">
                  <code className="flex-1 text-sm font-mono break-all">{newKey}</code>
                  <Button variant="ghost" size="icon" onClick={() => handleCopy(newKey)}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Button className="w-full" onClick={() => { setShowDialog(false); setNewKey(null); }}>Done</Button>
            </div>
          ) : (
            <>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Key Name</Label>
                  <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Production API" />
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="development">Development</SelectItem>
                      <SelectItem value="production">Production</SelectItem>
                      <SelectItem value="public">Public</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter className="pt-4">
                <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
                <Button onClick={handleCreate} disabled={!formData.name}>Create Key</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete API Key?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the API key "{deletingKey?.name}". Any applications using this key will stop working.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
