import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, MoreVertical, Eye, MapPin } from "lucide-react";
import { MOCK_ORDERS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AdminOrders() {
  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Order Management</h1>
            <p className="text-slate-500 mt-1">Track and manage all bookings and service requests.</p>
        </div>
        <div className="flex gap-3">
             <Button variant="outline" className="bg-white border-slate-200">Export CSV</Button>
        </div>
      </div>

      <Card className="border-slate-100 shadow-sm">
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input placeholder="Search orders..." className="pl-9 bg-slate-50 border-slate-200" />
            </div>
            <div className="flex gap-2">
                <Button variant="outline" className="border-slate-200 text-slate-600">
                    <Filter className="w-4 h-4 mr-2" /> All Orders
                </Button>
            </div>
        </CardHeader>
        <CardContent>
            <div className="rounded-xl border border-slate-100 overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium">
                        <tr>
                            <th className="px-6 py-4">Order ID</th>
                            <th className="px-6 py-4">Service</th>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Assigned Worker</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {MOCK_ORDERS.map((order) => (
                            <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4 font-mono text-slate-500 font-medium">
                                    {order.id}
                                </td>
                                <td className="px-6 py-4 font-medium text-slate-900">
                                    {order.serviceId === "ac-repair" ? "AC Repair" : 
                                     order.serviceId === "cleaning" ? "Home Cleaning" :
                                     order.serviceId === "plumbing" ? "Plumbing" : "Painting"}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-slate-900">{order.customerName}</span>
                                        <span className="text-xs text-slate-500">{order.address}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {order.workerId ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold">
                                                {order.workerName?.charAt(0)}
                                            </div>
                                            <span className="text-slate-700">{order.workerName}</span>
                                        </div>
                                    ) : (
                                        <span className="text-slate-400 italic">Unassigned</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                     <Badge className={cn(
                                        "font-medium border-0",
                                        order.status === "Completed" ? "bg-emerald-100 text-emerald-700" :
                                        order.status === "Cancelled" ? "bg-red-100 text-red-700" :
                                        order.status === "Pending" ? "bg-amber-100 text-amber-700" :
                                        "bg-blue-100 text-blue-700"
                                    )}>
                                        {order.status}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 font-bold text-slate-900">
                                    ${order.total}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-primary">
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-primary">
                                            <MapPin className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
