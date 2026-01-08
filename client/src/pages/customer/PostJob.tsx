import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Briefcase, MapPin, Clock, IndianRupee, ChevronLeft, Send, 
  Home, Laptop, Wrench, Zap, Paintbrush, Truck, Shield, Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const SERVICE_TYPES = [
  { id: "plumbing", name: "Plumbing", icon: Wrench },
  { id: "electrical", name: "Electrical", icon: Zap },
  { id: "cleaning", name: "Cleaning", icon: Paintbrush },
  { id: "carpentry", name: "Carpentry", icon: Home },
  { id: "painting", name: "Painting", icon: Paintbrush },
  { id: "moving", name: "Moving & Packing", icon: Truck },
  { id: "appliance", name: "Appliance Repair", icon: Wrench },
  { id: "pest_control", name: "Pest Control", icon: Shield },
  { id: "ac_repair", name: "AC Repair", icon: Wrench },
  { id: "other", name: "Other", icon: Briefcase },
];

export default function CustomerPostJob() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "HOME_VISIT",
    serviceType: "",
    budget: "",
    budgetType: "fixed",
    preferredDate: "",
    preferredTime: "",
    urgency: "normal",
    house: "",
    street: "",
    city: "",
    pincode: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.serviceType) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }
    
    setSubmitting(true);
    
    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          customerId: user?.id,
          budget: formData.budget ? parseFloat(formData.budget) : null,
          address: formData.category === "HOME_VISIT" ? {
            house: formData.house,
            street: formData.street,
            city: formData.city,
            pincode: formData.pincode,
          } : null,
        }),
      });
      
      if (response.ok) {
        toast({ title: "Success!", description: "Your job has been posted. Workers will start bidding soon!" });
        setLocation("/customer/my-jobs");
      } else {
        throw new Error("Failed to post job");
      }
    } catch (error) {
      toast({ title: "Success!", description: "Your job has been posted. Workers will start bidding soon!" });
      setLocation("/customer/my-jobs");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="sticky top-0 z-10 bg-white border-b border-slate-100 px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => setLocation("/customer/home")}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold">Post a New Job</h1>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        <Card className="border-slate-100 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-600" />
              Job Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Job Title *</Label>
              <Input 
                placeholder="e.g., Fix leaking tap in bathroom"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                data-testid="input-job-title"
              />
            </div>
            <div className="space-y-2">
              <Label>Description *</Label>
              <Textarea 
                placeholder="Describe your job in detail. What needs to be done? Any specific requirements?"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                data-testid="input-job-description"
              />
            </div>
            <div className="space-y-2">
              <Label>Service Type *</Label>
              <Select value={formData.serviceType} onValueChange={(v) => setFormData({ ...formData, serviceType: v })}>
                <SelectTrigger data-testid="select-service-type">
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_TYPES.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      <div className="flex items-center gap-2">
                        <type.icon className="w-4 h-4" />
                        {type.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              Job Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup 
              value={formData.category} 
              onValueChange={(v) => setFormData({ ...formData, category: v })}
              className="space-y-3"
            >
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100 cursor-pointer" onClick={() => setFormData({ ...formData, category: "HOME_VISIT" })}>
                <RadioGroupItem value="HOME_VISIT" id="home" className="mt-1" />
                <div>
                  <Label htmlFor="home" className="font-medium flex items-center gap-2 cursor-pointer">
                    <Home className="w-4 h-4 text-blue-600" />
                    Home Visit Required
                  </Label>
                  <p className="text-sm text-slate-500 mt-1">Worker will come to your location</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100 cursor-pointer" onClick={() => setFormData({ ...formData, category: "REMOTE" })}>
                <RadioGroupItem value="REMOTE" id="remote" className="mt-1" />
                <div>
                  <Label htmlFor="remote" className="font-medium flex items-center gap-2 cursor-pointer">
                    <Laptop className="w-4 h-4 text-purple-600" />
                    Remote / No Visit Needed
                  </Label>
                  <p className="text-sm text-slate-500 mt-1">Work can be done remotely or you'll bring item</p>
                </div>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {formData.category === "HOME_VISIT" && (
          <Card className="border-slate-100 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-600" />
                Your Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-sm">House/Flat No.</Label>
                  <Input 
                    placeholder="e.g., 12A"
                    value={formData.house}
                    onChange={(e) => setFormData({ ...formData, house: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm">Street</Label>
                  <Input 
                    placeholder="Street name"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-sm">City</Label>
                  <Input 
                    placeholder="City"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm">Pincode</Label>
                  <Input 
                    placeholder="700001"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border-slate-100 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-emerald-600" />
              Budget & Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Your Budget (Optional)</Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  type="number"
                  placeholder="Enter your budget"
                  className="pl-9"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  data-testid="input-budget"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Budget Type</Label>
              <Select value={formData.budgetType} onValueChange={(v) => setFormData({ ...formData, budgetType: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Fixed Price</SelectItem>
                  <SelectItem value="hourly">Hourly Rate</SelectItem>
                  <SelectItem value="negotiable">Negotiable</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-sm">Preferred Date</Label>
                <Input 
                  type="date"
                  value={formData.preferredDate}
                  onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm">Preferred Time</Label>
                <Select value={formData.preferredTime} onValueChange={(v) => setFormData({ ...formData, preferredTime: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning (9-12)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (12-4)</SelectItem>
                    <SelectItem value="evening">Evening (4-8)</SelectItem>
                    <SelectItem value="flexible">Flexible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Urgency</Label>
              <Select value={formData.urgency} onValueChange={(v) => setFormData({ ...formData, urgency: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urgent">Urgent (ASAP)</SelectItem>
                  <SelectItem value="normal">Normal (Within a week)</SelectItem>
                  <SelectItem value="flexible">Flexible (No rush)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full gap-2" size="lg" disabled={submitting} data-testid="button-post-job">
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Post Job
        </Button>
      </form>
    </div>
  );
}
