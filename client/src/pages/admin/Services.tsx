import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit2, Trash2, MoreVertical, Filter } from "lucide-react";
import { SERVICES } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AdminServices() {
  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Services Management</h1>
            <p className="text-slate-500 mt-1">Manage categories, sub-services, and pricing.</p>
        </div>
        <Button className="bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/25">
            <Plus className="w-4 h-4 mr-2" /> Add New Service
        </Button>
      </div>

      <Card className="border-slate-100 shadow-sm">
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input placeholder="Search services..." className="pl-9 bg-slate-50 border-slate-200" />
            </div>
            <div className="flex gap-2">
                <Button variant="outline" className="border-slate-200 text-slate-600">
                    <Filter className="w-4 h-4 mr-2" /> Filter
                </Button>
            </div>
        </CardHeader>
        <CardContent>
            <div className="rounded-xl border border-slate-100 overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium">
                        <tr>
                            <th className="px-6 py-4">Service Name</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Base Price</th>
                            <th className="px-6 py-4">Rating</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {SERVICES.map((service) => (
                            <tr key={service.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", service.color)}>
                                            <service.icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">{service.title}</p>
                                            <p className="text-xs text-slate-500 truncate max-w-[150px]">{service.description}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <Badge variant="secondary" className="font-medium bg-slate-100 text-slate-600 hover:bg-slate-200">
                                        {service.category}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 font-medium text-slate-900">
                                    ${service.price}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1 text-slate-700">
                                        <span className="font-bold">{service.rating}</span>
                                        <span className="text-slate-400 text-xs">/ 5.0</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <Badge className={cn(
                                        "font-medium",
                                        service.active ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-slate-100 text-slate-500"
                                    )}>
                                        {service.active ? "Active" : "Inactive"}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem><Edit2 className="w-4 h-4 mr-2" /> Edit Service</DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-600"><Trash2 className="w-4 h-4 mr-2" /> Delete</DropdownMenuItem>
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
