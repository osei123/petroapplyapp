import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { jobs } from '@/constants/mock-data';
import { Button } from '@/components/Button';

export default function JobDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const job = jobs.find(j => j.id === id) || jobs[0]; // fallback for demo
  const [isSaved, setIsSaved] = useState(job.featured);

  return (
    <SafeAreaView className="flex-1 bg-muted" edges={['top', 'bottom']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4 bg-white border-b border-border">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
          <Ionicons name="arrow-back" size={24} color="#171717" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-foreground">Job Details</Text>
        <TouchableOpacity onPress={() => setIsSaved(!isSaved)} className="p-2 -mr-2">
          <Ionicons name={isSaved ? "bookmark" : "bookmark-outline"} size={24} color={isSaved ? "#0ea5e9" : "#64748b"} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Top Card (Hero Section) */}
        <View className="bg-white px-6 py-8 rounded-b-3xl shadow-sm mb-6 items-center">
          <View className="w-20 h-20 rounded-2xl bg-muted items-center justify-center mb-5 shadow-sm">
             <Text className="text-2xl font-bold text-muted-foreground">{job.companyName.substring(0,2)}</Text>
          </View>
          <Text className="text-2xl font-extrabold text-foreground text-center mb-1">{job.title}</Text>
          <TouchableOpacity onPress={() => router.push(`/company/${job.companyId}` as any)}>
            <Text className="text-base font-semibold text-primary mb-1">{job.companyName}</Text>
          </TouchableOpacity>
          <Text className="text-sm text-muted-foreground">{job.location} • {job.postedAt}</Text>
          
          {/* Quick Info Pills */}
          <View className="flex-row flex-wrap justify-center gap-2 mt-6">
            <View className="flex-row items-center bg-muted px-3 py-2 rounded-full gap-1.5">
              <Ionicons name="briefcase-outline" size={16} color="#64748b" />
              <Text className="text-sm font-medium text-muted-foreground capitalize">{job.employmentType.replace('-', ' ')}</Text>
            </View>
            <View className="flex-row items-center bg-muted px-3 py-2 rounded-full gap-1.5">
              <Ionicons name="laptop-outline" size={16} color="#64748b" />
              <Text className="text-sm font-medium text-muted-foreground capitalize">{job.remoteType}</Text>
            </View>
            <View className="flex-row items-center bg-muted px-3 py-2 rounded-full gap-1.5">
              <Ionicons name="cash-outline" size={16} color="#64748b" />
              <Text className="text-sm font-medium text-muted-foreground bg-">{job.salaryRange}</Text>
            </View>
          </View>
        </View>

        {/* Content Section */}
        <View className="px-6 mb-8 gap-8">
          {/* Description */}
          <View>
            <Text className="text-lg font-bold text-foreground mb-4">Job Description</Text>
            <View className="bg-white p-6 rounded-3xl shadow-sm">
              <Text className="text-base leading-relaxed text-muted-foreground">{job.description}</Text>
            </View>
          </View>

          {/* Requirements */}
          <View>
            <Text className="text-lg font-bold text-foreground mb-4">Requirements</Text>
            <View className="bg-white p-6 rounded-3xl shadow-sm gap-3">
              {job.requirements.map((req, i) => (
                <View key={i} className="flex-row items-start gap-3">
                  <View className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5" />
                  <Text className="flex-1 text-base leading-relaxed text-muted-foreground">{req}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Details List */}
          <View>
            <Text className="text-lg font-bold text-foreground mb-4">Additional Info</Text>
            <View className="bg-white p-6 rounded-3xl shadow-sm">
              <View className="flex-row justify-between py-2">
                <Text className="text-sm text-muted-foreground">Experience Level</Text>
                <Text className="text-sm font-semibold capitalize text-foreground">{job.experienceLevel}</Text>
              </View>
              <View className="h-px bg-border my-2" />
              <View className="flex-row justify-between py-2">
                <Text className="text-sm text-muted-foreground">Application Deadline</Text>
                <Text className="text-sm font-semibold text-foreground">{job.deadline}</Text>
              </View>
              <View className="h-px bg-border my-2" />
              <View className="flex-row justify-between py-2">
                <Text className="text-sm text-muted-foreground">Applicants</Text>
                <Text className="text-sm font-semibold text-foreground">{job.applicantCount} applied</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Action */}
      <View className="absolute bottom-0 left-0 right-0 px-6 py-5 bg-white border-t border-border shadow-lg">
        <Button 
          title="Apply Now" 
          onPress={() => alert('Application submitted!')}
          className="w-full shadow-sm"
        />
      </View>
    </SafeAreaView>
  );
}
