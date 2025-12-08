import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { MessageSquare, Phone } from "lucide-react";

export default function WorkerSupport() {
  return (
    <div className="pb-20 min-h-full bg-slate-50">
      <div className="bg-slate-900 text-white p-6 pb-12 rounded-b-[2rem]">
        <h1 className="text-2xl font-bold mb-2">Partner Support</h1>
        <p className="text-slate-400 text-sm">We are here to help you succeed.</p>
      </div>

      <div className="px-6 -mt-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center space-y-4 mb-6">
            <h3 className="font-bold text-slate-900">Contact Admin</h3>
            <p className="text-sm text-slate-500">Facing issues with a job or app?</p>
            <div className="flex gap-3 justify-center">
                 <Button className="bg-slate-900 text-white rounded-xl">
                    <MessageSquare className="w-4 h-4 mr-2" /> Chat
                </Button>
                <Button variant="outline" className="border-slate-200 rounded-xl">
                    <Phone className="w-4 h-4 mr-2" /> Call
                </Button>
            </div>
        </div>

        <h3 className="font-bold text-slate-900 mb-4 px-2">Common Questions</h3>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden px-2">
             <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border-b-slate-50">
                    <AccordionTrigger className="hover:no-underline px-4 py-4 text-sm font-medium text-slate-700">
                        When will I receive my payout?
                    </AccordionTrigger>
                    <AccordionContent className="px-4 text-slate-500 text-sm">
                        Payouts are processed weekly every Monday for the previous week's earnings.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2" className="border-b-slate-50">
                    <AccordionTrigger className="hover:no-underline px-4 py-4 text-sm font-medium text-slate-700">
                        How to change my service area?
                    </AccordionTrigger>
                    <AccordionContent className="px-4 text-slate-500 text-sm">
                        Go to Profile &gt; Personal Details to update your service location preferences.
                    </AccordionContent>
                </AccordionItem>
             </Accordion>
        </div>
      </div>
    </div>
  );
}
