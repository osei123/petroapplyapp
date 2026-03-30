import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Colors, Spacing, BorderRadius, FontSize } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function ResetPasswordScreen() {
  const router = useRouter();
  
  // States: 'email' -> 'otp' -> 'new_password'
  const [step, setStep] = useState<'email' | 'otp' | 'new_password'>('email');
  const [loading, setLoading] = useState(false);
  
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Step 1: Request OTP
  async function requestReset() {
    if (!email) {
      Alert.alert('Validation Error', 'Please enter your account email.');
      return;
    }
    setLoading(true);
    
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Password reset code has been sent to your email.');
      setStep('otp');
    }
    
    setLoading(false);
  }

  // Step 2: Verify OTP
  async function verifyCode() {
    if (!token || token.length < 8) {
      Alert.alert('Validation Error', 'Please enter the 8-digit code sent to your email.');
      return;
    }
    setLoading(true);

    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'recovery',
    });

    if (error) {
      Alert.alert('Verification Error', error.message);
    } else if (data.session) {
      // Successfully authenticated via recovery code
      setStep('new_password');
    } else {
      Alert.alert('Error', 'Invalid or expired code.');
    }
    
    setLoading(false);
  }

  // Step 3: Update Password
  async function updatePassword() {
    if (!newPassword || newPassword.length < 6) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters.');
      return;
    }
    
    setLoading(true);

    // Because verifyOtp (type: recovery) logs the user in, we can update their password
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      Alert.alert('Update Error', error.message);
    } else {
      Alert.alert('Success', 'Your password has been successfully reset!', [
        { text: 'Go to Home', onPress: () => router.replace('/') }
      ]);
    }
    
    setLoading(false);
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => {
          if (step !== 'email') setStep('email');
          else router.back();
        }}>
          <IconSymbol name="arrow.left" size={20} color={Colors.light.text} />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <IconSymbol name="lock.fill" size={32} color="#fff" />
          </View>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            {step === 'email' && 'Enter your email to receive a reset code'}
            {step === 'otp' && `Enter the 8-digit code sent to ${email}`}
            {step === 'new_password' && 'Enter your new secure password'}
          </Text>
        </View>

        <View style={styles.form}>
          {step === 'email' && (
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
          )}

          {step === 'otp' && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>8-Digit Recovery Code</Text>
              <TextInput
                style={[styles.input, { letterSpacing: 8, textAlign: 'center', fontSize: FontSize.xl }]}
                placeholder="00000000"
                placeholderTextColor={Colors.light.textTertiary}
                value={token}
                onChangeText={setToken}
                keyboardType="number-pad"
                maxLength={8}
              />
            </View>
          )}

          {step === 'new_password' && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>New Password</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={Colors.light.textTertiary}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
              />
            </View>
          )}

          <TouchableOpacity 
            style={styles.button} 
            onPress={() => {
              if (step === 'email') requestReset();
              else if (step === 'otp') verifyCode();
              else if (step === 'new_password') updatePassword();
            }} 
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : (
              <Text style={styles.buttonText}>
                {step === 'email' && 'Send Reset Code'}
                {step === 'otp' && 'Verify Code'}
                {step === 'new_password' && 'Update Password'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  navBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.xl, paddingTop: Spacing.xl },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.light.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.light.border },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: Spacing.xl, paddingBottom: 60 },
  header: { alignItems: 'center', marginBottom: Spacing.xxxl },
  logoContainer: { width: 64, height: 64, borderRadius: 20, backgroundColor: Colors.light.primary, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.lg },
  title: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.light.text, marginBottom: Spacing.xs },
  subtitle: { fontSize: FontSize.md, color: Colors.light.textSecondary, textAlign: 'center', paddingHorizontal: Spacing.lg },
  form: { gap: Spacing.lg },
  inputGroup: { gap: Spacing.xs },
  label: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.light.textSecondary, marginLeft: Spacing.xs },
  input: { backgroundColor: Colors.light.surface, borderWidth: 1, borderColor: Colors.light.border, borderRadius: BorderRadius.lg, padding: Spacing.md, fontSize: FontSize.md, color: Colors.light.text },
  button: { backgroundColor: Colors.light.primary, padding: Spacing.lg, borderRadius: BorderRadius.lg, alignItems: 'center', marginTop: Spacing.md },
  buttonText: { color: '#fff', fontSize: FontSize.md, fontWeight: 'bold' },
});
