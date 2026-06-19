"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { AuthUser, UserRole } from "@/types/user";
import { MOCK_USERS } from "@/mock/auth.mock";
import { MOCK_TENANTS } from "@/mock/admin.mock";

function isUserDeactivated(email: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const suspended: string[] = JSON.parse(localStorage.getItem("suspended_users") ?? "[]");
    return suspended.includes(email.toLowerCase());
  } catch { return false; }
}

interface StoredInvite {
  id: string;
  email: string;
  role: UserRole;
  token: string;
  status: "PENDING" | "ACCEPTED" | "EXPIRED";
  createdAt: string;
  expiresAt: string;
  organisationId?: string;
  organisationName?: string;
  invitedByEmail?: string;
  invitedByRole?: UserRole;
}

interface StoredUser {
  email: string;
  password: string;
  role: UserRole;
  fullName: string;
  organisationId?: string;
  organisationName?: string;
  mustChangePassword: boolean;
}

interface AuthContextValue {
  user: AuthUser | null;
  role: UserRole | null;
  loading: boolean;
  login: (email: string, password: string, inviteToken?: string) => { success: boolean; error?: string; redirectTo?: string };
  logout: () => void;
  completeSignup: () => AuthUser | null;
  completeOnboarding: (orgName: string, orgId: string) => void;
  setMockRole: (role: UserRole) => void;
  completePasswordReset: (newPassword?: string) => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  role: null,
  loading: true,
  login: () => ({ success: false }),
  logout: () => {},
  completeSignup: () => null,
  completeOnboarding: () => {},
  setMockRole: () => {},
  completePasswordReset: () => {},
});

const KEYS = {
  role:    "auth_role",
  email:   "auth_email",
  name:    "auth_name",
  orgId:   "auth_org_id",
  orgName: "auth_org_name",
} as const;

const MUST_CHANGE_PASSWORD_KEY = "auth_must_change_password";
const INVITES_KEY = "mock_invites";
const USERS_KEY = "mock_users";

const DEV_CREDENTIALS: Record<string, { password: string; role: UserRole }> = {
  "ceo@insightai.rw":        { password: "demo1234", role: "CLIENT"  },
  "accountant@insightai.rw": { password: "demo1234", role: "MEMBER"  },
  "auditor@audit.rw":        { password: "demo1234", role: "AUDITOR" },
  "admin@auditinsight.com":  { password: "demo1234", role: "ADMIN"   },
};

function readSession(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const role  = localStorage.getItem(KEYS.role)  as UserRole | null;
  const email = localStorage.getItem(KEYS.email);
  const name  = localStorage.getItem(KEYS.name);
  if (!role || !email) return null;
  const base = MOCK_USERS[role];
  if (!base) return null;
  return {
    ...base,
    email,
    fullName:         name ?? base.fullName,
    organisationId:   localStorage.getItem(KEYS.orgId)   ?? base.organisationId,
    organisationName: localStorage.getItem(KEYS.orgName) ?? base.organisationName,
    mustChangePassword: localStorage.getItem(MUST_CHANGE_PASSWORD_KEY) === "true",
  };
}

function writeSession(user: AuthUser) {
  localStorage.setItem(KEYS.role,  user.role);
  localStorage.setItem(KEYS.email, user.email);
  localStorage.setItem(KEYS.name,  user.fullName);
  if (user.organisationId)   localStorage.setItem(KEYS.orgId,   user.organisationId);
  if (user.organisationName) localStorage.setItem(KEYS.orgName, user.organisationName);
  localStorage.setItem(MUST_CHANGE_PASSWORD_KEY, user.mustChangePassword ? "true" : "false");
  localStorage.setItem("mockRole", user.role);
}

function readStoredInvites() {
  if (typeof window === "undefined") return [] as StoredInvite[];
  const raw = localStorage.getItem(INVITES_KEY);
  if (!raw) return [];
  try { return JSON.parse(raw) as StoredInvite[]; } catch { return []; }
}

function writeStoredInvites(invites: StoredInvite[]) {
  localStorage.setItem(INVITES_KEY, JSON.stringify(invites));
}

function findInviteByToken(token: string) {
  return readStoredInvites().find((invite) => invite.token === token && invite.status === "PENDING");
}

function readStoredUsers() {
  if (typeof window === "undefined") return [] as StoredUser[];
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) return [];
  try { return JSON.parse(raw) as StoredUser[]; } catch { return []; }
}

function writeStoredUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function findStoredUserByEmail(email: string) {
  return readStoredUsers().find((user) => user.email.toLowerCase() === email.toLowerCase());
}

