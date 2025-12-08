import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, CreditCard, ArrowUpRight, ArrowDownRight, Download } from "lucide-react";

const TRANSACTIONS = [
  { id: "TXN-1", type: "Payment", method: "Razorpay", amount: 499, status: "Success", date: "2024-05-20" },
  { id: "TXN-2", type: "Payout", method: "Bank Transfer", amount: -250, status: "Processing", date: "2024-05-19" },
  { id: "TXN-3", type: "Payment", method: "COD", amount: 899, status: "Pending", date: "2024-05-18" },
];

export default function AdminFinance() {
  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Payments & Finance</h1>
          <p className="text-slate-500">Track revenue, payouts, and transactions.</p>
        </div>
        <Button variant="outline"><Download className="w-4 h-4 mr-2" /> Download Report</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-emerald-50 border-emerald-100">
            <CardContent className="p-6">
                <p className="text-emerald-600 font-medium mb-1">Total Revenue</p>
                <h3 className="text-3xl font-bold text-slate-900">$45,231.89</h3>
            </CardContent>
        </Card>
        <Card className="bg-blue-50 border-blue-100">
            <CardContent className="p-6">
                <p className="text-blue-600 font-medium mb-1">Pending Payouts</p>
                <h3 className="text-3xl font-bold text-slate-900">$1,250.00</h3>
            </CardContent>
        </Card>
        <Card className="bg-orange-50 border-orange-100">
            <CardContent className="p-6">
                <p className="text-orange-600 font-medium mb-1">COD Pending</p>
                <h3 className="text-3xl font-bold text-slate-900">$890.00</h3>
            </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Recent Transactions</CardTitle></CardHeader>
        <CardContent>
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium">
                    <tr>
                        <th className="px-6 py-4">Transaction ID</th>
                        <th className="px-6 py-4">Type</th>
                        <th className="px-6 py-4">Method</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Amount</th>
                        <th className="px-6 py-4">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {TRANSACTIONS.map((txn) => (
                        <tr key={txn.id}>
                            <td className="px-6 py-4 font-mono text-slate-500">{txn.id}</td>
                            <td className="px-6 py-4 font-medium">{txn.type}</td>
                            <td className="px-6 py-4">{txn.method}</td>
                            <td className="px-6 py-4">{txn.date}</td>
                            <td className={`px-6 py-4 font-bold ${txn.amount > 0 ? "text-emerald-600" : "text-slate-900"}`}>
                                {txn.amount > 0 ? "+" : ""}{txn.amount}
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                    txn.status === "Success" ? "bg-emerald-100 text-emerald-700" :
                                    txn.status === "Processing" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"
                                }`}>
                                    {txn.status}
                                </span>
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
