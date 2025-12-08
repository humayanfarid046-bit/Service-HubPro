import { SERVICES } from "@/lib/mock-data";
import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, MapPin, Clock, CreditCard, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function BookingPage() {
  const [match, params] = useRoute("/customer/book/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const service = SERVICES.find((s) => s.id === params?.id);
  const [step, setStep] = useState(1);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  if (!service) return null;

  const handleBook = () => {
    toast({
      title: "Booking Confirmed!",
      description: "A worker will be assigned shortly.",
    });
    setLocation("/customer/bookings");
  };

  return (
    <div className="min-h-full bg-white pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 px-6 py-4 flex items-center gap-4 border-b border-slate-100">
        <button onClick={() => setLocation("/customer/home")} className="p-2 -ml-2 hover:bg-slate-50 rounded-full">
          <ArrowLeft className="w-6 h-6 text-slate-900" />
        </button>
        <h1 className="text-lg font-bold">Book {service.title}</h1>
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-slate-50 p-6 rounded-2xl flex items-start gap-4">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${service.color}`}>
                    <service.icon className="w-7 h-7" />
                </div>
                <div>
                    <h2 className="font-bold text-lg text-slate-900">{service.title}</h2>
                    <p className="text-slate-500 text-sm mt-1">{service.description}</p>
                    <p className="text-primary font-bold mt-2">${service.price}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-slate-900">Select Date & Time</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Date</Label>
                        <Input type="date" className="h-12 rounded-xl bg-slate-50 border-slate-200" onChange={(e) => setDate(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Time</Label>
                        <Input type="time" className="h-12 rounded-xl bg-slate-50 border-slate-200" onChange={(e) => setTime(e.target.value)} />
                    </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-slate-900">Service Location</h3>
                <div className="flex items-center gap-3 p-4 border border-slate-200 rounded-2xl bg-white shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                        <MapPin className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                        <p className="font-bold text-sm text-slate-900">Home</p>
                        <p className="text-xs text-slate-500 truncate">123 Green Park, New York, USA</p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-primary h-8 px-2">Change</Button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
               <div className="space-y-4">
                <h3 className="font-bold text-slate-900 text-lg">Payment Summary</h3>
                
                <div className="bg-slate-50 p-5 rounded-2xl space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Service Total</span>
                        <span className="font-medium">${service.price}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Convenience Fee</span>
                        <span className="font-medium">$10</span>
                    </div>
                    <div className="h-px bg-slate-200 my-2" />
                    <div className="flex justify-between text-lg font-bold">
                        <span>Total Amount</span>
                        <span className="text-primary">${service.price + 10}</span>
                    </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-slate-900">Payment Method</h3>
                <div className="space-y-3">
                    {['Credit Card', 'UPI', 'Cash on Delivery'].map((method) => (
                        <div key={method} className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl hover:border-primary hover:bg-blue-50/50 transition-colors cursor-pointer group">
                            <div className="w-5 h-5 rounded-full border-2 border-slate-300 group-hover:border-primary flex items-center justify-center">
                                <div className="w-2.5 h-2.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <span className="font-medium text-slate-700">{method}</span>
                        </div>
                    ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-slate-100 md:absolute md:rounded-b-[2rem]">
        {step === 1 ? (
            <Button className="w-full h-14 text-lg rounded-xl shadow-lg shadow-primary/25" onClick={() => setStep(2)}>
                Continue
            </Button>
        ) : (
            <Button className="w-full h-14 text-lg rounded-xl shadow-lg shadow-primary/25 bg-slate-900 hover:bg-slate-800" onClick={handleBook}>
                Confirm Booking
            </Button>
        )}
      </div>
    </div>
  );
}
