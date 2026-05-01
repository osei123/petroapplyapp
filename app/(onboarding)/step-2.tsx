import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function OnboardingStep2() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { fullName, phone } = params;

  const [university, setUniversity] = useState('');
  const [degree, setDegree] = useState('');
  const [graduationYear, setGraduationYear] = useState('');

  const handleNext = () => {
    if (!university.trim() || !degree.trim() || !graduationYear.trim()) {
      Alert.alert('Required Fields', 'Please fill in all your education details to continue.');
      return;
    }

    if (isNaN(Number(graduationYear)) || graduationYear.length !== 4) {
      Alert.alert('Invalid Year', 'Please enter a valid 4-digit graduation year.');
      return;
    }

    router.push({
      pathname: '/(onboarding)/step-3' as any,
      params: { 
        fullName, 
        phone, 
        university: university.trim(), 
        degree: degree.trim(), 
        graduationYear: graduationYear.trim() 
      }
    });
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-background">
      <View className="flex-1 px-6 justify-center">
        <TouchableOpacity 
          className="absolute top-16 left-6 w-10 h-10 rounded-full bg-white border border-border items-center justify-center shadow-sm z-10" 
          onPress={() => router.back()}
        >
          <IconSymbol name="arrow.left" size={20} color="#0C4A6E" />
        </TouchableOpacity>

        <View className="mb-10 mt-6">
          <Text className="text-sm font-outfit-b text-primary uppercase tracking-widest mb-2">Step 2 of 3</Text>
          <Text className="text-3xl font-outfit-b text-foreground mb-2">Education First</Text>
          <Text className="text-base font-work-sans text-foreground/70">Where are you currently studying?</Text>
        </View>

        <View className="gap-6">
          <View className="gap-2">
            <Text className="text-sm font-outfit-sb text-foreground/80 ml-1">University Name</Text>
            <View className="flex-row items-center bg-white border-2 border-border rounded-xl px-4 py-3.5 shadow-sm">
              <IconSymbol name="building.2.fill" size={20} color="#0C4A6E80" className="mr-3" />
              <TextInput
                className="flex-1 text-base font-work-sans text-foreground"
                placeholder="e.g. University of Texas"
                placeholderTextColor="#0C4A6E80"
                value={university}
                onChangeText={setUniversity}
              />
            </View>
          </View>

          <View className="gap-2">
            <Text className="text-sm font-outfit-sb text-foreground/80 ml-1">Degree Program</Text>
            <View className="flex-row items-center bg-white border-2 border-border rounded-xl px-4 py-3.5 shadow-sm">
              <IconSymbol name="book.fill" size={20} color="#0C4A6E80" className="mr-3" />
              <TextInput
                className="flex-1 text-base font-work-sans text-foreground"
                placeholder="e.g. B.S. Petroleum Engineering"
                placeholderTextColor="#0C4A6E80"
                value={degree}
                onChangeText={setDegree}
              />
            </View>
          </View>

          <View className="gap-2">
            <Text className="text-sm font-outfit-sb text-foreground/80 ml-1">Expected Graduation Year</Text>
            <View className="flex-row items-center bg-white border-2 border-border rounded-xl px-4 py-3.5 shadow-sm">
              <IconSymbol name="calendar" size={20} color="#0C4A6E80" className="mr-3" />
              <TextInput
                className="flex-1 text-base font-work-sans text-foreground"
                placeholder="e.g. 2026"
                placeholderTextColor="#0C4A6E80"
                value={graduationYear}
                onChangeText={setGraduationYear}
                keyboardType="numeric"
                maxLength={4}
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
