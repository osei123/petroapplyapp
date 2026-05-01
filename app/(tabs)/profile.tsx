import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/Card';

const menuItems = [
  { label: 'Edit Profile', icon: 'person.fill' as const, route: '/edit-profile' },
  { label: 'Documents', icon: 'doc.text.fill' as const, route: '/documents' },
  { label: 'Notifications', icon: 'bell.fill' as const, route: '/notifications' },
  { label: 'Settings', icon: 'gear' as const, route: '/settings' },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { user, userProfile } = useAuth();

  if (!userProfile) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color="#0369A1" />
      </View>
    );
  }

  const initials = userProfile.full_name 
    ? userProfile.full_name.split(" ").map((n: string) => n[0]).join("").substring(0, 2) 
    : "PA";

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-6 pb-2">
          <Text className="text-2xl font-outfit-b text-foreground">Profile</Text>
        </View>

        {/* Profile Card */}
        <View className="px-6 mt-4">
          <Card className="items-center p-8">
            <View className="relative mb-4">
              <View className="w-20 h-20 rounded-full bg-primary items-center justify-center">
                <Text className="text-2xl font-outfit-b text-white uppercase">{initials}</Text>
              </View>
              <TouchableOpacity className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-secondary items-center justify-center border-2 border-white">
                <IconSymbol name="person.fill" size={12} color="#fff" />
              </TouchableOpacity>
            </View>
            <Text className="text-xl font-outfit-b text-foreground">{userProfile.full_name || "Petro Scholar"}</Text>
            <Text className="text-sm font-work-sans text-foreground/70 mt-1">{user?.email}</Text>
            <Text className="text-xs font-work-sans text-foreground/50 mt-2 text-center">
              {userProfile.degree || "Degree"} · {userProfile.university || "University"}
            </Text>

            {/* Completion */}
            <View className="w-full bg-primary/10 rounded-xl p-4 mt-6">
              <View className="flex-row justify-between mb-2">
                <Text className="text-sm font-outfit-sb text-primary">Profile Completion</Text>
                <Text className="text-sm font-outfit-b text-primary">{userProfile.profile_completion || 0}%</Text>
              </View>
              <View className="h-1.5 bg-primary/20 rounded-full">
                <View className="h-1.5 bg-primary rounded-full" style={{ width: `${userProfile.profile_completion || 0}%` }} />
              </View>
            </View>
          </Card>
        </View>

        {/* Bio */}
        {userProfile.bio && (
          <View className="mt-8 px-6">
            <Text className="text-lg font-outfit-b text-foreground mb-4">About</Text>
            <Card className="p-5">
              <Text className="text-base font-work-sans text-foreground/80 leading-relaxed">{userProfile.bio}</Text>
            </Card>
          </View>
        )}

        {/* Skills */}
        <View className="mt-8 px-6">
          <Text className="text-lg font-outfit-b text-foreground mb-4">Skills</Text>
          <View className="flex-row flex-wrap gap-2">
            {userProfile.skills && userProfile.skills.length > 0 ? userProfile.skills.map((skill: string) => (
              <View key={skill} className="bg-primary/10 px-4 py-2 rounded-full">
                <Text className="text-sm font-outfit-sb text-primary capitalize">{skill}</Text>
              </View>
            )) : (
              <Text className="text-sm font-work-sans text-foreground/50">No skills added yet.</Text>
            )}
          </View>
        </View>

        {/* Details */}
        <View className="mt-8 px-6">
          <Text className="text-lg font-outfit-b text-foreground mb-4">Details</Text>
          <Card className="p-0 overflow-hidden">
            {[
              { label: 'Country', value: userProfile.country || "N/A" },
              { label: 'Phone', value: userProfile.phone || "N/A" },
              { label: 'Graduation', value: userProfile.graduation_year ? String(userProfile.graduation_year) : "N/A" },
              { label: 'LinkedIn', value: userProfile.linkedin_url || "N/A" },
            ].map((item, index) => (
              <View key={item.label} className={`flex-row justify-between p-4 ${index !== 3 ? 'border-b border-border' : ''}`}>
                <Text className="text-sm font-work-sans text-foreground/60">{item.label}</Text>
                <Text className="text-sm font-work-sans-sb text-foreground max-w-[60%]" numberOfLines={1}>{item.value}</Text>
              </View>
            ))}
          </Card>
        </View>

        {/* Menu */}
        <View className="mt-8 mb-10 px-6">
          <Card className="p-0 overflow-hidden">
            {menuItems.map((item, index) => (
              <TouchableOpacity 
                key={item.label} 
                className={`flex-row items-center p-5 gap-4 ${index !== menuItems.length - 1 ? 'border-b border-border' : ''}`}
                onPress={() => router.push(item.route as any)}
              >
                <IconSymbol name={item.icon} size={20} color="#0369A1" />
                <Text className="flex-1 text-base font-outfit-sb text-foreground">{item.label}</Text>
                <IconSymbol name="chevron.right" size={16} color="#0C4A6E80" />
              </TouchableOpacity>
            ))}
            <TouchableOpacity 
              className="flex-row items-center p-5 gap-4 border-t border-border" 
              onPress={async () => await supabase.auth.signOut()}
            >
              <IconSymbol name="xmark.circle.fill" size={20} color="#ef4444" />
              <Text className="flex-1 text-base font-outfit-sb text-red-500">Log Out</Text>
            </TouchableOpacity>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
