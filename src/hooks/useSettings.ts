"use client";

import { useState, useEffect } from "react";
import { OrganisationMemberResponse } from "@/utils/api";
import { MOCK_MEMBERS } from "@/mock/organisation.mock";
import { useOrganisation } from "./useOrganisation";
import { notifyInviteSent } from "@/hooks/useNotifications";

/*
 * ── REAL API (commented for RBAC UI testing) ─────────────────────
 * import { getOrganisationMembers, inviteMember, removeMember } from "@/utils/api";
 * ─────────────────────────────────────────────────────────────────
 */

interface StoredInvite {
  id: string;
  email: string;
  role: string;
  token: string;
  status: "PENDING" | "ACCEPTED" | "EXPIRED";
  createdAt: string;
  expiresAt: string;
  organisationId?: string;
  organisationName?: string;
  invitedByEmail?: string;
  invitedByRole?: string;
  message?: string;
}

const INVITES_KEY = "mock_invites";

function readStoredInvites(): StoredInvite[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(INVITES_KEY);
  if (!raw) return [];
  try { return JSON.parse(raw) as StoredInvite[]; } catch { return []; }
}

function writeStoredInvites(invites: StoredInvite[]) {
  localStorage.setItem(INVITES_KEY, JSON.stringify(invites));
}

function mapInvitesToMembers(invites: StoredInvite[]) {
  return invites
    .filter((invite) => invite.status === "PENDING")
    .map((invite, index) => ({
      userId: -1 - index,
      firstName: invite.email.split("@")[0],
      lastName: "",
      emailAddress: invite.email,
      role: invite.role as any,
      status: "PENDING" as const,
      joinedAt: invite.createdAt,
    }));
}

export function useSettings() {
  const { org, loading: orgLoading } = useOrganisation();
  const [members, setMembers] = useState<OrganisationMemberResponse[]>([]);
  const [membersLoading, setMembersLoading] = useState(true);

  const loadMembers = () => {
    const invites = readStoredInvites();
    setMembers([...MOCK_MEMBERS, ...mapInvitesToMembers(invites)]);
    setMembersLoading(false);
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const inviteMember = (email: string, role: string, message?: string) => {
    const existing = readStoredInvites().find((invite) => invite.email.toLowerCase() === email.toLowerCase() && invite.status === "PENDING");
    if (existing) {
      console.log("Mock invite already pending for:", email);
      return;
    }

    const token = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    const createdAt = new Date().toISOString();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    const invite: StoredInvite = {
      id: token,
      email,
      role,
      token,
      status: "PENDING",
      createdAt,
      expiresAt,
      organisationId: org?.id,
      organisationName: org?.name,
      invitedByEmail: localStorage.getItem("auth_email") ?? undefined,
      invitedByRole: localStorage.getItem("auth_role") ?? undefined,
      message,
    };
    writeStoredInvites([...readStoredInvites(), invite]);
    loadMembers();
    const inviteLink = `${window.location.origin}/log-in?inviteToken=${encodeURIComponent(token)}`;
    console.info("Mock invite created:", inviteLink);
    // Send mock email notification to invitee
    notifyInviteSent(email, org?.name ?? "Your Organisation", localStorage.getItem("auth_name") ?? "Admin", role);
    alert(`📧 Invite link created for ${email}:\n\n${inviteLink}\n\n(Copy and open in the same browser to test the invite flow)`);
    // Also log the action
    import("@/security/audit-logger").then(({ appendAuditLog }) => {
      appendAuditLog({
        userId: 1,
        userEmail: localStorage.getItem("auth_email") ?? "",
        userRole: localStorage.getItem("auth_role") ?? "CLIENT",
        action: "MEMBER_INVITED",
        targetResourceId: email,
        detail: `Invited ${email} as ${role}`,
      });
    });
  };

  const removeMember = (userId: number) => {
    const pendingInvites = readStoredInvites();
    const member = members.find((m) => m.userId === userId);
    if (member?.status === "PENDING") {
      const filtered = pendingInvites.filter((invite) => invite.email.toLowerCase() !== (member.emailAddress ?? "").toLowerCase());
      writeStoredInvites(filtered);
    }
    setMembers((prev) => prev.filter((m) => m.userId !== userId));
  };

  return { org, orgLoading, members, membersLoading, inviteMember, removeMember };
}
