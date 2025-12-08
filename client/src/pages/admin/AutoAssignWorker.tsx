import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Users, Save, Loader2, Zap, MapPin, Star, Clock, Settings, 
  CheckCircle, XCircle, RefreshCw, TrendingUp
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

export default function AdminAutoAssignWorker() {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  
  const [settings, setSettings] = useState({
    enabled: true,
    algorithm: "smart",
    maxRadius: 15,
    priorityFactors: {
      distance: 40,
      rating: 30,
      availability: 20,
      experience: 10,
    },
    minRating: 3.5,
    maxActiveJobs: 3,
    waitTimeSeconds: 30,
    fallbackToManual: true,
    notifyWorker: true,
    autoConfirmTimeout: 60,
  });

  const [stats] = useState({
    totalAutoAssigned: 1245,
    successRate: 89.5,
    avgAssignTime: 12,
    todayAssigned: 45,
  });

  const handleSave = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    toast({ title: "Success", description: "Auto-assign settings saved!" });
  };

  const updatePriority = (factor: string, value: number) => {
    const total = Object.values(settings.priorityFactors).reduce((a, b) => a + b, 0);
    const oldValue = settings.priorityFactors[factor as keyof typeof settings.priorityFactors];
    const diff = value - oldValue;
    
    setSettings({
      ...settings,
      priorityFactors: {
        ...settings.priorityFactors,
        [factor]: value,
      },
    });
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Auto Assign Worker</h1>
          <p className="text-slate-500 mt-1">Configure automatic worker assignment for bookings.</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Settings
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Total Auto-Assigned</p>
              <p className="text-xl font-bold text-slate-900">{stats.totalAutoAssigned}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50 border-emerald-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Success Rate</p>
              <p className="text-xl font-bold text-slate-900">{stats.successRate}%</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 border-amber-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 text-amber-600 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Avg Assign Time</p>
              <p className="text-xl font-bold text-slate-900">{stats.avgAssignTime}s</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 border-purple-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Today</p>
              <p className="text-xl font-bold text-slate-900">{stats.todayAssigned}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-slate-100 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-600" />
              Auto-Assignment Engine
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium">Enable Auto-Assign</p>
                <p className="text-sm text-slate-500">Automatically assign workers to new bookings</p>
              </div>
              <Switch 
                checked={settings.enabled} 
                onCheckedChange={(v) => setSettings({ ...settings, enabled: v })}
              />
            </div>
            <div className="space-y-2">
              <Label>Assignment Algorithm</Label>
              <Select value={settings.algorithm} onValueChange={(v) => setSettings({ ...settings, algorithm: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="smart">Smart (AI-based)</SelectItem>
                  <SelectItem value="nearest">Nearest First</SelectItem>
                  <SelectItem value="rating">Highest Rating First</SelectItem>
                  <SelectItem value="roundrobin">Round Robin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Maximum Search Radius</Label>
                <span className="text-sm font-medium">{settings.maxRadius} km</span>
              </div>
              <Slider 
                value={[settings.maxRadius]} 
                onValueChange={([v]) => setSettings({ ...settings, maxRadius: v })}
                max={50}
                min={1}
                step={1}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Wait Time (seconds)</Label>
                <Input 
                  type="number"
                  value={settings.waitTimeSeconds} 
                  onChange={(e) => setSettings({ ...settings, waitTimeSeconds: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Auto-Confirm Timeout (sec)</Label>
                <Input 
                  type="number"
                  value={settings.autoConfirmTimeout} 
                  onChange={(e) => setSettings({ ...settings, autoConfirmTimeout: parseInt(e.target.value) })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-600" />
              Priority Factors
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm text-slate-500">Adjust the weight of each factor in worker selection</p>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-500" /> Distance
                  </Label>
                  <span className="text-sm font-medium">{settings.priorityFactors.distance}%</span>
                </div>
                <Slider 
                  value={[settings.priorityFactors.distance]} 
                  onValueChange={([v]) => updatePriority('distance', v)}
                  max={100}
                  min={0}
                  step={5}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-500" /> Rating
                  </Label>
                  <span className="text-sm font-medium">{settings.priorityFactors.rating}%</span>
                </div>
                <Slider 
                  value={[settings.priorityFactors.rating]} 
                  onValueChange={([v]) => updatePriority('rating', v)}
                  max={100}
                  min={0}
                  step={5}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-500" /> Availability
                  </Label>
                  <span className="text-sm font-medium">{settings.priorityFactors.availability}%</span>
                </div>
                <Slider 
                  value={[settings.priorityFactors.availability]} 
                  onValueChange={([v]) => updatePriority('availability', v)}
                  max={100}
                  min={0}
                  step={5}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-purple-500" /> Experience
                  </Label>
                  <span className="text-sm font-medium">{settings.priorityFactors.experience}%</span>
                </div>
                <Slider 
                  value={[settings.priorityFactors.experience]} 
                  onValueChange={([v]) => updatePriority('experience', v)}
                  max={100}
                  min={0}
                  step={5}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              Worker Eligibility
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Minimum Rating Required</Label>
                <span className="text-sm font-medium">{settings.minRating} stars</span>
              </div>
              <Slider 
                value={[settings.minRating]} 
                onValueChange={([v]) => setSettings({ ...settings, minRating: v })}
                max={5}
                min={1}
                step={0.5}
              />
            </div>
            <div className="space-y-2">
              <Label>Max Active Jobs Per Worker</Label>
              <Select value={settings.maxActiveJobs.toString()} onValueChange={(v) => setSettings({ ...settings, maxActiveJobs: parseInt(v) })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Job</SelectItem>
                  <SelectItem value="2">2 Jobs</SelectItem>
                  <SelectItem value="3">3 Jobs</SelectItem>
                  <SelectItem value="5">5 Jobs</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-emerald-600" />
              Fallback & Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium text-sm">Fallback to Manual</p>
                <p className="text-xs text-slate-500">Allow manual assignment if auto fails</p>
              </div>
              <Switch 
                checked={settings.fallbackToManual} 
                onCheckedChange={(v) => setSettings({ ...settings, fallbackToManual: v })}
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium text-sm">Notify Worker</p>
                <p className="text-xs text-slate-500">Send push notification on assignment</p>
              </div>
              <Switch 
                checked={settings.notifyWorker} 
                onCheckedChange={(v) => setSettings({ ...settings, notifyWorker: v })}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
