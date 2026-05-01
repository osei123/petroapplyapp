"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Mail, MapPin, GraduationCap, Calendar, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";

const statusBadgeVariant: Record<string, "default" | "secondary" | "destructive" | "success" | "warning" | "outline"> = {
  submitted: "secondary", under_review: "default", shortlisted: "warning", interview: "outline", rejected: "destructive", hired: "success",
};

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [userApps, setUserApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      // Fetch user profile
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", params.id)
        .single();
        
      if (profile) {
        setUser({
          ...profile,
          status: "active", // assuming active if they exist for now
        });
      }

      // Fetch user applications
      const { data: apps } = await supabase
        .from("applications")
        .select(`
          id, status, applied_at,
          jobs (title, companies(name))
        `)
        .eq("user_id", params.id)
        .order("applied_at", { ascending: false });

      if (apps) {
        setUserApps(apps.map((a: any) => ({
          id: a.id,
          status: a.status,
          appliedAt: new Date(a.applied_at).toLocaleDateString(),
          jobTitle: a.jobs?.title || "Unknown",
          companyName: a.jobs?.companies?.name || "Unknown"
        })));
      }
      
      setLoading(false);
    }
    fetchUserData();
  }, [params.id]);

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-slate-500" /></div>;
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg font-semibold text-slate-700">User not found</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push("/admin/users")}>Back to Users</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors">
        <ArrowLeft size={16} /> Back to Users
      </button>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white text-xl font-bold">
                {user.full_name ? user.full_name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase() : "U"}
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">{user.full_name || "Unknown"}</h2>
                <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-slate-500">
                  <span className="flex items-center gap-1"><Mail size={14} />{user.email}</span>
                  <span className="flex items-center gap-1"><MapPin size={14} />{user.country || "Not specified"}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge variant={user.status === "active" ? "success" : "destructive"} className="capitalize h-8 px-3">{user.status}</Badge>
              <Badge variant="outline" className="capitalize h-8 px-3">{(user.role || "student").replace("_", " ")}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Academic Details</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">University</p>
                <p className="text-sm text-slate-700 mt-0.5 flex items-center gap-1"><GraduationCap size={14} />{user.university || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Degree</p>
                <p className="text-sm text-slate-700 mt-0.5">{user.degree || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Graduation Year</p>
                <p className="text-sm text-slate-700 mt-0.5 flex items-center gap-1"><Calendar size={14} />{user.graduation_year || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Joined</p>
                <p className="text-sm text-slate-700 mt-0.5">{new Date(user.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Profile Completion</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="relative w-24 h-24">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#0ea5e9" strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={`${(user.profile_completion || 0) * 2.64} ${264 - (user.profile_completion || 0) * 2.64}`} />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-slate-900">
                  {user.profile_completion || 0}%
                </span>
              </div>
              <p className="text-sm text-slate-500 mt-3">{userApps.length} applications submitted</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Application History ({userApps.length})</CardTitle></CardHeader>
        <CardContent>
          {userApps.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">No applications from this user.</p>
          ) : (
            <div className="space-y-3">
              {userApps.map((app) => (
                <div key={app.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                  <div>
                    <p className="font-semibold text-sm text-slate-900">{app.jobTitle}</p>
                    <p className="text-xs text-slate-500">{app.companyName} · Applied {app.appliedAt}</p>
                  </div>
                  <Badge variant={statusBadgeVariant[app.status] || "secondary"} className="capitalize">{app.status.replace("_", " ")}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
