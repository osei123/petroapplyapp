import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, FontSize } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export default function JobDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [savingBookmark, setSavingBookmark] = useState(false);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    async function fetchJob() {
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('*, companies (*)')
          .eq('id', id)
          .single();

        if (data) setJob(data);

        // Check if user has saved this job
        if (user) {
          const { data: savedData } = await supabase
            .from('saved_jobs')
            .select('id')
            .eq('user_id', user.id)
            .eq('job_id', id)
            .maybeSingle();
          
          setIsSaved(!!savedData);

          // Check if user already applied
          const { data: appData } = await supabase
            .from('applications')
            .select('id')
            .eq('user_id', user.id)
            .eq('job_id', id)
            .maybeSingle();
          
          setHasApplied(!!appData);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchJob();
  }, [id, user]);

  const toggleSave = async () => {
    if (!user || savingBookmark) return;
    setSavingBookmark(true);

    try {
      if (isSaved) {
        // Unsave
        const { error } = await supabase
          .from('saved_jobs')
          .delete()
          .eq('user_id', user.id)
          .eq('job_id', id);
        
        if (error) throw error;
        setIsSaved(false);
      } else {
        // Save
        const { error } = await supabase
          .from('saved_jobs')
          .insert({ user_id: user.id, job_id: id });
        
        if (error) throw error;
        setIsSaved(true);
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to update bookmark.');
    } finally {
      setSavingBookmark(false);
    }
  };

  const handleApply = async () => {
    if (!user || applying) return;
    if (hasApplied) {
      Alert.alert('Already Applied', 'You have already submitted an application for this job.');
      return;
    }

    Alert.alert(
      'Apply for this job?',
      `Submit your application to ${job?.companies?.name || 'this company'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Apply',
          onPress: async () => {
            setApplying(true);
            try {
              const { error } = await supabase
                .from('applications')
                .insert({
                  user_id: user.id,
                  job_id: id,
                  status: 'submitted',
                });

              if (error) throw error;
              setHasApplied(true);
              Alert.alert('Success!', 'Your application has been submitted successfully.');
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Failed to submit application.');
            } finally {
              setApplying(false);
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </SafeAreaView>
    );
  }

  if (!job) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.navBar}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <IconSymbol name="arrow.left" size={20} color={Colors.light.text} />
          </TouchableOpacity>
        </View>
        <Text style={{ padding: 20, textAlign: 'center', fontSize: 16 }}>Job not found</Text>
      </SafeAreaView>
    );
  }

  const companyName = job.companies?.name || 'Unknown Company';
  const companyInitial = companyName.substring(0, 2).toUpperCase();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Nav Header */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="arrow.left" size={20} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.navTitle} numberOfLines={1}>Job Details</Text>
        <TouchableOpacity
          style={[styles.backBtn, isSaved && { backgroundColor: Colors.light.primaryLight, borderColor: Colors.light.primary + '40' }]}
          onPress={toggleSave}
          disabled={savingBookmark}
        >
          {savingBookmark ? (
            <ActivityIndicator size="small" color={Colors.light.primary} />
          ) : (
            <IconSymbol
              name={isSaved ? "bookmark.fill" : "bookmark"}
              size={20}
              color={Colors.light.primary}
            />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.headerCard}>
          <View style={styles.companyAvatar}>
            <Text style={styles.avatarText}>{companyInitial}</Text>
          </View>
          <Text style={styles.jobTitle}>{job.title}</Text>
          <TouchableOpacity onPress={() => router.push(`/company/${job.company_id}` as any)}>
            <Text style={styles.companyLink}>{companyName}</Text>
          </TouchableOpacity>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <IconSymbol name="location.fill" size={14} color={Colors.light.textTertiary} />
              <Text style={styles.metaText}>{job.location || 'Remote'}</Text>
            </View>
            <View style={styles.metaItem}>
              <IconSymbol name="clock.fill" size={14} color={Colors.light.textTertiary} />
              <Text style={styles.metaText}>
                {new Date(job.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </Text>
            </View>
          </View>

          {job.featured && (
            <View style={styles.featuredBadge}>
              <IconSymbol name="star.fill" size={12} color="#f59e0b" />
              <Text style={styles.featuredText}>Featured</Text>
            </View>
          )}
        </View>

        {/* Quick Info */}
        <View style={styles.quickInfo}>
          {[
            { label: 'Type', value: job.employment_type || 'Full-time' },
            { label: 'Mode', value: job.remote_type || 'On-site' },
            { label: 'Level', value: job.experience_level || 'Mid' },
          ].map((item) => (
            <View key={item.label} style={styles.quickItem}>
              <Text style={styles.quickLabel}>{item.label}</Text>
              <Text style={styles.quickValue}>{item.value}</Text>
            </View>
          ))}
        </View>

        {/* Salary */}
        <View style={styles.salaryCard}>
          <Text style={styles.salaryLabel}>Salary Range</Text>
          <Text style={styles.salaryValue}>{job.salary_range || 'Competitive'}</Text>
          {job.deadline && (
            <Text style={styles.deadlineText}>Deadline: {job.deadline}</Text>
          )}
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{job.description}</Text>
        </View>

        {/* Requirements */}
        {job.requirements && job.requirements.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Requirements</Text>
            {job.requirements.map((req: string, i: number) => (
              <View key={i} style={styles.reqItem}>
                <View style={styles.reqDot} />
                <Text style={styles.reqText}>{req}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Apply Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.applyBtn, hasApplied && { backgroundColor: Colors.light.success }]}
          activeOpacity={0.8}
          onPress={handleApply}
          disabled={applying || hasApplied}
        >
          {applying ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.applyBtnText}>{hasApplied ? '✓ Applied' : 'Apply Now'}</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  navBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.light.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.light.border },
  navTitle: { flex: 1, fontSize: FontSize.lg, fontWeight: '700', color: Colors.light.text, textAlign: 'center', marginHorizontal: Spacing.md },
  content: { paddingHorizontal: Spacing.xl, paddingBottom: 100 },
  headerCard: { alignItems: 'center', backgroundColor: Colors.light.surface, borderRadius: BorderRadius.xxl, padding: Spacing.xxl, borderWidth: 1, borderColor: Colors.light.border },
  companyAvatar: { width: 60, height: 60, borderRadius: BorderRadius.xl, backgroundColor: Colors.light.surfaceHover, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md },
  avatarText: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.light.textSecondary },
  jobTitle: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.light.text, textAlign: 'center' },
  companyLink: { fontSize: FontSize.md, color: Colors.light.primary, fontWeight: '600', marginTop: 4 },
  metaRow: { flexDirection: 'row', gap: Spacing.lg, marginTop: Spacing.md },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: FontSize.sm, color: Colors.light.textTertiary },
  featuredBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#fef3c7', paddingHorizontal: 12, paddingVertical: 6, borderRadius: BorderRadius.full, marginTop: Spacing.md },
  featuredText: { fontSize: FontSize.sm, fontWeight: '700', color: '#92400e' },
  quickInfo: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.lg },
  quickItem: { flex: 1, backgroundColor: Colors.light.surface, borderRadius: BorderRadius.lg, padding: Spacing.md, alignItems: 'center', borderWidth: 1, borderColor: Colors.light.border },
  quickLabel: { fontSize: FontSize.xs, color: Colors.light.textTertiary, textTransform: 'uppercase' },
  quickValue: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.light.text, marginTop: 4, textTransform: 'capitalize' },
  salaryCard: { backgroundColor: Colors.light.primaryLight, borderRadius: BorderRadius.xl, padding: Spacing.lg, marginTop: Spacing.lg, alignItems: 'center' },
  salaryLabel: { fontSize: FontSize.sm, color: Colors.light.primary },
  salaryValue: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.light.primaryDark, marginTop: 4 },
  deadlineText: { fontSize: FontSize.sm, color: Colors.light.primary, marginTop: 4 },
  section: { marginTop: Spacing.xxl },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.light.text, marginBottom: Spacing.md },
  description: { fontSize: FontSize.md, color: Colors.light.textSecondary, lineHeight: 24 },
  reqItem: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm, marginBottom: Spacing.sm },
  reqDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.light.primary, marginTop: 7 },
  reqText: { flex: 1, fontSize: FontSize.md, color: Colors.light.textSecondary, lineHeight: 22 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: Colors.light.surface, padding: Spacing.xl, paddingBottom: 36, borderTopWidth: 1, borderTopColor: Colors.light.border },
  applyBtn: { backgroundColor: Colors.light.primary, borderRadius: BorderRadius.xl, paddingVertical: Spacing.lg, alignItems: 'center' },
  applyBtnText: { fontSize: FontSize.md, fontWeight: '700', color: '#fff' },
});
