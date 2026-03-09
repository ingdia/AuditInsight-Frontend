import DashboardStats from "@/components/dashboard/DashboardStats";
import EvidenceChart from "@/components/dashboard/EvidenceChart";
import HighRiskTransactions from "@/components/dashboard/HighRiskTransactions";
import ComplianceAlerts from "@/components/dashboard/ComplianceAlerts";

export default function DashboardPage() {
  return (
    <div className="dashboard-page">
      <h1 className="dashboard-title">Dashboard</h1>

      <DashboardStats />

      <div className="dashboard-grid">
        <HighRiskTransactions />
        <EvidenceChart />

        <HighRiskTransactions />
        <ComplianceAlerts />
      </div>
    </div>
  );
}