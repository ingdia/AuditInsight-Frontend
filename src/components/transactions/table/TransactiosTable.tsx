"use client";

import { useState } from "react";
import { transactionsData } from "@/data/transactions.data";
import { evidenceData } from "@/data/evidence.data";
import { Transaction } from "@/types/transaction.types";
import { TransactionRow } from "./TransactionRow";
import { tableStyles } from "@/components/ui/table/table.styles";
import { TransactionDetailsModal } from "../modals/TransactionDetailsModal";

export const TransactionsTable = () => {
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const [isOpen, setIsOpen] = useState(false);

  const handleRowClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsOpen(true);
  };

  return (
    <>
      <div style={tableStyles.wrapper}>
        <table style={tableStyles.table}>
          <thead style={tableStyles.thead}>
            <tr>
              <th style={tableStyles.th}>Counterparty</th>
              <th style={tableStyles.th}>Amount</th>
              <th style={tableStyles.th}>Status</th>
              <th style={tableStyles.th}>Risk</th>
              <th style={tableStyles.th}>Evidence</th>
              <th style={tableStyles.th}>Coverage</th>
            </tr>
          </thead>

          <tbody>
            {transactionsData.map((transaction) => {
              const relatedEvidence = evidenceData.filter(
                (e) => e.transactionId === transaction.id
              );

              return (
                <TransactionRow
                  key={transaction.id}
                  transaction={transaction}
                  evidences={relatedEvidence}
                  onClick={() => handleRowClick(transaction)} // 👈 PASS CLICK
                />
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 🔥 MODAL */}
      <TransactionDetailsModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        transaction={selectedTransaction}
        evidences={
          selectedTransaction
            ? evidenceData.filter(
                (e) => e.transactionId === selectedTransaction.id
              )
            : []
        }
      />
    </>
  );
};