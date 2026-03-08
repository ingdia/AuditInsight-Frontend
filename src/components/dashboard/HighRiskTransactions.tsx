import { Table } from "@/components/ui/table/table";
import { Badge } from "@/components/ui/badge/badge";
import { Card } from "@/components/ui/card/card";

type HighRiskRow = {
  id: string;
  date: string;
  counterparty: string;
  riskScore: number;
  status: "Observed" | "Flagged" | "Reviewed" | "Approved";
};

// Fake demo data — this is an **array** of objects.
const highRiskData: HighRiskRow[] = [
  {
    id: "#TXN10451",
    date: "03/20/2026",
    counterparty: "MFI Distributors",
    riskScore: 92,
    status: "Flagged",
  },
  {
    id: "#TXN10389",
    date: "03/15/2026",
    counterparty: "ABC Corp",
    riskScore: 85,
    status: "Flagged",
  },
  {
    id: "#TXN10372",
    date: "03/10/2026",
    counterparty: "Global Logistics Ltd",
    riskScore: 88,
    status: "Observed",
  },
];

export default function HighRiskTransactions() {
  // Columns tells the Table what to show on each column
  const columns: { header: string; accessor: keyof HighRiskRow }[] = [
    { header: "ID", accessor: "id" },
    { header: "Date", accessor: "date" },
    { header: "Counterparty", accessor: "counterparty" },
    { header: "Risk Score", accessor: "riskScore" },
    {
      header: "Status",
      accessor: "status",
    },
  ];

  return (
    <Card>
      <h3>High‑Risk Transactions</h3>
      <Table columns={columns} data={highRiskData} />
    </Card>
  );
}