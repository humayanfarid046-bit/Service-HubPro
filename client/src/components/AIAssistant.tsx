import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Sparkles, Send, Mic, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", role: "assistant", text: "Hi! I'm your ServiceHub Assistant. Ask me anything about our services or your bookings." }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMsg: Message = { id: Date.now().toString(), role: "user", text: inputValue };
    setMessages(prev => [...prev, newMsg]);
    setInputValue("");

    // Mock AI Response
    setTimeout(() => {
      const responses = [
        "I can help you book an AC repair service. Would you like to see available slots?",
        "Your last booking for Home Cleaning is scheduled for tomorrow at 2 PM.",
        "Our deep cleaning package includes floor scrubbing, bathroom sanitization, and kitchen degreasing.",
        "Workers usually arrive within 15 minutes of the scheduled time."
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", text: randomResponse }]);
    }, 1000);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute bottom-24 right-4 z-50 w-14 h-14 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full shadow-xl shadow-indigo-500/40 flex items-center justify-center text-white"
        >
          <Sparkles className="w-6 h-6" />
        </motion.button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[80vh] rounded-t-[2rem] p-0 flex flex-col bg-slate-50 border-t-0 md:max-w-md md:mx-auto">
        <div className="bg-white px-6 py-4 rounded-t-[2rem] shadow-sm border-b border-slate-100 flex justify-between items-center sticky top-0 z-10">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <Sparkles className="w-5 h-5 fill-indigo-600/20" />
                </div>
                <div>
                    <SheetTitle className="text-lg">AI Assistant</SheetTitle>
                    <SheetDescription className="text-xs">Always here to help</SheetDescription>
                </div>
            </div>
            {/* Close button is handled by Sheet primitive but we can add custom one if needed or rely on default */}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
                <div key={msg.id} className={cn("flex w-full", msg.role === "user" ? "justify-end" : "justify-start")}>
                    <div className={cn(
                        "max-w-[80%] p-3 rounded-2xl text-sm",
                        msg.role === "user" 
                            ? "bg-slate-900 text-white rounded-br-none" 
                            : "bg-white border border-slate-100 text-slate-700 shadow-sm rounded-bl-none"
                    )}>
                        {msg.text}
                    </div>
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white border-t border-slate-100 pb-8">
            <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-full">
                <Button size="icon" variant="ghost" className="rounded-full text-slate-500 hover:text-slate-900">
                    <Mic className="w-5 h-5" />
                </Button>
                <Input 
                    className="flex-1 bg-transparent border-0 shadow-none focus-visible:ring-0 h-10" 
                    placeholder="Ask anything..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <Button size="icon" className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleSend}>
                    <Send className="w-4 h-4" />
                </Button>
            </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
