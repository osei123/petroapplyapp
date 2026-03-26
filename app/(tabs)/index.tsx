import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { currentUser, jobs } from '@/constants/mock-data';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  const recommendedJobs = jobs.slice(0, 3);
  const categories = ['Full-Time', 'Remote', 'Web Developer', 'Internship'];

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        
        {/* Header */}
        <View className="flex-row justify-between items-center px-6 pt-4 pb-6">
          <View className="flex-row items-center">
            <View className="w-12 h-12 rounded-full overflow-hidden mr-3 bg-muted">
               <Text className="text-xl font-bold text-muted-foreground w-full h-full text-center mt-2.5">
                  {currentUser.fullName.split(' ').map(n=>n[0]).join('')}
               </Text>
            </View>
            <View>
              <Text className="text-[13px] text-muted-foreground font-medium mb-0.5">Good Afternoon</Text>
              <Text className="text-base font-bold text-foreground">{currentUser.fullName}</Text>
            </View>
          </View>
          <TouchableOpacity className="w-11 h-11 rounded-full bg-white shadow-sm items-center justify-center relative">
            <Ionicons name="notifications" size={20} color="#0f172a" />
            <View className="absolute top-2.5 right-3 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white" />
          </TouchableOpacity>
        </View>

        {/* Hero Section */}
        <View className="flex-row justify-between items-center px-6 mb-6">
          <Text className="text-[34px] leading-[42px] tracking-tight text-foreground">
            Let's Find{'\n'}
            <Text className="font-bold">Your Next Job</Text>
          </Text>
          <TouchableOpacity className="w-16 h-16 rounded-full bg-primary items-center justify-center shadow-md shadow-primary/30 mr-2">
            <Ionicons name="search" size={28} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <View className="mb-8">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, gap: 12 }}>
            {categories.map((category, index) => (
              <TouchableOpacity key={category} className={`px-6 py-3 rounded-full shadow-sm ${index === 0 ? 'bg-white' : 'bg-white'}`}>
                <Text className="text-sm font-semibold text-foreground">{category}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Recommended Jobs */}
        <View className="px-6">
          <Text className="text-xl font-bold text-foreground mb-6">Recommendation For you</Text>
          
          <View className="gap-6">
            {recommendedJobs.map((job, idx) => (
              <TouchableOpacity key={job.id} onPress={() => router.push(`/job/${job.id}` as any)} activeOpacity={0.9}>
                <View className="p-5 rounded-[32px] bg-white shadow-sm border border-slate-100">
                  
                  {/* Card Header */}
                  <View className="flex-row justify-between items-start mb-5">
                    <View className="flex-row items-center flex-1">
                      <View className={`w-14 h-14 rounded-full items-center justify-center mr-4 ${idx === 0 ? 'bg-primary' : 'bg-amber-300'}`}>
                         <Text className={`text-xl font-bold ${idx === 0 ? 'text-white' : 'text-slate-900'}`}>{job.companyName.substring(0,1)}</Text>
                      </View>
                      <View className="flex-1">
                        <Text className="text-[17px] font-bold text-foreground mb-1" numberOfLines={1}>{job.title}</Text>
                        <View className="flex-row items-center">
                          <Ionicons name="location-outline" size={14} color="#94a3b8" />
                          <Text className="text-[13px] text-muted-foreground ml-1">{job.location}</Text>
                        </View>
                      </View>
                    </View>
                    <TouchableOpacity className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center ml-2 text-foreground">
                      <Ionicons name="bookmark" size={18} color="#0f172a" />
                    </TouchableOpacity>
                  </View>

                  {/* Tags */}
                  <View className="flex-row gap-2 mb-6">
                    <View className="px-4 py-2 rounded-full bg-slate-100">
                       <Text className="text-xs font-semibold text-muted-foreground">Full-Time</Text>
                    </View>
                    <View className="px-4 py-2 rounded-full bg-slate-100">
                       <Text className="text-xs font-semibold text-muted-foreground">Remote</Text>
                    </View>
                    <View className="px-4 py-2 rounded-full bg-slate-100">
                       <Text className="text-xs font-semibold text-muted-foreground">Internship</Text>
                    </View>
                  </View>
                  
                  {/* Card Footer */}
                  <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center">
                       {/* Mock Avatars */}
                       <View className="flex-row">
                         <View className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white z-30 overflow-hidden items-center justify-center"><Text className="text-[10px] font-bold">JD</Text></View>
                         <View className="w-8 h-8 rounded-full bg-slate-300 border-2 border-white -ml-3 z-20 overflow-hidden items-center justify-center"><Text className="text-[10px] font-bold">AS</Text></View>
                         <View className="w-8 h-8 rounded-full bg-slate-800 border-2 border-white -ml-3 z-10 items-center justify-center">
                            <Ionicons name="add" size={14} color="#fff" />
                         </View>
                       </View>
                       <Text className="text-xs font-medium text-muted-foreground ml-2">388 Applicants</Text>
                    </View>
                    <View className="items-end">
                      <Text className="text-lg font-bold text-foreground whitespace-nowrap">{job.salaryRange.split('/')[0]}</Text>
                      <Text className="text-[11px] font-medium text-muted-foreground text-right relative top-[-2px]">month</Text>
                    </View>
                  </View>
                  
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
