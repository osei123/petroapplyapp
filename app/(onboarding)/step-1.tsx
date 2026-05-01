import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function OnboardingStep1() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  const handleNext = () => {
    if (!fullName.trim() || !phone.trim()) {
      Alert.alert('Required Fields', 'Please enter your full name and phone number to proceed.');
      return;
    }

    router.push({
      pathname: '/(onboarding)/step-2' as any,
      params: { fullName: fullName.trim(), phone: phone.trim() }
    });
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-background">
      <View className="flex-1 px-6 justify-center">
        <View className="mb-10">
          <Text className="text-sm font-outfit-b text-primary uppercase tracking-widest mb-2">Step 1 of 3</Text>
          <Text className="text-3xl font-outfit-b text-foreground mb-2">Welcome Abroad!</Text>
          <Text className="text-base font-work-sans text-foreground/70">Let's start with your basic information.</Text>
        </View>

        <View className="gap-6">
          <View className="gap-2">
            <Text className="text-sm font-outfit-sb text-foreground/80 ml-1">Full Name</Text>
            <View className="flex-row items-center bg-white border-2 border-border rounded-xl px-4 py-3.5 shadow-sm">
              <IconSymbol name="person.fill" size={20} color="#0C4A6E80" className="mr-3" />
              <TextInput
                className="flex-1 text-base font-work-sans text-foreground"
                placeholder="John Doe"
                placeholderTextColor="#0C4A6E80"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>
          </View>

          <View className="gap-2">
            <Text className="text-sm font-outfit-sb text-foreground/80 ml-1">Phone Number</Text>
            <View className="flex-row items-center bg-white border-2 border-border rounded-xl px-4 py-3.5 shadow-sm">
              <IconSymbol name="phone.fill" size={20} color="#0C4A6E80" className="mr-3" />
              <TextInput
                className="flex-1 text-base font-work-sans text-foreground"
                placeholder="+1 (555) 000-0000"
                placeholderTextColor="#0C4A6E80"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <TouchableOpacity 
            className="flex-row bg-primary py-4 rounded-xl items-center justify-center mt-4 gap-2 shadow-sm" 
            onPress={handleNext}
          >
            <Text className="text-white text-base font-outfit-b">Continue</Text>
            <IconSymbol name="chevron.right" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
