import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Activity, Search, Loader2, User, Settings, FileEdit, 
  Trash2, Plus, CheckCircle, XCircle, LogIn, LogOut
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
import type { ActivityLog, User as UserType } from "@shared/schema";

export default function AdminActivityLogs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

  const { data: logs = [], isLoading } = useQuery<ActivityLog[]>({
    queryKey: ["/api/activity-logs"],
    queryFn: async () => {
      const res = await fetch("/api/activity-logs");
      if (!res.ok) throw new Error("Failed to fetch logs");
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

  const getActorName = (id: number | null) => {
    if (!id) return "System";
    return users.find(u => u.id === id)?.fullName || "Unknown";
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "created": return <Plus className="w-4 h-4" />;
      case "updated": return <FileEdit className="w-4 h-4" />;
      case "deleted": return <Trash2 className="w-4 h-4" />;
      case "approved": return <CheckCircle className="w-4 h-4" />;
      case "rejected": return <XCircle className="w-4 h-4" />;
      case "login": return <LogIn className="w-4 h-4" />;
      case "logout": return <LogOut className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getActionBadgeStyle = (action: string) => {
    switch (action) {
      case "created": return "bg-emerald-100 text-emerald-700";
      case "updated": return "bg-blue-100 text-blue-700";
      case "deleted": return "bg-red-100 text-red-700";
      case "approved": return "bg-green-100 text-green-700";
      case "rejected": return "bg-orange-100 text-orange-700";
      case "login": return "bg-indigo-100 text-indigo-700";
      case "logout": return "bg-slate-100 text-slate-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getRoleBadgeStyle = (role: string | null) => {
    switch (role) {
      case "ADMIN": return "bg-purple-100 text-purple-700";
      case "WORKER": return "bg-blue-100 text-blue-700";
      case "CUSTOMER": return "bg-green-100 text-green-700";
      case "SYSTEM": return "bg-slate-100 text-slate-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      getActorName(log.actorId).toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entityType?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction = actionFilter === "all" || log.action === actionFilter;
    const matchesRole = roleFilter === "all" || log.actorRole === roleFilter;
    return matchesSearch && matchesAction && matchesRole;
  });

  const uniqueActions = Array.from(new Set(logs.map(l => l.action)));
  const uniqueRoles = Array.from(new Set(logs.map(l => l.actorRole).filter(Boolean))) as string[];

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Activity Logs</h1>
          <p className="text-slate-500 mt-1">Track all system activities and user actions.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Total Activities</p>
              <p className="text-xl font-bold text-slate-900">{logs.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50 border-emerald-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Created</p>
              <p className="text-xl font-bold text-slate-900">
                {logs.filter(l => l.action === "created").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 border-amber-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 text-amber-600 rounded-xl">
              <FileEdit className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Updated</p>
              <p className="text-xl font-bold text-slate-900">
                {logs.filter(l => l.action === "updated").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-red-100 text-red-600 rounded-xl">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Deleted</p>
              <p className="text-xl font-bold text-slate-900">
                {logs.filter(l => l.action === "deleted").length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-100 shadow-sm">
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle>Activity History</CardTitle>
          <div className="flex flex-wrap gap-3">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search logs..."
                className="pl-9 bg-slate-50 border-slate-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search-logs"
              />
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                {uniqueActions.map(action => (
                  <SelectItem key={action} value={action} className="capitalize">{action}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {uniqueRoles.map(role => (
                  <SelectItem key={role} value={role!}>{role}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              No activity logs found.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredLogs.map((log) => (
                <div 
                  key={log.id} 
                  className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                  data-testid={`row-activity-${log.id}`}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                    getActionBadgeStyle(log.action)
                  )}>
                    {getActionIcon(log.action)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-semibold text-slate-900">{getActorName(log.actorId)}</span>
                      {log.actorRole && (
                        <Badge className={cn("text-xs", getRoleBadgeStyle(log.actorRole))}>
                          {log.actorRole}
                        </Badge>
                      )}
                      <Badge className={cn("text-xs", getActionBadgeStyle(log.action))}>
                        {log.action}
                      </Badge>
                      {log.entityType && (
                        <span className="text-sm text-slate-500">{log.entityType}</span>
                      )}
                    </div>
                    {log.description && (
                      <p className="text-sm text-slate-600">{log.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                      <span>{new Date(log.createdAt).toLocaleString()}</span>
                      {log.ipAddress && <span>IP: {log.ipAddress}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
