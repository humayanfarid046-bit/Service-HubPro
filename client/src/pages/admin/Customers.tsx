import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MoreVertical, Ban, History, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MOCK_CUSTOMERS = [
  { id: "cust1", name: "Alice Smith", email: "alice@example.com", phone: "+1 234 567 890", orders: 12, status: "Active", spent: 4500 },
  { id: "cust2", name: "Bob Jones", email: "bob@example.com", phone: "+1 987 654 321", orders: 5, status: "Active", spent: 1200 },
  { id: "cust3", name: "Charlie Brown", email: "charlie@example.com", phone: "+1 555 666 777", orders: 1, status: "Blocked", spent: 150 },
];

export default function AdminCustomers() {
  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Customer Management</h1>
          <p className="text-slate-500">View and manage customer accounts.</p>
        </div>
      </div>

      <Card className="border-slate-100 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
            <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input placeholder="Search customers..." className="pl-9 bg-slate-50" />
            </div>
        </CardHeader>
        <CardContent>
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium">
                    <tr>
                        <th className="px-6 py-4">Customer</th>
                        <th className="px-6 py-4">Contact</th>
                        <th className="px-6 py-4">Orders</th>
                        <th className="px-6 py-4">Total Spent</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {MOCK_CUSTOMERS.map((cust) => (
                        <tr key={cust.id} className="hover:bg-slate-50/50">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs">
                                        {cust.name.charAt(0)}
                                    </div>
                                    <span className="font-bold text-slate-900">{cust.name}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <p className="text-slate-900">{cust.email}</p>
                                <p className="text-xs text-slate-500">{cust.phone}</p>
                            </td>
                            <td className="px-6 py-4">{cust.orders}</td>
                            <td className="px-6 py-4 font-bold">${cust.spent}</td>
                            <td className="px-6 py-4">
                                <Badge className={cn(cust.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700")}>
                                    {cust.status}
                                </Badge>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem><History className="w-4 h-4 mr-2" /> Booking History</DropdownMenuItem>
                                        <DropdownMenuItem className="text-red-600"><Ban className="w-4 h-4 mr-2" /> Block User</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
