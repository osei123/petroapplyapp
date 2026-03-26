"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { companies } from "@/lib/mock-data";

export default function NewJobPage() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/admin/jobs");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors">
        <ArrowLeft size={16} /> Back to Jobs
      </button>
      <div>
        <h2 className="text-lg font-bold text-slate-900">Post New Job</h2>
        <p className="text-sm text-slate-500">Fill in the details to create a new job listing.</p>
      </div>
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <Label htmlFor="title">Job Title *</Label>
                <Input id="title" placeholder="e.g. Petroleum Engineer" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="company">Company *</Label>
                <select id="company" className="flex h-11 w-full rounded-2xl border border-input bg-transparent px-4 py-2 text-sm shadow-sm mt-1.5">
                  <option value="">Select company</option>
                  {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <Label htmlFor="location">Location *</Label>
                <Input id="location" placeholder="e.g. Houston, TX" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="remoteType">Work Mode</Label>
                <select id="remoteType" className="flex h-11 w-full rounded-2xl border border-input bg-transparent px-4 py-2 text-sm shadow-sm mt-1.5">
                  <option value="on-site">On-Site</option>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
              <div>
                <Label htmlFor="employmentType">Employment Type</Label>
                <select id="employmentType" className="flex h-11 w-full rounded-2xl border border-input bg-transparent px-4 py-2 text-sm shadow-sm mt-1.5">
                  <option value="full-time">Full-Time</option>
                  <option value="part-time">Part-Time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>
              <div>
                <Label htmlFor="experienceLevel">Experience Level</Label>
                <select id="experienceLevel" className="flex h-11 w-full rounded-2xl border border-input bg-transparent px-4 py-2 text-sm shadow-sm mt-1.5">
                  <option value="entry">Entry</option>
                  <option value="mid">Mid</option>
                  <option value="senior">Senior</option>
                  <option value="executive">Executive</option>
                </select>
              </div>
              <div>
                <Label htmlFor="salary">Salary Range</Label>
                <Input id="salary" placeholder="e.g. $95,000 - $130,000" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="deadline">Application Deadline</Label>
                <Input id="deadline" type="date" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="applicationMode">Application Mode</Label>
                <select id="applicationMode" className="flex h-11 w-full rounded-2xl border border-input bg-transparent px-4 py-2 text-sm shadow-sm mt-1.5">
                  <option value="internal">Internal</option>
                  <option value="external">External</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <select id="status" className="flex h-11 w-full rounded-2xl border border-input bg-transparent px-4 py-2 text-sm shadow-sm mt-1.5">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Job Description *</Label>
              <textarea id="description" rows={5} className="flex w-full rounded-2xl border border-input bg-transparent px-4 py-3 text-sm shadow-sm mt-1.5 resize-none placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" placeholder="Describe the role, responsibilities, and expectations..." />
            </div>

            <div>
              <Label htmlFor="requirements">Requirements (one per line)</Label>
              <textarea id="requirements" rows={4} className="flex w-full rounded-2xl border border-input bg-transparent px-4 py-3 text-sm shadow-sm mt-1.5 resize-none placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" placeholder="BSc in Petroleum Engineering&#10;3-5 years experience&#10;Reservoir simulation proficiency" />
            </div>

            <div className="flex items-center gap-3">
              <input type="checkbox" id="featured" className="w-4 h-4 rounded border-input accent-sky-500" />
              <Label htmlFor="featured" className="cursor-pointer">Feature this job</Label>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit">Post Job</Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
