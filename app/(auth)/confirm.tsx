import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Colors, Spacing, BorderRadius, FontSize } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';

const CODE_LENGTH = 8;

export default function ConfirmSignUpScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const router = useRouter();
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // Auto-focus first input on mount
  useEffect(() => {
    setTimeout(() => inputRefs.current[0]?.focus(), 300);
  }, []);

  const handleChange = (text: string, index: number) => {
    // Only allow digits
    const digit = text.replace(/[^0-9]/g, '');
    if (!digit && text !== '') return;

    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);

    // Auto-advance to next input
    if (digit && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits are entered
    if (digit && index === CODE_LENGTH - 1) {
      const fullCode = newCode.join('');
      if (fullCode.length === CODE_LENGTH) {
        verifyCode(fullCode);
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      const newCode = [...code];
      newCode[index - 1] = '';
      setCode(newCode);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (text: string) => {
    const digits = text.replace(/[^0-9]/g, '').slice(0, CODE_LENGTH).split('');
    if (digits.length === 0) return;
    const newCode = Array(CODE_LENGTH).fill('');
    digits.forEach((d, i) => (newCode[i] = d));
    setCode(newCode);
    if (digits.length === CODE_LENGTH) {
      verifyCode(newCode.join(''));
    } else {
      inputRefs.current[digits.length]?.focus();
    }
  };

  const verifyCode = async (token: string) => {
    if (!email) {
      Alert.alert('Error', 'Email address is missing.');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'signup',
      });

      if (error) {
        Alert.alert('Verification Failed', error.message);
        setCode(Array(CODE_LENGTH).fill(''));
        inputRefs.current[0]?.focus();
      }
      // On success, the auth state change in AuthContext will handle navigation
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    if (countdown > 0 || !email) return;
    setResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) throw error;
      setCountdown(60);
      Alert.alert('Code Sent', 'A new verification code has been sent to your email.');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to resend code.');
    } finally {
      setResending(false);
    }
  };

  const fullCode = code.join('');

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.content}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="arrow.left" size={20} color={Colors.light.text} />
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <IconSymbol name="envelope.fill" size={32} color="#fff" />
          </View>
          <Text style={styles.title}>Verify Your Email</Text>
          <Text style={styles.subtitle}>
            We've sent a {CODE_LENGTH}-digit code to
          </Text>
          <Text style={styles.emailText}>{email}</Text>
        </View>

        {/* OTP Inputs */}
        <View style={styles.codeContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => { inputRefs.current[index] = ref; }}
              style={[
                styles.codeInput,
                digit ? styles.codeInputFilled : {},
                loading ? { opacity: 0.5 } : {},
              ]}
              value={digit}
              onChangeText={(text) => {
                if (text.length > 1) {
                  handlePaste(text);
                } else {
                  handleChange(text, index);
                }
              }}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
              editable={!loading}
            />
          ))}
        </View>

        {/* Verify Button */}
        <TouchableOpacity
          style={[styles.verifyBtn, fullCode.length < CODE_LENGTH && styles.verifyBtnDisabled]}
          onPress={() => verifyCode(fullCode)}
          disabled={loading || fullCode.length < CODE_LENGTH}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.verifyBtnText}>Verify & Continue</Text>
          )}
        </TouchableOpacity>

        {/* Resend */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendLabel}>Didn't receive the code?</Text>
          {countdown > 0 ? (
            <Text style={styles.countdownText}>Resend in {countdown}s</Text>
          ) : (
            <TouchableOpacity onPress={resendCode} disabled={resending}>
              {resending ? (
                <ActivityIndicator size="small" color={Colors.light.primary} />
              ) : (
                <Text style={styles.resendBtn}>Resend Code</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  content: { flex: 1, justifyContent: 'center', padding: Spacing.xl },
  backBtn: {
    position: 'absolute', top: 60, left: Spacing.xl,
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.light.surface, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.light.border, zIndex: 10,
  },
  header: { alignItems: 'center', marginBottom: Spacing.xxxl },
  iconContainer: {
    width: 64, height: 64, borderRadius: 20,
    backgroundColor: Colors.light.primary,
    alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.lg,
  },
  title: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.light.text, marginBottom: Spacing.xs },
  subtitle: { fontSize: FontSize.md, color: Colors.light.textSecondary, textAlign: 'center' },
  emailText: { fontSize: FontSize.md, fontWeight: '700', color: Colors.light.primary, marginTop: 4 },
  codeContainer: {
    flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: Spacing.xxl,
  },
  codeInput: {
    width: 40, height: 50, borderRadius: BorderRadius.lg,
    backgroundColor: Colors.light.surface, borderWidth: 2, borderColor: Colors.light.border,
    textAlign: 'center', fontSize: 22, fontWeight: '800', color: Colors.light.text,
  },
  codeInputFilled: {
    borderColor: Colors.light.primary, backgroundColor: Colors.light.primaryLight,
  },
  verifyBtn: {
    backgroundColor: Colors.light.primary, padding: Spacing.lg,
    borderRadius: BorderRadius.lg, alignItems: 'center',
  },
  verifyBtnDisabled: { opacity: 0.5 },
  verifyBtnText: { color: '#fff', fontSize: FontSize.md, fontWeight: 'bold' },
  resendContainer: { alignItems: 'center', marginTop: Spacing.xxl, gap: Spacing.sm },
  resendLabel: { fontSize: FontSize.sm, color: Colors.light.textTertiary },
  countdownText: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.light.textSecondary },
  resendBtn: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.light.primary },
});
