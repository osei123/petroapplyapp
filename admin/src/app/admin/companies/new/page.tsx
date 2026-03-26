"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function NewCompanyPage() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock: just redirect back
    router.push("/admin/companies");
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
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <Label htmlFor="name">Company Name *</Label>
                <Input id="name" placeholder="e.g. Schlumberger" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input id="website" placeholder="https://..." className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="headquarters">Headquarters *</Label>
                <Input id="headquarters" placeholder="e.g. Houston, TX" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="industry">Industry Segment</Label>
                <Input id="industry" placeholder="e.g. Oilfield Services" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="careers_url">Careers URL</Label>
                <Input id="careers_url" placeholder="https://careers..." className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  className="flex h-11 w-full rounded-2xl border border-input bg-transparent px-4 py-2 text-sm shadow-sm mt-1.5"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="regions">Regions (comma-separated)</Label>
              <Input id="regions" placeholder="North America, Europe, Middle East" className="mt-1.5" />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                rows={4}
                className="flex w-full rounded-2xl border border-input bg-transparent px-4 py-3 text-sm shadow-sm mt-1.5 resize-none placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Brief description of the company..."
              />
            </div>

            <div>
              <Label htmlFor="logo">Company Logo</Label>
              <div className="mt-1.5 border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center">
                <p className="text-sm text-slate-500">Drag & drop a logo here or click to browse</p>
                <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 2MB</p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit">Save Company</Button>
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
