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
  coupons,
  disputes,
  workerDocuments,
  activityLogs,
  loginEvents,
  userSecuritySettings,
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
  type Coupon,
  type InsertCoupon,
  type Dispute,
  type InsertDispute,
  type WorkerDocument,
  type InsertWorkerDocument,
  type ActivityLog,
  type InsertActivityLog,
  type LoginEvent,
  type InsertLoginEvent,
  type UserSecuritySetting,
  type InsertUserSecuritySetting,
  pushNotifications,
  smsLogs,
  emailBroadcasts,
  announcements,
  type PushNotification,
  type InsertPushNotification,
  type SmsLog,
  type InsertSmsLog,
  type EmailBroadcast,
  type InsertEmailBroadcast,
  type Announcement,
  type InsertAnnouncement,
  reviews,
  type Review,
  type InsertReview,
  supportTickets,
  type SupportTicket,
  type InsertSupportTicket,
  userComplaints,
  type UserComplaint,
  type InsertUserComplaint,
  reportedUsers,
  type ReportedUser,
  type InsertReportedUser,
  chatMessages,
  type ChatMessage,
  type InsertChatMessage,
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
  
  // Coupons
  getAllCoupons(): Promise<Coupon[]>;
  getCouponByCode(code: string): Promise<Coupon | undefined>;
  createCoupon(coupon: InsertCoupon): Promise<Coupon>;
  updateCoupon(id: number, updates: Partial<Coupon>): Promise<Coupon | undefined>;
  deleteCoupon(id: number): Promise<boolean>;
  
  // Disputes
  getAllDisputes(): Promise<Dispute[]>;
  createDispute(dispute: InsertDispute): Promise<Dispute>;
  updateDispute(id: number, updates: Partial<Dispute>): Promise<Dispute | undefined>;
  
  // Worker Documents
  getAllWorkerDocuments(): Promise<WorkerDocument[]>;
  getWorkerDocumentsByWorkerId(workerId: number): Promise<WorkerDocument[]>;
  createWorkerDocument(doc: InsertWorkerDocument): Promise<WorkerDocument>;
  updateWorkerDocument(id: number, updates: Partial<WorkerDocument>): Promise<WorkerDocument | undefined>;
  
  // Activity Logs
  getAllActivityLogs(): Promise<ActivityLog[]>;
  createActivityLog(log: InsertActivityLog): Promise<ActivityLog>;
  
  // Login Events
  getAllLoginEvents(): Promise<LoginEvent[]>;
  createLoginEvent(event: InsertLoginEvent): Promise<LoginEvent>;
  
  // User Security Settings
  getUserSecuritySettings(userId: number): Promise<UserSecuritySetting | undefined>;
  upsertUserSecuritySettings(settings: InsertUserSecuritySetting): Promise<UserSecuritySetting>;
  
  // Push Notifications
  getAllPushNotifications(): Promise<PushNotification[]>;
  createPushNotification(notification: InsertPushNotification): Promise<PushNotification>;
  updatePushNotification(id: number, updates: Partial<PushNotification>): Promise<PushNotification | undefined>;
  
  // SMS Logs
  getAllSmsLogs(): Promise<SmsLog[]>;
  createSmsLog(log: InsertSmsLog): Promise<SmsLog>;
  updateSmsLog(id: number, updates: Partial<SmsLog>): Promise<SmsLog | undefined>;
  
  // Email Broadcasts
  getAllEmailBroadcasts(): Promise<EmailBroadcast[]>;
  createEmailBroadcast(broadcast: InsertEmailBroadcast): Promise<EmailBroadcast>;
  updateEmailBroadcast(id: number, updates: Partial<EmailBroadcast>): Promise<EmailBroadcast | undefined>;
  deleteEmailBroadcast(id: number): Promise<boolean>;
  
  // Announcements
  getAllAnnouncements(): Promise<Announcement[]>;
  createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;
  updateAnnouncement(id: number, updates: Partial<Announcement>): Promise<Announcement | undefined>;
  deleteAnnouncement(id: number): Promise<boolean>;
  
  // Reviews
  getAllReviews(): Promise<Review[]>;
  getReviewsByStatus(status: string): Promise<Review[]>;
  getReportedReviews(): Promise<Review[]>;
  getReviewsByWorker(workerId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  updateReview(id: number, updates: Partial<Review>): Promise<Review | undefined>;
  deleteReview(id: number): Promise<boolean>;
  
  // Support Tickets
  getAllSupportTickets(): Promise<SupportTicket[]>;
  getSupportTicketsByStatus(status: string): Promise<SupportTicket[]>;
  createSupportTicket(ticket: InsertSupportTicket): Promise<SupportTicket>;
  updateSupportTicket(id: number, updates: Partial<SupportTicket>): Promise<SupportTicket | undefined>;
  deleteSupportTicket(id: number): Promise<boolean>;
  
  // User Complaints
  getAllUserComplaints(): Promise<UserComplaint[]>;
  getUserComplaintsByStatus(status: string): Promise<UserComplaint[]>;
  createUserComplaint(complaint: InsertUserComplaint): Promise<UserComplaint>;
  updateUserComplaint(id: number, updates: Partial<UserComplaint>): Promise<UserComplaint | undefined>;
  deleteUserComplaint(id: number): Promise<boolean>;
  
  // Reported Users
  getAllReportedUsers(): Promise<ReportedUser[]>;
  getReportedUsersByStatus(status: string): Promise<ReportedUser[]>;
  createReportedUser(report: InsertReportedUser): Promise<ReportedUser>;
  updateReportedUser(id: number, updates: Partial<ReportedUser>): Promise<ReportedUser | undefined>;
  deleteReportedUser(id: number): Promise<boolean>;
  
  // Chat Messages
  getAllChatMessages(): Promise<ChatMessage[]>;
  getFlaggedChatMessages(): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  updateChatMessage(id: number, updates: Partial<ChatMessage>): Promise<ChatMessage | undefined>;
  deleteChatMessage(id: number): Promise<boolean>;
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
  
  // Coupons
  async getAllCoupons(): Promise<Coupon[]> {
    return db.select().from(coupons).orderBy(desc(coupons.createdAt));
  }
  
  async getCouponByCode(code: string): Promise<Coupon | undefined> {
    const [coupon] = await db.select().from(coupons).where(eq(coupons.code, code));
    return coupon;
  }
  
  async createCoupon(insertCoupon: InsertCoupon): Promise<Coupon> {
    const [coupon] = await db.insert(coupons).values(insertCoupon).returning();
    return coupon;
  }
  
  async updateCoupon(id: number, updates: Partial<Coupon>): Promise<Coupon | undefined> {
    const [coupon] = await db.update(coupons).set(updates).where(eq(coupons.id, id)).returning();
    return coupon;
  }
  
  async deleteCoupon(id: number): Promise<boolean> {
    await db.delete(coupons).where(eq(coupons.id, id));
    return true;
  }
  
  // Disputes
  async getAllDisputes(): Promise<Dispute[]> {
    return db.select().from(disputes).orderBy(desc(disputes.createdAt));
  }
  
  async createDispute(insertDispute: InsertDispute): Promise<Dispute> {
    const [dispute] = await db.insert(disputes).values(insertDispute).returning();
    return dispute;
  }
  
  async updateDispute(id: number, updates: Partial<Dispute>): Promise<Dispute | undefined> {
    const [dispute] = await db.update(disputes).set(updates).where(eq(disputes.id, id)).returning();
    return dispute;
  }
  
  // Worker Documents
  async getAllWorkerDocuments(): Promise<WorkerDocument[]> {
    return db.select().from(workerDocuments).orderBy(desc(workerDocuments.submittedAt));
  }
  
  async getWorkerDocumentsByWorkerId(workerId: number): Promise<WorkerDocument[]> {
    return db.select().from(workerDocuments).where(eq(workerDocuments.workerId, workerId));
  }
  
  async createWorkerDocument(doc: InsertWorkerDocument): Promise<WorkerDocument> {
    const [document] = await db.insert(workerDocuments).values(doc).returning();
    return document;
  }
  
  async updateWorkerDocument(id: number, updates: Partial<WorkerDocument>): Promise<WorkerDocument | undefined> {
    const [document] = await db.update(workerDocuments).set(updates).where(eq(workerDocuments.id, id)).returning();
    return document;
  }
  
  // Activity Logs
  async getAllActivityLogs(): Promise<ActivityLog[]> {
    return db.select().from(activityLogs).orderBy(desc(activityLogs.createdAt));
  }
  
  async createActivityLog(log: InsertActivityLog): Promise<ActivityLog> {
    const [activityLog] = await db.insert(activityLogs).values(log).returning();
    return activityLog;
  }
  
  // Login Events
  async getAllLoginEvents(): Promise<LoginEvent[]> {
    return db.select().from(loginEvents).orderBy(desc(loginEvents.createdAt));
  }
  
  async createLoginEvent(event: InsertLoginEvent): Promise<LoginEvent> {
    const [loginEvent] = await db.insert(loginEvents).values(event).returning();
    return loginEvent;
  }
  
  // User Security Settings
  async getUserSecuritySettings(userId: number): Promise<UserSecuritySetting | undefined> {
    const [settings] = await db.select().from(userSecuritySettings).where(eq(userSecuritySettings.userId, userId));
    return settings;
  }
  
  async upsertUserSecuritySettings(settings: InsertUserSecuritySetting): Promise<UserSecuritySetting> {
    const existing = await this.getUserSecuritySettings(settings.userId);
    if (existing) {
      const [updated] = await db.update(userSecuritySettings)
        .set({ ...settings, updatedAt: new Date() })
        .where(eq(userSecuritySettings.userId, settings.userId))
        .returning();
      return updated;
    }
    const [created] = await db.insert(userSecuritySettings).values(settings).returning();
    return created;
  }
  
  // Push Notifications
  async getAllPushNotifications(): Promise<PushNotification[]> {
    return db.select().from(pushNotifications).orderBy(desc(pushNotifications.createdAt));
  }
  
  async createPushNotification(notification: InsertPushNotification): Promise<PushNotification> {
    const [created] = await db.insert(pushNotifications).values(notification).returning();
    return created;
  }
  
  async updatePushNotification(id: number, updates: Partial<PushNotification>): Promise<PushNotification | undefined> {
    const [updated] = await db.update(pushNotifications).set(updates).where(eq(pushNotifications.id, id)).returning();
    return updated;
  }
  
  // SMS Logs
  async getAllSmsLogs(): Promise<SmsLog[]> {
    return db.select().from(smsLogs).orderBy(desc(smsLogs.createdAt));
  }
  
  async createSmsLog(log: InsertSmsLog): Promise<SmsLog> {
    const [created] = await db.insert(smsLogs).values(log).returning();
    return created;
  }
  
  async updateSmsLog(id: number, updates: Partial<SmsLog>): Promise<SmsLog | undefined> {
    const [updated] = await db.update(smsLogs).set(updates).where(eq(smsLogs.id, id)).returning();
    return updated;
  }
  
  // Email Broadcasts
  async getAllEmailBroadcasts(): Promise<EmailBroadcast[]> {
    return db.select().from(emailBroadcasts).orderBy(desc(emailBroadcasts.createdAt));
  }
  
  async createEmailBroadcast(broadcast: InsertEmailBroadcast): Promise<EmailBroadcast> {
    const [created] = await db.insert(emailBroadcasts).values(broadcast).returning();
    return created;
  }
  
  async updateEmailBroadcast(id: number, updates: Partial<EmailBroadcast>): Promise<EmailBroadcast | undefined> {
    const [updated] = await db.update(emailBroadcasts).set(updates).where(eq(emailBroadcasts.id, id)).returning();
    return updated;
  }
  
  async deleteEmailBroadcast(id: number): Promise<boolean> {
    await db.delete(emailBroadcasts).where(eq(emailBroadcasts.id, id));
    return true;
  }
  
  // Announcements
  async getAllAnnouncements(): Promise<Announcement[]> {
    return db.select().from(announcements).orderBy(desc(announcements.createdAt));
  }
  
  async createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement> {
    const [created] = await db.insert(announcements).values(announcement).returning();
    return created;
  }
  
  async updateAnnouncement(id: number, updates: Partial<Announcement>): Promise<Announcement | undefined> {
    const [updated] = await db.update(announcements).set(updates).where(eq(announcements.id, id)).returning();
    return updated;
  }
  
  async deleteAnnouncement(id: number): Promise<boolean> {
    await db.delete(announcements).where(eq(announcements.id, id));
    return true;
  }
  
  // Reviews
  async getAllReviews(): Promise<Review[]> {
    return db.select().from(reviews).orderBy(desc(reviews.createdAt));
  }
  
  async getReviewsByStatus(status: string): Promise<Review[]> {
    return db.select().from(reviews).where(eq(reviews.status, status)).orderBy(desc(reviews.createdAt));
  }
  
  async getReportedReviews(): Promise<Review[]> {
    return db.select().from(reviews).where(eq(reviews.isReported, true)).orderBy(desc(reviews.reportedAt));
  }
  
  async getReviewsByWorker(workerId: number): Promise<Review[]> {
    return db.select().from(reviews).where(eq(reviews.workerId, workerId)).orderBy(desc(reviews.createdAt));
  }
  
  async createReview(review: InsertReview): Promise<Review> {
    const [created] = await db.insert(reviews).values(review).returning();
    return created;
  }
  
  async updateReview(id: number, updates: Partial<Review>): Promise<Review | undefined> {
    const [updated] = await db.update(reviews).set(updates).where(eq(reviews.id, id)).returning();
    return updated;
  }
  
  async deleteReview(id: number): Promise<boolean> {
    await db.delete(reviews).where(eq(reviews.id, id));
    return true;
  }
  
  // Support Tickets
  async getAllSupportTickets(): Promise<SupportTicket[]> {
    return db.select().from(supportTickets).orderBy(desc(supportTickets.createdAt));
  }
  
  async getSupportTicketsByStatus(status: string): Promise<SupportTicket[]> {
    return db.select().from(supportTickets).where(eq(supportTickets.status, status)).orderBy(desc(supportTickets.createdAt));
  }
  
  async createSupportTicket(ticket: InsertSupportTicket): Promise<SupportTicket> {
    const [created] = await db.insert(supportTickets).values(ticket).returning();
    return created;
  }
  
  async updateSupportTicket(id: number, updates: Partial<SupportTicket>): Promise<SupportTicket | undefined> {
    const [updated] = await db.update(supportTickets).set({ ...updates, updatedAt: new Date() }).where(eq(supportTickets.id, id)).returning();
    return updated;
  }
  
  async deleteSupportTicket(id: number): Promise<boolean> {
    await db.delete(supportTickets).where(eq(supportTickets.id, id));
    return true;
  }
  
  // User Complaints
  async getAllUserComplaints(): Promise<UserComplaint[]> {
    return db.select().from(userComplaints).orderBy(desc(userComplaints.createdAt));
  }
  
  async getUserComplaintsByStatus(status: string): Promise<UserComplaint[]> {
    return db.select().from(userComplaints).where(eq(userComplaints.status, status)).orderBy(desc(userComplaints.createdAt));
  }
  
  async createUserComplaint(complaint: InsertUserComplaint): Promise<UserComplaint> {
    const [created] = await db.insert(userComplaints).values(complaint).returning();
    return created;
  }
  
  async updateUserComplaint(id: number, updates: Partial<UserComplaint>): Promise<UserComplaint | undefined> {
    const [updated] = await db.update(userComplaints).set(updates).where(eq(userComplaints.id, id)).returning();
    return updated;
  }
  
  async deleteUserComplaint(id: number): Promise<boolean> {
    await db.delete(userComplaints).where(eq(userComplaints.id, id));
    return true;
  }
  
  // Reported Users
  async getAllReportedUsers(): Promise<ReportedUser[]> {
    return db.select().from(reportedUsers).orderBy(desc(reportedUsers.createdAt));
  }
  
  async getReportedUsersByStatus(status: string): Promise<ReportedUser[]> {
    return db.select().from(reportedUsers).where(eq(reportedUsers.status, status)).orderBy(desc(reportedUsers.createdAt));
  }
  
  async createReportedUser(report: InsertReportedUser): Promise<ReportedUser> {
    const [created] = await db.insert(reportedUsers).values(report).returning();
    return created;
  }
  
  async updateReportedUser(id: number, updates: Partial<ReportedUser>): Promise<ReportedUser | undefined> {
    const [updated] = await db.update(reportedUsers).set(updates).where(eq(reportedUsers.id, id)).returning();
    return updated;
  }
  
  async deleteReportedUser(id: number): Promise<boolean> {
    await db.delete(reportedUsers).where(eq(reportedUsers.id, id));
    return true;
  }
  
  // Chat Messages
  async getAllChatMessages(): Promise<ChatMessage[]> {
    return db.select().from(chatMessages).orderBy(desc(chatMessages.createdAt));
  }
  
  async getFlaggedChatMessages(): Promise<ChatMessage[]> {
    return db.select().from(chatMessages).where(eq(chatMessages.isFlagged, true)).orderBy(desc(chatMessages.flaggedAt));
  }
  
  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const [created] = await db.insert(chatMessages).values(message).returning();
    return created;
  }
  
  async updateChatMessage(id: number, updates: Partial<ChatMessage>): Promise<ChatMessage | undefined> {
    const [updated] = await db.update(chatMessages).set(updates).where(eq(chatMessages.id, id)).returning();
    return updated;
  }
  
  async deleteChatMessage(id: number): Promise<boolean> {
    await db.delete(chatMessages).where(eq(chatMessages.id, id));
    return true;
  }
}

export const storage = new DatabaseStorage();
