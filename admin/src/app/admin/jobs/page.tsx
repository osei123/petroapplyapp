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
import { jobs } from "@/lib/mock-data";

export default function JobsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = jobs.filter((j) => {
    const matchesSearch =
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.companyName.toLowerCase().includes(search.toLowerCase()) ||
      j.location.toLowerCase().includes(search.toLowerCase());
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
          {filtered.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-12 text-slate-400">No jobs found.</TableCell>
            </TableRow>
          ) : (
            filtered.map((job) => (
              <TableRow key={job.id}>
                <TableCell>
                  <div>
                    <p className="font-semibold text-slate-900">{job.title}</p>
                    <div className="flex gap-1.5 mt-1">
                      {job.featured && <Badge variant="default" className="text-[10px]">Featured</Badge>}
                      <Badge variant="secondary" className="text-[10px] capitalize">{job.remoteType}</Badge>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-slate-600">{job.companyName}</TableCell>
                <TableCell className="text-slate-600">{job.location}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="capitalize">{job.employmentType.replace("-", " ")}</Badge>
                </TableCell>
                <TableCell className="text-slate-600">{job.deadline}</TableCell>
                <TableCell>
                  <Badge variant={
                    job.status === "published" ? "success" :
                    job.status === "draft" ? "secondary" :
                    job.status === "closed" ? "warning" : "outline"
                  } className="capitalize">{job.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Link href={`/admin/jobs/${job.id}`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Eye size={14} /></Button>
                    </Link>
                    <Link href={`/admin/jobs/${job.id}/edit`}>
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
