import { MOCK_ORDERS } from "@/lib/mock-data";
import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Phone, MessageSquare, Clock, CheckCircle2, Navigation, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const TIMELINE_STEPS = ["Pending", "Accepted", "On the Way", "Working", "Completed"];

export default function WorkerJobDetails() {
  const [match, params] = useRoute("/worker/job/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const orderId = params?.id;
  
  // In a real app, fetch order by ID. For now, find in mock data or use a dummy if not found
  const order = MOCK_ORDERS.find(o => o.id === orderId) || MOCK_ORDERS[0];
  
  const [currentStatus, setCurrentStatus] = useState(order.status === "Pending" ? "Pending" : "Accepted");

  const handleStatusUpdate = () => {
    const currentIndex = TIMELINE_STEPS.indexOf(currentStatus);
    if (currentIndex < TIMELINE_STEPS.length - 1) {
        const nextStatus = TIMELINE_STEPS[currentIndex + 1];
        setCurrentStatus(nextStatus);
        toast({
            title: "Status Updated",
            description: `Job marked as ${nextStatus}`,
        });
    }
  };

  const isCompleted = currentStatus === "Completed";

  return (
    <div className="pb-24 bg-white min-h-full">
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 px-6 py-4 flex items-center gap-4 border-b border-slate-100">
        <button onClick={() => setLocation("/worker/dashboard")} className="p-2 -ml-2 hover:bg-slate-50 rounded-full">
          <ArrowLeft className="w-6 h-6 text-slate-900" />
        </button>
        <div>
            <h1 className="text-lg font-bold text-slate-900">Job #{order.id}</h1>
            <p className="text-xs text-slate-500">Service Details</p>
        </div>
        <div className="ml-auto">
             <span className={cn(
                "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide",
                isCompleted ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
            )}>
                {currentStatus}
            </span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Customer Info Card */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                    {order.customerName.charAt(0)}
                </div>
                <div>
                    <h3 className="font-bold text-slate-900">{order.customerName}</h3>
                    <p className="text-sm text-slate-500">+1 234 567 890</p>
                </div>
                <div className="ml-auto flex gap-2">
                    <Button size="icon" variant="outline" className="rounded-full w-10 h-10 border-slate-200">
                        <MessageSquare className="w-5 h-5 text-slate-600" />
                    </Button>
                    <Button size="icon" className="rounded-full w-10 h-10 bg-green-500 hover:bg-green-600 text-white">
                        <Phone className="w-5 h-5" />
                    </Button>
                </div>
            </div>
            
            <div className="h-px bg-slate-200" />
            
            <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">{order.address}</p>
                    <button className="text-xs text-blue-600 font-bold mt-1 flex items-center gap-1 hover:underline">
                        <Navigation className="w-3 h-3" /> Get Directions
                    </button>
                </div>
            </div>
        </div>

        {/* Job Details */}
        <div>
            <h3 className="font-bold text-slate-900 mb-3">Service Details</h3>
            <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex justify-between">
                    <span className="text-slate-600 text-sm">Service Type</span>
                    <span className="font-bold text-slate-900 text-sm">AC Repair & Service</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-slate-600 text-sm">Date & Time</span>
                    <span className="font-bold text-slate-900 text-sm">{order.date}, {order.time}</span>
                </div>
                 <div className="flex justify-between">
                    <span className="text-slate-600 text-sm">Payment Method</span>
                    <span className="font-bold text-slate-900 text-sm">{order.paymentMethod}</span>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                    <p className="text-xs font-bold text-yellow-800 mb-1">Customer Note:</p>
                    <p className="text-xs text-yellow-700">"Please bring an extra long ladder. The AC unit is quite high up."</p>
                </div>
            </div>
        </div>

        {/* Timeline Visualizer */}
        <div>
            <h3 className="font-bold text-slate-900 mb-4">Job Timeline</h3>
            <div className="relative pl-4 space-y-6 border-l-2 border-slate-100 ml-2">
                {TIMELINE_STEPS.map((step, index) => {
                    const stepIndex = TIMELINE_STEPS.indexOf(step);
                    const currentIndex = TIMELINE_STEPS.indexOf(currentStatus);
                    const isDone = stepIndex <= currentIndex;
                    const isCurrent = stepIndex === currentIndex;

                    return (
                        <div key={step} className="relative pl-6">
                            <div className={cn(
                                "absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 transition-colors",
                                isDone ? "bg-primary border-primary" : "bg-white border-slate-300",
                                isCurrent && "ring-4 ring-primary/20"
                            )} />
                            <p className={cn(
                                "text-sm font-medium transition-colors",
                                isDone ? "text-slate-900" : "text-slate-400"
                            )}>{step}</p>
                            {isCurrent && (
                                <p className="text-xs text-primary font-medium mt-1">Current Status</p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-slate-100 md:absolute md:rounded-b-[2rem] z-20">
        {!isCompleted ? (
            <Button 
                className="w-full h-14 text-lg rounded-xl shadow-lg shadow-primary/25 font-bold bg-slate-900 hover:bg-slate-800"
                onClick={handleStatusUpdate}
            >
                {currentStatus === "Pending" ? "Accept Job" : 
                 currentStatus === "Accepted" ? "Start Travel (On the Way)" :
                 currentStatus === "On the Way" ? "Start Working" :
                 "Mark as Completed"}
            </Button>
        ) : (
            <Button className="w-full h-14 text-lg rounded-xl bg-green-500 hover:bg-green-600 text-white cursor-default">
                Job Completed <CheckCircle2 className="w-5 h-5 ml-2" />
            </Button>
        )}
      </div>
    </div>
  );
}