function saveStoredUser(user: StoredUser) {
  const existing = readStoredUsers();
  const normalizedEmail = user.email.trim().toLowerCase();
  const filtered = existing.filter((item) => item.email.toLowerCase() !== normalizedEmail);
  writeStoredUsers([...filtered, { ...user, email: normalizedEmail }]);
}

function clearSignupProgress() {
  localStorage.removeItem("signup_name");
  localStorage.removeItem("signup_email");
  localStorage.removeItem("signup_password");
  localStorage.removeItem("signup_role");
  localStorage.removeItem("signup_otp_meta");
  localStorage.removeItem("verified_email");
  localStorage.removeItem("otp_verified");
}

function clearSession() {
  Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
  localStorage.removeItem(MUST_CHANGE_PASSWORD_KEY);
  localStorage.removeItem("mockRole");
  localStorage.removeItem("onboarding_complete");
  localStorage.removeItem("onboarding_plan");
  localStorage.removeItem("onboarding_org");
  clearSignupProgress();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(readSession());
    setLoading(false);
  }, []);

  const login = (email: string, password: string, inviteToken?: string) => {
    const key = email.trim().toLowerCase();
    const invite = inviteToken ? findInviteByToken(inviteToken) : undefined;

    // Story 1.3 — Deactivated user check (Admin toggled Inactive)
    if (isUserDeactivated(key)) {
      return { success: false, error: "Your account has been deactivated. Please contact your organisation admin." };
    }

    // Story 4.2 — Blocked tenant check
    const userOrgId =
      findStoredUserByEmail(key)?.organisationId ??
      (typeof window !== "undefined" ? localStorage.getItem("auth_org_id") : null);
    if (userOrgId) {
      const tenant = MOCK_TENANTS.find((t) => t.id === userOrgId);
      if (tenant?.isBlocked) {
        return { success: false, error: "SUBSCRIPTION_SUSPENDED" };
      }
    }

    if (invite) {
      if (!password.trim()) {
        return { success: false, error: "Please provide a password to accept your invite." };
      }
      if (invite.email.toLowerCase() !== key) {
        return { success: false, error: "Invite token does not match this email." };
      }
      const expires = new Date(invite.expiresAt);
      if (expires.getTime() < Date.now()) {
        return { success: false, error: "This invite link has expired. Please request a new invite." };
      }

      const userRole = invite.role;
      const base = MOCK_USERS[userRole] ?? {
        id: Date.now(),
        email: key,
        fullName: key.split("@")[0],
        role: userRole,
        organisationId: invite.organisationId,
        organisationName: invite.organisationName,
        mustChangePassword: true,
      };

      const newUser: AuthUser = {
        ...base,
        email: key,
        fullName: base.fullName || key.split("@")[0],
        organisationId: invite.organisationId,
        organisationName: invite.organisationName,
        mustChangePassword: true,
      };

      saveStoredUser({
        email: newUser.email,
        password,
        role: newUser.role,
        fullName: newUser.fullName,
        organisationId: newUser.organisationId,
        organisationName: newUser.organisationName,
        mustChangePassword: true,
      });
      writeSession(newUser);
      setUser(newUser);
      writeStoredInvites(readStoredInvites().map((item) => item.token === inviteToken ? { ...item, status: "ACCEPTED" } : item));

      return {
        success: true,
        redirectTo: "/reset-password",
      };
    }

    const storedUser = findStoredUserByEmail(key);
    if (storedUser) {
      if (storedUser.password !== password) {
        return { success: false, error: "Invalid email or password." };
      }
      const loggedInUser: AuthUser = {
        id: MOCK_USERS[storedUser.role]?.id ?? Date.now(),
        email: storedUser.email,
        fullName: storedUser.fullName,
        role: storedUser.role,
        organisationId: storedUser.organisationId,
        organisationName: storedUser.organisationName,
        mustChangePassword: storedUser.mustChangePassword,
      };
      writeSession(loggedInUser);
      setUser(loggedInUser);
      return { success: true, redirectTo: loggedInUser.role === "ADMIN" ? "/admin/organizations" : "/dashboard" };
    }

    const pendingPassword = localStorage.getItem("signup_password");
    const pendingEmail = localStorage.getItem("signup_email")?.toLowerCase();
    const pendingRole = localStorage.getItem("signup_role") as UserRole | null;
    const pendingOtpVerified = localStorage.getItem("otp_verified") === "true";

    if (pendingEmail === key && pendingPassword === password && pendingRole) {
      if (pendingRole === "CLIENT" && !pendingOtpVerified) {
        return { success: false, error: "Please verify your email before signing in." };
      }
      const base = MOCK_USERS[pendingRole];
      const newUser: AuthUser = {
        ...base,
        email: key,
        fullName: localStorage.getItem("signup_name") ?? base.fullName,
        organisationName: localStorage.getItem(KEYS.orgName) ?? base.organisationName,
        mustChangePassword: false,
      };
      saveStoredUser({
        email: key,
        password,
        role: pendingRole,
        fullName: newUser.fullName,
        organisationId: newUser.organisationId,
        organisationName: newUser.organisationName,
        mustChangePassword: false,
      });
      clearSignupProgress();
      writeSession(newUser);
      setUser(newUser);
      return { success: true, redirectTo: pendingRole === "ADMIN" ? "/admin/organizations" : "/dashboard" };
    }

    const creds = DEV_CREDENTIALS[key];
    if (!creds || creds.password !== password) {
      return { success: false, error: "Invalid email or password." };
    }
    const base = MOCK_USERS[creds.role];

    const signupName = localStorage.getItem("signup_name");
    const orgName = localStorage.getItem(KEYS.orgName) ?? base.organisationName;

    const newUser: AuthUser = {
      ...base,
      email: key,
      fullName: signupName ?? base.fullName,
      organisationName: orgName,
      mustChangePassword: false,
    };

    writeSession(newUser);
    setUser(newUser);

    return {
      success: true,
      redirectTo: creds.role === "ADMIN" ? "/admin/organizations" : "/dashboard",
    };
  };

  const completeSignup = () => {
    const email = localStorage.getItem("signup_email");
    const role = localStorage.getItem("signup_role") as UserRole | null;
    const name = localStorage.getItem("signup_name");
    const verifiedEmail = localStorage.getItem("verified_email");
    const otpVerified = localStorage.getItem("otp_verified") === "true";
    const password = localStorage.getItem("signup_password");

    if (!email || !role || !password) return null;
    if (role === "CLIENT" && (!otpVerified || verifiedEmail !== email)) return null;

    const stored = findStoredUserByEmail(email);
    const base = MOCK_USERS[role];

    const user: AuthUser = {
      id: stored?.email === email ? MOCK_USERS[role]?.id ?? Date.now() : Date.now(),
      email,
      fullName: name ?? base.fullName,
      role,
      organisationId: localStorage.getItem(KEYS.orgId) ?? base.organisationId,
      organisationName: localStorage.getItem(KEYS.orgName) ?? base.organisationName,
      mustChangePassword: stored?.mustChangePassword ?? false,
    };

    saveStoredUser({
      email,
      password,
      role,
      fullName: user.fullName,
      organisationId: user.organisationId,
      organisationName: user.organisationName,
      mustChangePassword: user.mustChangePassword ?? false,
    });

    clearSignupProgress();
    writeSession(user);
    setUser(user);
    return user;
  };

  const completeOnboarding = (orgName: string, orgId: string) => {
    const currentUser = user ?? completeSignup();
    localStorage.setItem(KEYS.orgName, orgName);
    localStorage.setItem(KEYS.orgId,   orgId);
    localStorage.setItem("onboarding_complete", "true");
    if (currentUser) {
      const updatedUser = { ...currentUser, organisationName: orgName, organisationId: orgId };
      writeSession(updatedUser);
      setUser(updatedUser);
      saveStoredUser({
        email: updatedUser.email,
        password: findStoredUserByEmail(updatedUser.email)?.password ?? localStorage.getItem("signup_password") ?? "",
        role: updatedUser.role,
        fullName: updatedUser.fullName,
        organisationId: updatedUser.organisationId,
        organisationName: updatedUser.organisationName,
        mustChangePassword: updatedUser.mustChangePassword ? true : false,
      });
    }
  };

  const completePasswordReset = (newPassword?: string) => {
    localStorage.setItem(MUST_CHANGE_PASSWORD_KEY, "false");
    setUser((prev) => {
      const next = prev ? { ...prev, mustChangePassword: false } : prev;
      if (next) {
        const stored = findStoredUserByEmail(next.email);
        if (stored) {
          saveStoredUser({
            ...stored,
            password: newPassword ?? stored.password,
            mustChangePassword: false,
          });
        }
      }
      return next;
    });
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      import("@/security/audit-logger").then(({ appendAuditLog }) => {
        const role  = localStorage.getItem("auth_role")  ?? "CLIENT";
        const email = localStorage.getItem("auth_email") ?? "";
        appendAuditLog({ userId: 0, userEmail: email, userRole: role, action: "USER_LOGOUT", targetResourceId: email, detail: "User logged out" });
      });
    }
    clearSession();
    setUser(null);
  };

  const setMockRole = (role: UserRole) => {
    const base = MOCK_USERS[role];
    if (!base) return;
    writeSession(base);
    setUser(base);
  };

  return (
    <AuthContext.Provider value={{ user, role: user?.role ?? null, loading, login, logout, completeSignup, completeOnboarding, setMockRole, completePasswordReset }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
