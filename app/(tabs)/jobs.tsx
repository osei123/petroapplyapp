import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { jobs } from '@/constants/mock-data';

const FILTERS = ['All', 'Full-time', 'Internship', 'Remote', 'On-site'];

export default function JobsScreen() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          job.companyName.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Full-time') return job.employmentType === 'full-time';
    if (activeFilter === 'Internship') return job.employmentType === 'internship';
    if (activeFilter === 'Remote') return job.remoteType === 'remote';
    if (activeFilter === 'On-site') return job.remoteType === 'on-site';
    return true;
  });

  return (
    <SafeAreaView className="flex-1 bg-muted" edges={['top']}>
      <View className="px-6 pt-4 pb-2">
        <Text className="text-[28px] font-bold text-foreground">Discover Jobs</Text>
      </View>

      <View className="flex-row px-6 gap-3 mb-4">
        <View className="flex-1 flex-row items-center px-4 h-12 rounded-full bg-white border border-border shadow-sm">
          <Ionicons name="search" size={20} color="#64748b" />
          <TextInput
            placeholder="Search role or company..."
            placeholderTextColor="#94a3b8"
            className="flex-1 ml-2 text-[15px] h-full text-foreground"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity className="w-12 h-12 rounded-full bg-primary items-center justify-center shadow-sm">
          <Ionicons name="options" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <View className="mb-4">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, gap: 8 }}>
          {FILTERS.map(filter => (
            <TouchableOpacity 
              key={filter} 
              onPress={() => setActiveFilter(filter)}
              className={`px-5 py-2.5 rounded-full shadow-sm ${activeFilter === filter ? 'bg-primary' : 'bg-white'}`}
            >
              <Text className={`text-sm font-semibold ${activeFilter === filter ? 'text-white' : 'text-muted-foreground'}`}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100, gap: 16 }}>
        <Text className="text-sm font-medium text-muted-foreground mb-1">
          {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
        </Text>
        
        {filteredJobs.map(job => (
          <View key={job.id} className="p-5 rounded-3xl bg-white shadow-sm">
            <View className="flex-row items-center">
              <View className="w-12 h-12 rounded-[14px] bg-muted items-center justify-center mr-4">
                <Text className="text-base font-bold text-muted-foreground">{job.companyName.substring(0,2)}</Text>
              </View>
              <View className="flex-1 justify-center">
                <Text className="text-base font-bold text-foreground mb-0.5" numberOfLines={1}>{job.title}</Text>
                <Text className="text-sm text-muted-foreground mb-1">{job.companyName}</Text>
                <View className="flex-row items-center">
                  <Text className="text-[13px] text-muted-foreground capitalize">{job.location} • {job.employmentType.replace('-', ' ')}</Text>
                </View>
              </View>
              <TouchableOpacity className="p-1">
                <Ionicons name={job.featured ? "bookmark" : "bookmark-outline"} size={22} color={job.featured ? "#0ea5e9" : "#64748b"} />
              </TouchableOpacity>
            </View>
            <View className="h-px bg-border my-4" />
            <View className="flex-row justify-between items-center">
              <Text className="text-[15px] font-semibold text-foreground">{job.salaryRange}</Text>
              <Text className="text-xs text-muted-foreground">{job.postedAt}</Text>
            </View>
          </View>
        ))}
        {filteredJobs.length === 0 && (
          <View className="p-8 items-center justify-center mt-10">
            <Ionicons name="search-outline" size={48} color="#e2e8f0" />
            <Text className="mt-4 text-[15px] text-center text-muted-foreground">No jobs found matching "{searchQuery}"</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
