import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Save } from "lucide-react";

export default function AdminSettings() {
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">System Settings</h1>
        <p className="text-slate-500">Configure global app settings and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
            <CardHeader><CardTitle>General App Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">App Name</label>
                    <Input defaultValue="ServiceHub Pro" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Support Email</label>
                    <Input defaultValue="support@servicehub.com" />
                </div>
                <div className="flex items-center justify-between py-2">
                    <span className="text-sm font-medium">Maintenance Mode</span>
                    <Switch />
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader><CardTitle>Payment Configuration</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-sm font-medium">Currency</label>
                    <select className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm">
                        <option>USD ($)</option>
                        <option>EUR (€)</option>
                        <option>INR (₹)</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Platform Fee (%)</label>
                    <Input type="number" defaultValue="10" />
                </div>
                <div className="flex items-center justify-between py-2">
                    <span className="text-sm font-medium">Enable Cash on Delivery</span>
                    <Switch defaultChecked />
                </div>
            </CardContent>
        </Card>

        <div className="lg:col-span-2 flex justify-end">
            <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Save className="w-4 h-4 mr-2" /> Save Changes
            </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
