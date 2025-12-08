import React from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  ShoppingBag, 
  CreditCard, 
  Tag, 
  Bell, 
  AlertCircle, 
  Settings, 
  LogOut,
  Menu,
  X,
  ShieldCheck,
  UserCog,
  Wrench,
  UserCircle,
  FileCheck,
  Activity,
  LogIn,
  Shield,
  MessageSquare,
  Mail,
  Megaphone,
  Star,
  CheckSquare,
  Flag,
  Award
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
  { icon: UserCog, label: "User Management", path: "/admin/users" },
  { icon: Wrench, label: "Workers", path: "/admin/workers" },
  { icon: UserCircle, label: "Customers", path: "/admin/customers" },
  { icon: ShieldCheck, label: "KYC Verification", path: "/admin/kyc" },
  { icon: FileCheck, label: "Document Verification", path: "/admin/worker-verification" },
  { icon: Briefcase, label: "Services", path: "/admin/services" },
  { icon: ShoppingBag, label: "Orders", path: "/admin/orders" },
  { icon: CreditCard, label: "Finance", path: "/admin/finance" },
  { icon: Tag, label: "Offers", path: "/admin/offers" },
  { icon: Star, label: "Review List", path: "/admin/reviews" },
  { icon: CheckSquare, label: "Review Approval", path: "/admin/review-approval" },
  { icon: Flag, label: "Review Reports", path: "/admin/review-reports" },
  { icon: Award, label: "Worker Ratings", path: "/admin/worker-ratings" },
  { icon: Bell, label: "Push Notifications", path: "/admin/push-notifications" },
  { icon: MessageSquare, label: "SMS Notifications", path: "/admin/sms-notifications" },
  { icon: Mail, label: "Email Broadcast", path: "/admin/email-broadcast" },
  { icon: Megaphone, label: "Announcements", path: "/admin/announcements" },
  { icon: AlertCircle, label: "Disputes", path: "/admin/disputes" },
  { icon: Activity, label: "Activity Logs", path: "/admin/activity-logs" },
  { icon: LogIn, label: "Login Logs", path: "/admin/login-logs" },
  { icon: Shield, label: "2FA Settings", path: "/admin/2fa-settings" },
  { icon: Settings, label: "Settings", path: "/admin/settings" },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const [location] = useLocation();
  const { logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NavContent = () => (
    <div className="flex flex-col h-full bg-slate-900 text-white">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-xl font-bold tracking-tight">ServiceHub Pro</h1>
        <p className="text-xs text-slate-400 mt-1">Admin Panel</p>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = location === item.path;
          return (
            <Link 
              key={item.path} 
              href={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button 
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 shadow-2xl z-20">
        <NavContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10">
          <div className="flex items-center gap-4">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="w-6 h-6 text-slate-600" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64 border-r-0">
                <VisuallyHidden>
                  <SheetTitle>Navigation Menu</SheetTitle>
                </VisuallyHidden>
                <NavContent />
              </SheetContent>
            </Sheet>
            <h2 className="text-lg font-bold text-slate-800 lg:hidden">Dashboard</h2>
          </div>

          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-semibold text-slate-600">System Operational</span>
             </div>
             <Button variant="ghost" size="icon" className="relative text-slate-500 hover:text-primary">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
             </Button>
             <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20">
                A
             </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
