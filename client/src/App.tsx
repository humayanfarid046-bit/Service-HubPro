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
import AdminDashboard from "@/pages/admin/Dashboard";

function PrivateRoute({ component: Component, allowedRoles }: { component: React.ComponentType, allowedRoles: string[] }) {
  const { role } = useAuth();
  
  if (!role) return <Redirect to="/auth" />;
  if (!allowedRoles.includes(role)) return <Redirect to="/auth" />;

  return <Component />;
}

function Router() {
  return (
    <MobileLayout>
      <Switch>
        <Route path="/auth" component={AuthPage} />
        
        {/* Customer Routes */}
        <Route path="/customer/home">
          <PrivateRoute component={CustomerHome} allowedRoles={["CUSTOMER"]} />
        </Route>
        <Route path="/customer/book/:id">
          <PrivateRoute component={CustomerBooking} allowedRoles={["CUSTOMER"]} />
        </Route>
        <Route path="/customer/bookings">
          <PrivateRoute component={CustomerTracking} allowedRoles={["CUSTOMER"]} />
        </Route>

        {/* Worker Routes */}
        <Route path="/worker/dashboard">
          <PrivateRoute component={WorkerDashboard} allowedRoles={["WORKER"]} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/dashboard">
          <PrivateRoute component={AdminDashboard} allowedRoles={["ADMIN"]} />
        </Route>

        {/* Default Redirects */}
        <Route path="/">
          <Redirect to="/auth" />
        </Route>
        
        <Route component={NotFound} />
      </Switch>
    </MobileLayout>
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
