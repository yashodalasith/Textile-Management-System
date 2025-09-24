import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "./src/services/api";
import { setAccessToken as storeToken, clearAccessToken as clearToken } from "./src/tokenStore";

const AuthCtx = createContext(null);
export const useAuth = () => {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
};

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // keep store and state in sync
  const setToken = (t) => {
    setAccessToken(t);
    t ? storeToken(t) : clearToken();
  };

  // try restore session via refresh cookie
 useEffect(() => {
    (async () => {
      try {
        const { data } = await api.post("/login/refresh", {}); // cookie flows automatically
        if (data?.accessToken) setToken(data.accessToken);
      } catch {
        setToken(null);
        setUser(null);
      } finally {
        setIsAuthReady(true); // ✅ signal route guards that we're done
      }
    })();
  }, []);

 const login = async (email, password) => {
    const { data } = await api.post("/login", { email, password });
    setToken(data.accessToken);
    setUser(data.user); // minimal profile from backend
    return data.user;
  };
 const logout = async () => {
    try {
      await api.post("/login/logout"); // ✅ leading slash
    } catch {}
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({ accessToken, user, isAuthReady, login, logout, setAccessToken: setToken }),
    [accessToken, user, isAuthReady]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
