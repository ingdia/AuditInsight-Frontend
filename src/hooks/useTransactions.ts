"use client";

import { useState, useEffect, useCallback } from "react";
import { Transaction } from "@/types/transaction.types";
import { Evidence } from "@/types/evidence.types";
import { MOCK_TRANSACTIONS } from "@/mock/transactions.mock";
import { MOCK_EVIDENCE } from "@/mock/evidence.mock";

/*
 * ── REAL API (commented for UI refinement phase) ──────────────────
 * import { getTransactions, createTransaction, updateTransactionStatus, getEvidence } from "@/utils/api";
 * ─────────────────────────────────────────────────────────────────
 */

// Derive status from evidence count:
// COMPLETED if evidenceCount >= 1, PENDING otherwise
function deriveStatus(txId: string, evidence: Evidence[]): Transaction["status"] {
  return evidence.filter((e) => e.transactionId === txId).length >= 1
    ? "COMPLETED"
    : "PENDING";
}

// Enrich each transaction with its evidence count and derived status
function enrichTransactions(
  transactions: Transaction[],
  evidence: Evidence[]
): Transaction[] {
  return transactions.map((t) => {
    const evidenceCount = evidence.filter((e) => e.transactionId === t.id).length;
    return { ...t, evidenceCount, status: deriveStatus(t.id, evidence) };
  });
}

// Detect duplicates — same amount + same counterparty within the dataset
function findDuplicateIds(transactions: Transaction[]): Set<string> {
  const seen = new Map<string, string>();
  const dupes = new Set<string>();
  for (const t of transactions) {
    const key = `${t.amount}-${t.counterparty.toLowerCase()}`;
    if (seen.has(key)) {
      dupes.add(t.id);
      dupes.add(seen.get(key)!);
    } else {
      seen.set(key, t.id);
    }
  }
  return dupes;
}

export interface TransactionWithMeta extends Transaction {
  evidenceCount: number;
  isDuplicate: boolean;
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<TransactionWithMeta[]>([]);
  const [evidences, setEvidences] = useState<Evidence[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    /*
     * ── REAL API ─────────────────────────────────────────────────
     * Promise.all([getTransactions(), getEvidence()])
     *   .then(([txRes, evRes]) => {
     *     const ev = evRes.data ?? [];
     *     const enriched = enrichTransactions(txRes.data ?? [], ev);
     *     const dupes = findDuplicateIds(enriched);
     *     setTransactions(enriched.map(t => ({ ...t, isDuplicate: dupes.has(t.id) })));
     *     setEvidences(ev);
     *   })
     *   .catch(console.error)
     *   .finally(() => setLoading(false));
     * ─────────────────────────────────────────────────────────────
     */
    const ev = MOCK_EVIDENCE;
    const enriched = enrichTransactions(MOCK_TRANSACTIONS, ev);
    const dupes = findDuplicateIds(enriched);
    setTransactions(enriched.map((t) => ({
      ...t,
      evidenceCount: t.evidenceCount ?? 0,
      isDuplicate: dupes.has(t.id),
    })));
    setEvidences(ev);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const addTransaction = (data: Omit<Transaction, "id" | "status" | "evidenceCount">) => {
    /*
     * ── REAL API ─────────────────────────────────────────────────
     * await createTransaction(data);
     * load();
     * ─────────────────────────────────────────────────────────────
     */
    const newTx: TransactionWithMeta = {
      ...data,
      id: `TXN-${String(transactions.length + 1).padStart(4, "0")}`,
      status: "PENDING",
      evidenceCount: 0,
      isDuplicate: false,
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    setEvidences((prev) => prev.filter((e) => e.transactionId !== id));
  };

  // Called by useEvidence after a file is uploaded — recalculates statuses
  const onEvidenceChange = (updatedEvidence: Evidence[]) => {
    setEvidences(updatedEvidence);
    setTransactions((prev) =>
      prev.map((t) => {
        const count = updatedEvidence.filter((e) => e.transactionId === t.id).length;
        return {
          ...t,
          evidenceCount: count,
          status: count >= 1 ? "COMPLETED" : "PENDING",
        };
      })
    );
  };

  return { transactions, evidences, loading, addTransaction, deleteTransaction, onEvidenceChange };
}
