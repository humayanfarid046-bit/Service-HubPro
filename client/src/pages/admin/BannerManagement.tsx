import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Image, Plus, Loader2, Edit, Trash2, Eye, EyeOff, MoreVertical, ArrowUp, ArrowDown
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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

interface Banner {
  id: number;
  title: string;
  imageUrl: string;
  linkUrl: string;
  position: string;
  priority: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
}

const mockBanners: Banner[] = [
  { id: 1, title: "Summer Sale", imageUrl: "/banner1.jpg", linkUrl: "/offers", position: "home_top", priority: 1, isActive: true, startDate: "2024-01-01", endDate: "2024-12-31" },
  { id: 2, title: "New Services", imageUrl: "/banner2.jpg", linkUrl: "/services", position: "home_middle", priority: 2, isActive: true, startDate: "2024-01-01", endDate: "2024-12-31" },
  { id: 3, title: "Download App", imageUrl: "/banner3.jpg", linkUrl: "/download", position: "home_bottom", priority: 3, isActive: false, startDate: "2024-01-01", endDate: "2024-06-30" },
];

export default function AdminBannerManagement() {
  const { toast } = useToast();
  const [banners, setBanners] = useState<Banner[]>(mockBanners);
  const [showDialog, setShowDialog] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    imageUrl: "",
    linkUrl: "",
    position: "home_top",
    startDate: "",
    endDate: "",
  });

  const handleSave = () => {
    if (editingBanner) {
      setBanners(banners.map(b => b.id === editingBanner.id ? { ...b, ...formData } : b));
      toast({ title: "Success", description: "Banner updated!" });
    } else {
      const newBanner: Banner = {
        id: Date.now(),
        ...formData,
        priority: banners.length + 1,
        isActive: true,
      };
      setBanners([...banners, newBanner]);
      toast({ title: "Success", description: "Banner created!" });
    }
    setShowDialog(false);
    setEditingBanner(null);
    setFormData({ title: "", imageUrl: "", linkUrl: "", position: "home_top", startDate: "", endDate: "" });
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      imageUrl: banner.imageUrl,
      linkUrl: banner.linkUrl,
      position: banner.position,
      startDate: banner.startDate,
      endDate: banner.endDate,
    });
    setShowDialog(true);
  };

  const handleDelete = (id: number) => {
    setBanners(banners.filter(b => b.id !== id));
    toast({ title: "Success", description: "Banner deleted!" });
  };

  const toggleActive = (id: number) => {
    setBanners(banners.map(b => b.id === id ? { ...b, isActive: !b.isActive } : b));
  };

  const moveBanner = (id: number, direction: "up" | "down") => {
    const index = banners.findIndex(b => b.id === id);
    if ((direction === "up" && index === 0) || (direction === "down" && index === banners.length - 1)) return;
    const newBanners = [...banners];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    [newBanners[index], newBanners[swapIndex]] = [newBanners[swapIndex], newBanners[index]];
    setBanners(newBanners.map((b, i) => ({ ...b, priority: i + 1 })));
  };

  const getPositionLabel = (position: string) => {
    switch (position) {
      case "home_top": return "Home Top";
      case "home_middle": return "Home Middle";
      case "home_bottom": return "Home Bottom";
      case "category_page": return "Category Page";
      default: return position;
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Banner Management</h1>
          <p className="text-slate-500 mt-1">Manage promotional banners across the app.</p>
        </div>
        <Button onClick={() => setShowDialog(true)} className="gap-2">
          <Plus className="w-4 h-4" /> Add Banner
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
              <Image className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Total Banners</p>
              <p className="text-xl font-bold text-slate-900">{banners.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50 border-emerald-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Active</p>
              <p className="text-xl font-bold text-slate-900">{banners.filter(b => b.isActive).length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-50 border-slate-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-slate-100 text-slate-600 rounded-xl">
              <EyeOff className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Inactive</p>
              <p className="text-xl font-bold text-slate-900">{banners.filter(b => !b.isActive).length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-100 shadow-sm">
        <CardHeader>
          <CardTitle>All Banners</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {banners.map((banner, index) => (
              <div 
                key={banner.id} 
                className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg border border-slate-100"
                data-testid={`row-banner-${banner.id}`}
              >
                <div className="flex flex-col gap-1">
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveBanner(banner.id, "up")} disabled={index === 0}>
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveBanner(banner.id, "down")} disabled={index === banners.length - 1}>
                    <ArrowDown className="w-4 h-4" />
                  </Button>
                </div>
                <div className="w-24 h-16 bg-slate-200 rounded-lg flex items-center justify-center overflow-hidden">
                  <Image className="w-8 h-8 text-slate-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-semibold text-slate-900">{banner.title}</h4>
                    <Badge className={banner.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}>
                      {banner.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Badge variant="outline">{getPositionLabel(banner.position)}</Badge>
                  </div>
                  <p className="text-sm text-slate-500">
                    {banner.startDate} - {banner.endDate}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch checked={banner.isActive} onCheckedChange={() => toggleActive(banner.id)} />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(banner)}>
                        <Edit className="w-4 h-4 mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(banner.id)}>
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={() => { setShowDialog(false); setEditingBanner(null); }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingBanner ? "Edit Banner" : "Add Banner"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Banner title" />
            </div>
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label>Link URL</Label>
              <Input value={formData.linkUrl} onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })} placeholder="/offers" />
            </div>
            <div className="space-y-2">
              <Label>Position</Label>
              <Select value={formData.position} onValueChange={(v) => setFormData({ ...formData, position: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="home_top">Home Top</SelectItem>
                  <SelectItem value="home_middle">Home Middle</SelectItem>
                  <SelectItem value="home_bottom">Home Bottom</SelectItem>
                  <SelectItem value="category_page">Category Page</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} />
              </div>
            </div>
          </div>
          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={() => { setShowDialog(false); setEditingBanner(null); }}>Cancel</Button>
            <Button onClick={handleSave}>{editingBanner ? "Update" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
