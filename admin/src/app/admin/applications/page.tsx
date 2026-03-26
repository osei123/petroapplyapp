"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { applications } from "@/lib/mock-data";

const statusBadgeVariant: Record<string, "default" | "secondary" | "destructive" | "success" | "warning" | "outline"> = {
  submitted: "secondary", under_review: "default", shortlisted: "warning", interview: "outline", rejected: "destructive", hired: "success",
};

export default function ApplicationsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = applications.filter((a) => {
    const matchesSearch = a.userName.toLowerCase().includes(search.toLowerCase()) ||
      a.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
      a.companyName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">All Applications</h2>
        <p className="text-sm text-slate-500">{applications.length} total applications</p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input placeholder="Search applications..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="flex gap-2 flex-wrap">
              {["all", "submitted", "under_review", "shortlisted", "interview", "rejected", "hired"].map((s) => (
                <button key={s} onClick={() => setStatusFilter(s)}
                  className={`px-3 py-2 rounded-full text-xs font-medium transition-colors ${
                    statusFilter === s ? "bg-sky-50 text-sky-700" : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                  }`}>
                  {s === "all" ? "All" : s.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Applicant</TableHead>
            <TableHead>Job</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Applied</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.length === 0 ? (
            <TableRow><TableCell colSpan={6} className="text-center py-12 text-slate-400">No applications found.</TableCell></TableRow>
          ) : (
            filtered.map((app) => (
              <TableRow key={app.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600 shrink-0">
                      {app.userName.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{app.userName}</p>
                      <p className="text-xs text-slate-500">{app.userEmail}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-slate-600 text-sm">{app.jobTitle}</TableCell>
                <TableCell className="text-slate-600 text-sm">{app.companyName}</TableCell>
                <TableCell className="text-slate-600 text-sm">{app.appliedAt}</TableCell>
                <TableCell>
                  <Badge variant={statusBadgeVariant[app.status] || "secondary"} className="capitalize">{app.status.replace("_", " ")}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/admin/applications/${app.id}`}>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Eye size={14} /></Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
