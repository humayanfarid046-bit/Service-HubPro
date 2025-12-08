import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  MessageSquare, Save, Loader2, Eye, EyeOff, Send, CheckCircle
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminSMSGatewaySettings() {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [testPhone, setTestPhone] = useState("");
  
  const [settings, setSettings] = useState({
    provider: "2factor",
    enabled: true,
    apiKey: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    senderId: "SVCHUB",
    otpTemplate: "Your OTP for ServiceHub Pro is {otp}. Valid for 5 minutes.",
    bookingTemplate: "Your booking #{booking_id} has been confirmed for {date} at {time}.",
    reminderTemplate: "Reminder: Your service is scheduled for tomorrow at {time}.",
    otpExpiry: "5",
    otpLength: "6",
  });

  const handleSave = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    toast({ title: "Success", description: "SMS gateway settings saved!" });
  };

  const handleTestSMS = async () => {
    if (!testPhone) {
      toast({ title: "Error", description: "Please enter a phone number", variant: "destructive" });
      return;
    }
    setTesting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setTesting(false);
    toast({ title: "Success", description: `Test SMS sent to ${testPhone}` });
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">SMS Gateway Settings</h1>
          <p className="text-slate-500 mt-1">Configure SMS provider and templates.</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-slate-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              Provider Configuration
            </CardTitle>
            <Badge className={settings.enabled ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}>
              {settings.enabled ? "Active" : "Inactive"}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium">Enable SMS</p>
                <p className="text-sm text-slate-500">Send SMS notifications to users</p>
              </div>
              <Switch 
                checked={settings.enabled} 
                onCheckedChange={(v) => setSettings({ ...settings, enabled: v })}
              />
            </div>
            <div className="space-y-2">
              <Label>SMS Provider</Label>
              <Select value={settings.provider} onValueChange={(v) => setSettings({ ...settings, provider: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="2factor">2Factor</SelectItem>
                  <SelectItem value="msg91">MSG91</SelectItem>
                  <SelectItem value="twilio">Twilio</SelectItem>
                  <SelectItem value="textlocal">TextLocal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>API Key</Label>
              <div className="relative">
                <Input 
                  type={showKey ? "text" : "password"}
                  value={settings.apiKey} 
                  onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                />
                <button 
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Sender ID</Label>
              <Input 
                value={settings.senderId} 
                onChange={(e) => setSettings({ ...settings, senderId: e.target.value })}
                maxLength={6}
              />
              <p className="text-xs text-slate-500">Max 6 characters</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="w-5 h-5 text-emerald-600" />
              Test SMS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input 
                placeholder="+91 98765 43210"
                value={testPhone} 
                onChange={(e) => setTestPhone(e.target.value)}
              />
            </div>
            <Button onClick={handleTestSMS} disabled={testing} className="w-full gap-2">
              {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Send Test SMS
            </Button>
            <div className="p-4 bg-slate-50 rounded-lg">
              <h4 className="font-medium mb-2">OTP Configuration</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>OTP Length</Label>
                  <Select value={settings.otpLength} onValueChange={(v) => setSettings({ ...settings, otpLength: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4">4 Digits</SelectItem>
                      <SelectItem value="6">6 Digits</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Expiry (minutes)</Label>
                  <Select value={settings.otpExpiry} onValueChange={(v) => setSettings({ ...settings, otpExpiry: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 Minutes</SelectItem>
                      <SelectItem value="5">5 Minutes</SelectItem>
                      <SelectItem value="10">10 Minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-purple-600" />
              SMS Templates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>OTP Template</Label>
              <Textarea 
                value={settings.otpTemplate} 
                onChange={(e) => setSettings({ ...settings, otpTemplate: e.target.value })}
                rows={2}
              />
              <p className="text-xs text-slate-500">Variables: {"{otp}"}</p>
            </div>
            <div className="space-y-2">
              <Label>Booking Confirmation Template</Label>
              <Textarea 
                value={settings.bookingTemplate} 
                onChange={(e) => setSettings({ ...settings, bookingTemplate: e.target.value })}
                rows={2}
              />
              <p className="text-xs text-slate-500">Variables: {"{booking_id}"}, {"{date}"}, {"{time}"}</p>
            </div>
            <div className="space-y-2">
              <Label>Reminder Template</Label>
              <Textarea 
                value={settings.reminderTemplate} 
                onChange={(e) => setSettings({ ...settings, reminderTemplate: e.target.value })}
                rows={2}
              />
              <p className="text-xs text-slate-500">Variables: {"{time}"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
