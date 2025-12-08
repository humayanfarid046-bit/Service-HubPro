import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ShieldAlert, Save, Loader2, AlertTriangle, Eye, Ban, CheckCircle,
  Activity, Users, CreditCard, MapPin, Clock, Flag, XCircle
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FraudAlert {
  id: number;
  type: string;
  user: string;
  description: string;
  riskScore: number;
  timestamp: string;
  status: string;
}

const mockAlerts: FraudAlert[] = [
  { id: 1, type: "Multiple Accounts", user: "User #1234", description: "Same device used for 5 accounts", riskScore: 85, timestamp: "10 mins ago", status: "pending" },
  { id: 2, type: "Payment Fraud", user: "User #5678", description: "Multiple failed payment attempts", riskScore: 72, timestamp: "25 mins ago", status: "investigating" },
  { id: 3, type: "Fake Booking", user: "User #9012", description: "Repeated cancellations after worker arrival", riskScore: 68, timestamp: "1 hour ago", status: "resolved" },
  { id: 4, type: "Location Spoofing", user: "Worker #3456", description: "GPS location doesn't match device location", riskScore: 90, timestamp: "2 hours ago", status: "pending" },
];

export default function AdminFraudDetection() {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [alerts, setAlerts] = useState<FraudAlert[]>(mockAlerts);
  
  const [settings, setSettings] = useState({
    enabled: true,
    autoBlock: false,
    riskThreshold: 75,
    rules: {
      multipleAccounts: true,
      locationSpoofing: true,
      paymentFraud: true,
      fakeBookings: true,
      abnormalBehavior: true,
      velocityCheck: true,
    },
    maxFailedPayments: 5,
    maxCancellations: 3,
    deviceFingerprintCheck: true,
    ipBlacklist: true,
    notifyAdmin: true,
  });

  const [stats] = useState({
    totalAlerts: 156,
    blockedUsers: 23,
    fraudPrevented: 45000,
    falsePositives: 12,
  });

  const handleSave = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    toast({ title: "Success", description: "Fraud detection settings saved!" });
  };

  const handleAlertAction = (id: number, action: string) => {
    setAlerts(alerts.map(a => {
      if (a.id === id) {
        return { ...a, status: action === 'block' ? 'blocked' : action === 'dismiss' ? 'dismissed' : 'investigating' };
      }
      return a;
    }));
    toast({ title: "Success", description: `Alert ${action}ed successfully!` });
  };

  const getRiskBadge = (score: number) => {
    if (score >= 80) return { color: "bg-red-100 text-red-700", label: "High Risk" };
    if (score >= 60) return { color: "bg-amber-100 text-amber-700", label: "Medium Risk" };
    return { color: "bg-emerald-100 text-emerald-700", label: "Low Risk" };
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending": return "bg-amber-100 text-amber-700";
      case "investigating": return "bg-blue-100 text-blue-700";
      case "resolved": return "bg-emerald-100 text-emerald-700";
      case "blocked": return "bg-red-100 text-red-700";
      case "dismissed": return "bg-slate-100 text-slate-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Fraud Detection</h1>
          <p className="text-slate-500 mt-1">Monitor and prevent fraudulent activities on the platform.</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Settings
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <Card className="bg-red-50 border-red-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-red-100 text-red-600 rounded-xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Total Alerts</p>
              <p className="text-xl font-bold text-slate-900">{stats.totalAlerts}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 border-amber-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 text-amber-600 rounded-xl">
              <Ban className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Blocked Users</p>
              <p className="text-xl font-bold text-slate-900">{stats.blockedUsers}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50 border-emerald-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Fraud Prevented</p>
              <p className="text-xl font-bold text-slate-900">₹{stats.fraudPrevented.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">False Positives</p>
              <p className="text-xl font-bold text-slate-900">{stats.falsePositives}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="border-slate-100 shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Recent Fraud Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert) => {
                const riskBadge = getRiskBadge(alert.riskScore);
                return (
                  <div 
                    key={alert.id}
                    className="p-4 bg-slate-50 rounded-lg border border-slate-100"
                    data-testid={`row-alert-${alert.id}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-lg">
                          <Flag className="w-4 h-4 text-red-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{alert.type}</p>
                          <p className="text-sm text-slate-500">{alert.user}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={riskBadge.color}>{alert.riskScore}%</Badge>
                        <Badge className={getStatusBadge(alert.status)}>{alert.status}</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">{alert.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {alert.timestamp}
                      </span>
                      {alert.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleAlertAction(alert.id, 'investigate')}>
                            <Eye className="w-3 h-3 mr-1" /> Investigate
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleAlertAction(alert.id, 'block')}>
                            <Ban className="w-3 h-3 mr-1" /> Block
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleAlertAction(alert.id, 'dismiss')}>
                            <XCircle className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-blue-600" />
              Detection Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium text-sm">Enable Detection</p>
                <p className="text-xs text-slate-500">AI fraud monitoring</p>
              </div>
              <Switch 
                checked={settings.enabled} 
                onCheckedChange={(v) => setSettings({ ...settings, enabled: v })}
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium text-sm">Auto Block</p>
                <p className="text-xs text-slate-500">Block high-risk users automatically</p>
              </div>
              <Switch 
                checked={settings.autoBlock} 
                onCheckedChange={(v) => setSettings({ ...settings, autoBlock: v })}
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Risk Threshold</Label>
                <span className="text-sm font-medium">{settings.riskThreshold}%</span>
              </div>
              <Slider 
                value={[settings.riskThreshold]} 
                onValueChange={([v]) => setSettings({ ...settings, riskThreshold: v })}
                max={100}
                min={50}
                step={5}
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium text-sm">Notify Admin</p>
                <p className="text-xs text-slate-500">Send alerts to admins</p>
              </div>
              <Switch 
                checked={settings.notifyAdmin} 
                onCheckedChange={(v) => setSettings({ ...settings, notifyAdmin: v })}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-100 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-600" />
            Detection Rules
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-sm">Multiple Accounts</p>
                  <p className="text-xs text-slate-500">Same device/IP detection</p>
                </div>
              </div>
              <Switch 
                checked={settings.rules.multipleAccounts} 
                onCheckedChange={(v) => setSettings({ ...settings, rules: { ...settings.rules, multipleAccounts: v }})}
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="font-medium text-sm">Location Spoofing</p>
                  <p className="text-xs text-slate-500">Fake GPS detection</p>
                </div>
              </div>
              <Switch 
                checked={settings.rules.locationSpoofing} 
                onCheckedChange={(v) => setSettings({ ...settings, rules: { ...settings.rules, locationSpoofing: v }})}
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-amber-600" />
                <div>
                  <p className="font-medium text-sm">Payment Fraud</p>
                  <p className="text-xs text-slate-500">Failed payment patterns</p>
                </div>
              </div>
              <Switch 
                checked={settings.rules.paymentFraud} 
                onCheckedChange={(v) => setSettings({ ...settings, rules: { ...settings.rules, paymentFraud: v }})}
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Flag className="w-5 h-5 text-red-600" />
                <div>
                  <p className="font-medium text-sm">Fake Bookings</p>
                  <p className="text-xs text-slate-500">Cancellation patterns</p>
                </div>
              </div>
              <Switch 
                checked={settings.rules.fakeBookings} 
                onCheckedChange={(v) => setSettings({ ...settings, rules: { ...settings.rules, fakeBookings: v }})}
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-medium text-sm">Abnormal Behavior</p>
                  <p className="text-xs text-slate-500">Unusual activity patterns</p>
                </div>
              </div>
              <Switch 
                checked={settings.rules.abnormalBehavior} 
                onCheckedChange={(v) => setSettings({ ...settings, rules: { ...settings.rules, abnormalBehavior: v }})}
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-slate-600" />
                <div>
                  <p className="font-medium text-sm">Velocity Check</p>
                  <p className="text-xs text-slate-500">Too many actions per time</p>
                </div>
              </div>
              <Switch 
                checked={settings.rules.velocityCheck} 
                onCheckedChange={(v) => setSettings({ ...settings, rules: { ...settings.rules, velocityCheck: v }})}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
