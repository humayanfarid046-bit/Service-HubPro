import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Bell, Send } from "lucide-react";

export default function AdminNotifications() {
  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
          <p className="text-slate-500">Send push notifications to users and workers.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
            <CardHeader><CardTitle>Send New Notification</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Title</label>
                    <Input placeholder="e.g. Summer Sale is Live!" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Message</label>
                    <Textarea placeholder="Enter notification body..." />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Target Audience</label>
                    <select className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm">
                        <option>All Users</option>
                        <option>Customers Only</option>
                        <option>Workers Only</option>
                    </select>
                </div>
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                    <Send className="w-4 h-4 mr-2" /> Send Notification
                </Button>
            </CardContent>
        </Card>

        <Card>
            <CardHeader><CardTitle>Recent History</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                {[1,2,3].map((i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                            <Bell className="w-4 h-4 text-slate-500" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900">System Maintenance Update</p>
                            <p className="text-xs text-slate-500">Sent to All Users • 2 hours ago</p>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
