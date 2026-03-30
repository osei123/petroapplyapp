"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase/client";

export default function NewCompanyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    headquarters: "",
    industry_segment: "",
    description: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate required fields
    if (!formData.name.trim() || !formData.headquarters.trim()) {
      setError("Company Name and Headquarters are required.");
      setLoading(false);
      return;
    }

    const { data: userData } = await supabase.auth.getUser();

    const { data: newCompany, error: insertError } = await supabase
      .from("companies")
      .insert([
        {
          name: formData.name,
          headquarters: formData.headquarters,
          industry_segment: formData.industry_segment,
          description: formData.description,
          logo_url: "https://via.placeholder.com/150", 
        },
      ])
      .select()
      .single();

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
    } else {
      if (userData.user && newCompany) {
        await supabase.from("activity_logs").insert({
          user_id: userData.user.id,
          entity_type: "company",
          entity_id: newCompany.id,
          action: "Created new company",
          details: { name: newCompany.name }
        });
      }
      router.push("/admin/companies");
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Companies
      </button>

      <div>
        <h2 className="text-lg font-bold text-slate-900">Add New Company</h2>
        <p className="text-sm text-slate-500">Fill in the details below to register a new company.</p>
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
                <Label htmlFor="name">Company Name *</Label>
                <Input 
                  id="name" 
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Schlumberger" 
                  className="mt-1.5" 
                />
              </div>
              
              <div>
                <Label htmlFor="headquarters">Headquarters *</Label>
                <Input 
                  id="headquarters" 
                  value={formData.headquarters}
                  onChange={handleChange}
                  placeholder="e.g. Houston, TX" 
                  className="mt-1.5" 
                />
              </div>

              <div className="sm:col-span-2">
                <Label htmlFor="industry_segment">Industry Segment</Label>
                <Input 
                  id="industry_segment" 
                  value={formData.industry_segment}
                  onChange={handleChange}
                  placeholder="e.g. Oilfield Services" 
                  className="mt-1.5" 
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="flex w-full rounded-2xl border border-input bg-transparent px-4 py-3 text-sm shadow-sm mt-1.5 resize-none placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Brief description of the company..."
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                Save Company
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
