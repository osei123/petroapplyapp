import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/Card';

const statusColors: Record<string, { bg: string; text: string }> = {
  submitted: { bg: 'bg-muted', text: 'text-foreground/70' },
  under_review: { bg: 'bg-primary/10', text: 'text-primary' },
  shortlisted: { bg: 'bg-[#fef3c7]', text: 'text-[#92400e]' },
  interview: { bg: 'bg-[#e0e7ff]', text: 'text-[#3730a3]' },
  rejected: { bg: 'bg-red-100', text: 'text-red-800' },
  hired: { bg: 'bg-green-100', text: 'text-green-800' },
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
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="px-6 pt-6 pb-2">
        <Text className="text-2xl font-outfit-b text-foreground">My Applications</Text>
        <Text className="text-sm font-work-sans text-foreground/70 mt-1">{applications.length} total applications</Text>
      </View>

      <View className="flex-row mx-6 mt-4 bg-muted/50 rounded-xl p-1 border border-border">
        {tabs.map((tab) => (
          <TouchableOpacity 
            key={tab} 
            onPress={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 rounded-lg items-center ${activeTab === tab ? 'bg-white shadow-sm border border-border' : ''}`}
          >
            <Text className={`text-sm font-outfit-sb ${activeTab === tab ? 'text-foreground' : 'text-foreground/60'}`}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ padding: 24, gap: 16, paddingBottom: 100, flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0369A1" />}
      >
        {loading && !refreshing ? (
          <View className="flex-1 items-center justify-center pt-16">
            <ActivityIndicator size="large" color="#0369A1" />
          </View>
        ) : filtered.length === 0 ? (
          <View className="flex-1 items-center justify-center py-16">
            <Text className="text-base font-work-sans text-foreground/50 text-center">No applications found.</Text>
            {activeTab !== 'All' && <Text className="text-sm font-work-sans text-foreground/50 text-center mt-1">Try changing your filter.</Text>}
          </View>
        ) : (
          filtered.map((app) => {
            const statusStyle = statusColors[app.status] || statusColors.submitted;
            const jobTitle = app?.jobs?.title || 'Unknown Job';
            const companyName = app?.jobs?.companies?.name || 'Unknown Company';
            
            const appliedDate = new Date(app.applied_at);
            const formattedDate = appliedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

            return (
              <TouchableOpacity key={app.id} onPress={() => router.push(`/application/${app.id}` as any)} activeOpacity={0.7}>
                <Card className="p-5">
                  <View className="flex-row items-center gap-4">
                    <View className="w-11 h-11 rounded-lg bg-muted items-center justify-center border border-border">
                      <Text className="text-sm font-outfit-b text-foreground">{companyName.substring(0, 2).toUpperCase()}</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-base font-outfit-sb text-foreground" numberOfLines={1}>{jobTitle}</Text>
                      <Text className="text-sm font-work-sans text-foreground/70 mt-1">{companyName}</Text>
                    </View>
                    <View className={`px-2.5 py-1.5 rounded-full ${statusStyle.bg}`}>
                      <Text className={`text-xs font-outfit-sb capitalize ${statusStyle.text}`}>
                        {app.status.replace('_', ' ')}
                      </Text>
                    </View>
                  </View>
                  
                  <View className="flex-row justify-between items-center mt-4 pt-4 border-t border-border">
                    <Text className="text-xs font-work-sans text-foreground/60">Applied {formattedDate}</Text>
                    <View className="flex-row gap-1">
                      {['submitted', 'under_review', 'shortlisted', 'interview', 'hired'].map((step, i) => {
                        const currentIdx = ['submitted', 'under_review', 'shortlisted', 'interview', 'hired'].indexOf(app.status);
                        const isRejected = app.status === 'rejected';
                        
                        let dotColor = 'bg-border';
                        if (isRejected) {
                          dotColor = 'bg-red-500';
                        } else if (i <= currentIdx) {
                          dotColor = 'bg-primary';
                        }

                        return (
                          <View key={step} className={`w-2 h-2 rounded-full ${dotColor}`} />
                        );
                      })}
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
