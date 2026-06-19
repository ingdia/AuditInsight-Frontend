"use client";

import { useState, useEffect } from "react";
import { Evidence } from "@/types/evidence.types";
import { MOCK_EVIDENCE } from "@/mock/evidence.mock";

/*
 * ── REAL API (commented for RBAC UI testing) ─────────────────────
 * import { getEvidence, uploadEvidence, deleteEvidence } from "@/utils/api";
 * ─────────────────────────────────────────────────────────────────
 */

export function useEvidence() {
  const [documents, setDocuments] = useState<Evidence[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    /*
     * ── REAL API ─────────────────────────────────────────────────
     * getEvidence()
     *   .then((res) => setDocuments(res.data ?? []))
     *   .catch(console.error)
     *   .finally(() => setLoading(false));
     * ─────────────────────────────────────────────────────────────
     */
    setDocuments(MOCK_EVIDENCE);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const saveEvidence = (saved: Evidence) => {
    /*
     * ── REAL API ─────────────────────────────────────────────────
     * await uploadEvidence(file, { ...data });
     * load();
     * ─────────────────────────────────────────────────────────────
     */
    setDocuments((prev) => {
      const idx = prev.findIndex((e) => e.id === saved.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = saved;
        return next;
      }
      return [saved, ...prev];
    });
  };

  const deleteEvidence = (id: string | number) => {
    /*
     * ── REAL API ─────────────────────────────────────────────────
     * // No delete endpoint yet on backend
     * ─────────────────────────────────────────────────────────────
     */
    setDocuments((prev) => prev.filter((e) => e.id !== id));
  };

  return { documents, loading, saveEvidence, deleteEvidence };
}
