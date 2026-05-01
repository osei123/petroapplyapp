import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
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

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    setTimeout(() => inputRefs.current[0]?.focus(), 300);
  }, []);

  const handleChange = (text: string, index: number) => {
    const digit = text.replace(/[^0-9]/g, '');
    if (!digit && text !== '') return;

    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);

    if (digit && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

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
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-background">
      <View className="flex-1 justify-center px-6">
        <TouchableOpacity 
          className="absolute top-16 left-6 w-10 h-10 rounded-full bg-white border border-border items-center justify-center shadow-sm z-10" 
          onPress={() => router.back()}
        >
          <IconSymbol name="arrow.left" size={20} color="#0C4A6E" />
        </TouchableOpacity>

        <View className="items-center mb-10">
          <View className="w-16 h-16 rounded-2xl bg-primary items-center justify-center mb-6 shadow-sm">
            <IconSymbol name="envelope.fill" size={32} color="#fff" />
          </View>
          <Text className="text-3xl font-outfit-b text-foreground mb-2">Verify Your Email</Text>
          <Text className="text-base font-work-sans text-foreground/70 text-center">
            We've sent a {CODE_LENGTH}-digit code to
          </Text>
          <Text className="text-base font-outfit-b text-primary mt-1">{email}</Text>
        </View>

        <View className="flex-row justify-center gap-2 mb-10">
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => { inputRefs.current[index] = ref; }}
              className={`w-10 h-12 rounded-lg text-center text-xl font-outfit-b border-2 ${
                digit ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-white text-foreground'
              } ${loading ? 'opacity-50' : ''}`}
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

        <TouchableOpacity
          className={`bg-primary py-4 rounded-xl items-center shadow-sm ${fullCode.length < CODE_LENGTH ? 'opacity-50' : ''}`}
          onPress={() => verifyCode(fullCode)}
          disabled={loading || fullCode.length < CODE_LENGTH}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-base font-outfit-b">Verify & Continue</Text>
          )}
        </TouchableOpacity>

        <View className="items-center mt-10 gap-2">
          <Text className="text-sm font-work-sans text-foreground/60">Didn't receive the code?</Text>
          {countdown > 0 ? (
            <Text className="text-sm font-outfit-sb text-foreground/80">Resend in {countdown}s</Text>
          ) : (
            <TouchableOpacity onPress={resendCode} disabled={resending}>
              {resending ? (
                <ActivityIndicator size="small" color="#0369A1" />
              ) : (
                <Text className="text-sm font-outfit-b text-primary">Resend Code</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
