"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import PageToolbar from "@/components/layout/pageToolbar/pageToolbar";
import ReviewStats from "@/components/review-queue/ReviewStats";
import ReviewFilters from "@/components/review-queue/ReviewFilters";
import ReviewSidebar from "@/components/review-queue/ReviewSidebar";
import ReviewTable from "@/components/review-queue/ReviewTable";
import ReviewPagination from "@/components/review-queue/ReviewPagination";

import { theme } from "@/styles/theme";

/*
 * ── REAL API (commented for RBAC UI testing) ──────────────────
 * Previously: import { getReviewQueue } from "@/utils/api";
 * Now managed by useReviewQueue hook.
 * ──────────────────────────────────────────────────────────────
 */
import { useReviewQueue } from "@/hooks/useReviewQueue";
import { usePermissions } from "@/security/access-control";

export default function ReviewQueuePage() {
  const router = useRouter();
  const { items, loading, flagIssue, resolveIssue } = useReviewQueue();
  const { canFlagIssue, canResolveIssue } = usePermissions();

  const [page, setPage] = useState(1);
  const [activeIssue, setActiveIssue] = useState("All");
  const [severity, setSeverity] = useState("All");

  const filteredReviews = useMemo(() => {
    return items.filter((r) => {
      const matchesIssue = activeIssue === "All" || r.type === activeIssue;
      const matchesSeverity = severity === "All" || r.severity === severity;
      return matchesIssue && matchesSeverity;
    });
  }, [items, activeIssue, severity]);

  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(filteredReviews.length / pageSize));
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredReviews.slice(start, start + pageSize);
  }, [page, filteredReviews]);

  if (loading) {
    return (
      <div style={{ ...styles.page, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <p style={{ color: "#64748b", fontSize: 14 }}>Loading review queue…</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <PageToolbar
        title="Review Queue"
        filters={["All Issues", "My Issues"]}
        // ── Role guard: Auditor gets "Flag Issue", Accountant gets "Export" ──
        primaryActionLabel={canFlagIssue ? "Flag Issue" : "Export"}
        onAdd={canFlagIssue ? () => {
          flagIssue({
            type: "Compliance Issues",
            transactionId: "TXN-0001",
            amount: "—",
            risk: "Medium",
            severity: "Medium",
            due: new Date().toISOString().split("T")[0],
            status: "Open",
          });
        } : undefined}
      />

      <ReviewStats data={items} />
      <ReviewFilters severity={severity} setSeverity={setSeverity} />

      <div style={styles.layout}>
        <ReviewSidebar data={items} active={activeIssue} setActive={setActiveIssue} />
        <ReviewTable
          data={paginated}
          onRowClick={(row) => router.push(`/transactions?transactionId=${row.transactionId}`)}
          // ── Role guard: Accountant can resolve, Auditor cannot ──
          onResolve={canResolveIssue ? (id) => resolveIssue(id, "Resolved via UI") : undefined}
        />
      </div>

      <ReviewPagination page={page} setPage={setPage} totalPages={totalPages} />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    padding: theme.spacing.lg,
    background: theme.colors.appBackground,
    minHeight: "100vh",
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "260px 1fr",
    gap: theme.spacing.lg,
    marginTop: theme.spacing.md,
    alignItems: "start",
  },
};
