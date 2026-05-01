"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase/client";

export default function EditJobPage() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<any>(null);
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      const { data: jobData } = await supabase.from("jobs").select("*").eq("id", params.id).single();
      const { data: companiesData } = await supabase.from("companies").select("id, name").order("name");
      
      if (jobData) setJob(jobData);
      if (companiesData) setCompanies(companiesData);
      
      setLoading(false);
    }
    loadData();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    const requirementsRaw = formData.get("requirements") as string;
    const reqArray = requirementsRaw ? requirementsRaw.split("\n").map(r => r.trim()).filter(r => r.length > 0) : [];

    const updates = {
      title: formData.get("title"),
      company_id: formData.get("company_id"),
      location: formData.get("location") || null,
      remote_type: formData.get("remote_type"),
      salary_range: formData.get("salary_range") || null,
      deadline: formData.get("deadline") || null,
      application_mode: formData.get("application_mode"),
      external_url: formData.get("external_url") || null,
      status: formData.get("status"),
      description: formData.get("description"),
      requirements: reqArray,
      featured: formData.get("featured") === "on",
    };

    const { error } = await supabase.from("jobs").update(updates).eq("id", params.id);
    setSaving(false);
    
    if (error) {
      alert("Failed to update job: " + error.message);
    } else {
      router.push(`/admin/jobs/${params.id}`);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20 text-slate-500">Loading job details...</div>;
  }

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg font-semibold text-slate-700">Job not found</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push("/admin/jobs")}>Back to Jobs</Button>
      </div>
    );
  }

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
                <Input id="title" name="title" defaultValue={job.title} required className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="company_id">Company *</Label>
                <select id="company_id" name="company_id" defaultValue={job.company_id} required className="flex h-11 w-full rounded-2xl border border-input bg-transparent px-4 py-2 text-sm shadow-sm mt-1.5">
                  {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" defaultValue={job.location || ""} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="remote_type">Work Mode</Label>
                <select id="remote_type" name="remote_type" defaultValue={job.remote_type || "on-site"} className="flex h-11 w-full rounded-2xl border border-input bg-transparent px-4 py-2 text-sm shadow-sm mt-1.5">
                  <option value="on-site">On-Site</option>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
              <div>
                <Label htmlFor="salary_range">Salary Range</Label>
                <Input id="salary_range" name="salary_range" defaultValue={job.salary_range || ""} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="deadline">Deadline</Label>
                <Input id="deadline" name="deadline" type="date" defaultValue={job.deadline || ""} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="application_mode">Application Mode</Label>
                <select id="application_mode" name="application_mode" defaultValue={job.application_mode || "internal"} className="flex h-11 w-full rounded-2xl border border-input bg-transparent px-4 py-2 text-sm shadow-sm mt-1.5">
                  <option value="internal">Internal</option>
                  <option value="external">External</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="external_url">External Application URL (if External/Hybrid)</Label>
                <Input id="external_url" name="external_url" defaultValue={job.external_url || ""} placeholder="https://company.com/careers/apply" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <select id="status" name="status" defaultValue={job.status || "published"} className="flex h-11 w-full rounded-2xl border border-input bg-transparent px-4 py-2 text-sm shadow-sm mt-1.5">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="closed">Closed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <textarea id="description" name="description" rows={5} defaultValue={job.description || ""} className="flex w-full rounded-2xl border border-input bg-transparent px-4 py-3 text-sm shadow-sm mt-1.5 resize-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
            </div>
            <div>
              <Label htmlFor="requirements">Requirements</Label>
              <textarea id="requirements" name="requirements" rows={4} defaultValue={job.requirements ? job.requirements.join("\n") : ""} className="flex w-full rounded-2xl border border-input bg-transparent px-4 py-3 text-sm shadow-sm mt-1.5 resize-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="featured" name="featured" defaultChecked={job.featured} className="w-4 h-4 rounded border-input accent-sky-500" />
              <Label htmlFor="featured" className="cursor-pointer">Feature this job</Label>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={saving}>
                {saving ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                Save Changes
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={saving}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
