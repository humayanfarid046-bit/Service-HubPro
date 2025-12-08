import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, MoreVertical, ShieldCheck, ShieldAlert, CheckCircle2, XCircle } from "lucide-react";
import { MOCK_WORKERS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AdminWorkers() {
  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Worker Management</h1>
            <p className="text-slate-500 mt-1">Manage worker profiles, KYC status, and availability.</p>
        </div>
        <div className="flex gap-3">
             <Button variant="outline" className="bg-white border-slate-200">Export List</Button>
             <Button className="bg-slate-900 text-white hover:bg-slate-800">Add New Worker</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="bg-white border-slate-100 shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-slate-500 font-medium">Verified Workers</p>
                    <p className="text-2xl font-bold text-slate-900">124</p>
                </div>
            </CardContent>
        </Card>
        <Card className="bg-white border-slate-100 shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                    <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-slate-500 font-medium">Pending KYC</p>
                    <p className="text-2xl font-bold text-slate-900">12</p>
                </div>
            </CardContent>
        </Card>
         <Card className="bg-white border-slate-100 shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-slate-50 text-slate-600 rounded-xl">
                    <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-slate-500 font-medium">Total Earnings Payout</p>
                    <p className="text-2xl font-bold text-slate-900">$12,450</p>
                </div>
            </CardContent>
        </Card>
      </div>

      <Card className="border-slate-100 shadow-sm">
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input placeholder="Search workers by name or ID..." className="pl-9 bg-slate-50 border-slate-200" />
            </div>
            <div className="flex gap-2">
                <Button variant="outline" className="border-slate-200 text-slate-600">
                    <Filter className="w-4 h-4 mr-2" /> Status: All
                </Button>
            </div>
        </CardHeader>
        <CardContent>
            <div className="rounded-xl border border-slate-100 overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium">
                        <tr>
                            <th className="px-6 py-4">Worker</th>
                            <th className="px-6 py-4">Service</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">KYC</th>
                            <th className="px-6 py-4">Earnings</th>
                            <th className="px-6 py-4">Joined</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {MOCK_WORKERS.map((worker) => (
                            <tr key={worker.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <img src={worker.avatar} alt={worker.name} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                                        <div>
                                            <p className="font-bold text-slate-900">{worker.name}</p>
                                            <p className="text-xs text-slate-500">ID: {worker.id}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-medium text-slate-700">
                                    {worker.service}
                                </td>
                                <td className="px-6 py-4">
                                     <Badge className={cn(
                                        "font-medium border-0",
                                        worker.status === "Active" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : 
                                        worker.status === "Inactive" ? "bg-slate-100 text-slate-600 hover:bg-slate-200" :
                                        "bg-red-100 text-red-700 hover:bg-red-200"
                                    )}>
                                        {worker.status}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4">
                                     <div className="flex items-center gap-1.5">
                                        {worker.kycStatus === "Verified" ? (
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                        ) : worker.kycStatus === "Pending" ? (
                                            <div className="w-4 h-4 rounded-full border-2 border-orange-400 border-t-transparent animate-spin" />
                                        ) : (
                                            <XCircle className="w-4 h-4 text-red-500" />
                                        )}
                                        <span className={cn(
                                            "font-medium",
                                            worker.kycStatus === "Verified" ? "text-emerald-700" :
                                            worker.kycStatus === "Pending" ? "text-orange-600" : "text-red-600"
                                        )}>
                                            {worker.kycStatus}
                                        </span>
                                     </div>
                                </td>
                                <td className="px-6 py-4 font-bold text-slate-900">
                                    ${worker.earnings.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 text-slate-500">
                                    {worker.joinedDate}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>View Profile</DropdownMenuItem>
                                            <DropdownMenuItem>View KYC Docs</DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-600">Block Worker</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
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
