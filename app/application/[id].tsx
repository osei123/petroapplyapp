import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { applications, jobs } from '@/constants/mock-data';

export default function ApplicationDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const app = applications.find(a => a.id === id) || applications[0];
  const job = jobs.find(j => j.id === app.jobId);

  const steps = [
    { key: 'submitted', label: 'Application Submitted', date: app.appliedAt, done: true },
    { key: 'under_review', label: 'Under Review', date: app.status === 'under_review' || ['shortlisted','interview','hired'].includes(app.status) ? app.appliedAt : null, done: ['under_review','shortlisted','interview','hired'].includes(app.status) },
    { key: 'shortlisted', label: 'Shortlisted', date: ['shortlisted','interview','hired'].includes(app.status) ? app.updatedAt : null, done: ['shortlisted','interview','hired'].includes(app.status) },
    { key: 'interview', label: 'Interview', date: ['interview','hired'].includes(app.status) ? app.updatedAt : null, done: ['interview','hired'].includes(app.status) },
    { key: 'decision', label: 'Final Decision', date: ['hired','rejected'].includes(app.status) ? app.updatedAt : null, done: ['hired','rejected'].includes(app.status) }
  ];

  const isRejected = app.status === 'rejected';

  return (
    <SafeAreaView className="flex-1 bg-muted" edges={['top']}>
      <View className="flex-row items-center justify-between px-6 py-4 bg-white border-b border-border">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
          <Ionicons name="arrow-back" size={24} color="#171717" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-foreground">Application Status</Text>
        <View className="w-10" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 60, paddingTop: 24 }}>
        {/* Job Snippet */}
        <View className="bg-white p-6 rounded-3xl shadow-sm mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <View className="w-12 h-12 rounded-xl bg-muted items-center justify-center">
              <Text className="text-base font-bold text-muted-foreground">{app.companyName.substring(0,2)}</Text>
            </View>
            <TouchableOpacity onPress={() => router.push(`/job/${app.jobId}` as any)}>
              <Text className="text-sm font-semibold text-primary">View Job</Text>
            </TouchableOpacity>
          </View>
          <Text className="text-lg font-bold text-foreground mb-1">{app.jobTitle}</Text>
          <Text className="text-[15px] text-muted-foreground">{app.companyName}</Text>
        </View>

        {/* Timeline */}
        <View className="mb-8">
          <Text className="text-lg font-bold text-foreground mb-4">Progress</Text>
          <View className="bg-white p-6 rounded-3xl shadow-sm">
            {steps.map((step, index) => {
              const isLast = index === steps.length - 1;
              let indicatorColor = "#e2e8f0"; // border color
              let iconName = 'ellipse-outline';
              
              if (step.done) {
                indicatorColor = "#0ea5e9"; // primary color
                iconName = 'checkmark-circle';
              }
              if (isLast && isRejected) {
                indicatorColor = "#e11d48"; // danger color
                iconName = 'close-circle';
              }

              return (
                <View key={step.key} className="flex-row items-start">
                  <View className="items-center w-5">
                    <Ionicons name={iconName as any} size={20} color={indicatorColor} />
                    {!isLast && <View className={`w-0.5 h-[30px] my-1 ${step.done ? 'bg-primary' : 'bg-muted'}`} />}
                  </View>
                  <View className="flex-1 ml-4 pb-6">
                    <Text className={`text-[15px] font-semibold mb-0.5 ${step.done || (isLast && isRejected) ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {isLast && isRejected ? 'Application Rejected' : step.label}
                    </Text>
                    {step.date && <Text className="text-[13px] text-muted-foreground">{step.date}</Text>}
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Applied Materials */}
        <View className="mb-8">
          <Text className="text-lg font-bold text-foreground mb-4">Submitted Materials</Text>
          <View className="bg-white p-6 rounded-3xl shadow-sm bg-y">
            <View className="flex-row items-center">
              <View className="w-11 h-11 rounded-xl bg-[#0ea5e9]/10 items-center justify-center mr-4">
                <Ionicons name="document-text" size={20} color="#0ea5e9" />
              </View>
              <View className="flex-1">
                <Text className="text-[15px] font-semibold text-foreground mb-0.5">Sarah_Chen_Resume.pdf</Text>
                <Text className="text-xs text-muted-foreground">Uploaded Mar 15, 2025</Text>
              </View>
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
