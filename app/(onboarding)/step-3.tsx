import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Spacing, BorderRadius, FontSize } from '@/constants/theme';
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

      // Tells the AuthContext to re-fetch the completed userProfile
      // which will trigger the layout effect to auto-route to /(tabs)
      await refreshProfile();
      
    } catch (error: any) {
      Alert.alert('Setup Error', error.message || 'Failed to complete profile setup.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} disabled={loading}>
          <IconSymbol name="chevron.left" size={24} color={Colors.light.textSecondary} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.stepText}>Step 3 of 3</Text>
          <Text style={styles.title}>Your Expertise</Text>
          <Text style={styles.subtitle}>Add some skills to finish your profile.</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Add Technical or Soft Skills</Text>
            <View style={styles.inputRow}>
              <View style={[styles.inputContainer, { flex: 1 }]}>
                <IconSymbol name="tag.fill" size={20} color={Colors.light.textTertiary} style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Drilling Engineering"
                  placeholderTextColor={Colors.light.textTertiary}
                  value={skillInput}
                  onChangeText={setSkillInput}
                  onSubmitEditing={handleAddSkill}
                  returnKeyType="done"
                />
              </View>
              <TouchableOpacity style={styles.addButton} onPress={handleAddSkill}>
                <IconSymbol name="plus" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.skillsContainer}>
            {skills.map((skill, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.skillBadge}
                onPress={() => handleRemoveSkill(skill)}
              >
                <Text style={styles.skillText}>{skill}</Text>
                <IconSymbol name="xmark.circle.fill" size={14} color={Colors.light.primary} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleFinish}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.buttonText}>Complete Profile</Text>
                <IconSymbol name="checkmark" size={20} color="#fff" />
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  content: { flex: 1, padding: Spacing.xl, justifyContent: 'space-between' },
  backButton: { position: 'absolute', top: 60, left: Spacing.xl, zIndex: 10 },
  header: { marginBottom: Spacing.lg, marginTop: Spacing.xl + 40 },
  stepText: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.light.primary, textTransform: 'uppercase', marginBottom: Spacing.xs, letterSpacing: 1 },
  title: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.light.text, marginBottom: Spacing.xs },
  subtitle: { fontSize: FontSize.md, color: Colors.light.textSecondary },
  form: { flex: 1 },
  inputGroup: { gap: Spacing.sm },
  label: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.light.textSecondary, marginLeft: Spacing.xs },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.light.surface, borderWidth: 1, borderColor: Colors.light.border, borderRadius: BorderRadius.lg, paddingHorizontal: Spacing.md },
  icon: { marginRight: Spacing.sm },
  input: { flex: 1, paddingVertical: Spacing.md, fontSize: FontSize.md, color: Colors.light.text },
  addButton: { width: 52, height: 52, backgroundColor: Colors.light.primary, borderRadius: BorderRadius.lg, alignItems: 'center', justifyContent: 'center' },
  skillsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginTop: Spacing.lg },
  skillBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.light.surface, borderWidth: 1, borderColor: Colors.light.primary + '30', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: BorderRadius.full, gap: Spacing.xs },
  skillText: { fontSize: FontSize.sm, fontWeight: '500', color: Colors.light.primary, textTransform: 'capitalize' },
  footer: { paddingBottom: Spacing.xl },
  button: { flexDirection: 'row', backgroundColor: Colors.light.primary, padding: Spacing.lg, borderRadius: BorderRadius.lg, alignItems: 'center', justifyContent: 'center', gap: Spacing.sm },
  buttonText: { color: '#fff', fontSize: FontSize.md, fontWeight: 'bold' },
});
