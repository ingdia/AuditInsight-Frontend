import { Table } from "@/components/ui/table/table";
import { Card } from "@/components/ui/card/card";
import { CardHeader } from "@/components/ui/cardHeader/CardHeader";
import { CardContent } from "@/components/ui/cardHeader/CardContent";
import { Badge } from "@/components/ui/badge/badge";

type HighRiskRow = {
  id: string;
  date: string;
  counterparty: string;
  riskScore: number;
  status: "Observed" | "Flagged" | "Reviewed" | "Approved";
};

// Demo data
const highRiskData: HighRiskRow[] = [
  { id: "#TXN10451", date: "03/20/2026", counterparty: "MFI Distributors", riskScore: 92, status: "Flagged" },
  { id: "#TXN10389", date: "03/15/2026", counterparty: "ABC Corp", riskScore: 85, status: "Flagged" },
  { id: "#TXN10372", date: "03/10/2026", counterparty: "Global Logistics Ltd", riskScore: 88, status: "Observed" },
];

// Map status to badge color
const statusColors: Record<HighRiskRow["status"], "yellow" | "green" | "blue" | "gray" | "red"> = {
  Observed: "yellow",
  Flagged: "red",
  Reviewed: "blue",
  Approved: "green",
};

export default function HighRiskTransactions() {
  const columns: {
     header: string; 
     accessor: keyof HighRiskRow; 
     cell?: (value: HighRiskRow[keyof HighRiskRow])=> React.ReactNode }[] = [
    { header: "ID", accessor: "id" },
    { header: "Date", accessor: "date" },
    { header: "Counterparty", accessor: "counterparty" },
    { header: "Risk Score", accessor: "riskScore" },
    {
      header: "Status",
      accessor: "status",
      // render badge for status
      cell: (value: HighRiskRow["status"]) => <Badge label={value} color={statusColors[value]} />,
    },
  ];

  return (
    <Card padding="lg">
      <CardHeader title="High‑Risk Transactions" />
      <CardContent>
        <Table columns={columns} data={highRiskData} />
      </CardContent>
    </Card>
  );
}