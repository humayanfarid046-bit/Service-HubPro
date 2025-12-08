import React from "react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Home, Calendar, User, Settings, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { AIAssistant } from "@/components/AIAssistant";

export function MobileLayout({ children, className }: { children: React.ReactNode; className?: string }) {
  const { role } = useAuth();
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 p-0 md:p-4 font-sans">
      <div className={cn("mobile-container bg-white w-full h-[100dvh] md:h-[800px] md:max-h-[90vh] md:rounded-[2rem] md:border-8 md:border-slate-900 overflow-hidden flex flex-col relative shadow-2xl", className)}>
        {/* Status Bar Area (Mock) */}
        <div className="h-8 bg-white w-full flex items-center justify-between px-6 select-none shrink-0 z-50">
          <span className="text-xs font-bold text-slate-900">9:41</span>
          <div className="flex gap-1.5">
            <div className="w-4 h-2.5 bg-slate-900 rounded-[1px]" />
            <div className="w-3 h-2.5 bg-slate-900 rounded-[1px]" />
            <div className="w-5 h-2.5 bg-slate-900 rounded-[2px]" />
          </div>
        </div>
        
        {/* Main Content Area - Scrollable */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative bg-slate-50 scroll-smooth pb-20 hide-scrollbar">
          {children}
        </main>

        {/* AI Assistant Floating Button (Only for Customer) */}
        {role === "CUSTOMER" && <AIAssistant />}

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
    { icon: Home, label: "Jobs", path: "/worker/dashboard" },
    { icon: Settings, label: "Profile", path: "/worker/profile" },
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
