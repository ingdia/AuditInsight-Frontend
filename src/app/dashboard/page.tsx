"use client";

import { useAuth } from "@/context/AuthContext";
import { usePermissions } from "@/security/access-control";
import { useRouter } from "next/navigation";
import { useDashboardData } from "@/hooks/useDashboardData";
import { UserRole } from "@/types/user";
import DashboardStats from "@/components/dashboard/DashboardStats";
import EvidenceChart from "@/components/dashboard/EvidenceChart";
import HighRiskTransactions from "@/components/dashboard/HighRiskTransactions";
import ComplianceAlerts from "@/components/dashboard/ComplianceAlerts";
import QuickActions from "@/components/dashboard/QuickActions";
import { dashboardLayoutStyles } from "./DashboardPage.styles";

/* ── shared identity card shown at the top of every dashboard ── */
function IdentityCard({ color, icon, label, name, email, orgId, capabilities }: {
  color: string; icon: string; label: string;
  name: string; email: string; orgId?: string;
  capabilities: string[];
}) {
  const initials = name.split(" ").map((n) => n[0] ?? "").join("").toUpperCase().slice(0, 2);
  return (
    <div style={{ ...card, borderColor: color + "33" }}>
      <div style={cardLeft}>
        <div style={{ ...avatarBox, background: color, boxShadow: `0 0 0 4px ${color}22` }}>{initials}</div>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#0f172a" }}>{name}</h2>
            <span style={{ ...pill, background: color + "18", color, borderColor: color + "44" }}>{icon} {label}</span>
          </div>
          <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>{email}</p>
          {orgId && <p style={{ margin: "3px 0 0", fontSize: 11.5, color: "#94a3b8" }}>Org · {orgId}</p>}
        </div>
      </div>
      <div style={{ flexShrink: 0, maxWidth: 420 }}>
        <p style={{ margin: "0 0 8px", fontSize: 10.5, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em" }}>Access level</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {capabilities.map((c) => (
            <span key={c} style={{ ...capTag, background: color + "12", color, borderColor: color + "33" }}>✓ {c}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── stat mini-card ── */
function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub: string; color: string }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 4 }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</span>
      <span style={{ fontSize: 28, fontWeight: 800, color }}>{value}</span>
      <span style={{ fontSize: 12, color: "#64748b" }}>{sub}</span>
    </div>
  );
}

/* ── action button ── */
function ActionBtn({ label, icon, onClick, color }: { label: string; icon: string; onClick: () => void; color: string }) {
  return (
    <button onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: 10, border: `1.5px solid ${color}33`, background: color + "0d", cursor: "pointer", fontSize: 13.5, fontWeight: 600, color, fontFamily: "inherit", width: "100%", textAlign: "left" }}>
      <span style={{ fontSize: 18 }}>{icon}</span> {label}
    </button>
  );
}

/* ════════════════════════════════════════
   1. CLIENT (Admin / CEO) dashboard
   ════════════════════════════════════════ */
