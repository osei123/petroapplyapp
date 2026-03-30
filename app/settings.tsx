import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, FontSize } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';

function SettingsToggle({ label, description, initialValue = false }: { label: string; description: string; initialValue?: boolean }) {
  const [value, setValue] = useState(initialValue);
  return (
    <View style={styles.toggleRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.toggleLabel}>{label}</Text>
        <Text style={styles.toggleDesc}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={setValue}
        trackColor={{ false: Colors.light.border, true: Colors.light.primary + '60' }}
        thumbColor={value ? Colors.light.primary : Colors.light.surfaceHover}
      />
    </View>
  );
}

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="arrow.left" size={20} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Notifications */}
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.card}>
          <SettingsToggle label="Push Notifications" description="Receive push notifications on your device" initialValue={true} />
          <SettingsToggle label="Email Notifications" description="Receive updates via email" initialValue={true} />
          <SettingsToggle label="Job Alerts" description="Get notified when new jobs match your profile" initialValue={true} />
          <SettingsToggle label="Deadline Reminders" description="Reminders before application deadlines" initialValue={true} />
        </View>

        {/* Privacy */}
        <Text style={styles.sectionTitle}>Privacy</Text>
        <View style={styles.card}>
          <SettingsToggle label="Profile Visibility" description="Make your profile visible to employers" initialValue={true} />
          <SettingsToggle label="Show Activity" description="Show when you were last active" initialValue={false} />
        </View>

        {/* Account */}
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuLabel}>Change Password</Text>
            <IconSymbol name="chevron.right" size={16} color={Colors.light.textTertiary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuLabel}>Delete Account</Text>
            <IconSymbol name="chevron.right" size={16} color={Colors.light.error} />
          </TouchableOpacity>
        </View>

        {/* About */}
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.card}>
          <View style={styles.menuItem}>
            <Text style={styles.menuLabel}>Version</Text>
            <Text style={styles.menuValue}>1.0.0</Text>
          </View>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuLabel}>Terms of Service</Text>
            <IconSymbol name="chevron.right" size={16} color={Colors.light.textTertiary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuLabel}>Privacy Policy</Text>
            <IconSymbol name="chevron.right" size={16} color={Colors.light.textTertiary} />
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  navBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.light.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.light.border },
  navTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.light.text },
  content: { paddingHorizontal: Spacing.xl, paddingBottom: 40 },
  sectionTitle: { fontWeight: '700', color: Colors.light.textSecondary, marginTop: Spacing.xxl, marginBottom: Spacing.md, textTransform: 'uppercase', letterSpacing: 0.5, fontSize: FontSize.xs },
  card: { backgroundColor: Colors.light.surface, borderRadius: BorderRadius.xl, borderWidth: 1, borderColor: Colors.light.border, overflow: 'hidden' },
  toggleRow: { flexDirection: 'row', alignItems: 'center', padding: Spacing.lg, borderBottomWidth: 1, borderBottomColor: Colors.light.borderLight },
  toggleLabel: { fontSize: FontSize.md, fontWeight: '600', color: Colors.light.text },
  toggleDesc: { fontSize: FontSize.xs, color: Colors.light.textTertiary, marginTop: 2 },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.lg, borderBottomWidth: 1, borderBottomColor: Colors.light.borderLight },
  menuLabel: { fontSize: FontSize.md, fontWeight: '600', color: Colors.light.text },
  menuValue: { fontSize: FontSize.md, color: Colors.light.textTertiary },
  logoutBtn: { backgroundColor: Colors.light.errorLight, borderRadius: BorderRadius.xl, padding: Spacing.lg, alignItems: 'center', marginTop: Spacing.xxl },
  logoutText: { fontSize: FontSize.md, fontWeight: '700', color: Colors.light.error },
});
