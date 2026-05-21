import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: "customer" | "admin";
  createdAt: number;
};

type AuthContextType = {
  currentUser: User | null;
  users: User[];
  login: (email: string, password: string) => { success: boolean; error?: string };
  register: (data: Omit<User, "id" | "createdAt" | "role">) => { success: boolean; error?: string };
  logout: () => void;
  isAdmin: boolean;
  isAdminView: boolean;
  setAdminView: (v: boolean) => void;
};

const USERS_KEY = "takoyaki-users";
const SESSION_KEY = "takoyaki-session";
const ADMIN_VIEW_KEY = "takoyaki-admin-view";

const DEFAULT_ADMIN: User = {
  id: "admin-001",
  name: "Chef Takeshi",
  email: "admin@takoyaki.com",
  phone: "09679170070",
  password: "admin123",
  role: "admin",
  createdAt: Date.now(),
};

const DEFAULT_USERS: User[] = [DEFAULT_ADMIN];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(USERS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as User[];
        if (!parsed.some((u) => u.role === "admin")) parsed.push(DEFAULT_ADMIN);
        return parsed;
      }
    } catch {
      /* empty */
    }
    return DEFAULT_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAdminView, setAdminView] = useState<boolean>(() => {
    try {
      return localStorage.getItem(ADMIN_VIEW_KEY) === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(ADMIN_VIEW_KEY, String(isAdminView));
  }, [isAdminView]);

  const login = (email: string, password: string) => {
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!user) return { success: false, error: "Invalid email or password" };
    setCurrentUser(user);
    return { success: true };
  };

  const register = (data: Omit<User, "id" | "createdAt" | "role">) => {
    if (users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
      return { success: false, error: "Email already registered" };
    }
    const newUser: User = {
      ...data,
      id: `user-${Date.now()}`,
      role: "customer",
      createdAt: Date.now(),
    };
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    setAdminView(false);
  };

  const isAdmin = currentUser?.role === "admin";

  return (
    <AuthContext.Provider
      value={{ currentUser, users, login, register, logout, isAdmin, isAdminView, setAdminView }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
