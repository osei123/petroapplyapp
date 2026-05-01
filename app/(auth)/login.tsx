import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
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
      router.push({ pathname: '/(auth)/confirm', params: { email } } as any);
    }
    setLoading(false);
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-background">
      <View className="flex-1 justify-center px-6">
        <View className="items-center mb-10">
          <View className="w-16 h-16 rounded-2xl bg-primary items-center justify-center mb-6 shadow-sm">
            <IconSymbol name="drop.fill" size={32} color="#fff" />
          </View>
          <Text className="text-3xl font-outfit-b text-foreground mb-2">PetroApply</Text>
          <Text className="text-base font-work-sans text-foreground/70">Sign in to your student account</Text>
        </View>

        <View className="gap-5">
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

          <View className="gap-2">
            <Text className="text-sm font-outfit-sb text-foreground/80 ml-1">Password</Text>
            <TextInput
              className="bg-white border-2 border-border rounded-xl px-4 py-3.5 text-base font-work-sans text-foreground shadow-sm"
              placeholder="••••••••"
              placeholderTextColor="#0C4A6E80"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
          
          <TouchableOpacity 
            className="items-end -mt-1" 
            onPress={() => router.push('/(auth)/reset-password' as any)}
          >
            <Text className="text-sm font-outfit-b text-primary">Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="bg-primary py-4 rounded-xl items-center mt-2 shadow-sm" 
            onPress={signInWithEmail} 
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text className="text-white text-base font-outfit-b">Sign In</Text>}
          </TouchableOpacity>

          <TouchableOpacity 
            className="bg-transparent border-2 border-primary py-4 rounded-xl items-center mt-1" 
            onPress={signUpWithEmail} 
            disabled={loading}
          >
            <Text className="text-primary text-base font-outfit-b">Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
