"use client";

import {
  BarChart3,
  Briefcase,
  Building2,
  Landmark,
  Scale,
  Search,
  type LucideIcon,
} from "lucide-react";

const TAGS: { icon: LucideIcon; label: string }[] = [
  { icon: Landmark, label: "Internal Audit Teams"       },
  { icon: Briefcase, label: "Finance Departments"        },
  { icon: Scale, label: "Compliance Officers"       },
  { icon: Search, label: "External Auditors"          },
  { icon: Building2, label: "Enterprise Review Teams"    },
  { icon: BarChart3, label: "CFO Offices"                },
];

export default function TrustedSection() {
  return (
    <section style={s.section}>
      <p style={s.label}>Trusted by modern finance & audit teams worldwide</p>
      <div style={s.strip}>
        {TAGS.map((t, i) => {
          const Icon = t.icon;
          return (
          <div key={t.label} style={{ display: "flex", alignItems: "center", gap: 0 }}>
            <div style={s.tag}>
              <Icon size={16} color="#64748b" strokeWidth={1.75} />
              <span style={s.tagText}>{t.label}</span>
            </div>
            {i < TAGS.length - 1 && <div style={s.divider} />}
          </div>
        );
        })}
      </div>
    </section>
  );
}

const s: Record<string, React.CSSProperties> = {
  section: {
    padding: "32px 48px 56px",
    background: "#fff",
    borderTop: "1px solid #f1f5f9",
    borderBottom: "1px solid #f1f5f9",
  },
  label: {
    textAlign: "center", fontSize: 13, fontWeight: 600,
    color: "#94a3b8", letterSpacing: "0.05em",
    textTransform: "uppercase", margin: "0 0 24px",
  },
  strip: {
    display: "flex", justifyContent: "center",
    alignItems: "center", flexWrap: "wrap", gap: 0,
  },
  tag: {
    display: "flex", alignItems: "center", gap: 8,
    padding: "10px 22px",
  },
  tagText: { fontSize: 14, fontWeight: 600, color: "#374151", whiteSpace: "nowrap" },
  divider: { width: 1, height: 24, background: "#e2e8f0" },
};
