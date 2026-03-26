import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#0f172a',
    textSecondary: '#64748b',
    textMuted: '#94a3b8',
    background: '#f8fafc',
    surface: '#ffffff',
    tint: '#0ea5e9',
    primary: '#0ea5e9',
    primaryLight: '#e0f2fe',
    icon: '#64748b',
    tabIconDefault: '#94a3b8',
    tabIconSelected: '#0ea5e9',
    border: '#e2e8f0',
    borderLight: '#f1f5f9',
    success: '#10b981',
    successLight: '#d1fae5',
    warning: '#f59e0b',
    warningLight: '#fef3c7',
    danger: '#ef4444',
    dangerLight: '#fee2e2',
    card: '#ffffff',
  },
  dark: {
    text: '#f1f5f9',
    textSecondary: '#94a3b8',
    textMuted: '#64748b',
    background: '#0f172a',
    surface: '#1e293b',
    tint: '#38bdf8',
    primary: '#38bdf8',
    primaryLight: '#0c4a6e',
    icon: '#94a3b8',
    tabIconDefault: '#64748b',
    tabIconSelected: '#38bdf8',
    border: '#334155',
    borderLight: '#1e293b',
    success: '#34d399',
    successLight: '#064e3b',
    warning: '#fbbf24',
    warningLight: '#78350f',
    danger: '#f87171',
    dangerLight: '#7f1d1d',
    card: '#1e293b',
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

export const Fonts = Platform.select({
  ios: {
    sans: 'System',
    serif: 'Georgia',
    mono: 'Menlo',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    mono: 'monospace',
  },
});
