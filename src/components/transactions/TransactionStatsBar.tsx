"use client";

import { useMemo } from "react";
import { TransactionWithMeta } from "@/hooks/useTransactions";
import { Evidence } from "@/types/evidence.types";
import { FileX, Copy, LayoutList, Paperclip, CheckCircle2 } from "lucide-react";

interface Props {
  transactions: TransactionWithMeta[];
  evidence: Evidence[];
}

export default function TransactionStatsBar({ transactions, evidence }: Props) {
  const stats = useMemo(() => {
    const total = transactions.length;
    const noEvidence = transactions.filter((t) => t.evidenceCount === 0).length;
    const duplicates = transactions.filter((t) => t.isDuplicate).length;
    const totalEvidence = evidence.length;
    const completedPct = total > 0
      ? Math.round((transactions.filter((t) => t.status === "COMPLETED").length / total) * 100)
      : 0;

    return [
      { label: "No Evidence",        value: noEvidence,    icon: FileX,        color: "#dc2626", bg: "#fef2f2" },
      { label: "Duplicate Txns",     value: duplicates,    icon: Copy,         color: "#d97706", bg: "#fffbeb" },
      { label: "Total Transactions", value: total,         icon: LayoutList,   color: "#1e3a8a", bg: "#eff6ff" },
      { label: "Total Evidence",     value: totalEvidence, icon: Paperclip,    color: "#0891b2", bg: "#ecfeff" },
      { label: "Completed",          value: `${completedPct}%`, icon: CheckCircle2, color: "#16a34a", bg: "#f0fdf4" },
    ];
  }, [transactions, evidence]);

  return (
    <div style={grid}>
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <div key={s.label} style={card}>
            <div style={{ ...iconWrap, background: s.bg, color: s.color }}>
              <Icon size={18} />
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px" }}>
                {s.value}
              </div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{s.label}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(5, 1fr)",
  gap: 14,
  marginBottom: 20,
};

const card: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #e2e8f0",
  borderRadius: 14,
  padding: "16px 18px",
  display: "flex",
  alignItems: "center",
  gap: 14,
  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
};

const iconWrap: React.CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: 10,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};
