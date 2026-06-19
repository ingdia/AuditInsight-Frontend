import { AuthUser } from "@/types/user";

export const MOCK_USERS: Record<string, AuthUser> = {
  CLIENT: {
    id: 1,
    email: "ceo@insightai.rw",
    fullName: "Louise Nzeyimana",
    role: "CLIENT",
    organisationId: "org-001",
    organisationName: "InsightAI Rwanda Ltd",
    mustChangePassword: false,
  },
  MEMBER: {
    id: 2,
    email: "accountant@insightai.rw",
    fullName: "Eric Bizimana",
    role: "MEMBER",
    organisationId: "org-001",
    organisationName: "InsightAI Rwanda Ltd",
    mustChangePassword: false,
  },
  AUDITOR: {
    id: 3,
    email: "auditor@audit.rw",
    fullName: "Grace Uwimana",
    role: "AUDITOR",
    organisationId: "org-001",
    organisationName: "InsightAI Rwanda Ltd",
    mustChangePassword: false,
  },
  ADMIN: {
    id: 4,
    email: "admin@auditinsight.com",
    fullName: "Super Admin",
    role: "ADMIN",
    mustChangePassword: false,
  },
};
