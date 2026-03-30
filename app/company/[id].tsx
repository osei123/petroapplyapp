import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, FontSize } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { supabase } from '@/lib/supabase';

export default function CompanyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [company, setCompany] = useState<any>(null);
  const [companyJobs, setCompanyJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      const { data: companyData } = await supabase
        .from('companies')
        .select('*')
        .eq('id', id)
        .single();
      
      if (companyData) {
        setCompany(companyData);
        const { data: jobsData } = await supabase
          .from('jobs')
          .select('*')
          .eq('company_id', companyData.id);
        setCompanyJobs(jobsData || []);
      }
      setLoading(false);
    };
    fetchCompany();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </SafeAreaView>
    );
  }

  if (!company) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ padding: 20 }}>Company not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="arrow.left" size={20} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Company</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.headerCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{company.name.substring(0, 2).toUpperCase()}</Text>
          </View>
          <Text style={styles.companyName}>{company.name}</Text>
          <Text style={styles.industry}>{company.industry_segment}</Text>
          <View style={styles.metaRow}>
            <IconSymbol name="location.fill" size={14} color={Colors.light.textTertiary} />
            <Text style={styles.metaText}>{company.headquarters}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statCount}>{company.job_count || companyJobs.length}</Text>
            <Text style={styles.statLabel}>Open Jobs</Text>
          </View>
          <View style={[styles.statItem, { borderLeftWidth: 1, borderRightWidth: 1, borderColor: Colors.light.border }]}>
            <Text style={styles.statCount}>Global</Text>
            <Text style={styles.statLabel}>Presence</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statCount}>4.5★</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        {company.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.aboutText}>{company.description}</Text>
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Open Positions ({companyJobs.length})</Text>
          </View>
          {companyJobs.length === 0 ? (
            <Text style={styles.emptyText}>No open positions currently.</Text>
          ) : (
            companyJobs.map((job) => (
              <TouchableOpacity key={job.id} style={styles.jobItem} onPress={() => router.push(`/job/${job.id}` as any)}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.jobTitle}>{job.title}</Text>
                  <Text style={styles.jobSub}>{job.location} · {job.employment_type}</Text>
                </View>
                <View style={styles.salaryBadge}>
                  <Text style={styles.salaryText}>{job.salary_range || 'Competitive'}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
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
  avatar: { width: 72, height: 72, borderRadius: BorderRadius.xl, backgroundColor: Colors.light.surfaceHover, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md },
  avatarText: { fontSize: FontSize.xxl, fontWeight: '700', color: Colors.light.textSecondary },
  companyName: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.light.text },
  industry: { fontSize: FontSize.md, color: Colors.light.primary, fontWeight: '600', marginTop: 4 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: Spacing.sm },
  metaText: { fontSize: FontSize.sm, color: Colors.light.textTertiary },
  statsRow: { flexDirection: 'row', backgroundColor: Colors.light.surface, borderRadius: BorderRadius.xl, marginTop: Spacing.lg, borderWidth: 1, borderColor: Colors.light.border },
  statItem: { flex: 1, alignItems: 'center', paddingVertical: Spacing.lg },
  statCount: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.light.text },
  statLabel: { fontSize: FontSize.xs, color: Colors.light.textTertiary, marginTop: 2 },
  section: { marginTop: Spacing.xxl },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.light.text, marginBottom: Spacing.md },
  aboutText: { fontSize: FontSize.md, color: Colors.light.textSecondary, lineHeight: 24 },
  emptyText: { fontSize: FontSize.md, color: Colors.light.textTertiary, textAlign: 'center', paddingVertical: 20 },
  jobItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.light.surface, borderRadius: BorderRadius.lg, padding: Spacing.lg, marginBottom: Spacing.sm, borderWidth: 1, borderColor: Colors.light.border },
  jobTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.light.text },
  jobSub: { fontSize: FontSize.sm, color: Colors.light.textSecondary, marginTop: 2, textTransform: 'capitalize' },
  salaryBadge: { backgroundColor: Colors.light.primaryLight, paddingHorizontal: 10, paddingVertical: 6, borderRadius: BorderRadius.full },
  salaryText: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.light.primaryDark },
});
