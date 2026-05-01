"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Globe, MapPin, Briefcase, Pencil, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";

export default function CompanyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [company, setCompany] = useState<any>(null);
  const [companyJobs, setCompanyJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const { data: comp } = await supabase.from("companies").select("*").eq("id", params.id).single();
      const { data: jobs } = await supabase.from("jobs").select("*").eq("company_id", params.id);
      
      if (comp) setCompany(comp);
      if (jobs) setCompanyJobs(jobs);
      setLoading(false);
    }
    loadData();
  }, [params.id]);

  if (loading) {
    return <div className="flex justify-center py-20 text-slate-500">Loading company details...</div>;
  }

  if (!company) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg font-semibold text-slate-700">Company not found</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push("/admin/companies")}>
          Back to Companies
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Companies
      </button>

      {/* Header Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-xl font-bold text-slate-500">
                {company.name?.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">{company.name}</h2>
                <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                  <span className="flex items-center gap-1"><MapPin size={14} />{company.headquarters || "Unknown"}</span>
                  <span className="flex items-center gap-1"><Globe size={14} />{company.industry_segment || "Unknown"}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/companies/${company.id}/edit`}>
                <Button variant="outline" size="sm" className="gap-2">
                  <Pencil size={14} /> Edit
                </Button>
              </Link>
              <Badge
                variant={company.status === "active" ? "success" : "warning"}
                className="capitalize h-8 px-3"
              >
                {company.status || "active"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">About</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 leading-relaxed">{company.description || "No description available."}</p>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Created</p>
                <p className="text-sm text-slate-700 mt-1">{new Date(company.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Company Jobs */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Jobs ({companyJobs.length})</CardTitle>
          <Link href="/admin/jobs/new">
            <Button variant="outline" size="sm" className="gap-2">
              <Briefcase size={14} /> Add Job
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {companyJobs.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">No jobs listed for this company.</p>
          ) : (
            <div className="space-y-3">
              {companyJobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                  <div>
                    <p className="font-semibold text-sm text-slate-900">{job.title}</p>
                    <p className="text-xs text-slate-500">{job.location} · {job.employment_type} · {job.remote_type}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/jobs/${job.id}`}>
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
