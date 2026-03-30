"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Calendar, DollarSign, Pencil, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { jobs, applications } from "@/lib/mock-data";

const statusBadgeVariant: Record<string, "default" | "secondary" | "destructive" | "success" | "warning" | "outline"> = {
  submitted: "secondary",
  under_review: "default",
  shortlisted: "warning",
  interview: "outline",
  rejected: "destructive",
  hired: "success",
};

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const job = jobs.find((j) => j.id === params.id);

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg font-semibold text-slate-700">Job not found</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push("/admin/jobs")}>Back to Jobs</Button>
      </div>
    );
  }

  const jobApps = applications.filter((a) => a.jobId === job.id);

  return (
    <div className="space-y-6 max-w-4xl">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors">
        <ArrowLeft size={16} /> Back to Jobs
      </button>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {job.featured && <Badge>Featured</Badge>}
                <Badge variant={job.status === "published" ? "success" : "secondary"} className="capitalize">{job.status}</Badge>
              </div>
              <h2 className="text-xl font-bold text-slate-900">{job.title}</h2>
              <p className="text-sm text-slate-500 mt-1">{job.companyName}</p>
              <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-500">
                <span className="flex items-center gap-1"><MapPin size={14} />{job.location}</span>
                <span className="flex items-center gap-1"><Calendar size={14} />Deadline: {job.deadline}</span>
                <span className="flex items-center gap-1"><DollarSign size={14} />{job.salaryRange}</span>
              </div>
            </div>
            <Link href={`/admin/jobs/${job.id}/edit`}>
              <Button variant="outline" size="sm" className="gap-2"><Pencil size={14} /> Edit</Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Description</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 leading-relaxed">{job.description}</p>
            <h4 className="font-semibold text-sm text-slate-900 mt-6 mb-2">Requirements</h4>
            <ul className="list-disc list-inside space-y-1">
              {job.requirements.map((r, i) => (
                <li key={i} className="text-sm text-slate-600">{r}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Employment", value: job.employmentType },
              { label: "Work Mode", value: job.remoteType },
              { label: "Experience", value: job.experienceLevel },
              { label: "Application Mode", value: job.applicationMode },
              { label: "Published", value: job.publishedAt || "Not published" },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-xs text-slate-400 uppercase tracking-wider">{item.label}</p>
                <p className="text-sm text-slate-700 capitalize mt-0.5">{item.value.replace("-", " ").replace("_", " ")}</p>
              </div>
            ))}
            {job.externalApplyUrl && (
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">External Link</p>
                <a href={job.externalApplyUrl} className="text-sm text-sky-600 hover:underline flex items-center gap-1 mt-0.5">
                  Apply Externally <ExternalLink size={12} />
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Applications for this job */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Applications ({jobApps.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {jobApps.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">No applications yet.</p>
          ) : (
            <div className="space-y-3">
              {jobApps.map((app) => (
                <div key={app.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-sm font-bold text-slate-600">
                      {app.userName.split(" ").map((n: string) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-slate-900">{app.userName}</p>
                      <p className="text-xs text-slate-500">{app.userEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={statusBadgeVariant[app.status] || "secondary"} className="capitalize">
                      {app.status.replace("_", " ")}
                    </Badge>
                    <Link href={`/admin/applications/${app.id}`}>
                      <Button variant="ghost" size="sm">View</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
