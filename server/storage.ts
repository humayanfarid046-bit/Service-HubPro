import { eq, desc } from "drizzle-orm";
import { db } from "./db";
import {
  users,
  customerDetails,
  workerDetails,
  services,
  serviceCategories,
  bookings,
  notifications,
  platformSettings,
  payments,
  transactions,
  payouts,
  refunds,
  type User,
  type InsertUser,
  type CustomerDetails,
  type InsertCustomerDetails,
  type WorkerDetails,
  type InsertWorkerDetails,
  type Service,
  type InsertService,
  type ServiceCategory,
  type InsertServiceCategory,
  type Booking,
  type InsertBooking,
  type Notification,
  type InsertNotification,
  type PlatformSetting,
  type InsertPlatformSetting,
  type Payment,
  type InsertPayment,
  type Transaction,
  type InsertTransaction,
  type Payout,
  type InsertPayout,
  type Refund,
  type InsertRefund,
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
  
  // Service Categories
  getCategory(id: number): Promise<ServiceCategory | undefined>;
  getAllCategories(): Promise<ServiceCategory[]>;
  createCategory(category: InsertServiceCategory): Promise<ServiceCategory>;
  updateCategory(id: number, updates: Partial<ServiceCategory>): Promise<ServiceCategory | undefined>;
  deleteCategory(id: number): Promise<boolean>;
  
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
  
  // Platform Settings
  getSetting(key: string): Promise<PlatformSetting | undefined>;
  getAllSettings(): Promise<PlatformSetting[]>;
  setSetting(key: string, value: string, description?: string): Promise<PlatformSetting>;
  
  // Payments
  getAllPayments(): Promise<Payment[]>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePayment(id: number, updates: Partial<Payment>): Promise<Payment | undefined>;
  
  // Transactions
  getAllTransactions(): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  
  // Payouts
  getAllPayouts(): Promise<Payout[]>;
  createPayout(payout: InsertPayout): Promise<Payout>;
  updatePayout(id: number, updates: Partial<Payout>): Promise<Payout | undefined>;
  
  // Refunds
  getAllRefunds(): Promise<Refund[]>;
  createRefund(refund: InsertRefund): Promise<Refund>;
  updateRefund(id: number, updates: Partial<Refund>): Promise<Refund | undefined>;
}

