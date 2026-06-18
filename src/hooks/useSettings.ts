"use client";

import { useState, useEffect } from "react";
import { OrganisationMemberResponse } from "@/utils/api";
import { MOCK_MEMBERS } from "@/mock/organisation.mock";
import { useOrganisation } from "./useOrganisation";

/*
 * ── REAL API (commented for RBAC UI testing) ─────────────────────
 * import { getOrganisationMembers, inviteMember, removeMember } from "@/utils/api";
 * ─────────────────────────────────────────────────────────────────
 */

export function useSettings() {
  const { org, loading: orgLoading } = useOrganisation();
  const [members, setMembers] = useState<OrganisationMemberResponse[]>([]);
  const [membersLoading, setMembersLoading] = useState(true);

  useEffect(() => {
    /*
     * ── REAL API ─────────────────────────────────────────────────
     * const orgId = localStorage.getItem("organisationId") ?? "";
     * getOrganisationMembers(orgId)
     *   .then(({ data }) => setMembers(data ?? []))
     *   .catch(() => {})
     *   .finally(() => setMembersLoading(false));
     * ─────────────────────────────────────────────────────────────
     */
    setMembers(MOCK_MEMBERS);
    setMembersLoading(false);
  }, []);

  const inviteMember = (email: string, role: string) => {
    /*
     * ── REAL API ─────────────────────────────────────────────────
     * await inviteMember(orgId, email, role);
     * ─────────────────────────────────────────────────────────────
     */
    console.log("Mock invite sent to:", email, "as", role);
  };

  const removeMember = (userId: number) => {
    /*
     * ── REAL API ─────────────────────────────────────────────────
     * await removeMember(orgId, userId);
     * ─────────────────────────────────────────────────────────────
     */
    setMembers((prev) => prev.filter((m) => m.userId !== userId));
  };

  return { org, orgLoading, members, membersLoading, inviteMember, removeMember };
}
