import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import '../global.css';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

const PetroLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.light.primary,
    background: Colors.light.background,
    card: Colors.light.surface,
    text: Colors.light.text,
    border: Colors.light.border,
  },
};

const PetroDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: Colors.dark.primary,
    background: Colors.dark.background,
    card: Colors.dark.surface,
    text: Colors.dark.text,
    border: Colors.dark.border,
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? PetroDarkTheme : PetroLightTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="job/[id]" options={{ presentation: 'card', headerShown: false }} />
        <Stack.Screen name="company/[id]" options={{ presentation: 'card', headerShown: false }} />
        <Stack.Screen name="application/[id]" options={{ presentation: 'card', headerShown: false }} />
        <Stack.Screen name="edit-profile" options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="settings" options={{ presentation: 'card', headerShown: false }} />
        <Stack.Screen name="notifications" options={{ presentation: 'card', headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
