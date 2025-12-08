import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  CreditCard, Save, Loader2, Eye, EyeOff, CheckCircle, XCircle, Wallet
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function AdminPaymentGatewaySettings() {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  
  const [gateways, setGateways] = useState({
    razorpay: {
      enabled: true,
      testMode: false,
      keyId: "rzp_live_xxxxxxxxxxxxx",
      keySecret: "xxxxxxxxxxxxxxxxxxxxxxxx",
      webhookSecret: "whsec_xxxxxxxxxxxxxx",
    },
    cod: {
      enabled: true,
      maxAmount: "5000",
      minAmount: "100",
    },
    wallet: {
      enabled: true,
      maxBalance: "10000",
      minTopup: "100",
      maxTopup: "5000",
    },
  });

  const handleSave = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    toast({ title: "Success", description: "Payment gateway settings saved!" });
  };

  const toggleShowKey = (key: string) => {
    setShowKeys(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const maskValue = (value: string) => {
    if (value.length <= 8) return "••••••••";
    return value.slice(0, 4) + "••••••••" + value.slice(-4);
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Payment Gateway Settings</h1>
          <p className="text-slate-500 mt-1">Configure payment gateways and options.</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Razorpay</p>
              <Badge className={gateways.razorpay.enabled ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}>
                {gateways.razorpay.enabled ? "Active" : "Inactive"}
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50 border-emerald-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Cash on Delivery</p>
              <Badge className={gateways.cod.enabled ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}>
                {gateways.cod.enabled ? "Active" : "Inactive"}
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 border-purple-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Wallet</p>
              <Badge className={gateways.wallet.enabled ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}>
                {gateways.wallet.enabled ? "Active" : "Inactive"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="border-slate-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              Razorpay Configuration
            </CardTitle>
            <div className="flex items-center gap-3">
              {gateways.razorpay.testMode && (
                <Badge className="bg-amber-100 text-amber-700">Test Mode</Badge>
              )}
              <Switch 
                checked={gateways.razorpay.enabled} 
                onCheckedChange={(v) => setGateways({ ...gateways, razorpay: { ...gateways.razorpay, enabled: v }})}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium">Test Mode</p>
                <p className="text-sm text-slate-500">Use test credentials for development</p>
              </div>
              <Switch 
                checked={gateways.razorpay.testMode} 
                onCheckedChange={(v) => setGateways({ ...gateways, razorpay: { ...gateways.razorpay, testMode: v }})}
              />
            </div>
            <div className="space-y-2">
              <Label>Key ID</Label>
              <div className="relative">
                <Input 
                  type={showKeys.keyId ? "text" : "password"}
                  value={gateways.razorpay.keyId} 
                  onChange={(e) => setGateways({ ...gateways, razorpay: { ...gateways.razorpay, keyId: e.target.value }})}
                />
                <button 
                  type="button"
                  onClick={() => toggleShowKey('keyId')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showKeys.keyId ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Key Secret</Label>
              <div className="relative">
                <Input 
                  type={showKeys.keySecret ? "text" : "password"}
                  value={gateways.razorpay.keySecret} 
                  onChange={(e) => setGateways({ ...gateways, razorpay: { ...gateways.razorpay, keySecret: e.target.value }})}
                />
                <button 
                  type="button"
                  onClick={() => toggleShowKey('keySecret')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showKeys.keySecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Webhook Secret</Label>
              <div className="relative">
                <Input 
                  type={showKeys.webhookSecret ? "text" : "password"}
                  value={gateways.razorpay.webhookSecret} 
                  onChange={(e) => setGateways({ ...gateways, razorpay: { ...gateways.razorpay, webhookSecret: e.target.value }})}
                />
                <button 
                  type="button"
                  onClick={() => toggleShowKey('webhookSecret')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showKeys.webhookSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-emerald-600" />
              Cash on Delivery (COD)
            </CardTitle>
            <Switch 
              checked={gateways.cod.enabled} 
              onCheckedChange={(v) => setGateways({ ...gateways, cod: { ...gateways.cod, enabled: v }})}
            />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Minimum Order Amount (₹)</Label>
                <Input 
                  type="number"
                  value={gateways.cod.minAmount} 
                  onChange={(e) => setGateways({ ...gateways, cod: { ...gateways.cod, minAmount: e.target.value }})}
                />
              </div>
              <div className="space-y-2">
                <Label>Maximum Order Amount (₹)</Label>
                <Input 
                  type="number"
                  value={gateways.cod.maxAmount} 
                  onChange={(e) => setGateways({ ...gateways, cod: { ...gateways.cod, maxAmount: e.target.value }})}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-purple-600" />
              Wallet Settings
            </CardTitle>
            <Switch 
              checked={gateways.wallet.enabled} 
              onCheckedChange={(v) => setGateways({ ...gateways, wallet: { ...gateways.wallet, enabled: v }})}
            />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Max Balance (₹)</Label>
                <Input 
                  type="number"
                  value={gateways.wallet.maxBalance} 
                  onChange={(e) => setGateways({ ...gateways, wallet: { ...gateways.wallet, maxBalance: e.target.value }})}
                />
              </div>
              <div className="space-y-2">
                <Label>Min Top-up (₹)</Label>
                <Input 
                  type="number"
                  value={gateways.wallet.minTopup} 
                  onChange={(e) => setGateways({ ...gateways, wallet: { ...gateways.wallet, minTopup: e.target.value }})}
                />
              </div>
              <div className="space-y-2">
                <Label>Max Top-up (₹)</Label>
                <Input 
                  type="number"
                  value={gateways.wallet.maxTopup} 
                  onChange={(e) => setGateways({ ...gateways, wallet: { ...gateways.wallet, maxTopup: e.target.value }})}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
