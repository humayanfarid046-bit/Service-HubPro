import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tag, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const COUPONS = [
  { code: "WELCOME50", discount: "50% OFF", type: "New User", uses: 120, status: "Active" },
  { code: "SUMMER25", discount: "25% OFF", type: "Seasonal", uses: 45, status: "Active" },
  { code: "FIXIT10", discount: "$10 FLAT", type: "Service Specific", uses: 12, status: "Expired" },
];

export default function AdminOffers() {
  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Offers & Coupons</h1>
          <p className="text-slate-500">Manage discounts and promotional campaigns.</p>
        </div>
        <Button className="bg-slate-900"><Plus className="w-4 h-4 mr-2" /> Create Coupon</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {COUPONS.map((coupon) => (
            <Card key={coupon.code} className="border-slate-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3">
                    <Badge variant={coupon.status === "Active" ? "default" : "secondary"}>{coupon.status}</Badge>
                </div>
                <CardContent className="p-6">
                    <div className="w-12 h-12 bg-pink-50 rounded-full flex items-center justify-center text-pink-500 mb-4">
                        <Tag className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">{coupon.code}</h3>
                    <p className="text-pink-600 font-bold text-lg mb-2">{coupon.discount}</p>
                    <div className="flex justify-between text-sm text-slate-500 mt-4 pt-4 border-t border-slate-50">
                        <span>{coupon.type}</span>
                        <span>{coupon.uses} used</span>
                    </div>
                </CardContent>
            </Card>
        ))}
      </div>
    </AdminLayout>
  );
}
