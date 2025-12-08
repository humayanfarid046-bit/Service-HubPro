import React from "react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  Home, Calendar, User, Settings, Sparkles, Menu, 
  Briefcase, DollarSign, LogOut, FileText, Bell, Star, 
  Wallet, HelpCircle, Navigation, CheckCircle2, Play, MapPin, X
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { AIAssistant } from "@/components/AIAssistant";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export function MobileLayout({ children, className }: { children: React.ReactNode; className?: string }) {
  const { role, user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFabOpen, setIsFabOpen] = useState(false);
  
  // Only show FAB on worker pages
  const showWorkerFab = role === "WORKER" && !location.includes("/profile") && !location.includes("/earnings");

  const SideMenuItem = ({ icon: Icon, label, path, onClick }: any) => (
    <button 
        onClick={() => {
            if (path) setLocation(path);
            if (onClick) onClick();
            setIsDrawerOpen(false);
        }}
        className="flex items-center gap-4 p-3 w-full hover:bg-slate-50 rounded-xl transition-colors text-slate-700"
    >
        <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
            <Icon className="w-5 h-5" />
        </div>
        <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 p-0 md:p-4 font-sans">
      <div className={cn("mobile-container bg-white w-full h-[100dvh] md:h-[800px] md:max-h-[90vh] md:rounded-[2rem] md:border-8 md:border-slate-900 overflow-hidden flex flex-col relative shadow-2xl", className)}>
        {/* Status Bar Area (Mock) */}
        <div className="h-8 bg-white w-full flex items-center justify-between px-6 select-none shrink-0 z-50 border-b border-slate-50">
          <span className="text-xs font-bold text-slate-900">9:41</span>
          <div className="flex gap-1.5">
            <div className="w-4 h-2.5 bg-slate-900 rounded-[1px]" />
            <div className="w-3 h-2.5 bg-slate-900 rounded-[1px]" />
            <div className="w-5 h-2.5 bg-slate-900 rounded-[2px]" />
          </div>
        </div>

        {/* Header with Menu Trigger (Only if logged in) */}
        {role && (
             <div className="absolute top-10 left-4 z-40">
                <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                    <SheetTrigger asChild>
                        <Button variant="secondary" size="icon" className="rounded-full h-10 w-10 bg-white/80 backdrop-blur-md shadow-sm border border-slate-200">
                            <Menu className="w-5 h-5 text-slate-700" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] p-0 flex flex-col h-full bg-white border-r-0 rounded-r-[2rem]">
                        {/* Drawer Header */}
                        <div className="p-6 bg-slate-900 text-white rounded-tr-[2rem]">
                            <div className="flex items-center gap-3 mb-4">
                                <Avatar className="w-14 h-14 border-2 border-white/20">
                                    <AvatarImage src={user?.avatar} />
                                    <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-bold text-lg leading-tight">{user?.name}</h3>
                                    <p className="text-xs text-slate-400">{role === "WORKER" ? "Verified Partner" : "Customer"}</p>
                                </div>
                            </div>
                        </div>

                        {/* Drawer Menu Items */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-1">
                            {role === "WORKER" ? (
                                <>
                                    <SideMenuItem icon={Home} label="Dashboard" path="/worker/dashboard" />
                                    <SideMenuItem icon={Briefcase} label="My Jobs" path="/worker/dashboard" />
                                    <SideMenuItem icon={DollarSign} label="Earnings" path="/worker/earnings" />
                                    <SideMenuItem icon={Star} label="Ratings & Reviews" path="/worker/profile" />
                                    <SideMenuItem icon={FileText} label="Documents (KYC)" path="/worker/profile" />
                                    <SideMenuItem icon={HelpCircle} label="Help & Support" path="/worker/support" />
                                </>
                            ) : (
                                <>
                                    <SideMenuItem icon={Home} label="Home" path="/customer/home" />
                                    <SideMenuItem icon={Calendar} label="Bookings" path="/customer/bookings" />
                                    <SideMenuItem icon={User} label="Profile" path="/customer/profile" />
                                    <SideMenuItem icon={HelpCircle} label="Support" path="/customer/support" />
                                </>
                            )}
                        </div>

                         {/* Drawer Footer */}
                         <div className="p-4 border-t border-slate-100">
                            <SideMenuItem 
                                icon={LogOut} 
                                label="Logout" 
                                onClick={() => {
                                    logout();
                                    setLocation("/auth");
                                }} 
                            />
                         </div>
                    </SheetContent>
                </Sheet>
             </div>
        )}
        
        {/* Main Content Area - Scrollable */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative bg-slate-50 scroll-smooth pb-24 hide-scrollbar">
          {children}
        </main>

        {/* AI Assistant Floating Button (Only for Customer) */}
        {role === "CUSTOMER" && <AIAssistant />}

        {/* Worker Quick Action FAB */}
        {showWorkerFab && (
             <div className="absolute bottom-24 right-4 z-50">
                <AnimatePresence>
                    {isFabOpen && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.8, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: 10 }}
                            className="absolute bottom-16 right-0 space-y-2 flex flex-col items-end mb-2"
                        >
                            <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-lg gap-2">
                                <CheckCircle2 className="w-4 h-4" /> Complete Job
                            </Button>
                            <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg gap-2">
                                <Play className="w-4 h-4" /> Start Job
                            </Button>
                            <Button size="sm" className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-full shadow-lg gap-2">
                                <MapPin className="w-4 h-4" /> Arrived
                            </Button>
                            <Button size="sm" className="bg-slate-900 hover:bg-slate-800 text-white rounded-full shadow-lg gap-2">
                                <Navigation className="w-4 h-4" /> Navigate
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
                
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsFabOpen(!isFabOpen)}
                    className={cn(
                        "w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-white transition-colors",
                        isFabOpen ? "bg-slate-900 rotate-45" : "bg-primary"
                    )}
                >
                    {isFabOpen ? <X className="w-6 h-6" /> : <Navigation className="w-6 h-6" />}
                </motion.button>
             </div>
        )}

        <BottomNav />
      </div>
    </div>
  );
}

function BottomNav() {
  const [location, setLocation] = useLocation();
  const { role } = useAuth();

  // Hide nav on auth page or if no role
  if (!role || location === "/auth") return null;

  const navItems = role === "CUSTOMER" ? [
    { icon: Home, label: "Home", path: "/customer/home" },
    { icon: Calendar, label: "Bookings", path: "/customer/bookings" },
    { icon: User, label: "Profile", path: "/customer/profile" },
  ] : role === "WORKER" ? [
    { icon: Home, label: "Home", path: "/worker/dashboard" },
    { icon: Briefcase, label: "Jobs", path: "/worker/dashboard" }, // Using dashboard as Jobs hub for now
    { icon: DollarSign, label: "Earnings", path: "/worker/earnings" },
    { icon: User, label: "Profile", path: "/worker/profile" },
  ] : [
    { icon: Home, label: "Dashboard", path: "/admin/dashboard" },
    { icon: Calendar, label: "Orders", path: "/admin/orders" },
    { icon: User, label: "Users", path: "/admin/users" },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-3 flex justify-between items-center z-40 pb-6 md:pb-4 md:rounded-b-[1.5rem]">
      {navItems.map((item) => {
        const isActive = location === item.path;
        return (
          <button
            key={item.label}
            onClick={() => setLocation(item.path)}
            className={cn(
              "flex flex-col items-center gap-1 transition-colors duration-200",
              isActive ? "text-primary" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <item.icon className={cn("w-6 h-6", isActive && "fill-current/20")} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
