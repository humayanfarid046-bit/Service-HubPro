import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Edit2, Trash2, MoreVertical, Loader2, Upload, X, FolderOpen, Briefcase, IndianRupee, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Service, ServiceCategory } from "@shared/schema";

export default function AdminServices() {
  const [activeTab, setActiveTab] = useState("services");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Category Dialog State
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ServiceCategory | null>(null);
  const [categoryForm, setCategoryForm] = useState({ name: "", icon: "", image: "" });

  // Service Dialog State
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceForm, setServiceForm] = useState({
    name: "",
    description: "",
    category: "",
    subcategory: "",
    basePrice: "",
    discountPrice: "",
    duration: "",
    icon: "",
    image: "",
    isFeatured: false,
  });

  // Queries
  const { data: categories = [], isLoading: loadingCategories } = useQuery<ServiceCategory[]>({
    queryKey: ["/api/categories"],
    queryFn: async () => {
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error("Failed to fetch categories");
      return res.json();
    },
  });

  const { data: services = [], isLoading: loadingServices } = useQuery<Service[]>({
    queryKey: ["/api/services"],
    queryFn: async () => {
      const res = await fetch("/api/services");
      if (!res.ok) throw new Error("Failed to fetch services");
      return res.json();
    },
  });

  // Category Mutations
  const createCategoryMutation = useMutation({
    mutationFn: async (data: typeof categoryForm) => {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, isActive: true }),
      });
      if (!res.ok) throw new Error("Failed to create category");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      setIsCategoryDialogOpen(false);
      setCategoryForm({ name: "", icon: "", image: "" });
      toast({ title: "Success", description: "Category created!" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<ServiceCategory> }) => {
      const res = await fetch(`/api/categories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update category");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      setIsCategoryDialogOpen(false);
      setEditingCategory(null);
      setCategoryForm({ name: "", icon: "", image: "" });
      toast({ title: "Success", description: "Category updated!" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete category");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({ title: "Success", description: "Category deleted!" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  // Service Mutations
  const createServiceMutation = useMutation({
    mutationFn: async (data: typeof serviceForm) => {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          basePrice: data.basePrice,
          discountPrice: data.discountPrice || null,
          isActive: true,
        }),
      });
      if (!res.ok) throw new Error("Failed to create service");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      setIsServiceDialogOpen(false);
      resetServiceForm();
      toast({ title: "Success", description: "Service created!" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const updateServiceMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Service> }) => {
      const res = await fetch(`/api/services/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update service");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      setIsServiceDialogOpen(false);
      setEditingService(null);
      resetServiceForm();
      toast({ title: "Success", description: "Service updated!" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteServiceMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete service");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      toast({ title: "Success", description: "Service deleted!" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const resetServiceForm = () => {
    setServiceForm({
      name: "",
      description: "",
      category: "",
      subcategory: "",
      basePrice: "",
      discountPrice: "",
      duration: "",
      icon: "",
      image: "",
      isFeatured: false,
    });
  };

  const handleEditCategory = (category: ServiceCategory) => {
    setEditingCategory(category);
    setCategoryForm({ name: category.name, icon: category.icon || "", image: category.image || "" });
    setIsCategoryDialogOpen(true);
  };

  const handleEditService = (service: Service) => {
    setEditingService(service);
    setServiceForm({
      name: service.name,
      description: service.description || "",
      category: service.category,
      subcategory: service.subcategory || "",
      basePrice: service.basePrice || "",
      discountPrice: service.discountPrice || "",
      duration: service.duration || "",
      icon: service.icon || "",
      image: service.image || "",
      isFeatured: service.isFeatured || false,
    });
    setIsServiceDialogOpen(true);
  };

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name) {
      toast({ title: "Error", description: "Category name is required", variant: "destructive" });
      return;
    }
    if (editingCategory) {
      updateCategoryMutation.mutate({ id: editingCategory.id, data: categoryForm });
    } else {
      createCategoryMutation.mutate(categoryForm);
    }
  };

  const handleServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceForm.name || !serviceForm.category || !serviceForm.basePrice) {
      toast({ title: "Error", description: "Name, category and price are required", variant: "destructive" });
      return;
    }
    if (editingService) {
      updateServiceMutation.mutate({ id: editingService.id, data: serviceForm as any });
    } else {
      createServiceMutation.mutate(serviceForm);
    }
  };

  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredServices = services.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categoryNames = categories.map(c => c.name);
  const getServiceCountByCategory = (catName: string) => services.filter(s => s.category === catName).length;

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Services Management</h1>
          <p className="text-slate-500 mt-1">Manage categories, services, and pricing.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-white border-slate-100 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Categories</p>
              <p className="text-xl font-bold text-slate-900">{categories.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-100 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Total Services</p>
              <p className="text-xl font-bold text-slate-900">{services.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-100 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 text-amber-600 rounded-xl">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Featured</p>
              <p className="text-xl font-bold text-slate-900">{services.filter(s => s.isFeatured).length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-slate-100 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl">
              <IndianRupee className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Avg. Price</p>
              <p className="text-xl font-bold text-slate-900">
                ₹{services.length > 0 ? Math.round(services.reduce((a, s) => a + parseFloat(s.basePrice || "0"), 0) / services.length) : 0}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-100 shadow-sm">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-0">
            <TabsList>
              <TabsTrigger value="categories" className="gap-2">
                <FolderOpen className="w-4 h-4" /> Categories
              </TabsTrigger>
              <TabsTrigger value="services" className="gap-2">
                <Briefcase className="w-4 h-4" /> Services
              </TabsTrigger>
            </TabsList>
            <div className="flex gap-3">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search..."
                  className="pl-9 bg-slate-50 border-slate-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="input-search"
                />
              </div>
              {activeTab === "categories" ? (
                <Button
                  onClick={() => { setEditingCategory(null); setCategoryForm({ name: "", icon: "", image: "" }); setIsCategoryDialogOpen(true); }}
                  className="bg-primary shadow-lg shadow-primary/25"
                  data-testid="button-add-category"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Category
                </Button>
              ) : (
                <Button
                  onClick={() => { setEditingService(null); resetServiceForm(); setIsServiceDialogOpen(true); }}
                  className="bg-primary shadow-lg shadow-primary/25"
                  data-testid="button-add-service"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Service
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <TabsContent value="categories" className="mt-0">
              {loadingCategories ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : filteredCategories.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  No categories found. Click "Add Category" to create one.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCategories.map((category) => (
                    <Card key={category.id} className="border-slate-100 hover:shadow-md transition-shadow" data-testid={`card-category-${category.id}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-lg font-bold">
                              {category.icon || category.name.charAt(0)}
                            </div>
                            <div>
                              <h3 className="font-semibold text-slate-900">{category.name}</h3>
                              <p className="text-sm text-slate-500">{getServiceCountByCategory(category.name)} services</p>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditCategory(category)}>
                                <Edit2 className="w-4 h-4 mr-2" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => deleteCategoryMutation.mutate(category.id)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <Badge className={cn(
                            category.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                          )}>
                            {category.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="services" className="mt-0">
              {loadingServices ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : filteredServices.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  No services found. Click "Add Service" to create one.
                </div>
              ) : (
                <div className="rounded-xl border border-slate-100 overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium">
                      <tr>
                        <th className="px-6 py-4">Service</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">Price</th>
                        <th className="px-6 py-4">Duration</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredServices.map((service) => (
                        <tr key={service.id} className="hover:bg-slate-50/50 transition-colors" data-testid={`row-service-${service.id}`}>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold overflow-hidden">
                                {service.image ? (
                                  <img src={service.image} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  service.name.charAt(0)
                                )}
                              </div>
                              <div>
                                <p className="font-semibold text-slate-900 flex items-center gap-2">
                                  {service.name}
                                  {service.isFeatured && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
                                </p>
                                <p className="text-xs text-slate-500 truncate max-w-[180px]">{service.description || "No description"}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <Badge variant="secondary" className="bg-slate-100">{service.category}</Badge>
                              {service.subcategory && (
                                <p className="text-xs text-slate-400 mt-1">{service.subcategory}</p>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-semibold text-slate-900">₹{service.basePrice}</p>
                              {service.discountPrice && (
                                <p className="text-xs text-emerald-600">Offer: ₹{service.discountPrice}</p>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-600">
                            {service.duration || "-"}
                          </td>
                          <td className="px-6 py-4">
                            <Badge className={cn(
                              service.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                            )}>
                              {service.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleEditService(service)}>
                                  <Edit2 className="w-4 h-4 mr-2" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => updateServiceMutation.mutate({ id: service.id, data: { isFeatured: !service.isFeatured } })}
                                >
                                  <Star className="w-4 h-4 mr-2" /> {service.isFeatured ? "Unfeature" : "Feature"}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => deleteServiceMutation.mutate(service.id)}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>

      {/* Category Dialog */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
            <DialogDescription>
              {editingCategory ? "Update the category details." : "Create a new service category."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCategorySubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="catName">Category Name *</Label>
              <Input
                id="catName"
                placeholder="e.g., Plumbing"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                data-testid="input-category-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="catIcon">Icon (emoji or text)</Label>
              <Input
                id="catIcon"
                placeholder="e.g., 🔧"
                value={categoryForm.icon}
                onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Image URL (optional)</Label>
              <Input
                placeholder="https://..."
                value={categoryForm.image}
                onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
              />
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}>
                {(createCategoryMutation.isPending || updateCategoryMutation.isPending) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {editingCategory ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Service Dialog */}
      <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
        <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingService ? "Edit Service" : "Add New Service"}</DialogTitle>
            <DialogDescription>
              {editingService ? "Update the service details and pricing." : "Create a new service with pricing."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleServiceSubmit} className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="svcName">Service Name *</Label>
                <Input
                  id="svcName"
                  placeholder="e.g., AC Repair"
                  value={serviceForm.name}
                  onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                  data-testid="input-service-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="svcCategory">Category *</Label>
                <Select value={serviceForm.category} onValueChange={(v) => setServiceForm({ ...serviceForm, category: v })}>
                  <SelectTrigger data-testid="select-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryNames.length > 0 ? (
                      categoryNames.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))
                    ) : (
                      <>
                        <SelectItem value="Plumbing">Plumbing</SelectItem>
                        <SelectItem value="Electrical">Electrical</SelectItem>
                        <SelectItem value="Cleaning">Cleaning</SelectItem>
                        <SelectItem value="AC Repair">AC Repair</SelectItem>
                        <SelectItem value="Painting">Painting</SelectItem>
                        <SelectItem value="Carpentry">Carpentry</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="svcSubcategory">Subcategory</Label>
              <Input
                id="svcSubcategory"
                placeholder="e.g., Split AC, Window AC"
                value={serviceForm.subcategory}
                onChange={(e) => setServiceForm({ ...serviceForm, subcategory: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="basePrice">Base Price (₹) *</Label>
                <Input
                  id="basePrice"
                  type="number"
                  placeholder="499"
                  value={serviceForm.basePrice}
                  onChange={(e) => setServiceForm({ ...serviceForm, basePrice: e.target.value })}
                  data-testid="input-base-price"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discountPrice">Discount Price (₹)</Label>
                <Input
                  id="discountPrice"
                  type="number"
                  placeholder="399"
                  value={serviceForm.discountPrice}
                  onChange={(e) => setServiceForm({ ...serviceForm, discountPrice: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  placeholder="30-45 min"
                  value={serviceForm.duration}
                  onChange={(e) => setServiceForm({ ...serviceForm, duration: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="svcDesc">Description</Label>
              <Textarea
                id="svcDesc"
                placeholder="Service description..."
                value={serviceForm.description}
                onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input
                placeholder="https://..."
                value={serviceForm.image}
                onChange={(e) => setServiceForm({ ...serviceForm, image: e.target.value })}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium text-slate-900">Featured Service</p>
                <p className="text-xs text-slate-500">Show on homepage</p>
              </div>
              <Switch
                checked={serviceForm.isFeatured}
                onCheckedChange={(v) => setServiceForm({ ...serviceForm, isFeatured: v })}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsServiceDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createServiceMutation.isPending || updateServiceMutation.isPending}>
                {(createServiceMutation.isPending || updateServiceMutation.isPending) && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {editingService ? "Update Service" : "Create Service"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
