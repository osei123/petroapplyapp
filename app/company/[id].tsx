import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { companies, jobs } from '@/constants/mock-data';
import { Button } from '@/components/Button';

export default function CompanyDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const company = companies.find(c => c.id === id) || companies[0];
  const companyJobs = jobs.filter(j => j.companyId === company.id);

  return (
    <SafeAreaView className="flex-1 bg-muted" edges={['top']}>
      <View className="flex-row items-center justify-between px-6 py-4 bg-white border-b border-border">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
          <Ionicons name="arrow-back" size={24} color="#171717" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-foreground">Company Profile</Text>
        <View className="w-10" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        {/* Hero */}
        <View className="items-center my-8 px-6">
          <View className="w-24 h-24 rounded-3xl bg-white items-center justify-center mb-5 shadow-sm">
             <Text className="text-[32px] font-bold text-muted-foreground">{company.name.substring(0,2)}</Text>
          </View>
          <Text className="text-3xl font-extrabold text-foreground text-center mb-1">{company.name}</Text>
          <Text className="text-base font-semibold text-muted-foreground mb-3">{company.industrySegment}</Text>
          <View className="flex-row items-center gap-1.5 mb-6">
            <Ionicons name="location" size={16} color="#94a3b8" />
            <Text className="text-sm text-muted-foreground">{company.headquarters}</Text>
          </View>
          <Button 
            title="Visit Website" 
            variant="outline" 
            size="small" 
            className="px-6 bg-white shadow-sm"
            onPress={() => Linking.openURL(company.website)}
          />
        </View>

        {/* About */}
        <View className="px-6 mb-8">
          <Text className="text-lg font-bold text-foreground mb-4">About Company</Text>
          <View className="bg-white p-6 rounded-3xl shadow-sm">
            <Text className="text-base leading-relaxed text-muted-foreground">{company.description}</Text>
          </View>
        </View>

        {/* Open Roles */}
        <View className="px-6 mb-8">
          <View className="flex-row items-center gap-3 mb-4">
            <Text className="text-lg font-bold text-foreground">Open Roles</Text>
            <View className="px-2.5 py-0.5 rounded-full bg-primaryLight">
              <Text className="text-xs font-bold text-primary">{companyJobs.length}</Text>
            </View>
          </View>
          
          <View className="gap-4">
            {companyJobs.map(job => (
              <TouchableOpacity key={job.id} onPress={() => router.push(`/job/${job.id}` as any)}>
                <View className="bg-white p-5 rounded-3xl shadow-sm">
                  <Text className="text-base font-bold text-foreground mb-1" numberOfLines={1}>{job.title}</Text>
                  <Text className="text-sm text-muted-foreground mb-4 capitalize">{job.location} • {job.employmentType.replace('-', ' ')}</Text>
                  <View className="flex-row justify-between items-center">
                    <Text className="text-[15px] font-semibold text-foreground">{job.salaryRange}</Text>
                    <Ionicons name="chevron-forward" size={16} color="#94a3b8" />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
            {companyJobs.length === 0 && (
              <Text className="text-base text-center text-muted-foreground mt-5">
                No open roles at the moment.
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
