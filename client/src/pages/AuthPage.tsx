import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Phone, ArrowLeft, Loader2, Eye, EyeOff, Zap, User, Hammer, ChevronRight } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type AuthView = "welcome" | "login" | "register_role" | "forgot_password" | "otp_verify";

export default function AuthPage() {
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [view, setView] = useState<AuthView>("welcome");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form State
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [otp, setOtp] = useState("");
  const [resetEmail, setResetEmail] = useState("");

  const handleLogin = async () => {
    if (!emailOrPhone || !password) {
      toast({ title: "Error", description: "Please enter email/phone and password.", variant: "destructive" });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrPhone, password }),
      });
      
      const data = await response.json();
      setIsLoading(false);
      
      if (data.success && data.user) {
        const userRole = data.user.role as "ADMIN" | "WORKER" | "CUSTOMER";
        login(userRole, data.user);
        
        if (userRole === "ADMIN") {
          setLocation("/admin/dashboard");
        } else if (userRole === "WORKER") {
          setLocation("/worker/dashboard");
        } else {
          setLocation("/customer/home");
        }
      } else if (data.pendingApproval) {
        toast({ 
          title: "Pending Approval", 
          description: data.message || "Your account is pending approval.",
          duration: 5000
        });
      } else {
        toast({ title: "Login Failed", description: data.error || "Invalid credentials.", variant: "destructive" });
      }
    } catch (error) {
      setIsLoading(false);
      toast({ title: "Error", description: "Something went wrong. Please try again.", variant: "destructive" });
    }
  };

  const handleForgotPassword = async () => {
    if (!resetEmail) {
      toast({ title: "Error", description: "Please enter your email or phone.", variant: "destructive" });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrPhone: resetEmail }),
      });
      
      const data = await response.json();
      setIsLoading(false);
      
      if (data.success) {
        toast({ title: "OTP Sent", description: "A verification code has been sent to your email/phone." });
        setView("otp_verify");
      } else {
        toast({ title: "Error", description: data.error || "Failed to send OTP.", variant: "destructive" });
      }
    } catch (error) {
      setIsLoading(false);
      toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 4) {
      toast({ title: "Error", description: "Please enter a valid OTP.", variant: "destructive" });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/verify-reset-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrPhone: resetEmail, otp }),
      });
      
      const data = await response.json();
      setIsLoading(false);
      
      if (data.success) {
        toast({ title: "Verified!", description: "You can now reset your password." });
        // In a real app, would navigate to password reset page
        setView("login");
      } else {
        toast({ title: "Invalid OTP", description: data.error || "Please try again.", variant: "destructive" });
      }
    } catch (error) {
      setIsLoading(false);
      toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
    }
  };

  const handleRoleSelect = (role: "CUSTOMER" | "WORKER") => {
    if (role === "CUSTOMER") {
      setLocation("/customer/register");
    } else {
      setLocation("/worker/register");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px]" />
      
      <AnimatePresence mode="wait">
        
        {/* WELCOME SCREEN */}
        {view === "welcome" && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-sm"
          >
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 shadow-2xl">
              {/* Logo */}
              <div className="flex justify-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
                  <Zap className="w-10 h-10 text-white" />
                </div>
              </div>

              <h1 className="text-3xl font-bold text-white text-center mb-2">ServiceHub Pro</h1>
              <p className="text-slate-400 text-center mb-10">Your trusted home service partner</p>

              <div className="space-y-4">
                <Button 
                  className="w-full h-14 text-lg font-bold rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg shadow-cyan-500/30"
                  onClick={() => setView("login")}
                  data-testid="button-login"
                >
                  Log In
                </Button>
                <Button 
                  variant="outline"
                  className="w-full h-14 text-lg font-bold rounded-xl border-slate-600 bg-transparent text-white hover:bg-slate-700/50"
                  onClick={() => setView("register_role")}
                  data-testid="button-create-account"
                >
                  Create Account
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* LOGIN SCREEN */}
        {view === "login" && (
          <motion.div
            key="login"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-sm"
          >
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 shadow-2xl">
              <button 
                onClick={() => setView("welcome")}
                className="p-2 rounded-full hover:bg-slate-700/50 transition-colors mb-4"
              >
                <ArrowLeft className="w-6 h-6 text-slate-400" />
              </button>

              {/* Logo */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
                  <Zap className="w-8 h-8 text-white" />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-white text-center mb-8">Log In</h2>

              <div className="space-y-5">
                {/* Email/Phone Field */}
                <div className="space-y-2">
                  <Label className="text-slate-400 text-sm">Email or Phone</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <Input 
                      className="h-14 pl-12 bg-slate-700/50 border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20"
                      placeholder="Enter email or phone"
                      value={emailOrPhone}
                      onChange={(e) => setEmailOrPhone(e.target.value)}
                      data-testid="input-email-phone"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label className="text-slate-400 text-sm">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <Input 
                      type={showPassword ? "text" : "password"}
                      className="h-14 pl-12 pr-12 bg-slate-700/50 border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      data-testid="input-password"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="remember" 
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(!!checked)}
                      className="border-slate-600 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"
                    />
                    <label htmlFor="remember" className="text-sm text-slate-400 cursor-pointer">Remember Me</label>
                  </div>
                  <button 
                    onClick={() => setView("forgot_password")}
                    className="text-sm text-cyan-400 hover:text-cyan-300 font-medium"
                    data-testid="link-forgot-password"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Login Button */}
                <Button 
                  className="w-full h-14 text-lg font-bold rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg shadow-cyan-500/30"
                  onClick={handleLogin}
                  disabled={isLoading}
                  data-testid="button-submit-login"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Log In"}
                </Button>

                {/* Create Account Link */}
                <p className="text-center text-slate-400 text-sm">
                  Don't have an account?{" "}
                  <button 
                    onClick={() => setView("register_role")}
                    className="text-cyan-400 hover:text-cyan-300 font-medium"
                  >
                    Create Account
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* REGISTER ROLE SELECTION */}
        {view === "register_role" && (
          <motion.div
            key="register_role"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-sm"
          >
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 shadow-2xl">
              <button 
                onClick={() => setView("welcome")}
                className="p-2 rounded-full hover:bg-slate-700/50 transition-colors mb-4"
              >
                <ArrowLeft className="w-6 h-6 text-slate-400" />
              </button>

              {/* Logo */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
                  <Zap className="w-8 h-8 text-white" />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-white text-center mb-2">Create Account</h2>
              <p className="text-slate-400 text-center mb-8">Choose your account type</p>

              <div className="space-y-4">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleRoleSelect("CUSTOMER")}
                  className="w-full bg-slate-700/50 p-5 rounded-2xl border border-slate-600/50 flex items-center gap-4 group transition-all hover:border-cyan-500/50 hover:bg-slate-700"
                  data-testid="button-register-customer"
                >
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <User className="w-6 h-6" />
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="text-lg font-bold text-white">Customer</h3>
                    <p className="text-xs text-slate-400">I want to book services</p>
                  </div>
                  <ChevronRight className="text-slate-500 group-hover:text-cyan-400" />
                </motion.button>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleRoleSelect("WORKER")}
                  className="w-full bg-slate-700/50 p-5 rounded-2xl border border-slate-600/50 flex items-center gap-4 group transition-all hover:border-blue-500/50 hover:bg-slate-700"
                  data-testid="button-register-worker"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Hammer className="w-6 h-6" />
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="text-lg font-bold text-white">Worker Partner</h3>
                    <p className="text-xs text-slate-400">I want to offer services</p>
                  </div>
                  <ChevronRight className="text-slate-500 group-hover:text-blue-400" />
                </motion.button>
              </div>

              <p className="text-center text-slate-400 text-sm mt-8">
                Already have an account?{" "}
                <button 
                  onClick={() => setView("login")}
                  className="text-cyan-400 hover:text-cyan-300 font-medium"
                >
                  Log In
                </button>
              </p>
            </div>
          </motion.div>
        )}

        {/* FORGOT PASSWORD SCREEN */}
        {view === "forgot_password" && (
          <motion.div
            key="forgot_password"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-sm"
          >
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 shadow-2xl">
              <button 
                onClick={() => setView("login")}
                className="p-2 rounded-full hover:bg-slate-700/50 transition-colors mb-4"
              >
                <ArrowLeft className="w-6 h-6 text-slate-400" />
              </button>

              <h2 className="text-2xl font-bold text-white text-center mb-2">Forgot Password?</h2>
              <p className="text-slate-400 text-center mb-8">Enter your email or phone to receive a verification code</p>

              <div className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-slate-400 text-sm">Email or Phone</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <Input 
                      className="h-14 pl-12 bg-slate-700/50 border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20"
                      placeholder="Enter email or phone"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      data-testid="input-reset-email"
                    />
                  </div>
                </div>

                <Button 
                  className="w-full h-14 text-lg font-bold rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg shadow-cyan-500/30"
                  onClick={handleForgotPassword}
                  disabled={isLoading}
                  data-testid="button-send-otp"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send OTP"}
                </Button>

                <p className="text-center text-slate-400 text-sm">
                  Remember your password?{" "}
                  <button 
                    onClick={() => setView("login")}
                    className="text-cyan-400 hover:text-cyan-300 font-medium"
                  >
                    Log In
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* OTP VERIFICATION SCREEN */}
        {view === "otp_verify" && (
          <motion.div
            key="otp_verify"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-sm"
          >
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 shadow-2xl">
              <button 
                onClick={() => setView("forgot_password")}
                className="p-2 rounded-full hover:bg-slate-700/50 transition-colors mb-4"
              >
                <ArrowLeft className="w-6 h-6 text-slate-400" />
              </button>

              {/* Logo */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
                  <Zap className="w-8 h-8 text-white" />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-white text-center mb-2">Enter OTP</h2>
              <p className="text-slate-400 text-center mb-8">
                OTP sent to <span className="text-cyan-400">{resetEmail}</span>. Enter the code to proceed.
              </p>

              <div className="space-y-5">
                <div className="flex justify-center gap-3">
                  {[0, 1, 2, 3].map((i) => (
                    <Input 
                      key={i}
                      className="w-14 h-14 text-center text-2xl font-bold bg-slate-700/50 border-slate-600 rounded-xl text-white focus:border-cyan-500 focus:ring-cyan-500/20"
                      maxLength={1}
                      value={otp[i] || ""}
                      onChange={(e) => {
                        const newOtp = otp.split("");
                        newOtp[i] = e.target.value;
                        setOtp(newOtp.join(""));
                        if (e.target.value && i < 3) {
                          const nextInput = document.querySelector(`input:nth-of-type(${i + 2})`) as HTMLInputElement;
                          nextInput?.focus();
                        }
                      }}
                      data-testid={`input-otp-${i}`}
                    />
                  ))}
                </div>

                <Button 
                  className="w-full h-14 text-lg font-bold rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg shadow-cyan-500/30"
                  onClick={handleVerifyOtp}
                  disabled={isLoading}
                  data-testid="button-verify-otp"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Continue"}
                </Button>

                <p className="text-center text-slate-400 text-sm">
                  Didn't receive the OTP?{" "}
                  <button 
                    onClick={handleForgotPassword}
                    className="text-cyan-400 hover:text-cyan-300 font-medium"
                  >
                    Resend OTP
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
