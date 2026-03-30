import { Platform } from 'react-native';

// PetroApply Design System
export const Colors = {
  light: {
    text: '#0f172a',
    textSecondary: '#64748b',
    textTertiary: '#94a3b8',
    background: '#f8fafc',
    surface: '#ffffff',
    surfaceHover: '#f1f5f9',
    primary: '#0ea5e9',
    primaryDark: '#0284c7',
    primaryLight: '#e0f2fe',
    tint: '#0ea5e9',
    icon: '#64748b',
    tabIconDefault: '#94a3b8',
    tabIconSelected: '#0ea5e9',
    border: '#e2e8f0',
    borderLight: '#f1f5f9',
    success: '#10b981',
    successLight: '#d1fae5',
    warning: '#f59e0b',
    warningLight: '#fef3c7',
    error: '#ef4444',
    errorLight: '#fee2e2',
    cardShadow: 'rgba(0, 0, 0, 0.04)',
  },
  dark: {
    text: '#f8fafc',
    textSecondary: '#94a3b8',
    textTertiary: '#64748b',
    background: '#0f172a',
    surface: '#1e293b',
    surfaceHover: '#334155',
    primary: '#38bdf8',
    primaryDark: '#0ea5e9',
    primaryLight: '#0c4a6e',
    tint: '#38bdf8',
    icon: '#94a3b8',
    tabIconDefault: '#64748b',
    tabIconSelected: '#38bdf8',
    border: '#334155',
    borderLight: '#1e293b',
    success: '#34d399',
    successLight: '#064e3b',
    warning: '#fbbf24',
    warningLight: '#78350f',
    error: '#f87171',
    errorLight: '#7f1d1d',
    cardShadow: 'rgba(0, 0, 0, 0.2)',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', sans-serif",
    mono: "SFMono-Regular, Menlo, monospace",
  },
});
