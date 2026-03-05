import {Colors} from '../../../styles/colors';
import {spacing} from '../../../styles/spacing';
import {radius} from '../../../styles/radius';

export const inputStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: spacing.xs,
  },
  label: {
    fontSize: '12px',
    color: Colors.textSecondary,
  },

  input: {
    padding: spacing.sm,
    borderRadius: radius.md,
    border: `1px solid ${Colors.border}`,
    outline: 'none',
    fontSize: '14px',
    background: Colors.Surface,
  },

    focus: {
    border: `1px solid ${Colors.primary}`,
  },

  error: {
    border: `1px solid ${Colors.danger}`,
  },

  errorText: {
    fontSize: '12px',
    color: Colors.danger,
  },

};