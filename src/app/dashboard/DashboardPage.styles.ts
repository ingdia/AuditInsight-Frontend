import { theme } from "@/styles/theme"

export const dashboardLayoutStyles = {

  page: {
    background: theme.colors.appBackground,
    padding: theme.spacing.xl,
    minHeight: "100vh",
  },

  headerRow: {
    marginBottom: theme.spacing.lg,
  },

  mainGrid: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: theme.spacing.lg,
    marginTop: theme.spacing.lg,
  },

  secondaryGrid: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: theme.spacing.lg,
    marginTop: theme.spacing.lg,
  },

}