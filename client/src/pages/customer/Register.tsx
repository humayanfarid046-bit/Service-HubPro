import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Upload, ChevronLeft, CheckCircle2, Zap, Lock, Eye, EyeOff, Mail, Phone, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { registerCustomer } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Checkbox } from "@/components/ui/checkbox";
import { LocationPicker } from "@/components/LocationPicker";

export default function CustomerRegister() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { login } = useAuth();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    house: "",
    street: "",
    city: "",
    pincode: "",
    gender: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  const handleCreateAccount = async () => {
    if (!formData.name || !formData.phone || !formData.password) {
      toast({ title: "Missing Fields", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({ title: "Password Mismatch", description: "Passwords do not match.", variant: "destructive" });
      return;
    }

    if (!agreeTerms) {
      toast({ title: "Terms Required", description: "Please agree to the Terms of Service.", variant: "destructive" });
      return;
    }

    try {
      const response = await registerCustomer({
        phone: formData.phone,
        email: formData.email || null,
        password: formData.password,
        fullName: formData.name,
        profilePhoto: null,
        gender: formData.gender || null,
        dateOfBirth: null,
        isActive: false,
        house: formData.house,
        street: formData.street,
        city: formData.city,
        pincode: formData.pincode,
      });

      setSubmissionSuccess(true);
    } catch (error: any) {
      toast({ title: "Registration Failed", description: error.message, variant: "destructive" });
    }
  };

  // Success screen after submission
  if (submissionSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px]" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-8 shadow-2xl text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mx-auto flex items-center justify-center shadow-lg shadow-green-500/30 mb-6">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">Submission Successful!</h1>
            <p className="text-slate-400 text-base leading-relaxed mb-8">
              Our team will review your request and get in touch with you shortly.
            </p>
            <Button 
              className="w-full h-14 rounded-xl text-lg font-bold bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg shadow-cyan-500/30"
              onClick={() => setLocation("/auth")}
              data-testid="button-back-login"
            >
              Back to Login
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px]" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <Zap className="w-8 h-8 text-white" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-white text-center mb-2">Create Account</h1>
        <p className="text-slate-400 text-center mb-6">Join as a Customer to book home services</p>

        <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-6 shadow-2xl">
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
                  {/* Email */}
                  <div className="space-y-2">
                    <Label className="text-slate-400 text-sm">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <Input 
                        className="h-14 pl-12 bg-slate-700/50 border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        data-testid="input-email"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label className="text-slate-400 text-sm">Phone Number *</Label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <Input 
                        className="h-14 pl-12 bg-slate-700/50 border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20"
                        placeholder="Enter phone number"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        data-testid="input-phone"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label className="text-slate-400 text-sm">Password *</Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <Input 
                        type={showPassword ? "text" : "password"}
                        className="h-14 pl-12 pr-12 bg-slate-700/50 border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20"
                        placeholder="Create password"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
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

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label className="text-slate-400 text-sm">Confirm Password *</Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <Input 
                        type={showConfirmPassword ? "text" : "password"}
                        className="h-14 pl-12 pr-12 bg-slate-700/50 border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20"
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        data-testid="input-confirm-password"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <Button 
                  className="w-full h-14 rounded-xl text-lg font-bold bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg shadow-cyan-500/30"
                  onClick={() => setStep(2)}
                  data-testid="button-next"
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
                className="space-y-5"
              >
                {/* Full Name */}
                <div className="space-y-2">
                  <Label className="text-slate-400 text-sm">Full Name *</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <Input 
                      className="h-14 pl-12 bg-slate-700/50 border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      data-testid="input-name"
                    />
                  </div>
                </div>

                {/* Address Section */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-slate-400 text-sm">Address Details</Label>
                    <button 
                      type="button"
                      onClick={() => setShowLocationPicker(true)}
                      className="text-xs font-bold text-cyan-400 flex items-center hover:text-cyan-300"
                      data-testid="button-select-map"
                    >
                      <MapPin className="w-3 h-3 mr-1" /> Select on Map
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Input 
                      className="h-12 bg-slate-700/50 border-slate-600 rounded-xl text-white placeholder:text-slate-500"
                      placeholder="House/Flat No."
                      value={formData.house}
                      onChange={(e) => setFormData({...formData, house: e.target.value})}
                      data-testid="input-house"
                    />
                    <Input 
                      className="h-12 bg-slate-700/50 border-slate-600 rounded-xl text-white placeholder:text-slate-500"
                      placeholder="Pincode"
                      value={formData.pincode}
                      onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                      data-testid="input-pincode"
                    />
                  </div>
                  <Input 
                    className="h-12 bg-slate-700/50 border-slate-600 rounded-xl text-white placeholder:text-slate-500"
                    placeholder="Street / Area"
                    value={formData.street}
                    onChange={(e) => setFormData({...formData, street: e.target.value})}
                    data-testid="input-street"
                  />
                  <Input 
                    className="h-12 bg-slate-700/50 border-slate-600 rounded-xl text-white placeholder:text-slate-500"
                    placeholder="City"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    data-testid="input-city"
                  />
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <Label className="text-slate-400 text-sm">Gender (Optional)</Label>
                  <select 
                    className="w-full h-12 rounded-xl bg-slate-700/50 border border-slate-600 px-3 text-white text-sm focus:border-cyan-500 outline-none"
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    data-testid="select-gender"
                  >
                    <option value="" className="bg-slate-800">Select Gender</option>
                    <option value="Male" className="bg-slate-800">Male</option>
                    <option value="Female" className="bg-slate-800">Female</option>
                    <option value="Other" className="bg-slate-800">Other</option>
                  </select>
                </div>

                {/* Terms Agreement */}
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="terms" 
                    checked={agreeTerms}
                    onCheckedChange={(checked) => setAgreeTerms(!!checked)}
                    className="border-slate-600 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"
                  />
                  <label htmlFor="terms" className="text-sm text-slate-400 cursor-pointer">
                    I agree to the <span className="text-cyan-400">Terms of Service</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button 
                    variant="outline"
                    className="h-14 w-14 rounded-xl border-slate-600 text-slate-400 hover:bg-slate-700/50"
                    onClick={() => setStep(1)}
                    data-testid="button-back"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </Button>
                  <Button 
                    className="flex-1 h-14 rounded-xl text-lg font-bold bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg shadow-cyan-500/30"
                    onClick={handleCreateAccount}
                    data-testid="button-create-account"
                  >
                    Log In
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center text-slate-400 text-sm mt-6">
          Already have an account?{" "}
          <button onClick={() => setLocation("/auth")} className="text-cyan-400 hover:text-cyan-300 font-medium">
            Log In
          </button>
        </p>
      </div>

      {/* Location Picker Dialog */}
      <LocationPicker
        open={showLocationPicker}
        onOpenChange={setShowLocationPicker}
        onLocationSelect={(location) => {
          setFormData({
            ...formData,
            house: location.house || formData.house,
            street: location.street || formData.street,
            city: location.city || formData.city,
            pincode: location.pincode || formData.pincode
          });
        }}
        darkMode={true}
      />
    </div>
  );
}
