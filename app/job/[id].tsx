import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Linking, Modal, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';

export default function JobDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [savingBookmark, setSavingBookmark] = useState(false);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [existingAppId, setExistingAppId] = useState<string | null>(null);

  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [userDocs, setUserDocs] = useState<any[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);
  const [coverLetter, setCoverLetter] = useState("");

  useEffect(() => {
    async function fetchJob() {
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('*, companies (*)')
          .eq('id', id)
          .eq('status', 'published')
          .single();

        if (data) setJob(data);

        // Check if user has saved this job
        if (user) {
          const { data: savedData } = await supabase
            .from('saved_jobs')
            .select('id')
            .eq('user_id', user.id)
            .eq('job_id', id)
            .maybeSingle();
          
          setIsSaved(!!savedData);

          // Check if user already applied
          const { data: appData } = await supabase
            .from('applications')
            .select('id, status')
            .eq('user_id', user.id)
            .eq('job_id', id)
            .maybeSingle();
          
          if (appData) {
            if (appData.status === 'withdrawn') {
              setHasApplied(false);
              setExistingAppId(appData.id);
            } else {
              setHasApplied(true);
            }
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchJob();
  }, [id, user]);

  const toggleSave = async () => {
    if (savingBookmark) return;
    if (!user) {
      Alert.alert('Sign In Required', 'Please sign in to save jobs.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign In', onPress: () => router.push('/login' as any) }
      ]);
      return;
    }
    
    setSavingBookmark(true);

    try {
      if (isSaved) {
        // Unsave
        const { error } = await supabase
          .from('saved_jobs')
          .delete()
          .eq('user_id', user.id)
          .eq('job_id', id);
        
        if (error) throw error;
        setIsSaved(false);
      } else {
        // Save
        const { error } = await supabase
          .from('saved_jobs')
          .insert({ user_id: user.id, job_id: id });
        
        if (error) throw error;
        setIsSaved(true);
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to update bookmark.');
    } finally {
      setSavingBookmark(false);
    }
  };

  const handleApplyPress = async () => {
    if (applying) return;
    if (!user) {
      Alert.alert('Sign In Required', 'Please sign in to apply for jobs.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign In', onPress: () => router.push('/login' as any) }
      ]);
      return;
    }

    if (hasApplied) {
      Alert.alert('Already Applied', 'You have already submitted an application for this job.');
      return;
    }

    // Handle external application
    if (job?.application_mode === 'external') {
      if (job.external_url) {
        Linking.openURL(job.external_url).catch(() => {
          Alert.alert("Error", "Could not open external application link.");
        });
      } else {
        Alert.alert("Error", "External link not provided by the company.");
      }
      return;
    }

    // Internal Application Setup
    setApplying(true);
    try {
      const { data: docs, error: docError } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (docError) throw docError;

      if (!docs || docs.length === 0) {
        setApplying(false);
        Alert.alert(
          'No Resume Found',
          'You need to upload a resume to apply for jobs. Please go to Profile > Documents to upload one.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Go to Profile', onPress: () => router.push('/profile' as any) }
          ]
        );
        return;
      }

      setUserDocs(docs);
      setSelectedResumeId(docs[0].id); // Default to latest
      setApplying(false);
      setModalVisible(true);
    } catch (err: any) {
      setApplying(false);
      Alert.alert('Error', 'Failed to fetch your resumes.');
    }
  };

  const submitApplication = async () => {
    if (!selectedResumeId) return;
    setApplying(true);

    const selectedResume = userDocs.find(d => d.id === selectedResumeId);

    try {
      let dbError;
      if (existingAppId) {
        const { error } = await supabase
          .from('applications')
          .update({
            status: 'submitted',
            resume_url: selectedResume.file_url,
            cover_letter_text: coverLetter.trim() || null,
            applied_at: new Date().toISOString()
          })
          .eq('id', existingAppId);
        dbError = error;
      } else {
        const { error } = await supabase
          .from('applications')
          .insert({
            user_id: user?.id,
            job_id: id,
            status: 'submitted',
            resume_url: selectedResume.file_url,
            cover_letter_text: coverLetter.trim() || null,
          });
        dbError = error;
      }

      if (dbError) throw dbError;
      setHasApplied(true);
      setModalVisible(false);
      Alert.alert('Success!', 'Your application has been submitted successfully.');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to submit application.');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color="#0369A1" />
      </SafeAreaView>
    );
  }

  if (!job) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-row items-center justify-between px-6 py-4">
          <TouchableOpacity className="w-10 h-10 rounded-full bg-white items-center justify-center border border-border shadow-sm" onPress={() => router.back()}>
            <IconSymbol name="arrow.left" size={20} color="#0C4A6E" />
          </TouchableOpacity>
        </View>
        <Text className="p-6 text-center text-base font-work-sans text-foreground">Job not found</Text>
      </SafeAreaView>
    );
  }

  const companyName = job.companies?.name || 'Unknown Company';
  const companyInitial = companyName.substring(0, 2).toUpperCase();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Nav Header */}
      <View className="flex-row items-center justify-between px-6 py-4">
        <TouchableOpacity className="w-10 h-10 rounded-full bg-white items-center justify-center border border-border shadow-sm" onPress={() => router.back()}>
          <IconSymbol name="arrow.left" size={20} color="#0C4A6E" />
        </TouchableOpacity>
        <Text className="flex-1 text-lg font-outfit-b text-foreground text-center mx-4" numberOfLines={1}>Job Details</Text>
        <TouchableOpacity
          className={`w-10 h-10 rounded-full items-center justify-center border shadow-sm ${isSaved ? 'bg-primary/10 border-primary/40' : 'bg-white border-border'}`}
          onPress={toggleSave}
          disabled={savingBookmark}
        >
          {savingBookmark ? (
            <ActivityIndicator size="small" color="#0369A1" />
          ) : (
            <IconSymbol
              name={isSaved ? "bookmark.fill" : "bookmark"}
              size={20}
              color={isSaved ? "#0369A1" : "#0C4A6E"}
            />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}>
        {/* Header */}
        <Card className="items-center mt-4">
          <View className="w-16 h-16 rounded-xl bg-muted items-center justify-center mb-4">
            <Text className="text-xl font-outfit-b text-foreground">{companyInitial}</Text>
          </View>
          <Text className="text-2xl font-outfit-b text-foreground text-center">{job.title}</Text>
          <TouchableOpacity onPress={() => router.push(`/company/${job.company_id}` as any)}>
            <Text className="text-base font-outfit-sb text-primary mt-1">{companyName}</Text>
          </TouchableOpacity>

          <View className="flex-row gap-6 mt-4">
            <View className="flex-row items-center gap-1.5">
              <IconSymbol name="location.fill" size={14} color="#0C4A6E80" />
              <Text className="text-sm font-work-sans text-foreground/70">{job.location || 'Remote'}</Text>
            </View>
            <View className="flex-row items-center gap-1.5">
              <IconSymbol name="clock.fill" size={14} color="#0C4A6E80" />
              <Text className="text-sm font-work-sans text-foreground/70">
                {new Date(job.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </Text>
            </View>
          </View>

          {job.featured && (
            <View className="flex-row items-center gap-1 bg-[#fef3c7] px-3 py-1.5 rounded-full mt-4">
              <IconSymbol name="star.fill" size={12} color="#f59e0b" />
              <Text className="text-sm font-outfit-sb text-[#92400e]">Featured</Text>
            </View>
          )}
        </Card>

        {/* Quick Info */}
        <View className="flex-row gap-3 mt-6">
          {[
            { label: 'Type', value: job.employment_type || 'Full-time' },
            { label: 'Mode', value: job.remote_type || 'On-site' },
            { label: 'Level', value: job.experience_level || 'Mid' },
          ].map((item) => (
            <View key={item.label} className="flex-1 bg-white rounded-xl p-4 items-center border border-border shadow-sm">
              <Text className="text-xs font-outfit-sb text-foreground/60 uppercase tracking-wider">{item.label}</Text>
              <Text className="text-sm font-outfit-b text-foreground mt-1 capitalize">{item.value}</Text>
            </View>
          ))}
        </View>

        {/* Salary */}
        <View className="bg-primary/5 rounded-xl p-6 mt-6 items-center border border-primary/20">
          <Text className="text-sm font-outfit-sb text-primary">Salary Range</Text>
          <Text className="text-3xl font-outfit-b text-primary mt-1">{job.salary_range || 'Competitive'}</Text>
          {job.deadline && (
            <Text className="text-sm font-work-sans text-primary mt-2">Deadline: {job.deadline}</Text>
          )}
        </View>

        {/* Description */}
        <View className="mt-8">
          <Text className="text-xl font-outfit-b text-foreground mb-4">Description</Text>
          <Text className="text-base font-work-sans text-foreground/80 leading-relaxed">{job.description}</Text>
        </View>

        {/* Requirements */}
        {job.requirements && job.requirements.length > 0 && (
          <View className="mt-8">
            <Text className="text-xl font-outfit-b text-foreground mb-4">Requirements</Text>
            {job.requirements.map((req: string, i: number) => (
              <View key={i} className="flex-row items-start gap-3 mb-3">
                <View className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5" />
                <Text className="flex-1 text-base font-work-sans text-foreground/80 leading-relaxed">{req}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Apply Button */}
      <View className="absolute bottom-0 left-0 right-0 bg-background px-6 pt-4 pb-10 border-t border-border shadow-lg">
        <Button 
          title={hasApplied ? '✓ Applied' : (job.application_mode === 'external' ? 'Apply on Website' : 'Apply Now')}
          onPress={handleApplyPress}
          disabled={applying || hasApplied}
          variant={hasApplied ? 'secondary' : 'primary'}
          size="large"
          style={hasApplied ? { backgroundColor: '#22C55E', borderColor: '#22C55E' } : {}}
          textStyle={hasApplied ? { color: '#ffffff' } : {}}
        />
      </View>

      {/* Application Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-foreground/50 justify-end">
          <View className="bg-background rounded-t-3xl max-h-[80%] pb-10">
            <View className="flex-row items-center justify-between p-6 border-b border-border">
              <Text className="text-xl font-outfit-b text-foreground">Submit Application</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} className="p-2">
                <IconSymbol name="xmark" size={20} color="#0C4A6E" />
              </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false} className="p-6">
              <Text className="text-base font-work-sans text-foreground/70 mb-6">Applying for: {job.title}</Text>

              <Text className="text-sm font-outfit-sb text-foreground mb-3">Select Resume *</Text>
              <View className="mb-6 gap-3">
                {userDocs.map(doc => (
                  <TouchableOpacity 
                    key={doc.id} 
                    className={`flex-row items-center p-4 rounded-xl border ${selectedResumeId === doc.id ? 'border-primary bg-primary/10' : 'border-border bg-white shadow-sm'}`}
                    onPress={() => setSelectedResumeId(doc.id)}
                  >
                    <IconSymbol name="doc.text.fill" size={20} color={selectedResumeId === doc.id ? '#0369A1' : '#0C4A6E80'} />
                    <Text className={`flex-1 text-sm mx-3 font-work-sans ${selectedResumeId === doc.id ? 'text-primary font-work-sans-b' : 'text-foreground/70'}`} numberOfLines={1}>
                      {doc.filename}
                    </Text>
                    {selectedResumeId === doc.id && (
                      <IconSymbol name="checkmark.circle.fill" size={20} color="#0369A1" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              <Text className="text-sm font-outfit-sb text-foreground mb-3">Cover Letter (Optional)</Text>
              <TextInput
                className="bg-white border border-border rounded-xl p-4 text-base font-work-sans text-foreground min-h-[120px] mb-8"
                placeholder="Write a brief cover letter or introduction..."
                placeholderTextColor="#0C4A6E80"
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                value={coverLetter}
                onChangeText={setCoverLetter}
              />
            </ScrollView>

            <View className="flex-row p-6 gap-4 border-t border-border bg-white">
              <Button 
                title="Cancel"
                variant="outline"
                onPress={() => setModalVisible(false)}
                style={{ flex: 1 }}
              />
              <Button 
                title={applying ? "Submitting..." : "Submit"}
                variant="primary"
                onPress={submitApplication}
                disabled={applying}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
