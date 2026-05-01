import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/Card';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, userProfile, refreshProfile } = useAuth();

  const [fullName, setFullName] = useState(userProfile?.full_name || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [country, setCountry] = useState(userProfile?.country || '');
  const [university, setUniversity] = useState(userProfile?.university || '');
  const [degree, setDegree] = useState(userProfile?.degree || '');
  const [graduationYear, setGraduationYear] = useState(userProfile?.graduation_year ? String(userProfile.graduation_year) : '');
  const [bio, setBio] = useState(userProfile?.bio || '');
  const [linkedinUrl, setLinkedinUrl] = useState(userProfile?.linkedin_url || '');
  const [skillsText, setSkillsText] = useState(userProfile?.skills ? userProfile.skills.join(', ') : '');
  const [saving, setSaving] = useState(false);

  const initials = fullName
    ? fullName.split(" ").map((n: string) => n[0]).join("").substring(0, 2)
    : "PA";

  const handleSave = async () => {
    if (!user) return;
    if (!fullName.trim()) {
      Alert.alert('Required', 'Full name cannot be empty.');
      return;
    }

    setSaving(true);
    try {
      const skillsArray = skillsText
        .split(',')
        .map((s: string) => s.trim().toLowerCase())
        .filter((s: string) => s.length > 0);

      const { error } = await supabase
        .from('user_profiles')
        .update({
          full_name: fullName.trim(),
          phone: phone.trim() || null,
          country: country.trim() || null,
          university: university.trim() || null,
          degree: degree.trim() || null,
          graduation_year: graduationYear ? parseInt(graduationYear, 10) : null,
          bio: bio.trim() || null,
          linkedin_url: linkedinUrl.trim() || null,
          skills: skillsArray,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      await refreshProfile();
      Alert.alert('Success', 'Your profile has been updated.', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  const Field = ({ label, value, onChangeText, placeholder, keyboardType = 'default', multiline = false, editable = true }: any) => (
    <View className="mb-5">
      <Text className="text-sm font-outfit-sb text-foreground/80 mb-2 ml-1">{label}</Text>
      <TextInput 
        className={`bg-white border border-border rounded-xl px-4 ${multiline ? 'py-4 min-h-[100px]' : 'py-3.5'} text-base font-work-sans text-foreground shadow-sm ${!editable ? 'opacity-60 bg-muted/50' : ''}`}
        value={value} 
        onChangeText={onChangeText} 
        placeholder={placeholder} 
        placeholderTextColor="#0C4A6E80"
        keyboardType={keyboardType}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        editable={editable}
      />
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Navigation Bar */}
      <View className="flex-row items-center justify-between px-6 py-4">
        <TouchableOpacity 
          className="w-10 h-10 rounded-full bg-white border border-border items-center justify-center shadow-sm" 
          onPress={() => router.back()} 
          disabled={saving}
        >
          <IconSymbol name="arrow.left" size={20} color="#0C4A6E" />
        </TouchableOpacity>
        <Text className="text-lg font-outfit-b text-foreground">Edit Profile</Text>
        <TouchableOpacity onPress={handleSave} disabled={saving}>
          {saving ? (
            <ActivityIndicator size="small" color="#0369A1" />
          ) : (
            <Text className="text-base font-outfit-b text-primary">Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
          {/* Avatar Section */}
          <View className="items-center py-6 mb-4">
            <View className="w-24 h-24 rounded-full bg-primary items-center justify-center shadow-sm border-4 border-white">
              <Text className="text-3xl font-outfit-b text-white uppercase">{initials}</Text>
            </View>
            <TouchableOpacity className="mt-4 px-4 py-2 bg-primary/10 rounded-full">
              <Text className="text-sm font-outfit-b text-primary">Change Photo</Text>
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <Card className="p-6 mb-6">
            <Text className="text-lg font-outfit-b text-foreground mb-6">Personal Details</Text>
            <Field label="Full Name" value={fullName} onChangeText={setFullName} placeholder="John Doe" />
            <Field label="Email" value={user?.email || ''} placeholder="Email" editable={false} />
            <Field label="Phone" value={phone} onChangeText={setPhone} placeholder="+1 (555) 000-0000" keyboardType="phone-pad" />
            <Field label="Country" value={country} onChangeText={setCountry} placeholder="e.g. United States" />
          </Card>

          <Card className="p-6 mb-6">
            <Text className="text-lg font-outfit-b text-foreground mb-6">Education</Text>
            <Field label="University" value={university} onChangeText={setUniversity} placeholder="e.g. University of Texas" />
            <Field label="Degree" value={degree} onChangeText={setDegree} placeholder="e.g. B.S. Petroleum Engineering" />
            <Field label="Graduation Year" value={graduationYear} onChangeText={setGraduationYear} placeholder="e.g. 2026" keyboardType="numeric" />
          </Card>

          <Card className="p-6 mb-6">
            <Text className="text-lg font-outfit-b text-foreground mb-6">Professional</Text>
            <Field label="Bio" value={bio} onChangeText={setBio} placeholder="Tell employers about yourself..." multiline={true} />
            <Field label="LinkedIn URL" value={linkedinUrl} onChangeText={setLinkedinUrl} placeholder="https://linkedin.com/in/yourname" />
            <Field label="Skills (comma separated)" value={skillsText} onChangeText={setSkillsText} placeholder="e.g. Drilling, Reservoir Engineering, Python" multiline={true} />
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
