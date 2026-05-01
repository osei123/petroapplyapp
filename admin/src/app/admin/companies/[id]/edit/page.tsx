"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase/client";

export default function EditCompanyPage() {
  const params = useParams();
  const router = useRouter();
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      const { data } = await supabase.from("companies").select("*").eq("id", params.id).single();
      if (data) setCompany(data);
      setLoading(false);
    }
    loadData();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    const updates = {
      name: formData.get("name"),
      headquarters: formData.get("headquarters"),
      industry_segment: formData.get("industry"),
      status: formData.get("status"),
      description: formData.get("description"),
    };

    const { error } = await supabase.from("companies").update(updates).eq("id", params.id);
    
    setSaving(false);
    if (error) {
      alert("Failed to update company: " + error.message);
    } else {
      router.push(`/admin/companies/${params.id}`);
    }
  };

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
    <div className="space-y-6 max-w-3xl">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div>
        <h2 className="text-lg font-bold text-slate-900">Edit Company</h2>
        <p className="text-sm text-slate-500">Update details for {company.name}.</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <Label htmlFor="name">Company Name *</Label>
                <Input id="name" name="name" defaultValue={company.name} required className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="headquarters">Headquarters *</Label>
                <Input id="headquarters" name="headquarters" defaultValue={company.headquarters || ""} required className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="industry">Industry Segment</Label>
                <Input id="industry" name="industry" defaultValue={company.industry_segment || ""} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  name="status"
                  defaultValue={company.status || "active"}
                  className="flex h-11 w-full rounded-2xl border border-input bg-transparent px-4 py-2 text-sm shadow-sm mt-1.5"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                name="description"
                rows={4}
                defaultValue={company.description || ""}
                className="flex w-full rounded-2xl border border-input bg-transparent px-4 py-3 text-sm shadow-sm mt-1.5 resize-none placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={saving}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
