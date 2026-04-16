import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { DEMO_USERS } from "./mock-data";
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("demo_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse stored user", e);
      }
    }
    setLoading(false);
  }, []);
  const login = useCallback(async (email, _password) => {
    // Demo: admin@demo.com or user@demo.com, any password
    await new Promise((r) => setTimeout(r, 600));
    // Unique Super Admin Credential
    if (email === "admin@anon.com" && _password === "admin123") {
      const adminUser = DEMO_USERS.find((u) => u.role === "admin");
      localStorage.setItem("demo_token", "super-admin-token");
      localStorage.setItem("demo_user", JSON.stringify(adminUser));
      setUser(adminUser);
      return true;
    }

    const found = DEMO_USERS.find((u) => u.email === email);
    if (found) {
      localStorage.setItem("demo_token", "demo-token-" + found.id);
      localStorage.setItem("demo_user", JSON.stringify(found));
      setUser(found);
      return true;
    }
    return false;
  }, []);
  const register = useCallback(async (name, email, _password) => {
    await new Promise((r) => setTimeout(r, 600));
    const newUser = {
      id: "new-" + Date.now(),
      name,
      email,
      role: "user",
      createdAt: new Date().toISOString().split("T")[0],
    };
    localStorage.setItem("demo_token", "demo-jwt-token-" + newUser.id);
    localStorage.setItem("demo_user", JSON.stringify(newUser));
    setUser(newUser);
    return true;
  }, []);
  const logout = useCallback(() => {
    localStorage.removeItem("demo_token");
    localStorage.removeItem("demo_user");
    setUser(null);
  }, []);
  const becomeReviewer = useCallback(async (applicationData) => {
    if (!user) return false;
    await new Promise((r) => setTimeout(r, 1000));
    
    // In a real app, this would be a POST to /applications
    const applications = JSON.parse(localStorage.getItem("demo_applications") || "[]");
    const newApp = {
      id: "app-" + Date.now(),
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      status: "pending",
      submittedAt: new Date().toISOString(),
      ...applicationData
    };
    
    localStorage.setItem("demo_applications", JSON.stringify([...applications, newApp]));
    return true;
  }, [user]);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, loading, login, register, logout, becomeReviewer }}
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