export class DatabaseStorage implements IStorage {
  
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByPhone(phone: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.phone, phone));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values({
      ...insertUser,
      email: insertUser.email ?? null,
      profilePhoto: insertUser.profilePhoto ?? null,
      gender: insertUser.gender ?? null,
      dateOfBirth: insertUser.dateOfBirth ?? null,
      isActive: insertUser.isActive ?? true,
    }).returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return db.select().from(users);
  }

  // Customer Details
  async getCustomerDetails(userId: number): Promise<CustomerDetails | undefined> {
    const [details] = await db.select().from(customerDetails).where(eq(customerDetails.userId, userId));
    return details;
  }

  async createCustomerDetails(details: InsertCustomerDetails): Promise<CustomerDetails> {
    const [result] = await db.insert(customerDetails).values({
      ...details,
      house: details.house ?? null,
      street: details.street ?? null,
      city: details.city ?? null,
      pincode: details.pincode ?? null,
    }).returning();
    return result;
  }

  async updateCustomerDetails(userId: number, updates: Partial<CustomerDetails>): Promise<CustomerDetails | undefined> {
    const [result] = await db.update(customerDetails).set(updates).where(eq(customerDetails.userId, userId)).returning();
    return result;
  }

  // Worker Details
  async getWorkerDetails(userId: number): Promise<WorkerDetails | undefined> {
    const [details] = await db.select().from(workerDetails).where(eq(workerDetails.userId, userId));
    return details;
  }

  async createWorkerDetails(details: InsertWorkerDetails): Promise<WorkerDetails> {
    const [result] = await db.insert(workerDetails).values({
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
    }).returning();
    return result;
  }

  async updateWorkerDetails(userId: number, updates: Partial<WorkerDetails>): Promise<WorkerDetails | undefined> {
    const [result] = await db.update(workerDetails).set(updates).where(eq(workerDetails.userId, userId)).returning();
    return result;
  }

  async getAllWorkers(): Promise<WorkerDetails[]> {
    return db.select().from(workerDetails);
  }

  // Service Categories
  async getCategory(id: number): Promise<ServiceCategory | undefined> {
    const [category] = await db.select().from(serviceCategories).where(eq(serviceCategories.id, id));
    return category;
  }

  async getAllCategories(): Promise<ServiceCategory[]> {
    return db.select().from(serviceCategories);
  }

  async createCategory(category: InsertServiceCategory): Promise<ServiceCategory> {
    const [result] = await db.insert(serviceCategories).values({
      ...category,
      icon: category.icon ?? null,
      image: category.image ?? null,
      isActive: category.isActive ?? true,
    }).returning();
    return result;
  }

  async updateCategory(id: number, updates: Partial<ServiceCategory>): Promise<ServiceCategory | undefined> {
    const [result] = await db.update(serviceCategories).set(updates).where(eq(serviceCategories.id, id)).returning();
    return result;
  }

  async deleteCategory(id: number): Promise<boolean> {
    await db.delete(serviceCategories).where(eq(serviceCategories.id, id));
    return true;
  }

  // Services
  async getService(id: number): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service;
  }

  async getAllServices(): Promise<Service[]> {
    return db.select().from(services).where(eq(services.isActive, true));
  }

  async createService(insertService: InsertService): Promise<Service> {
    const [service] = await db.insert(services).values({
      ...insertService,
      description: insertService.description ?? null,
      icon: insertService.icon ?? null,
      image: insertService.image ?? null,
      isActive: insertService.isActive ?? true,
    }).returning();
    return service;
  }

  async updateService(id: number, updates: Partial<Service>): Promise<Service | undefined> {
    const [service] = await db.update(services).set(updates).where(eq(services.id, id)).returning();
    return service;
  }

  async deleteService(id: number): Promise<boolean> {
    const result = await db.delete(services).where(eq(services.id, id));
    return true;
  }

  // Bookings
  async getBooking(id: number): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking;
  }

  async getBookingsByCustomer(customerId: number): Promise<Booking[]> {
    return db.select().from(bookings).where(eq(bookings.customerId, customerId));
  }

  async getBookingsByWorker(workerId: number): Promise<Booking[]> {
    return db.select().from(bookings).where(eq(bookings.workerId, workerId));
  }

  async getAllBookings(): Promise<Booking[]> {
    return db.select().from(bookings);
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const [booking] = await db.insert(bookings).values({
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
    }).returning();
    return booking;
  }

  async updateBooking(id: number, updates: Partial<Booking>): Promise<Booking | undefined> {
    const [booking] = await db.update(bookings).set({ ...updates, updatedAt: new Date() }).where(eq(bookings.id, id)).returning();
    return booking;
  }

  // Notifications
  async getNotificationsByUser(userId: number): Promise<Notification[]> {
    return db.select().from(notifications).where(eq(notifications.userId, userId));
  }

  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const [notification] = await db.insert(notifications).values({
      ...insertNotification,
      isRead: insertNotification.isRead ?? false,
    }).returning();
    return notification;
  }

  async markNotificationRead(id: number): Promise<boolean> {
    await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id));
    return true;
  }
  
  // Platform Settings
  async getSetting(key: string): Promise<PlatformSetting | undefined> {
    const [setting] = await db.select().from(platformSettings).where(eq(platformSettings.key, key));
    return setting;
  }
  
  async getAllSettings(): Promise<PlatformSetting[]> {
    return db.select().from(platformSettings);
  }
  
  async setSetting(key: string, value: string, description?: string): Promise<PlatformSetting> {
    const existing = await this.getSetting(key);
    if (existing) {
      const [setting] = await db.update(platformSettings)
        .set({ value, description: description ?? existing.description, updatedAt: new Date() })
        .where(eq(platformSettings.key, key))
        .returning();
      return setting;
    }
    const [setting] = await db.insert(platformSettings)
      .values({ key, value, description: description ?? null })
      .returning();
    return setting;
  }
  
  // Payments
  async getAllPayments(): Promise<Payment[]> {
    return db.select().from(payments).orderBy(desc(payments.createdAt));
  }
  
  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const [payment] = await db.insert(payments).values(insertPayment).returning();
    return payment;
  }
  
  async updatePayment(id: number, updates: Partial<Payment>): Promise<Payment | undefined> {
    const [payment] = await db.update(payments).set(updates).where(eq(payments.id, id)).returning();
    return payment;
  }
  
  // Transactions
  async getAllTransactions(): Promise<Transaction[]> {
    return db.select().from(transactions).orderBy(desc(transactions.createdAt));
  }
  
  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const [transaction] = await db.insert(transactions).values(insertTransaction).returning();
    return transaction;
  }
  
  // Payouts
  async getAllPayouts(): Promise<Payout[]> {
    return db.select().from(payouts).orderBy(desc(payouts.requestedAt));
  }
  
  async createPayout(insertPayout: InsertPayout): Promise<Payout> {
    const [payout] = await db.insert(payouts).values(insertPayout).returning();
    return payout;
  }
  
  async updatePayout(id: number, updates: Partial<Payout>): Promise<Payout | undefined> {
    const [payout] = await db.update(payouts).set(updates).where(eq(payouts.id, id)).returning();
    return payout;
  }
  
  // Refunds
  async getAllRefunds(): Promise<Refund[]> {
    return db.select().from(refunds).orderBy(desc(refunds.requestedAt));
  }
  
  async createRefund(insertRefund: InsertRefund): Promise<Refund> {
    const [refund] = await db.insert(refunds).values(insertRefund).returning();
    return refund;
  }
  
  async updateRefund(id: number, updates: Partial<Refund>): Promise<Refund | undefined> {
    const [refund] = await db.update(refunds).set(updates).where(eq(refunds.id, id)).returning();
    return refund;
  }
}

export const storage = new DatabaseStorage();
