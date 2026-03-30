"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Search, Eye, Pencil, Copy, Archive } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from "@/components/ui/table";
import { supabase } from "@/lib/supabase/client";

export default function JobsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    async function fetchJobs() {
      const { data } = await supabase
        .from('jobs')
        .select('*, companies(name)')
        .order('created_at', { ascending: false });
        
      if (data) {
        const formatted = data.map((j: any) => ({
          ...j,
          companyName: j.companies?.name || 'Unknown',
          status: 'published' // Default status since schema lacks strict status field currently
        }));
        setJobs(formatted);
      }
      setLoading(false);
    }
    fetchJobs();
  }, []);

  const filtered = jobs.filter((j) => {
    const matchesSearch =
      j.title?.toLowerCase().includes(search.toLowerCase()) ||
      j.companyName?.toLowerCase().includes(search.toLowerCase()) ||
      j.location?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || j.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">All Jobs</h2>
          <p className="text-sm text-slate-500">{jobs.length} jobs posted</p>
        </div>
        <Link href="/admin/jobs/new">
          <Button className="gap-2"><Plus size={16} /> Post Job</Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input placeholder="Search jobs..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="flex gap-2 flex-wrap">
              {["all", "published", "draft", "closed", "archived"].map((s) => (
                <button key={s} onClick={() => setStatusFilter(s)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    statusFilter === s ? "bg-sky-50 text-sky-700" : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                  }`}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Job</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Deadline</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-12 text-slate-400">Loading jobs...</TableCell>
            </TableRow>
          ) : filtered.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-12 text-slate-400">No jobs found.</TableCell>
            </TableRow>
          ) : (
            filtered.map((j) => (
              <TableRow key={j.id}>
                <TableCell>
                  <div>
                    <p className="font-semibold text-slate-900">{j.title}</p>
                    <div className="flex gap-1.5 mt-1">
                      {j.featured && <Badge variant="default" className="text-[10px]">Featured</Badge>}
                      {j.remote_type && <Badge variant="secondary" className="text-[10px] capitalize">{j.remote_type}</Badge>}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-slate-600">{j.companyName}</TableCell>
                <TableCell className="text-slate-600">{j.location}</TableCell>
                <TableCell>
                  {j.employment_type && <Badge variant="secondary" className="capitalize">{j.employment_type.replace("-", " ")}</Badge>}
                </TableCell>
                <TableCell className="text-slate-600">{j.deadline || 'N/A'}</TableCell>
                <TableCell>
                  <Badge variant={
                    j.status === "published" ? "success" :
                    j.status === "draft" ? "secondary" :
                    j.status === "closed" ? "warning" : "outline"
                  } className="capitalize">{j.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Link href={`/admin/jobs/${j.id}`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Eye size={14} /></Button>
                    </Link>
                    <Link href={`/admin/jobs/${j.id}/edit`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Pencil size={14} /></Button>
                    </Link>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Copy size={14} /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
