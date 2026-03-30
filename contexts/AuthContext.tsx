import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { useRouter, useSegments } from 'expo-router';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  userProfile: any | null;
  isLoading: boolean;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  userProfile: null,
  isLoading: true,
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const segments = useSegments();
  const router = useRouter();

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (!error && data) {
        setUserProfile(data);
      } else {
        setUserProfile(null);
      }
    } catch (e) {
      console.error(e);
      setUserProfile(null);
    }
  };

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.id);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id).finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        setIsLoading(true);
        await fetchProfile(session.user.id);
        setIsLoading(false);
      } else {
        setUserProfile(null);
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboardingGroup = (segments[0] as string) === '(onboarding)';

    if (!session) {
      if (!inAuthGroup) {
        // Redirect to the login page if not authenticated
        router.replace('/(auth)/login');
      }
    } else {
      // Authenticated
      const hasCompletedProfile = userProfile && userProfile.full_name && userProfile.university;
      
      if (!hasCompletedProfile) {
        if (!inOnboardingGroup) {
          // If they haven't onboarded, force them to onboarding
          router.replace('/(onboarding)/step-1' as any);
        }
      } else {
        if (inAuthGroup || inOnboardingGroup) {
          // If they have onboarded, and they are trying to access auth or onboarding, push them to tabs
          router.replace('/(tabs)');
        }
      }
    }
  }, [session, userProfile, segments, isLoading]);

  return (
    <AuthContext.Provider value={{ user, session, userProfile, isLoading, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
