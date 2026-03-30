import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Spacing, BorderRadius, FontSize } from '@/constants/theme';
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
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <IconSymbol name="chevron.left" size={24} color={Colors.light.textSecondary} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.stepText}>Step 2 of 3</Text>
          <Text style={styles.title}>Education First</Text>
          <Text style={styles.subtitle}>Where are you currently studying?</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>University Name</Text>
            <View style={styles.inputContainer}>
              <IconSymbol name="building.2.fill" size={20} color={Colors.light.textTertiary} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="e.g. University of Texas"
                placeholderTextColor={Colors.light.textTertiary}
                value={university}
                onChangeText={setUniversity}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Degree Program</Text>
            <View style={styles.inputContainer}>
              <IconSymbol name="book.fill" size={20} color={Colors.light.textTertiary} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="e.g. B.S. Petroleum Engineering"
                placeholderTextColor={Colors.light.textTertiary}
                value={degree}
                onChangeText={setDegree}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Expected Graduation Year</Text>
            <View style={styles.inputContainer}>
              <IconSymbol name="calendar" size={20} color={Colors.light.textTertiary} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="e.g. 2026"
                placeholderTextColor={Colors.light.textTertiary}
                value={graduationYear}
                onChangeText={setGraduationYear}
                keyboardType="numeric"
                maxLength={4}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>Continue</Text>
            <IconSymbol name="chevron.right" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  content: { flex: 1, padding: Spacing.xl, justifyContent: 'center' },
  backButton: { position: 'absolute', top: 60, left: Spacing.xl, zIndex: 10 },
  header: { marginBottom: Spacing.xxl, marginTop: Spacing.xl },
  stepText: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.light.primary, textTransform: 'uppercase', marginBottom: Spacing.xs, letterSpacing: 1 },
  title: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.light.text, marginBottom: Spacing.xs },
  subtitle: { fontSize: FontSize.md, color: Colors.light.textSecondary },
  form: { gap: Spacing.xl },
  inputGroup: { gap: Spacing.sm },
  label: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.light.textSecondary, marginLeft: Spacing.xs },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.light.surface, borderWidth: 1, borderColor: Colors.light.border, borderRadius: BorderRadius.lg, paddingHorizontal: Spacing.md },
  icon: { marginRight: Spacing.sm },
  input: { flex: 1, paddingVertical: Spacing.md, fontSize: FontSize.md, color: Colors.light.text },
  button: { flexDirection: 'row', backgroundColor: Colors.light.primary, padding: Spacing.lg, borderRadius: BorderRadius.lg, alignItems: 'center', justifyContent: 'center', marginTop: Spacing.md, gap: Spacing.sm },
  buttonText: { color: '#fff', fontSize: FontSize.md, fontWeight: 'bold' },
});
