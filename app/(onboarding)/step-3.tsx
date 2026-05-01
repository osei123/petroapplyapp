import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export default function OnboardingStep3() {
  const router = useRouter();
  const { user, refreshProfile } = useAuth();
  const params = useLocalSearchParams();
  
  const { fullName, phone, university, degree, graduationYear } = params;

  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim().toLowerCase())) {
      setSkills([...skills, skillInput.trim().toLowerCase()]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleFinish = async () => {
    if (!user) {
      Alert.alert('Authentication Error', 'No active user session found.');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          full_name: fullName,
          phone: phone,
          university: university,
          degree: degree,
          graduation_year: parseInt(graduationYear as string, 10),
          skills: skills,
          profile_completion: 100,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      await refreshProfile();
      
    } catch (error: any) {
      Alert.alert('Setup Error', error.message || 'Failed to complete profile setup.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-background">
      <View className="flex-1 px-6 justify-between py-10">
        <TouchableOpacity 
          className="absolute top-16 left-6 w-10 h-10 rounded-full bg-white border border-border items-center justify-center shadow-sm z-10" 
          onPress={() => router.back()} 
          disabled={loading}
        >
          <IconSymbol name="arrow.left" size={20} color="#0C4A6E" />
        </TouchableOpacity>

        <View className="mt-20">
          <Text className="text-sm font-outfit-b text-primary uppercase tracking-widest mb-2">Step 3 of 3</Text>
          <Text className="text-3xl font-outfit-b text-foreground mb-2">Your Expertise</Text>
          <Text className="text-base font-work-sans text-foreground/70">Add some skills to finish your profile.</Text>
        </View>

        <View className="flex-1 mt-10">
          <View className="gap-2">
            <Text className="text-sm font-outfit-sb text-foreground/80 ml-1">Add Technical or Soft Skills</Text>
            <View className="flex-row items-center gap-2">
              <View className="flex-1 flex-row items-center bg-white border-2 border-border rounded-xl px-4 py-3.5 shadow-sm">
                <IconSymbol name="tag.fill" size={20} color="#0C4A6E80" className="mr-3" />
                <TextInput
                  className="flex-1 text-base font-work-sans text-foreground"
                  placeholder="e.g. Drilling Engineering"
                  placeholderTextColor="#0C4A6E80"
                  value={skillInput}
                  onChangeText={setSkillInput}
                  onSubmitEditing={handleAddSkill}
                  returnKeyType="done"
                />
              </View>
              <TouchableOpacity 
                className="w-14 h-14 bg-primary rounded-xl items-center justify-center shadow-sm" 
                onPress={handleAddSkill}
              >
                <IconSymbol name="plus" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex-row flex-wrap gap-2 mt-6">
            {skills.map((skill, index) => (
              <TouchableOpacity 
                key={index} 
                className="flex-row items-center bg-white border border-primary/30 px-3 py-2 rounded-full gap-1 shadow-sm"
                onPress={() => handleRemoveSkill(skill)}
              >
                <Text className="text-sm font-outfit-sb text-primary capitalize">{skill}</Text>
                <IconSymbol name="xmark.circle.fill" size={14} color="#0369A1" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="pb-6">
          <TouchableOpacity 
            className="flex-row bg-primary py-4 rounded-xl items-center justify-center gap-2 shadow-sm" 
            onPress={handleFinish}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text className="text-white text-base font-outfit-b">Complete Profile</Text>
                <IconSymbol name="checkmark" size={20} color="#fff" />
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
