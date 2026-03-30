import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, FontSize } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

const typeIcons: Record<string, { icon: React.ComponentProps<typeof IconSymbol>['name']; bg: string; color: string }> = {
  application: { icon: 'briefcase.fill', bg: Colors.light.primaryLight, color: Colors.light.primary },
  job: { icon: 'briefcase.fill', bg: Colors.light.successLight, color: Colors.light.success },
  reminder: { icon: 'clock.fill', bg: Colors.light.warningLight, color: '#d97706' },
  system: { icon: 'gear', bg: Colors.light.surfaceHover, color: Colors.light.textSecondary },
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

  const hasUnread = notifications.some(n => !n.read);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="arrow.left" size={20} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Notifications</Text>
        <TouchableOpacity onPress={markAllAsRead} disabled={marking || !hasUnread} style={{ opacity: hasUnread ? 1 : 0.4 }}>
          {marking ? (
             <ActivityIndicator size="small" color={Colors.light.primary} />
          ) : (
            <IconSymbol name="checkmark.circle.fill" size={24} color={Colors.light.primary} />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.list, notifications.length === 0 && { flexGrow: 1 }]}>
        {loading ? (
          <ActivityIndicator size="large" color={Colors.light.primary} style={{ marginTop: 40 }} />
        ) : notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconBg}>
              <IconSymbol name="bell.fill" size={40} color={Colors.light.primary} />
            </View>
            <Text style={styles.emptyTitle}>No notifications yet</Text>
            <Text style={styles.emptyText}>You'll be notified about application updates, new opportunities, and platform announcements here.</Text>
          </View>
        ) : (
          notifications.map((notif) => {
            const styleConf = typeIcons[notif.type] || typeIcons.system;
            const isUnread = !notif.read;

            return (
              <TouchableOpacity key={notif.id} style={[styles.card, isUnread && styles.cardUnread]} activeOpacity={0.8}>
                <View style={[styles.iconBox, { backgroundColor: styleConf.bg }]}>
                  <IconSymbol name={styleConf.icon} size={20} color={styleConf.color} />
                </View>
                <View style={styles.cardContent}>
                  <Text style={[styles.title, isUnread && styles.titleUnread]}>{notif.title}</Text>
                  <Text style={styles.body}>{notif.body}</Text>
                  <Text style={styles.time}>{new Date(notif.created_at).toLocaleDateString()} at {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                </View>
                {isUnread && <View style={styles.unreadDot} />}
              </TouchableOpacity>
            )
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  navBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.light.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.light.border },
  navTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.light.text },
  emptyState: { alignItems: 'center', justifyContent: 'center', marginTop: 80, padding: Spacing.xl },
  emptyIconBg: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.light.primaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.lg },
  emptyTitle: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.light.text, marginBottom: Spacing.sm },
  emptyText: { fontSize: FontSize.md, color: Colors.light.textTertiary, textAlign: 'center', marginBottom: Spacing.xl, lineHeight: 22 },
  list: { padding: Spacing.xl, gap: Spacing.md, paddingBottom: 30 },
  card: { flexDirection: 'row', backgroundColor: Colors.light.surface, borderRadius: BorderRadius.xl, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.light.border, alignItems: 'center' },
  cardUnread: { backgroundColor: Colors.light.primaryLight + '30', borderColor: Colors.light.primaryLight },
  iconBox: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
  cardContent: { flex: 1 },
  title: { fontSize: FontSize.md, fontWeight: '600', color: Colors.light.textSecondary, marginBottom: 4 },
  titleUnread: { color: Colors.light.text, fontWeight: '700' },
  body: { fontSize: FontSize.sm, color: Colors.light.textSecondary, lineHeight: 20 },
  time: { fontSize: FontSize.xs, color: Colors.light.textTertiary, marginTop: Spacing.sm },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.light.primary, marginLeft: Spacing.sm },
});
