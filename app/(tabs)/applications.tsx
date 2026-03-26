import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { applications } from '@/constants/mock-data';

const FILTERS = ['All', 'Active', 'Interview', 'Archived'];

export default function ApplicationsScreen() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredApps = applications.filter(app => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Active') return ['submitted', 'under_review', 'shortlisted'].includes(app.status);
    if (activeFilter === 'Interview') return app.status === 'interview';
    if (activeFilter === 'Archived') return ['rejected', 'hired'].includes(app.status);
    return true;
  });

  const getStatusColorClass = (status: string) => {
    switch(status) {
      case 'submitted': return 'bg-muted text-muted-foreground';
      case 'under_review': return 'bg-[#0ea5e9]/10 text-[#0ea5e9]';
      case 'shortlisted': return 'bg-amber-100 text-amber-700';
      case 'interview': return 'bg-primary text-white';
      case 'hired': return 'bg-emerald-100 text-emerald-700';
      case 'rejected': return 'bg-rose-100 text-rose-700';
      default: return 'bg-muted text-muted-foreground';
    }
  };
  
  const getStatusIconColor = (status: string) => {
    switch(status) {
      case 'submitted': return '#64748b';
      case 'under_review': return '#0ea5e9';
      case 'shortlisted': return '#d97706';
      case 'interview': return '#ffffff';
      case 'hired': return '#059669';
      case 'rejected': return '#e11d48';
      default: return '#64748b';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'submitted': return 'paper-plane';
      case 'under_review': return 'eye';
      case 'shortlisted': return 'star';
      case 'interview': return 'chatbubbles';
      case 'hired': return 'checkmark-circle';
      case 'rejected': return 'close-circle';
      default: return 'document-text';
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-muted" edges={['top']}>
      <View className="px-6 pt-4 pb-2">
        <Text className="text-[28px] font-bold text-foreground">My Applications</Text>
      </View>

      <View className="mb-6">
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
        {filteredApps.map(app => {
          return (
            <View key={app.id} className="p-5 rounded-3xl bg-white shadow-sm">
              <View className="flex-row justify-between items-start mb-4">
                <View className="w-11 h-11 rounded-xl bg-muted items-center justify-center">
                  <Text className="text-base font-bold text-muted-foreground">{app.companyName.substring(0,2)}</Text>
                </View>
                <View className={`flex-row items-center px-3 py-1.5 rounded-full gap-1.5 ${getStatusColorClass(app.status)}`}>
                  <Ionicons name={getStatusIcon(app.status) as any} size={14} color={getStatusIconColor(app.status)} />
                  <Text className={`text-xs font-semibold capitalize ${getStatusColorClass(app.status)} border-none bg-transparent`}>
                    {app.status.replace('_', ' ')}
                  </Text>
                </View>
              </View>

              <Text className="text-lg font-bold text-foreground mb-1" numberOfLines={1}>{app.jobTitle}</Text>
              <Text className="text-[15px] text-muted-foreground mb-4">{app.companyName}</Text>
              
              <View className="h-px bg-border my-2" />
              
              <View className="flex-row justify-between items-center mt-2">
                <View className="flex-row items-center gap-1.5">
                  <Ionicons name="calendar-outline" size={14} color="#94a3b8" />
                  <Text className="text-[13px] font-medium text-muted-foreground">Applied {app.appliedAt}</Text>
                </View>
                <TouchableOpacity className="p-1">
                  <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
                </TouchableOpacity>
              </View>
            </View>
          );
        })}

        {filteredApps.length === 0 && (
          <View className="p-8 items-center justify-center mt-10">
            <Ionicons name="document-text-outline" size={48} color="#e2e8f0" />
            <Text className="mt-4 text-[15px] text-center text-muted-foreground">No applications in this category.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
