import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2, Users, UserCheck, UserX, Shield, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@shared/schema";

export default function AdminUsers() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
    queryFn: async () => {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<User> }) => {
      const res = await fetch(`/api/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update user");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({ title: "Updated!", description: "User updated successfully." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phone.includes(searchQuery);
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const totalUsers = users.length;
  const adminCount = users.filter(u => u.role === "ADMIN").length;
  const workerCount = users.filter(u => u.role === "WORKER").length;
  const customerCount = users.filter(u => u.role === "CUSTOMER").length;
  const activeCount = users.filter(u => u.isActive).length;

  const handleRoleChange = (userId: number, newRole: string) => {
    updateUserMutation.mutate({ id: userId, updates: { role: newRole } });
  };

  const handleStatusToggle = (userId: number, currentStatus: boolean) => {
    updateUserMutation.mutate({ id: userId, updates: { isActive: !currentStatus } });
  };

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "WORKER":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "CUSTOMER":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">User Management</h1>
          <p className="text-slate-500 mt-1">View all users, manage roles and account status.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Card className="bg-white border-slate-100 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-slate-100 text-slate-600 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Total Users</p>
              <p className="text-xl font-bold text-slate-900">{totalUsers}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-100 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Admins</p>
              <p className="text-xl font-bold text-slate-900">{adminCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-100 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Workers</p>
              <p className="text-xl font-bold text-slate-900">{workerCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-100 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Customers</p>
              <p className="text-xl font-bold text-slate-900">{customerCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-100 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-green-100 text-green-600 rounded-xl">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Active</p>
              <p className="text-xl font-bold text-slate-900">{activeCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-100 shadow-sm">
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input 
              placeholder="Search by name or phone..." 
              className="pl-9 bg-slate-50 border-slate-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search-users"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full md:w-40" data-testid="select-role-filter">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Roles</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="WORKER">Worker</SelectItem>
              <SelectItem value="CUSTOMER">Customer</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              No users found.
            </div>
          ) : (
            <div className="rounded-xl border border-slate-100 overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Phone</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Joined</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors" data-testid={`row-user-${user.id}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border",
                            user.role === "ADMIN" ? "bg-purple-100 text-purple-700 border-purple-200" :
                            user.role === "WORKER" ? "bg-blue-100 text-blue-700 border-blue-200" :
                            "bg-emerald-100 text-emerald-700 border-emerald-200"
                          )}>
                            {user.fullName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{user.fullName}</p>
                            <p className="text-xs text-slate-500">{user.email || "No email"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{user.phone}</td>
                      <td className="px-6 py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className={cn(
                              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border cursor-pointer hover:opacity-80",
                              getRoleBadgeStyle(user.role)
                            )} data-testid={`dropdown-role-${user.id}`}>
                              {user.role}
                              <ChevronDown className="w-3 h-3" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleRoleChange(user.id, "ADMIN")}>
                              <Shield className="w-4 h-4 mr-2 text-purple-600" /> Admin
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRoleChange(user.id, "WORKER")}>
                              <Users className="w-4 h-4 mr-2 text-blue-600" /> Worker
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRoleChange(user.id, "CUSTOMER")}>
                              <Users className="w-4 h-4 mr-2 text-emerald-600" /> Customer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleStatusToggle(user.id, user.isActive)}
                          className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors",
                            user.isActive 
                              ? "bg-green-100 text-green-700 hover:bg-green-200" 
                              : "bg-red-100 text-red-700 hover:bg-red-200"
                          )}
                          data-testid={`button-status-${user.id}`}
                        >
                          {user.isActive ? (
                            <><UserCheck className="w-3 h-3" /> Active</>
                          ) : (
                            <><UserX className="w-3 h-3" /> Inactive</>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {new Date(user.createdAt).toLocaleDateString("en-IN", { 
                          day: "numeric", month: "short", year: "numeric" 
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-xs text-slate-400">ID: {user.id}</span>
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
