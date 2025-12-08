import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  DollarSign, Save, Loader2, TrendingUp, TrendingDown, Calculator,
  Clock, MapPin, Calendar, Zap, BarChart3, Settings
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
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";

export default function AdminAutoPriceSuggestion() {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  
  const [settings, setSettings] = useState({
    enabled: true,
    dynamicPricing: true,
    surgeMultiplierMax: 2.0,
    peakHourSurge: 1.3,
    weekendSurge: 1.2,
    holidaySurge: 1.5,
    distanceBasedPricing: true,
    baseDistanceKm: 5,
    perKmCharge: 10,
    demandBasedPricing: true,
    lowDemandDiscount: 10,
    highDemandSurge: 20,
    minPrice: 99,
    maxPriceMultiplier: 3,
  });

  const [stats] = useState({
    avgPriceSuggested: 850,
    acceptanceRate: 78.5,
    revenueIncrease: 15.2,
    pricesAdjusted: 3456,
  });

  const priceTrend = [
    { time: '6 AM', price: 100 },
    { time: '9 AM', price: 130 },
    { time: '12 PM', price: 120 },
    { time: '3 PM', price: 110 },
    { time: '6 PM', price: 150 },
    { time: '9 PM', price: 140 },
    { time: '12 AM', price: 100 },
  ];

  const handleSave = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    toast({ title: "Success", description: "Pricing settings saved!" });
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Auto Price Suggestion</h1>
          <p className="text-slate-500 mt-1">Configure AI-powered dynamic pricing for services.</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Settings
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <Card className="bg-emerald-50 border-emerald-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Avg Price Suggested</p>
              <p className="text-xl font-bold text-slate-900">₹{stats.avgPriceSuggested}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Acceptance Rate</p>
              <p className="text-xl font-bold text-slate-900">{stats.acceptanceRate}%</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 border-purple-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Revenue Increase</p>
              <p className="text-xl font-bold text-emerald-600">+{stats.revenueIncrease}%</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 border-amber-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 text-amber-600 rounded-xl">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Prices Adjusted</p>
              <p className="text-xl font-bold text-slate-900">{stats.pricesAdjusted}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-slate-100 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-600" />
              Dynamic Pricing Engine
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium">Enable Auto Price Suggestion</p>
                <p className="text-sm text-slate-500">AI will suggest optimal prices</p>
              </div>
              <Switch 
                checked={settings.enabled} 
                onCheckedChange={(v) => setSettings({ ...settings, enabled: v })}
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium">Dynamic Pricing</p>
                <p className="text-sm text-slate-500">Adjust prices based on demand</p>
              </div>
              <Switch 
                checked={settings.dynamicPricing} 
                onCheckedChange={(v) => setSettings({ ...settings, dynamicPricing: v })}
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Maximum Surge Multiplier</Label>
                <span className="text-sm font-medium">{settings.surgeMultiplierMax}x</span>
              </div>
              <Slider 
                value={[settings.surgeMultiplierMax]} 
                onValueChange={([v]) => setSettings({ ...settings, surgeMultiplierMax: v })}
                max={3}
                min={1}
                step={0.1}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Minimum Price (₹)</Label>
                <Input 
                  type="number"
                  value={settings.minPrice} 
                  onChange={(e) => setSettings({ ...settings, minPrice: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Max Price Multiplier</Label>
                <Input 
                  type="number"
                  value={settings.maxPriceMultiplier} 
                  onChange={(e) => setSettings({ ...settings, maxPriceMultiplier: parseFloat(e.target.value) })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Time-Based Pricing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={priceTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="time" stroke="#94A3B8" fontSize={10} />
                  <YAxis stroke="#94A3B8" fontSize={10} />
                  <Tooltip />
                  <Line type="monotone" dataKey="price" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-amber-50 rounded-lg text-center">
                <p className="text-xs text-slate-500">Peak Hour</p>
                <p className="text-lg font-bold text-amber-700">{settings.peakHourSurge}x</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg text-center">
                <p className="text-xs text-slate-500">Weekend</p>
                <p className="text-lg font-bold text-blue-700">{settings.weekendSurge}x</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg text-center">
                <p className="text-xs text-slate-500">Holiday</p>
                <p className="text-lg font-bold text-purple-700">{settings.holidaySurge}x</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-600" />
              Distance-Based Pricing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium text-sm">Enable Distance Pricing</p>
                <p className="text-xs text-slate-500">Charge extra for longer distances</p>
              </div>
              <Switch 
                checked={settings.distanceBasedPricing} 
                onCheckedChange={(v) => setSettings({ ...settings, distanceBasedPricing: v })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Base Distance (km)</Label>
                <Input 
                  type="number"
                  value={settings.baseDistanceKm} 
                  onChange={(e) => setSettings({ ...settings, baseDistanceKm: parseInt(e.target.value) })}
                />
                <p className="text-xs text-slate-500">No extra charge within this</p>
              </div>
              <div className="space-y-2">
                <Label>Per KM Charge (₹)</Label>
                <Input 
                  type="number"
                  value={settings.perKmCharge} 
                  onChange={(e) => setSettings({ ...settings, perKmCharge: parseInt(e.target.value) })}
                />
                <p className="text-xs text-slate-500">After base distance</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              Demand-Based Pricing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium text-sm">Enable Demand Pricing</p>
                <p className="text-xs text-slate-500">Adjust prices based on supply/demand</p>
              </div>
              <Switch 
                checked={settings.demandBasedPricing} 
                onCheckedChange={(v) => setSettings({ ...settings, demandBasedPricing: v })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-emerald-500" />
                  Low Demand Discount (%)
                </Label>
                <Input 
                  type="number"
                  value={settings.lowDemandDiscount} 
                  onChange={(e) => setSettings({ ...settings, lowDemandDiscount: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-red-500" />
                  High Demand Surge (%)
                </Label>
                <Input 
                  type="number"
                  value={settings.highDemandSurge} 
                  onChange={(e) => setSettings({ ...settings, highDemandSurge: parseInt(e.target.value) })}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
