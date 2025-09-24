// api.js
import { AuthProvider, useAuth } from "./AuthContext.jsx";

export function useApi() {
  const { accessToken, setAccessToken, logout } = useAuth();

  const request = async (url, options = {}) => {
    const headers = new Headers(options.headers || {});
    if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

    let res = await fetch(url, { ...options, headers, credentials: "include" });

    // If access token expired, try refresh once
    if (res.status === 401) {
      const r = await fetch("/refresh", { method: "POST", credentials: "include" });
      if (r.ok) {
        const { accessToken: newAT } = await r.json();
        setAccessToken(newAT);
        const retryHeaders = new Headers(options.headers || {});
        retryHeaders.set("Authorization", `Bearer ${newAT}`);
        res = await fetch(url, { ...options, headers: retryHeaders, credentials: "include" });
      } else {
        await logout();
        throw new Error("Session expired");
      }
    }

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `HTTP ${res.status}`);
    }
    return res.json();
  };

  return { request };
}
