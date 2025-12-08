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
import WorkerDashboard from "@/pages/worker/Dashboard";

// Admin Pages
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminServices from "@/pages/admin/Services";
import AdminWorkers from "@/pages/admin/Workers";
import AdminOrders from "@/pages/admin/Orders";

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
      <Route path="/worker/dashboard">
        <MobileLayout><PrivateRoute component={WorkerDashboard} allowedRoles={["WORKER"]} /></MobileLayout>
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
