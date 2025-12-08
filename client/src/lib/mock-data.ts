import { LucideIcon, Wrench, Zap, PaintBucket, Truck, Home, User, ShieldCheck } from "lucide-react";

export interface Service {
  id: string;
  title: string;
  icon: LucideIcon;
  color: string;
  description: string;
  price: number;
  rating: number;
}

export const SERVICES: Service[] = [
  {
    id: "ac-repair",
    title: "AC Repair",
    icon: Zap,
    color: "bg-blue-100 text-blue-600",
    description: "Expert AC servicing, repair, and installation.",
    price: 499,
    rating: 4.8,
  },
  {
    id: "cleaning",
    title: "Home Cleaning",
    icon: PaintBucket,
    color: "bg-green-100 text-green-600",
    description: "Deep cleaning for bathrooms, kitchens, and full home.",
    price: 899,
    rating: 4.9,
  },
  {
    id: "plumbing",
    title: "Plumbing",
    icon: Wrench,
    color: "bg-orange-100 text-orange-600",
    description: "Leak repairs, pipe fitting, and blockage removal.",
    price: 299,
    rating: 4.7,
  },
  {
    id: "moving",
    title: "Packers & Movers",
    icon: Truck,
    color: "bg-purple-100 text-purple-600",
    description: "Hassle-free shifting for your home or office.",
    price: 2499,
    rating: 4.6,
  },
  {
    id: "painting",
    title: "Painting",
    icon: PaintBucket,
    color: "bg-pink-100 text-pink-600",
    description: "Professional wall painting and waterproofing.",
    price: 5999,
    rating: 4.5,
  },
];

export type OrderStatus = "Pending" | "Accepted" | "On the Way" | "Working" | "Completed";

export interface Order {
  id: string;
  serviceId: string;
  customerId: string;
  workerId?: string;
  status: OrderStatus;
  date: string;
  time: string;
  address: string;
  total: number;
}

// Initial mock orders
export const MOCK_ORDERS: Order[] = [
  {
    id: "ORD-1234",
    serviceId: "ac-repair",
    customerId: "cust1",
    workerId: "worker1",
    status: "On the Way",
    date: "2024-05-20",
    time: "10:00 AM",
    address: "123 Green Park, NY",
    total: 549,
  },
  {
    id: "ORD-5678",
    serviceId: "cleaning",
    customerId: "cust1",
    status: "Pending",
    date: "2024-05-22",
    time: "02:00 PM",
    address: "123 Green Park, NY",
    total: 999,
  },
];
