"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { companies } from "@/lib/mock-data";

export default function EditCompanyPage() {
  const params = useParams();
  const router = useRouter();
  const company = companies.find((c) => c.id === params.id);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/admin/companies/${company.id}`);
  };

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
                <Input id="name" defaultValue={company.name} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input id="website" defaultValue={company.website} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="headquarters">Headquarters *</Label>
                <Input id="headquarters" defaultValue={company.headquarters} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="industry">Industry Segment</Label>
                <Input id="industry" defaultValue={company.industrySegment} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="careers_url">Careers URL</Label>
                <Input id="careers_url" defaultValue={company.careersUrl} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  defaultValue={company.status}
                  className="flex h-11 w-full rounded-2xl border border-input bg-transparent px-4 py-2 text-sm shadow-sm mt-1.5"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="regions">Regions</Label>
              <Input id="regions" defaultValue={company.regions.join(", ")} className="mt-1.5" />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                rows={4}
                defaultValue={company.description}
                className="flex w-full rounded-2xl border border-input bg-transparent px-4 py-3 text-sm shadow-sm mt-1.5 resize-none placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit">Save Changes</Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
