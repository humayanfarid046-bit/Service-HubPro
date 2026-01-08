import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertCustomerDetailsSchema, insertWorkerDetailsSchema, insertServiceSchema, insertBookingSchema, insertJobSchema, insertBidSchema } from "@shared/schema";
import { z } from "zod";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";

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
          
          // Check if user exists and is pending approval
          if (user && !user.isActive) {
            return res.json({ 
              success: true, 
              verified: true,
              user: null,
              pendingApproval: true,
              message: "Your account is pending approval. Our team will review your request and get in touch with you shortly."
            });
          }
          
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
        
        // Check if user exists and is pending approval
        if (user && !user.isActive) {
          return res.json({ 
            success: true, 
            verified: true,
            user: null,
            pendingApproval: true,
            message: "Your account is pending approval. Our team will review your request and get in touch with you shortly."
          });
        }
        
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
        // Check if user is pending approval (isActive = false)
        if (!existingUser.isActive) {
          return res.json({
            exists: true,
            user: null,
            pendingApproval: true,
            message: "Your account is pending approval. Our team will review your request and get in touch with you shortly."
          });
        }
        
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
        role: "CUSTOMER",
        isActive: false  // Customer starts as inactive, needs admin approval
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
      
      res.json({ 
        user, 
        message: "Submission Successful! Our team will review your request and get in touch with you shortly.",
        pendingApproval: true
      });
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
        isActive: false,  // Worker starts as inactive, needs admin approval
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
      
      res.json({ 
        user, 
        message: "Submission Successful! Our team will review your request and get in touch with you shortly.",
        pendingApproval: true
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // ============= SERVICE CATEGORY ROUTES =============
  
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/categories/:id", async (req, res) => {
    try {
      const category = await storage.getCategory(parseInt(req.params.id));
      if (!category) return res.status(404).json({ error: "Category not found" });
      res.json(category);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/categories", async (req, res) => {
    try {
      const category = await storage.createCategory(req.body);
      res.json(category);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/categories/:id", async (req, res) => {
    try {
      const category = await storage.updateCategory(parseInt(req.params.id), req.body);
      if (!category) return res.status(404).json({ error: "Category not found" });
      res.json(category);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/categories/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteCategory(parseInt(req.params.id));
      if (!deleted) return res.status(404).json({ error: "Category not found" });
      res.json({ message: "Category deleted" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
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

  // ============= PLATFORM SETTINGS ROUTES =============
  
  // Get all settings
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getAllSettings();
      res.json(settings);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Get single setting
  app.get("/api/settings/:key", async (req, res) => {
    try {
      const setting = await storage.getSetting(req.params.key);
      if (!setting) {
        return res.status(404).json({ error: "Setting not found" });
      }
      res.json(setting);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Update setting
  app.put("/api/settings/:key", async (req, res) => {
    try {
      const { value, description } = req.body;
      if (value === undefined) {
        return res.status(400).json({ error: "Value is required" });
      }
      const setting = await storage.setSetting(req.params.key, String(value), description);
      res.json(setting);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Bulk update settings
  app.put("/api/settings", async (req, res) => {
    try {
      const { settings } = req.body;
      if (!settings || !Array.isArray(settings)) {
        return res.status(400).json({ error: "Settings array is required" });
      }
      const results = await Promise.all(
        settings.map((s: { key: string; value: string; description?: string }) =>
          storage.setSetting(s.key, s.value, s.description)
        )
      );
      res.json(results);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============= OBJECT STORAGE ROUTES =============
  
  // Get upload URL for file upload
  app.post("/api/objects/upload", async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error: any) {
      console.error("Error getting upload URL:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Serve public objects
  app.get("/public-objects/:filePath(*)", async (req, res) => {
    const filePath = req.params.filePath;
    const objectStorageService = new ObjectStorageService();
    try {
      const file = await objectStorageService.searchPublicObject(filePath);
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }
      objectStorageService.downloadObject(file, res);
    } catch (error) {
      console.error("Error searching for public object:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Serve uploaded objects
  app.get("/objects/:objectPath(*)", async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error checking object access:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  // Update service image after upload
  app.put("/api/service-images", async (req, res) => {
    if (!req.body.imageURL) {
      return res.status(400).json({ error: "imageURL is required" });
    }

    try {
      const objectStorageService = new ObjectStorageService();
      const objectPath = objectStorageService.normalizeObjectEntityPath(req.body.imageURL);
      res.status(200).json({ objectPath });
    } catch (error) {
      console.error("Error setting service image:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // ============= PAYMENT ROUTES =============
  
  app.get("/api/payments", async (req, res) => {
    try {
      const allPayments = await storage.getAllPayments();
      res.json(allPayments);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/payments", async (req, res) => {
    try {
      const payment = await storage.createPayment(req.body);
      res.json(payment);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/payments/:id", async (req, res) => {
    try {
      const payment = await storage.updatePayment(parseInt(req.params.id), req.body);
      if (!payment) return res.status(404).json({ error: "Payment not found" });
      res.json(payment);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============= TRANSACTION ROUTES =============
  
  app.get("/api/transactions", async (req, res) => {
    try {
      const allTransactions = await storage.getAllTransactions();
      res.json(allTransactions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/transactions", async (req, res) => {
    try {
      const transaction = await storage.createTransaction(req.body);
      res.json(transaction);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // ============= PAYOUT ROUTES =============
  
  app.get("/api/payouts", async (req, res) => {
    try {
      const allPayouts = await storage.getAllPayouts();
      res.json(allPayouts);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/payouts", async (req, res) => {
    try {
      const payout = await storage.createPayout(req.body);
      res.json(payout);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/payouts/:id", async (req, res) => {
    try {
      const payout = await storage.updatePayout(parseInt(req.params.id), req.body);
      if (!payout) return res.status(404).json({ error: "Payout not found" });
      res.json(payout);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============= REFUND ROUTES =============
  
  app.get("/api/refunds", async (req, res) => {
    try {
      const allRefunds = await storage.getAllRefunds();
      res.json(allRefunds);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/refunds", async (req, res) => {
    try {
      const refund = await storage.createRefund(req.body);
      res.json(refund);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/refunds/:id", async (req, res) => {
    try {
      const refund = await storage.updateRefund(parseInt(req.params.id), req.body);
      if (!refund) return res.status(404).json({ error: "Refund not found" });
      res.json(refund);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============= SUPPORT TICKETS ROUTES =============
  
  app.get("/api/support-tickets", async (req, res) => {
    try {
      const tickets = await storage.getAllSupportTickets();
      res.json(tickets);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/support-tickets/status/:status", async (req, res) => {
    try {
      const tickets = await storage.getSupportTicketsByStatus(req.params.status);
      res.json(tickets);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/support-tickets", async (req, res) => {
    try {
      const ticket = await storage.createSupportTicket(req.body);
      res.json(ticket);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/support-tickets/:id", async (req, res) => {
    try {
      const ticket = await storage.updateSupportTicket(parseInt(req.params.id), req.body);
      if (!ticket) return res.status(404).json({ error: "Ticket not found" });
      res.json(ticket);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/support-tickets/:id", async (req, res) => {
    try {
      await storage.deleteSupportTicket(parseInt(req.params.id));
      res.json({ message: "Ticket deleted" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============= USER COMPLAINTS ROUTES =============
  
  app.get("/api/user-complaints", async (req, res) => {
    try {
      const complaints = await storage.getAllUserComplaints();
      res.json(complaints);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/user-complaints/status/:status", async (req, res) => {
    try {
      const complaints = await storage.getUserComplaintsByStatus(req.params.status);
      res.json(complaints);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/user-complaints", async (req, res) => {
    try {
      const complaint = await storage.createUserComplaint(req.body);
      res.json(complaint);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/user-complaints/:id", async (req, res) => {
    try {
      const complaint = await storage.updateUserComplaint(parseInt(req.params.id), req.body);
      if (!complaint) return res.status(404).json({ error: "Complaint not found" });
      res.json(complaint);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/user-complaints/:id", async (req, res) => {
    try {
      await storage.deleteUserComplaint(parseInt(req.params.id));
      res.json({ message: "Complaint deleted" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============= REPORTED USERS ROUTES =============
  
  app.get("/api/reported-users", async (req, res) => {
    try {
      const reports = await storage.getAllReportedUsers();
      res.json(reports);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/reported-users/status/:status", async (req, res) => {
    try {
      const reports = await storage.getReportedUsersByStatus(req.params.status);
      res.json(reports);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/reported-users", async (req, res) => {
    try {
      const report = await storage.createReportedUser(req.body);
      res.json(report);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/reported-users/:id", async (req, res) => {
    try {
      const report = await storage.updateReportedUser(parseInt(req.params.id), req.body);
      if (!report) return res.status(404).json({ error: "Report not found" });
      res.json(report);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/reported-users/:id", async (req, res) => {
    try {
      await storage.deleteReportedUser(parseInt(req.params.id));
      res.json({ message: "Report deleted" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============= CHAT MESSAGES ROUTES =============
  
  app.get("/api/chat-messages", async (req, res) => {
    try {
      const messages = await storage.getAllChatMessages();
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/chat-messages/flagged", async (req, res) => {
    try {
      const messages = await storage.getFlaggedChatMessages();
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/chat-messages", async (req, res) => {
    try {
      const message = await storage.createChatMessage(req.body);
      res.json(message);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/chat-messages/:id", async (req, res) => {
    try {
      const message = await storage.updateChatMessage(parseInt(req.params.id), req.body);
      if (!message) return res.status(404).json({ error: "Message not found" });
      res.json(message);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/chat-messages/:id", async (req, res) => {
    try {
      await storage.deleteChatMessage(parseInt(req.params.id));
      res.json({ message: "Message deleted" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============= REVIEWS ROUTES =============
  
  app.get("/api/reviews", async (req, res) => {
    try {
      const allReviews = await storage.getAllReviews();
      res.json(allReviews);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/reviews/status/:status", async (req, res) => {
    try {
      const reviewsByStatus = await storage.getReviewsByStatus(req.params.status);
      res.json(reviewsByStatus);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/reviews/reported", async (req, res) => {
    try {
      const reportedReviews = await storage.getReportedReviews();
      res.json(reportedReviews);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/reviews/worker/:workerId", async (req, res) => {
    try {
      const workerReviews = await storage.getReviewsByWorker(parseInt(req.params.workerId));
      res.json(workerReviews);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/reviews", async (req, res) => {
    try {
      const review = await storage.createReview(req.body);
      res.json(review);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/reviews/:id", async (req, res) => {
    try {
      const review = await storage.updateReview(parseInt(req.params.id), req.body);
      if (!review) return res.status(404).json({ error: "Review not found" });
      res.json(review);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/reviews/:id", async (req, res) => {
    try {
      await storage.deleteReview(parseInt(req.params.id));
      res.json({ message: "Review deleted" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============= PUSH NOTIFICATIONS ROUTES =============
  
  app.get("/api/push-notifications", async (req, res) => {
    try {
      const notifications = await storage.getAllPushNotifications();
      res.json(notifications);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/push-notifications", async (req, res) => {
    try {
      const notification = await storage.createPushNotification(req.body);
      res.json(notification);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/push-notifications/:id", async (req, res) => {
    try {
      const notification = await storage.updatePushNotification(parseInt(req.params.id), req.body);
      if (!notification) return res.status(404).json({ error: "Notification not found" });
      res.json(notification);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============= SMS LOGS ROUTES =============
  
  app.get("/api/sms-logs", async (req, res) => {
    try {
      const logs = await storage.getAllSmsLogs();
      res.json(logs);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/sms-logs", async (req, res) => {
    try {
      const log = await storage.createSmsLog(req.body);
      res.json(log);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // ============= EMAIL BROADCASTS ROUTES =============
  
  app.get("/api/email-broadcasts", async (req, res) => {
    try {
      const broadcasts = await storage.getAllEmailBroadcasts();
      res.json(broadcasts);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/email-broadcasts", async (req, res) => {
    try {
      const broadcast = await storage.createEmailBroadcast(req.body);
      res.json(broadcast);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/email-broadcasts/:id", async (req, res) => {
    try {
      const broadcast = await storage.updateEmailBroadcast(parseInt(req.params.id), req.body);
      if (!broadcast) return res.status(404).json({ error: "Broadcast not found" });
      res.json(broadcast);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/email-broadcasts/:id", async (req, res) => {
    try {
      await storage.deleteEmailBroadcast(parseInt(req.params.id));
      res.json({ message: "Broadcast deleted" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============= ANNOUNCEMENTS ROUTES =============
  
  app.get("/api/announcements", async (req, res) => {
    try {
      const allAnnouncements = await storage.getAllAnnouncements();
      res.json(allAnnouncements);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/announcements", async (req, res) => {
    try {
      const announcement = await storage.createAnnouncement(req.body);
      res.json(announcement);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/announcements/:id", async (req, res) => {
    try {
      const announcement = await storage.updateAnnouncement(parseInt(req.params.id), req.body);
      if (!announcement) return res.status(404).json({ error: "Announcement not found" });
      res.json(announcement);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/announcements/:id", async (req, res) => {
    try {
      await storage.deleteAnnouncement(parseInt(req.params.id));
      res.json({ message: "Announcement deleted" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============= WORKER DOCUMENTS ROUTES =============
  
  app.get("/api/worker-documents", async (req, res) => {
    try {
      const documents = await storage.getAllWorkerDocuments();
      res.json(documents);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/worker-documents/worker/:workerId", async (req, res) => {
    try {
      const documents = await storage.getWorkerDocumentsByWorkerId(parseInt(req.params.workerId));
      res.json(documents);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/worker-documents", async (req, res) => {
    try {
      const document = await storage.createWorkerDocument(req.body);
      res.json(document);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/worker-documents/:id", async (req, res) => {
    try {
      const document = await storage.updateWorkerDocument(parseInt(req.params.id), req.body);
      if (!document) return res.status(404).json({ error: "Document not found" });
      res.json(document);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============= ACTIVITY LOGS ROUTES =============
  
  app.get("/api/activity-logs", async (req, res) => {
    try {
      const logs = await storage.getAllActivityLogs();
      res.json(logs);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/activity-logs", async (req, res) => {
    try {
      const log = await storage.createActivityLog(req.body);
      res.json(log);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // ============= LOGIN EVENTS ROUTES =============
  
  app.get("/api/login-events", async (req, res) => {
    try {
      const events = await storage.getAllLoginEvents();
      res.json(events);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/login-events", async (req, res) => {
    try {
      const event = await storage.createLoginEvent(req.body);
      res.json(event);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // ============= USER SECURITY SETTINGS ROUTES =============
  
  app.get("/api/security-settings", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      const settingsPromises = users.map(async (user) => {
        const settings = await storage.getUserSecuritySettings(user.id);
        return { userId: user.id, fullName: user.fullName, phone: user.phone, role: user.role, settings };
      });
      const allSettings = await Promise.all(settingsPromises);
      res.json(allSettings);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/security-settings/:userId", async (req, res) => {
    try {
      const settings = await storage.getUserSecuritySettings(parseInt(req.params.userId));
      res.json(settings || { is2FAEnabled: false });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/security-settings", async (req, res) => {
    try {
      const settings = await storage.upsertUserSecuritySettings(req.body);
      res.json(settings);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // ============= COUPON ROUTES =============
  
  app.get("/api/coupons", async (req, res) => {
    try {
      const allCoupons = await storage.getAllCoupons();
      res.json(allCoupons);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/coupons", async (req, res) => {
    try {
      const coupon = await storage.createCoupon(req.body);
      res.json(coupon);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/coupons/:id", async (req, res) => {
    try {
      const coupon = await storage.updateCoupon(parseInt(req.params.id), req.body);
      if (!coupon) return res.status(404).json({ error: "Coupon not found" });
      res.json(coupon);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/coupons/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteCoupon(parseInt(req.params.id));
      if (!deleted) return res.status(404).json({ error: "Coupon not found" });
      res.json({ message: "Coupon deleted" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============= DISPUTE ROUTES =============
  
  app.get("/api/disputes", async (req, res) => {
    try {
      const allDisputes = await storage.getAllDisputes();
      res.json(allDisputes);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/disputes", async (req, res) => {
    try {
      const dispute = await storage.createDispute(req.body);
      res.json(dispute);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/disputes/:id", async (req, res) => {
    try {
      const dispute = await storage.updateDispute(parseInt(req.params.id), req.body);
      if (!dispute) return res.status(404).json({ error: "Dispute not found" });
      res.json(dispute);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============= JOBS & BIDS ROUTES =============
  
  // Get all jobs
  app.get("/api/jobs", async (req, res) => {
    try {
      const { customerId, status } = req.query;
      let jobsList;
      if (customerId) {
        jobsList = await storage.getJobsByCustomer(parseInt(customerId as string));
      } else if (status === "open") {
        jobsList = await storage.getOpenJobs();
      } else {
        jobsList = await storage.getAllJobs();
      }
      res.json(jobsList);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get single job
  app.get("/api/jobs/:id", async (req, res) => {
    try {
      const job = await storage.getJob(parseInt(req.params.id));
      if (!job) return res.status(404).json({ error: "Job not found" });
      res.json(job);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create job
  app.post("/api/jobs", async (req, res) => {
    try {
      const validated = insertJobSchema.parse(req.body);
      const job = await storage.createJob(validated);
      res.status(201).json(job);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Update job
  app.patch("/api/jobs/:id", async (req, res) => {
    try {
      const job = await storage.updateJob(parseInt(req.params.id), req.body);
      if (!job) return res.status(404).json({ error: "Job not found" });
      res.json(job);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Delete job
  app.delete("/api/jobs/:id", async (req, res) => {
    try {
      await storage.deleteJob(parseInt(req.params.id));
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get bids for a job
  app.get("/api/jobs/:id/bids", async (req, res) => {
    try {
      const bids = await storage.getBidsByJob(parseInt(req.params.id));
      res.json(bids);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get all bids for a worker
  app.get("/api/bids", async (req, res) => {
    try {
      const { workerId } = req.query;
      if (workerId) {
        const bids = await storage.getBidsByWorker(parseInt(workerId as string));
        res.json(bids);
      } else {
        res.status(400).json({ error: "workerId is required" });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create bid
  app.post("/api/bids", async (req, res) => {
    try {
      const validated = insertBidSchema.parse(req.body);
      const bid = await storage.createBid(validated);
      res.status(201).json(bid);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Update bid
  app.patch("/api/bids/:id", async (req, res) => {
    try {
      const bid = await storage.updateBid(parseInt(req.params.id), req.body);
      if (!bid) return res.status(404).json({ error: "Bid not found" });
      res.json(bid);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Select a bid (customer accepts worker)
  app.post("/api/jobs/:jobId/select-bid/:bidId", async (req, res) => {
    try {
      const jobId = parseInt(req.params.jobId);
      const bidId = parseInt(req.params.bidId);
      
      const bid = await storage.getBid(bidId);
      if (!bid) return res.status(404).json({ error: "Bid not found" });
      
      // Update the bid as selected
      await storage.updateBid(bidId, { isSelected: true, status: "accepted" });
      
      // Update the job with selected worker
      const job = await storage.updateJob(jobId, { 
        selectedBidId: bidId, 
        selectedWorkerId: bid.workerId,
        status: "assigned" 
      });
      
      // Reject all other bids
      const allBids = await storage.getBidsByJob(jobId);
      for (const otherBid of allBids) {
        if (otherBid.id !== bidId) {
          await storage.updateBid(otherBid.id, { status: "rejected" });
        }
      }
      
      res.json({ job, selectedBid: bid });
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
