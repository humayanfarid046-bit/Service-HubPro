import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, Loader2, IndianRupee, CreditCard, Clock, CheckCircle, 
  XCircle, ArrowUpRight, ArrowDownRight, RefreshCw, Wallet, 
  Receipt, TrendingUp, Users, MoreVertical
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Payment, Transaction, Payout, Refund, User, Booking } from "@shared/schema";

type FinanceTab = "dashboard" | "payments" | "payouts" | "refunds" | "transactions";

export default function AdminFinance() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<FinanceTab>("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPayoutDialogOpen, setIsPayoutDialogOpen] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null);
  const [payoutStatus, setPayoutStatus] = useState("");
  const [adminNotes, setAdminNotes] = useState("");

  const { data: payments = [], isLoading: loadingPayments } = useQuery<Payment[]>({
    queryKey: ["/api/payments"],
    queryFn: async () => {
      const res = await fetch("/api/payments");
      if (!res.ok) throw new Error("Failed to fetch payments");
      return res.json();
    },
  });

  const { data: transactions = [], isLoading: loadingTransactions } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
    queryFn: async () => {
      const res = await fetch("/api/transactions");
      if (!res.ok) throw new Error("Failed to fetch transactions");
      return res.json();
    },
  });

  const { data: payouts = [], isLoading: loadingPayouts } = useQuery<Payout[]>({
    queryKey: ["/api/payouts"],
    queryFn: async () => {
      const res = await fetch("/api/payouts");
      if (!res.ok) throw new Error("Failed to fetch payouts");
      return res.json();
    },
  });

  const { data: refunds = [], isLoading: loadingRefunds } = useQuery<Refund[]>({
    queryKey: ["/api/refunds"],
    queryFn: async () => {
      const res = await fetch("/api/refunds");
      if (!res.ok) throw new Error("Failed to fetch refunds");
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

  const { data: bookings = [] } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
    queryFn: async () => {
      const res = await fetch("/api/bookings");
      if (!res.ok) throw new Error("Failed to fetch bookings");
      return res.json();
    },
  });

  const updatePayoutMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<Payout> }) => {
      const res = await fetch(`/api/payouts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update payout");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payouts"] });
      toast({ title: "Success", description: "Payout updated!" });
      setIsPayoutDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateRefundMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<Refund> }) => {
      const res = await fetch(`/api/refunds/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update refund");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/refunds"] });
      toast({ title: "Success", description: "Refund updated!" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const getCustomerName = (id: number) => users.find(u => u.id === id)?.fullName || "Unknown";
  const getWorkerName = (id: number) => users.find(u => u.id === id)?.fullName || "Unknown";

  const totalRevenue = payments.filter(p => p.paymentStatus === "completed").reduce((sum, p) => sum + parseFloat(p.amount || "0"), 0);
  const pendingPayments = payments.filter(p => p.paymentStatus === "pending");
  const completedPayments = payments.filter(p => p.paymentStatus === "completed");
  const pendingPayouts = payouts.filter(p => p.status === "pending");
  const completedPayouts = payouts.filter(p => p.status === "completed");
  const pendingRefunds = refunds.filter(r => r.status === "pending");
  const totalPayouts = payouts.filter(p => p.status === "completed").reduce((sum, p) => sum + parseFloat(p.amount || "0"), 0);
  const totalRefunds = refunds.filter(r => r.status === "completed").reduce((sum, r) => sum + parseFloat(r.amount || "0"), 0);

  const handlePayoutAction = (payout: Payout) => {
    setSelectedPayout(payout);
    setPayoutStatus(payout.status);
    setAdminNotes(payout.adminNotes || "");
    setIsPayoutDialogOpen(true);
  };

  const submitPayoutUpdate = () => {
    if (!selectedPayout) return;
    updatePayoutMutation.mutate({
      id: selectedPayout.id,
      updates: {
        status: payoutStatus,
        adminNotes,
        processedAt: payoutStatus === "completed" ? new Date() : null,
      },
    });
  };

  const handleRefundAction = (refund: Refund, newStatus: string) => {
    updateRefundMutation.mutate({
      id: refund.id,
      updates: {
        status: newStatus,
        processedAt: newStatus === "completed" ? new Date() : null,
      },
    });
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "pending": return "bg-amber-100 text-amber-700";
      case "approved": case "confirmed": return "bg-blue-100 text-blue-700";
      case "processing": return "bg-purple-100 text-purple-700";
      case "completed": case "paid": return "bg-emerald-100 text-emerald-700";
      case "failed": case "rejected": return "bg-red-100 text-red-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Payment & Finance</h1>
          <p className="text-slate-500 mt-1">Manage payments, payouts, refunds and transactions.</p>
        </div>
      </div>

      <Card className="border-slate-100 shadow-sm">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as FinanceTab)}>
          <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-0">
            <TabsList className="flex-wrap">
              <TabsTrigger value="dashboard" className="gap-1.5">
                <TrendingUp className="w-4 h-4" /> Dashboard
              </TabsTrigger>
              <TabsTrigger value="payments" className="gap-1.5">
                <CreditCard className="w-4 h-4" /> Payments ({payments.length})
              </TabsTrigger>
              <TabsTrigger value="payouts" className="gap-1.5">
                <Wallet className="w-4 h-4" /> Payouts ({payouts.length})
              </TabsTrigger>
              <TabsTrigger value="refunds" className="gap-1.5">
                <RefreshCw className="w-4 h-4" /> Refunds ({refunds.length})
              </TabsTrigger>
              <TabsTrigger value="transactions" className="gap-1.5">
                <Receipt className="w-4 h-4" /> Transactions ({transactions.length})
              </TabsTrigger>
            </TabsList>
            {activeTab !== "dashboard" && (
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search..."
                  className="pl-9 bg-slate-50 border-slate-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="input-search-finance"
                />
              </div>
            )}
          </CardHeader>

          <CardContent className="pt-6">
            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="mt-0">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-100">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-slate-600">Total Revenue</p>
                      <div className="p-2 bg-emerald-500 text-white rounded-lg">
                        <IndianRupee className="w-4 h-4" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">₹{totalRevenue.toLocaleString()}</p>
                    <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                      <ArrowUpRight className="w-3 h-3" /> From {completedPayments.length} payments
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-100">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-slate-600">Pending Payments</p>
                      <div className="p-2 bg-amber-500 text-white rounded-lg">
                        <Clock className="w-4 h-4" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{pendingPayments.length}</p>
                    <p className="text-xs text-amber-600 mt-1">Awaiting confirmation</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-100">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-slate-600">Total Payouts</p>
                      <div className="p-2 bg-blue-500 text-white rounded-lg">
                        <Wallet className="w-4 h-4" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">₹{totalPayouts.toLocaleString()}</p>
                    <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                      <ArrowDownRight className="w-3 h-3" /> {completedPayouts.length} completed
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-red-50 to-red-100/50 border-red-100">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-slate-600">Pending Payouts</p>
                      <div className="p-2 bg-red-500 text-white rounded-lg">
                        <Users className="w-4 h-4" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">{pendingPayouts.length}</p>
                    <p className="text-xs text-red-600 mt-1">Worker payout requests</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="border-slate-100">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Clock className="w-5 h-5 text-amber-500" /> Pending Payout Requests
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {pendingPayouts.length === 0 ? (
                      <p className="text-center text-slate-500 py-8">No pending payout requests</p>
                    ) : (
                      <div className="space-y-3">
                        {pendingPayouts.slice(0, 5).map((payout) => (
                          <div key={payout.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div>
                              <p className="font-medium text-slate-900">{getWorkerName(payout.workerId)}</p>
                              <p className="text-xs text-slate-500">
                                Requested {new Date(payout.requestedAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-slate-900">₹{payout.amount}</p>
                              <Button size="sm" variant="outline" className="text-xs h-7 mt-1" onClick={() => handlePayoutAction(payout)}>
                                Review
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-slate-100">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <RefreshCw className="w-5 h-5 text-purple-500" /> Pending Refunds
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {pendingRefunds.length === 0 ? (
                      <p className="text-center text-slate-500 py-8">No pending refunds</p>
                    ) : (
                      <div className="space-y-3">
                        {pendingRefunds.slice(0, 5).map((refund) => (
                          <div key={refund.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div>
                              <p className="font-medium text-slate-900">{getCustomerName(refund.customerId)}</p>
                              <p className="text-xs text-slate-500 truncate max-w-[180px]">{refund.reason || "No reason"}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-slate-900">₹{refund.amount}</p>
                              <div className="flex gap-1 mt-1">
                                <Button size="sm" variant="outline" className="text-xs h-6 text-emerald-600" onClick={() => handleRefundAction(refund, "approved")}>
                                  Approve
                                </Button>
                                <Button size="sm" variant="outline" className="text-xs h-6 text-red-600" onClick={() => handleRefundAction(refund, "rejected")}>
                                  Reject
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Payments Tab */}
            <TabsContent value="payments" className="mt-0">
              {loadingPayments ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : payments.length === 0 ? (
                <div className="text-center py-12 text-slate-500">No payments found.</div>
              ) : (
                <div className="rounded-xl border border-slate-100 overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium">
                      <tr>
                        <th className="px-6 py-4">Payment ID</th>
                        <th className="px-6 py-4">Customer</th>
                        <th className="px-6 py-4">Amount</th>
                        <th className="px-6 py-4">Method</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {payments.map((payment) => (
                        <tr key={payment.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-mono text-slate-600">#{payment.id}</td>
                          <td className="px-6 py-4 font-medium text-slate-900">{getCustomerName(payment.customerId)}</td>
                          <td className="px-6 py-4 font-bold text-slate-900">₹{payment.amount}</td>
                          <td className="px-6 py-4">
                            <Badge variant="secondary">{payment.paymentMethod}</Badge>
                          </td>
                          <td className="px-6 py-4">
                            <Badge className={getStatusBadgeStyle(payment.paymentStatus)}>{payment.paymentStatus}</Badge>
                          </td>
                          <td className="px-6 py-4 text-slate-500">
                            {new Date(payment.createdAt).toLocaleDateString("en-IN")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>

            {/* Payouts Tab */}
            <TabsContent value="payouts" className="mt-0">
              {loadingPayouts ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : payouts.length === 0 ? (
                <div className="text-center py-12 text-slate-500">No payout requests found.</div>
              ) : (
                <div className="rounded-xl border border-slate-100 overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium">
                      <tr>
                        <th className="px-6 py-4">Payout ID</th>
                        <th className="px-6 py-4">Worker</th>
                        <th className="px-6 py-4">Amount</th>
                        <th className="px-6 py-4">Method</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Requested</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {payouts.map((payout) => (
                        <tr key={payout.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-mono text-slate-600">#{payout.id}</td>
                          <td className="px-6 py-4 font-medium text-slate-900">{getWorkerName(payout.workerId)}</td>
                          <td className="px-6 py-4 font-bold text-slate-900">₹{payout.amount}</td>
                          <td className="px-6 py-4">
                            <Badge variant="secondary">{payout.paymentMethod || "N/A"}</Badge>
                          </td>
                          <td className="px-6 py-4">
                            <Badge className={getStatusBadgeStyle(payout.status)}>{payout.status}</Badge>
                          </td>
                          <td className="px-6 py-4 text-slate-500">
                            {new Date(payout.requestedAt).toLocaleDateString("en-IN")}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button variant="ghost" size="sm" onClick={() => handlePayoutAction(payout)}>
                              Manage
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>

            {/* Refunds Tab */}
            <TabsContent value="refunds" className="mt-0">
              {loadingRefunds ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : refunds.length === 0 ? (
                <div className="text-center py-12 text-slate-500">No refund requests found.</div>
              ) : (
                <div className="rounded-xl border border-slate-100 overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium">
                      <tr>
                        <th className="px-6 py-4">Refund ID</th>
                        <th className="px-6 py-4">Customer</th>
                        <th className="px-6 py-4">Amount</th>
                        <th className="px-6 py-4">Reason</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Requested</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {refunds.map((refund) => (
                        <tr key={refund.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-mono text-slate-600">#{refund.id}</td>
                          <td className="px-6 py-4 font-medium text-slate-900">{getCustomerName(refund.customerId)}</td>
                          <td className="px-6 py-4 font-bold text-slate-900">₹{refund.amount}</td>
                          <td className="px-6 py-4 text-slate-600 truncate max-w-[150px]">{refund.reason || "-"}</td>
                          <td className="px-6 py-4">
                            <Badge className={getStatusBadgeStyle(refund.status)}>{refund.status}</Badge>
                          </td>
                          <td className="px-6 py-4 text-slate-500">
                            {new Date(refund.requestedAt).toLocaleDateString("en-IN")}
                          </td>
                          <td className="px-6 py-4 text-right">
                            {refund.status === "pending" && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleRefundAction(refund, "approved")} className="text-emerald-600">
                                    <CheckCircle className="w-4 h-4 mr-2" /> Approve
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleRefundAction(refund, "processing")} className="text-blue-600">
                                    <Clock className="w-4 h-4 mr-2" /> Processing
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleRefundAction(refund, "completed")} className="text-emerald-600">
                                    <CheckCircle className="w-4 h-4 mr-2" /> Complete
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleRefundAction(refund, "rejected")} className="text-red-600">
                                    <XCircle className="w-4 h-4 mr-2" /> Reject
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>

            {/* Transactions Tab */}
            <TabsContent value="transactions" className="mt-0">
              {loadingTransactions ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-12 text-slate-500">No transactions found.</div>
              ) : (
                <div className="rounded-xl border border-slate-100 overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium">
                      <tr>
                        <th className="px-6 py-4">Transaction ID</th>
                        <th className="px-6 py-4">Type</th>
                        <th className="px-6 py-4">Amount</th>
                        <th className="px-6 py-4">Description</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {transactions.map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-mono text-slate-600">#{transaction.id}</td>
                          <td className="px-6 py-4">
                            <Badge variant="secondary" className={cn(
                              transaction.type === "payment" && "bg-emerald-100 text-emerald-700",
                              transaction.type === "payout" && "bg-blue-100 text-blue-700",
                              transaction.type === "refund" && "bg-red-100 text-red-700",
                              transaction.type === "commission" && "bg-purple-100 text-purple-700"
                            )}>
                              {transaction.type}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 font-bold text-slate-900">
                            <span className={cn(
                              transaction.type === "payment" ? "text-emerald-600" : 
                              transaction.type === "payout" || transaction.type === "refund" ? "text-red-600" : ""
                            )}>
                              {transaction.type === "payment" ? "+" : "-"}₹{transaction.amount}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-600 truncate max-w-[200px]">{transaction.description || "-"}</td>
                          <td className="px-6 py-4">
                            <Badge className={getStatusBadgeStyle(transaction.status)}>{transaction.status}</Badge>
                          </td>
                          <td className="px-6 py-4 text-slate-500">
                            {new Date(transaction.createdAt).toLocaleDateString("en-IN")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>

      {/* Payout Management Dialog */}
      <Dialog open={isPayoutDialogOpen} onOpenChange={setIsPayoutDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Manage Payout Request</DialogTitle>
            <DialogDescription>
              Review and process payout #{selectedPayout?.id} for {selectedPayout && getWorkerName(selectedPayout.workerId)}
            </DialogDescription>
          </DialogHeader>
          
          {selectedPayout && (
            <div className="space-y-4 mt-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500">Amount</p>
                    <p className="font-bold text-xl text-slate-900">₹{selectedPayout.amount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Method</p>
                    <p className="font-semibold text-slate-900">{selectedPayout.paymentMethod || "Not specified"}</p>
                  </div>
                </div>
                {selectedPayout.upiId && (
                  <div className="mt-3">
                    <p className="text-xs text-slate-500">UPI ID</p>
                    <p className="font-mono text-slate-900">{selectedPayout.upiId}</p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Update Status</Label>
                <Select value={payoutStatus} onValueChange={setPayoutStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Admin Notes</Label>
                <Textarea
                  placeholder="Add notes about this payout..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                />
              </div>
            </div>
          )}

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsPayoutDialogOpen(false)}>Cancel</Button>
            <Button onClick={submitPayoutUpdate} disabled={updatePayoutMutation.isPending}>
              {updatePayoutMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Update Payout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
