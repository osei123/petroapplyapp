import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/Card';

const typeIcons: Record<string, { icon: React.ComponentProps<typeof IconSymbol>['name']; bg: string; color: string }> = {
  application: { icon: 'briefcase.fill', bg: 'bg-primary/10', color: '#0369A1' },
  job: { icon: 'briefcase.fill', bg: 'bg-green-100', color: '#15803d' },
  reminder: { icon: 'clock.fill', bg: 'bg-amber-100', color: '#d97706' },
  system: { icon: 'gear', bg: 'bg-muted', color: '#0C4A6E80' },
};

export default function NotificationsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (e: any) {
      console.error(e);
      Alert.alert('Error', 'Could not load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  const markAllAsRead = async () => {
    if (!user || marking || notifications.every(n => n.read)) return;
    setMarking(true);
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) throw error;
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (e: any) {
      console.error(e);
      Alert.alert('Error', 'Could not update notifications');
    } finally {
      setMarking(false);
    }
  };

  const clearAll = async () => {
    if (!user || marking || notifications.length === 0) return;
    Alert.alert(
      "Clear All Notifications",
      "Are you sure you want to delete all notifications? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Clear All", 
          style: "destructive", 
          onPress: async () => {
            setMarking(true);
            try {
              const { error } = await supabase
                .from('notifications')
                .delete()
                .eq('user_id', user.id);
              
              if (error) throw error;
              setNotifications([]);
            } catch (e: any) {
              console.error(e);
              Alert.alert('Error', 'Could not clear notifications');
            } finally {
              setMarking(false);
            }
          }
        }
      ]
    );
  };

  const hasUnread = notifications.some(n => !n.read);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Navigation Bar */}
      <View className="flex-row items-center justify-between px-6 py-4">
        <TouchableOpacity 
          className="w-10 h-10 rounded-full bg-white border border-border items-center justify-center shadow-sm" 
          onPress={() => router.back()}
        >
          <IconSymbol name="arrow.left" size={20} color="#0C4A6E" />
        </TouchableOpacity>
        <Text className="text-lg font-outfit-b text-foreground">Notifications</Text>
        <View className="flex-row items-center gap-3">
          <TouchableOpacity 
            onPress={clearAll} 
            disabled={marking || notifications.length === 0} 
            className={notifications.length > 0 ? "opacity-100" : "opacity-40"}
          >
            <IconSymbol name="trash.fill" size={20} color="#ef4444" />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={markAllAsRead} 
            disabled={marking || !hasUnread} 
            className={hasUnread ? "opacity-100" : "opacity-40"}
          >
            {marking ? (
               <ActivityIndicator size="small" color="#0369A1" />
            ) : (
              <IconSymbol name="checkmark.circle.fill" size={24} color="#0369A1" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ padding: 24, gap: 12, paddingBottom: 100, flexGrow: 1 }}
      >
        {loading ? (
          <View className="flex-1 justify-center items-center py-10">
            <ActivityIndicator size="large" color="#0369A1" />
          </View>
        ) : notifications.length === 0 ? (
          <View className="flex-1 justify-center items-center py-20 px-4">
            <View className="w-20 h-20 rounded-full bg-primary/10 items-center justify-center mb-6">
              <IconSymbol name="bell.fill" size={40} color="#0369A1" />
            </View>
            <Text className="text-xl font-outfit-b text-foreground mb-2 text-center">No notifications yet</Text>
            <Text className="text-base font-work-sans text-foreground/60 text-center leading-relaxed">
              You'll be notified about application updates, new opportunities, and platform announcements here.
            </Text>
          </View>
        ) : (
          notifications.map((notif) => {
            const styleConf = typeIcons[notif.type] || typeIcons.system;
            const isUnread = !notif.read;

            return (
              <TouchableOpacity key={notif.id} activeOpacity={0.8}>
                <Card className={`flex-row items-center p-4 ${isUnread ? 'bg-primary/5 border-primary/20' : ''}`}>
                  <View className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${styleConf.bg}`}>
                    <IconSymbol name={styleConf.icon} size={20} color={styleConf.color} />
                  </View>
                  
                  <View className="flex-1">
                    <Text className={`text-base font-outfit-sb mb-1 ${isUnread ? 'text-foreground font-outfit-b' : 'text-foreground/80'}`}>
                      {notif.title}
                    </Text>
                    <Text className="text-sm font-work-sans text-foreground/70 leading-relaxed">
                      {notif.body}
                    </Text>
                    <Text className="text-xs font-work-sans text-foreground/50 mt-2">
                      {new Date(notif.created_at).toLocaleDateString()} at {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>

                  {isUnread && (
                    <View className="w-2.5 h-2.5 rounded-full bg-primary ml-3" />
                  )}
                </Card>
              </TouchableOpacity>
            )
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
