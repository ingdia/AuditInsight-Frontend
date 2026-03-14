import DashboardStats from "@/components/dashboard/DashboardStats";
import EvidenceChart from "@/components/dashboard/EvidenceChart";
import HighRiskTransactions from "@/components/dashboard/HighRiskTransactions";
import ComplianceAlerts from "@/components/dashboard/ComplianceAlerts";

import { dashboardLayoutStyles } from "@/app/dashboard/DashboardPage.styles";

export default function DashboardPage() {

  return (

    <div style={dashboardLayoutStyles.page}>

      <div style={dashboardLayoutStyles.headerRow}>
        <h1>Dashboard</h1>
      </div>

      <DashboardStats />

      <div style={dashboardLayoutStyles.mainGrid}>

        <HighRiskTransactions />

        <EvidenceChart />

      </div>

      <div style={dashboardLayoutStyles.secondaryGrid}>

        <HighRiskTransactions />

        <ComplianceAlerts />

      </div>

    </div>

  )

}