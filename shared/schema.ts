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

// Services Table
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  basePrice: numeric("base_price", { precision: 10, scale: 2 }).notNull(),
  icon: text("icon"),
  image: text("image"),
  isActive: boolean("is_active").default(true).notNull(),
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
