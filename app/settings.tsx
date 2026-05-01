import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Card } from '@/components/Card';
import { supabase } from '@/lib/supabase';

function SettingsToggle({ label, description, initialValue = false, hideBorder = false }: { label: string; description: string; initialValue?: boolean; hideBorder?: boolean }) {
  const [value, setValue] = useState(initialValue);
  return (
    <View className={`flex-row items-center justify-between py-4 ${hideBorder ? '' : 'border-b border-border'}`}>
      <View className="flex-1 pr-4">
        <Text className="text-base font-outfit-sb text-foreground">{label}</Text>
        <Text className="text-xs font-work-sans text-foreground/60 mt-1 leading-relaxed">{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={setValue}
        trackColor={{ false: '#bae6fd', true: '#0369A180' }}
        thumbColor={value ? '#0369A1' : '#f0f9ff'}
      />
    </View>
  );
}

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Navigation Bar */}
      <View className="flex-row items-center justify-between px-6 py-4">
        <TouchableOpacity 
          className="w-10 h-10 rounded-full bg-white border border-border items-center justify-center shadow-sm" 
          onPress={() => router.back()}
        >
          <IconSymbol name="arrow.left" size={20} color="#0C4A6E" />
        </TouchableOpacity>
        <Text className="text-lg font-outfit-b text-foreground">Settings</Text>
        <View className="w-10" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
        {/* Notifications */}
        <Text className="text-xs font-outfit-b text-foreground/50 uppercase tracking-widest mb-3 ml-2">Notifications</Text>
        <Card className="p-0 px-5 mb-8">
          <SettingsToggle label="Push Notifications" description="Receive push notifications on your device" initialValue={true} />
          <SettingsToggle label="Email Notifications" description="Receive updates via email" initialValue={true} />
          <SettingsToggle label="Job Alerts" description="Get notified when new jobs match your profile" initialValue={true} />
          <SettingsToggle label="Deadline Reminders" description="Reminders before application deadlines" initialValue={true} hideBorder={true} />
        </Card>

        {/* Privacy */}
        <Text className="text-xs font-outfit-b text-foreground/50 uppercase tracking-widest mb-3 ml-2">Privacy</Text>
        <Card className="p-0 px-5 mb-8">
          <SettingsToggle label="Profile Visibility" description="Make your profile visible to employers" initialValue={true} />
          <SettingsToggle label="Show Activity" description="Show when you were last active" initialValue={false} hideBorder={true} />
        </Card>

        {/* Account */}
        <Text className="text-xs font-outfit-b text-foreground/50 uppercase tracking-widest mb-3 ml-2">Account</Text>
        <Card className="p-0 overflow-hidden mb-8">
          <TouchableOpacity className="flex-row items-center justify-between p-5 border-b border-border">
            <Text className="text-base font-outfit-sb text-foreground">Change Password</Text>
            <IconSymbol name="chevron.right" size={16} color="#0C4A6E80" />
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center justify-between p-5 bg-red-50/30">
            <Text className="text-base font-outfit-sb text-red-600">Delete Account</Text>
            <IconSymbol name="chevron.right" size={16} color="#ef4444" />
          </TouchableOpacity>
        </Card>

        {/* About */}
        <Text className="text-xs font-outfit-b text-foreground/50 uppercase tracking-widest mb-3 ml-2">About</Text>
        <Card className="p-0 overflow-hidden mb-8">
          <View className="flex-row items-center justify-between p-5 border-b border-border">
            <Text className="text-base font-outfit-sb text-foreground">Version</Text>
            <Text className="text-base font-work-sans text-foreground/60">1.0.0</Text>
          </View>
          <TouchableOpacity className="flex-row items-center justify-between p-5 border-b border-border">
            <Text className="text-base font-outfit-sb text-foreground">Terms of Service</Text>
            <IconSymbol name="chevron.right" size={16} color="#0C4A6E80" />
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center justify-between p-5">
            <Text className="text-base font-outfit-sb text-foreground">Privacy Policy</Text>
            <IconSymbol name="chevron.right" size={16} color="#0C4A6E80" />
          </TouchableOpacity>
        </Card>

        {/* Logout */}
        <TouchableOpacity 
          className="bg-red-50 border border-red-100 rounded-xl py-4 items-center shadow-sm"
          onPress={async () => await supabase.auth.signOut()}
        >
          <Text className="text-base font-outfit-b text-red-600">Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
