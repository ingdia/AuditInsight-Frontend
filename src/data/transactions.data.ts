import { Transaction } from "@/types/transaction.types";

export const transactionsData: Transaction[] = [
  {
    id: "TXN10651",
    date: "03/20/2026",
    amount: 8520,
    counterparty: "AFI Distributors",
    source: "Bank",
    riskScore: 90,
    status: "Flagged",
    evidence: 1,
  },
  {
    id: "TXN10542",
    date: "03/15/2026",
    amount: 12850,
    counterparty: "ABC Corp",
    source: "Bank",
    riskScore: 90,
    status: "Overdue",
    evidence: 0,
  },
];