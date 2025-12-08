import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Settings, Save, Loader2, Globe, Smartphone, Clock, MapPin
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminAppSettings() {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    appName: "ServiceHub Pro",
    appTagline: "Your Trusted Home Service Partner",
    supportEmail: "support@servicehub.com",
    supportPhone: "+91 98765 43210",
    defaultLanguage: "en",
    defaultCurrency: "INR",
    currencySymbol: "₹",
    timezone: "Asia/Kolkata",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "12h",
    maintenanceMode: false,
    maintenanceMessage: "We are currently under maintenance. Please check back soon.",
    minAppVersion: "1.0.0",
    forceUpdate: false,
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.servicehub.pro",
    appStoreUrl: "",
    defaultCity: "Kolkata",
    serviceRadius: "50",
    maxBookingsPerDay: "10",
    bookingAdvanceDays: "30",
    cancellationHours: "24",
    platformFeePercent: "15",
  });

  const handleSave = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    toast({ title: "Success", description: "App settings saved!" });
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">App Settings</h1>
          <p className="text-slate-500 mt-1">Configure general application settings.</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-slate-100 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-600" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>App Name</Label>
              <Input value={settings.appName} onChange={(e) => setSettings({ ...settings, appName: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Tagline</Label>
              <Input value={settings.appTagline} onChange={(e) => setSettings({ ...settings, appTagline: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Support Email</Label>
              <Input type="email" value={settings.supportEmail} onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Support Phone</Label>
              <Input value={settings.supportPhone} onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-emerald-600" />
              Localization
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Default Language</Label>
                <Select value={settings.defaultLanguage} onValueChange={(v) => setSettings({ ...settings, defaultLanguage: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">Hindi</SelectItem>
                    <SelectItem value="bn">Bengali</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Currency</Label>
                <Select value={settings.defaultCurrency} onValueChange={(v) => setSettings({ ...settings, defaultCurrency: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INR">INR (₹)</SelectItem>
                    <SelectItem value="USD">USD ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Timezone</Label>
              <Select value={settings.timezone} onValueChange={(v) => setSettings({ ...settings, timezone: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                  <SelectItem value="UTC">UTC</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date Format</Label>
                <Select value={settings.dateFormat} onValueChange={(v) => setSettings({ ...settings, dateFormat: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Time Format</Label>
                <Select value={settings.timeFormat} onValueChange={(v) => setSettings({ ...settings, timeFormat: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12h">12 Hour</SelectItem>
                    <SelectItem value="24h">24 Hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-purple-600" />
              App Version & Stores
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Minimum App Version</Label>
                <Input value={settings.minAppVersion} onChange={(e) => setSettings({ ...settings, minAppVersion: e.target.value })} />
              </div>
              <div className="flex items-center gap-3 pt-6">
                <Switch checked={settings.forceUpdate} onCheckedChange={(v) => setSettings({ ...settings, forceUpdate: v })} />
                <Label>Force Update</Label>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Play Store URL</Label>
              <Input value={settings.playStoreUrl} onChange={(e) => setSettings({ ...settings, playStoreUrl: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>App Store URL</Label>
              <Input value={settings.appStoreUrl} onChange={(e) => setSettings({ ...settings, appStoreUrl: e.target.value })} placeholder="iOS app URL (if applicable)" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-600" />
              Service Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Default City</Label>
                <Input value={settings.defaultCity} onChange={(e) => setSettings({ ...settings, defaultCity: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Service Radius (km)</Label>
                <Input type="number" value={settings.serviceRadius} onChange={(e) => setSettings({ ...settings, serviceRadius: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Max Bookings/Day</Label>
                <Input type="number" value={settings.maxBookingsPerDay} onChange={(e) => setSettings({ ...settings, maxBookingsPerDay: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Advance Booking (days)</Label>
                <Input type="number" value={settings.bookingAdvanceDays} onChange={(e) => setSettings({ ...settings, bookingAdvanceDays: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Cancellation Hours</Label>
                <Input type="number" value={settings.cancellationHours} onChange={(e) => setSettings({ ...settings, cancellationHours: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Platform Fee (%)</Label>
                <Input type="number" value={settings.platformFeePercent} onChange={(e) => setSettings({ ...settings, platformFeePercent: e.target.value })} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-red-600" />
              Maintenance Mode
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium">Enable Maintenance Mode</p>
                <p className="text-sm text-slate-500">When enabled, users will see a maintenance message</p>
              </div>
              <Switch checked={settings.maintenanceMode} onCheckedChange={(v) => setSettings({ ...settings, maintenanceMode: v })} />
            </div>
            <div className="space-y-2">
              <Label>Maintenance Message</Label>
              <Textarea value={settings.maintenanceMessage} onChange={(e) => setSettings({ ...settings, maintenanceMessage: e.target.value })} rows={2} />
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
