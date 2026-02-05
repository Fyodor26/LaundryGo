import { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  user: any;
  loading: boolean;
  login: (userData?: any) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const login = (userData?: any) => {
    if (userData) {
      setUser(userData);
    } else {
      // fallback: refetch user
      fetch("http://localhost:5000/api/me", {
        credentials: "include",
      })
        .then(res => res.ok ? res.json() : null)
        .then(data => setUser(data?.user || null));
    }
  };

  const logout = async () => {
    await fetch("http://localhost:5000/user/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  };

  // ✅ Check login from cookie on app load
  useEffect(() => {
    fetch("http://localhost:5000/api/me", {
      credentials: "include",
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.user) {
          setUser(data.user);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
