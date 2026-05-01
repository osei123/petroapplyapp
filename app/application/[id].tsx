import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/Card';

const statusColors: Record<string, { bg: string; text: string; dot: string }> = {
  submitted: { bg: 'bg-muted', text: 'text-foreground/70', dot: 'bg-foreground/50' },
  under_review: { bg: 'bg-primary/10', text: 'text-primary', dot: 'bg-primary' },
  shortlisted: { bg: 'bg-[#fef3c7]', text: 'text-[#92400e]', dot: 'bg-[#d97706]' },
  interview: { bg: 'bg-[#e0e7ff]', text: 'text-[#3730a3]', dot: 'bg-[#4f46e5]' },
  rejected: { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-600' },
  hired: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-600' },
};

const statusSteps = ['Submitted', 'Under Review', 'Shortlisted', 'Interview', 'Hired'];
const statusKeys = ['submitted', 'under_review', 'shortlisted', 'interview', 'hired'];

export default function ApplicationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [app, setApp] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => {
    const fetchApplication = async () => {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          id,
          status,
          applied_at,
          job_id,
          jobs (
            id,
            title,
            companies (
              id,
              name
            )
          )
        `)
        .eq('id', id)
        .single();

      if (!error && data) setApp(data);
      setLoading(false);
    };
    fetchApplication();
  }, [id]);

  const handleWithdraw = () => {
    Alert.alert(
      "Withdraw Application",
      "Are you sure you want to withdraw your application? This cannot be undone, but you can apply again.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Withdraw", 
          style: "destructive", 
          onPress: async () => {
            setWithdrawing(true);
            try {
              const { error } = await supabase.from('applications').delete().eq('id', id);
              if (error) throw error;
              Alert.alert("Success", "Your application has been withdrawn.");
              router.back();
            } catch (error: any) {
              Alert.alert("Error", error.message);
            } finally {
              setWithdrawing(false);
            }
          } 
        }
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color="#0369A1" />
      </SafeAreaView>
    );
  }

  if (!app) {
    return (
      <SafeAreaView className="flex-1 bg-background justify-center items-center p-6">
        <Text className="text-lg font-outfit-sb text-foreground">Application not found</Text>
      </SafeAreaView>
    );
  }

  const jobTitle = app.jobs?.title || 'Unknown Job';
  const companyName = app.jobs?.companies?.name || 'Unknown Company';
  const appliedDate = new Date(app.applied_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const statusStyle = statusColors[app.status] || statusColors.submitted;
  const currentStepIdx = statusKeys.indexOf(app.status);
  const isRejected = app.status === 'rejected';

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
        <Text className="text-lg font-outfit-b text-foreground">Application</Text>
        <View className="w-10" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
        {/* Header */}
        <Card className="items-center p-8">
          <View className="w-16 h-16 rounded-2xl bg-muted items-center justify-center mb-4 border border-border">
            <Text className="text-xl font-outfit-b text-foreground">{companyName.substring(0, 2).toUpperCase()}</Text>
          </View>
          <Text className="text-2xl font-outfit-b text-foreground text-center leading-tight">{jobTitle}</Text>
          <Text className="text-base font-work-sans text-foreground/70 mt-2">{companyName}</Text>
          
          <View className={`px-4 py-2 rounded-full mt-4 ${statusStyle.bg}`}>
            <Text className={`text-sm font-outfit-b capitalize ${statusStyle.text}`}>
              {app.status.replace('_', ' ')}
            </Text>
          </View>
          
          <Text className="text-sm font-work-sans text-foreground/50 mt-4">Applied {appliedDate}</Text>
        </Card>

        {/* Progress Timeline */}
        <Card className="mt-6 p-6">
          <Text className="text-lg font-outfit-b text-foreground mb-6">Application Progress</Text>
          
          {statusSteps.map((step, i) => {
            const isComplete = !isRejected && i <= currentStepIdx;
            const isCurrent = !isRejected && i === currentStepIdx;
            
            let dotClass = 'bg-border';
            let lineClass = 'bg-border';
            let textClass = 'text-foreground/50';
            
            if (isRejected) {
              dotClass = 'bg-red-500';
              textClass = 'text-red-600';
            } else if (isComplete) {
              dotClass = 'bg-primary';
              textClass = 'text-foreground font-outfit-sb';
              if (i < currentStepIdx) {
                lineClass = 'bg-primary';
              }
            }

            return (
              <View key={step} className="flex-row gap-4">
                <View className="items-center w-5">
                  <View className={`w-3.5 h-3.5 rounded-full ${dotClass} ${isCurrent ? 'border-4 border-primary/20 scale-125' : ''}`} />
                  {i < statusSteps.length - 1 && (
                    <View className={`w-0.5 h-10 my-1 ${lineClass}`} />
                  )}
                </View>
                <View className="flex-1 pb-6 -mt-1">
                  <Text className={`text-base font-work-sans ${textClass}`}>{step}</Text>
                  {isCurrent && <Text className="text-xs font-outfit-sb text-primary mt-1">Current stage</Text>}
                </View>
              </View>
            );
          })}
          
          {isRejected && (
            <View className="mt-4 bg-red-50 p-4 rounded-xl border border-red-100">
              <Text className="text-sm font-work-sans text-red-800 leading-relaxed">
                Unfortunately, your application was not selected. Don't give up — keep applying!
              </Text>
            </View>
          )}
        </Card>

        {/* Actions */}
        <Card className="mt-6 p-0 overflow-hidden">
          <TouchableOpacity 
            className="flex-row items-center p-5 gap-4" 
            onPress={() => router.push(`/job/${app.job_id}` as any)}
          >
            <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center">
              <IconSymbol name="briefcase.fill" size={20} color="#0369A1" />
            </View>
            <Text className="flex-1 text-base font-outfit-sb text-foreground">View Job Details</Text>
            <IconSymbol name="chevron.right" size={16} color="#0C4A6E80" />
          </TouchableOpacity>
        </Card>

        {app.status === 'submitted' && (
          <TouchableOpacity 
            className="mt-6 bg-red-50 border border-red-100 p-4 rounded-xl items-center flex-row justify-center gap-2 shadow-sm"
            onPress={handleWithdraw}
            disabled={withdrawing}
          >
            {withdrawing ? <ActivityIndicator color="#ef4444" /> : (
              <>
                <IconSymbol name="trash.fill" size={18} color="#ef4444" />
                <Text className="text-red-600 font-outfit-b text-base">Withdraw Application</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
