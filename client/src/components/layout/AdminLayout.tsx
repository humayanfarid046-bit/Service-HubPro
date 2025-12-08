import React from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Briefcase, 
  CreditCard, 
  Tag, 
  Bell, 
  AlertCircle, 
  Settings, 
  LogOut,
  Menu,
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
  Award,
  Ticket,
  MessageSquareWarning,
  MessageCircle,
  UserX,
  BarChart3,
  PieChart,
  TrendingUp,
  Gauge,
  Heart,
  ShoppingBag,
  Image,
  FileText,
  HelpCircle,
  Home,
  ChevronDown,
  ChevronRight,
  Key,
  Database,
  Zap,
  DollarSign,
  ShieldAlert,
  Users,
  type LucideIcon
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  icon: LucideIcon;
  label: string;
  path: string;
}

interface NavSection {
  title: string;
  icon: LucideIcon;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: "Overview",
    icon: LayoutDashboard,
    items: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
    ],
  },
  {
    title: "Analytics & Monitoring",
    icon: BarChart3,
    items: [
      { icon: BarChart3, label: "Active User Stats", path: "/admin/active-users" },
      { icon: PieChart, label: "Booking Stats", path: "/admin/booking-stats" },
      { icon: TrendingUp, label: "Revenue Stats", path: "/admin/revenue-stats" },
      { icon: Gauge, label: "Worker Performance", path: "/admin/worker-performance" },
      { icon: Heart, label: "Customer CLV", path: "/admin/customer-clv" },
    ],
  },
  {
    title: "User Management",
    icon: UserCog,
    items: [
      { icon: UserCog, label: "All Users", path: "/admin/users" },
      { icon: Wrench, label: "Workers", path: "/admin/workers" },
      { icon: UserCircle, label: "Customers", path: "/admin/customers" },
      { icon: ShieldCheck, label: "KYC Verification", path: "/admin/kyc" },
      { icon: FileCheck, label: "Document Verification", path: "/admin/worker-verification" },
    ],
  },
  {
    title: "Bookings & Services",
    icon: Briefcase,
    items: [
      { icon: Briefcase, label: "Services", path: "/admin/services" },
      { icon: ShoppingBag, label: "Orders", path: "/admin/orders" },
      { icon: AlertCircle, label: "Disputes", path: "/admin/disputes" },
    ],
  },
  {
    title: "Finance",
    icon: CreditCard,
    items: [
      { icon: CreditCard, label: "Finance Overview", path: "/admin/finance" },
      { icon: Tag, label: "Offers & Coupons", path: "/admin/offers" },
    ],
  },
  {
    title: "Ratings & Reviews",
    icon: Star,
    items: [
      { icon: Star, label: "Review List", path: "/admin/reviews" },
      { icon: CheckSquare, label: "Review Approval", path: "/admin/review-approval" },
      { icon: Flag, label: "Review Reports", path: "/admin/review-reports" },
      { icon: Award, label: "Worker Ratings", path: "/admin/worker-ratings" },
    ],
  },
  {
    title: "Support & Helpdesk",
    icon: Ticket,
    items: [
      { icon: Ticket, label: "Support Tickets", path: "/admin/support-tickets" },
      { icon: MessageSquareWarning, label: "User Complaints", path: "/admin/user-complaints" },
      { icon: MessageCircle, label: "Chat Monitoring", path: "/admin/chat-monitoring" },
      { icon: UserX, label: "Reported Users", path: "/admin/reported-users" },
    ],
  },
  {
    title: "Notifications",
    icon: Bell,
    items: [
      { icon: Bell, label: "Push Notifications", path: "/admin/push-notifications" },
      { icon: MessageSquare, label: "SMS Notifications", path: "/admin/sms-notifications" },
      { icon: Mail, label: "Email Broadcast", path: "/admin/email-broadcast" },
      { icon: Megaphone, label: "Announcements", path: "/admin/announcements" },
    ],
  },
  {
    title: "Content Management",
    icon: FileText,
    items: [
      { icon: Image, label: "Banner Management", path: "/admin/banners" },
      { icon: Home, label: "Homepage Content", path: "/admin/homepage-content" },
      { icon: HelpCircle, label: "FAQ Manager", path: "/admin/faq" },
      { icon: FileText, label: "Terms & Policy", path: "/admin/terms-policy" },
    ],
  },
  {
    title: "Automation & AI",
    icon: Zap,
    items: [
      { icon: Users, label: "Auto Assign Worker", path: "/admin/auto-assign" },
      { icon: DollarSign, label: "Auto Price Suggestion", path: "/admin/auto-price" },
      { icon: ShieldAlert, label: "Fraud Detection", path: "/admin/fraud-detection" },
    ],
  },
  {
    title: "Security & Logs",
    icon: Shield,
    items: [
      { icon: Activity, label: "Activity Logs", path: "/admin/activity-logs" },
      { icon: LogIn, label: "Login Logs", path: "/admin/login-logs" },
      { icon: Shield, label: "2FA Settings", path: "/admin/2fa-settings" },
    ],
  },
  {
    title: "System Settings",
    icon: Settings,
    items: [
      { icon: Settings, label: "App Settings", path: "/admin/app-settings" },
      { icon: CreditCard, label: "Payment Gateway", path: "/admin/payment-gateway" },
      { icon: MessageSquare, label: "SMS Gateway", path: "/admin/sms-gateway" },
      { icon: Mail, label: "Email SMTP", path: "/admin/email-smtp" },
      { icon: Shield, label: "Role & Permissions", path: "/admin/role-permissions" },
      { icon: Key, label: "API Keys", path: "/admin/api-keys" },
      { icon: Database, label: "Database Backup", path: "/admin/database-backup" },
    ],
  },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const [location] = useLocation();
  const { logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSections, setOpenSections] = useState<string[]>(() => {
    const currentSection = NAV_SECTIONS.find(section => 
      section.items.some(item => item.path === location)
    );
    return currentSection ? [currentSection.title] : ["Overview"];
  });

  const toggleSection = (title: string) => {
    setOpenSections(prev => 
      prev.includes(title) 
        ? prev.filter(t => t !== title)
        : [...prev, title]
    );
  };

  const NavContent = () => (
    <div className="flex flex-col h-full bg-slate-900 text-white">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-xl font-bold tracking-tight">ServiceHub Pro</h1>
        <p className="text-xs text-slate-400 mt-1">Admin Panel</p>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {NAV_SECTIONS.map((section) => {
          const isOpen = openSections.includes(section.title);
          const hasActiveItem = section.items.some(item => item.path === location);
          
          return (
            <Collapsible 
              key={section.title} 
              open={isOpen} 
              onOpenChange={() => toggleSection(section.title)}
              className="mb-1"
            >
              <CollapsibleTrigger className={cn(
                "flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                hasActiveItem ? "text-white bg-white/5" : "text-slate-400 hover:text-white hover:bg-white/5"
              )}>
                <div className="flex items-center gap-3">
                  <section.icon className="w-4 h-4" />
                  <span>{section.title}</span>
                </div>
                {isOpen ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-4 mt-1 space-y-0.5">
                {section.items.map((item) => {
                  const isActive = location === item.path;
                  return (
                    <Link 
                      key={item.path} 
                      href={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200",
                        isActive 
                          ? "bg-primary text-white shadow-lg shadow-primary/20" 
                          : "text-slate-400 hover:text-white hover:bg-white/5"
                      )}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </CollapsibleContent>
            </Collapsible>
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
      <aside className="hidden lg:block w-72 shrink-0 shadow-2xl z-20">
        <NavContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10">
          <div className="flex items-center gap-4">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <button className="lg:hidden p-2 rounded-lg hover:bg-slate-100">
                  <Menu className="w-5 h-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72">
                <SheetTitle>
                  <VisuallyHidden>Admin Navigation Menu</VisuallyHidden>
                </SheetTitle>
                <NavContent />
              </SheetContent>
            </Sheet>
            <h2 className="text-lg font-semibold text-slate-800">Admin Dashboard</h2>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
