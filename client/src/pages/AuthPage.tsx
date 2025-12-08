import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ShieldCheck, User, Hammer } from "lucide-react";
import { useLocation } from "wouter";

export default function AuthPage() {
  const { login } = useAuth();
  const [, setLocation] = useLocation();

  const handleLogin = (role: "ADMIN" | "WORKER" | "CUSTOMER") => {
    login(role);
    if (role === "CUSTOMER") setLocation("/customer/home");
    else if (role === "WORKER") setLocation("/worker/dashboard");
    else setLocation("/admin/dashboard");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full px-6 py-12 bg-white text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm space-y-8"
      >
        <div className="space-y-2">
          <div className="w-16 h-16 bg-primary rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-xl shadow-primary/30">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            ServiceHub Pro
          </h1>
          <p className="text-slate-500">
            Professional home services at your doorstep.
          </p>
        </div>

        <div className="space-y-4 pt-8">
          <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Select Role to Login</p>
          
          <Button
            size="lg"
            className="w-full h-14 text-lg font-semibold bg-slate-900 hover:bg-slate-800 shadow-lg"
            onClick={() => handleLogin("CUSTOMER")}
          >
            <User className="mr-2 w-5 h-5" />
            Continue as Customer
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="w-full h-14 text-lg font-semibold border-2 hover:bg-slate-50"
            onClick={() => handleLogin("WORKER")}
          >
            <Hammer className="mr-2 w-5 h-5" />
            Worker Partner
          </Button>

          <Button
            variant="ghost"
            className="w-full text-slate-400 hover:text-slate-600"
            onClick={() => handleLogin("ADMIN")}
          >
            Admin Login
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
