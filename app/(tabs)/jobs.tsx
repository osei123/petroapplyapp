import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, FontSize } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { supabase } from '@/lib/supabase';
import { useFocusEffect } from '@react-navigation/native';

const filters = ['All', 'Full-Time', 'Part-Time', 'Internship', 'Contract'];

export default function JobsScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select(`*, companies (name)`)
        .order('created_at', { ascending: false });

      if (data) setJobs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchJobs();
    }, [])
  );

  const filtered = jobs.filter((j) => {
    const companyName = j.companies?.name || '';
    const jobTitle = j.title || '';
    const location = j.location || '';
    const empType = j.employment_type || '';

    const matchesSearch = jobTitle.toLowerCase().includes(search.toLowerCase()) ||
      companyName.toLowerCase().includes(search.toLowerCase()) ||
      location.toLowerCase().includes(search.toLowerCase());
      
    const matchesFilter = activeFilter === 'All' ||
      empType.toLowerCase().replace('-', '-') === activeFilter.toLowerCase().replace('-', '-');
      
    return matchesSearch && matchesFilter;
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Explore Jobs</Text>
        <Text style={styles.subtitle}>{jobs.length} opportunities available</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <IconSymbol name="magnifyingglass" size={18} color={Colors.light.textTertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search jobs, companies, locations..."
            placeholderTextColor={Colors.light.textTertiary}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {/* Filters */}
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll} contentContainerStyle={styles.filtersContainer}>
          {filters.map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setActiveFilter(f)}
              style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
            >
              <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Job List */}
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContainer}>
          {filtered.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No jobs found matching your criteria</Text>
            </View>
          ) : (
            filtered.map((job) => (
              <TouchableOpacity key={job.id} style={styles.jobCard} onPress={() => router.push(`/job/${job.id}` as any)} activeOpacity={0.7}>
                <View style={styles.jobCardTop}>
                  <View style={styles.companyAvatar}>
                    <Text style={styles.avatarText}>
                      {job.companies?.name ? job.companies.name.substring(0, 2).toUpperCase() : 'CO'}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.jobTitle} numberOfLines={1}>{job.title}</Text>
                    <Text style={styles.jobCompany}>{job.companies?.name || 'Unknown'}</Text>
                  </View>
                  {job.featured && (
                    <View style={styles.featuredBadge}>
                      <IconSymbol name="star.fill" size={10} color="#f59e0b" />
                    </View>
                  )}
                </View>

                <View style={styles.jobMeta}>
                  <View style={styles.metaItem}>
                    <IconSymbol name="location.fill" size={13} color={Colors.light.textTertiary} />
                    <Text style={styles.metaText}>{job.location || 'Remote'}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <IconSymbol name="clock.fill" size={13} color={Colors.light.textTertiary} />
                    <Text style={styles.metaText}>
                      {new Date(job.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </Text>
                  </View>
                </View>

                <View style={styles.jobFooter}>
                  <View style={styles.tagsRow}>
                    <View style={styles.tag}><Text style={styles.tagText}>{job.employment_type}</Text></View>
                    <View style={styles.tag}><Text style={styles.tagText}>{job.remote_type}</Text></View>
                    <View style={styles.tag}><Text style={styles.tagText}>{job.experience_level}</Text></View>
                  </View>
                  <Text style={styles.salary}>{job.salary_range || 'Competitive'}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  header: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg, paddingBottom: Spacing.sm },
  title: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.light.text },
  subtitle: { fontSize: FontSize.sm, color: Colors.light.textSecondary, marginTop: 2 },
  searchContainer: { paddingHorizontal: Spacing.xl, marginTop: Spacing.sm },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.light.surface, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, borderRadius: BorderRadius.xl, borderWidth: 1, borderColor: Colors.light.border, gap: Spacing.sm },
  searchInput: { flex: 1, fontSize: FontSize.md, color: Colors.light.text },
  filtersScroll: { marginTop: Spacing.md },
  filtersContainer: { paddingHorizontal: Spacing.xl, gap: Spacing.sm },
  filterChip: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: BorderRadius.full, backgroundColor: Colors.light.surface, borderWidth: 1, borderColor: Colors.light.border },
  filterChipActive: { backgroundColor: Colors.light.primary, borderColor: Colors.light.primary },
  filterText: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.light.textSecondary },
  filterTextActive: { color: '#fff' },
  listContainer: { padding: Spacing.xl, gap: Spacing.md, paddingBottom: 30 },
  emptyState: { alignItems: 'center', paddingVertical: 60 },
  emptyText: { fontSize: FontSize.md, color: Colors.light.textTertiary },
  jobCard: { backgroundColor: Colors.light.surface, borderRadius: BorderRadius.xl, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.light.border },
  jobCardTop: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  companyAvatar: { width: 44, height: 44, borderRadius: BorderRadius.lg, backgroundColor: Colors.light.surfaceHover, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.light.textSecondary },
  jobTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.light.text },
  jobCompany: { fontSize: FontSize.sm, color: Colors.light.textSecondary, marginTop: 1 },
  featuredBadge: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#fef3c7', alignItems: 'center', justifyContent: 'center' },
  jobMeta: { flexDirection: 'row', gap: Spacing.lg, marginTop: Spacing.md },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: FontSize.xs, color: Colors.light.textTertiary },
  jobFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: Spacing.md },
  tagsRow: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap', flex: 1 },
  tag: { backgroundColor: Colors.light.surfaceHover, paddingHorizontal: 10, paddingVertical: 4, borderRadius: BorderRadius.full },
  tagText: { fontSize: FontSize.xs, color: Colors.light.textSecondary, textTransform: 'capitalize' },
  salary: { fontSize: FontSize.md, fontWeight: '700', color: Colors.light.primary },
});
