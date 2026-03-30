import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, FontSize } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { supabase } from '@/lib/supabase';

const statusColors: Record<string, { bg: string; text: string }> = {
  submitted: { bg: Colors.light.surfaceHover, text: Colors.light.textSecondary },
  under_review: { bg: Colors.light.primaryLight, text: Colors.light.primaryDark },
  shortlisted: { bg: Colors.light.warningLight, text: '#92400e' },
  interview: { bg: '#e0e7ff', text: '#3730a3' },
  rejected: { bg: Colors.light.errorLight, text: '#991b1b' },
  hired: { bg: Colors.light.successLight, text: '#065f46' },
};

const statusSteps = ['Submitted', 'Under Review', 'Shortlisted', 'Interview', 'Hired'];
const statusKeys = ['submitted', 'under_review', 'shortlisted', 'interview', 'hired'];

export default function ApplicationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [app, setApp] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplication = async () => {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          id,
          status,
          applied_at,
          job_id,
          jobs (
            id,
            title,
            companies (
              id,
              name
            )
          )
        `)
        .eq('id', id)
        .single();

      if (!error && data) setApp(data);
      setLoading(false);
    };
    fetchApplication();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </SafeAreaView>
    );
  }

  if (!app) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ padding: 20 }}>Application not found</Text>
      </SafeAreaView>
    );
  }

  const jobTitle = app.jobs?.title || 'Unknown Job';
  const companyName = app.jobs?.companies?.name || 'Unknown Company';
  const appliedDate = new Date(app.applied_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const statusStyle = statusColors[app.status] || statusColors.submitted;
  const currentStepIdx = statusKeys.indexOf(app.status);
  const isRejected = app.status === 'rejected';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="arrow.left" size={20} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Application</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.headerCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{companyName.substring(0, 2).toUpperCase()}</Text>
          </View>
          <Text style={styles.jobTitle}>{jobTitle}</Text>
          <Text style={styles.companyName}>{companyName}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
            <Text style={[styles.statusText, { color: statusStyle.text }]}>
              {app.status.replace('_', ' ')}
            </Text>
          </View>
          <Text style={styles.appliedDate}>Applied {appliedDate}</Text>
        </View>

        {/* Progress Timeline */}
        <View style={styles.timelineCard}>
          <Text style={styles.timelineTitle}>Application Progress</Text>
          {statusSteps.map((step, i) => {
            const isComplete = !isRejected && i <= currentStepIdx;
            const isCurrent = !isRejected && i === currentStepIdx;
            return (
              <View key={step} style={styles.timelineItem}>
                <View style={styles.timelineDotContainer}>
                  <View style={[styles.timelineDot,
                    isComplete && { backgroundColor: Colors.light.primary },
                    isRejected && { backgroundColor: Colors.light.error },
                    isCurrent && { borderWidth: 3, borderColor: Colors.light.primary + '40' },
                  ]} />
                  {i < statusSteps.length - 1 && (
                    <View style={[styles.timelineLine,
                      isComplete && i < currentStepIdx && { backgroundColor: Colors.light.primary },
                    ]} />
                  )}
                </View>
                <View style={styles.timelineContent}>
                  <Text style={[styles.timelineStep,
                    isComplete && { color: Colors.light.text, fontWeight: '700' },
                    isRejected && { color: Colors.light.error },
                  ]}>{step}</Text>
                  {isCurrent && <Text style={styles.timelineCurrent}>Current stage</Text>}
                </View>
              </View>
            );
          })}
          {isRejected && (
            <View style={styles.rejectedNote}>
              <Text style={styles.rejectedText}>Unfortunately, your application was not selected. Don't give up — keep applying!</Text>
            </View>
          )}
        </View>

        {/* Actions */}
        <View style={styles.actionsCard}>
          <TouchableOpacity style={styles.actionItem} onPress={() => router.push(`/job/${app.job_id}` as any)}>
            <IconSymbol name="briefcase.fill" size={20} color={Colors.light.primary} />
            <Text style={styles.actionText}>View Job Details</Text>
            <IconSymbol name="chevron.right" size={16} color={Colors.light.textTertiary} />
          </TouchableOpacity>
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
  content: { paddingHorizontal: Spacing.xl, paddingBottom: 30 },
  headerCard: { alignItems: 'center', backgroundColor: Colors.light.surface, borderRadius: BorderRadius.xxl, padding: Spacing.xxl, borderWidth: 1, borderColor: Colors.light.border },
  avatar: { width: 56, height: 56, borderRadius: BorderRadius.xl, backgroundColor: Colors.light.surfaceHover, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md },
  avatarText: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.light.textSecondary },
  jobTitle: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.light.text, textAlign: 'center' },
  companyName: { fontSize: FontSize.md, color: Colors.light.textSecondary, marginTop: 4 },
  statusBadge: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: BorderRadius.full, marginTop: Spacing.md },
  statusText: { fontSize: FontSize.sm, fontWeight: '700', textTransform: 'capitalize' },
  appliedDate: { fontSize: FontSize.sm, color: Colors.light.textTertiary, marginTop: Spacing.sm },
  timelineCard: { backgroundColor: Colors.light.surface, borderRadius: BorderRadius.xxl, padding: Spacing.xxl, marginTop: Spacing.lg, borderWidth: 1, borderColor: Colors.light.border },
  timelineTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.light.text, marginBottom: Spacing.lg },
  timelineItem: { flexDirection: 'row', gap: Spacing.md },
  timelineDotContainer: { alignItems: 'center', width: 20 },
  timelineDot: { width: 14, height: 14, borderRadius: 7, backgroundColor: Colors.light.border },
  timelineLine: { width: 2, height: 32, backgroundColor: Colors.light.border, marginVertical: 4 },
  timelineContent: { flex: 1, paddingBottom: Spacing.lg },
  timelineStep: { fontSize: FontSize.md, color: Colors.light.textTertiary },
  timelineCurrent: { fontSize: FontSize.xs, color: Colors.light.primary, fontWeight: '600', marginTop: 2 },
  rejectedNote: { marginTop: Spacing.md, backgroundColor: Colors.light.errorLight, borderRadius: BorderRadius.lg, padding: Spacing.md },
  rejectedText: { fontSize: FontSize.sm, color: '#991b1b', lineHeight: 20 },
  actionsCard: { backgroundColor: Colors.light.surface, borderRadius: BorderRadius.xl, marginTop: Spacing.lg, borderWidth: 1, borderColor: Colors.light.border, overflow: 'hidden' },
  actionItem: { flexDirection: 'row', alignItems: 'center', padding: Spacing.lg, gap: Spacing.md },
  actionText: { flex: 1, fontSize: FontSize.md, fontWeight: '600', color: Colors.light.text },
});
