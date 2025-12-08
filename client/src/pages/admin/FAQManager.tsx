import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  HelpCircle, Plus, Loader2, Edit, Trash2, MoreVertical, 
  ChevronDown, ChevronUp, Search
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  priority: number;
  isActive: boolean;
}

const mockFAQs: FAQ[] = [
  { id: 1, question: "How do I book a service?", answer: "You can book a service by browsing our categories, selecting a service, choosing a time slot, and completing the payment.", category: "booking", priority: 1, isActive: true },
  { id: 2, question: "What payment methods do you accept?", answer: "We accept all major credit/debit cards, UPI, net banking, and cash on delivery.", category: "payment", priority: 2, isActive: true },
  { id: 3, question: "How can I cancel my booking?", answer: "You can cancel your booking from the 'My Bookings' section. Cancellation charges may apply based on timing.", category: "booking", priority: 3, isActive: true },
  { id: 4, question: "Are your workers verified?", answer: "Yes, all our workers undergo thorough background checks and skill verification before joining our platform.", category: "workers", priority: 4, isActive: true },
  { id: 5, question: "What if I'm not satisfied with the service?", answer: "We offer a satisfaction guarantee. Contact our support within 24 hours for a resolution or refund.", category: "support", priority: 5, isActive: true },
];

export default function AdminFAQManager() {
  const { toast } = useToast();
  const [faqs, setFaqs] = useState<FAQ[]>(mockFAQs);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showDialog, setShowDialog] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "general",
  });

  const handleSave = () => {
    if (editingFAQ) {
      setFaqs(faqs.map(f => f.id === editingFAQ.id ? { ...f, ...formData } : f));
      toast({ title: "Success", description: "FAQ updated!" });
    } else {
      const newFAQ: FAQ = {
        id: Date.now(),
        ...formData,
        priority: faqs.length + 1,
        isActive: true,
      };
      setFaqs([...faqs, newFAQ]);
      toast({ title: "Success", description: "FAQ created!" });
    }
    setShowDialog(false);
    setEditingFAQ(null);
    setFormData({ question: "", answer: "", category: "general" });
  };

  const handleEdit = (faq: FAQ) => {
    setEditingFAQ(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
    });
    setShowDialog(true);
  };

  const handleDelete = (id: number) => {
    setFaqs(faqs.filter(f => f.id !== id));
    toast({ title: "Success", description: "FAQ deleted!" });
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "booking": return "bg-blue-100 text-blue-700";
      case "payment": return "bg-emerald-100 text-emerald-700";
      case "workers": return "bg-purple-100 text-purple-700";
      case "support": return "bg-amber-100 text-amber-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || faq.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ["booking", "payment", "workers", "support", "general"];

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">FAQ Manager</h1>
          <p className="text-slate-500 mt-1">Manage frequently asked questions.</p>
        </div>
        <Button onClick={() => setShowDialog(true)} className="gap-2">
          <Plus className="w-4 h-4" /> Add FAQ
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Total FAQs</p>
              <p className="text-xl font-bold text-slate-900">{faqs.length}</p>
            </div>
          </CardContent>
        </Card>
        {categories.slice(0, 3).map((cat) => (
          <Card key={cat} className="bg-slate-50 border-slate-100">
            <CardContent className="p-4">
              <p className="text-xs text-slate-500 capitalize">{cat}</p>
              <p className="text-xl font-bold text-slate-900">{faqs.filter(f => f.category === cat).length}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-slate-100 shadow-sm">
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle>All FAQs</CardTitle>
          <div className="flex items-center gap-3">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search FAQs..."
                className="pl-9 bg-slate-50 border-slate-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search-faq"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat} className="capitalize">{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="space-y-2">
            {filteredFAQs.map((faq) => (
              <AccordionItem key={faq.id} value={`faq-${faq.id}`} className="border border-slate-100 rounded-lg px-4">
                <div className="flex items-center justify-between">
                  <AccordionTrigger className="flex-1 text-left hover:no-underline">
                    <div className="flex items-center gap-3">
                      <Badge className={getCategoryBadge(faq.category)} variant="secondary">
                        {faq.category}
                      </Badge>
                      <span className="font-medium text-slate-900">{faq.question}</span>
                    </div>
                  </AccordionTrigger>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 ml-2">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(faq)}>
                        <Edit className="w-4 h-4 mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(faq.id)}>
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <AccordionContent className="text-slate-600 pt-2 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={() => { setShowDialog(false); setEditingFAQ(null); }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingFAQ ? "Edit FAQ" : "Add FAQ"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat} className="capitalize">{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Question</Label>
              <Input 
                value={formData.question} 
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                placeholder="Enter the question"
              />
            </div>
            <div className="space-y-2">
              <Label>Answer</Label>
              <Textarea 
                value={formData.answer} 
                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                placeholder="Enter the answer"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={() => { setShowDialog(false); setEditingFAQ(null); }}>Cancel</Button>
            <Button onClick={handleSave}>{editingFAQ ? "Update" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
