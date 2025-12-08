import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, MapPin, CreditCard, ShieldCheck, Star, LogOut, FileText } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "wouter";

export default function WorkerProfile() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  return (
    <div className="pb-20 bg-slate-50 min-h-full">
      <div className="bg-white p-6 pb-8 rounded-b-[2rem] shadow-sm border-b border-slate-100">
        <div className="flex flex-col items-center text-center">
            <div className="relative">
                <Avatar className="w-24 h-24 border-4 border-slate-50 shadow-lg mb-4">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="bg-slate-900 text-white text-2xl">{user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="absolute bottom-4 right-0 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white">
                    Verified
                </div>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">{user?.name}</h1>
            <p className="text-slate-500 text-sm">AC Repair Specialist • 3 Years Exp.</p>
            
            <div className="flex gap-2 mt-3">
                <Badge variant="secondary" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-100 gap-1">
                    <Star className="w-3 h-3 fill-current" /> 4.8 Rating
                </Badge>
                <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                    145 Jobs Done
                </Badge>
            </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Verification Status */}
        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            <div className="flex-1">
                <p className="font-bold text-emerald-900 text-sm">KYC Verified</p>
                <p className="text-xs text-emerald-700">Your documents are approved. You can accept jobs.</p>
            </div>
        </div>

        {/* Menu */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-4 border-b border-slate-50">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Personal Details</p>
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-slate-400" />
                        <div>
                            <p className="text-xs text-slate-500">Full Name</p>
                            <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-slate-400" />
                        <div>
                            <p className="text-xs text-slate-500">Service Area</p>
                            <p className="text-sm font-medium text-slate-900">New York, USA</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Payout Details</p>
                 <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-slate-400" />
                    <div>
                        <p className="text-xs text-slate-500">Bank Account</p>
                        <p className="text-sm font-medium text-slate-900">**** **** **** 1234</p>
                    </div>
                    <Button variant="ghost" size="sm" className="ml-auto text-primary text-xs">Edit</Button>
                </div>
            </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
             <Button variant="outline" className="h-12 border-slate-200 text-slate-600">
                <FileText className="w-4 h-4 mr-2" /> Terms
             </Button>
             <Button 
                variant="outline" 
                className="h-12 border-red-100 text-red-600 hover:bg-red-50"
                onClick={() => {
                    logout();
                    setLocation("/auth");
                }}
            >
                <LogOut className="w-4 h-4 mr-2" /> Logout
             </Button>
        </div>
      </div>
    </div>
  );
}
