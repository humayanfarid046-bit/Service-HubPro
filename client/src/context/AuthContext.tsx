import { createContext, useContext, useState, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";

export type Role = "ADMIN" | "WORKER" | "CUSTOMER" | null;

interface User {
  id: number;
  phone: string;
  email: string | null;
  fullName: string;
  role: string;
  profilePhoto: string | null;
  gender: string | null;
  dateOfBirth: string | null;
  isActive: boolean;
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  role: Role;
  login: (role: Role, userData?: User) => void;
  logout: () => void;
  setCurrentUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  const login = (role: Role, userData?: User) => {
    if (userData) {
      setUser(userData);
      toast({
        title: `Welcome, ${userData.fullName}`,
        description: `Logged in as ${role}`,
      });
    } else {
      // Fallback for mock login
      const mockUser: User = {
        id: role === "ADMIN" ? 1 : role === "WORKER" ? 2 : 3,
        phone: role === "ADMIN" ? "99999" : role === "WORKER" ? "88888" : "77777",
        email: null,
        fullName: role === "ADMIN" ? "Admin User" : role === "WORKER" ? "Worker User" : "Customer User",
        role: role || "CUSTOMER",
        profilePhoto: null,
        gender: null,
        dateOfBirth: null,
        isActive: true,
        createdAt: new Date(),
      };
      setUser(mockUser);
      toast({
        title: `Welcome, ${mockUser.fullName}`,
        description: `Logged in as ${role}`,
      });
    }
  };

  const logout = () => {
    setUser(null);
    toast({
      title: "Logged out",
    });
  };

  const setCurrentUser = (userData: User) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, role: (user?.role as Role) || null, login, logout, setCurrentUser }}>
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
