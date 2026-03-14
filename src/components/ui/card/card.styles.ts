// components/ui/card/card.styles.ts

import { Colors } from '@/styles/colors';
import { spacing } from '@/styles/spacing';
import { radius } from '@/styles/radius';
import { shadows } from '@/styles/shadows';
import { theme } from '@/styles/theme';

export const cardStyles = {
  base: {
    background: Colors.Surface,
    borderRadius: radius.lg,
    boxShadow: shadows.sm,
    border: `1px solid ${Colors.border}`,
  },

  padding: {
    sm: {
      padding: spacing.sm,
    },
    md: {
      padding: spacing.md,
    },
    lg: {
      padding: spacing.lg,
    },
  },
  container: {
    background: theme.colors.Surface,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radius.md,
    boxShadow: theme.shadows.sm,
    padding: theme.spacing.lg,
  }
};