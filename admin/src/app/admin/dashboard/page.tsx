"use client";

import React from "react";
import Link from "next/link";
import {
  Users,
  Building2,
  Briefcase,
  FileText,
  TrendingUp,
  ArrowUpRight,
  ClipboardList,
  Eye,
  Plus,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  dashboardStats,
  applications,
  jobs,
  activityLogs,
} from "@/lib/mock-data";

const statCards = [
  {
    label: "Total Users",
    value: dashboardStats.totalUsers.toLocaleString(),
    change: `+${dashboardStats.monthlyGrowth.users}%`,
    icon: Users,
    color: "bg-sky-50 text-sky-600",
  },
  {
    label: "Active Users",
    value: dashboardStats.activeUsers.toLocaleString(),
    icon: TrendingUp,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    label: "Total Companies",
    value: dashboardStats.totalCompanies.toLocaleString(),
    icon: Building2,
    color: "bg-violet-50 text-violet-600",
  },
  {
    label: "Total Jobs",
    value: dashboardStats.totalJobs.toLocaleString(),
    change: `+${dashboardStats.monthlyGrowth.jobs}%`,
    icon: Briefcase,
    color: "bg-amber-50 text-amber-600",
  },
  {
    label: "Applications",
    value: dashboardStats.totalApplications.toLocaleString(),
    change: `+${dashboardStats.monthlyGrowth.applications}%`,
    icon: FileText,
    color: "bg-rose-50 text-rose-600",
  },
  {
    label: "Pending Orders",
    value: dashboardStats.pendingContentOrders.toLocaleString(),
    icon: ClipboardList,
    color: "bg-blue-50 text-blue-600",
  },
];

const STATUS_COLORS = ["#0ea5e9", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444", "#06b6d4"];

const pieData = Object.entries(dashboardStats.applicationsByStatus).map(
  ([key, value], i) => ({
    name: key.replace("_", " "),
    value,
    color: STATUS_COLORS[i],
  })
);

const statusBadgeVariant: Record<string, "default" | "secondary" | "destructive" | "success" | "warning" | "outline"> = {
  submitted: "secondary",
  under_review: "default",
  shortlisted: "warning",
  interview: "outline",
  rejected: "destructive",
  hired: "success",
};

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card) => (
          <Card key={card.label} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${card.color}`}>
                  <card.icon size={18} />
                </div>
                {card.change && (
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {card.change}
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold text-slate-900">{card.value}</p>
              <p className="text-sm text-slate-500 mt-0.5">{card.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Monthly Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboardStats.recentMonthlyApplications}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} />
                  <Tooltip
                    contentStyle={{
                      background: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
                    }}
                  />
                  <Bar dataKey="count" fill="#0ea5e9" radius={[8, 8, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Applications by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {pieData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-2 text-xs">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-slate-500 capitalize truncate">{entry.name}</span>
                  <span className="font-semibold text-slate-700 ml-auto">{entry.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">Recent Applications</CardTitle>
            <Link href="/admin/applications">
              <Button variant="ghost" size="sm" className="text-sky-600">
                View All <ArrowUpRight size={14} />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {applications.slice(0, 5).map((app) => (
                <div key={app.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600 shrink-0">
                      {app.userName.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{app.userName}</p>
                      <p className="text-xs text-slate-500 truncate">{app.jobTitle} · {app.companyName}</p>
                    </div>
                  </div>
                  <Badge variant={statusBadgeVariant[app.status] || "secondary"} className="capitalize shrink-0 ml-2">
                    {app.status.replace("_", " ")}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">Recent Activity</CardTitle>
            <Link href="/admin/activity-logs">
              <Button variant="ghost" size="sm" className="text-sky-600">
                View All <ArrowUpRight size={14} />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activityLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="flex items-start gap-3 py-2 border-b border-slate-50 last:border-0">
                  <div className="w-2 h-2 rounded-full bg-sky-400 mt-2 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-slate-700">
                      <span className="font-semibold">{log.adminName}</span>{" "}
                      {log.action.toLowerCase()}
                    </p>
                    {log.metadata && (
                      <p className="text-xs text-slate-500 mt-0.5 truncate">{log.metadata}</p>
                    )}
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(log.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
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
            <Link href="/admin/content-orders/new">
              <Button variant="outline" size="sm" className="gap-2">
                <Plus size={14} /> Create Order
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
