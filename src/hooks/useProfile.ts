"use client";

import { useAuth } from "@/context/AuthContext";

/*
 * ── REAL API (commented for RBAC UI testing) ─────────────────────
 * import { getClientProfile, getAuditorProfile } from "@/utils/api";
 * ─────────────────────────────────────────────────────────────────
 */

export function useProfile() {
  const { user, loading } = useAuth();

  const fullName = user?.fullName ?? "";
  const initials = fullName
    .split(" ")
    .map((n) => n[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const role = user?.role ?? "";

  return { profile: user, loading, fullName, initials, role };
}
