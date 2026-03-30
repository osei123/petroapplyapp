import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, FontSize } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

const menuItems = [
  { label: 'Edit Profile', icon: 'person.fill' as const, route: '/edit-profile' },
  { label: 'Documents', icon: 'doc.text.fill' as const, route: '/documents' },
  { label: 'Notifications', icon: 'bell.fill' as const, route: '/notifications' },
  { label: 'Settings', icon: 'gear' as const, route: '/settings' },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { user, userProfile } = useAuth();

  if (!userProfile) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  const initials = userProfile.full_name 
    ? userProfile.full_name.split(" ").map((n: string) => n[0]).join("").substring(0, 2) 
    : "PA";

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <TouchableOpacity style={styles.editBadge}>
              <IconSymbol name="person.fill" size={12} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.fullName}>{userProfile.full_name || "Petro Scholar"}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          <Text style={styles.degree}>{userProfile.degree || "Degree"} · {userProfile.university || "University"}</Text>

          {/* Completion */}
          <View style={styles.completionCard}>
            <View style={styles.completionTop}>
              <Text style={styles.completionLabel}>Profile Completion</Text>
              <Text style={styles.completionValue}>{userProfile.profile_completion || 0}%</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${userProfile.profile_completion || 0}%` }]} />
            </View>
          </View>
        </View>

        {/* Bio */}
        {userProfile.bio && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <View style={styles.bioCard}>
              <Text style={styles.bioText}>{userProfile.bio}</Text>
            </View>
          </View>
        )}

        {/* Skills */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <View style={styles.skillsWrap}>
            {userProfile.skills && userProfile.skills.length > 0 ? userProfile.skills.map((skill: string) => (
              <View key={skill} style={styles.skillChip}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            )) : (
              <Text style={{ color: Colors.light.textTertiary, fontSize: FontSize.sm }}>No skills added yet.</Text>
            )}
          </View>
        </View>

        {/* Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          <View style={styles.detailsCard}>
            {[
              { label: 'Country', value: userProfile.country || "N/A" },
              { label: 'Phone', value: userProfile.phone || "N/A" },
              { label: 'Graduation', value: userProfile.graduation_year ? String(userProfile.graduation_year) : "N/A" },
              { label: 'LinkedIn', value: userProfile.linkedin_url || "N/A" },
            ].map((item) => (
              <View key={item.label} style={styles.detailRow}>
                <Text style={styles.detailLabel}>{item.label}</Text>
                <Text style={styles.detailValue} numberOfLines={1}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Menu */}
        <View style={[styles.section, { marginBottom: 30 }]}>
          <View style={styles.menuCard}>
            {menuItems.map((item) => (
              <TouchableOpacity key={item.label} style={[styles.menuItem, styles.menuBorder]}
                onPress={() => router.push(item.route as any)}>
                <IconSymbol name={item.icon} size={20} color={Colors.light.primary} />
                <Text style={styles.menuLabel}>{item.label}</Text>
                <IconSymbol name="chevron.right" size={16} color={Colors.light.textTertiary} />
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.menuItem} onPress={async () => await supabase.auth.signOut()}>
              <IconSymbol name="xmark.circle.fill" size={20} color="#ef4444" />
              <Text style={[styles.menuLabel, { color: "#ef4444" }]}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  header: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg },
  headerTitle: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.light.text },
  profileCard: { alignItems: 'center', marginTop: Spacing.xxl, marginHorizontal: Spacing.xl, backgroundColor: Colors.light.surface, borderRadius: BorderRadius.xxl, padding: Spacing.xxl, borderWidth: 1, borderColor: Colors.light.border },
  avatarContainer: { position: 'relative', marginBottom: Spacing.md },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.light.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: FontSize.xxl, fontWeight: '800', color: '#fff', textTransform: 'uppercase' },
  editBadge: { position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.light.primaryDark, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: Colors.light.surface },
  fullName: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.light.text },
  email: { fontSize: FontSize.sm, color: Colors.light.textSecondary, marginTop: 2 },
  degree: { fontSize: FontSize.sm, color: Colors.light.textTertiary, marginTop: 4, textAlign: 'center' },
  completionCard: { width: '100%', backgroundColor: Colors.light.primaryLight, borderRadius: BorderRadius.lg, padding: Spacing.md, marginTop: Spacing.lg },
  completionTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.sm },
  completionLabel: { fontSize: FontSize.sm, color: Colors.light.primaryDark, fontWeight: '600' },
  completionValue: { fontSize: FontSize.sm, color: Colors.light.primaryDark, fontWeight: '700' },
  progressBar: { height: 6, backgroundColor: Colors.light.primary + '30', borderRadius: 3 },
  progressFill: { height: 6, backgroundColor: Colors.light.primary, borderRadius: 3 },
  section: { marginTop: Spacing.xxl, paddingHorizontal: Spacing.xl },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.light.text, marginBottom: Spacing.md },
  bioCard: { backgroundColor: Colors.light.surface, borderRadius: BorderRadius.xl, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.light.border },
  bioText: { fontSize: FontSize.md, color: Colors.light.textSecondary, lineHeight: 22 },
  skillsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  skillChip: { backgroundColor: Colors.light.primaryLight, paddingHorizontal: 14, paddingVertical: 8, borderRadius: BorderRadius.full },
  skillText: { fontSize: FontSize.sm, color: Colors.light.primaryDark, fontWeight: '600', textTransform: 'capitalize' },
  detailsCard: { backgroundColor: Colors.light.surface, borderRadius: BorderRadius.xl, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.light.border },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.light.borderLight },
  detailLabel: { fontSize: FontSize.sm, color: Colors.light.textTertiary },
  detailValue: { fontSize: FontSize.sm, color: Colors.light.text, fontWeight: '600', maxWidth: '60%' },
  menuCard: { backgroundColor: Colors.light.surface, borderRadius: BorderRadius.xl, borderWidth: 1, borderColor: Colors.light.border, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: Spacing.lg, gap: Spacing.md },
  menuBorder: { borderBottomWidth: 1, borderBottomColor: Colors.light.borderLight },
  menuLabel: { flex: 1, fontSize: FontSize.md, fontWeight: '600', color: Colors.light.text },
});
