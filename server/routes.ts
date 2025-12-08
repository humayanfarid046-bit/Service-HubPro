import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertCustomerDetailsSchema, insertWorkerDetailsSchema, insertServiceSchema, insertBookingSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // ============= AUTH ROUTES =============
  
  // In-memory OTP session store (for demo - use Redis in production)
  const otpSessions: Map<string, string> = new Map();
  
  // Send OTP via 2Factor
  app.post("/api/auth/send-otp", async (req, res) => {
    try {
      const { phone } = req.body;
      
      if (!phone || phone.length < 10) {
        return res.status(400).json({ error: "Invalid phone number" });
      }
      
      const apiKey = process.env.TWOFACTOR_API_KEY;
      
      if (!apiKey) {
        // Fallback to mock OTP if API key not configured
        const mockSessionId = `mock_${Date.now()}`;
        otpSessions.set(phone, mockSessionId);
        return res.json({ 
          success: true, 
          sessionId: mockSessionId,
          message: "OTP sent (mock mode - use 1234)",
          mock: true
        });
      }
      
      // Format phone number for India (add 91 if not present)
      const formattedPhone = phone.startsWith("91") ? phone : `91${phone}`;
      
      // Send OTP via 2Factor API
      const response = await fetch(`https://2factor.in/API/V1/${apiKey}/SMS/${formattedPhone}/AUTOGEN`);
      const data = await response.json();
      
      if (data.Status === "Success") {
        otpSessions.set(phone, data.Details);
        return res.json({ 
          success: true, 
          sessionId: data.Details,
          message: "OTP sent successfully"
        });
      } else {
        return res.status(400).json({ 
          error: data.Details || "Failed to send OTP" 
        });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Verify OTP via 2Factor
  app.post("/api/auth/verify-otp", async (req, res) => {
    try {
      const { phone, otp } = req.body;
      
      if (!phone || !otp) {
        return res.status(400).json({ error: "Phone and OTP are required" });
      }
      
      const sessionId = otpSessions.get(phone);
      const apiKey = process.env.TWOFACTOR_API_KEY;
      
      if (!apiKey || sessionId?.startsWith("mock_")) {
        // Mock verification - accept 1234
        if (otp === "1234") {
          otpSessions.delete(phone);
          const user = await storage.getUserByPhone(phone);
          return res.json({ 
            success: true, 
            verified: true,
            user,
            message: "OTP verified (mock mode)"
          });
        } else {
          return res.status(400).json({ error: "Invalid OTP. Use 1234 for testing." });
        }
      }
      
      if (!sessionId) {
        return res.status(400).json({ error: "OTP session expired. Please request new OTP." });
      }
      
      // Verify OTP via 2Factor API
      const response = await fetch(`https://2factor.in/API/V1/${apiKey}/SMS/VERIFY/${sessionId}/${otp}`);
      const data = await response.json();
      
      if (data.Status === "Success") {
        otpSessions.delete(phone);
        const user = await storage.getUserByPhone(phone);
        return res.json({ 
          success: true, 
          verified: true,
          user,
          message: "OTP verified successfully"
        });
      } else {
        return res.status(400).json({ 
          error: data.Details || "Invalid OTP" 
        });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Login / Register with Phone
  app.post("/api/auth/phone", async (req, res) => {
    try {
      const { phone } = req.body;
      
      // Check if user exists
      const existingUser = await storage.getUserByPhone(phone);
      
      if (existingUser) {
        // Return user info for login
        return res.json({
          exists: true,
          user: existingUser,
          message: "User found"
        });
      } else {
        return res.json({
          exists: false,
          message: "User not found. Please register."
        });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Register Customer
  app.post("/api/auth/register/customer", async (req, res) => {
    try {
      const userData = insertUserSchema.parse({
        ...req.body,
        role: "CUSTOMER"
      });
      
      const user = await storage.createUser(userData);
      
      // Create customer details if address provided
      if (req.body.house || req.body.city) {
        await storage.createCustomerDetails({
          userId: user.id,
          house: req.body.house,
          street: req.body.street,
          city: req.body.city,
          pincode: req.body.pincode,
        });
      }
      
      res.json({ user, message: "Customer registered successfully" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Register Worker
  app.post("/api/auth/register/worker", async (req, res) => {
    try {
      const userData = insertUserSchema.parse({
        phone: req.body.phone,
        email: req.body.email,
        fullName: req.body.fullName,
        role: "WORKER",
        profilePhoto: req.body.profilePhoto,
        gender: req.body.gender,
        dateOfBirth: req.body.dateOfBirth,
        isActive: true,
      });
      
      const user = await storage.createUser(userData);
      
      // Create worker details
      await storage.createWorkerDetails({
        userId: user.id,
        category: req.body.category,
        subService: req.body.subService,
        experience: req.body.experience,
        availability: req.body.availability,
        house: req.body.house,
        street: req.body.street,
        city: req.body.city,
        pincode: req.body.pincode,
        idProof: req.body.idProof,
        policeVerification: req.body.policeVerification,
        skillCertificate: req.body.skillCertificate,
        bankHolderName: req.body.bankHolderName,
        accountNumber: req.body.accountNumber,
        ifscCode: req.body.ifscCode,
        upiId: req.body.upiId,
        isVerified: false,
        rating: "0",
        totalEarnings: "0",
      });
      
      res.json({ user, message: "Worker registered successfully. Awaiting admin approval." });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // ============= SERVICE ROUTES =============
  
  app.get("/api/services", async (req, res) => {
    try {
      const services = await storage.getAllServices();
      res.json(services);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/services/:id", async (req, res) => {
    try {
      const service = await storage.getService(parseInt(req.params.id));
      if (!service) return res.status(404).json({ error: "Service not found" });
      res.json(service);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/services", async (req, res) => {
    try {
      const serviceData = insertServiceSchema.parse(req.body);
      const service = await storage.createService(serviceData);
      res.json(service);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/services/:id", async (req, res) => {
    try {
      const service = await storage.updateService(parseInt(req.params.id), req.body);
      if (!service) return res.status(404).json({ error: "Service not found" });
      res.json(service);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/services/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteService(parseInt(req.params.id));
      if (!deleted) return res.status(404).json({ error: "Service not found" });
      res.json({ message: "Service deleted" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============= BOOKING ROUTES =============
  
  app.post("/api/bookings", async (req, res) => {
    try {
      const bookingData = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(bookingData);
      
      // Create notification for customer
      await storage.createNotification({
        userId: booking.customerId,
        title: "Booking Confirmed",
        message: `Your booking #${booking.id} has been created successfully.`,
        type: "booking",
        isRead: false,
      });
      
      res.json(booking);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/bookings/customer/:customerId", async (req, res) => {
    try {
      const bookings = await storage.getBookingsByCustomer(parseInt(req.params.customerId));
      res.json(bookings);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/bookings/worker/:workerId", async (req, res) => {
    try {
      const bookings = await storage.getBookingsByWorker(parseInt(req.params.workerId));
      res.json(bookings);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/bookings/:id", async (req, res) => {
    try {
      const booking = await storage.getBooking(parseInt(req.params.id));
      if (!booking) return res.status(404).json({ error: "Booking not found" });
      res.json(booking);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/bookings/:id", async (req, res) => {
    try {
      const booking = await storage.updateBooking(parseInt(req.params.id), req.body);
      if (!booking) return res.status(404).json({ error: "Booking not found" });
      res.json(booking);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============= USER ROUTES =============
  
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(parseInt(req.params.id));
      if (!user) return res.status(404).json({ error: "User not found" });
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============= WORKER ROUTES =============
  
  app.get("/api/workers", async (req, res) => {
    try {
      const workers = await storage.getAllWorkers();
      res.json(workers);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/workers/:userId", async (req, res) => {
    try {
      const worker = await storage.getWorkerDetails(parseInt(req.params.userId));
      if (!worker) return res.status(404).json({ error: "Worker not found" });
      res.json(worker);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/workers/:userId", async (req, res) => {
    try {
      const worker = await storage.updateWorkerDetails(parseInt(req.params.userId), req.body);
      if (!worker) return res.status(404).json({ error: "Worker not found" });
      res.json(worker);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============= NOTIFICATION ROUTES =============
  
  app.get("/api/notifications/:userId", async (req, res) => {
    try {
      const notifications = await storage.getNotificationsByUser(parseInt(req.params.userId));
      res.json(notifications);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/notifications/:id/read", async (req, res) => {
    try {
      const success = await storage.markNotificationRead(parseInt(req.params.id));
      if (!success) return res.status(404).json({ error: "Notification not found" });
      res.json({ message: "Notification marked as read" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============= ADMIN ROUTES =============
  
  app.get("/api/admin/stats", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      const bookings = await storage.getAllBookings();
      const services = await storage.getAllServices();
      const workers = await storage.getAllWorkers();
      
      res.json({
        totalUsers: users.length,
        totalCustomers: users.filter(u => u.role === "CUSTOMER").length,
        totalWorkers: workers.length,
        totalBookings: bookings.length,
        totalServices: services.length,
        revenue: bookings.reduce((sum, b) => sum + parseFloat(b.totalAmount || "0"), 0),
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Update user
  app.patch("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.updateUser(id, req.body);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Hidden admin setup (for initial admin creation)
  app.post("/api/setup/admin", async (req, res) => {
    try {
      const { phone, fullName, secretKey } = req.body;
      
      // Simple secret key verification
      if (secretKey !== "SERVICEHUB_ADMIN_2024") {
        return res.status(403).json({ error: "Invalid secret key" });
      }
      
      // Check if admin already exists
      const existingUser = await storage.getUserByPhone(phone);
      if (existingUser) {
        // Update existing user to admin
        const updatedUser = await storage.updateUser(existingUser.id, { role: "ADMIN" });
        return res.json({ user: updatedUser, message: "User upgraded to admin" });
      }
      
      // Create new admin
      const user = await storage.createUser({
        phone,
        fullName: fullName || "Admin",
        role: "ADMIN",
      });
      
      res.json({ user, message: "Admin created successfully" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  return httpServer;
}
