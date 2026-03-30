import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, FontSize } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';

const typeIcons: Record<string, { icon: 'briefcase.fill' | 'bell.fill' | 'clock.fill' | 'gear'; bg: string }> = {
  application: { icon: 'briefcase.fill', bg: Colors.light.primaryLight },
  job: { icon: 'briefcase.fill', bg: Colors.light.successLight },
  reminder: { icon: 'clock.fill', bg: Colors.light.warningLight },
  system: { icon: 'gear', bg: Colors.light.surfaceHover },
};

export default function NotificationsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="arrow.left" size={20} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Notifications</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.list, { flexGrow: 1 }]}>
        <View style={styles.emptyState}>
          <IconSymbol name="bell.fill" size={48} color={Colors.light.border} />
          <Text style={styles.emptyTitle}>No notifications yet</Text>
          <Text style={styles.emptyText}>You'll be notified about application updates and new opportunities.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  navBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.light.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.light.border },
  navTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.light.text },
  list: { padding: Spacing.xl, gap: Spacing.md, paddingBottom: 30 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 80, gap: Spacing.sm, flex: 1 },
  emptyTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.light.text },
  emptyText: { fontSize: FontSize.sm, color: Colors.light.textTertiary, textAlign: 'center', maxWidth: 260 },
});
