import { Button } from "@/components/ui/button";
import { Users, ShoppingBag, TrendingUp, AlertCircle } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="pb-20">
      <div className="bg-white px-6 py-6 border-b border-slate-100">
        <h1 className="text-xl font-bold text-slate-900">Admin Overview</h1>
        <p className="text-sm text-slate-500">Welcome back, Admin</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                <Users className="w-6 h-6 text-blue-600 mb-2" />
                <p className="text-2xl font-bold text-slate-900">1,240</p>
                <p className="text-xs text-slate-500 font-medium">Total Users</p>
            </div>
            <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
                <ShoppingBag className="w-6 h-6 text-green-600 mb-2" />
                <p className="text-2xl font-bold text-slate-900">856</p>
                <p className="text-xs text-slate-500 font-medium">Total Bookings</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100">
                <TrendingUp className="w-6 h-6 text-purple-600 mb-2" />
                <p className="text-2xl font-bold text-slate-900">$45k</p>
                <p className="text-xs text-slate-500 font-medium">Total Revenue</p>
            </div>
             <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100">
                <AlertCircle className="w-6 h-6 text-orange-600 mb-2" />
                <p className="text-2xl font-bold text-slate-900">12</p>
                <p className="text-xs text-slate-500 font-medium">Pending KYC</p>
            </div>
        </div>

        {/* Recent Activity */}
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-slate-900">Recent Activity</h2>
                <Button variant="ghost" size="sm" className="text-primary text-xs">View All</Button>
            </div>
            
            <div className="space-y-3">
                {[1,2,3].map(i => (
                    <div key={i} className="flex items-center gap-4 p-3 bg-white rounded-xl border border-slate-100">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                            JD
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-slate-900">New worker registration</p>
                            <p className="text-xs text-slate-500">John Doe uploaded KYC docs</p>
                        </div>
                        <Button size="sm" variant="outline" className="h-8 text-xs">Review</Button>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
