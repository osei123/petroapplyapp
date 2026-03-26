import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 24,
          left: 60,
          right: 60,
          elevation: 0,
          backgroundColor: '#ffffff',
          borderRadius: 40,
          height: 72,
          borderTopWidth: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.1,
          shadowRadius: 20,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View className={`w-12 h-12 rounded-full items-center justify-center ${focused ? 'bg-black' : 'bg-transparent'}`}>
              <Ionicons name="home" size={24} color={focused ? '#fff' : color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="jobs"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, focused }) => (
            <View className={`w-12 h-12 rounded-full items-center justify-center ${focused ? 'bg-black' : 'bg-transparent'}`}>
              <Ionicons name="search" size={24} color={focused ? '#fff' : color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: 'Saved',
          tabBarIcon: ({ color, focused }) => (
            <View className={`w-12 h-12 rounded-full items-center justify-center ${focused ? 'bg-black' : 'bg-transparent'}`}>
              <Ionicons name="briefcase" size={24} color={focused ? '#fff' : color} />
            </View>
          ),
        }}
      />
      {/* Hide others from tab bar */}
      <Tabs.Screen name="applications" options={{ href: null }} />
      <Tabs.Screen name="profile" options={{ href: null }} />
      <Tabs.Screen name="explore" options={{ href: null }} />
    </Tabs>
  );
}
