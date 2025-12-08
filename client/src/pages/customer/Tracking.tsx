import { MOCK_ORDERS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Phone, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CustomerBookings() {
  const activeOrders = MOCK_ORDERS;

  return (
    <div className="pb-20 px-6 pt-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">My Bookings</h1>

      <div className="space-y-4">
        {activeOrders.map((order) => (
          <div key={order.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">
                    {order.serviceId === "ac-repair" ? "AC Repair" : "Home Cleaning"}
                </h3>
                <p className="text-sm text-slate-500">{order.id}</p>
              </div>
              <span className={cn(
                "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide",
                order.status === "On the Way" ? "bg-blue-100 text-blue-700" :
                order.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                "bg-green-100 text-green-700"
              )}>
                {order.status}
              </span>
            </div>

            <div className="flex items-center gap-4 py-2">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock className="w-4 h-4 text-slate-400" />
                    {order.date}, {order.time}
                </div>
            </div>

            {order.workerId && (
                <div className="bg-slate-50 p-3 rounded-xl flex items-center gap-3">
                    <img src="https://i.pravatar.cc/150?u=worker1" className="w-10 h-10 rounded-full border border-white shadow-sm" alt="Worker" />
                    <div className="flex-1">
                        <p className="text-sm font-bold text-slate-900">John Doe</p>
                        <p className="text-xs text-slate-500">Service Pro • ⭐ 4.8</p>
                    </div>
                    <div className="flex gap-2">
                        <Button size="icon" variant="outline" className="h-8 w-8 rounded-full border-slate-200">
                            <MessageSquare className="w-4 h-4 text-slate-600" />
                        </Button>
                        <Button size="icon" className="h-8 w-8 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-md shadow-green-500/20">
                            <Phone className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}

            <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1 rounded-xl border-slate-200">Track Order</Button>
                <Button variant="ghost" className="text-slate-500 text-xs">Need Help?</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
