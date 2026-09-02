import { COLORS as THEME_COLORS } from '@/utils/themeColors';

export const COLORS = {
  // Brand / Theme Colors
  brownDark: THEME_COLORS.primary,
  brownMid: THEME_COLORS.accent,
  brownLight: THEME_COLORS.secondary,
  cream: THEME_COLORS.cardBg,
  creamLight: THEME_COLORS.cardBg,
  gold: THEME_COLORS.accent,
  footerBg: THEME_COLORS.primary,
  sectionHdr: THEME_COLORS.textPrimary,

  // Light Mode Colors
  light: {
    bg: THEME_COLORS.background,
    cardBg: THEME_COLORS.cardBg,
    border: THEME_COLORS.border,
    textPrimary: THEME_COLORS.textPrimary,
    textSecondary: THEME_COLORS.textSecondary,
    textMuted: '#685545',
  },

  // Dark Mode Colors
  dark: {
    bg: THEME_COLORS.background,
    cardBg: THEME_COLORS.cardBg,
    border: THEME_COLORS.border,
    textPrimary: THEME_COLORS.textPrimary,
    textSecondary: THEME_COLORS.textSecondary,
    textMuted: '#685545',
  }
};

export default COLORS;
