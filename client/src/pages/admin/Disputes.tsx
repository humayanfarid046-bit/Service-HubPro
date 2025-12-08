import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, AlertTriangle, CheckCircle } from "lucide-react";

export default function AdminDisputes() {
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Disputes & Support</h1>
        <p className="text-slate-500">Resolve customer complaints and worker issues.</p>
      </div>

      <div className="space-y-4">
        {[1, 2].map((i) => (
            <Card key={i} className="border-l-4 border-l-orange-500 shadow-sm">
                <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-600">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Service Quality Issue</h3>
                                <p className="text-sm text-slate-500 mb-2">Order #ORD-1234 • Reported by Alice Smith</p>
                                <p className="text-slate-700 bg-slate-50 p-3 rounded-lg text-sm max-w-2xl">
                                    "The worker arrived late and didn't complete the cleaning properly. I want a refund."
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Button variant="outline" className="text-xs">View Order</Button>
                            <Button className="bg-slate-900 text-xs">Resolve</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        ))}
      </div>
    </AdminLayout>
  );
}
