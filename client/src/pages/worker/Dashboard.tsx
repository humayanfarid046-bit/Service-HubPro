import { MOCK_ORDERS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Clock, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function WorkerDashboard() {
  const { user } = useAuth();
  const [isOnline, setIsOnline] = useState(true);
  const { toast } = useToast();

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    toast({
        title: "Status Updated",
        description: `Order ${orderId} marked as ${newStatus}`,
    });
  };

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-slate-900 text-white pt-8 pb-16 px-6 rounded-b-[2rem]">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold">Partner Dashboard</h1>
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-md">
                <div className={cn("w-2.5 h-2.5 rounded-full", isOnline ? "bg-green-400" : "bg-slate-400")} />
                <span className="text-xs font-medium">{isOnline ? "Online" : "Offline"}</span>
            </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                <p className="text-slate-400 text-xs font-medium uppercase">Today's Earnings</p>
                <p className="text-2xl font-bold mt-1">$128.50</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                <p className="text-slate-400 text-xs font-medium uppercase">Jobs Completed</p>
                <p className="text-2xl font-bold mt-1">4</p>
            </div>
        </div>
      </div>

      <div className="px-6 -mt-8">
        <h2 className="text-lg font-bold text-slate-900 mb-4 px-2">Assigned Jobs</h2>
        <div className="space-y-4">
            {MOCK_ORDERS.filter(o => o.workerId === "worker1").map((order) => (
                <div key={order.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                    <div className="flex justify-between items-start border-b border-slate-50 pb-3">
                        <div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">ID: {order.id}</span>
                            <h3 className="font-bold text-slate-900 text-lg mt-1">AC Repair & Service</h3>
                        </div>
                        <div className="text-right">
                             <p className="font-bold text-primary text-lg">${order.total}</p>
                             <p className="text-xs text-slate-400">COD</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-start gap-3">
                            <Clock className="w-5 h-5 text-slate-400 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-slate-900">Today, {order.time}</p>
                                <p className="text-xs text-slate-500">Expected duration: 2 hrs</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-slate-900">{order.address}</p>
                                <p className="text-xs text-blue-600 font-medium mt-1 flex items-center gap-1">
                                    <Navigation className="w-3 h-3" /> 2.5 km away
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-2 flex gap-3">
                        <Button className="flex-1 bg-slate-900 hover:bg-slate-800 rounded-xl" onClick={() => handleStatusUpdate(order.id, "Working")}>
                            Start Job
                        </Button>
                         <Button variant="outline" size="icon" className="w-12 h-10 rounded-xl border-slate-200">
                            <Navigation className="w-5 h-5 text-slate-600" />
                        </Button>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}
