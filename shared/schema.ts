import { pgTable, text, serial, integer, timestamp, jsonb, boolean, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users Table (supports ADMIN, WORKER, CUSTOMER roles)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  phone: text("phone").notNull().unique(),
  email: text("email"),
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
