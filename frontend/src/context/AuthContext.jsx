import { createContext, useContext, useState, useEffect } from "react";
import api from "../lib/api";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(
    () => localStorage.getItem("sms_token") || ""
  );

  const [profile, setProfile] = useState(() => {
    const raw = localStorage.getItem("sms_profile");
    return raw ? JSON.parse(raw) : null;
  });

  // Attach token to axios on login
  useEffect(() => {
    api.setToken(token);
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post("/api/auth/login", { email, password });
    setToken(res.token);
    setProfile({ name: res.name, role: res.role, email: res.email });

    localStorage.setItem("sms_token", res.token);
    localStorage.setItem(
      "sms_profile",
      JSON.stringify({ name: res.name, role: res.role, email: res.email })
    );
  };

  const logout = () => {
    setToken("");
    setProfile(null);
    localStorage.removeItem("sms_token");
    localStorage.removeItem("sms_profile");
  };

  return (
    <AuthContext.Provider value={{ token, profile, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
