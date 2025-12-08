import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MessageCircle, Phone, Mail, HelpCircle } from "lucide-react";

export default function CustomerSupport() {
  return (
    <div className="pb-20 min-h-full bg-slate-50">
      <div className="bg-slate-900 text-white p-6 pb-12 rounded-b-[2rem]">
        <h1 className="text-2xl font-bold mb-2">Help Center</h1>
        <p className="text-slate-400 text-sm mb-6">How can we help you today?</p>
        
        <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input 
                className="bg-white/10 border-0 text-white placeholder:text-slate-400 pl-10 h-12 rounded-xl backdrop-blur-md focus-visible:ring-1 focus-visible:ring-white/30" 
                placeholder="Search for topics..." 
            />
        </div>
      </div>

      <div className="px-6 -mt-6">
        {/* Quick Actions */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 grid grid-cols-2 gap-4 mb-6">
            <Button variant="ghost" className="h-auto py-4 flex flex-col gap-2 hover:bg-slate-50 rounded-xl">
                <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
                    <MessageCircle className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-700">Live Chat</span>
            </Button>
            <Button variant="ghost" className="h-auto py-4 flex flex-col gap-2 hover:bg-slate-50 rounded-xl">
                <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                    <Phone className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-700">Call Us</span>
            </Button>
        </div>

        {/* FAQs */}
        <h3 className="font-bold text-slate-900 mb-4 px-2">Frequently Asked Questions</h3>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden px-2">
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border-b-slate-50">
                    <AccordionTrigger className="hover:no-underline px-4 py-4 text-sm font-medium text-slate-700">
                        How do I cancel a booking?
                    </AccordionTrigger>
                    <AccordionContent className="px-4 text-slate-500 text-sm">
                        You can cancel your booking from the "My Bookings" section up to 2 hours before the scheduled time for a full refund.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2" className="border-b-slate-50">
                    <AccordionTrigger className="hover:no-underline px-4 py-4 text-sm font-medium text-slate-700">
                        Is it safe to pay online?
                    </AccordionTrigger>
                    <AccordionContent className="px-4 text-slate-500 text-sm">
                        Yes, all payments are processed securely via Razorpay. We do not store your card details.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3" className="border-b-slate-50">
                    <AccordionTrigger className="hover:no-underline px-4 py-4 text-sm font-medium text-slate-700">
                        How are workers verified?
                    </AccordionTrigger>
                    <AccordionContent className="px-4 text-slate-500 text-sm">
                        All our professionals undergo a strict background check and KYC verification process before joining.
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>

        <div className="mt-8 text-center">
            <p className="text-sm text-slate-500 mb-4">Still need help?</p>
            <Button variant="outline" className="rounded-full px-6 border-slate-200">
                Raise a Ticket
            </Button>
        </div>
      </div>
    </div>
  );
}
