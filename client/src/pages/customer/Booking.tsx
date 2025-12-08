import { SERVICES } from "@/lib/mock-data";
import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, MapPin, Tag, CreditCard, StickyNote, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function BookingPage() {
  const [match, params] = useRoute("/customer/book/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const service = SERVICES.find((s) => s.id === params?.id);
  const [step, setStep] = useState(1);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [coupon, setCoupon] = useState("");

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
        <div>
            <h1 className="text-lg font-bold">Book Service</h1>
            <p className="text-xs text-slate-500">Step {step} of 2</p>
        </div>
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              {/* Service Summary */}
              <div className="bg-slate-50 p-6 rounded-2xl flex items-start gap-4 border border-slate-100">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${service.color}`}>
                    <service.icon className="w-7 h-7" />
                </div>
                <div>
                    <h2 className="font-bold text-lg text-slate-900">{service.title}</h2>
                    <p className="text-slate-500 text-sm mt-1">{service.description}</p>
                    <p className="text-primary font-bold mt-2 text-lg">${service.price}</p>
                </div>
              </div>

              {/* Sub-Service Selection (Mock) */}
              <div className="space-y-3">
                 <Label className="text-base font-bold text-slate-900">Select Package</Label>
                 <div className="space-y-2">
                    <div className="flex items-center justify-between p-4 rounded-xl border-2 border-primary bg-primary/5 cursor-pointer">
                        <span className="font-medium text-slate-900">Standard Service</span>
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 opacity-60 cursor-pointer hover:opacity-100">
                        <span className="font-medium text-slate-900">Premium Deep Clean</span>
                        <span className="text-sm text-slate-500">+$50</span>
                    </div>
                 </div>
              </div>

              {/* Date & Time */}
              <div className="space-y-4">
                <Label className="text-base font-bold text-slate-900">Schedule</Label>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-xs text-slate-500">Date</Label>
                        <Input type="date" className="h-12 rounded-xl bg-slate-50 border-slate-200" onChange={(e) => setDate(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                         <Label className="text-xs text-slate-500">Time</Label>
                        <Input type="time" className="h-12 rounded-xl bg-slate-50 border-slate-200" onChange={(e) => setTime(e.target.value)} />
                    </div>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-4">
                <Label className="text-base font-bold text-slate-900">Address</Label>
                <div className="flex items-center gap-3 p-4 border border-slate-200 rounded-2xl bg-white shadow-sm hover:border-primary transition-colors cursor-pointer">
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

               {/* Extra Details */}
               <div className="space-y-4">
                 <Label className="text-base font-bold text-slate-900">Additional Info</Label>
                 <Textarea 
                    placeholder="Any specific instructions for the worker? (e.g. key under mat, beware of dog)" 
                    className="rounded-xl bg-slate-50 border-slate-200 min-h-[100px]"
                 />
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
               {/* Coupon */}
               <div className="space-y-3">
                  <Label className="text-base font-bold text-slate-900">Offers & Coupons</Label>
                  <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <Input 
                            placeholder="Enter coupon code" 
                            className="pl-9 h-12 rounded-xl border-slate-200 bg-slate-50 uppercase"
                            value={coupon}
                            onChange={(e) => setCoupon(e.target.value)}
                        />
                      </div>
                      <Button variant="outline" className="h-12 px-6 rounded-xl border-slate-200 font-bold text-primary">Apply</Button>
                  </div>
               </div>

               {/* Bill Details */}
               <div className="space-y-4">
                <h3 className="font-bold text-slate-900 text-lg">Bill Details</h3>
                
                <div className="bg-slate-50 p-5 rounded-2xl space-y-3 border border-slate-100">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Service Total</span>
                        <span className="font-medium">${service.price}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Taxes & Fees</span>
                        <span className="font-medium">$10</span>
                    </div>
                    {coupon && (
                         <div className="flex justify-between text-sm text-emerald-600">
                            <span>Coupon Savings</span>
                            <span className="font-medium">-$0.00</span>
                        </div>
                    )}
                    <div className="h-px bg-slate-200 my-2" />
                    <div className="flex justify-between text-lg font-bold">
                        <span>Total Pay</span>
                        <span className="text-primary">${service.price + 10}</span>
                    </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-4">
                <h3 className="font-bold text-slate-900">Payment Method</h3>
                <div className="space-y-3">
                    {['Razorpay Secure', 'Cash on Delivery'].map((method) => (
                        <div key={method} className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl hover:border-primary hover:bg-blue-50/50 transition-colors cursor-pointer group bg-white">
                            <div className="w-5 h-5 rounded-full border-2 border-slate-300 group-hover:border-primary flex items-center justify-center">
                                <div className="w-2.5 h-2.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <span className="font-medium text-slate-700">{method}</span>
                            {method.includes('Razorpay') && <CreditCard className="w-4 h-4 ml-auto text-slate-400" />}
                        </div>
                    ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-slate-100 md:absolute md:rounded-b-[2rem] z-20">
        {step === 1 ? (
            <Button className="w-full h-14 text-lg rounded-xl shadow-lg shadow-primary/25 font-bold" onClick={() => setStep(2)}>
                Continue
            </Button>
        ) : (
            <div className="flex gap-4">
                <Button variant="outline" className="h-14 w-14 rounded-xl border-slate-200" onClick={() => setStep(1)}>
                    <ArrowLeft className="w-6 h-6" />
                </Button>
                <Button className="flex-1 h-14 text-lg rounded-xl shadow-lg shadow-primary/25 bg-slate-900 hover:bg-slate-800 font-bold" onClick={handleBook}>
                    Pay & Book
                </Button>
            </div>
        )}
      </div>
    </div>
  );
}
