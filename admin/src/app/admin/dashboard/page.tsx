"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Building2,
  Briefcase,
  FileText,
  TrendingUp,
  ClipboardList,
  Eye,
  Plus,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 1, // Admin is at least 1
    totalCompanies: 0,
    totalJobs: 0,
    totalApplications: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      try {
        const [compRes, jobRes, appRes, usrRes] = await Promise.all([
          supabase.from("companies").select("*", { count: "exact", head: true }),
          supabase.from("jobs").select("*", { count: "exact", head: true }),
          supabase.from("applications").select("*", { count: "exact", head: true }),
          supabase.from("user_profiles").select("*", { count: "exact", head: true }),
        ]);

        setStats({
          totalUsers: usrRes.count || 0,
          totalCompanies: compRes.count || 0,
          totalJobs: jobRes.count || 0,
          totalApplications: appRes.count || 0,
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const statCards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "bg-sky-50 text-sky-600",
    },
    {
      label: "Total Companies",
      value: stats.totalCompanies,
      icon: Building2,
      color: "bg-violet-50 text-violet-600",
    },
    {
      label: "Total Jobs",
      value: stats.totalJobs,
      icon: Briefcase,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Applications",
      value: stats.totalApplications,
      icon: FileText,
      color: "bg-rose-50 text-rose-600",
    },
  ];

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
        <p className="text-slate-500">Welcome to your clean database environment.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Card key={card.label} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${card.color}`}>
                  <card.icon size={18} />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900">{card.value}</p>
              <p className="text-sm text-slate-500 mt-0.5">{card.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/companies/new">
              <Button variant="outline" size="sm" className="gap-2">
                <Plus size={14} /> Add Company
              </Button>
            </Link>
            <Link href="/admin/jobs/new">
              <Button variant="outline" size="sm" className="gap-2">
                <Plus size={14} /> Post Job
              </Button>
            </Link>
            <Link href="/admin/applications">
              <Button variant="outline" size="sm" className="gap-2">
                <Eye size={14} /> Review Applications
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
