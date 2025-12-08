import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, MapPin, CreditCard, ShieldCheck, Star, LogOut, FileText, Briefcase, Calendar, Clock, Globe, Bell } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "wouter";
import { Switch } from "@/components/ui/switch";

export default function WorkerProfile() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  const MenuLink = ({ icon: Icon, label, subLabel, onClick }: any) => (
      <button onClick={onClick} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 text-left">
          <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-500">
                  <Icon className="w-4 h-4" />
              </div>
              <div>
                  <p className="font-medium text-slate-900 text-sm">{label}</p>
                  {subLabel && <p className="text-xs text-slate-400">{subLabel}</p>}
              </div>
          </div>
      </button>
  );

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

        {/* Profile Settings */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-4 bg-slate-50/50 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Profile & Work</p>
            </div>
            <MenuLink icon={User} label="Edit Profile" subLabel="Personal details, photo" />
            <MenuLink icon={MapPin} label="Work Address" subLabel="Service area location" />
            <MenuLink icon={Briefcase} label="Skills & Services" subLabel="AC Repair, Installation" />
            <MenuLink icon={Calendar} label="Availability Schedule" subLabel="Mon-Fri, 9AM - 6PM" />
        </div>

        {/* Finance & App Settings */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-4 bg-slate-50/50 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Finance & Settings</p>
            </div>
             <MenuLink icon={CreditCard} label="Bank / UPI Details" subLabel="**** 1234" />
             <MenuLink icon={FileText} label="KYC Documents" subLabel="ID Card, Certificates" />
             <div className="flex items-center justify-between p-4 border-b border-slate-50">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-500">
                        <Bell className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-slate-900 text-sm">Notifications</span>
                 </div>
                 <Switch defaultChecked />
             </div>
             <div className="flex items-center justify-between p-4 border-b border-slate-50">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-500">
                        <Globe className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-slate-900 text-sm">Language</span>
                 </div>
                 <span className="text-xs text-slate-500">English</span>
             </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
             <Button 
                variant="outline" 
                className="h-12 border-red-100 text-red-600 hover:bg-red-50 bg-white"
                onClick={() => {
                    logout();
                    setLocation("/auth");
                }}
            >
                <LogOut className="w-4 h-4 mr-2" /> Logout
             </Button>
             <p className="text-center text-xs text-slate-400">Version 2.1.0 • ServiceHub Pro</p>
        </div>
      </div>
    </div>
  );
}
