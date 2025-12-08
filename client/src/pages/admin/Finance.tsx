import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, CreditCard, Download, Loader2, IndianRupee, Clock, CheckCircle2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import type { Booking, Service, User } from "@shared/schema";

export default function AdminFinance() {
  const { data: bookings = [], isLoading: bookingsLoading } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
    queryFn: async () => {
      const res = await fetch("/api/bookings");
      if (!res.ok) throw new Error("Failed to fetch bookings");
      return res.json();
    },
  });

  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["/api/users"],
    queryFn: async () => {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Failed to fetch users");
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

  const getUserName = (id: number) => users.find(u => u.id === id)?.fullName || "Unknown";
  const getServiceName = (id: number) => services.find(s => s.id === id)?.name || "Unknown Service";

  const totalRevenue = bookings
    .filter(b => b.paymentStatus === "paid")
    .reduce((sum, b) => sum + parseFloat(b.totalAmount || "0"), 0);

  const pendingPayments = bookings
    .filter(b => b.paymentStatus === "pending")
    .reduce((sum, b) => sum + parseFloat(b.totalAmount || "0"), 0);

  const codPending = bookings
    .filter(b => b.paymentMethod === "COD" && b.paymentStatus === "pending")
    .reduce((sum, b) => sum + parseFloat(b.totalAmount || "0"), 0);

  const completedBookings = bookings.filter(b => b.status === "completed").length;

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Payments & Finance</h1>
          <p className="text-slate-500">Track revenue, payouts, and transactions.</p>
        </div>
        <Button variant="outline"><Download className="w-4 h-4 mr-2" /> Download Report</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-emerald-50 border-emerald-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-emerald-600 font-medium mb-1">
              <CheckCircle2 className="w-4 h-4" />
              Total Revenue
            </div>
            <h3 className="text-3xl font-bold text-slate-900">₹{totalRevenue.toLocaleString()}</h3>
            <p className="text-sm text-slate-500 mt-1">{completedBookings} completed orders</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-blue-600 font-medium mb-1">
              <Clock className="w-4 h-4" />
              Pending Payments
            </div>
            <h3 className="text-3xl font-bold text-slate-900">₹{pendingPayments.toLocaleString()}</h3>
            <p className="text-sm text-slate-500 mt-1">{bookings.filter(b => b.paymentStatus === "pending").length} orders</p>
          </CardContent>
        </Card>
        <Card className="bg-orange-50 border-orange-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-orange-600 font-medium mb-1">
              <IndianRupee className="w-4 h-4" />
              COD Pending
            </div>
            <h3 className="text-3xl font-bold text-slate-900">₹{codPending.toLocaleString()}</h3>
            <p className="text-sm text-slate-500 mt-1">{bookings.filter(b => b.paymentMethod === "COD" && b.paymentStatus === "pending").length} orders</p>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 border-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-purple-600 font-medium mb-1">
              <CreditCard className="w-4 h-4" />
              Total Bookings
            </div>
            <h3 className="text-3xl font-bold text-slate-900">{bookings.length}</h3>
            <p className="text-sm text-slate-500 mt-1">All time orders</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Payment History</CardTitle></CardHeader>
        <CardContent>
          {bookingsLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              No payment history yet. Transactions will appear when bookings are made.
            </div>
          ) : (
            <div className="rounded-xl border border-slate-100 overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium">
                  <tr>
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Service</th>
                    <th className="px-6 py-4">Method</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-slate-50/50" data-testid={`row-payment-${booking.id}`}>
                      <td className="px-6 py-4 font-mono text-slate-500">#{booking.id}</td>
                      <td className="px-6 py-4 font-medium">{getUserName(booking.customerId)}</td>
                      <td className="px-6 py-4">{getServiceName(booking.serviceId)}</td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className="font-medium">
                          {booking.paymentMethod || "N/A"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900">
                        ₹{parseFloat(booking.totalAmount || "0").toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={cn(
                          "font-medium",
                          booking.paymentStatus === "paid" ? "bg-emerald-100 text-emerald-700" :
                          booking.paymentStatus === "pending" ? "bg-orange-100 text-orange-700" :
                          "bg-red-100 text-red-700"
                        )}>
                          {booking.paymentStatus || "Pending"}
                        </Badge>
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