function ClientDashboard({ transactions, evidence, user }: { transactions: any[]; evidence: any[]; user: any }) {
  const router = useRouter();
  const highRisk = transactions.filter((t) => (t.riskScore ?? 0) >= 80 || t.evidenceStatus === "MISSING").length;
  const coverage = transactions.length > 0 ? Math.round((evidence.length / transactions.length) * 100) : 0;

  return (
    <div style={dashboardLayoutStyles.page}>
      <IdentityCard color="#1e3a8a" icon="🏢" label="Admin (CEO)" name={user?.fullName ?? ""} email={user?.email ?? ""} orgId={user?.organisationId}
        capabilities={["View transactions & evidence", "Manage team members", "Invite & suspend users", "Edit organisation settings"]} />

      <div style={sectionTitle("#1e3a8a")}>📊 Organisation Overview</div>
      <div style={statsGrid}>
        <StatCard label="Total Transactions" value={transactions.length} sub="all time" color="#1e3a8a" />
        <StatCard label="High Risk" value={highRisk} sub="need review" color="#b91c1c" />
        <StatCard label="Evidence Coverage" value={`${coverage}%`} sub="auto-calculated" color="#15803d" />
        <StatCard label="Evidence Files" value={evidence.length} sub="uploaded" color="#0369a1" />
      </div>

      <div style={dashboardLayoutStyles.mainGrid}>
        <HighRiskTransactions transactions={transactions} />
        <EvidenceChart transactions={transactions} evidence={evidence} />
      </div>

      <div style={twoCol}>
        <ComplianceAlerts transactions={transactions} />
        <div style={actionsBox}>
          <p style={actionsTitle}>Admin Actions</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <ActionBtn icon="👥" label="Manage Team Members" color="#1e3a8a" onClick={() => router.push("/settings")} />
            <ActionBtn icon="📧" label="Invite New User" color="#1e3a8a" onClick={() => router.push("/settings")} />
            <ActionBtn icon="⚙️" label="Organisation Settings" color="#1e3a8a" onClick={() => router.push("/settings")} />
            <ActionBtn icon="📈" label="View Reports" color="#1e3a8a" onClick={() => router.push("/reports")} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   2. MEMBER (Accountant) dashboard
   ════════════════════════════════════════ */
function MemberDashboard({ transactions, evidence, user }: { transactions: any[]; evidence: any[]; user: any }) {
  const router = useRouter();
  const pending = transactions.filter((t) => t.status === "Pending" || t.status === "Under Review").length;
  const missing = evidence.filter((e) => e.status === "Missing").length;
  const verified = evidence.filter((e) => e.status === "Verified").length;

  return (
    <div style={dashboardLayoutStyles.page}>
      <IdentityCard color="#15803d" icon="📒" label="Accountant" name={user?.fullName ?? ""} email={user?.email ?? ""} orgId={user?.organisationId}
        capabilities={["Add / edit / delete transactions", "Upload & manage evidence", "Resolve flagged issues", "View reports"]} />

      <div style={sectionTitle("#15803d")}>💼 Accountant Workspace</div>
      <div style={statsGrid}>
        <StatCard label="Total Transactions" value={transactions.length} sub="in ledger" color="#15803d" />
        <StatCard label="Pending Review" value={pending} sub="need attention" color="#b45309" />
        <StatCard label="Missing Evidence" value={missing} sub="to be uploaded" color="#b91c1c" />
        <StatCard label="Verified Evidence" value={verified} sub="complete" color="#15803d" />
      </div>

      <div style={twoCol}>
        <div style={actionsBox}>
          <p style={actionsTitle}>Quick Actions</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <ActionBtn icon="➕" label="Add Transaction" color="#15803d" onClick={() => router.push("/transactions")} />
            <ActionBtn icon="📁" label="Upload Evidence" color="#15803d" onClick={() => router.push("/evidence")} />
            <ActionBtn icon="🔔" label="Review Flagged Items" color="#15803d" onClick={() => router.push("/review-queue")} />
            <ActionBtn icon="📊" label="View Reports" color="#15803d" onClick={() => router.push("/reports")} />
          </div>
        </div>
        <ComplianceAlerts transactions={transactions} />
      </div>

      <div style={dashboardLayoutStyles.mainGrid}>
        <HighRiskTransactions transactions={transactions} />
        <EvidenceChart transactions={transactions} evidence={evidence} />
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   3. AUDITOR dashboard
   ════════════════════════════════════════ */
function AuditorDashboard({ transactions, evidence, user }: { transactions: any[]; evidence: any[]; user: any }) {
  const router = useRouter();
  const highRisk = transactions.filter((t) => (t.riskScore ?? 0) >= 80).length;
  const missingEvidence = transactions.filter((t) => t.evidenceStatus === "MISSING").length;
  const coverage = transactions.length > 0 ? Math.round((evidence.length / transactions.length) * 100) : 0;

  return (
    <div style={dashboardLayoutStyles.page}>
      <IdentityCard color="#b45309" icon="🔍" label="Auditor" name={user?.fullName ?? ""} email={user?.email ?? ""} orgId={user?.organisationId}
        capabilities={["Read-only transactions & evidence", "Flag compliance issues", "Set issue severity & type", "Generate & export reports"]} />

      <div style={sectionTitle("#b45309")}>🔍 Audit Intelligence Centre</div>
      <div style={statsGrid}>
        <StatCard label="Transactions" value={transactions.length} sub="under review" color="#b45309" />
        <StatCard label="High Risk" value={highRisk} sub="score ≥ 80" color="#b91c1c" />
        <StatCard label="Missing Evidence" value={missingEvidence} sub="unlinked" color="#92400e" />
        <StatCard label="Evidence Coverage" value={`${coverage}%`} sub="linked" color="#15803d" />
      </div>

      <div style={twoCol}>
        <div style={actionsBox}>
          <p style={actionsTitle}>Audit Actions</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <ActionBtn icon="🚩" label="Flag an Issue" color="#b45309" onClick={() => router.push("/review-queue")} />
            <ActionBtn icon="🔍" label="Inspect Transactions" color="#b45309" onClick={() => router.push("/transactions")} />
            <ActionBtn icon="📁" label="Review Evidence Trail" color="#b45309" onClick={() => router.push("/evidence")} />
            <ActionBtn icon="📈" label="Generate Compliance Report" color="#b45309" onClick={() => router.push("/reports")} />
          </div>
        </div>
        <ComplianceAlerts transactions={transactions} />
      </div>

      <div style={dashboardLayoutStyles.mainGrid}>
        <HighRiskTransactions transactions={transactions} />
        <EvidenceChart transactions={transactions} evidence={evidence} />
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   Root page — picks which dashboard to render
   ════════════════════════════════════════ */
export default function DashboardPage() {
  const { user, role } = useAuth();
  const { canViewAdminPanel } = usePermissions();
  const { transactions, evidence, loading } = useDashboardData();
  const router = useRouter();

  if (canViewAdminPanel) {
    router.replace("/admin/organizations");
    return null;
  }

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <p style={{ color: "#64748b", fontSize: 14 }}>Loading dashboard…</p>
      </div>
    );
  }

  if (role === "MEMBER")  return <MemberDashboard  transactions={transactions} evidence={evidence} user={user} />;
  if (role === "AUDITOR") return <AuditorDashboard transactions={transactions} evidence={evidence} user={user} />;
  return <ClientDashboard transactions={transactions} evidence={evidence} user={user} />;
}

/* ── shared styles ── */
const card: React.CSSProperties = {
  background: "#fff", border: "1.5px solid", borderRadius: 16,
  padding: "20px 24px", marginBottom: 20,
  display: "flex", alignItems: "center", justifyContent: "space-between",
  gap: 24, flexWrap: "wrap",
};
const cardLeft: React.CSSProperties = { display: "flex", alignItems: "center", gap: 16 };
const avatarBox: React.CSSProperties = {
  width: 56, height: 56, borderRadius: "50%",
  display: "flex", alignItems: "center", justifyContent: "center",
  color: "#fff", fontSize: 20, fontWeight: 800, flexShrink: 0,
};
const pill: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 5,
  padding: "3px 10px", borderRadius: 999, border: "1px solid", fontSize: 12, fontWeight: 700,
};
const capTag: React.CSSProperties = {
  display: "inline-block", padding: "4px 10px",
  borderRadius: 8, border: "1px solid", fontSize: 12, fontWeight: 500,
};
const statsGrid: React.CSSProperties = {
  display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 20,
};
const twoCol: React.CSSProperties = {
  display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20,
};
const actionsBox: React.CSSProperties = {
  background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: "20px",
};
const actionsTitle: React.CSSProperties = {
  margin: "0 0 14px", fontSize: 15, fontWeight: 700, color: "#0f172a",
};
const sectionTitle = (color: string): React.CSSProperties => ({
  fontSize: 13, fontWeight: 700, color, textTransform: "uppercase",
  letterSpacing: "0.07em", marginBottom: 12,
});
