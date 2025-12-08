import { SERVICES, Service } from "@/lib/mock-data";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Sparkles, Star } from "lucide-react";
import { useState } from "react";

export default function CustomerHome() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredServices = SERVICES.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pb-20">
      {/* Header Section */}
      <div className="bg-primary pt-8 pb-12 px-6 rounded-b-[2rem] shadow-lg shadow-primary/20">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-primary-foreground/80 text-sm font-medium">Location</p>
            <div className="flex items-center text-white font-semibold gap-1">
              <MapPin className="w-4 h-4" />
              <span>New York, USA</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
            <span className="text-white font-bold">AS</span>
          </div>
        </div>

        <div className="relative">
          <h1 className="text-2xl font-bold text-white mb-6 leading-tight">
            What service do you <br/> need today?
          </h1>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-primary transition-colors" />
            <Input 
              className="w-full h-14 pl-12 rounded-2xl bg-white border-0 shadow-xl shadow-black/5 text-slate-900 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-white/50"
              placeholder="Search for 'AC Repair'..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* AI Suggestion Banner */}
      <div className="px-6 -mt-6 mb-8 relative z-10">
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-4 text-white shadow-lg shadow-indigo-500/30 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-xs font-bold text-indigo-100 uppercase tracking-wider">AI Assistant</span>
            </div>
            <p className="text-sm font-medium">"Your AC might need servicing before summer!"</p>
          </div>
          <Button size="sm" variant="secondary" className="h-8 text-xs bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-md">
            Check
          </Button>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="px-6 space-y-6">
        <div className="flex justify-between items-end">
          <h2 className="text-lg font-bold text-slate-900">Categories</h2>
          <button className="text-sm text-primary font-medium">See All</button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {filteredServices.map((service, idx) => (
            <ServiceCard 
              key={service.id} 
              service={service} 
              index={idx}
              onClick={() => setLocation(`/customer/book/${service.id}`)} 
            />
          ))}
        </div>
      </div>
      
      {/* Offers Section */}
      <div className="px-6 mt-8 mb-4">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Special Offers</h2>
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-orange-800 font-bold text-lg">25% OFF</p>
              <p className="text-orange-600/80 text-sm">On your first home cleaning</p>
            </div>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl h-10 shadow-lg shadow-orange-500/20">
              Claim
            </Button>
        </div>
      </div>
    </div>
  );
}

function ServiceCard({ service, onClick, index }: { service: Service; onClick: () => void; index: number }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={onClick}
      className="flex flex-col items-start p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all active:scale-95 text-left h-full"
    >
      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", service.color)}>
        <service.icon className="w-6 h-6" />
      </div>
      <h3 className="font-bold text-slate-900 mb-1">{service.title}</h3>
      <p className="text-xs text-slate-500 line-clamp-2 mb-3">{service.description}</p>
      
      <div className="mt-auto w-full flex items-center justify-between pt-2 border-t border-slate-50">
        <span className="text-sm font-semibold text-slate-900">${service.price}</span>
        <div className="flex items-center gap-1 text-[10px] font-medium text-slate-500">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            {service.rating}
        </div>
      </div>
    </motion.button>
  );
}
