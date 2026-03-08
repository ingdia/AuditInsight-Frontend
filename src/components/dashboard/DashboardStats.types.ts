export type DashboardStat = {
  title: string
  value: number
  change: string
  status: "success" | "warning" | "danger"
}