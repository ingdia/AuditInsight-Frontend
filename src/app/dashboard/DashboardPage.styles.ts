import { theme } from "@/styles/theme";

export const dashboardPageStyles = {

    page: {
        background: theme.colors.appBackground,
        padding: theme.spacing.xl,
        minHeight: '100vh',
    },

    tittle : {
        fontsize: theme.typography.heading,
        fontFamily: theme.typography.fontFamily,
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing.lg,
    },

    mainGrid: {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: theme.spacing.lg,
        marginTop: theme.spacing.lg,
    }
};