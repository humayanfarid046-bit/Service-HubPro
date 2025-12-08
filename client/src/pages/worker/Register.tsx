import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  User, Mail, Phone, Calendar, Upload, Briefcase, MapPin, 
  ShieldCheck, CreditCard, CheckCircle2, ChevronRight, ChevronLeft, Sparkles, AlertCircle 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Step Configuration
const STEPS = [
  { id: 1, title: "Personal Info", icon: User },
  { id: 2, title: "Professional", icon: Briefcase },
  { id: 3, title: "Address", icon: MapPin },
  { id: 4, title: "KYC Verify", icon: ShieldCheck },
  { id: 5, title: "Bank Details", icon: CreditCard },
];

export default function WorkerRegister() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [step, setStep] = useState(1);
  const [otpSent, setOtpSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1
    fullName: "",
    email: "",
    phone: "",
    otp: "",
    gender: "",
    dob: "",
    photo: null,
    // Step 2
    category: "",
    subService: "",
    experience: "",
    availability: "Full-Time",
    // Step 3
    house: "",
    street: "",
    city: "",
    pincode: "",
    // Step 4
    idProof: null,
    policeVer: null,
    skillCert: null,
    // Step 5
    bankName: "",
    accountNo: "",
    ifsc: "",
    upiId: ""
  });

  const updateForm = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSendOtp = () => {
    if (formData.phone.length < 10) {
      toast({ title: "Invalid Phone", description: "Please enter a valid 10-digit number.", variant: "destructive" });
      return;
    }
    setOtpSent(true);
    toast({ title: "OTP Sent", description: `Code sent to ${formData.phone}` });
  };

  const validateStep = (currentStep: number) => {
    // Basic validation logic
    if (currentStep === 1) {
      if (!formData.fullName || !formData.email || !formData.phone) {
        toast({ title: "Missing Fields", description: "Please fill all required fields.", variant: "destructive" });
        return false;
      }
      if (otpSent && formData.otp !== "1234") {
         toast({ title: "Invalid OTP", description: "Use 1234 for testing.", variant: "destructive" });
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

  const handleSubmit = () => {
    if (!formData.bankName || !formData.accountNo || !formData.ifsc) {
      toast({ title: "Missing Bank Details", description: "Please provide bank details for payouts.", variant: "destructive" });
      return;
    }
    
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast({ 
        title: "Registration Submitted!", 
        description: "Your application is under review by the admin.",
        duration: 5000 
      });
      // Redirect to a "Pending Approval" or Login page
      setLocation("/auth"); 
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-4 md:p-8 font-sans relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-200/30 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-200/30 rounded-full blur-[120px]" />

      <div className="w-full max-w-2xl relative z-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Partner Registration</h1>
          <p className="text-slate-500">Join ServiceHub Pro as a professional</p>
        </div>

        {/* Progress Indicator */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 mb-6 shadow-sm border border-white flex justify-between items-center relative overflow-hidden">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex flex-col items-center z-10 relative w-1/5">
              <div 
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 mb-2 border-2",
                  step >= s.id 
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/30" 
                    : "bg-white border-slate-200 text-slate-400"
                )}
              >
                <s.icon className="w-5 h-5" />
              </div>
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-wider transition-colors hidden md:block",
                step >= s.id ? "text-indigo-600" : "text-slate-400"
              )}>
                {s.title}
              </span>
            </div>
          ))}
          {/* Progress Bar Line */}
          <div className="absolute top-[28px] left-0 w-full h-1 bg-slate-100 -z-0">
            <motion.div 
              className="h-full bg-indigo-600 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-slate-200/50 p-6 md:p-8 border border-white min-h-[500px] flex flex-col">
          <div className="flex-1">
            <AnimatePresence mode="wait">
              
              {/* STEP 1: PERSONAL INFO */}
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600"><User className="w-6 h-6" /></div>
                    <h2 className="text-xl font-bold text-slate-900">Personal Information</h2>
                  </div>

                  <div className="flex justify-center mb-6">
                    <div className="w-28 h-28 bg-slate-100 rounded-full border-2 border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors relative overflow-hidden group">
                      {formData.photo ? (
                        <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">Photo Uploaded</div>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-slate-400 mb-2 group-hover:scale-110 transition-transform" />
                          <span className="text-xs font-medium text-slate-400">Upload Photo *</span>
                        </>
                      )}
                      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => updateForm("photo", e.target.files?.[0])} />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-500 uppercase ml-1">Full Name *</Label>
                      <Input value={formData.fullName} onChange={(e) => updateForm("fullName", e.target.value)} className="h-12 rounded-xl bg-slate-50 border-slate-200" placeholder="e.g. Rahul Kumar" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-500 uppercase ml-1">Email Address *</Label>
                      <Input value={formData.email} onChange={(e) => updateForm("email", e.target.value)} className="h-12 rounded-xl bg-slate-50 border-slate-200" placeholder="rahul@example.com" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-500 uppercase ml-1">Phone Number *</Label>
                    <div className="flex gap-2">
                      <Input value={formData.phone} onChange={(e) => updateForm("phone", e.target.value)} className="h-12 rounded-xl bg-slate-50 border-slate-200" placeholder="+91 98765 43210" />
                      <Button onClick={handleSendOtp} disabled={otpSent} className={cn("h-12 px-6 rounded-xl", otpSent ? "bg-green-500" : "bg-slate-900")}>
                        {otpSent ? "Sent" : "Send OTP"}
                      </Button>
                    </div>
                  </div>

                  {otpSent && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-500 uppercase ml-1">Enter OTP *</Label>
                      <Input value={formData.otp} onChange={(e) => updateForm("otp", e.target.value)} className="h-12 rounded-xl bg-white border-indigo-200 text-center tracking-[0.5em] font-bold" maxLength={4} placeholder="0000" />
                    </motion.div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-500 uppercase ml-1">Gender</Label>
                      <Select onValueChange={(v) => updateForm("gender", v)}>
                        <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-200"><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-500 uppercase ml-1">Date of Birth</Label>
                      <Input type="date" className="h-12 rounded-xl bg-slate-50 border-slate-200" onChange={(e) => updateForm("dob", e.target.value)} />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: PROFESSIONAL DETAILS */}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600"><Briefcase className="w-6 h-6" /></div>
                    <h2 className="text-xl font-bold text-slate-900">Professional Details</h2>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-500 uppercase ml-1">Service Category *</Label>
                    <Select onValueChange={(v) => updateForm("category", v)}>
                      <SelectTrigger className="h-14 rounded-xl bg-slate-50 border-slate-200 text-lg"><SelectValue placeholder="Select your skill" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="plumber">Plumber</SelectItem>
                        <SelectItem value="electrician">Electrician</SelectItem>
                        <SelectItem value="cleaner">Cleaner</SelectItem>
                        <SelectItem value="carpenter">Carpenter</SelectItem>
                        <SelectItem value="ac-repair">AC Repair</SelectItem>
                        <SelectItem value="painter">Painter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                   <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-500 uppercase ml-1">Sub-Service Specialization</Label>
                    <Input value={formData.subService} onChange={(e) => updateForm("subService", e.target.value)} className="h-12 rounded-xl bg-slate-50 border-slate-200" placeholder="e.g. Pipe Fitting, Wiring" />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-500 uppercase ml-1">Years of Experience</Label>
                    <Input type="number" value={formData.experience} onChange={(e) => updateForm("experience", e.target.value)} className="h-12 rounded-xl bg-slate-50 border-slate-200" placeholder="e.g. 5" />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-500 uppercase ml-1">Work Availability</Label>
                    <div className="flex gap-3">
                      {["Full-Time", "Part-Time", "Weekends"].map((type) => (
                        <button
                          key={type}
                          onClick={() => updateForm("availability", type)}
                          className={cn(
                            "flex-1 py-3 rounded-xl text-sm font-bold border-2 transition-all",
                            formData.availability === type 
                              ? "border-indigo-600 bg-indigo-50 text-indigo-700" 
                              : "border-slate-100 bg-white text-slate-500 hover:border-slate-200"
                          )}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: ADDRESS */}
              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600"><MapPin className="w-6 h-6" /></div>
                    <h2 className="text-xl font-bold text-slate-900">Address Details</h2>
                  </div>

                  <Button variant="outline" className="w-full h-12 rounded-xl border-dashed border-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50 mb-2">
                    <MapPin className="w-4 h-4 mr-2" /> Select on Map
                  </Button>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-500 uppercase ml-1">House / Flat No *</Label>
                      <Input value={formData.house} onChange={(e) => updateForm("house", e.target.value)} className="h-12 rounded-xl bg-slate-50 border-slate-200" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-500 uppercase ml-1">Pincode *</Label>
                      <Input value={formData.pincode} onChange={(e) => updateForm("pincode", e.target.value)} className="h-12 rounded-xl bg-slate-50 border-slate-200" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-500 uppercase ml-1">Street / Area *</Label>
                    <Input value={formData.street} onChange={(e) => updateForm("street", e.target.value)} className="h-12 rounded-xl bg-slate-50 border-slate-200" />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-500 uppercase ml-1">City *</Label>
                    <Input value={formData.city} onChange={(e) => updateForm("city", e.target.value)} className="h-12 rounded-xl bg-slate-50 border-slate-200" />
                  </div>
                </motion.div>
              )}

              {/* STEP 4: KYC */}
              {step === 4 && (
                <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600"><ShieldCheck className="w-6 h-6" /></div>
                    <h2 className="text-xl font-bold text-slate-900">Identity Verification</h2>
                  </div>

                  <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3 items-start">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-800 leading-relaxed">
                      Please upload clear photos of your original documents. Blurred or photocopied documents may lead to rejection.
                    </p>
                  </div>

                  {[
                    { key: "idProof", label: "ID Proof (Aadhaar / PAN) *" },
                    { key: "policeVer", label: "Police Verification (Optional)" },
                    { key: "skillCert", label: "Skill Certificate (Optional)" }
                  ].map((doc) => (
                    <div key={doc.key} className="space-y-2">
                      <Label className="text-xs font-bold text-slate-500 uppercase ml-1">{doc.label}</Label>
                      <div className="h-20 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center cursor-pointer hover:border-indigo-300 transition-colors relative">
                        <div className="flex items-center gap-2 text-slate-400">
                          <Upload className="w-5 h-5" />
                          <span className="text-sm font-medium">Click to upload</span>
                        </div>
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => updateForm(doc.key, e.target.files?.[0])} />
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* STEP 5: BANK & SUBMIT */}
              {step === 5 && (
                <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600"><CreditCard className="w-6 h-6" /></div>
                    <h2 className="text-xl font-bold text-slate-900">Bank Details</h2>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-500 uppercase ml-1">Account Holder Name *</Label>
                      <Input value={formData.bankName} onChange={(e) => updateForm("bankName", e.target.value)} className="h-12 rounded-xl bg-slate-50 border-slate-200" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-500 uppercase ml-1">Account Number *</Label>
                      <Input value={formData.accountNo} onChange={(e) => updateForm("accountNo", e.target.value)} className="h-12 rounded-xl bg-slate-50 border-slate-200" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-500 uppercase ml-1">IFSC Code *</Label>
                      <Input value={formData.ifsc} onChange={(e) => updateForm("ifsc", e.target.value)} className="h-12 rounded-xl bg-slate-50 border-slate-200" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-slate-500 uppercase ml-1">UPI ID (Optional)</Label>
                      <Input value={formData.upiId} onChange={(e) => updateForm("upiId", e.target.value)} className="h-12 rounded-xl bg-slate-50 border-slate-200" placeholder="user@upi" />
                    </div>
                  </div>

                  <div className="pt-4 text-center">
                    <p className="text-xs text-slate-500 mb-4">
                      By submitting, you agree to our Terms of Service. Your documents will be reviewed by our admin team.
                    </p>
                    <Button 
                      className="w-full h-14 rounded-2xl text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-xl shadow-indigo-500/30"
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
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          {step < 5 && (
            <div className="flex gap-3 mt-8 pt-4 border-t border-slate-100">
              <Button 
                variant="outline"
                className="h-14 w-14 rounded-2xl border-slate-200 text-slate-500"
                onClick={handleBack}
                disabled={step === 1}
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              <Button 
                className="flex-1 h-14 rounded-2xl text-lg font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-900/20"
                onClick={handleNext}
              >
                Next Step <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
            </div>
          )}
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            Already registered? 
            <button onClick={() => setLocation("/auth")} className="ml-2 font-bold text-indigo-600 hover:underline">
              Login here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
