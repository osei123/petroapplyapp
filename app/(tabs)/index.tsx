import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { supabase } from '@/lib/supabase';
import { useFocusEffect } from '@react-navigation/native';
import { Card } from '@/components/Card';

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
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;

      const { data: featuredData } = await supabase
        .from('jobs')
        .select(`*, companies (name)`)
        .eq('featured', true)
        .eq('status', 'published')
        .limit(5);
      if (featuredData) setFeaturedJobs(featuredData);

      const { data: recentData } = await supabase
        .from('jobs')
        .select(`*, companies (name)`)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(4);
      if (recentData) setRecentJobs(recentData);

      const { data: companiesData } = await supabase
        .from('companies')
        .select('*')
        .eq('status', 'active')
        .order('job_count', { ascending: false })
        .limit(4);
      if (companiesData) setTopCompanies(companiesData);

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
      <SafeAreaView className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color="#0369A1" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row justify-between items-center px-6 pt-6 pb-4">
          <View>
            <Text className="text-sm font-work-sans text-foreground/70">Good Morning 👋</Text>
            <Text className="text-2xl font-outfit-b text-foreground mt-1">{userProfile?.full_name || 'Student'}</Text>
          </View>
          <TouchableOpacity 
            className="w-11 h-11 rounded-full bg-white items-center justify-center border border-border"
            onPress={() => router.push('/notifications' as any)}
          >
            <IconSymbol name="bell.fill" size={22} color="#0C4A6E" />
            <View className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-cta" />
          </TouchableOpacity>
        </View>

        {/* Hero Search Bar */}
        <View className="px-6 mt-4">
          <TouchableOpacity 
            className="flex-row items-center bg-white h-14 px-4 rounded-xl border-2 border-primary/20 shadow-sm"
            onPress={() => router.push('/(tabs)/jobs' as any)}
          >
            <IconSymbol name="magnifyingglass" size={20} color="#0369A1" />
            <Text className="ml-3 text-base font-work-sans text-foreground/50">Search jobs, companies...</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Completion */}
        {profileCompletion < 100 && (
          <View className="px-6 mt-8">
            <Card className="bg-primary/5 border-primary/20">
              <View className="flex-row items-center justify-between">
                <View className="flex-1 pr-4">
                  <Text className="text-base font-outfit-sb text-primary">Complete Your Profile</Text>
                  <Text className="text-sm font-work-sans text-foreground/70 mt-1">
                    {profileCompletion}% complete — add details to stand out
                  </Text>
                </View>
                <View className="w-12 h-12 rounded-full bg-primary items-center justify-center">
                  <Text className="text-white font-outfit-b text-sm">{profileCompletion}%</Text>
                </View>
              </View>
              <View className="h-1.5 bg-primary/20 rounded-full mt-4">
                <View className="h-1.5 bg-primary rounded-full" style={{ width: `${profileCompletion}%` }} />
              </View>
            </Card>
          </View>
        )}

        {/* Application Tracker */}
        <View className="mt-10 px-6">
          <Text className="text-xl font-outfit-b text-foreground mb-4">Application Tracker</Text>
          <View className="flex-row gap-4">
            {[
              { label: 'Total', count: appStats.total, color: 'text-primary' },
              { label: 'Pending', count: appStats.pending, color: 'text-secondary' },
              { label: 'Interview', count: appStats.interview, color: 'text-cta' },
            ].map((item) => (
              <TouchableOpacity 
                key={item.label} 
                className="flex-1 bg-white rounded-xl p-4 items-center border border-border shadow-sm"
                onPress={() => router.push('/(tabs)/applications' as any)}
              >
                <Text className={`text-2xl font-outfit-b ${item.color}`}>{item.count}</Text>
                <Text className="text-xs font-work-sans-md text-foreground/60 mt-1">{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Featured Jobs Carousel */}
        {featuredJobs.length > 0 && (
          <View className="mt-10">
            <View className="flex-row justify-between items-center px-6 mb-4">
              <Text className="text-xl font-outfit-b text-foreground">Featured Jobs</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/jobs' as any)}>
                <Text className="text-sm font-outfit-sb text-primary">See All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={featuredJobs}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingHorizontal: 24, gap: 16 }}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  className="w-64 bg-white rounded-xl p-5 border border-border shadow-sm"
                  onPress={() => router.push(`/job/${item.id}` as any)}
                >
                  <View className="flex-row justify-between items-start mb-4">
                    <View className="w-10 h-10 rounded-lg bg-muted items-center justify-center">
                      <Text className="font-outfit-b text-foreground">
                        {item.companies?.name ? item.companies.name.substring(0, 2).toUpperCase() : 'CO'}
                      </Text>
                    </View>
                    <View className="bg-[#fef3c7] px-2 py-1 rounded-full flex-row items-center">
                      <IconSymbol name="star.fill" size={10} color="#d97706" />
                      <Text className="text-[10px] font-outfit-b text-[#92400e] ml-1 uppercase">Featured</Text>
                    </View>
                  </View>
                  <Text className="text-base font-outfit-sb text-foreground mb-1" numberOfLines={1}>{item.title}</Text>
                  <Text className="text-sm font-work-sans text-foreground/70 mb-3">{item.companies?.name || 'Unknown'}</Text>
                  <View className="flex-row flex-wrap gap-2 mb-4">
                    <View className="bg-muted px-2.5 py-1 rounded-full">
                      <Text className="text-xs font-work-sans-md text-foreground">{item.employment_type}</Text>
                    </View>
                    <View className="bg-muted px-2.5 py-1 rounded-full">
                      <Text className="text-xs font-work-sans-md text-foreground">{item.remote_type}</Text>
                    </View>
                  </View>
                  <Text className="text-sm font-outfit-sb text-primary">{item.salary_range || 'Competitive'}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {/* Top Companies */}
        {topCompanies.length > 0 && (
          <View className="mt-10 px-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-outfit-b text-foreground">Top Companies</Text>
            </View>
            <View className="flex-row flex-wrap justify-between">
              {topCompanies.map((item) => (
                <TouchableOpacity 
                  key={item.id}
                  className="w-[48%] bg-white rounded-xl p-4 items-center border border-border mb-4 shadow-sm"
                  onPress={() => router.push(`/company/${item.id}` as any)}
                >
                  <View className="w-12 h-12 rounded-full bg-muted items-center justify-center mb-3">
                    <Text className="font-outfit-b text-lg text-foreground">{item.name.substring(0, 2).toUpperCase()}</Text>
                  </View>
                  <Text className="text-sm font-outfit-sb text-foreground text-center" numberOfLines={1}>{item.name}</Text>
                  <Text className="text-xs font-work-sans text-foreground/60 mt-1">{item.job_count || 0} jobs</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Recent Jobs */}
        {recentJobs.length > 0 && (
          <View className="mt-6 px-6 mb-10">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-outfit-b text-foreground">Recent Jobs</Text>
            </View>
            {recentJobs.map((job) => (
              <TouchableOpacity 
                key={job.id} 
                className="flex-row items-center bg-white rounded-xl p-4 mb-3 border border-border shadow-sm"
                onPress={() => router.push(`/job/${job.id}` as any)}
              >
                <View className="w-12 h-12 rounded-lg bg-muted items-center justify-center mr-4">
                  <Text className="font-outfit-b text-foreground">
                    {job.companies?.name ? job.companies.name.substring(0, 2).toUpperCase() : 'CO'}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-base font-outfit-sb text-foreground" numberOfLines={1}>{job.title}</Text>
                  <Text className="text-sm font-work-sans text-foreground/70 mt-1">{job.companies?.name || 'Unknown'} · {job.location || 'Remote'}</Text>
                </View>
                <Text className="text-xs font-work-sans text-foreground/50">
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
