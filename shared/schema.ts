import { pgTable, text, serial, integer, timestamp, jsonb, boolean, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users Table (supports ADMIN, WORKER, CUSTOMER roles)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  phone: text("phone").notNull().unique(),
  email: text("email"),
  password: text("password"),
  fullName: text("full_name").notNull(),
  role: text("role").notNull(), // "ADMIN" | "WORKER" | "CUSTOMER"
  profilePhoto: text("profile_photo"),
  gender: text("gender"),
  dateOfBirth: text("date_of_birth"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Customer Details
export const customerDetails = pgTable("customer_details", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  house: text("house"),
  street: text("street"),
  city: text("city"),
  pincode: text("pincode"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCustomerDetailsSchema = createInsertSchema(customerDetails).omit({ id: true, createdAt: true });
export type InsertCustomerDetails = z.infer<typeof insertCustomerDetailsSchema>;
export type CustomerDetails = typeof customerDetails.$inferSelect;

// Customer Addresses Table (multiple addresses per customer)
export const customerAddresses = pgTable("customer_addresses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  label: text("label").notNull(), // Home, Office, etc.
  house: text("house"),
  street: text("street"),
  city: text("city"),
  pincode: text("pincode"),
  isDefault: boolean("is_default").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCustomerAddressSchema = createInsertSchema(customerAddresses).omit({ id: true, createdAt: true });
export type InsertCustomerAddress = z.infer<typeof insertCustomerAddressSchema>;
export type CustomerAddress = typeof customerAddresses.$inferSelect;

// Worker Details
export const workerDetails = pgTable("worker_details", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  category: text("category").notNull(), // plumber, electrician, etc.
  subService: text("sub_service"),
  experience: integer("experience"), // years
  availability: text("availability"), // Full-Time, Part-Time
  house: text("house"),
  street: text("street"),
  city: text("city"),
  pincode: text("pincode"),
  idProof: text("id_proof"),
  policeVerification: text("police_verification"),
  skillCertificate: text("skill_certificate"),
  bankHolderName: text("bank_holder_name"),
  accountNumber: text("account_number"),
  ifscCode: text("ifsc_code"),
  upiId: text("upi_id"),
  isVerified: boolean("is_verified").default(false).notNull(),
  rating: numeric("rating", { precision: 3, scale: 2 }).default("0"),
  totalEarnings: numeric("total_earnings", { precision: 10, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertWorkerDetailsSchema = createInsertSchema(workerDetails).omit({ id: true, createdAt: true });
export type InsertWorkerDetails = z.infer<typeof insertWorkerDetailsSchema>;
export type WorkerDetails = typeof workerDetails.$inferSelect;

// Service Categories Table
export const serviceCategories = pgTable("service_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  icon: text("icon"),
  image: text("image"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertServiceCategorySchema = createInsertSchema(serviceCategories).omit({ id: true, createdAt: true });
export type InsertServiceCategory = z.infer<typeof insertServiceCategorySchema>;
export type ServiceCategory = typeof serviceCategories.$inferSelect;

// Services Table (Subcategories)
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  subcategory: text("subcategory"),
  basePrice: numeric("base_price", { precision: 10, scale: 2 }).notNull(),
  discountPrice: numeric("discount_price", { precision: 10, scale: 2 }),
  duration: text("duration"),
  icon: text("icon"),
  image: text("image"),
  isActive: boolean("is_active").default(true).notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertServiceSchema = createInsertSchema(services).omit({ id: true, createdAt: true });
export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof services.$inferSelect;

// Bookings/Orders Table
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").notNull().references(() => users.id),
  workerId: integer("worker_id").references(() => users.id),
  serviceId: integer("service_id").notNull().references(() => services.id),
  bookingDate: timestamp("booking_date").notNull(),
  scheduledTime: text("scheduled_time"),
  address: jsonb("address"), // {house, street, city, pincode}
  status: text("status").notNull().default("pending"), // pending, confirmed, in_progress, completed, cancelled
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: text("payment_method"), // COD, Razorpay
  paymentStatus: text("payment_status").default("pending"), // pending, paid
  customerNotes: text("customer_notes"),
  workerNotes: text("worker_notes"),
  rating: integer("rating"), // 1-5
  review: text("review"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertBookingSchema = createInsertSchema(bookings).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;

// Notifications Table
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(), // booking, payment, system
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({ id: true, createdAt: true });
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;

// Platform Settings Table (for commission and other settings)
export const platformSettings = pgTable("platform_settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  description: text("description"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertPlatformSettingSchema = createInsertSchema(platformSettings).omit({ id: true, updatedAt: true });
export type InsertPlatformSetting = z.infer<typeof insertPlatformSettingSchema>;
export type PlatformSetting = typeof platformSettings.$inferSelect;

// Payments Table - All payment records from customers
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").references(() => bookings.id),
  customerId: integer("customer_id").notNull().references(() => users.id),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: text("payment_method").notNull(), // COD, Razorpay, UPI
  paymentStatus: text("payment_status").notNull().default("pending"), // pending, completed, failed
  transactionId: text("transaction_id"),
  razorpayPaymentId: text("razorpay_payment_id"),
  razorpayOrderId: text("razorpay_order_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPaymentSchema = createInsertSchema(payments).omit({ id: true, createdAt: true });
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof payments.$inferSelect;

// Transactions Table - All financial transactions log
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // payment, payout, refund, commission
  referenceId: integer("reference_id"), // booking/payment/payout id
  referenceType: text("reference_type"), // booking, payment, payout
  userId: integer("user_id").references(() => users.id),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  description: text("description"),
  status: text("status").notNull().default("completed"), // pending, completed, failed
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({ id: true, createdAt: true });
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;

// Payouts Table - Worker payouts
export const payouts = pgTable("payouts", {
  id: serial("id").primaryKey(),
  workerId: integer("worker_id").notNull().references(() => users.id),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"), // pending, approved, processing, completed, rejected
  paymentMethod: text("payment_method"), // bank_transfer, upi
  bankDetails: jsonb("bank_details"), // {accountNumber, ifsc, holderName}
  upiId: text("upi_id"),
  transactionId: text("transaction_id"),
  requestedAt: timestamp("requested_at").defaultNow().notNull(),
  processedAt: timestamp("processed_at"),
  adminNotes: text("admin_notes"),
});

export const insertPayoutSchema = createInsertSchema(payouts).omit({ id: true, requestedAt: true });
export type InsertPayout = z.infer<typeof insertPayoutSchema>;
export type Payout = typeof payouts.$inferSelect;

// Refunds Table
export const refunds = pgTable("refunds", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").references(() => bookings.id),
  paymentId: integer("payment_id").references(() => payments.id),
  customerId: integer("customer_id").notNull().references(() => users.id),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  reason: text("reason"),
  status: text("status").notNull().default("pending"), // pending, approved, processing, completed, rejected
  refundMethod: text("refund_method"), // original_payment, bank_transfer
  transactionId: text("transaction_id"),
  requestedAt: timestamp("requested_at").defaultNow().notNull(),
  processedAt: timestamp("processed_at"),
  adminNotes: text("admin_notes"),
});

export const insertRefundSchema = createInsertSchema(refunds).omit({ id: true, requestedAt: true });
export type InsertRefund = z.infer<typeof insertRefundSchema>;
export type Refund = typeof refunds.$inferSelect;

// Coupons/Offers Table
export const coupons = pgTable("coupons", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  discountType: text("discount_type").notNull(), // percentage, flat
  discountValue: numeric("discount_value", { precision: 10, scale: 2 }).notNull(),
  minOrderAmount: numeric("min_order_amount", { precision: 10, scale: 2 }),
  maxDiscount: numeric("max_discount", { precision: 10, scale: 2 }),
  description: text("description"),
  validFrom: timestamp("valid_from"),
  validTo: timestamp("valid_to"),
  usageLimit: integer("usage_limit"),
  usedCount: integer("used_count").default(0),
  isActive: boolean("is_active").default(true).notNull(),
  applicableTo: text("applicable_to"), // all, new_users, specific_services
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCouponSchema = createInsertSchema(coupons).omit({ id: true, createdAt: true, usedCount: true });
export type InsertCoupon = z.infer<typeof insertCouponSchema>;
export type Coupon = typeof coupons.$inferSelect;

// Disputes/Support Tickets Table
export const disputes = pgTable("disputes", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").references(() => bookings.id),
  customerId: integer("customer_id").notNull().references(() => users.id),
  workerId: integer("worker_id").references(() => users.id),
  type: text("type").notNull(), // quality, delay, payment, behavior, other
  priority: text("priority").default("medium"), // low, medium, high
  status: text("status").notNull().default("open"), // open, in_progress, resolved, closed
  subject: text("subject").notNull(),
  description: text("description"),
  resolution: text("resolution"),
  resolvedBy: integer("resolved_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  resolvedAt: timestamp("resolved_at"),
});

export const insertDisputeSchema = createInsertSchema(disputes).omit({ id: true, createdAt: true });
export type InsertDispute = z.infer<typeof insertDisputeSchema>;
export type Dispute = typeof disputes.$inferSelect;

// Worker Documents Table (for KYC/verification)
export const workerDocuments = pgTable("worker_documents", {
  id: serial("id").primaryKey(),
  workerId: integer("worker_id").notNull().references(() => users.id),
  documentType: text("document_type").notNull(), // aadhaar, pan, license, certificate, photo
  documentNumber: text("document_number"),
  fileUrl: text("file_url").notNull(),
  fileName: text("file_name"),
  status: text("status").notNull().default("pending"), // pending, approved, rejected
  reviewerId: integer("reviewer_id").references(() => users.id),
  reviewedAt: timestamp("reviewed_at"),
  rejectionReason: text("rejection_reason"),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
});

export const insertWorkerDocumentSchema = createInsertSchema(workerDocuments).omit({ id: true, submittedAt: true });
export type InsertWorkerDocument = z.infer<typeof insertWorkerDocumentSchema>;
export type WorkerDocument = typeof workerDocuments.$inferSelect;

// Activity Logs Table
export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  actorId: integer("actor_id").references(() => users.id),
  actorRole: text("actor_role"), // ADMIN, WORKER, CUSTOMER, SYSTEM
  action: text("action").notNull(), // created, updated, deleted, approved, rejected, login, logout
  entityType: text("entity_type"), // user, booking, service, payment, worker, etc.
  entityId: integer("entity_id"),
  description: text("description"),
  metadata: text("metadata"), // JSON string for additional data
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertActivityLogSchema = createInsertSchema(activityLogs).omit({ id: true, createdAt: true });
export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;
export type ActivityLog = typeof activityLogs.$inferSelect;

// Login Events Table
export const loginEvents = pgTable("login_events", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  phone: text("phone"),
  method: text("method"), // otp, password
  success: boolean("success").notNull(),
  failureReason: text("failure_reason"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  location: text("location"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertLoginEventSchema = createInsertSchema(loginEvents).omit({ id: true, createdAt: true });
export type InsertLoginEvent = z.infer<typeof insertLoginEventSchema>;
export type LoginEvent = typeof loginEvents.$inferSelect;

// User Security Settings Table (2FA)
export const userSecuritySettings = pgTable("user_security_settings", {
  userId: integer("user_id").primaryKey().references(() => users.id),
  is2FAEnabled: boolean("is_2fa_enabled").default(false).notNull(),
  twoFAMethod: text("two_fa_method"), // app, sms
  secret: text("secret"), // encrypted TOTP secret
  backupCodes: text("backup_codes"), // JSON array of backup codes
  lastVerifiedAt: timestamp("last_verified_at"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSecuritySettingSchema = createInsertSchema(userSecuritySettings);
export type InsertUserSecuritySetting = z.infer<typeof insertUserSecuritySettingSchema>;
export type UserSecuritySetting = typeof userSecuritySettings.$inferSelect;

// Push Notifications Table
export const pushNotifications = pgTable("push_notifications", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  targetAudience: text("target_audience").notNull(), // all, customers, workers, specific
  targetUserIds: text("target_user_ids"), // JSON array for specific users
  status: text("status").notNull().default("pending"), // pending, sent, failed
  sentCount: integer("sent_count").default(0),
  scheduledAt: timestamp("scheduled_at"),
  sentAt: timestamp("sent_at"),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPushNotificationSchema = createInsertSchema(pushNotifications).omit({ id: true, createdAt: true });
export type InsertPushNotification = z.infer<typeof insertPushNotificationSchema>;
export type PushNotification = typeof pushNotifications.$inferSelect;

// SMS Logs Table
export const smsLogs = pgTable("sms_logs", {
  id: serial("id").primaryKey(),
  recipientPhone: text("recipient_phone").notNull(),
  recipientName: text("recipient_name"),
  message: text("message").notNull(),
  templateId: text("template_id"),
  status: text("status").notNull().default("pending"), // pending, sent, delivered, failed
  provider: text("provider"), // twilio, 2factor
  providerMessageId: text("provider_message_id"),
  errorMessage: text("error_message"),
  sentAt: timestamp("sent_at"),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSmsLogSchema = createInsertSchema(smsLogs).omit({ id: true, createdAt: true });
export type InsertSmsLog = z.infer<typeof insertSmsLogSchema>;
export type SmsLog = typeof smsLogs.$inferSelect;

// Email Broadcasts Table
export const emailBroadcasts = pgTable("email_broadcasts", {
  id: serial("id").primaryKey(),
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  targetAudience: text("target_audience").notNull(), // all, customers, workers, specific
  targetEmails: text("target_emails"), // JSON array for specific emails
  status: text("status").notNull().default("draft"), // draft, scheduled, sending, sent, failed
  sentCount: integer("sent_count").default(0),
  scheduledAt: timestamp("scheduled_at"),
  sentAt: timestamp("sent_at"),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertEmailBroadcastSchema = createInsertSchema(emailBroadcasts).omit({ id: true, createdAt: true });
export type InsertEmailBroadcast = z.infer<typeof insertEmailBroadcastSchema>;
export type EmailBroadcast = typeof emailBroadcasts.$inferSelect;

// In-App Announcements Table
export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull().default("info"), // info, warning, promo, update
  targetAudience: text("target_audience").notNull(), // all, customers, workers
  imageUrl: text("image_url"),
  actionUrl: text("action_url"),
  actionLabel: text("action_label"),
  priority: integer("priority").default(0),
  isActive: boolean("is_active").default(true).notNull(),
  startsAt: timestamp("starts_at"),
  expiresAt: timestamp("expires_at"),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAnnouncementSchema = createInsertSchema(announcements).omit({ id: true, createdAt: true });
export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;
export type Announcement = typeof announcements.$inferSelect;

// Jobs Table (Customer job postings for bidding)
export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  referenceNumber: text("reference_number").notNull().unique(),
  customerId: integer("customer_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // HOME_VISIT, REMOTE
  serviceType: text("service_type"), // plumbing, electrical, cleaning, etc.
  budget: numeric("budget", { precision: 10, scale: 2 }),
  budgetType: text("budget_type").default("fixed"), // fixed, hourly, negotiable
  address: jsonb("address"), // for HOME_VISIT jobs
  preferredDate: text("preferred_date"),
  preferredTime: text("preferred_time"),
  urgency: text("urgency").default("normal"), // urgent, normal, flexible
  attachments: text("attachments"), // JSON array of image URLs
  status: text("status").notNull().default("open"), // open, in_progress, assigned, completed, cancelled
  selectedBidId: integer("selected_bid_id"),
  selectedWorkerId: integer("selected_worker_id").references(() => users.id),
  totalBids: integer("total_bids").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertJobSchema = createInsertSchema(jobs).omit({ id: true, referenceNumber: true, createdAt: true, updatedAt: true, totalBids: true });
export type InsertJob = z.infer<typeof insertJobSchema>;
export type Job = typeof jobs.$inferSelect;

// Bids Table (Worker bids on jobs)
export const bids = pgTable("bids", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").notNull().references(() => jobs.id),
  workerId: integer("worker_id").notNull().references(() => users.id),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  proposedDate: text("proposed_date"),
  proposedTime: text("proposed_time"),
  estimatedDuration: text("estimated_duration"),
  coverLetter: text("cover_letter"),
  status: text("status").notNull().default("pending"), // pending, accepted, rejected, withdrawn
  isSelected: boolean("is_selected").default(false).notNull(),
  workerName: text("worker_name"),
  workerRating: numeric("worker_rating", { precision: 3, scale: 2 }),
  workerCategory: text("worker_category"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBidSchema = createInsertSchema(bids).omit({ id: true, createdAt: true });
export type InsertBid = z.infer<typeof insertBidSchema>;
export type Bid = typeof bids.$inferSelect;

// Reviews Table
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").references(() => bookings.id),
  customerId: integer("customer_id").notNull().references(() => users.id),
  workerId: integer("worker_id").notNull().references(() => users.id),
  serviceId: integer("service_id").references(() => services.id),
  rating: integer("rating").notNull(), // 1-5
  reviewText: text("review_text"),
  customerName: text("customer_name"),
  workerName: text("worker_name"),
  serviceName: text("service_name"),
  status: text("status").notNull().default("pending"), // pending, approved, rejected
  isReported: boolean("is_reported").default(false).notNull(),
  reportReason: text("report_reason"),
  reportedBy: integer("reported_by").references(() => users.id),
  reportedAt: timestamp("reported_at"),
  approvedBy: integer("approved_by").references(() => users.id),
  approvedAt: timestamp("approved_at"),
  rejectionReason: text("rejection_reason"),
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertReviewSchema = createInsertSchema(reviews).omit({ id: true, createdAt: true });
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;

// Support Tickets Table
export const supportTickets = pgTable("support_tickets", {
  id: serial("id").primaryKey(),
  ticketNumber: text("ticket_number").notNull(),
  userId: integer("user_id").references(() => users.id),
  userName: text("user_name"),
  userPhone: text("user_phone"),
  userRole: text("user_role"),
  subject: text("subject").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // booking, payment, worker, technical, other
  priority: text("priority").notNull().default("medium"), // low, medium, high, urgent
  status: text("status").notNull().default("open"), // open, in_progress, resolved, closed
  assignedTo: integer("assigned_to").references(() => users.id),
  assignedToName: text("assigned_to_name"),
  resolution: text("resolution"),
  resolvedAt: timestamp("resolved_at"),
  closedAt: timestamp("closed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertSupportTicketSchema = createInsertSchema(supportTickets).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertSupportTicket = z.infer<typeof insertSupportTicketSchema>;
export type SupportTicket = typeof supportTickets.$inferSelect;

// User Complaints Table
export const userComplaints = pgTable("user_complaints", {
  id: serial("id").primaryKey(),
  complaintNumber: text("complaint_number").notNull(),
  complainantId: integer("complainant_id").references(() => users.id),
  complainantName: text("complainant_name"),
  complainantPhone: text("complainant_phone"),
  complainantRole: text("complainant_role"),
  againstId: integer("against_id").references(() => users.id),
  againstName: text("against_name"),
  againstRole: text("against_role"),
  bookingId: integer("booking_id").references(() => bookings.id),
  complaintType: text("complaint_type").notNull(), // behavior, service_quality, payment, fraud, other
  description: text("description").notNull(),
  evidence: text("evidence"), // URLs to uploaded evidence
  priority: text("priority").notNull().default("medium"),
  status: text("status").notNull().default("pending"), // pending, investigating, resolved, dismissed
  resolution: text("resolution"),
  actionTaken: text("action_taken"),
  resolvedBy: integer("resolved_by").references(() => users.id),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserComplaintSchema = createInsertSchema(userComplaints).omit({ id: true, createdAt: true });
export type InsertUserComplaint = z.infer<typeof insertUserComplaintSchema>;
export type UserComplaint = typeof userComplaints.$inferSelect;

// Reported Users Table
export const reportedUsers = pgTable("reported_users", {
  id: serial("id").primaryKey(),
  reportedUserId: integer("reported_user_id").notNull().references(() => users.id),
  reportedUserName: text("reported_user_name"),
  reportedUserPhone: text("reported_user_phone"),
  reportedUserRole: text("reported_user_role"),
  reportedById: integer("reported_by_id").references(() => users.id),
  reportedByName: text("reported_by_name"),
  reportReason: text("report_reason").notNull(), // spam, harassment, fraud, fake_profile, inappropriate, other
  description: text("description"),
  status: text("status").notNull().default("pending"), // pending, reviewed, action_taken, dismissed
  actionTaken: text("action_taken"), // warning, suspended, banned, none
  reviewedBy: integer("reviewed_by").references(() => users.id),
  reviewedAt: timestamp("reviewed_at"),
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertReportedUserSchema = createInsertSchema(reportedUsers).omit({ id: true, createdAt: true });
export type InsertReportedUser = z.infer<typeof insertReportedUserSchema>;
export type ReportedUser = typeof reportedUsers.$inferSelect;

// Chat Messages Table (for Chat Monitoring)
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  senderId: integer("sender_id").notNull().references(() => users.id),
  senderName: text("sender_name"),
  senderRole: text("sender_role"),
  receiverId: integer("receiver_id").notNull().references(() => users.id),
  receiverName: text("receiver_name"),
  bookingId: integer("booking_id").references(() => bookings.id),
  message: text("message").notNull(),
  messageType: text("message_type").notNull().default("text"), // text, image, file
  isFlagged: boolean("is_flagged").default(false).notNull(),
  flagReason: text("flag_reason"),
  flaggedAt: timestamp("flagged_at"),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({ id: true, createdAt: true });
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
