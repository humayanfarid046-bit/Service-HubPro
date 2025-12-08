import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  LogIn, Search, Loader2, CheckCircle, XCircle, 
  Smartphone, Globe, MapPin, Clock
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { LoginEvent, User as UserType } from "@shared/schema";

export default function AdminLoginLogs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: events = [], isLoading } = useQuery<LoginEvent[]>({
    queryKey: ["/api/login-events"],
    queryFn: async () => {
      const res = await fetch("/api/login-events");
      if (!res.ok) throw new Error("Failed to fetch login events");
      return res.json();
    },
  });

  const { data: users = [] } = useQuery<UserType[]>({
    queryKey: ["/api/users"],
    queryFn: async () => {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    },
  });

  const getUserName = (id: number | null) => {
    if (!id) return "Unknown";
    return users.find(u => u.id === id)?.fullName || "Unknown";
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = 
      getUserName(event.userId).toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.ipAddress?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = 
      statusFilter === "all" || 
      (statusFilter === "success" && event.success) ||
      (statusFilter === "failed" && !event.success);
    return matchesSearch && matchesStatus;
  });

  const successCount = events.filter(e => e.success).length;
  const failedCount = events.filter(e => !e.success).length;
  const todayCount = events.filter(e => {
    const today = new Date();
    const eventDate = new Date(e.createdAt);
    return eventDate.toDateString() === today.toDateString();
  }).length;

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Login Logs</h1>
          <p className="text-slate-500 mt-1">Monitor user login attempts and sessions.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
              <LogIn className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Total Logins</p>
              <p className="text-xl font-bold text-slate-900">{events.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50 border-emerald-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Successful</p>
              <p className="text-xl font-bold text-slate-900">{successCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-red-100 text-red-600 rounded-xl">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Failed</p>
              <p className="text-xl font-bold text-slate-900">{failedCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 border-purple-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Today</p>
              <p className="text-xl font-bold text-slate-900">{todayCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-100 shadow-sm">
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle>Login History</CardTitle>
          <div className="flex flex-wrap gap-3">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search by name, phone, IP..."
                className="pl-9 bg-slate-50 border-slate-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search-login-logs"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Successful</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              No login events found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">User</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Phone</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Method</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">IP Address</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.map((event) => (
                    <tr 
                      key={event.id} 
                      className="border-b border-slate-50 hover:bg-slate-50"
                      data-testid={`row-login-${event.id}`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                            <Smartphone className="w-4 h-4 text-slate-500" />
                          </div>
                          <span className="font-medium text-slate-900">{getUserName(event.userId)}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{event.phone || "-"}</td>
                      <td className="py-3 px-4">
                        <Badge className={cn(
                          event.success ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                        )}>
                          {event.success ? (
                            <><CheckCircle className="w-3 h-3 mr-1" /> Success</>
                          ) : (
                            <><XCircle className="w-3 h-3 mr-1" /> Failed</>
                          )}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-slate-600 capitalize">{event.method || "OTP"}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 text-sm text-slate-600">
                          <Globe className="w-3 h-3" />
                          {event.ipAddress || "-"}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-500">
                        {new Date(event.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
