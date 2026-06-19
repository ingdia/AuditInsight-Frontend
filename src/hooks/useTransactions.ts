"use client";

import { useState, useEffect } from "react";
import { Transaction } from "@/types/transaction.types";
import { MOCK_TRANSACTIONS } from "@/mock/transactions.mock";
import { MOCK_EVIDENCE } from "@/mock/evidence.mock";
import { Evidence } from "@/types/evidence.types";

/*
 * ── REAL API (commented for RBAC UI testing) ─────────────────────
 * import {
 *   getTransactions, createTransaction,
 *   updateTransactionStatus, getEvidence,
 * } from "@/utils/api";
 * ─────────────────────────────────────────────────────────────────
 */

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [evidences, setEvidences] = useState<Evidence[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    /*
     * ── REAL API ─────────────────────────────────────────────────
     * Promise.all([getTransactions(), getEvidence()])
     *   .then(([txRes, evRes]) => {
     *     setTransactions(txRes.data);
     *     setEvidences(evRes.data);
     *   })
     *   .catch(console.error)
     *   .finally(() => setLoading(false));
     * ─────────────────────────────────────────────────────────────
     */
    setTransactions(MOCK_TRANSACTIONS);
    setEvidences(MOCK_EVIDENCE);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const addTransaction = async (data: Omit<Transaction, "id">) => {
    /*
     * ── REAL API ─────────────────────────────────────────────────
     * await createTransaction(data as any);
     * load();
     * ─────────────────────────────────────────────────────────────
     */
    const newTx: Transaction = {
      ...data,
      id: `TXN-${String(transactions.length + 1).padStart(4, "0")}`,
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  const updateTransaction = async (id: string | number, data: Partial<Transaction>) => {
    /*
     * ── REAL API ─────────────────────────────────────────────────
     * await updateTransactionStatus(String(id), data.status!);
     * load();
     * ─────────────────────────────────────────────────────────────
     */
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...data } : t))
    );
  };

  const deleteTransaction = async (id: string | number) => {
    /*
     * ── REAL API ─────────────────────────────────────────────────
     * // No delete endpoint yet on backend
     * ─────────────────────────────────────────────────────────────
     */
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  return { transactions, evidences, loading, addTransaction, updateTransaction, deleteTransaction };
}
