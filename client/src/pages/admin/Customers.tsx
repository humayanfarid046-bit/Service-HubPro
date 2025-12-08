import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MoreVertical, Ban, Eye, Users, ShoppingBag, IndianRupee, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { User, CustomerDetails, Booking, Service } from "@shared/schema";

export default function AdminCustomers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
    queryFn: async () => {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    },
  });

  const { data: bookings = [] } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
    queryFn: async () => {
      const res = await fetch("/api/bookings");
      if (!res.ok) throw new Error("Failed to fetch bookings");
      return res.json();
    },
  });

  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ["/api/services"],
    queryFn: async () => {
      const res = await fetch("/api/services");
      if (!res.ok) throw new Error("Failed to fetch services");
      return res.json();
    },
  });

  const customers = users.filter(u => u.role === "CUSTOMER");
  const getCustomerBookings = (userId: number) => bookings.filter(b => b.customerId === userId);
  const getServiceName = (id: number) => services.find(s => s.id === id)?.name || "Unknown";
  const getWorkerName = (id: number | null) => {
    if (!id) return "Not assigned";
    return users.find(u => u.id === id)?.fullName || "Unknown";
  };

  const filteredCustomers = customers.filter(c =>
    c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.isActive).length;
  const totalSpent = bookings
    .filter(b => b.paymentStatus === "paid")
    .reduce((sum, b) => sum + parseFloat(b.totalAmount || "0"), 0);

  const handleViewCustomer = (customer: User) => {
    setSelectedCustomer(customer);
    setIsDialogOpen(true);
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Customer Management</h1>
          <p className="text-slate-500">View and manage customer accounts and booking history.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Customers</p>
              <p className="text-2xl font-bold text-slate-900">{totalCustomers}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50 border-emerald-100">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Active Customers</p>
              <p className="text-2xl font-bold text-slate-900">{activeCustomers}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 border-purple-100">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
              <IndianRupee className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Revenue</p>
              <p className="text-2xl font-bold text-slate-900">₹{totalSpent.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-100 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input 
              placeholder="Search customers by name or phone..." 
              className="pl-9 bg-slate-50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search-customers"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              No customers found. Customers will appear when they register.
            </div>
          ) : (
            <div className="rounded-xl border border-slate-100 overflow-hidden">
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
                  {filteredCustomers.map((customer) => {
                    const customerBookings = getCustomerBookings(customer.id);
                    const totalSpent = customerBookings
                      .filter(b => b.paymentStatus === "paid")
                      .reduce((sum, b) => sum + parseFloat(b.totalAmount || "0"), 0);
                    return (
                      <tr key={customer.id} className="hover:bg-slate-50/50" data-testid={`row-customer-${customer.id}`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                              {customer.fullName.charAt(0)}
                            </div>
                            <span className="font-bold text-slate-900">{customer.fullName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-slate-900">{customer.email || "No email"}</p>
                          <p className="text-xs text-slate-500">{customer.phone}</p>
                        </td>
                        <td className="px-6 py-4 font-medium">{customerBookings.length}</td>
                        <td className="px-6 py-4 font-bold">₹{totalSpent.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <Badge className={cn(
                            customer.isActive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                          )}>
                            {customer.isActive ? "Active" : "Blocked"}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewCustomer(customer)}>
                                <Eye className="w-4 h-4 mr-2" /> View History
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Ban className="w-4 h-4 mr-2" /> Block User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Customer Booking History</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold">
                  {selectedCustomer.fullName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{selectedCustomer.fullName}</h3>
                  <p className="text-slate-500">{selectedCustomer.phone}</p>
                  {selectedCustomer.email && <p className="text-sm text-slate-400">{selectedCustomer.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-500">Total Orders</p>
                  <p className="font-bold text-lg">{getCustomerBookings(selectedCustomer.id).length}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-500">Total Spent</p>
                  <p className="font-bold text-lg text-emerald-600">
                    ₹{getCustomerBookings(selectedCustomer.id)
                      .filter(b => b.paymentStatus === "paid")
                      .reduce((sum, b) => sum + parseFloat(b.totalAmount || "0"), 0)
                      .toLocaleString()}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-bold mb-3">Booking History</h4>
                {getCustomerBookings(selectedCustomer.id).length === 0 ? (
                  <p className="text-slate-500 text-center py-4">No bookings yet</p>
                ) : (
                  <div className="space-y-2">
                    {getCustomerBookings(selectedCustomer.id).map((booking) => (
                      <div key={booking.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium">{getServiceName(booking.serviceId)}</p>
                          <Badge className={cn(
                            "text-xs",
                            booking.status === "completed" ? "bg-emerald-100 text-emerald-700" :
                            booking.status === "pending" ? "bg-orange-100 text-orange-700" :
                            booking.status === "cancelled" ? "bg-red-100 text-red-700" :
                            "bg-blue-100 text-blue-700"
                          )}>
                            {booking.status}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm text-slate-500">
                          <span>Worker: {getWorkerName(booking.workerId)}</span>
                          <span>{new Date(booking.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <Badge variant="outline">{booking.paymentMethod || "N/A"}</Badge>
                          <span className="font-bold">₹{booking.totalAmount}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
