import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileText, Save, Loader2, Eye, Clock, Check
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PolicyDocument {
  title: string;
  content: string;
  lastUpdated: string;
  version: string;
}

export default function AdminTermsPolicyEditor() {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("terms");
  
  const [documents, setDocuments] = useState<Record<string, PolicyDocument>>({
    terms: {
      title: "Terms of Service",
      content: `1. ACCEPTANCE OF TERMS

By accessing and using ServiceHub Pro, you accept and agree to be bound by the terms and provisions of this agreement.

2. DESCRIPTION OF SERVICE

ServiceHub Pro provides a platform connecting customers with service providers for home services including but not limited to plumbing, electrical work, cleaning, and repairs.

3. USER RESPONSIBILITIES

Users must provide accurate information during registration and maintain the security of their account credentials.

4. SERVICE BOOKING

All bookings are subject to availability of service providers. We reserve the right to cancel or reschedule bookings.

5. PAYMENT TERMS

Payment must be made as per the selected payment method. All prices are inclusive of applicable taxes unless stated otherwise.

6. CANCELLATION POLICY

Cancellations made 24 hours before the scheduled service are eligible for full refund. Later cancellations may incur charges.`,
      lastUpdated: "2024-01-15",
      version: "2.1",
    },
    privacy: {
      title: "Privacy Policy",
      content: `1. INFORMATION WE COLLECT

We collect personal information including name, phone number, email, and address when you register on our platform.

2. HOW WE USE YOUR INFORMATION

Your information is used to provide services, process payments, and communicate with you about your bookings.

3. DATA SECURITY

We implement appropriate security measures to protect your personal information from unauthorized access.

4. THIRD-PARTY SHARING

We may share your information with service providers only to fulfill your service requests.

5. COOKIES AND TRACKING

We use cookies to improve your experience on our platform and analyze usage patterns.

6. YOUR RIGHTS

You have the right to access, modify, or delete your personal information by contacting our support team.`,
      lastUpdated: "2024-01-10",
      version: "1.5",
    },
    refund: {
      title: "Refund Policy",
      content: `1. ELIGIBILITY FOR REFUND

Refunds are available for services not rendered or when the service quality does not meet our standards.

2. REFUND PROCESS

Request a refund through the app within 24 hours of service completion. Our team will review and process within 5-7 business days.

3. REFUND METHODS

Refunds will be credited to the original payment method used for the booking.

4. NON-REFUNDABLE ITEMS

Convenience fees and service charges are non-refundable.

5. PARTIAL REFUNDS

In case of partial service completion, a proportional refund may be issued based on the work completed.`,
      lastUpdated: "2024-01-08",
      version: "1.2",
    },
  });

  const handleSave = async (docType: string) => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setDocuments({
      ...documents,
      [docType]: {
        ...documents[docType],
        lastUpdated: new Date().toISOString().split('T')[0],
      },
    });
    setSaving(false);
    toast({ title: "Success", description: `${documents[docType].title} saved!` });
  };

  const updateDocument = (docType: string, field: keyof PolicyDocument, value: string) => {
    setDocuments({
      ...documents,
      [docType]: {
        ...documents[docType],
        [field]: value,
      },
    });
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Terms & Policy Editor</h1>
          <p className="text-slate-500 mt-1">Manage legal documents and policies for your app.</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {Object.entries(documents).map(([key, doc]) => (
          <Card key={key} className="bg-slate-50 border-slate-100">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{doc.title}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock className="w-3 h-3" />
                    {doc.lastUpdated}
                    <Badge variant="outline" className="text-xs">v{doc.version}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-slate-100">
          <TabsTrigger value="terms">Terms of Service</TabsTrigger>
          <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
          <TabsTrigger value="refund">Refund Policy</TabsTrigger>
        </TabsList>

        {Object.entries(documents).map(([key, doc]) => (
          <TabsContent key={key} value={key}>
            <Card className="border-slate-100 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    {doc.title}
                  </CardTitle>
                  <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" /> Last updated: {doc.lastUpdated}
                    </span>
                    <Badge variant="outline">Version {doc.version}</Badge>
                  </div>
                </div>
                <Button onClick={() => handleSave(key)} disabled={saving} className="gap-2">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Changes
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Document Title</Label>
                    <Input 
                      value={doc.title} 
                      onChange={(e) => updateDocument(key, 'title', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Version</Label>
                    <Input 
                      value={doc.version} 
                      onChange={(e) => updateDocument(key, 'version', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Content</Label>
                  <Textarea 
                    value={doc.content} 
                    onChange={(e) => updateDocument(key, 'content', e.target.value)}
                    rows={20}
                    className="font-mono text-sm"
                  />
                </div>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                  <Button variant="outline" className="gap-2">
                    <Eye className="w-4 h-4" /> Preview
                  </Button>
                  <p className="text-sm text-slate-500">
                    Changes will be visible to users after saving.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </AdminLayout>
  );
}
