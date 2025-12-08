import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Upload, ChevronLeft, CheckCircle2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { registerCustomer } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function CustomerRegister() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { login } = useAuth();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    otp: "",
    email: "",
    house: "",
    street: "",
    city: "",
    pincode: "",
    gender: "",
  });
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOtp = () => {
    if (formData.phone.length < 10) {
      toast({ title: "Invalid Phone", description: "Please enter a valid number.", variant: "destructive" });
      return;
    }
    setOtpSent(true);
    toast({ title: "OTP Sent", description: "Code sent to " + formData.phone });
  };

  const handleCreateAccount = async () => {
    if (!formData.name || !formData.phone) {
      toast({ title: "Missing Fields", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }

    try {
      const response = await registerCustomer({
        phone: formData.phone,
        email: formData.email || null,
        fullName: formData.name,
        profilePhoto: null,
        gender: formData.gender || null,
        dateOfBirth: null,
        isActive: true,
        house: formData.house,
        street: formData.street,
        city: formData.city,
        pincode: formData.pincode,
      });

      toast({ title: "Account Created!", description: "Welcome to ServiceHub Pro." });
      login("CUSTOMER", response.user);
      setLocation("/customer/home");
    } catch (error: any) {
      toast({ title: "Registration Failed", description: error.message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-200/30 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-200/30 rounded-full blur-[120px]" />

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
            <div className="w-20 h-20 bg-white rounded-full mx-auto flex items-center justify-center shadow-lg shadow-indigo-100 mb-4 relative">
                <Sparkles className="w-8 h-8 text-indigo-500" />
                <div className="absolute -bottom-1 -right-1 bg-green-400 w-6 h-6 rounded-full border-4 border-white flex items-center justify-center">
                    <CheckCircle2 className="w-3 h-3 text-white" />
                </div>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Create Your Account</h1>
            <p className="text-slate-500 text-sm px-8">Let’s set up your profile to book home services easily.</p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-slate-200/50 p-6 md:p-8 border border-white">
            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-5"
                    >
                        <div className="space-y-4">
                            {/* Full Name */}
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Full Name</Label>
                                <Input 
                                    className="h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-indigo-500" 
                                    placeholder="e.g. John Doe"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />
                            </div>

                            {/* Phone & OTP */}
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Phone Number</Label>
                                <div className="flex gap-2">
                                    <Input 
                                        className="h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-indigo-500" 
                                        placeholder="+1 234 567 890"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    />
                                    <Button 
                                        className={cn("h-12 rounded-xl px-4 font-medium", otpSent ? "bg-green-500 hover:bg-green-600" : "bg-slate-900 hover:bg-slate-800")}
                                        onClick={handleSendOtp}
                                        disabled={otpSent}
                                    >
                                        {otpSent ? "Sent" : "Send OTP"}
                                    </Button>
                                </div>
                            </div>

                            {otpSent && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    className="space-y-1.5"
                                >
                                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Verify OTP</Label>
                                    <Input 
                                        className="h-12 rounded-xl bg-white border-indigo-200 focus-visible:ring-indigo-500 text-center tracking-[0.5em] font-bold text-lg" 
                                        placeholder="0000"
                                        maxLength={4}
                                        value={formData.otp}
                                        onChange={(e) => setFormData({...formData, otp: e.target.value})}
                                    />
                                </motion.div>
                            )}

                            {/* Email */}
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email (Optional)</Label>
                                <Input 
                                    className="h-12 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-indigo-500" 
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                />
                            </div>
                        </div>

                        <Button 
                            className="w-full h-14 rounded-2xl text-lg font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30 mt-4"
                            onClick={() => setStep(2)}
                        >
                            Next Step
                        </Button>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        {/* Profile Photo */}
                        <div className="flex justify-center mb-2">
                            <div className="w-24 h-24 bg-slate-100 rounded-full border-2 border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors group relative overflow-hidden">
                                <Upload className="w-6 h-6 text-slate-400 mb-1 group-hover:scale-110 transition-transform" />
                                <span className="text-[10px] font-medium text-slate-400">Upload Photo</span>
                                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                            </div>
                        </div>

                        {/* Address Section */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Address Details</Label>
                                <button className="text-xs font-bold text-indigo-600 flex items-center hover:underline">
                                    <MapPin className="w-3 h-3 mr-1" /> Select on Map
                                </button>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                                <Input 
                                    className="h-12 rounded-xl bg-slate-50 border-slate-200" 
                                    placeholder="House/Flat No."
                                    value={formData.house}
                                    onChange={(e) => setFormData({...formData, house: e.target.value})}
                                />
                                <Input 
                                    className="h-12 rounded-xl bg-slate-50 border-slate-200" 
                                    placeholder="Pincode"
                                    value={formData.pincode}
                                    onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                                />
                            </div>
                            <Input 
                                className="h-12 rounded-xl bg-slate-50 border-slate-200" 
                                placeholder="Street / Area"
                                value={formData.street}
                                onChange={(e) => setFormData({...formData, street: e.target.value})}
                            />
                            <Input 
                                className="h-12 rounded-xl bg-slate-50 border-slate-200" 
                                placeholder="City"
                                value={formData.city}
                                onChange={(e) => setFormData({...formData, city: e.target.value})}
                            />
                        </div>

                        {/* Gender */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Gender (Optional)</Label>
                            <select 
                                className="w-full h-12 rounded-xl bg-slate-50 border border-slate-200 px-3 text-sm focus:ring-indigo-500 outline-none"
                                value={formData.gender}
                                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <Button 
                                variant="outline"
                                className="h-14 w-14 rounded-2xl border-slate-200 text-slate-500"
                                onClick={() => setStep(1)}
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </Button>
                            <Button 
                                className="flex-1 h-14 rounded-2xl text-lg font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-900/20"
                                onClick={handleCreateAccount}
                            >
                                Create Account
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
                Already have an account? 
                <button onClick={() => setLocation("/auth")} className="ml-2 font-bold text-indigo-600 hover:underline">
                    Login
                </button>
            </p>
        </div>
      </div>
    </div>
  );
}
