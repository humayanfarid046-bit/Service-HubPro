import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Mail, Save, Loader2, Eye, EyeOff, Send, Server
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

export default function AdminEmailSMTPSettings() {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  
  const [settings, setSettings] = useState({
    enabled: true,
    host: "smtp.gmail.com",
    port: "587",
    encryption: "tls",
    username: "noreply@servicehub.com",
    password: "xxxxxxxxxxxx",
    fromName: "ServiceHub Pro",
    fromEmail: "noreply@servicehub.com",
    replyTo: "support@servicehub.com",
  });

  const handleSave = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    toast({ title: "Success", description: "Email SMTP settings saved!" });
  };

  const handleTestEmail = async () => {
    if (!testEmail) {
      toast({ title: "Error", description: "Please enter an email address", variant: "destructive" });
      return;
    }
    setTesting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setTesting(false);
    toast({ title: "Success", description: `Test email sent to ${testEmail}` });
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Email SMTP Settings</h1>
          <p className="text-slate-500 mt-1">Configure email server and sending options.</p>
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
              <Server className="w-5 h-5 text-blue-600" />
              SMTP Server Configuration
            </CardTitle>
            <Badge className={settings.enabled ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}>
              {settings.enabled ? "Active" : "Inactive"}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium">Enable Email</p>
                <p className="text-sm text-slate-500">Send email notifications to users</p>
              </div>
              <Switch 
                checked={settings.enabled} 
                onCheckedChange={(v) => setSettings({ ...settings, enabled: v })}
              />
            </div>
            <div className="space-y-2">
              <Label>SMTP Host</Label>
              <Input 
                value={settings.host} 
                onChange={(e) => setSettings({ ...settings, host: e.target.value })}
                placeholder="smtp.example.com"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Port</Label>
                <Input 
                  value={settings.port} 
                  onChange={(e) => setSettings({ ...settings, port: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Encryption</Label>
                <Select value={settings.encryption} onValueChange={(v) => setSettings({ ...settings, encryption: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="tls">TLS</SelectItem>
                    <SelectItem value="ssl">SSL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Username</Label>
              <Input 
                value={settings.username} 
                onChange={(e) => setSettings({ ...settings, username: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <div className="relative">
                <Input 
                  type={showPassword ? "text" : "password"}
                  value={settings.password} 
                  onChange={(e) => setSettings({ ...settings, password: e.target.value })}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-slate-100 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-purple-600" />
                Sender Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>From Name</Label>
                <Input 
                  value={settings.fromName} 
                  onChange={(e) => setSettings({ ...settings, fromName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>From Email</Label>
                <Input 
                  type="email"
                  value={settings.fromEmail} 
                  onChange={(e) => setSettings({ ...settings, fromEmail: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Reply-To Email</Label>
                <Input 
                  type="email"
                  value={settings.replyTo} 
                  onChange={(e) => setSettings({ ...settings, replyTo: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-100 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="w-5 h-5 text-emerald-600" />
                Test Email
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Recipient Email</Label>
                <Input 
                  type="email"
                  placeholder="test@example.com"
                  value={testEmail} 
                  onChange={(e) => setTestEmail(e.target.value)}
                />
              </div>
              <Button onClick={handleTestEmail} disabled={testing} className="w-full gap-2">
                {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Send Test Email
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
