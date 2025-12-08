import { LucideIcon, Wrench, Zap, PaintBucket, Truck, Home, User, ShieldCheck } from "lucide-react";

export interface Service {
  id: string;
  title: string;
  icon: LucideIcon;
  color: string;
  description: string;
  price: number;
  rating: number;
  category: string;
  active: boolean;
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
    category: "Appliance",
    active: true,
  },
  {
    id: "cleaning",
    title: "Home Cleaning",
    icon: PaintBucket,
    color: "bg-green-100 text-green-600",
    description: "Deep cleaning for bathrooms, kitchens, and full home.",
    price: 899,
    rating: 4.9,
    category: "Cleaning",
    active: true,
  },
  {
    id: "plumbing",
    title: "Plumbing",
    icon: Wrench,
    color: "bg-orange-100 text-orange-600",
    description: "Leak repairs, pipe fitting, and blockage removal.",
    price: 299,
    rating: 4.7,
    category: "Home Repair",
    active: true,
  },
  {
    id: "moving",
    title: "Packers & Movers",
    icon: Truck,
    color: "bg-purple-100 text-purple-600",
    description: "Hassle-free shifting for your home or office.",
    price: 2499,
    rating: 4.6,
    category: "Shifting",
    active: true,
  },
  {
    id: "painting",
    title: "Painting",
    icon: PaintBucket,
    color: "bg-pink-100 text-pink-600",
    description: "Professional wall painting and waterproofing.",
    price: 5999,
    rating: 4.5,
    category: "Home Decor",
    active: true,
  },
];

export type OrderStatus = "Pending" | "Accepted" | "On the Way" | "Working" | "Completed" | "Cancelled";

export interface Order {
  id: string;
  serviceId: string;
  customerId: string;
  customerName: string;
  workerId?: string;
  workerName?: string;
  status: OrderStatus;
  date: string;
  time: string;
  address: string;
  total: number;
  paymentMethod: "COD" | "Online";
  paymentStatus: "Paid" | "Pending";
}

export const MOCK_ORDERS: Order[] = [
  {
    id: "ORD-1234",
    serviceId: "ac-repair",
    customerId: "cust1",
    customerName: "Alice Smith",
    workerId: "worker1",
    workerName: "John Doe",
    status: "On the Way",
    date: "2024-05-20",
    time: "10:00 AM",
    address: "123 Green Park, NY",
    total: 549,
    paymentMethod: "Online",
    paymentStatus: "Paid",
  },
  {
    id: "ORD-5678",
    serviceId: "cleaning",
    customerId: "cust1",
    customerName: "Alice Smith",
    status: "Pending",
    date: "2024-05-22",
    time: "02:00 PM",
    address: "123 Green Park, NY",
    total: 999,
    paymentMethod: "COD",
    paymentStatus: "Pending",
  },
  {
    id: "ORD-9012",
    serviceId: "plumbing",
    customerId: "cust2",
    customerName: "Bob Jones",
    workerId: "worker2",
    workerName: "Mike Ross",
    status: "Completed",
    date: "2024-05-18",
    time: "11:00 AM",
    address: "456 Main St, NY",
    total: 350,
    paymentMethod: "COD",
    paymentStatus: "Paid",
  },
  {
    id: "ORD-3456",
    serviceId: "painting",
    customerId: "cust3",
    customerName: "Charlie Brown",
    status: "Cancelled",
    date: "2024-05-15",
    time: "09:00 AM",
    address: "789 Broadway, NY",
    total: 6000,
    paymentMethod: "Online",
    paymentStatus: "Pending", // Refund pending maybe?
  },
];

export interface Worker {
  id: string;
  name: string;
  service: string;
  rating: number;
  jobsCompleted: number;
  status: "Active" | "Inactive" | "Blocked";
  kycStatus: "Verified" | "Pending" | "Rejected";
  earnings: number;
  avatar: string;
  joinedDate: string;
}

export const MOCK_WORKERS: Worker[] = [
  {
    id: "worker1",
    name: "John Doe",
    service: "AC Repair",
    rating: 4.8,
    jobsCompleted: 145,
    status: "Active",
    kycStatus: "Verified",
    earnings: 4500,
    avatar: "https://i.pravatar.cc/150?u=worker1",
    joinedDate: "2023-11-12",
  },
  {
    id: "worker2",
    name: "Mike Ross",
    service: "Plumbing",
    rating: 4.5,
    jobsCompleted: 89,
    status: "Active",
    kycStatus: "Verified",
    earnings: 2300,
    avatar: "https://i.pravatar.cc/150?u=worker2",
    joinedDate: "2024-01-15",
  },
  {
    id: "worker3",
    name: "Sarah Lee",
    service: "Cleaning",
    rating: 4.9,
    jobsCompleted: 210,
    status: "Inactive",
    kycStatus: "Pending",
    earnings: 6700,
    avatar: "https://i.pravatar.cc/150?u=worker3",
    joinedDate: "2024-05-01",
  },
];

export const MOCK_REVENUE_DATA = [
  { name: "Mon", revenue: 4000 },
  { name: "Tue", revenue: 3000 },
  { name: "Wed", revenue: 2000 },
  { name: "Thu", revenue: 2780 },
  { name: "Fri", revenue: 1890 },
  { name: "Sat", revenue: 2390 },
  { name: "Sun", revenue: 3490 },
];
