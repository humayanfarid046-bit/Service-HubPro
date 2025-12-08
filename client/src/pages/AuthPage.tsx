import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, User, Hammer, ChevronRight, Phone, ArrowRight, Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function AuthPage() {
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [step, setStep] = useState<"phone" | "otp" | "role_select">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [detectedRole, setDetectedRole] = useState<"ADMIN" | "WORKER" | "CUSTOMER" | "NEW" | null>(null);

  const handlePhoneSubmit = (clickedButton: "customer" | "worker") => {
    if (phone.length < 4) {
      toast({ title: "Invalid Phone", description: "Please enter a valid phone number.", variant: "destructive" });
      return;
    }

    setIsLoading(true);

    // Mock Backend Check
    setTimeout(() => {
      setIsLoading(false);
      
      // Admin Logic (Hidden)
      if (phone === "99999") {
        login("ADMIN");
        setLocation("/admin/dashboard");
        return;
      }

      // Existing User Check (Mock)
      if (phone === "88888") {
        setDetectedRole("WORKER");
        setStep("otp");
        return;
      }
      if (phone === "77777") {
        setDetectedRole("CUSTOMER");
        setStep("otp");
        return;
      }

      // New User -> Role Selection
      // If they clicked "Worker Partner", maybe we pre-select or just go to selection?
      // The prompt says: "If the user is new, redirect to a Select Your Role screen."
      setDetectedRole("NEW");
      setStep("otp"); // Verify phone first, then select role
    }, 1500);
  };

  const verifyOtp = () => {
    setIsLoading(true);
    setTimeout(() => {
        setIsLoading(false);
        if (otp !== "1234") { // Mock OTP
            toast({ title: "Invalid OTP", description: "Use 1234 for testing.", variant: "destructive" });
            return;
        }

        if (detectedRole === "NEW") {
            setStep("role_select");
        } else if (detectedRole) {
            login(detectedRole as any);
            if (detectedRole === "WORKER") setLocation("/worker/dashboard");
            else setLocation("/customer/home");
        }
    }, 1000);
  };

  const handleRegister = (role: "CUSTOMER" | "WORKER") => {
      login(role);
      if (role === "WORKER") setLocation("/worker/dashboard");
      else setLocation("/customer/home");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 font-sans p-6">
      <AnimatePresence mode="wait">
        
        {/* STEP 1: LOGIN (PHONE) */}
        {step === "phone" && (
          <motion.div
            key="phone-step"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full max-w-md"
          >
            <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 p-8 md:p-10 border border-white/50 relative overflow-hidden">
                {/* Decorative Background */}
                <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-500/5 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-indigo-500/5 rounded-full blur-3xl" />

                <div className="relative z-10 flex flex-col items-center text-center">
                    {/* Logo */}
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 mb-8 relative group">
                        <div className="absolute inset-0 bg-white/20 rounded-2xl blur-sm group-hover:blur-md transition-all" />
                        <ShieldCheck className="w-10 h-10 text-white relative z-10" />
                    </div>

                    <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Welcome Back</h1>
                    <p className="text-slate-500 mb-8">Enter your phone number to continue</p>

                    <div className="w-full space-y-6">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-2xl blur transition-opacity opacity-0 group-focus-within:opacity-100" />
                            <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-2xl px-4 py-1 focus-within:bg-white focus-within:border-blue-500 transition-all">
                                <Phone className="w-5 h-5 text-slate-400 mr-3" />
                                <div className="h-6 w-px bg-slate-200 mr-3" />
                                <Input 
                                    className="border-0 bg-transparent shadow-none focus-visible:ring-0 h-12 text-lg font-medium text-slate-900 placeholder:text-slate-400"
                                    placeholder="Mobile Number"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="space-y-3 pt-2">
                            <Button 
                                className="w-full h-14 text-lg font-bold rounded-2xl bg-slate-900 hover:bg-slate-800 shadow-xl shadow-slate-900/20 transition-all active:scale-[0.98]"
                                onClick={() => handlePhoneSubmit("customer")}
                                disabled={isLoading}
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Continue as Customer"}
                            </Button>
                            
                            <Button 
                                variant="ghost"
                                className="w-full h-12 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl font-medium transition-colors"
                                onClick={() => handlePhoneSubmit("worker")}
                                disabled={isLoading}
                            >
                                Worker Partner
                            </Button>
                        </div>
                    </div>

                    <p className="text-xs text-slate-400 mt-8">
                        By continuing, you agree to our <span className="underline cursor-pointer hover:text-slate-600">Terms</span> & <span className="underline cursor-pointer hover:text-slate-600">Privacy Policy</span>
                    </p>
                </div>
            </div>
          </motion.div>
        )}

        {/* STEP 2: OTP (Mock) */}
        {step === "otp" && (
            <motion.div
                key="otp-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full max-w-md"
            >
                <div className="bg-white rounded-[2rem] shadow-2xl p-8 border border-white/50 text-center">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Verify OTP</h2>
                    <p className="text-slate-500 mb-8">Sent to {phone}. Use <span className="font-mono font-bold text-slate-900">1234</span></p>
                    
                    <Input 
                        className="text-center text-3xl font-bold tracking-[1em] h-16 rounded-2xl border-slate-200 bg-slate-50 focus-visible:ring-blue-500 mb-8"
                        maxLength={4}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />

                    <Button 
                        className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 font-bold text-lg shadow-lg shadow-blue-500/20"
                        onClick={verifyOtp}
                        disabled={isLoading}
                    >
                         {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify & Continue"}
                    </Button>
                </div>
            </motion.div>
        )}

        {/* STEP 3: ROLE SELECTION (New Users) */}
        {step === "role_select" && (
            <motion.div
                key="role-step"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md space-y-6"
            >
                <div className="text-center mb-4">
                    <h2 className="text-3xl font-bold text-slate-900">Select Your Role</h2>
                    <p className="text-slate-500">How would you like to join ServiceHub?</p>
                </div>

                {/* Customer Card */}
                <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleRegister("CUSTOMER")}
                    className="w-full bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-white flex items-center gap-6 group relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <User className="w-8 h-8" />
                    </div>
                    <div className="text-left flex-1">
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Register as Customer</h3>
                        <p className="text-sm text-slate-500">Book services for your home</p>
                    </div>
                    <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-all">
                        <ArrowRight className="w-5 h-5" />
                    </div>
                </motion.button>

                {/* Worker Card */}
                <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleRegister("WORKER")}
                    className="w-full bg-slate-900 p-6 rounded-[2rem] shadow-xl shadow-slate-900/20 border border-slate-800 flex items-center gap-6 group relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="w-16 h-16 rounded-2xl bg-white/10 text-white flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Hammer className="w-8 h-8" />
                    </div>
                    <div className="text-left flex-1">
                        <h3 className="text-lg font-bold text-white">Register as Partner</h3>
                        <p className="text-sm text-slate-400">Join us and earn money</p>
                    </div>
                    <div className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center group-hover:bg-white group-hover:text-slate-900 transition-all text-slate-400">
                        <ArrowRight className="w-5 h-5" />
                    </div>
                </motion.button>
            </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
