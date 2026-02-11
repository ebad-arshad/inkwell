import { jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
const AuthContext = createContext(null);
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          const { data } = await axios.get("/api/auth/me");
          setUser(data);
        } catch (error) {
          console.error("Auth check failed:", error);
          localStorage.removeItem("token");
          delete axios.defaults.headers.common["Authorization"];
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);
  const signup = async (email, password, fullName) => {
    try {
      const { data } = await axios.post("/api/auth/signup", {
        email,
        password,
        fullName
      });
      localStorage.setItem("token", data.token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      setUser(data);
    } catch (error) {
      throw error.response?.data?.message || "Signup failed";
    }
  };
  const login = async (email, password) => {
    try {
      const { data } = await axios.post("/api/auth/login", {
        email,
        password
      });
      localStorage.setItem("token", data.token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      setUser(data);
    } catch (error) {
      throw error.response?.data?.message || "Login failed";
    }
  };
  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };
  return /* @__PURE__ */ jsx(AuthContext.Provider, { value: { user, loading, signup, login, logout, isAuthenticated: !!user }, children: !loading && children });
}
function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
export {
  AuthProvider,
  useAuth
};
