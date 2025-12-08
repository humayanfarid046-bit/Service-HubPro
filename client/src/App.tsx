import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { MobileLayout } from "@/components/layout/MobileLayout";
import AuthPage from "@/pages/AuthPage";
import NotFound from "@/pages/not-found";

// Role specific pages
import CustomerHome from "@/pages/customer/Home";
import CustomerBooking from "@/pages/customer/Booking";
import CustomerTracking from "@/pages/customer/Tracking";
import CustomerProfile from "@/pages/customer/Profile";
import CustomerSupport from "@/pages/customer/Support";
import CustomerRegister from "@/pages/customer/Register";

// Worker Pages
import WorkerDashboard from "@/pages/worker/Dashboard";
import WorkerJobDetails from "@/pages/worker/JobDetails";
import WorkerEarnings from "@/pages/worker/Earnings";
import WorkerProfile from "@/pages/worker/Profile";
import WorkerSupport from "@/pages/worker/Support";
import WorkerRegister from "@/pages/worker/Register"; // New Import

// Admin Pages
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminServices from "@/pages/admin/Services";
import AdminWorkers from "@/pages/admin/Workers";
import AdminOrders from "@/pages/admin/Orders";
import AdminCustomers from "@/pages/admin/Customers";
import AdminFinance from "@/pages/admin/Finance";
import AdminOffers from "@/pages/admin/Offers";
import AdminNotifications from "@/pages/admin/Notifications";
import AdminDisputes from "@/pages/admin/Disputes";
import AdminSettings from "@/pages/admin/Settings";
import AdminUsers from "@/pages/admin/Users";
import AdminKYC from "@/pages/admin/KYC";
import AdminWorkerVerification from "@/pages/admin/WorkerVerification";
import AdminActivityLogs from "@/pages/admin/ActivityLogs";
import AdminLoginLogs from "@/pages/admin/LoginLogs";
import AdminTwoFactorSettings from "@/pages/admin/TwoFactorSettings";
import AdminPushNotifications from "@/pages/admin/PushNotifications";
import AdminSmsNotifications from "@/pages/admin/SmsNotifications";
import AdminEmailBroadcast from "@/pages/admin/EmailBroadcast";
import AdminAnnouncements from "@/pages/admin/Announcements";
import AdminReviewList from "@/pages/admin/ReviewList";
import AdminReviewApproval from "@/pages/admin/ReviewApproval";
import AdminReviewReport from "@/pages/admin/ReviewReport";
import AdminWorkerRatingPanel from "@/pages/admin/WorkerRatingPanel";
import AdminSupportTickets from "@/pages/admin/SupportTickets";
import AdminUserComplaints from "@/pages/admin/UserComplaints";
import AdminChatMonitoring from "@/pages/admin/ChatMonitoring";
import AdminReportedUsers from "@/pages/admin/ReportedUsers";
import AdminActiveUserStats from "@/pages/admin/ActiveUserStats";
import AdminBookingStats from "@/pages/admin/BookingStats";
import AdminRevenueStats from "@/pages/admin/RevenueStats";
import AdminWorkerPerformance from "@/pages/admin/WorkerPerformance";
import AdminCustomerLifetimeValue from "@/pages/admin/CustomerLifetimeValue";

function PrivateRoute({ component: Component, allowedRoles }: { component: React.ComponentType, allowedRoles: string[] }) {
  const { role } = useAuth();
  
  if (!role) return <Redirect to="/auth" />;
  if (!allowedRoles.includes(role)) return <Redirect to="/auth" />;

  return <Component />;
}

