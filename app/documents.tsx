import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import { Colors, Spacing, BorderRadius, FontSize } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export default function DocumentsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchDocuments = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (e: any) {
      console.error(e);
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [user]);

  const handleUpload = async () => {
    if (!user) return;
    
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return;
      }

      setUploading(true);
      const file = result.assets[0];
      const fileExt = file.name.split('.').pop() || 'pdf';
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        name: file.name,
        type: file.mimeType || 'application/pdf',
      } as any);

      // Upload to Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, formData as any);

      if (uploadError) throw uploadError;

      // Get Public URL
      const { data: urlData } = supabase.storage.from('resumes').getPublicUrl(filePath);

      // Save to database
      const { error: dbError } = await supabase.from('documents').insert({
        user_id: user.id,
        filename: file.name,
        file_url: urlData.publicUrl,
        type: 'resume',
      });

      if (dbError) throw dbError;

      Alert.alert('Success', 'Resume uploaded successfully!');
      fetchDocuments();
    } catch (e: any) {
      console.error('Upload Error:', e);
      Alert.alert('Error', e.message || 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (docId: string, fileUrl: string) => {
    Alert.alert('Delete Document', 'Are you sure you want to delete this resume?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            // Extact path from URL roughly
            const filePath = fileUrl.split('/resumes/')[1];
            if (filePath) {
              await supabase.storage.from('resumes').remove([filePath]);
            }
            
            const { error } = await supabase.from('documents').delete().eq('id', docId);
            if (error) throw error;
            
            setDocuments(docs => docs.filter(d => d.id !== docId));
          } catch (e: any) {
            Alert.alert('Error', e.message);
          }
        }
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <IconSymbol name="arrow.left" size={20} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Documents</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={handleUpload}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator size="small" color={Colors.light.primary} />
          ) : (
            <IconSymbol name="plus" size={20} color={Colors.light.primary} />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color={Colors.light.primary} style={{ marginTop: 40 }} />
        ) : documents.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconBg}>
              <IconSymbol name="doc.text.fill" size={40} color={Colors.light.primary} />
            </View>
            <Text style={styles.emptyTitle}>No documents yet</Text>
            <Text style={styles.emptyText}>Upload your resume to apply for jobs quickly and easily.</Text>
            <TouchableOpacity style={styles.emptyBtn} onPress={handleUpload}>
              <Text style={styles.emptyBtnText}>Upload Resume</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.list}>
            {documents.map((doc) => (
              <View key={doc.id} style={styles.docCard}>
                <View style={styles.docIcon}>
                  <IconSymbol name="doc.fill" size={24} color={Colors.light.primary} />
                </View>
                <View style={styles.docInfo}>
                  <Text style={styles.docName} numberOfLines={1}>{doc.filename}</Text>
                  <Text style={styles.docDate}>
                    {new Date(doc.created_at).toLocaleDateString()} • {doc.type.toUpperCase()}
                  </Text>
                </View>
                <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(doc.id, doc.file_url)}>
                  <IconSymbol name="trash.fill" size={20} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
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
  addBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.light.primaryLight, alignItems: 'center', justifyContent: 'center' },
  content: { padding: Spacing.xl },
  emptyState: { alignItems: 'center', justifyContent: 'center', marginTop: 60, padding: Spacing.xl },
  emptyIconBg: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.light.primaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.lg },
  emptyTitle: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.light.text, marginBottom: Spacing.sm },
  emptyText: { fontSize: FontSize.md, color: Colors.light.textTertiary, textAlign: 'center', marginBottom: Spacing.xl, lineHeight: 22 },
  emptyBtn: { backgroundColor: Colors.light.primary, paddingHorizontal: Spacing.xxl, paddingVertical: Spacing.lg, borderRadius: BorderRadius.full },
  emptyBtnText: { color: '#fff', fontSize: FontSize.md, fontWeight: '700' },
  list: { gap: Spacing.md },
  docCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.light.surface, padding: Spacing.lg, borderRadius: BorderRadius.xl, borderWidth: 1, borderColor: Colors.light.border, gap: Spacing.md },
  docIcon: { width: 48, height: 48, borderRadius: BorderRadius.lg, backgroundColor: Colors.light.background, alignItems: 'center', justifyContent: 'center' },
  docInfo: { flex: 1 },
  docName: { fontSize: FontSize.md, fontWeight: '600', color: Colors.light.text, marginBottom: 4 },
  docDate: { fontSize: FontSize.sm, color: Colors.light.textTertiary },
  deleteBtn: { padding: Spacing.sm },
});
