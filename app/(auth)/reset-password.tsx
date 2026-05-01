import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function ResetPasswordScreen() {
  const router = useRouter();
  
  const [step, setStep] = useState<'email' | 'otp' | 'new_password'>('email');
  const [loading, setLoading] = useState(false);
  
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');

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
      setStep('new_password');
    } else {
      Alert.alert('Error', 'Invalid or expired code.');
    }
    
    setLoading(false);
  }

  async function updatePassword() {
    if (!newPassword || newPassword.length < 6) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters.');
      return;
    }
    
    setLoading(true);

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
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-background">
      <View className="flex-row items-center px-6 pt-6 pb-2">
        <TouchableOpacity 
          className="w-10 h-10 rounded-full bg-white border border-border items-center justify-center shadow-sm" 
          onPress={() => {
            if (step !== 'email') setStep('email');
            else router.back();
          }}
        >
          <IconSymbol name="arrow.left" size={20} color="#0C4A6E" />
        </TouchableOpacity>
      </View>
      
      <View className="flex-1 justify-center px-6 pb-16">
        <View className="items-center mb-10">
          <View className="w-16 h-16 rounded-2xl bg-primary items-center justify-center mb-6 shadow-sm">
            <IconSymbol name="lock.fill" size={32} color="#fff" />
          </View>
          <Text className="text-3xl font-outfit-b text-foreground mb-2">Reset Password</Text>
          <Text className="text-base font-work-sans text-foreground/70 text-center px-4">
            {step === 'email' && 'Enter your email to receive a reset code'}
            {step === 'otp' && `Enter the 8-digit code sent to ${email}`}
            {step === 'new_password' && 'Enter your new secure password'}
          </Text>
        </View>

        <View className="gap-5">
          {step === 'email' && (
            <View className="gap-2">
              <Text className="text-sm font-outfit-sb text-foreground/80 ml-1">Email Address</Text>
              <TextInput
                className="bg-white border-2 border-border rounded-xl px-4 py-3.5 text-base font-work-sans text-foreground shadow-sm"
                placeholder="student@university.edu"
                placeholderTextColor="#0C4A6E80"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
          )}

          {step === 'otp' && (
            <View className="gap-2">
              <Text className="text-sm font-outfit-sb text-foreground/80 ml-1">8-Digit Recovery Code</Text>
              <TextInput
                className="bg-white border-2 border-border rounded-xl px-4 py-3.5 text-xl font-outfit-b text-foreground tracking-[8px] text-center shadow-sm"
                placeholder="00000000"
                placeholderTextColor="#0C4A6E80"
                value={token}
                onChangeText={setToken}
                keyboardType="number-pad"
                maxLength={8}
              />
            </View>
          )}

          {step === 'new_password' && (
            <View className="gap-2">
              <Text className="text-sm font-outfit-sb text-foreground/80 ml-1">New Password</Text>
              <TextInput
                className="bg-white border-2 border-border rounded-xl px-4 py-3.5 text-base font-work-sans text-foreground shadow-sm"
                placeholder="••••••••"
                placeholderTextColor="#0C4A6E80"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
              />
            </View>
          )}

          <TouchableOpacity 
            className="bg-primary py-4 rounded-xl items-center mt-2 shadow-sm" 
            onPress={() => {
              if (step === 'email') requestReset();
              else if (step === 'otp') verifyCode();
              else if (step === 'new_password') updatePassword();
            }} 
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : (
              <Text className="text-white text-base font-outfit-b">
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
