import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, FontSize } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { supabase } from '@/lib/supabase';
import { useFocusEffect } from '@react-navigation/native';

export default function HomeScreen() {
  const router = useRouter();
  const { userProfile } = useAuth();
  const profileCompletion = userProfile?.profile_completion || 0;
  const [featuredJobs, setFeaturedJobs] = useState<any[]>([]);
  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [topCompanies, setTopCompanies] = useState<any[]>([]);
  const [appStats, setAppStats] = useState({ total: 0, pending: 0, interview: 0 });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      // Fetch user context
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;

      // 1. Fetch featured jobs
      const { data: featuredData } = await supabase
        .from('jobs')
        .select(`*, companies (name)`)
        .eq('featured', true)
        .limit(5);

      if (featuredData) setFeaturedJobs(featuredData);

      // 2. Fetch recent jobs
      const { data: recentData } = await supabase
        .from('jobs')
        .select(`*, companies (name)`)
        .order('created_at', { ascending: false })
        .limit(4);

      if (recentData) setRecentJobs(recentData);

      // 3. Fetch top companies
      const { data: companiesData } = await supabase
        .from('companies')
        .select('*')
        .order('job_count', { ascending: false })
        .limit(4);

      if (companiesData) setTopCompanies(companiesData);

      // 4. Fetch user applications if logged in
      if (userId) {
        const { data: applications } = await supabase
          .from('applications')
          .select('status')
          .eq('user_id', userId);

        if (applications) {
          const total = applications.length;
          const pending = applications.filter(a => a.status === 'submitted' || a.status === 'under_review').length;
          const interview = applications.filter(a => a.status === 'shortlisted' || a.status === 'interview').length;
          setAppStats({ total, pending, interview });
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good Morning 👋</Text>
            <Text style={styles.userName}>{userProfile?.full_name || 'Student'}</Text>
          </View>
          <TouchableOpacity style={styles.notifBtn} onPress={() => router.push('/notifications' as any)}>
            <IconSymbol name="bell.fill" size={22} color={Colors.light.text} />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <TouchableOpacity style={styles.searchBar} onPress={() => router.push('/(tabs)/jobs' as any)}>
          <IconSymbol name="magnifyingglass" size={18} color={Colors.light.textTertiary} />
          <Text style={styles.searchText}>Search jobs, companies...</Text>
        </TouchableOpacity>

        {/* Profile Completion */}
        {profileCompletion < 100 && (
          <TouchableOpacity style={styles.profileCard} onPress={() => router.push('/edit-profile' as any)}>
            <View style={styles.profileCardContent}>
              <View style={{ flex: 1 }}>
                <Text style={styles.profileCardTitle}>Complete Your Profile</Text>
                <Text style={styles.profileCardSub}>
                  {profileCompletion}% complete — add more details to stand out
                </Text>
              </View>
              <View style={styles.progressRing}>
                <Text style={styles.progressText}>{profileCompletion}%</Text>
              </View>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${profileCompletion}%` }]} />
            </View>
          </TouchableOpacity>
        )}

        {/* Application Tracker */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Application Tracker</Text>
          <View style={styles.trackerRow}>
            {[
              { label: 'Total', count: appStats.total, color: Colors.light.primary },
              { label: 'Pending', count: appStats.pending, color: Colors.light.warning },
              { label: 'Interview', count: appStats.interview, color: Colors.light.success },
            ].map((item) => (
              <TouchableOpacity key={item.label} style={styles.trackerItem} onPress={() => router.push('/(tabs)/applications' as any)}>
                <Text style={[styles.trackerCount, { color: item.color }]}>{item.count}</Text>
                <Text style={styles.trackerLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Featured Jobs */}
        {featuredJobs.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Featured Jobs</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/jobs' as any)}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={featuredJobs}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ gap: 12 }}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.jobCard} onPress={() => router.push(`/job/${item.id}` as any)}>
                  <View style={styles.jobCardHeader}>
                    <View style={styles.companyAvatar}>
                      <Text style={styles.companyAvatarText}>
                        {item.companies?.name ? item.companies.name.substring(0, 2).toUpperCase() : 'CO'}
                      </Text>
                    </View>
                    <View style={styles.featuredBadge}>
                      <IconSymbol name="star.fill" size={10} color="#f59e0b" />
                      <Text style={styles.featuredText}>Featured</Text>
                    </View>
                  </View>
                  <Text style={styles.jobCardTitle} numberOfLines={1}>{item.title}</Text>
                  <Text style={styles.jobCardCompany}>{item.companies?.name || 'Unknown'}</Text>
                  <View style={styles.jobCardMeta}>
                    <IconSymbol name="location.fill" size={12} color={Colors.light.textTertiary} />
                    <Text style={styles.jobCardLocation}>{item.location || 'Remote'}</Text>
                  </View>
                  <View style={styles.jobCardTags}>
                    <View style={styles.tag}><Text style={styles.tagText}>{item.employment_type}</Text></View>
                    <View style={styles.tag}><Text style={styles.tagText}>{item.remote_type}</Text></View>
                  </View>
                  <Text style={styles.jobCardSalary}>{item.salary_range || 'Competitive'}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {/* Top Companies */}
        {topCompanies.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Top Companies</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/jobs' as any)}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={topCompanies}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ gap: 12 }}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.companyCard} onPress={() => router.push(`/company/${item.id}` as any)}>
                  <View style={styles.companyCardAvatar}>
                    <Text style={styles.companyCardAvatarText}>{item.name.substring(0, 2).toUpperCase()}</Text>
                  </View>
                  <Text style={styles.companyCardName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.companyCardJobs}>{item.job_count || 0} jobs</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {/* Recent Jobs */}
        {recentJobs.length > 0 && (
          <View style={[styles.section, { marginBottom: 30 }]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Jobs</Text>
            </View>
            {recentJobs.map((job) => (
              <TouchableOpacity key={job.id} style={styles.recentJob} onPress={() => router.push(`/job/${job.id}` as any)}>
                <View style={styles.recentJobAvatar}>
                  <Text style={styles.recentJobAvatarText}>
                    {job.companies?.name ? job.companies.name.substring(0, 2).toUpperCase() : 'CO'}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.recentJobTitle} numberOfLines={1}>{job.title}</Text>
                  <Text style={styles.recentJobSub}>{job.companies?.name || 'Unknown'} · {job.location || 'Remote'}</Text>
                </View>
                <Text style={styles.recentJobTime}>
                  {new Date(job.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg, paddingBottom: Spacing.md },
  greeting: { fontSize: FontSize.sm, color: Colors.light.textSecondary },
  userName: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.light.text, marginTop: 2 },
  notifBtn: { width: 44, height: 44, borderRadius: BorderRadius.full, backgroundColor: Colors.light.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.light.border },
  notifDot: { position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.light.primary },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.light.surface, marginHorizontal: Spacing.xl, marginTop: Spacing.md, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md + 2, borderRadius: BorderRadius.xl, borderWidth: 1, borderColor: Colors.light.border, gap: Spacing.sm },
  searchText: { fontSize: FontSize.md, color: Colors.light.textTertiary },
  profileCard: { marginHorizontal: Spacing.xl, marginTop: Spacing.lg, backgroundColor: Colors.light.primaryLight, borderRadius: BorderRadius.xl, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.light.primary + '30' },
  profileCardContent: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  profileCardTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.light.primaryDark },
  profileCardSub: { fontSize: FontSize.sm, color: Colors.light.primary, marginTop: 2 },
  progressRing: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.light.primary, alignItems: 'center', justifyContent: 'center' },
  progressText: { color: '#fff', fontSize: FontSize.sm, fontWeight: '700' },
  progressBar: { height: 4, backgroundColor: Colors.light.primary + '30', borderRadius: 2, marginTop: Spacing.md },
  progressFill: { height: 4, backgroundColor: Colors.light.primary, borderRadius: 2 },
  section: { marginTop: Spacing.xxl, paddingHorizontal: Spacing.xl },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.light.text },
  seeAll: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.light.primary },
  trackerRow: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.md },
  trackerItem: { flex: 1, backgroundColor: Colors.light.surface, borderRadius: BorderRadius.xl, padding: Spacing.lg, alignItems: 'center', borderWidth: 1, borderColor: Colors.light.border },
  trackerCount: { fontSize: FontSize.xxl, fontWeight: '800' },
  trackerLabel: { fontSize: FontSize.sm, color: Colors.light.textSecondary, marginTop: 4 },
  jobCard: { width: 260, backgroundColor: Colors.light.surface, borderRadius: BorderRadius.xl, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.light.border },
  jobCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  companyAvatar: { width: 40, height: 40, borderRadius: BorderRadius.lg, backgroundColor: Colors.light.surfaceHover, alignItems: 'center', justifyContent: 'center' },
  companyAvatarText: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.light.textSecondary },
  featuredBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#fef3c7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: BorderRadius.full },
  featuredText: { fontSize: 10, fontWeight: '700', color: '#92400e' },
  jobCardTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.light.text },
  jobCardCompany: { fontSize: FontSize.sm, color: Colors.light.textSecondary, marginTop: 2 },
  jobCardMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: Spacing.sm },
  jobCardLocation: { fontSize: FontSize.xs, color: Colors.light.textTertiary },
  jobCardTags: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.md },
  tag: { backgroundColor: Colors.light.surfaceHover, paddingHorizontal: 10, paddingVertical: 4, borderRadius: BorderRadius.full },
  tagText: { fontSize: FontSize.xs, color: Colors.light.textSecondary, textTransform: 'capitalize' },
  jobCardSalary: { fontSize: FontSize.md, fontWeight: '700', color: Colors.light.primary, marginTop: Spacing.md },
  companyCard: { width: 130, backgroundColor: Colors.light.surface, borderRadius: BorderRadius.xl, padding: Spacing.lg, alignItems: 'center', borderWidth: 1, borderColor: Colors.light.border },
  companyCardAvatar: { width: 48, height: 48, borderRadius: BorderRadius.lg, backgroundColor: Colors.light.surfaceHover, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.sm },
  companyCardAvatarText: { fontSize: FontSize.md, fontWeight: '700', color: Colors.light.textSecondary },
  companyCardName: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.light.text, textAlign: 'center' },
  companyCardJobs: { fontSize: FontSize.xs, color: Colors.light.textTertiary, marginTop: 2 },
  recentJob: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.light.surface, borderRadius: BorderRadius.lg, padding: Spacing.md, marginTop: Spacing.sm, borderWidth: 1, borderColor: Colors.light.border, gap: Spacing.md },
  recentJobAvatar: { width: 40, height: 40, borderRadius: BorderRadius.lg, backgroundColor: Colors.light.surfaceHover, alignItems: 'center', justifyContent: 'center' },
  recentJobAvatarText: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.light.textSecondary },
  recentJobTitle: { fontSize: FontSize.md, fontWeight: '600', color: Colors.light.text },
  recentJobSub: { fontSize: FontSize.sm, color: Colors.light.textSecondary, marginTop: 2 },
  recentJobTime: { fontSize: FontSize.xs, color: Colors.light.textTertiary },
});
