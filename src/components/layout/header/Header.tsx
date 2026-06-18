"use client";

import { LayoutDashboard, ArrowLeftRight, FileCheck, ClipboardList, BarChart3, Settings, LogOut, Building2, UserCheck } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { headerStyles } from "./header.styles";
import { useProfile } from "@/hooks/useProfile";
import { usePermissions } from "@/security/access-control";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types/user";

export interface HeaderProps {
  title: string;
}

const ROLE_COLOR: Record<UserRole, string> = {
  CLIENT:  "#60a5fa",
  MEMBER:  "#4ade80",
  AUDITOR: "#fbbf24",
  ADMIN:   "#c084fc",
};

const ROLE_LABEL: Record<UserRole, string> = {
  CLIENT:  "Admin (CEO)",
  MEMBER:  "Accountant",
  AUDITOR: "Auditor",
  ADMIN:   "Super Admin",
};

// ── Standard nav — shown for CLIENT, MEMBER, AUDITOR ──
const STANDARD_NAV = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Transactions", icon: ArrowLeftRight, path: "/transactions" },
  { label: "Evidence", icon: FileCheck, path: "/evidence" },
  { label: "Review Queue", icon: ClipboardList, path: "/review-queue" },
  { label: "Reports", icon: BarChart3, path: "/reports" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

// ── Super Admin nav — completely separate ──
const ADMIN_NAV = [
  { label: "Organizations", icon: Building2, path: "/admin/organizations" },
  { label: "Auditor Approvals", icon: UserCheck, path: "/admin/approvals" },
];

export default function Header({ title }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { fullName, initials, role, loading } = useProfile();
  const { canManageOrganisation, canViewAdminPanel } = usePermissions();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace("/log-in");
  };

  const navItems = canViewAdminPanel
    ? ADMIN_NAV
    : STANDARD_NAV.filter((item) => {
        if (item.path === "/settings" && !canManageOrganisation) return false;
        return true;
      });

  const currentRole = (role || "CLIENT") as UserRole;
  const ringColor = ROLE_COLOR[currentRole];
  const displayName   = loading ? "…" : fullName || "User";
  const displayInitials = loading ? "…" : initials || "?";
  const displayRole   = ROLE_LABEL[currentRole];

  return (
    <header style={headerStyles.container}>
      {/* LEFT */}
      <div style={headerStyles.left}>
        <div style={headerStyles.logo} onClick={() => router.push(canViewAdminPanel ? "/admin/organizations" : "/dashboard")}>
          <div style={headerStyles.logoMark} />
          <div style={headerStyles.logoText}>
            <span style={headerStyles.title}>{title}</span>
            <span style={headerStyles.subtitle}>Audit Intelligence</span>
          </div>
        </div>

        <nav style={headerStyles.nav}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <div
                key={item.label}
                onClick={() => router.push(item.path)}
                style={{ ...headerStyles.navItem, ...(isActive ? headerStyles.navItemActive : {}) }}
                onMouseEnter={(e) => { if (!isActive) Object.assign(e.currentTarget.style, headerStyles.navItemHover); }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "rgba(255,255,255,0.78)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }
                }}
              >
                <Icon size={16} />
                {item.label}
              </div>
            );
          })}
        </nav>
      </div>

      {/* RIGHT */}
      <div style={headerStyles.right}>
        {/* Role + name block */}
        <div style={headerStyles.welcomeBlock}>
          <span style={{ ...headerStyles.welcomeLabel, color: ringColor }}>{displayRole}</span>
          <span style={headerStyles.welcome}>{displayName}</span>
        </div>

        {/* Role-ringed avatar */}
        <div style={{ ...headerStyles.avatar, boxShadow: `0 0 0 2.5px ${ringColor}, 0 6px 18px rgba(0,0,0,0.16)` }}>
          {displayInitials}
        </div>

        <button onClick={handleLogout} title="Sign out" style={logoutBtn}>
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}

const logoutBtn: React.CSSProperties = {
  background: "rgba(255,255,255,0.10)",
  border: "1px solid rgba(255,255,255,0.18)",
  borderRadius: 8,
  color: "rgba(255,255,255,0.80)",
  cursor: "pointer",
  padding: "7px 9px",
  display: "flex",
  alignItems: "center",
  marginLeft: 8,
};
