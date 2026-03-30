import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Colors, Spacing, BorderRadius, FontSize } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    if (!email || !password) {
      Alert.alert('Validation Error', 'Please enter your email and password.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) Alert.alert('Sign In Error', error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    if (!email || !password) {
      Alert.alert('Validation Error', 'Please enter an email and password to create an account.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      Alert.alert('Sign Up Error', error.message);
    } else {
      // Navigate to OTP confirmation screen
      router.push({ pathname: '/(auth)/confirm', params: { email } } as any);
    }
    setLoading(false);
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <IconSymbol name="drop.fill" size={32} color="#fff" />
          </View>
          <Text style={styles.title}>PetroApply</Text>
          <Text style={styles.subtitle}>Sign in to your student account</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="student@university.edu"
              placeholderTextColor={Colors.light.textTertiary}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={Colors.light.textTertiary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
          
          <TouchableOpacity 
            style={{ alignItems: 'flex-end', marginTop: -8 }} 
            onPress={() => router.push('/(auth)/reset-password' as any)}
          >
            <Text style={{ fontSize: FontSize.sm, color: Colors.light.primary, fontWeight: '600' }}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={signInWithEmail} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign In</Text>}
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={signUpWithEmail} disabled={loading}>
            <Text style={styles.buttonTextSecondary}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  content: { flex: 1, justifyContent: 'center', padding: Spacing.xl },
  header: { alignItems: 'center', marginBottom: Spacing.xxxl },
  logoContainer: { width: 64, height: 64, borderRadius: 20, backgroundColor: Colors.light.primary, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.lg },
  title: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.light.text, marginBottom: Spacing.xs },
  subtitle: { fontSize: FontSize.md, color: Colors.light.textSecondary },
  form: { gap: Spacing.lg },
  inputGroup: { gap: Spacing.xs },
  label: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.light.textSecondary, marginLeft: Spacing.xs },
  input: { backgroundColor: Colors.light.surface, borderWidth: 1, borderColor: Colors.light.border, borderRadius: BorderRadius.lg, padding: Spacing.md, fontSize: FontSize.md, color: Colors.light.text },
  button: { backgroundColor: Colors.light.primary, padding: Spacing.lg, borderRadius: BorderRadius.lg, alignItems: 'center', marginTop: Spacing.md },
  buttonText: { color: '#fff', fontSize: FontSize.md, fontWeight: 'bold' },
  buttonSecondary: { backgroundColor: 'transparent', borderWidth: 1, borderColor: Colors.light.primary, marginTop: Spacing.sm },
  buttonTextSecondary: { color: Colors.light.primary, fontSize: FontSize.md, fontWeight: 'bold' },
});
