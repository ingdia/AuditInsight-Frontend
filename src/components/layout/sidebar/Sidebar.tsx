"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { NAV_BY_ROLE } from "./sidebar.menu";
import { sidebarStyles } from "./sidebar.styles";
import { UserRole } from "@/types/user";

const ROLE_LABEL: Record<UserRole, string> = {
  CLIENT:  "Admin (CEO)",
  MEMBER:  "Accountant",
  AUDITOR: "Auditor",
  ADMIN:   "Super Admin",
};

const ROLE_COLOR: Record<UserRole, string> = {
  CLIENT:  "#1e3a8a",
  MEMBER:  "#15803d",
  AUDITOR: "#b45309",
  ADMIN:   "#7c3aed",
};

const ROLE_ICON: Record<UserRole, string> = {
  CLIENT:  "🏢",
  MEMBER:  "📒",
  AUDITOR: "🔍",
  ADMIN:   "🌐",
};

export default function Sidebar() {
  const { user, role } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const currentRole = (role ?? "CLIENT") as UserRole;
  const navItems = NAV_BY_ROLE[currentRole] ?? [];
  const accent = ROLE_COLOR[currentRole];

  const initials = (user?.fullName ?? "?")
    .split(" ")
    .map((n) => n[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <aside style={sidebarStyles.container}>

      {/* ── Profile card ── */}
      <div style={{ ...profileCard, borderColor: accent + "33" }}>
        {/* Avatar */}
        <div style={{ ...avatar, background: accent, boxShadow: `0 0 0 3px ${accent}33` }}>
          {initials}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={profileName}>{user?.fullName ?? "User"}</p>
          <p style={profileEmail}>{user?.email ?? ""}</p>
        </div>

        {/* Role badge */}
        <div style={{ ...rolePill, background: accent + "18", color: accent, borderColor: accent + "44" }}>
          <span>{ROLE_ICON[currentRole]}</span>
          <span>{ROLE_LABEL[currentRole]}</span>
        </div>
      </div>

      <div style={divider} />

      {/* ── Nav items ── */}
      <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <div
              key={item.path}
              onClick={() => router.push(item.path)}
              style={{
                ...sidebarStyles.item,
                ...(isActive ? { ...sidebarStyles.itemActive, background: accent, color: "#fff" } : {}),
              }}
              onMouseEnter={(e) => {
                if (!isActive) Object.assign(e.currentTarget.style, sidebarStyles.itemHover);
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "";
                  e.currentTarget.style.transform = "";
                }
              }}
            >
              <span style={{ fontSize: 16, lineHeight: 1 }}>{item.icon}</span>
              <span style={{ fontSize: 14, fontWeight: isActive ? 600 : 400 }}>{item.label}</span>
              {isActive && <span style={{ ...activeDot, background: accent }} />}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

const profileCard: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 8,
  padding: "16px 12px",
  borderRadius: 14,
  border: "1.5px solid",
  background: "rgba(255,255,255,0.7)",
  marginBottom: 4,
  textAlign: "center",
};

const avatar: React.CSSProperties = {
  width: 52,
  height: 52,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
  fontSize: 18,
  fontWeight: 800,
  flexShrink: 0,
};

const profileName: React.CSSProperties = {
  margin: 0,
  fontSize: 14,
  fontWeight: 700,
  color: "#0f172a",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const profileEmail: React.CSSProperties = {
  margin: "2px 0 0",
  fontSize: 11.5,
  color: "#64748b",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const rolePill: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 5,
  padding: "4px 10px",
  borderRadius: 999,
  border: "1px solid",
  fontSize: 11.5,
  fontWeight: 700,
  letterSpacing: "0.03em",
  marginTop: 2,
};

const divider: React.CSSProperties = {
  height: 1,
  background: "rgba(0,0,0,0.07)",
  margin: "12px 0",
};

const activeDot: React.CSSProperties = {
  width: 6,
  height: 6,
  borderRadius: "50%",
  marginLeft: "auto",
  opacity: 0.7,
};
