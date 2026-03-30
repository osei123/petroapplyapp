import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, FontSize } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { supabase } from '@/lib/supabase';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, userProfile, refreshProfile } = useAuth();

  const [fullName, setFullName] = useState(userProfile?.full_name || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [country, setCountry] = useState(userProfile?.country || '');
  const [university, setUniversity] = useState(userProfile?.university || '');
  const [degree, setDegree] = useState(userProfile?.degree || '');
  const [graduationYear, setGraduationYear] = useState(userProfile?.graduation_year ? String(userProfile.graduation_year) : '');
  const [bio, setBio] = useState(userProfile?.bio || '');
  const [linkedinUrl, setLinkedinUrl] = useState(userProfile?.linkedin_url || '');
  const [skillsText, setSkillsText] = useState(userProfile?.skills ? userProfile.skills.join(', ') : '');
  const [saving, setSaving] = useState(false);

  const initials = fullName
    ? fullName.split(" ").map((n: string) => n[0]).join("").substring(0, 2)
    : "PA";

  const handleSave = async () => {
    if (!user) return;
    if (!fullName.trim()) {
      Alert.alert('Required', 'Full name cannot be empty.');
      return;
    }

    setSaving(true);
    try {
      const skillsArray = skillsText
        .split(',')
        .map((s: string) => s.trim().toLowerCase())
        .filter((s: string) => s.length > 0);

      const { error } = await supabase
        .from('user_profiles')
        .update({
          full_name: fullName.trim(),
          phone: phone.trim() || null,
          country: country.trim() || null,
          university: university.trim() || null,
          degree: degree.trim() || null,
          graduation_year: graduationYear ? parseInt(graduationYear, 10) : null,
          bio: bio.trim() || null,
          linkedin_url: linkedinUrl.trim() || null,
          skills: skillsArray,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      await refreshProfile();
      Alert.alert('Success', 'Your profile has been updated.', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} disabled={saving}>
          <IconSymbol name="arrow.left" size={20} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSave} disabled={saving}>
          {saving ? (
            <ActivityIndicator size="small" color={Colors.light.primary} />
          ) : (
            <Text style={styles.saveBtn}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <TouchableOpacity style={styles.changePhotoBtn}>
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Full Name</Text>
          <TextInput style={styles.input} value={fullName} onChangeText={setFullName} placeholder="John Doe" placeholderTextColor={Colors.light.textTertiary} />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Email</Text>
          <TextInput style={[styles.input, { opacity: 0.6 }]} value={user?.email || ''} editable={false} placeholderTextColor={Colors.light.textTertiary} />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Phone</Text>
          <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="+1 (555) 000-0000" keyboardType="phone-pad" placeholderTextColor={Colors.light.textTertiary} />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Country</Text>
          <TextInput style={styles.input} value={country} onChangeText={setCountry} placeholder="e.g. United States" placeholderTextColor={Colors.light.textTertiary} />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>University</Text>
          <TextInput style={styles.input} value={university} onChangeText={setUniversity} placeholder="e.g. University of Texas" placeholderTextColor={Colors.light.textTertiary} />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Degree</Text>
          <TextInput style={styles.input} value={degree} onChangeText={setDegree} placeholder="e.g. B.S. Petroleum Engineering" placeholderTextColor={Colors.light.textTertiary} />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Graduation Year</Text>
          <TextInput style={styles.input} value={graduationYear} onChangeText={setGraduationYear} placeholder="e.g. 2026" keyboardType="numeric" maxLength={4} placeholderTextColor={Colors.light.textTertiary} />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Bio</Text>
          <TextInput style={[styles.input, styles.textArea]} value={bio} onChangeText={setBio} placeholder="Tell employers about yourself..." multiline numberOfLines={4} placeholderTextColor={Colors.light.textTertiary} />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>LinkedIn URL</Text>
          <TextInput style={styles.input} value={linkedinUrl} onChangeText={setLinkedinUrl} placeholder="https://linkedin.com/in/yourname" autoCapitalize="none" placeholderTextColor={Colors.light.textTertiary} />
        </View>

        <View style={[styles.fieldGroup, { marginBottom: 40 }]}>
          <Text style={styles.fieldLabel}>Skills (comma separated)</Text>
          <TextInput style={[styles.input, styles.textArea]} value={skillsText} onChangeText={setSkillsText} placeholder="e.g. Drilling, Reservoir Engineering, Python" multiline placeholderTextColor={Colors.light.textTertiary} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  navBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.light.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.light.border },
  navTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.light.text },
  saveBtn: { fontSize: FontSize.md, fontWeight: '700', color: Colors.light.primary },
  content: { paddingHorizontal: Spacing.xl },
  avatarSection: { alignItems: 'center', paddingVertical: Spacing.xxl },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.light.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: FontSize.xxl, fontWeight: '800', color: '#fff', textTransform: 'uppercase' },
  changePhotoBtn: { marginTop: Spacing.md },
  changePhotoText: { fontSize: FontSize.md, color: Colors.light.primary, fontWeight: '600' },
  fieldGroup: { marginBottom: Spacing.lg },
  fieldLabel: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.light.textSecondary, marginBottom: Spacing.sm },
  input: { backgroundColor: Colors.light.surface, borderWidth: 1, borderColor: Colors.light.border, borderRadius: BorderRadius.lg, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, fontSize: FontSize.md, color: Colors.light.text },
  textArea: { minHeight: 100, textAlignVertical: 'top', paddingTop: Spacing.md },
});
