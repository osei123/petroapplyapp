import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, FontSize } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export default function SavedScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSavedJobs = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('saved_jobs')
        .select(`
          id,
          saved_at,
          jobs (
            id,
            title,
            location,
            deadline,
            employment_type,
            remote_type,
            salary_range,
            companies (
              id,
              name
            )
          )
        `)
        .eq('user_id', user.id)
        .order('saved_at', { ascending: false });

      if (error) throw error;
      setSavedJobs(data || []);
    } catch (err) {
      console.error('Error fetching saved jobs:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, [user]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchSavedJobs();
  }, [user]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Saved Jobs</Text>
        <Text style={styles.subtitle}>{savedJobs.length} jobs saved</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.light.primary} />}
      >
        {loading && !refreshing ? (
          <View style={[styles.emptyState, { paddingVertical: 60 }]}>
            <ActivityIndicator size="large" color={Colors.light.primary} />
          </View>
        ) : savedJobs.length === 0 ? (
          <View style={styles.emptyState}>
            <IconSymbol name="bookmark.fill" size={48} color={Colors.light.border} />
            <Text style={styles.emptyTitle}>No saved jobs yet</Text>
            <Text style={styles.emptyText}>Save jobs you're interested in to review later</Text>
          </View>
        ) : (
          savedJobs.map((saved) => {
            const job = saved.jobs;
            if (!job) return null;

            const companyName = job.companies?.name || 'Unknown Company';
            const savedDate = new Date(saved.saved_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

            return (
              <TouchableOpacity key={saved.id} style={styles.card} onPress={() => router.push(`/job/${job.id}` as any)} activeOpacity={0.7}>
                <View style={styles.cardTop}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{companyName.substring(0, 2).toUpperCase()}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle} numberOfLines={1}>{job.title}</Text>
                    <Text style={styles.cardSub}>{companyName}</Text>
                  </View>
                  <TouchableOpacity style={styles.bookmarkBtn}>
                    <IconSymbol name="bookmark.fill" size={20} color={Colors.light.primary} />
                  </TouchableOpacity>
                </View>

                <View style={styles.cardMeta}>
                  {job.location && (
                    <View style={styles.metaItem}>
                      <IconSymbol name="location.fill" size={13} color={Colors.light.textTertiary} />
                      <Text style={styles.metaText}>{job.location}</Text>
                    </View>
                  )}
                  {job.deadline && (
                    <View style={styles.metaItem}>
                      <IconSymbol name="clock.fill" size={13} color={Colors.light.textTertiary} />
                      <Text style={styles.metaText}>Deadline: {new Date(job.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</Text>
                    </View>
                  )}
                </View>

                <View style={styles.cardFooter}>
                  <View style={styles.tags}>
                    {job.employment_type && <View style={styles.tag}><Text style={styles.tagText}>{job.employment_type}</Text></View>}
                    {job.remote_type && <View style={styles.tag}><Text style={styles.tagText}>{job.remote_type}</Text></View>}
                  </View>
                  {job.salary_range && <Text style={styles.salary}>{job.salary_range}</Text>}
                </View>

                <Text style={styles.savedAt}>Saved {savedDate}</Text>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  header: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg, paddingBottom: Spacing.sm },
  title: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.light.text },
  subtitle: { fontSize: FontSize.sm, color: Colors.light.textSecondary, marginTop: 2 },
  list: { padding: Spacing.xl, gap: Spacing.md, paddingBottom: 30, flexGrow: 1 },
  emptyState: { alignItems: 'center', paddingVertical: 80, gap: Spacing.sm },
  emptyTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.light.text },
  emptyText: { fontSize: FontSize.sm, color: Colors.light.textTertiary, textAlign: 'center' },
  card: { backgroundColor: Colors.light.surface, borderRadius: BorderRadius.xl, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.light.border },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  avatar: { width: 44, height: 44, borderRadius: BorderRadius.lg, backgroundColor: Colors.light.surfaceHover, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.light.textSecondary },
  cardTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.light.text },
  cardSub: { fontSize: FontSize.sm, color: Colors.light.textSecondary, marginTop: 1 },
  bookmarkBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.light.primaryLight, alignItems: 'center', justifyContent: 'center' },
  cardMeta: { flexDirection: 'row', gap: Spacing.lg, marginTop: Spacing.md },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: FontSize.xs, color: Colors.light.textTertiary },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: Spacing.md },
  tags: { flexDirection: 'row', gap: Spacing.sm },
  tag: { backgroundColor: Colors.light.surfaceHover, paddingHorizontal: 10, paddingVertical: 4, borderRadius: BorderRadius.full },
  tagText: { fontSize: FontSize.xs, color: Colors.light.textSecondary, textTransform: 'capitalize' },
  salary: { fontSize: FontSize.md, fontWeight: '700', color: Colors.light.primary },
  savedAt: { fontSize: FontSize.xs, color: Colors.light.textTertiary, marginTop: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.light.borderLight, paddingTop: Spacing.md },
});
