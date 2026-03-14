import { sidebarMenu } from './sidebar.menu';
import { sidebarStyles } from './sidebar.styles';
import { Colors } from "@/styles/colors";

export default function Sidebar() {
  return (
    <aside
      style={{
        width: "240px",
        backgroundColor: Colors.Surface,
        borderRight: `1px solid ${Colors.border}`,
        padding: "24px",
      }}
    >
      <h2>AuditInsight</h2>

      <nav style={{ marginTop: "32px", display: "flex", flexDirection: "column", gap: "16px" }}>
        <a>Dashboard</a>
        <a>Transactions</a>
        <a>Evidence</a>
        <a>Review Queue</a>
        <a>Reports</a>
        <a>Settings</a>
      </nav>
    </aside>
  );
}