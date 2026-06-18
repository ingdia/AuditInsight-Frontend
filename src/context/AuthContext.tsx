"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { AuthUser, UserRole } from "@/types/user";
import { MOCK_USERS } from "@/mock/auth.mock";

// ─── Context shape ────────────────────────────────────────────────
interface AuthContextValue {
  user: AuthUser | null;
  role: UserRole | null;
  loading: boolean;
  setMockRole: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  role: null,
  loading: true,
  setMockRole: () => {},
  logout: () => {},
});

// ─── Provider ─────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /*
     * ── REAL AUTH (commented for RBAC UI testing) ──────────────────
     * const token = localStorage.getItem("token");
     * const role  = localStorage.getItem("role") as UserRole | null;
     * if (!token || !role) { setLoading(false); return; }
     *
     * const fetcher = role === "AUDITOR" ? getAuditorProfile : getClientProfile;
     * fetcher()
     *   .then(({ data }) => {
     *     setUser({
     *       id: 0,
     *       email: data.emailAddress,
     *       fullName: `${data.firstName} ${data.lastName}`,
     *       role,
     *       organisationId: localStorage.getItem("organisationId") ?? undefined,
     *     });
     *   })
     *   .catch(() => {})
     *   .finally(() => setLoading(false));
     * ──────────────────────────────────────────────────────────────
     */

    // ── MOCK: read role from localStorage (set by dev switcher) ──
    const mockRole =
      (localStorage.getItem("mockRole") as UserRole) ?? "CLIENT";
    setUser(MOCK_USERS[mockRole] ?? MOCK_USERS.CLIENT);
    setLoading(false);
  }, []);

  const setMockRole = (role: UserRole) => {
    localStorage.setItem("mockRole", role);
    setUser(MOCK_USERS[role]);
  };

  const logout = () => {
    localStorage.removeItem("mockRole");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, role: user?.role ?? null, loading, setMockRole, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────
export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
