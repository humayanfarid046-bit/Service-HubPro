import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  User, Mail, Phone, Calendar, Upload, Briefcase, MapPin, 
  ShieldCheck, CreditCard, CheckCircle2, ChevronRight, ChevronLeft, Sparkles, AlertCircle, Lock, Eye, EyeOff, Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { registerWorker } from "@/lib/api";
import { LocationPicker } from "@/components/LocationPicker";

// Step Configuration
const STEPS = [
  { id: 1, title: "Account", icon: Lock },
  { id: 2, title: "Personal", icon: User },
  { id: 3, title: "Professional", icon: Briefcase },
  { id: 4, title: "Address", icon: MapPin },
  { id: 5, title: "KYC & Bank", icon: ShieldCheck },
];

export default function WorkerRegister() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1 - Account
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    // Step 2 - Personal
    fullName: "",
    gender: "",
    dob: "",
    photo: null,
    // Step 3 - Professional
    category: "",
    subService: "",
    experience: "",
    availability: "Full-Time",
    // Step 4 - Address
    house: "",
    street: "",
    city: "",
    pincode: "",
    // Step 5 - KYC & Bank
    idProof: null,
    policeVer: null,
    skillCert: null,
    bankName: "",
    accountNo: "",
    ifsc: "",
    upiId: ""
  });

  const updateForm = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (currentStep: number) => {
    if (currentStep === 1) {
      if (!formData.phone || !formData.password) {
        toast({ title: "Missing Fields", description: "Please fill phone and password.", variant: "destructive" });
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        toast({ title: "Password Mismatch", description: "Passwords do not match.", variant: "destructive" });
        return false;
      }
    }
    if (currentStep === 2) {
      if (!formData.fullName) {
        toast({ title: "Missing Fields", description: "Please enter your full name.", variant: "destructive" });
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, 5));
    }
  };

  const handleBack = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!formData.bankName || !formData.accountNo || !formData.ifsc) {
      toast({ title: "Missing Bank Details", description: "Please provide bank details for payouts.", variant: "destructive" });
      return;
    }

    if (!agreeTerms) {
      toast({ title: "Terms Required", description: "Please agree to the Terms of Service.", variant: "destructive" });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await registerWorker({
        phone: formData.phone,
        email: formData.email || null,
        password: formData.password,
        fullName: formData.fullName,
        profilePhoto: null,
        gender: formData.gender || null,
        dateOfBirth: formData.dob || null,
        isActive: false,
        category: formData.category,
        subService: formData.subService,
        experience: parseInt(formData.experience) || 0,
        availability: formData.availability,
        house: formData.house,
        street: formData.street,
        city: formData.city,
        pincode: formData.pincode,
        idProof: null,
        policeVerification: null,
        skillCertificate: null,
        bankHolderName: formData.bankName,
        accountNumber: formData.accountNo,
        ifscCode: formData.ifsc,
        upiId: formData.upiId || null,
      });

      setIsSubmitting(false);
      setSubmissionSuccess(true);
    } catch (error: any) {
      setIsSubmitting(false);
      toast({ 
        title: "Registration Failed", 
        description: error.message,
        variant: "destructive" 
      });
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
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 flex flex-col items-center p-4 md:p-8 font-sans relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px]" />

      <div className="w-full max-w-2xl relative z-10">
        {/* Logo and Header */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <Zap className="w-7 h-7 text-white" />
          </div>
        </div>
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Partner Registration</h1>
          <p className="text-slate-400">Join ServiceHub Pro as a professional</p>
        </div>

        {/* Progress Indicator */}
        <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-4 mb-6 border border-slate-700/50 flex justify-between items-center relative overflow-hidden">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex flex-col items-center z-10 relative w-1/5">
              <div 
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 mb-2 border-2",
                  step >= s.id 
                    ? "bg-gradient-to-br from-cyan-500 to-blue-500 border-cyan-500 text-white shadow-lg shadow-cyan-500/30" 
                    : "bg-slate-700/50 border-slate-600 text-slate-500"
                )}
              >
                <s.icon className="w-5 h-5" />
              </div>
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-wider transition-colors hidden md:block",
                step >= s.id ? "text-cyan-400" : "text-slate-500"
              )}>
                {s.title}
              </span>
            </div>
          ))}
          {/* Progress Bar Line */}
          <div className="absolute top-[28px] left-0 w-full h-1 bg-slate-700 -z-0">
            <motion.div 
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-6 md:p-8 shadow-2xl min-h-[450px] flex flex-col">
          <div className="flex-1">
            <AnimatePresence mode="wait">
              
              {/* STEP 1: ACCOUNT SETUP */}
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-cyan-500/20 rounded-xl text-cyan-400"><Lock className="w-6 h-6" /></div>
                    <h2 className="text-xl font-bold text-white">Account Setup</h2>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-400 text-sm">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <Input value={formData.email} onChange={(e) => updateForm("email", e.target.value)} className="h-14 pl-12 bg-slate-700/50 border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:border-cyan-500" placeholder="Enter your email" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-400 text-sm">Phone Number *</Label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <Input value={formData.phone} onChange={(e) => updateForm("phone", e.target.value)} className="h-14 pl-12 bg-slate-700/50 border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:border-cyan-500" placeholder="Enter phone number" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-400 text-sm">Password *</Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <Input type={showPassword ? "text" : "password"} value={formData.password} onChange={(e) => updateForm("password", e.target.value)} className="h-14 pl-12 pr-12 bg-slate-700/50 border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:border-cyan-500" placeholder="Create password" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-400 text-sm">Confirm Password *</Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <Input type={showConfirmPassword ? "text" : "password"} value={formData.confirmPassword} onChange={(e) => updateForm("confirmPassword", e.target.value)} className="h-14 pl-12 pr-12 bg-slate-700/50 border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:border-cyan-500" placeholder="Confirm password" />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: PERSONAL INFO */}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-cyan-500/20 rounded-xl text-cyan-400"><User className="w-6 h-6" /></div>
                    <h2 className="text-xl font-bold text-white">Personal Information</h2>
                  </div>

                  <div className="flex justify-center mb-4">
                    <div className="w-24 h-24 bg-slate-700/50 rounded-full border-2 border-dashed border-slate-600 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-700 transition-colors relative overflow-hidden group">
                      {formData.photo ? (
                        <div className="w-full h-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-xs">Photo</div>
                      ) : (
                        <>
                          <Upload className="w-6 h-6 text-slate-500 mb-1 group-hover:scale-110 transition-transform" />
                          <span className="text-[10px] font-medium text-slate-500">Upload Photo</span>
                        </>
                      )}
                      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => updateForm("photo", e.target.files?.[0])} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-400 text-sm">Full Name *</Label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <Input value={formData.fullName} onChange={(e) => updateForm("fullName", e.target.value)} className="h-14 pl-12 bg-slate-700/50 border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:border-cyan-500" placeholder="Enter your full name" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-400 text-sm">Gender</Label>
                      <Select onValueChange={(v) => updateForm("gender", v)}>
                        <SelectTrigger className="h-12 rounded-xl bg-slate-700/50 border-slate-600 text-white"><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-400 text-sm">Date of Birth</Label>
                      <Input type="date" className="h-12 rounded-xl bg-slate-700/50 border-slate-600 text-white" onChange={(e) => updateForm("dob", e.target.value)} />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: PROFESSIONAL DETAILS */}
              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-cyan-500/20 rounded-xl text-cyan-400"><Briefcase className="w-6 h-6" /></div>
                    <h2 className="text-xl font-bold text-white">Professional Details</h2>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-400 text-sm">Service Category *</Label>
                    <Select onValueChange={(v) => updateForm("category", v)}>
                      <SelectTrigger className="h-14 rounded-xl bg-slate-700/50 border-slate-600 text-white"><SelectValue placeholder="Select your skill" /></SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="plumber">Plumber</SelectItem>
                        <SelectItem value="electrician">Electrician</SelectItem>
                        <SelectItem value="cleaner">Cleaner</SelectItem>
                        <SelectItem value="carpenter">Carpenter</SelectItem>
                        <SelectItem value="ac-repair">AC Repair</SelectItem>
                        <SelectItem value="painter">Painter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-400 text-sm">Sub-Service Specialization</Label>
                    <Input value={formData.subService} onChange={(e) => updateForm("subService", e.target.value)} className="h-12 rounded-xl bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500" placeholder="e.g. Pipe Fitting, Wiring" />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-400 text-sm">Years of Experience</Label>
                    <Input type="number" value={formData.experience} onChange={(e) => updateForm("experience", e.target.value)} className="h-12 rounded-xl bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500" placeholder="e.g. 5" />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-400 text-sm">Work Availability</Label>
                    <div className="flex gap-3">
                      {["Full-Time", "Part-Time", "Weekends"].map((type) => (
                        <button
                          key={type}
                          onClick={() => updateForm("availability", type)}
                          className={cn(
                            "flex-1 py-3 rounded-xl text-sm font-bold border-2 transition-all",
                            formData.availability === type 
                              ? "border-cyan-500 bg-cyan-500/20 text-cyan-400" 
                              : "border-slate-600 bg-slate-700/50 text-slate-400 hover:border-slate-500"
                          )}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: ADDRESS */}
              {step === 4 && (
                <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-cyan-500/20 rounded-xl text-cyan-400"><MapPin className="w-6 h-6" /></div>
                    <h2 className="text-xl font-bold text-white">Address Details</h2>
                  </div>

                  <Button 
                    variant="outline" 
                    onClick={() => setShowLocationPicker(true)}
                    className="w-full h-12 rounded-xl border-dashed border-2 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 mb-2"
                    data-testid="button-select-map"
                  >
                    <MapPin className="w-4 h-4 mr-2" /> Select on Map
                  </Button>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-400 text-sm">House / Flat No *</Label>
                      <Input value={formData.house} onChange={(e) => updateForm("house", e.target.value)} className="h-12 rounded-xl bg-slate-700/50 border-slate-600 text-white" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-400 text-sm">Pincode *</Label>
                      <Input value={formData.pincode} onChange={(e) => updateForm("pincode", e.target.value)} className="h-12 rounded-xl bg-slate-700/50 border-slate-600 text-white" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-400 text-sm">Street / Area *</Label>
                    <Input value={formData.street} onChange={(e) => updateForm("street", e.target.value)} className="h-12 rounded-xl bg-slate-700/50 border-slate-600 text-white" />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-400 text-sm">City *</Label>
                    <Input value={formData.city} onChange={(e) => updateForm("city", e.target.value)} className="h-12 rounded-xl bg-slate-700/50 border-slate-600 text-white" />
                  </div>
                </motion.div>
              )}

              {/* STEP 5: KYC & BANK */}
              {step === 5 && (
                <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-cyan-500/20 rounded-xl text-cyan-400"><ShieldCheck className="w-6 h-6" /></div>
                    <h2 className="text-xl font-bold text-white">KYC & Bank Details</h2>
                  </div>

                  <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl flex gap-3 items-start">
                    <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-300 leading-relaxed">
                      Please upload clear photos of your original documents. Blurred or photocopied documents may lead to rejection.
                    </p>
                  </div>

                  {[
                    { key: "idProof", label: "ID Proof (Aadhaar / PAN) *" },
                    { key: "policeVer", label: "Police Verification (Optional)" }
                  ].map((doc) => (
                    <div key={doc.key} className="space-y-2">
                      <Label className="text-slate-400 text-sm">{doc.label}</Label>
                      <div className="h-16 bg-slate-700/50 rounded-xl border-2 border-dashed border-slate-600 flex items-center justify-center cursor-pointer hover:border-cyan-500/50 transition-colors relative">
                        <div className="flex items-center gap-2 text-slate-500">
                          <Upload className="w-5 h-5" />
                          <span className="text-sm font-medium">Click to upload</span>
                        </div>
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => updateForm(doc.key, e.target.files?.[0])} />
                      </div>
                    </div>
                  ))}

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="space-y-2">
                      <Label className="text-slate-400 text-sm">Account Holder Name *</Label>
                      <Input value={formData.bankName} onChange={(e) => updateForm("bankName", e.target.value)} className="h-12 rounded-xl bg-slate-700/50 border-slate-600 text-white" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-400 text-sm">Account Number *</Label>
                      <Input value={formData.accountNo} onChange={(e) => updateForm("accountNo", e.target.value)} className="h-12 rounded-xl bg-slate-700/50 border-slate-600 text-white" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-400 text-sm">IFSC Code *</Label>
                      <Input value={formData.ifsc} onChange={(e) => updateForm("ifsc", e.target.value)} className="h-12 rounded-xl bg-slate-700/50 border-slate-600 text-white" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-400 text-sm">UPI ID (Optional)</Label>
                      <Input value={formData.upiId} onChange={(e) => updateForm("upiId", e.target.value)} className="h-12 rounded-xl bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500" placeholder="user@upi" />
                    </div>
                  </div>

                  {/* Terms Agreement */}
                  <div className="flex items-center gap-2 pt-2">
                    <Checkbox 
                      id="workerTerms" 
                      checked={agreeTerms}
                      onCheckedChange={(checked) => setAgreeTerms(!!checked)}
                      className="border-slate-600 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500"
                    />
                    <label htmlFor="workerTerms" className="text-sm text-slate-400 cursor-pointer">
                      I agree to the <span className="text-cyan-400">Terms of Service</span>
                    </label>
                  </div>

                  <Button 
                    className="w-full h-14 rounded-xl text-lg font-bold bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg shadow-cyan-500/30"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                          <Sparkles className="w-5 h-5" />
                        </motion.div>
                        Processing...
                      </span>
                    ) : (
                      "Submit Registration"
                    )}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          {step < 5 && (
            <div className="flex gap-3 mt-6 pt-4 border-t border-slate-700/50">
              <Button 
                variant="outline"
                className="h-14 w-14 rounded-xl border-slate-600 text-slate-400 hover:bg-slate-700/50"
                onClick={handleBack}
                disabled={step === 1}
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              <Button 
                className="flex-1 h-14 rounded-xl text-lg font-bold bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg shadow-cyan-500/30"
                onClick={handleNext}
              >
                Next Step <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
            </div>
          )}
        </div>
        
        <p className="text-center text-slate-400 text-sm mt-6">
          Already registered?{" "}
          <button onClick={() => setLocation("/auth")} className="text-cyan-400 hover:text-cyan-300 font-medium">
            Login here
          </button>
        </p>
      </div>

      {/* Location Picker Dialog */}
      <LocationPicker
        open={showLocationPicker}
        onOpenChange={setShowLocationPicker}
        onLocationSelect={(location) => {
          setFormData((prev: typeof formData) => ({
            ...prev,
            house: location.house || prev.house,
            street: location.street || prev.street,
            city: location.city || prev.city,
            pincode: location.pincode || prev.pincode
          }));
        }}
        darkMode={true}
      />
    </div>
  );
}
