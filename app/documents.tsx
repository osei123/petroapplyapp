import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/Card';

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

      // Save the relative path to the database
      const { error: dbError } = await supabase.from('documents').insert({
        user_id: user.id,
        filename: file.name,
        file_url: filePath,
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
            const filePath = fileUrl.includes('/resumes/') ? fileUrl.split('/resumes/')[1] : fileUrl;
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
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Navigation Bar */}
      <View className="flex-row items-center justify-between px-6 py-4">
        <TouchableOpacity 
          className="w-10 h-10 rounded-full bg-white border border-border items-center justify-center shadow-sm" 
          onPress={() => router.back()}
        >
          <IconSymbol name="arrow.left" size={20} color="#0C4A6E" />
        </TouchableOpacity>
        <Text className="text-lg font-outfit-b text-foreground">Documents</Text>
        <TouchableOpacity
          className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center"
          onPress={handleUpload}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator size="small" color="#0369A1" />
          ) : (
            <IconSymbol name="plus" size={20} color="#0369A1" />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 24, paddingBottom: 100, flexGrow: 1 }}>
        {loading ? (
          <View className="flex-1 justify-center items-center py-10">
            <ActivityIndicator size="large" color="#0369A1" />
          </View>
        ) : documents.length === 0 ? (
          <View className="flex-1 justify-center items-center py-20 px-4">
            <View className="w-20 h-20 rounded-full bg-primary/10 items-center justify-center mb-6">
              <IconSymbol name="doc.text.fill" size={40} color="#0369A1" />
            </View>
            <Text className="text-xl font-outfit-b text-foreground mb-2 text-center">No documents yet</Text>
            <Text className="text-base font-work-sans text-foreground/60 text-center leading-relaxed mb-8">
              Upload your resume to apply for jobs quickly and easily.
            </Text>
            <TouchableOpacity 
              className="bg-primary px-8 py-4 rounded-full shadow-sm flex-row items-center gap-2" 
              onPress={handleUpload}
            >
              <IconSymbol name="arrow.up.doc.fill" size={18} color="#fff" />
              <Text className="text-white text-base font-outfit-b">Upload Resume</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="gap-4">
            {documents.map((doc) => (
              <Card key={doc.id} className="flex-row items-center p-4">
                <View className="w-12 h-12 rounded-xl bg-primary/10 items-center justify-center">
                  <IconSymbol name="doc.fill" size={24} color="#0369A1" />
                </View>
                <View className="flex-1 ml-4 mr-2">
                  <Text className="text-base font-outfit-sb text-foreground mb-1" numberOfLines={1}>{doc.filename}</Text>
                  <Text className="text-sm font-work-sans text-foreground/60">
                    {new Date(doc.created_at).toLocaleDateString()} • {doc.type.toUpperCase()}
                  </Text>
                </View>
                <TouchableOpacity 
                  className="w-10 h-10 rounded-full bg-red-50 items-center justify-center border border-red-100" 
                  onPress={() => handleDelete(doc.id, doc.file_url)}
                >
                  <IconSymbol name="trash.fill" size={18} color="#ef4444" />
                </TouchableOpacity>
              </Card>
            ))}
            
            <TouchableOpacity 
              className="mt-4 bg-primary/10 rounded-xl py-5 border-2 border-dashed border-primary/30 items-center justify-center flex-row gap-2"
              onPress={handleUpload}
            >
              <IconSymbol name="plus.circle.fill" size={20} color="#0369A1" />
              <Text className="text-base font-outfit-sb text-primary">Upload Another File</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
