"use client";

import { useState, useEffect } from "react";
import { ReviewItem } from "@/lib/reviewEngine";
import { MOCK_REVIEW_QUEUE } from "@/mock/reviewQueue.mock";
import { MOCK_MEMBERS } from "@/mock/organisation.mock";
import { notifyFlagCreated, notifyFlagResolved } from "@/hooks/useNotifications";

function getEmailByRole(role: "MEMBER" | "AUDITOR"): string {
  return MOCK_MEMBERS.find((m) => m.role === role)?.emailAddress ?? "";
}

export function useReviewQueue() {
  const [items, setItems] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setItems(MOCK_REVIEW_QUEUE);
    setLoading(false);
  }, []);

  const flagIssue = (item: Omit<ReviewItem, "id">, auditorName?: string) => {
    const newItem: ReviewItem = {
      ...item,
      id: `rq-${Date.now()}`,
      status: "Open",
    };
    setItems((prev) => [newItem, ...prev]);

    const accountantEmail = getEmailByRole("MEMBER");
    if (accountantEmail) {
      notifyFlagCreated(
        accountantEmail,
        String(item.transactionId),
        item.counterparty ?? "—",
        item.amount ?? "—",
        item.type,
        item.severity ?? item.risk,
        auditorName ?? "Auditor"
      );
    }
  };

  const resolveIssue = (id: string, note: string, accountantName?: string) => {
    const item = items.find((i) => i.id === id);
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: "Resolved" } : i))
    );

    const auditorEmail = getEmailByRole("AUDITOR");
    if (auditorEmail) {
      notifyFlagResolved(
        auditorEmail,
        item ? String(item.transactionId) : id,
        note || "Issue resolved",
        accountantName ?? "Accountant"
      );
    }
  };

  return { items, loading, flagIssue, resolveIssue };
}
