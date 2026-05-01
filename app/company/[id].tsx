import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/Card';

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
        .eq('status', 'active')
        .single();
      
      if (companyData) {
        setCompany(companyData);
        const { data: jobsData } = await supabase
          .from('jobs')
          .select('*')
          .eq('company_id', companyData.id)
          .eq('status', 'published');
        setCompanyJobs(jobsData || []);
      }
      setLoading(false);
    };
    fetchCompany();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color="#0369A1" />
      </SafeAreaView>
    );
  }

  if (!company) {
    return (
      <SafeAreaView className="flex-1 bg-background justify-center items-center p-6">
        <Text className="text-lg font-outfit-sb text-foreground">Company not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Navigation Bar */}
      <View className="flex-row items-center justify-between px-6 py-4">
        <TouchableOpacity 
          className="w-10 h-10 rounded-full bg-white border border-border items-center justify-center shadow-sm" 
          onPress={() => router.back()}
        >
          <IconSymbol name="arrow.left" size={20} color="#0C4A6E" />
        </TouchableOpacity>
        <Text className="text-lg font-outfit-b text-foreground">Company</Text>
        <View className="w-10" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
        {/* Header */}
        <Card className="items-center p-8">
          <View className="w-20 h-20 rounded-2xl bg-muted items-center justify-center mb-4 border border-border">
            <Text className="text-2xl font-outfit-b text-foreground">{company.name.substring(0, 2).toUpperCase()}</Text>
          </View>
          <Text className="text-2xl font-outfit-b text-foreground text-center">{company.name}</Text>
          <Text className="text-base font-outfit-sb text-primary mt-1">{company.industry_segment}</Text>
          
          <View className="flex-row items-center gap-1.5 mt-3">
            <IconSymbol name="location.fill" size={14} color="#0C4A6E80" />
            <Text className="text-sm font-work-sans text-foreground/70">{company.headquarters}</Text>
          </View>
        </Card>

        {/* Stats Row */}
        <Card className="flex-row p-0 mt-6 overflow-hidden">
          <View className="flex-1 items-center py-5">
            <Text className="text-xl font-outfit-b text-foreground">{company.job_count || companyJobs.length}</Text>
            <Text className="text-xs font-work-sans text-foreground/70 mt-1">Open Jobs</Text>
          </View>
          <View className="flex-1 items-center py-5 border-x border-border">
            <Text className="text-xl font-outfit-b text-foreground">Global</Text>
            <Text className="text-xs font-work-sans text-foreground/70 mt-1">Presence</Text>
          </View>
          <View className="flex-1 items-center py-5">
            <Text className="text-xl font-outfit-b text-foreground">4.5★</Text>
            <Text className="text-xs font-work-sans text-foreground/70 mt-1">Rating</Text>
          </View>
        </Card>

        {/* About Section */}
        {company.description && (
          <View className="mt-8">
            <Text className="text-lg font-outfit-b text-foreground mb-4">About</Text>
            <Text className="text-base font-work-sans text-foreground/80 leading-relaxed">{company.description}</Text>
          </View>
        )}

        {/* Open Positions Section */}
        <View className="mt-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-outfit-b text-foreground">Open Positions ({companyJobs.length})</Text>
          </View>
          
          {companyJobs.length === 0 ? (
            <Text className="text-base font-work-sans text-foreground/50 text-center py-6">No open positions currently.</Text>
          ) : (
            <View className="gap-3">
              {companyJobs.map((job) => (
                <TouchableOpacity 
                  key={job.id} 
                  className="flex-row items-center bg-white rounded-xl p-4 border border-border shadow-sm"
                  onPress={() => router.push(`/job/${job.id}` as any)}
                >
                  <View className="flex-1">
                    <Text className="text-base font-outfit-b text-foreground">{job.title}</Text>
                    <Text className="text-sm font-work-sans text-foreground/70 mt-1 capitalize">
                      {job.location} · {job.employment_type}
                    </Text>
                  </View>
                  <View className="bg-primary/10 px-3 py-1.5 rounded-full">
                    <Text className="text-xs font-outfit-b text-primary">{job.salary_range || 'Competitive'}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
