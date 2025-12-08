import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, User, Hammer, ChevronRight, Phone, ArrowLeft, Loader2, Sparkles, LogIn, UserPlus } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function AuthPage() {
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Views: welcome -> login (phone+otp) OR register_role -> login (phone+otp)
  const [view, setView] = useState<"welcome" | "login" | "register_role">("welcome");
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [selectedRole, setSelectedRole] = useState<"CUSTOMER" | "WORKER" | null>(null);
  
  // Login State
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleStartLogin = () => {
    setAuthMode("login");
    setView("login");
    setStep("phone");
  };

  const handleStartRegister = () => {
    setAuthMode("register");
    setView("register_role");
  };

  const handleRoleSelect = (role: "CUSTOMER" | "WORKER") => {
    setSelectedRole(role);
    if (role === "CUSTOMER") {
        // Direct to new Customer Register form
        setLocation("/customer/register");
    } else {
        // Direct to new Worker Register form
        setLocation("/worker/register");
    }
  };

  const handlePhoneSubmit = async () => {
    if (phone.length < 10) {
      toast({ title: "Invalid Phone", description: "Please enter a valid 10-digit phone number.", variant: "destructive" });
      return;
    }

    setIsLoading(true);

    try {
      // First check if user exists
      const checkResponse = await fetch("/api/auth/phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      
      const checkData = await checkResponse.json();
      
      if (checkData.exists && checkData.user) {
        // Send OTP for all users including Admin
        const otpResponse = await fetch("/api/auth/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone }),
        });
        
        const otpData = await otpResponse.json();
        setIsLoading(false);
        
        if (otpData.success) {
          toast({ title: "OTP Sent", description: otpData.mock ? "Use 1234 for testing" : "Check your SMS" });
          setStep("otp");
        } else {
          toast({ title: "Error", description: otpData.error || "Failed to send OTP", variant: "destructive" });
        }
      } else {
        setIsLoading(false);
        toast({ title: "User not found", description: "Please create an account.", variant: "destructive" });
        setAuthMode("register");
        setView("register_role");
      }
    } catch (error) {
      setIsLoading(false);
      toast({ title: "Error", description: "Something went wrong. Please try again.", variant: "destructive" });
    }
  };

  const verifyOtp = async () => {
    if (!otp || otp.length < 6) {
      toast({ title: "Invalid OTP", description: "Please enter 6-digit OTP.", variant: "destructive" });
      return;
    }
    
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      });
      
      const data = await response.json();
      setIsLoading(false);
      
      if (data.success && data.verified) {
        if (data.user) {
          const userRole = data.user.role as "ADMIN" | "WORKER" | "CUSTOMER";
          login(userRole, data.user);
          
          if (userRole === "ADMIN") {
            setLocation("/admin/dashboard");
          } else if (userRole === "WORKER") {
            setLocation("/worker/dashboard");
          } else {
            setLocation("/customer/home");
          }
        } else {
          toast({ title: "User not found", description: "Please create an account.", variant: "destructive" });
          setAuthMode("register");
          setView("register_role");
        }
      } else {
        toast({ title: "Invalid OTP", description: data.error || "Please try again.", variant: "destructive" });
      }
    } catch (error) {
      setIsLoading(false);
      toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 font-sans p-4 overflow-hidden relative">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-200/40 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-200/40 rounded-full blur-[100px]" />

      <AnimatePresence mode="wait">
        
        {/* SCREEN 1: WELCOME SCREEN */}
        {view === "welcome" && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-sm"
          >
            <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-slate-200/60 p-8 border border-white relative overflow-hidden text-center">
                <div className="mb-8 relative flex justify-center">
                    <div className="w-64 h-64 bg-gradient-to-tr from-blue-100 to-purple-100 rounded-full flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-white/40 backdrop-blur-sm rounded-full m-4" />
                        <img 
                            src="https://images.unsplash.com/photo-1581578731117-10d52143b0d8?q=80&w=1000&auto=format&fit=crop" 
                            className="w-full h-full object-cover opacity-90 mix-blend-overlay absolute"
                            alt="Welcome"
                        />
                        <Sparkles className="w-16 h-16 text-indigo-500 relative z-10 animate-pulse" />
                    </div>
                </div>

                <h1 className="text-4xl font-bold text-slate-900 mb-2">Hello</h1>
                <p className="text-slate-500 mb-10 leading-relaxed px-4">
                    Welcome to <span className="text-indigo-600 font-bold">ServiceHub Pro</span>, your trusted home service partner.
                </p>

                <div className="space-y-4">
                    <Button 
                        className="w-full h-14 text-lg font-bold rounded-[1.5rem] bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20 active:scale-[0.98] transition-all"
                        onClick={handleStartRegister}
                    >
                        Create New Account
                    </Button>
                    <Button 
                        variant="outline"
                        className="w-full h-14 text-lg font-bold rounded-[1.5rem] border-2 border-slate-100 hover:bg-white hover:border-indigo-200 text-slate-600 hover:text-indigo-600 transition-all"
                        onClick={handleStartLogin}
                    >
                        Login
                    </Button>
                </div>
            </div>
          </motion.div>
        )}

        {/* SCREEN 2: CHOOSE ACCOUNT TYPE */}
        {view === "register_role" && (
            <motion.div
                key="register_role"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full max-w-sm"
            >
                <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-slate-200/60 p-8 border border-white relative">
                    <button 
                        onClick={() => setView("welcome")}
                        className="absolute top-6 left-6 p-2 rounded-full hover:bg-slate-100 transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6 text-slate-400" />
                    </button>
                    
                    <div className="mt-12 mb-8 text-center">
                        <h2 className="text-3xl font-bold text-slate-900">Register as</h2>
                        <p className="text-slate-500">Choose your account type</p>
                    </div>

                    <div className="space-y-4">
                        <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleRoleSelect("CUSTOMER")}
                            className="w-full bg-white p-6 rounded-[2rem] shadow-lg shadow-blue-100/50 border border-blue-50 flex items-center gap-4 group transition-all hover:border-blue-200"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <User className="w-7 h-7" />
                            </div>
                            <div className="text-left flex-1">
                                <h3 className="text-lg font-bold text-slate-900">Customer</h3>
                                <p className="text-xs text-slate-400">I want to book services</p>
                            </div>
                            <ChevronRight className="text-slate-300" />
                        </motion.button>

                        <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleRoleSelect("WORKER")}
                            className="w-full bg-white p-6 rounded-[2rem] shadow-lg shadow-purple-100/50 border border-purple-50 flex items-center gap-4 group transition-all hover:border-purple-200"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Hammer className="w-7 h-7" />
                            </div>
                            <div className="text-left flex-1">
                                <h3 className="text-lg font-bold text-slate-900">Worker Partner</h3>
                                <p className="text-xs text-slate-400">I want to offer services</p>
                            </div>
                            <ChevronRight className="text-slate-300" />
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        )}

        {/* SCREEN 3: LOGIN / REGISTER FORM */}
        {view === "login" && (
          <motion.div
            key="login-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-sm"
          >
            <div className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-slate-200/60 p-8 border border-white relative">
                 <button 
                    onClick={() => {
                        if (step === "otp") setStep("phone");
                        else setView("welcome");
                    }}
                    className="absolute top-6 left-6 p-2 rounded-full hover:bg-slate-100 transition-colors"
                >
                    <ArrowLeft className="w-6 h-6 text-slate-400" />
                </button>

                <div className="mt-12 mb-8 text-center">
                    <h2 className="text-3xl font-bold text-slate-900">
                        {step === "otp" ? "Verification" : (authMode === "register" ? "Sign Up" : "Login")}
                    </h2>
                    <p className="text-slate-500">
                        {step === "otp" 
                            ? `Enter code sent to ${phone}` 
                            : (authMode === "register" 
                                ? `Creating ${selectedRole?.toLowerCase()} account` 
                                : "Welcome back, please login")}
                    </p>
                </div>

                <div className="space-y-6">
                    {step === "phone" ? (
                        <div className="space-y-4">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-purple-200 rounded-2xl blur opacity-20 group-focus-within:opacity-50 transition-opacity" />
                                <div className="relative flex items-center bg-white border border-slate-200 rounded-2xl px-4 py-2 focus-within:border-indigo-400 transition-colors h-16">
                                    <Phone className="w-5 h-5 text-slate-400 mr-3" />
                                    <div className="h-6 w-px bg-slate-100 mr-3" />
                                    <Input 
                                        className="border-0 bg-transparent shadow-none focus-visible:ring-0 h-full text-lg font-medium text-slate-900 placeholder:text-slate-400 p-0"
                                        placeholder="Mobile Number"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>
                            
                            <Button 
                                className="w-full h-14 text-lg font-bold rounded-[1.5rem] bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-lg shadow-indigo-500/30 active:scale-[0.98] transition-all"
                                onClick={handlePhoneSubmit}
                                disabled={isLoading}
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Continue"}
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <Input 
                                className="text-center text-2xl font-bold tracking-[0.5em] h-20 rounded-[1.5rem] border-slate-200 bg-slate-50 focus-visible:ring-indigo-500"
                                maxLength={6}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="000000"
                            />
                            <Button 
                                className="w-full h-14 text-lg font-bold rounded-[1.5rem] bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20 active:scale-[0.98] transition-all"
                                onClick={verifyOtp}
                                disabled={isLoading}
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify & Login"}
                            </Button>
                        </div>
                    )}
                </div>

                {step === "phone" && (
                    <div className="mt-8 text-center">
                        <p className="text-sm text-slate-500">
                            {authMode === "login" ? "Don't have an account?" : "Already have an account?"}
                            <button 
                                onClick={() => {
                                    if (authMode === "login") handleStartRegister();
                                    else handleStartLogin();
                                }}
                                className="ml-2 font-bold text-indigo-600 hover:underline"
                            >
                                {authMode === "login" ? "Create new account" : "Login here"}
                            </button>
                        </p>
                    </div>
                )}
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
