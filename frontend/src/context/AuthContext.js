import { createContext, useState, useEffect } from "react";
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/check-auth", {
          credentials: "include",
        });

        if (!res.ok) {
          setIsAuthenticated(false);
          setUser(null);
        }

        const data = await res.json();

        setUser(data.user);
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, user, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}
