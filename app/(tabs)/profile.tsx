import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { currentUser } from '@/constants/mock-data';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();
  const [expandedSection, setExpandedSection] = useState<string | null>('Education');

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <View className="flex-1 bg-slate-50">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* Top Image Section (Header) */}
        <View className="relative w-full h-[400px]">
          {/* Header Actions */}
          <SafeAreaView className="absolute top-0 left-0 right-0 z-10 flex-row justify-between px-6 pt-4">
            <TouchableOpacity onPress={() => router.back()} className="w-12 h-12 rounded-full bg-white/80 items-center justify-center border border-white/50 backdrop-blur-md">
              <Ionicons name="arrow-back" size={24} color="#0f172a" />
            </TouchableOpacity>
            <TouchableOpacity className="w-12 h-12 rounded-full bg-slate-900 items-center justify-center shadow-lg">
              <Ionicons name="briefcase" size={20} color="#ffffff" />
            </TouchableOpacity>
          </SafeAreaView>

          {/* User Image Background */}
          {/* In a real app this would be currentUser.profileImage, we'll use a placeholder resembling the mockup */}
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop' }} 
            className="w-full h-full opacity-90"
            style={{ resizeMode: 'cover' }}
          />

          {/* Gradient Overlay at bottom to blend into background */}
          <View className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 to-transparent" />
        </View>

        {/* Content Section */}
        <View className="px-6 -mt-10 z-20">
          
          {/* Title & Name */}
          <View className="mb-6">
            <Text className="text-[34px] font-bold text-foreground mb-1 leading-tight">{currentUser.degree}</Text>
            <Text className="text-[17px] font-medium text-muted-foreground">By {currentUser.fullName}</Text>
          </View>

          {/* Action Buttons */}
          <View className="flex-row gap-4 mb-8">
            <TouchableOpacity className="flex-auto h-14 bg-slate-900 rounded-full flex-row items-center justify-center gap-2 shadow-sm">
              <Ionicons name="document-text" size={20} color="#ffffff" />
              <Text className="text-[15px] font-bold text-white">CV • 1.2 MB</Text>
            </TouchableOpacity>
            
            <TouchableOpacity className="flex-auto h-14 bg-primary rounded-full flex-row items-center justify-center gap-2 shadow-md shadow-primary/30">
              <Ionicons name="call" size={20} color="#ffffff" />
              <Text className="text-[15px] font-bold text-white">Contact</Text>
            </TouchableOpacity>
          </View>

          {/* Accordion List */}
          <View className="gap-3">
            
            {/* Work Experience */}
            <TouchableOpacity 
              onPress={() => toggleSection('Experience')}
              className="bg-white rounded-[24px] p-5 shadow-sm border border-slate-100"
            >
              <View className="flex-row justify-between items-center">
                <Text className="text-[20px] font-bold text-foreground">Work Experience</Text>
                <Ionicons name={expandedSection === 'Experience' ? 'chevron-up' : 'chevron-down'} size={20} color="#94a3b8" />
              </View>
              {expandedSection === 'Experience' && (
                <View className="mt-4 pt-4 border-t border-slate-100">
                  <Text className="text-[15px] text-muted-foreground mb-1">SF/Remote • Full time • Engineering</Text>
                  <Text className="text-sm font-medium text-foreground mt-2">Senior Developer at TechCorp (2020 - Present)</Text>
                  <Text className="text-sm text-muted-foreground mt-1">Led a team of 5 engineers to build the core platform...</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Education */}
            <TouchableOpacity 
              onPress={() => toggleSection('Education')}
              className="bg-white rounded-[24px] p-5 shadow-sm border border-slate-100"
            >
              <View className="flex-row justify-between items-center">
                <Text className="text-[20px] font-bold text-foreground">Education</Text>
                <Ionicons name={expandedSection === 'Education' ? 'chevron-up' : 'chevron-down'} size={20} color="#94a3b8" />
              </View>
              {expandedSection === 'Education' && (
                <View className="mt-5 flex-row">
                  <View className="w-14 h-14 bg-rose-900 rounded-2xl items-center justify-center mr-4 shadow-sm overflow-hidden">
                    <Text className="text-white font-bold text-xs text-center leading-tight">HARVARD</Text>
                  </View>
                  <View className="flex-1 justify-center">
                    <Text className="text-[17px] font-bold text-foreground mb-1">Harvard University</Text>
                    <Text className="text-sm text-muted-foreground">Bachelor of Computer Science</Text>
                    <Text className="text-[13px] text-muted-foreground mt-0.5">2009 - 2013</Text>
                  </View>
                </View>
              )}
            </TouchableOpacity>

            {/* Certification */}
            <TouchableOpacity 
              onPress={() => toggleSection('Certification')}
              className="bg-white rounded-[24px] p-5 shadow-sm border border-slate-100"
            >
              <View className="flex-row justify-between items-center">
                <Text className="text-[20px] font-bold text-foreground">Certification</Text>
                <Ionicons name={expandedSection === 'Certification' ? 'chevron-up' : 'chevron-down'} size={20} color="#94a3b8" />
              </View>
              {expandedSection === 'Certification' && (
                <View className="mt-5 flex-row items-center">
                  <View className="w-14 h-14 bg-red-600 rounded-2xl items-center justify-center mr-4">
                    <Ionicons name="ribbon" size={28} color="#ffffff" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-[17px] font-bold text-foreground mb-1">Adobe Certification</Text>
                    <Text className="text-sm text-muted-foreground">Issued Dec 2022</Text>
                  </View>
                </View>
              )}
            </TouchableOpacity>

          </View>

        </View>

      </ScrollView>
    </View>
  );
}
