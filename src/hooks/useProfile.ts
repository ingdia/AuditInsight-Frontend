"use client";

import { useAuth } from "@/context/AuthContext";

export function useProfile() {
  const { user, loading } = useAuth();

  const fullName = user?.fullName ?? "";
  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const role             = user?.role             ?? "";
  const organisationName = user?.organisationName ?? "";
  const organisationId   = user?.organisationId   ?? "";

  return { profile: user, loading, fullName, initials, role, organisationName, organisationId };
}
