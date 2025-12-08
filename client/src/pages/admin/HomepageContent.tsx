import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Layout, Save, Loader2, Eye, Smartphone, Monitor, 
  Type, Image, MessageSquare, Phone, Mail
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminHomepageContent() {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState({
    heroTitle: "Find Trusted Home Services",
    heroSubtitle: "Book expert professionals for all your home service needs",
    heroCtaText: "Book Now",
    heroCtaLink: "/services",
    showHeroBanner: true,
    featuredSectionTitle: "Popular Services",
    showFeaturedSection: true,
    testimonialSectionTitle: "What Our Customers Say",
    showTestimonials: true,
    ctaSectionTitle: "Ready to get started?",
    ctaSectionText: "Download our app and book your first service today!",
    showCtaSection: true,
    footerAbout: "ServiceHub Pro is your trusted platform for all home services.",
    footerPhone: "+91 98765 43210",
    footerEmail: "support@servicehub.com",
    footerAddress: "123 Main Street, Kolkata, WB 700001",
  });

  const handleSave = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    toast({ title: "Success", description: "Homepage content saved!" });
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Homepage Content</h1>
          <p className="text-slate-500 mt-1">Customize your app's homepage content and sections.</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="hero" className="space-y-6">
        <TabsList className="bg-slate-100">
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="sections">Content Sections</TabsTrigger>
          <TabsTrigger value="footer">Footer</TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
          <Card className="border-slate-100 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layout className="w-5 h-5 text-blue-600" />
                Hero Section
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-slate-500" />
                  <div>
                    <p className="font-medium">Show Hero Banner</p>
                    <p className="text-sm text-slate-500">Display the hero section on homepage</p>
                  </div>
                </div>
                <Switch 
                  checked={content.showHeroBanner} 
                  onCheckedChange={(v) => setContent({ ...content, showHeroBanner: v })} 
                />
              </div>
              <div className="space-y-2">
                <Label>Hero Title</Label>
                <Input 
                  value={content.heroTitle} 
                  onChange={(e) => setContent({ ...content, heroTitle: e.target.value })}
                  placeholder="Main headline"
                />
              </div>
              <div className="space-y-2">
                <Label>Hero Subtitle</Label>
                <Textarea 
                  value={content.heroSubtitle} 
                  onChange={(e) => setContent({ ...content, heroSubtitle: e.target.value })}
                  placeholder="Supporting text"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>CTA Button Text</Label>
                  <Input 
                    value={content.heroCtaText} 
                    onChange={(e) => setContent({ ...content, heroCtaText: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>CTA Button Link</Label>
                  <Input 
                    value={content.heroCtaLink} 
                    onChange={(e) => setContent({ ...content, heroCtaLink: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sections">
          <div className="space-y-6">
            <Card className="border-slate-100 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="w-5 h-5 text-purple-600" />
                  Featured Services Section
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium">Show Featured Services</p>
                    <p className="text-sm text-slate-500">Display popular services grid</p>
                  </div>
                  <Switch 
                    checked={content.showFeaturedSection} 
                    onCheckedChange={(v) => setContent({ ...content, showFeaturedSection: v })} 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Section Title</Label>
                  <Input 
                    value={content.featuredSectionTitle} 
                    onChange={(e) => setContent({ ...content, featuredSectionTitle: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-100 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-amber-600" />
                  Testimonials Section
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium">Show Testimonials</p>
                    <p className="text-sm text-slate-500">Display customer reviews</p>
                  </div>
                  <Switch 
                    checked={content.showTestimonials} 
                    onCheckedChange={(v) => setContent({ ...content, showTestimonials: v })} 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Section Title</Label>
                  <Input 
                    value={content.testimonialSectionTitle} 
                    onChange={(e) => setContent({ ...content, testimonialSectionTitle: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-100 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-emerald-600" />
                  Call-to-Action Section
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium">Show CTA Section</p>
                    <p className="text-sm text-slate-500">Display app download section</p>
                  </div>
                  <Switch 
                    checked={content.showCtaSection} 
                    onCheckedChange={(v) => setContent({ ...content, showCtaSection: v })} 
                  />
                </div>
                <div className="space-y-2">
                  <Label>CTA Title</Label>
                  <Input 
                    value={content.ctaSectionTitle} 
                    onChange={(e) => setContent({ ...content, ctaSectionTitle: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>CTA Text</Label>
                  <Textarea 
                    value={content.ctaSectionText} 
                    onChange={(e) => setContent({ ...content, ctaSectionText: e.target.value })}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="footer">
          <Card className="border-slate-100 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="w-5 h-5 text-slate-600" />
                Footer Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>About Text</Label>
                <Textarea 
                  value={content.footerAbout} 
                  onChange={(e) => setContent({ ...content, footerAbout: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Phone className="w-4 h-4" /> Phone
                  </Label>
                  <Input 
                    value={content.footerPhone} 
                    onChange={(e) => setContent({ ...content, footerPhone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Mail className="w-4 h-4" /> Email
                  </Label>
                  <Input 
                    value={content.footerEmail} 
                    onChange={(e) => setContent({ ...content, footerEmail: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Textarea 
                  value={content.footerAddress} 
                  onChange={(e) => setContent({ ...content, footerAddress: e.target.value })}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
