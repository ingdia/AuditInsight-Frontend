import { UserRole } from "@/types/user";

export interface NavItem {
  label: string;
  path: string;
  icon: string;
}

// Items visible to each role — exactly per the RBAC spec
const MEMBER_NAV: NavItem[] = [
  { label: "Dashboard",    path: "/dashboard",    icon: "📊" },
  { label: "Transactions", path: "/transactions", icon: "💳" },
  { label: "Evidence",     path: "/evidence",     icon: "📁" },
  { label: "Review Queue", path: "/review-queue", icon: "🔔" },
  // No Settings, No Reports (spec: MEMBER excluded from team admin)
];

const CLIENT_NAV: NavItem[] = [
  { label: "Dashboard",    path: "/dashboard",    icon: "📊" },
  { label: "Transactions", path: "/transactions", icon: "💳" },
  { label: "Evidence",     path: "/evidence",     icon: "📁" },
  { label: "Review Queue", path: "/review-queue", icon: "🔔" },
  { label: "Reports",      path: "/reports",      icon: "📈" },
  { label: "Settings",     path: "/settings",     icon: "⚙️" },
];

const AUDITOR_NAV: NavItem[] = [
  { label: "Dashboard",    path: "/dashboard",    icon: "📊" },
  { label: "Transactions", path: "/transactions", icon: "💳" },
  { label: "Evidence",     path: "/evidence",     icon: "📁" },
  { label: "Review Queue", path: "/review-queue", icon: "🔔" },
  { label: "Reports",      path: "/reports",      icon: "📈" },
  // No Settings
];

const ADMIN_NAV: NavItem[] = [
  { label: "Organizations",      path: "/admin/organizations", icon: "🏢" },
  { label: "Auditor Approvals",  path: "/admin/approvals",     icon: "✅" },
];

export const NAV_BY_ROLE: Record<UserRole, NavItem[]> = {
  MEMBER:  MEMBER_NAV,
  CLIENT:  CLIENT_NAV,
  AUDITOR: AUDITOR_NAV,
  ADMIN:   ADMIN_NAV,
};
