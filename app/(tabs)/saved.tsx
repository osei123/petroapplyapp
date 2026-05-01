import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/Card';

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

  const removeBookmark = async (savedId: string) => {
    // Optimistically update
    setSavedJobs(prev => prev.filter(job => job.id !== savedId));
    try {
      await supabase.from('saved_jobs').delete().eq('id', savedId);
    } catch (err) {
      console.error(err);
      fetchSavedJobs(); // Re-fetch on error
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="px-6 pt-6 pb-2">
        <Text className="text-2xl font-outfit-b text-foreground">Saved Jobs</Text>
        <Text className="text-sm font-work-sans text-foreground/70 mt-1">{savedJobs.length} jobs saved</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 24, gap: 16, paddingBottom: 100, flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0369A1" />}
      >
        {loading && !refreshing ? (
          <View className="flex-1 items-center justify-center py-16">
            <ActivityIndicator size="large" color="#0369A1" />
          </View>
        ) : savedJobs.length === 0 ? (
          <View className="flex-1 items-center justify-center gap-2 py-20">
            <IconSymbol name="bookmark.fill" size={48} color="#bae6fd" />
            <Text className="text-xl font-outfit-b text-foreground mt-4">No saved jobs yet</Text>
            <Text className="text-sm font-work-sans text-foreground/70 text-center">Save jobs you're interested in to review later</Text>
          </View>
        ) : (
          savedJobs.map((saved) => {
            const job = saved.jobs;
            if (!job) return null;

            const companyName = job.companies?.name || 'Unknown Company';
            const savedDate = new Date(saved.saved_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

            return (
              <TouchableOpacity key={saved.id} onPress={() => router.push(`/job/${job.id}` as any)} activeOpacity={0.7}>
                <Card className="p-5">
                  <View className="flex-row items-center gap-4">
                    <View className="w-11 h-11 rounded-lg bg-muted items-center justify-center border border-border">
                      <Text className="text-sm font-outfit-b text-foreground">{companyName.substring(0, 2).toUpperCase()}</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-base font-outfit-sb text-foreground" numberOfLines={1}>{job.title}</Text>
                      <Text className="text-sm font-work-sans text-foreground/70 mt-1">{companyName}</Text>
                    </View>
                    <TouchableOpacity 
                      className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center"
                      onPress={() => removeBookmark(saved.id)}
                    >
                      <IconSymbol name="bookmark.fill" size={20} color="#0369A1" />
                    </TouchableOpacity>
                  </View>

                  <View className="flex-row gap-6 mt-4">
                    {job.location && (
                      <View className="flex-row items-center gap-1.5">
                        <IconSymbol name="location.fill" size={13} color="#0C4A6E80" />
                        <Text className="text-xs font-work-sans text-foreground/70">{job.location}</Text>
                      </View>
                    )}
                    {job.deadline && (
                      <View className="flex-row items-center gap-1.5">
                        <IconSymbol name="clock.fill" size={13} color="#0C4A6E80" />
                        <Text className="text-xs font-work-sans text-foreground/70">Deadline: {new Date(job.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</Text>
                      </View>
                    )}
                  </View>

                  <View className="flex-row justify-between items-center mt-5 pb-4 border-b border-border">
                    <View className="flex-row gap-2">
                      {job.employment_type && (
                        <View className="bg-muted px-2.5 py-1 rounded-full">
                          <Text className="text-xs font-work-sans-md text-foreground capitalize">{job.employment_type}</Text>
                        </View>
                      )}
                      {job.remote_type && (
                        <View className="bg-muted px-2.5 py-1 rounded-full">
                          <Text className="text-xs font-work-sans-md text-foreground capitalize">{job.remote_type}</Text>
                        </View>
                      )}
                    </View>
                    {job.salary_range && <Text className="text-sm font-outfit-b text-primary">{job.salary_range}</Text>}
                  </View>

                  <Text className="text-xs font-work-sans text-foreground/60 mt-4">Saved {savedDate}</Text>
                </Card>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
