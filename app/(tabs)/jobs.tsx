import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { supabase } from '@/lib/supabase';
import { useFocusEffect } from '@react-navigation/native';
import { Card } from '@/components/Card';

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
        .eq('status', 'published')
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
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Header */}
      <View className="px-6 pt-6 pb-2">
        <Text className="text-2xl font-outfit-b text-foreground">Explore Jobs</Text>
        <Text className="text-sm font-work-sans text-foreground/70 mt-1">{jobs.length} opportunities available</Text>
      </View>

      {/* Search */}
      <View className="px-6 mt-4">
        <View className="flex-row items-center bg-white px-4 py-3.5 rounded-xl border-2 border-border shadow-sm gap-3">
          <IconSymbol name="magnifyingglass" size={20} color="#0C4A6E80" />
          <TextInput
            className="flex-1 text-base font-work-sans text-foreground"
            placeholder="Search jobs, companies, locations..."
            placeholderTextColor="#0C4A6E80"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      {/* Filters */}
      <View className="mt-4">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, gap: 12 }}>
          {filters.map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setActiveFilter(f)}
              className={`px-5 py-2 rounded-full border ${activeFilter === f ? 'bg-primary border-primary' : 'bg-white border-border shadow-sm'}`}
            >
              <Text className={`text-sm font-outfit-sb ${activeFilter === f ? 'text-white' : 'text-foreground/70'}`}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Job List */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0369A1" />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 24, gap: 16, paddingBottom: 100 }}>
          {filtered.length === 0 ? (
            <View className="items-center py-16">
              <Text className="text-base font-work-sans text-foreground/50">No jobs found matching your criteria</Text>
            </View>
          ) : (
            filtered.map((job) => (
              <TouchableOpacity key={job.id} onPress={() => router.push(`/job/${job.id}` as any)} activeOpacity={0.7}>
                <Card className="p-5">
                  <View className="flex-row items-center gap-4">
                    <View className="w-12 h-12 rounded-xl bg-muted items-center justify-center">
                      <Text className="text-base font-outfit-b text-foreground">
                        {job.companies?.name ? job.companies.name.substring(0, 2).toUpperCase() : 'CO'}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-base font-outfit-sb text-foreground" numberOfLines={1}>{job.title}</Text>
                      <Text className="text-sm font-work-sans text-foreground/70 mt-1">{job.companies?.name || 'Unknown'}</Text>
                    </View>
                    {job.featured && (
                      <View className="w-8 h-8 rounded-full bg-[#fef3c7] items-center justify-center">
                        <IconSymbol name="star.fill" size={12} color="#f59e0b" />
                      </View>
                    )}
                  </View>

                  <View className="flex-row gap-6 mt-4">
                    <View className="flex-row items-center gap-1.5">
                      <IconSymbol name="location.fill" size={14} color="#0C4A6E80" />
                      <Text className="text-xs font-work-sans text-foreground/70">{job.location || 'Remote'}</Text>
                    </View>
                    <View className="flex-row items-center gap-1.5">
                      <IconSymbol name="clock.fill" size={14} color="#0C4A6E80" />
                      <Text className="text-xs font-work-sans text-foreground/70">
                        {new Date(job.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row justify-between items-center mt-5">
                    <View className="flex-row gap-2 flex-wrap flex-1">
                      <View className="bg-muted px-3 py-1.5 rounded-full">
                        <Text className="text-xs font-work-sans-md text-foreground capitalize">{job.employment_type}</Text>
                      </View>
                      <View className="bg-muted px-3 py-1.5 rounded-full">
                        <Text className="text-xs font-work-sans-md text-foreground capitalize">{job.remote_type}</Text>
                      </View>
                    </View>
                    <Text className="text-base font-outfit-b text-primary">{job.salary_range || 'Competitive'}</Text>
                  </View>
                </Card>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
