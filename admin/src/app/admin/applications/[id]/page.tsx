"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, FileText, Download, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase/client";

const statusBadgeVariant: Record<string, "default" | "secondary" | "destructive" | "success" | "warning" | "outline"> = {
  submitted: "secondary", under_review: "default", shortlisted: "warning", interview: "outline", rejected: "destructive", hired: "success",
};
const allStatuses = ["submitted", "under_review", "shortlisted", "interview", "rejected", "hired"];

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [app, setApp] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [status, setStatus] = useState("submitted");
  const [adminNotes, setAdminNotes] = useState("");

  const fetchApp = async () => {
    const { data } = await supabase
      .from("applications")
      .select(`
        *,
        jobs (title, companies (name)),
        user_profiles (full_name, email)
      `)
      .eq("id", params.id)
      .single();

    if (data) {
      setApp({
        id: data.id,
        userName: data.user_profiles?.full_name || "Unknown",
        userEmail: data.user_profiles?.email || "Unknown",
        jobTitle: data.jobs?.title || "Unknown",
        companyName: data.jobs?.companies?.name || "Unknown",
        status: data.status,
        appliedAt: new Date(data.applied_at).toLocaleString(),
        coverLetter: data.cover_letter_text,
        resumeUrl: data.resume_url,
        adminNotes: data.admin_notes,
      });
      setStatus(data.status || "submitted");
      setAdminNotes(data.admin_notes || "");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchApp();
  }, [params.id]);

  const handleUpdate = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("applications")
      .update({ status, admin_notes: adminNotes })
      .eq("id", params.id);

    setSaving(false);
    if (error) {
      alert("Failed to update application: " + error.message);
    } else {
      alert("Application updated successfully");
      fetchApp();
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this application? The applicant will be able to apply again. This action cannot be undone.")) {
      setSaving(true);
      const { error } = await supabase.from("applications").delete().eq("id", params.id);
      setSaving(false);
      if (error) {
        alert("Failed to delete: " + error.message);
      } else {
        alert("Application deleted successfully.");
        router.push("/admin/applications");
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20 text-slate-500">Loading application details...</div>;
  }

  if (!app) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg font-semibold text-slate-700">Application not found</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push("/admin/applications")}>Back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft size={16} /> Back to Applications
        </button>
        <Button variant="destructive" size="sm" onClick={handleDelete} disabled={saving}>
          Delete Application
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-lg font-bold text-slate-600">
                {app.userName.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">{app.userName}</h2>
                <p className="text-sm text-slate-500">{app.userEmail}</p>
                <p className="text-sm text-slate-500 mt-0.5">Applied for <span className="font-medium text-slate-700">{app.jobTitle}</span> at {app.companyName}</p>
              </div>
            </div>
            <Badge variant={statusBadgeVariant[app.status] || "secondary"} className="capitalize h-8 px-3 text-sm">
              {app.status.replace("_", " ")}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Application Details</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Applied On</p>
                <p className="text-sm text-slate-700 mt-0.5">{app.appliedAt}</p>
              </div>
            </div>
            {app.coverLetter && (
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Cover Letter</p>
                <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-600 leading-relaxed">{app.coverLetter}</div>
              </div>
            )}
            {app.resumeUrl && (
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Resume</p>
                <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-4">
                  <FileText size={20} className="text-sky-500" />
                  <span className="text-sm text-slate-700 flex-1">{app.resumeUrl.split("/").pop() || "Resume File"}</span>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="gap-1 text-sky-600"
                      onClick={async () => {
                        try {
                          const { data, error } = await supabase.storage.from("resumes").createSignedUrl(app.resumeUrl, 60);
                          if (error) throw error;
                          if (data?.signedUrl) window.open(data.signedUrl, "_blank");
                        } catch (err: any) {
                          alert("Failed to view resume: " + err.message);
                        }
                      }}
                    >
                      <FileText size={14} /> View
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="gap-1 text-sky-600"
                      onClick={async () => {
                        try {
                          const { data, error } = await supabase.storage.from("resumes").download(app.resumeUrl);
                          if (error) throw error;
                          const url = URL.createObjectURL(data);
                          const a = document.createElement("a");
                          a.href = url;
                          const ext = app.resumeUrl.split(".").pop() || "pdf";
                          a.download = `${app.userName} Resume.${ext}`;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                        } catch (err: any) {
                          alert("Failed to download resume: " + err.message);
                        }
                      }}
                    >
                      <Download size={14} /> Download
                    </Button>
                  </div>
                </div>
              </div>
            )}
            {app.adminNotes && (
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Admin Notes</p>
                <div className="bg-amber-50 rounded-xl p-4 text-sm text-amber-800">{app.adminNotes}</div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Update Status</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Change Status</Label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="flex h-11 w-full rounded-2xl border border-input bg-transparent px-4 py-2 text-sm shadow-sm mt-1.5">
                {allStatuses.map((s) => (
                  <option key={s} value={s}>{s.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Internal Notes</Label>
              <textarea rows={4} value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} placeholder="Add internal notes..." className="flex w-full rounded-2xl border border-input bg-transparent px-4 py-3 text-sm shadow-sm mt-1.5 resize-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
            </div>
            <Button className="w-full" onClick={handleUpdate} disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Update Application
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
