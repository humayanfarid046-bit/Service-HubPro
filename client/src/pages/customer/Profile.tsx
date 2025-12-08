import { AdminLayout } from "@/components/layout/AdminLayout";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, MapPin, Wallet, Bell, Globe, LogOut, ChevronRight, CreditCard, Shield } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";

export default function CustomerProfile() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  return (
    <div className="pb-20 bg-slate-50 min-h-full">
      {/* Header Profile Section */}
      <div className="bg-white p-6 pb-8 rounded-b-[2rem] shadow-sm border-b border-slate-100">
        <div className="flex items-center gap-4 mb-6">
            <Avatar className="w-20 h-20 border-4 border-slate-50 shadow-lg">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-primary text-white text-xl">
                    {user?.name?.charAt(0)}
                </AvatarFallback>
            </Avatar>
            <div>
                <h1 className="text-2xl font-bold text-slate-900">{user?.name}</h1>
                <p className="text-slate-500">+1 234 567 890</p>
                <div className="flex items-center gap-1 mt-1 text-emerald-600 text-sm font-medium">
                    <Shield className="w-3 h-3 fill-current" /> Verified Customer
                </div>
            </div>
        </div>

        {/* Wallet Card */}
        <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-xl shadow-slate-900/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Wallet className="w-24 h-24" />
            </div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Wallet Balance</p>
            <h2 className="text-3xl font-bold mb-4">$124.50</h2>
            <div className="flex gap-3">
                <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-md h-8 text-xs">
                    <CreditCard className="w-3 h-3 mr-1.5" /> Top Up
                </Button>
                <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-md h-8 text-xs">
                    History
                </Button>
            </div>
        </div>
      </div>

      {/* Menu Options */}
      <div className="p-6 space-y-6">
        {/* Account Settings */}
        <section>
            <h3 className="text-sm font-bold text-slate-900 mb-3 px-2">Account</h3>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <MenuLink icon={MapPin} label="Saved Addresses" subLabel="Home, Office" onClick={() => {}} />
                <MenuLink icon={User} label="Edit Profile" onClick={() => {}} />
                <MenuLink icon={Bell} label="Notifications" onClick={() => {}} />
            </div>
        </section>

        {/* App Settings */}
        <section>
            <h3 className="text-sm font-bold text-slate-900 mb-3 px-2">Preferences</h3>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden p-4 space-y-4">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-600">
                            <Globe className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-slate-700">Language</span>
                    </div>
                    <span className="text-sm text-slate-400">English (US)</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-600">
                            <Bell className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-slate-700">Push Notifications</span>
                    </div>
                    <Switch defaultChecked />
                 </div>
            </div>
        </section>

        <Button 
            variant="ghost" 
            className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 h-12 rounded-xl font-medium"
            onClick={() => {
                logout();
                setLocation("/auth");
            }}
        >
            <LogOut className="w-4 h-4 mr-2" /> Log Out
        </Button>
        
        <p className="text-center text-xs text-slate-400 pb-4">Version 1.0.2 • ServiceHub Pro</p>
      </div>
    </div>
  );
}

function MenuLink({ icon: Icon, label, subLabel, onClick }: { icon: any, label: string, subLabel?: string, onClick: () => void }) {
    return (
        <button onClick={onClick} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Icon className="w-4 h-4" />
                </div>
                <div className="text-left">
                    <p className="font-medium text-slate-900 text-sm">{label}</p>
                    {subLabel && <p className="text-xs text-slate-400">{subLabel}</p>}
                </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300" />
        </button>
    )
}
