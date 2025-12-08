import {
  type User,
  type InsertUser,
  type CustomerDetails,
  type InsertCustomerDetails,
  type WorkerDetails,
  type InsertWorkerDetails,
  type Service,
  type InsertService,
  type Booking,
  type InsertBooking,
  type Notification,
  type InsertNotification,
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByPhone(phone: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  
  // Customer Details
  getCustomerDetails(userId: number): Promise<CustomerDetails | undefined>;
  createCustomerDetails(details: InsertCustomerDetails): Promise<CustomerDetails>;
  updateCustomerDetails(userId: number, updates: Partial<CustomerDetails>): Promise<CustomerDetails | undefined>;
  
  // Worker Details
  getWorkerDetails(userId: number): Promise<WorkerDetails | undefined>;
  createWorkerDetails(details: InsertWorkerDetails): Promise<WorkerDetails>;
  updateWorkerDetails(userId: number, updates: Partial<WorkerDetails>): Promise<WorkerDetails | undefined>;
  getAllWorkers(): Promise<WorkerDetails[]>;
  
  // Services
  getService(id: number): Promise<Service | undefined>;
  getAllServices(): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, updates: Partial<Service>): Promise<Service | undefined>;
  deleteService(id: number): Promise<boolean>;
  
  // Bookings
  getBooking(id: number): Promise<Booking | undefined>;
  getBookingsByCustomer(customerId: number): Promise<Booking[]>;
  getBookingsByWorker(workerId: number): Promise<Booking[]>;
  getAllBookings(): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBooking(id: number, updates: Partial<Booking>): Promise<Booking | undefined>;
  
  // Notifications
  getNotificationsByUser(userId: number): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationRead(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private customerDetails: Map<number, CustomerDetails> = new Map();
  private workerDetails: Map<number, WorkerDetails> = new Map();
  private services: Map<number, Service> = new Map();
  private bookings: Map<number, Booking> = new Map();
  private notifications: Map<number, Notification> = new Map();
  
  private userIdCounter = 1;
  private customerIdCounter = 1;
  private workerIdCounter = 1;
  private serviceIdCounter = 1;
  private bookingIdCounter = 1;
  private notificationIdCounter = 1;

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Create Admin User
    const admin: User = {
      id: this.userIdCounter++,
      phone: "99999",
      email: "admin@servicehub.com",
      fullName: "Admin User",
      role: "ADMIN",
      profilePhoto: null,
      gender: null,
      dateOfBirth: null,
      isActive: true,
      createdAt: new Date(),
    };
    this.users.set(admin.id, admin);

    // Create Sample Services
    const sampleServices: InsertService[] = [
      { name: "Plumbing", description: "Expert plumbing services", category: "Home Repair", basePrice: "500", icon: "🔧", image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39", isActive: true },
      { name: "Electrician", description: "Electrical installation & repair", category: "Home Repair", basePrice: "600", icon: "⚡", image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4", isActive: true },
      { name: "House Cleaning", description: "Deep cleaning services", category: "Cleaning", basePrice: "800", icon: "🧹", image: "https://images.unsplash.com/photo-1581578731117-10d52143b0d8", isActive: true },
      { name: "AC Repair", description: "AC installation and servicing", category: "Appliance", basePrice: "700", icon: "❄️", image: "https://images.unsplash.com/photo-1631545804039-46c04932525a", isActive: true },
    ];

    sampleServices.forEach(service => {
      const newService: Service = { 
        ...service, 
        id: this.serviceIdCounter++, 
        createdAt: new Date(),
        description: service.description ?? null,
        icon: service.icon ?? null,
        image: service.image ?? null,
        isActive: service.isActive ?? true
      };
      this.services.set(newService.id, newService);
    });
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByPhone(phone: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.phone === phone);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      ...insertUser,
      email: insertUser.email ?? null,
      profilePhoto: insertUser.profilePhoto ?? null,
      gender: insertUser.gender ?? null,
      dateOfBirth: insertUser.dateOfBirth ?? null,
      isActive: insertUser.isActive ?? true,
      id: this.userIdCounter++,
      createdAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updated = { ...user, ...updates };
    this.users.set(id, updated);
    return updated;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Customer Details
  async getCustomerDetails(userId: number): Promise<CustomerDetails | undefined> {
    return Array.from(this.customerDetails.values()).find(d => d.userId === userId);
  }

  async createCustomerDetails(details: InsertCustomerDetails): Promise<CustomerDetails> {
    const customerDetail: CustomerDetails = {
      ...details,
      house: details.house ?? null,
      street: details.street ?? null,
      city: details.city ?? null,
      pincode: details.pincode ?? null,
      id: this.customerIdCounter++,
      createdAt: new Date(),
    };
    this.customerDetails.set(customerDetail.id, customerDetail);
    return customerDetail;
  }

  async updateCustomerDetails(userId: number, updates: Partial<CustomerDetails>): Promise<CustomerDetails | undefined> {
    const existing = await this.getCustomerDetails(userId);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates };
    this.customerDetails.set(existing.id, updated);
    return updated;
  }

  // Worker Details
  async getWorkerDetails(userId: number): Promise<WorkerDetails | undefined> {
    return Array.from(this.workerDetails.values()).find(d => d.userId === userId);
  }

  async createWorkerDetails(details: InsertWorkerDetails): Promise<WorkerDetails> {
    const workerDetail: WorkerDetails = {
      ...details,
      subService: details.subService ?? null,
      experience: details.experience ?? null,
      availability: details.availability ?? null,
      house: details.house ?? null,
      street: details.street ?? null,
      city: details.city ?? null,
      pincode: details.pincode ?? null,
      idProof: details.idProof ?? null,
      policeVerification: details.policeVerification ?? null,
      skillCertificate: details.skillCertificate ?? null,
      bankHolderName: details.bankHolderName ?? null,
      accountNumber: details.accountNumber ?? null,
      ifscCode: details.ifscCode ?? null,
      upiId: details.upiId ?? null,
      isVerified: details.isVerified ?? false,
      rating: details.rating ?? null,
      totalEarnings: details.totalEarnings ?? null,
      id: this.workerIdCounter++,
      createdAt: new Date(),
    };
    this.workerDetails.set(workerDetail.id, workerDetail);
    return workerDetail;
  }

  async updateWorkerDetails(userId: number, updates: Partial<WorkerDetails>): Promise<WorkerDetails | undefined> {
    const existing = await this.getWorkerDetails(userId);
    if (!existing) return undefined;
    const updated = { ...existing, ...updates };
    this.workerDetails.set(existing.id, updated);
    return updated;
  }

  async getAllWorkers(): Promise<WorkerDetails[]> {
    return Array.from(this.workerDetails.values());
  }

  // Services
  async getService(id: number): Promise<Service | undefined> {
    return this.services.get(id);
  }

  async getAllServices(): Promise<Service[]> {
    return Array.from(this.services.values()).filter(s => s.isActive);
  }

  async createService(insertService: InsertService): Promise<Service> {
    const service: Service = {
      ...insertService,
      description: insertService.description ?? null,
      icon: insertService.icon ?? null,
      image: insertService.image ?? null,
      isActive: insertService.isActive ?? true,
      id: this.serviceIdCounter++,
      createdAt: new Date(),
    };
    this.services.set(service.id, service);
    return service;
  }

  async updateService(id: number, updates: Partial<Service>): Promise<Service | undefined> {
    const service = this.services.get(id);
    if (!service) return undefined;
    const updated = { ...service, ...updates };
    this.services.set(id, updated);
    return updated;
  }

  async deleteService(id: number): Promise<boolean> {
    return this.services.delete(id);
  }

  // Bookings
  async getBooking(id: number): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async getBookingsByCustomer(customerId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(b => b.customerId === customerId);
  }

  async getBookingsByWorker(workerId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(b => b.workerId === workerId);
  }

  async getAllBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values());
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const booking: Booking = {
      ...insertBooking,
      workerId: insertBooking.workerId ?? null,
      scheduledTime: insertBooking.scheduledTime ?? null,
      address: insertBooking.address ?? null,
      status: insertBooking.status ?? "pending",
      paymentMethod: insertBooking.paymentMethod ?? null,
      paymentStatus: insertBooking.paymentStatus ?? "pending",
      customerNotes: insertBooking.customerNotes ?? null,
      workerNotes: insertBooking.workerNotes ?? null,
      rating: insertBooking.rating ?? null,
      review: insertBooking.review ?? null,
      id: this.bookingIdCounter++,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.bookings.set(booking.id, booking);
    return booking;
  }

  async updateBooking(id: number, updates: Partial<Booking>): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (!booking) return undefined;
    const updated = { ...booking, ...updates, updatedAt: new Date() };
    this.bookings.set(id, updated);
    return updated;
  }

  // Notifications
  async getNotificationsByUser(userId: number): Promise<Notification[]> {
    return Array.from(this.notifications.values()).filter(n => n.userId === userId);
  }

  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const notification: Notification = {
      ...insertNotification,
      isRead: insertNotification.isRead ?? false,
      id: this.notificationIdCounter++,
      createdAt: new Date(),
    };
    this.notifications.set(notification.id, notification);
    return notification;
  }

  async markNotificationRead(id: number): Promise<boolean> {
    const notification = this.notifications.get(id);
    if (!notification) return false;
    notification.isRead = true;
    this.notifications.set(id, notification);
    return true;
  }
}

export const storage = new MemStorage();
