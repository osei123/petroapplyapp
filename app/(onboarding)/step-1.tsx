import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, BorderRadius, FontSize } from '@/constants/theme';
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
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.stepText}>Step 1 of 3</Text>
          <Text style={styles.title}>Welcome Abroad!</Text>
          <Text style={styles.subtitle}>Let's start with your basic information.</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputContainer}>
              <IconSymbol name="person.fill" size={20} color={Colors.light.textTertiary} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="John Doe"
                placeholderTextColor={Colors.light.textTertiary}
                value={fullName}
                onChangeText={setFullName}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <View style={styles.inputContainer}>
              <IconSymbol name="phone.fill" size={20} color={Colors.light.textTertiary} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="+1 (555) 000-0000"
                placeholderTextColor={Colors.light.textTertiary}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
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
  header: { marginBottom: Spacing.xxl },
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
