"use client";

import { useState, useEffect } from "react";
import { ReviewItem } from "@/lib/reviewEngine";
import { MOCK_REVIEW_QUEUE } from "@/mock/reviewQueue.mock";

/*
 * ── REAL API (commented for RBAC UI testing) ─────────────────────
 * import { getReviewQueue, flagIssue, resolveIssue } from "@/utils/api";
 * ─────────────────────────────────────────────────────────────────
 */

export function useReviewQueue() {
  const [items, setItems] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /*
     * ── REAL API ─────────────────────────────────────────────────
     * const orgId = localStorage.getItem("organisationId") ?? "";
     * getReviewQueue(orgId)
     *   .then(({ data }) => setItems((data ?? []).map(toReviewItem)))
     *   .catch(() => {})
     *   .finally(() => setLoading(false));
     * ─────────────────────────────────────────────────────────────
     */
    setItems(MOCK_REVIEW_QUEUE);
    setLoading(false);
  }, []);

  const flagIssue = (item: Omit<ReviewItem, "id">) => {
    /*
     * ── REAL API ─────────────────────────────────────────────────
     * await flagIssue({ organisationId, transactionId, issueType, description });
     * ─────────────────────────────────────────────────────────────
     */
    const newItem: ReviewItem = {
      ...item,
      id: `rq-${Date.now()}`,
      status: "Open",
    };
    setItems((prev) => [newItem, ...prev]);
  };

  const resolveIssue = (id: string, note: string) => {
    /*
     * ── REAL API ─────────────────────────────────────────────────
     * await resolveIssue(id, note);
     * ─────────────────────────────────────────────────────────────
     */
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: "Resolved" } : i))
    );
  };

  return { items, loading, flagIssue, resolveIssue };
}
