"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileText, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { applications } from "@/lib/mock-data";

const statusBadgeVariant: Record<string, "default" | "secondary" | "destructive" | "success" | "warning" | "outline"> = {
  submitted: "secondary", under_review: "default", shortlisted: "warning", interview: "outline", rejected: "destructive", hired: "success",
};
const allStatuses = ["submitted", "under_review", "shortlisted", "interview", "rejected", "hired"];

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const app = applications.find((a) => a.id === params.id);

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
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors">
        <ArrowLeft size={16} /> Back to Applications
      </button>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-lg font-bold text-slate-600">
                {app.userName.split(" ").map((n: string) => n[0]).join("")}
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
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Last Updated</p>
                <p className="text-sm text-slate-700 mt-0.5">{app.updatedAt}</p>
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
                  <span className="text-sm text-slate-700 flex-1">{app.resumeUrl.split("/").pop()}</span>
                  <Button variant="ghost" size="sm" className="gap-1 text-sky-600">
                    <Download size={14} /> Download
                  </Button>
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
              <select defaultValue={app.status} className="flex h-11 w-full rounded-2xl border border-input bg-transparent px-4 py-2 text-sm shadow-sm mt-1.5">
                {allStatuses.map((s) => (
                  <option key={s} value={s}>{s.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Internal Notes</Label>
              <textarea rows={4} defaultValue={app.adminNotes || ""} placeholder="Add internal notes..." className="flex w-full rounded-2xl border border-input bg-transparent px-4 py-3 text-sm shadow-sm mt-1.5 resize-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
            </div>
            <Button className="w-full">Update Application</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
