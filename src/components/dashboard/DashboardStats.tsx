import { CreditCard, CheckCircle, AlertTriangle, AlertCircle, LucideIcon } from "lucide-react"
import { Card } from "@/components/ui/card/card" // Make sure Card is imported
import { StatsGrid } from "@/components/ui/StatsGrid" // Make sure StatsGrid is imported

interface DashboardStats {
  title: string
  value: number
  change: string
  status: "success" | "warning" | "danger"
  icon: LucideIcon
}

const stats: DashboardStats[] = [
  {
    title: "Total Transactions",
    value: 1265,
    change: "+12%",
    status: "success",
    icon: CreditCard
  },
  {
    title: "Audit Ready",
    value: 82,
    change: "+2%",
    status: "success",
    icon: CheckCircle
  },
  {
    title: "Missing Evidence",
    value: 58,
    change: "+7%",
    status: "warning",
    icon: AlertTriangle
  },
  {
    title: "High-Risk Transactions",
    value: 14,
    change: "+5%",
    status: "danger",
    icon: AlertCircle
  }
]

export default function DashboardStats() {
  return (
    <StatsGrid>
      {stats.map((stat) => {
        const Icon = stat.icon

        return (
          <Card key={stat.title}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Icon size={20} />
              <div>
                <h4>{stat.title}</h4>
                <h2>{stat.value}</h2>
                <span>{stat.change}</span>
              </div>
            </div>
          </Card>
        )
      })}
    </StatsGrid>
  )
}