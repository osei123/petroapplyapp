import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, FontSize } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

const statusColors: Record<string, { bg: string; text: string }> = {
  submitted: { bg: Colors.light.surfaceHover, text: Colors.light.textSecondary },
  under_review: { bg: Colors.light.primaryLight, text: Colors.light.primaryDark },
  shortlisted: { bg: Colors.light.warningLight, text: '#92400e' },
  interview: { bg: '#e0e7ff', text: '#3730a3' },
  rejected: { bg: Colors.light.errorLight, text: '#991b1b' },
  hired: { bg: Colors.light.successLight, text: '#065f46' },
};

const tabs = ['All', 'Active', 'Completed'];

export default function ApplicationsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState('All');
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchApplications = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          id,
          status,
          applied_at,
          jobs (
            id,
            title,
            companies (
              id,
              name
            )
          )
        `)
        .eq('user_id', user.id)
        .order('applied_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [user]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchApplications();
  }, [user]);

  const filtered = applications.filter((a) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Active') return ['submitted', 'under_review', 'shortlisted', 'interview'].includes(a.status);
    return ['rejected', 'hired'].includes(a.status);
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>My Applications</Text>
        <Text style={styles.subtitle}>{applications.length} total applications</Text>
      </View>

      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}
            style={[styles.tab, activeTab === tab && styles.tabActive]}>
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.light.primary} />}
      >
        {loading && !refreshing ? (
          <View style={[styles.emptyState, { paddingTop: 60 }]}>
            <ActivityIndicator size="large" color={Colors.light.primary} />
          </View>
        ) : filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No applications found.</Text>
            {activeTab !== 'All' && <Text style={[styles.emptyText, { marginTop: 4, fontSize: FontSize.sm }]}>Try changing your filter.</Text>}
          </View>
        ) : (
          filtered.map((app) => {
            const statusStyle = statusColors[app.status] || statusColors.submitted;
            const jobTitle = app?.jobs?.title || 'Unknown Job';
            const companyName = app?.jobs?.companies?.name || 'Unknown Company';
            
            // Format date correctly
            const appliedDate = new Date(app.applied_at);
            const formattedDate = appliedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

            return (
              <TouchableOpacity key={app.id} style={styles.card} onPress={() => router.push(`/application/${app.id}` as any)} activeOpacity={0.7}>
                <View style={styles.cardTop}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{companyName.substring(0, 2).toUpperCase()}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle} numberOfLines={1}>{jobTitle}</Text>
                    <Text style={styles.cardSub}>{companyName}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                    <Text style={[styles.statusText, { color: statusStyle.text }]}>
                      {app.status.replace('_', ' ')}
                    </Text>
                  </View>
                </View>
                <View style={styles.cardBottom}>
                  <Text style={styles.dateText}>Applied {formattedDate}</Text>
                  <View style={styles.statusDots}>
                    {['submitted', 'under_review', 'shortlisted', 'interview', 'hired'].map((step, i) => {
                      const currentIdx = ['submitted', 'under_review', 'shortlisted', 'interview', 'hired'].indexOf(app.status);
                      const isRejected = app.status === 'rejected';
                      return (
                         <View key={step} style={[styles.dot,
                          i <= currentIdx && !isRejected && { backgroundColor: Colors.light.primary },
                          isRejected && { backgroundColor: Colors.light.error },
                        ]} />
                      );
                    })}
                  </View>
                </View>
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
  tabBar: { flexDirection: 'row', marginHorizontal: Spacing.xl, marginTop: Spacing.md, backgroundColor: Colors.light.surfaceHover, borderRadius: BorderRadius.lg, padding: 4 },
  tab: { flex: 1, paddingVertical: Spacing.sm + 2, borderRadius: BorderRadius.md, alignItems: 'center' },
  tabActive: { backgroundColor: Colors.light.surface, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 3, elevation: 2 },
  tabText: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.light.textSecondary },
  tabTextActive: { color: Colors.light.text },
  list: { padding: Spacing.xl, gap: Spacing.md, paddingBottom: 30, flexGrow: 1 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, flex: 1 },
  emptyText: { fontSize: FontSize.md, color: Colors.light.textTertiary, textAlign: 'center' },
  card: { backgroundColor: Colors.light.surface, borderRadius: BorderRadius.xl, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.light.border },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  avatar: { width: 44, height: 44, borderRadius: BorderRadius.lg, backgroundColor: Colors.light.surfaceHover, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.light.textSecondary },
  cardTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.light.text },
  cardSub: { fontSize: FontSize.sm, color: Colors.light.textSecondary, marginTop: 1 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: BorderRadius.full },
  statusText: { fontSize: FontSize.xs, fontWeight: '600', textTransform: 'capitalize' },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: Spacing.md, paddingTop: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.light.borderLight },
  dateText: { fontSize: FontSize.xs, color: Colors.light.textTertiary },
  statusDots: { flexDirection: 'row', gap: 4 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.light.border },
});
