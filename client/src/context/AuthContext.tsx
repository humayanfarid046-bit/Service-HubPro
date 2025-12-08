import { createContext, useContext, useState, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";

export type Role = "ADMIN" | "WORKER" | "CUSTOMER" | null;

interface User {
  id: string;
  name: string;
  role: Role;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  role: Role;
  login: (role: Role) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  const login = (role: Role) => {
    let mockUser: User;
    switch (role) {
      case "ADMIN":
        mockUser = { id: "admin1", name: "Admin User", role: "ADMIN" };
        break;
      case "WORKER":
        mockUser = { id: "worker1", name: "John Doe (Pro)", role: "WORKER", avatar: "https://i.pravatar.cc/150?u=worker1" };
        break;
      case "CUSTOMER":
        mockUser = { id: "cust1", name: "Alice Smith", role: "CUSTOMER", avatar: "https://i.pravatar.cc/150?u=cust1" };
        break;
      default:
        return;
    }
    setUser(mockUser);
    toast({
      title: `Welcome back, ${mockUser.name}`,
      description: `Logged in as ${role}`,
    });
  };

  const logout = () => {
    setUser(null);
    toast({
      title: "Logged out",
    });
  };

  return (
    <AuthContext.Provider value={{ user, role: user?.role || null, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
