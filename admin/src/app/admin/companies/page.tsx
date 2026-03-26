"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Search, MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { companies } from "@/lib/mock-data";

export default function CompaniesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = companies.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.headquarters.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">All Companies</h2>
          <p className="text-sm text-slate-500">{companies.length} companies registered</p>
        </div>
        <Link href="/admin/companies/new">
          <Button className="gap-2">
            <Plus size={16} /> Add Company
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search companies..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {["all", "active", "inactive", "archived"].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    statusFilter === s
                      ? "bg-sky-50 text-sky-700"
                      : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>Headquarters</TableHead>
            <TableHead>Industry</TableHead>
            <TableHead>Regions</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-12 text-slate-400">
                No companies found matching your criteria.
              </TableCell>
            </TableRow>
          ) : (
            filtered.map((company) => (
              <TableRow key={company.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-500 shrink-0">
                      {company.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{company.name}</p>
                      <p className="text-xs text-slate-500">{company.website}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-slate-600">{company.headquarters}</TableCell>
                <TableCell className="text-slate-600">{company.industrySegment}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {company.regions.slice(0, 2).map((r) => (
                      <Badge key={r} variant="secondary" className="text-xs">
                        {r}
                      </Badge>
                    ))}
                    {company.regions.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{company.regions.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      company.status === "active"
                        ? "success"
                        : company.status === "inactive"
                        ? "warning"
                        : "secondary"
                    }
                    className="capitalize"
                  >
                    {company.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Link href={`/admin/companies/${company.id}`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye size={14} />
                      </Button>
                    </Link>
                    <Link href={`/admin/companies/${company.id}/edit`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Pencil size={14} />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700">
                      <Trash2 size={14} />
                    </Button>
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
