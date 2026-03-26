import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { savedJobs } from '@/constants/mock-data';

export default function SavedJobsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-muted" edges={['top']}>
      <View className="px-6 pt-4 pb-4">
        <Text className="text-[28px] font-bold text-foreground mb-1">Saved Jobs</Text>
        <Text className="text-base text-muted-foreground">{savedJobs.length} jobs saved</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100, gap: 16 }}>
        {savedJobs.map(item => {
          const job = item.job;
          return (
            <View key={item.id} className="p-5 rounded-3xl bg-white shadow-sm">
              <View className="flex-row items-center mb-4">
                <View className="w-[52px] h-[52px] rounded-xl bg-muted items-center justify-center mr-4">
                  <Text className="text-lg font-bold text-muted-foreground">{job.companyName.substring(0,2)}</Text>
                </View>
                <View className="flex-1 justify-center">
                  <Text className="text-[17px] font-bold text-foreground mb-1" numberOfLines={1}>{job.title}</Text>
                  <Text className="text-[15px] font-semibold text-primary mb-1">{job.companyName}</Text>
                  <View className="flex-row items-center">
                    <Text className="text-[13px] text-muted-foreground capitalize">{job.location}</Text>
                  </View>
                </View>
                <TouchableOpacity className="p-1">
                  <Ionicons name="bookmark" size={24} color="#0ea5e9" />
                </TouchableOpacity>
              </View>
              <View className="h-px bg-border my-2" />
              <View className="flex-row justify-between items-center mt-2">
                <Text className="text-[15px] font-semibold text-foreground">{job.salaryRange}</Text>
                <Text className="text-xs text-muted-foreground">Saved {item.savedAt}</Text>
              </View>
            </View>
          );
        })}

        {savedJobs.length === 0 && (
          <View className="p-8 items-center justify-center mt-10">
            <Ionicons name="bookmark-outline" size={48} color="#e2e8f0" />
            <Text className="mt-4 text-[15px] text-center text-muted-foreground">You haven't saved any jobs yet.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
