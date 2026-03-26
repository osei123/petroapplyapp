"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { jobs, companies } from "@/lib/mock-data";

export default function EditJobPage() {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/admin/jobs/${job.id}`);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors">
        <ArrowLeft size={16} /> Back
      </button>
      <div>
        <h2 className="text-lg font-bold text-slate-900">Edit Job</h2>
        <p className="text-sm text-slate-500">Update details for {job.title}.</p>
      </div>
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <Label htmlFor="title">Job Title *</Label>
                <Input id="title" defaultValue={job.title} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="company">Company *</Label>
                <select id="company" defaultValue={job.companyId} className="flex h-11 w-full rounded-2xl border border-input bg-transparent px-4 py-2 text-sm shadow-sm mt-1.5">
                  {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <Label htmlFor="location">Location *</Label>
                <Input id="location" defaultValue={job.location} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="remoteType">Work Mode</Label>
                <select id="remoteType" defaultValue={job.remoteType} className="flex h-11 w-full rounded-2xl border border-input bg-transparent px-4 py-2 text-sm shadow-sm mt-1.5">
                  <option value="on-site">On-Site</option>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
              <div>
                <Label htmlFor="salary">Salary Range</Label>
                <Input id="salary" defaultValue={job.salaryRange} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="deadline">Deadline</Label>
                <Input id="deadline" type="date" defaultValue={job.deadline} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <select id="status" defaultValue={job.status} className="flex h-11 w-full rounded-2xl border border-input bg-transparent px-4 py-2 text-sm shadow-sm mt-1.5">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="closed">Closed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <textarea id="description" rows={5} defaultValue={job.description} className="flex w-full rounded-2xl border border-input bg-transparent px-4 py-3 text-sm shadow-sm mt-1.5 resize-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
            </div>
            <div>
              <Label htmlFor="requirements">Requirements</Label>
              <textarea id="requirements" rows={4} defaultValue={job.requirements.join("\n")} className="flex w-full rounded-2xl border border-input bg-transparent px-4 py-3 text-sm shadow-sm mt-1.5 resize-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="featured" defaultChecked={job.featured} className="w-4 h-4 rounded border-input accent-sky-500" />
              <Label htmlFor="featured" className="cursor-pointer">Feature this job</Label>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit">Save Changes</Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
