"use client";

import { useState, useEffect } from "react";
import { Transaction } from "@/types/transaction.types";
import { Evidence } from "@/types/evidence.types";
import { MOCK_TRANSACTIONS } from "@/mock/transactions.mock";
import { MOCK_EVIDENCE } from "@/mock/evidence.mock";

/*
 * ── REAL API (commented for RBAC UI testing) ─────────────────────
 * import { getTransactions, getEvidence } from "@/utils/api";
 * ─────────────────────────────────────────────────────────────────
 */

export function useDashboardData() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /*
     * ── REAL API ─────────────────────────────────────────────────
     * const orgId = localStorage.getItem("organisationId") ?? undefined;
     * Promise.all([getTransactions(orgId), getEvidence(orgId)])
     *   .then(([txRes, evRes]) => {
     *     setTransactions(txRes.data ?? []);
     *     setEvidence(evRes.data ?? []);
     *   })
     *   .catch((err) => console.error("Dashboard fetch error", err))
     *   .finally(() => setLoading(false));
     * ─────────────────────────────────────────────────────────────
     */

    // ── MOCK ─────────────────────────────────────────────────────
    setTransactions(MOCK_TRANSACTIONS);
    setEvidence(MOCK_EVIDENCE);
    setLoading(false);
  }, []);

  return { transactions, evidence, loading };
}
