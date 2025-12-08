import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Save, Loader2, Percent, IndianRupee, Settings2, Bell, CreditCard, Info } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface PlatformSetting {
  id: number;
  key: string;
  value: string;
  description: string | null;
  updatedAt: string;
}

export default function AdminSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [commission, setCommission] = useState(10);
  const [minBookingAmount, setMinBookingAmount] = useState(99);
  const [appName, setAppName] = useState("ServiceHub Pro");
  const [supportEmail, setSupportEmail] = useState("support@servicehub.com");
  const [supportPhone, setSupportPhone] = useState("");
  const [enableCOD, setEnableCOD] = useState(true);
  const [enableRazorpay, setEnableRazorpay] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  
  const { data: settings = [], isLoading } = useQuery<PlatformSetting[]>({
    queryKey: ["/api/settings"],
    queryFn: async () => {
      const res = await fetch("/api/settings");
      if (!res.ok) throw new Error("Failed to fetch settings");
      return res.json();
    },
  });
  
  useEffect(() => {
    if (settings.length > 0) {
      settings.forEach((s) => {
        switch (s.key) {
          case "commission_rate":
            setCommission(parseFloat(s.value) || 10);
            break;
          case "min_booking_amount":
            setMinBookingAmount(parseFloat(s.value) || 99);
            break;
          case "app_name":
            setAppName(s.value || "ServiceHub Pro");
            break;
          case "support_email":
            setSupportEmail(s.value || "");
            break;
          case "support_phone":
            setSupportPhone(s.value || "");
            break;
          case "enable_cod":
            setEnableCOD(s.value === "true");
            break;
          case "enable_razorpay":
            setEnableRazorpay(s.value === "true");
            break;
          case "maintenance_mode":
            setMaintenanceMode(s.value === "true");
            break;
        }
      });
    }
  }, [settings]);
  
  const saveMutation = useMutation({
    mutationFn: async () => {
      const settingsToSave = [
        { key: "commission_rate", value: String(commission), description: "Platform commission percentage" },
        { key: "min_booking_amount", value: String(minBookingAmount), description: "Minimum booking amount" },
        { key: "app_name", value: appName, description: "Application name" },
        { key: "support_email", value: supportEmail, description: "Support email address" },
        { key: "support_phone", value: supportPhone, description: "Support phone number" },
        { key: "enable_cod", value: String(enableCOD), description: "Cash on Delivery enabled" },
        { key: "enable_razorpay", value: String(enableRazorpay), description: "Razorpay enabled" },
        { key: "maintenance_mode", value: String(maintenanceMode), description: "Maintenance mode" },
      ];
      
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: settingsToSave }),
      });
      if (!res.ok) throw new Error("Failed to save settings");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({ title: "Saved!", description: "Settings updated successfully." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Platform Settings</h1>
          <p className="text-slate-500 mt-1">Configure commission, payments, and app preferences.</p>
        </div>
        <Button 
          onClick={() => saveMutation.mutate()} 
          disabled={saveMutation.isPending}
          className="bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/25"
          data-testid="button-save-settings"
        >
          {saveMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save All Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-slate-100 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Percent className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg">Commission Settings</CardTitle>
                <CardDescription>Set your platform commission rate</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Commission Rate</Label>
                <span className="text-2xl font-bold text-blue-600">{commission}%</span>
              </div>
              <Slider
                value={[commission]}
                onValueChange={(v) => setCommission(v[0])}
                min={0}
                max={50}
                step={1}
                className="w-full"
                data-testid="slider-commission"
              />
              <div className="flex justify-between text-xs text-slate-400">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                  <p className="text-sm text-blue-700">
                    এই কমিশন প্রতিটি booking থেকে কাটা হবে। যেমন: ₹1000 এর booking এ আপনি পাবেন ₹{(1000 * commission / 100).toFixed(0)}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2 pt-4 border-t">
              <Label htmlFor="minBooking">Minimum Booking Amount (₹)</Label>
              <Input
                id="minBooking"
                type="number"
                value={minBookingAmount}
                onChange={(e) => setMinBookingAmount(parseFloat(e.target.value) || 0)}
                className="bg-slate-50"
                data-testid="input-min-booking"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg">Payment Methods</CardTitle>
                <CardDescription>Configure payment options</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <IndianRupee className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Cash on Delivery</p>
                  <p className="text-xs text-slate-500">Pay when service is complete</p>
                </div>
              </div>
              <Switch 
                checked={enableCOD} 
                onCheckedChange={setEnableCOD}
                data-testid="switch-cod"
              />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900">Razorpay</p>
                  <p className="text-xs text-slate-500">Online payments (UPI, Card, NetBanking)</p>
                </div>
              </div>
              <Switch 
                checked={enableRazorpay} 
                onCheckedChange={setEnableRazorpay}
                data-testid="switch-razorpay"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                <Settings2 className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg">General Settings</CardTitle>
                <CardDescription>App name and contact info</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="appName">App Name</Label>
              <Input
                id="appName"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                className="bg-slate-50"
                data-testid="input-app-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supportEmail">Support Email</Label>
              <Input
                id="supportEmail"
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="bg-slate-50"
                data-testid="input-support-email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supportPhone">Support Phone</Label>
              <Input
                id="supportPhone"
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                placeholder="+91 9876543210"
                className="bg-slate-50"
                data-testid="input-support-phone"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg">System Controls</CardTitle>
                <CardDescription>Maintenance and alerts</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className={cn(
              "flex items-center justify-between p-4 rounded-xl border-2 transition-colors",
              maintenanceMode ? "bg-red-50 border-red-200" : "bg-slate-50 border-transparent"
            )}>
              <div>
                <p className="font-medium text-slate-900">Maintenance Mode</p>
                <p className="text-xs text-slate-500">Disable app for users during updates</p>
              </div>
              <Switch 
                checked={maintenanceMode} 
                onCheckedChange={setMaintenanceMode}
                data-testid="switch-maintenance"
              />
            </div>
            
            {maintenanceMode && (
              <div className="p-3 bg-red-100 rounded-lg border border-red-200">
                <p className="text-sm text-red-700 font-medium">
                  ⚠️ Maintenance mode is ON. Customers cannot access the app.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