function AdminRoute({ component: Component }: { component: React.ComponentType }) {
  // Special wrapper for Admin routes as they don't use the MobileLayout
  const { role } = useAuth();
  
  if (!role) return <Redirect to="/auth" />;
  if (role !== "ADMIN") return <Redirect to="/auth" />;

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <Route path="/customer/register" component={CustomerRegister} /> {/* Public Route */}
      <Route path="/worker/register" component={WorkerRegister} /> {/* Public Route */}
      
      {/* Admin Routes - these use their own layout */}
      <Route path="/admin/dashboard">
        <AdminRoute component={AdminDashboard} />
      </Route>
      <Route path="/admin/services">
        <AdminRoute component={AdminServices} />
      </Route>
      <Route path="/admin/workers">
        <AdminRoute component={AdminWorkers} />
      </Route>
      <Route path="/admin/orders">
        <AdminRoute component={AdminOrders} />
      </Route>
      <Route path="/admin/customers">
        <AdminRoute component={AdminCustomers} />
      </Route>
      <Route path="/admin/finance">
        <AdminRoute component={AdminFinance} />
      </Route>
      <Route path="/admin/offers">
        <AdminRoute component={AdminOffers} />
      </Route>
      <Route path="/admin/notifications">
        <AdminRoute component={AdminNotifications} />
      </Route>
      <Route path="/admin/disputes">
        <AdminRoute component={AdminDisputes} />
      </Route>
      <Route path="/admin/settings">
        <AdminRoute component={AdminSettings} />
      </Route>
      <Route path="/admin/users">
        <AdminRoute component={AdminUsers} />
      </Route>
      <Route path="/admin/kyc">
        <AdminRoute component={AdminKYC} />
      </Route>
      <Route path="/admin/worker-verification">
        <AdminRoute component={AdminWorkerVerification} />
      </Route>
      <Route path="/admin/activity-logs">
        <AdminRoute component={AdminActivityLogs} />
      </Route>
      <Route path="/admin/login-logs">
        <AdminRoute component={AdminLoginLogs} />
      </Route>
      <Route path="/admin/2fa-settings">
        <AdminRoute component={AdminTwoFactorSettings} />
      </Route>
      <Route path="/admin/push-notifications">
        <AdminRoute component={AdminPushNotifications} />
      </Route>
      <Route path="/admin/sms-notifications">
        <AdminRoute component={AdminSmsNotifications} />
      </Route>
      <Route path="/admin/email-broadcast">
        <AdminRoute component={AdminEmailBroadcast} />
      </Route>
      <Route path="/admin/announcements">
        <AdminRoute component={AdminAnnouncements} />
      </Route>
      <Route path="/admin/reviews">
        <AdminRoute component={AdminReviewList} />
      </Route>
      <Route path="/admin/review-approval">
        <AdminRoute component={AdminReviewApproval} />
      </Route>
      <Route path="/admin/review-reports">
        <AdminRoute component={AdminReviewReport} />
      </Route>
      <Route path="/admin/worker-ratings">
        <AdminRoute component={AdminWorkerRatingPanel} />
      </Route>
      <Route path="/admin/support-tickets">
        <AdminRoute component={AdminSupportTickets} />
      </Route>
      <Route path="/admin/user-complaints">
        <AdminRoute component={AdminUserComplaints} />
      </Route>
      <Route path="/admin/chat-monitoring">
        <AdminRoute component={AdminChatMonitoring} />
      </Route>
      <Route path="/admin/reported-users">
        <AdminRoute component={AdminReportedUsers} />
      </Route>
      <Route path="/admin/active-users">
        <AdminRoute component={AdminActiveUserStats} />
      </Route>
      <Route path="/admin/booking-stats">
        <AdminRoute component={AdminBookingStats} />
      </Route>
      <Route path="/admin/revenue-stats">
        <AdminRoute component={AdminRevenueStats} />
      </Route>
      <Route path="/admin/worker-performance">
        <AdminRoute component={AdminWorkerPerformance} />
      </Route>
      <Route path="/admin/customer-clv">
        <AdminRoute component={AdminCustomerLifetimeValue} />
      </Route>

      {/* Mobile App Routes - these use the MobileLayout */}
      <Route path="/customer/home">
        <MobileLayout><PrivateRoute component={CustomerHome} allowedRoles={["CUSTOMER"]} /></MobileLayout>
      </Route>
      <Route path="/customer/book/:id">
        <MobileLayout><PrivateRoute component={CustomerBooking} allowedRoles={["CUSTOMER"]} /></MobileLayout>
      </Route>
      <Route path="/customer/bookings">
        <MobileLayout><PrivateRoute component={CustomerTracking} allowedRoles={["CUSTOMER"]} /></MobileLayout>
      </Route>
      <Route path="/customer/profile">
        <MobileLayout><PrivateRoute component={CustomerProfile} allowedRoles={["CUSTOMER"]} /></MobileLayout>
      </Route>
      <Route path="/customer/support">
        <MobileLayout><PrivateRoute component={CustomerSupport} allowedRoles={["CUSTOMER"]} /></MobileLayout>
      </Route>

      {/* Worker Routes */}
      <Route path="/worker/dashboard">
        <MobileLayout><PrivateRoute component={WorkerDashboard} allowedRoles={["WORKER"]} /></MobileLayout>
      </Route>
      <Route path="/worker/job/:id">
        <MobileLayout><PrivateRoute component={WorkerJobDetails} allowedRoles={["WORKER"]} /></MobileLayout>
      </Route>
      <Route path="/worker/profile">
        <MobileLayout><PrivateRoute component={WorkerProfile} allowedRoles={["WORKER"]} /></MobileLayout>
      </Route>
       <Route path="/worker/earnings">
        <MobileLayout><PrivateRoute component={WorkerEarnings} allowedRoles={["WORKER"]} /></MobileLayout>
      </Route>
       <Route path="/worker/support">
        <MobileLayout><PrivateRoute component={WorkerSupport} allowedRoles={["WORKER"]} /></MobileLayout>
      </Route>


      {/* Default Redirects */}
      <Route path="/">
        <Redirect to="/auth" />
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
