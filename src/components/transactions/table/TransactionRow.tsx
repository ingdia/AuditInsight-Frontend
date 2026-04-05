import { Transaction } from "@/types/transaction.types";
import { Evidence } from "@/types/evidence.types";
import { EvidenceList } from "../EvidenceList";

interface TransactionRowProps {
  transaction: Transaction;
  evidences: Evidence[];
  onClick: () => void;
}

export const TransactionRow = ({
  transaction,
  evidences,
  onClick,
}: TransactionRowProps) => {
  return (
    <tr onClick={onClick} style={{ cursor: "pointer" }}>
      <td>{transaction.counterparty}</td>
      <td>{transaction.amount}</td>
      <td>{transaction.status}</td>
      <td>{transaction.riskScore}%</td>

      <td>
        <EvidenceList evidences={evidences} />
      </td>

      <td>{transaction.evidenceCoverage}%</td>
    </tr>
  );
};