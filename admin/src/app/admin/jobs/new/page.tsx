"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase/client";

export default function NewJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchingCompanies, setFetchingCompanies] = useState(true);
  const [companies, setCompanies] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    company_id: "",
    location: "",
    remote_type: "on-site",
    employment_type: "full-time",
    experience_level: "mid",
    salary_range: "",
    deadline: "",
    application_mode: "internal",
    description: "",
    requirements: "",
    featured: false,
  });

  useEffect(() => {
    async function fetchCompanies() {
      const { data, error } = await supabase.from("companies").select("id, name").order("name");
      if (data) setCompanies(data);
      setFetchingCompanies(false);
    }
    fetchCompanies();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [target.id]: target.type === "checkbox" ? target.checked : target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.title || !formData.company_id || !formData.description) {
      setError("Title, Company, and Description are required.");
      setLoading(false);
      return;
    }

    // Process requirements into an array
    const reqArray = formData.requirements
      .split("\n")
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    const { data: userData } = await supabase.auth.getUser();

    const { data: newJob, error: insertError } = await supabase.from("jobs").insert([
      {
        title: formData.title,
        company_id: formData.company_id,
        location: formData.location || null,
        remote_type: formData.remote_type,
        employment_type: formData.employment_type,
        experience_level: formData.experience_level,
        salary_range: formData.salary_range || null,
        deadline: formData.deadline || null,
        application_mode: formData.application_mode,
        description: formData.description,
        requirements: reqArray,
        featured: formData.featured,
        posted_date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      },
    ])
    .select()
    .single();

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
    } else {
      if (userData.user && newJob) {
        await supabase.from("activity_logs").insert({
          user_id: userData.user.id,
          entity_type: "job",
          entity_id: newJob.id,
          action: "Posted new job",
          details: { title: newJob.title }
        });
      }
      router.push("/admin/jobs");
    }
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
          {error && (
            <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <Label htmlFor="title">Job Title *</Label>
                <Input id="title" value={formData.title} onChange={handleChange} placeholder="e.g. Petroleum Engineer" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="company_id">Company *</Label>
                <select 
                  id="company_id" 
                  value={formData.company_id}
                  onChange={handleChange}
                  disabled={fetchingCompanies}
                  className="flex h-11 w-full rounded-2xl border border-input bg-transparent px-4 py-2 text-sm shadow-sm mt-1.5"
                >
                  <option value="">Select company</option>
                  {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" value={formData.location} onChange={handleChange} placeholder="e.g. Houston, TX" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="remote_type">Work Mode</Label>
                <select id="remote_type" value={formData.remote_type} onChange={handleChange} className="flex h-11 w-full rounded-2xl border border-input bg-transparent px-4 py-2 text-sm shadow-sm mt-1.5">
                  <option value="on-site">On-Site</option>
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
              <div>
                <Label htmlFor="employment_type">Employment Type</Label>
                <select id="employment_type" value={formData.employment_type} onChange={handleChange} className="flex h-11 w-full rounded-2xl border border-input bg-transparent px-4 py-2 text-sm shadow-sm mt-1.5">
                  <option value="full-time">Full-Time</option>
                  <option value="part-time">Part-Time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>
              <div>
                <Label htmlFor="experience_level">Experience Level</Label>
                <select id="experience_level" value={formData.experience_level} onChange={handleChange} className="flex h-11 w-full rounded-2xl border border-input bg-transparent px-4 py-2 text-sm shadow-sm mt-1.5">
                  <option value="entry">Entry</option>
                  <option value="mid">Mid</option>
                  <option value="senior">Senior</option>
                  <option value="executive">Executive</option>
                </select>
              </div>
              <div>
                <Label htmlFor="salary_range">Salary Range</Label>
                <Input id="salary_range" value={formData.salary_range} onChange={handleChange} placeholder="e.g. $95,000 - $130,000" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="deadline">Application Deadline</Label>
                <Input id="deadline" type="date" value={formData.deadline} onChange={handleChange} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="application_mode">Application Mode</Label>
                <select id="application_mode" value={formData.application_mode} onChange={handleChange} className="flex h-11 w-full rounded-2xl border border-input bg-transparent px-4 py-2 text-sm shadow-sm mt-1.5">
                  <option value="internal">Internal</option>
                  <option value="external">External</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Job Description *</Label>
              <textarea id="description" value={formData.description} onChange={handleChange} rows={5} className="flex w-full rounded-2xl border border-input bg-transparent px-4 py-3 text-sm shadow-sm mt-1.5 resize-none placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" placeholder="Describe the role, responsibilities, and expectations..." />
            </div>

            <div>
              <Label htmlFor="requirements">Requirements (one per line)</Label>
              <textarea id="requirements" value={formData.requirements} onChange={handleChange} rows={4} className="flex w-full rounded-2xl border border-input bg-transparent px-4 py-3 text-sm shadow-sm mt-1.5 resize-none placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" placeholder="BSc in Petroleum Engineering&#10;3-5 years experience&#10;Reservoir simulation proficiency" />
            </div>

            <div className="flex items-center gap-3">
              <input type="checkbox" id="featured" checked={formData.featured} onChange={handleChange} className="w-4 h-4 rounded border-input accent-sky-500" />
              <Label htmlFor="featured" className="cursor-pointer">Feature this job</Label>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={loading || fetchingCompanies}>
                {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                Post Job
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
