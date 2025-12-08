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
