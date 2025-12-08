import { AdminLayout } from "@/components/layout/AdminLayout";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, TrendingUp, Calendar, ArrowRight, CreditCard, DollarSign } from "lucide-react";

const EARNINGS_HISTORY = [
  { id: 1, date: "Today, 2:30 PM", service: "AC Repair", amount: 450, status: "Credit" },
  { id: 2, date: "Yesterday, 10:00 AM", service: "AC Service", amount: 350, status: "Credit" },
  { id: 3, date: "12 May, 2024", service: "Weekly Payout", amount: -2500, status: "Debit" },
];

export default function WorkerEarnings() {
  return (
    <div className="pb-20 bg-slate-50 min-h-full">
      <div className="bg-slate-900 text-white p-6 pb-12 rounded-b-[2rem]">
        <h1 className="text-2xl font-bold mb-1">My Earnings</h1>
        <p className="text-slate-400 text-sm">Track your income and payouts</p>
        
        <div className="mt-8 grid grid-cols-2 gap-4">
             <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                <p className="text-slate-300 text-xs font-medium uppercase mb-1">Today</p>
                <p className="text-2xl font-bold">$450.00</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                <p className="text-slate-300 text-xs font-medium uppercase mb-1">This Week</p>
                <p className="text-2xl font-bold">$1,240.00</p>
            </div>
        </div>

        <div className="mt-4 bg-emerald-500/20 border border-emerald-500/30 p-4 rounded-2xl flex items-center justify-between backdrop-blur-sm">
            <div>
                <p className="text-emerald-300 text-xs font-bold uppercase">Available for Payout</p>
                <p className="text-xl font-bold text-white">$850.00</p>
            </div>
            <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white border-0">
                Request Payout
            </Button>
        </div>
      </div>

      <div className="px-6 -mt-6">
        <h3 className="font-bold text-slate-900 mb-4 px-2">Recent Transactions</h3>
        <div className="space-y-4">
            {EARNINGS_HISTORY.map((txn) => (
                <div key={txn.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${txn.status === 'Credit' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                            {txn.status === 'Credit' ? <DollarSign className="w-5 h-5" /> : <Wallet className="w-5 h-5" />}
                        </div>
                        <div>
                            <p className="font-bold text-slate-900 text-sm">{txn.service}</p>
                            <p className="text-xs text-slate-500">{txn.date}</p>
                        </div>
                    </div>
                    <span className={`font-bold ${txn.status === 'Credit' ? 'text-green-600' : 'text-slate-900'}`}>
                        {txn.status === 'Credit' ? '+' : ''}{txn.amount}
                    </span>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}
