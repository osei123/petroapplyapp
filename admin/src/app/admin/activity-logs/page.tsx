"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { activityLogs } from "@/lib/mock-data";
import { Building2, Briefcase, Users, FileText, Settings, ClipboardList } from "lucide-react";

const entityIcons: Record<string, React.ElementType> = {
  company: Building2,
  job: Briefcase,
  user: Users,
  application: FileText,
  settings: Settings,
  content_order: ClipboardList,
};

const entityColors: Record<string, string> = {
  company: "bg-violet-100 text-violet-600",
  job: "bg-sky-100 text-sky-600",
  user: "bg-amber-100 text-amber-600",
  application: "bg-emerald-100 text-emerald-600",
  settings: "bg-slate-100 text-slate-600",
  content_order: "bg-blue-100 text-blue-600",
};

export default function ActivityLogsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Activity Logs</h2>
        <p className="text-sm text-slate-500">Track all admin actions on the platform</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-50">
            {activityLogs.map((log) => {
              const Icon = entityIcons[log.entityType] || FileText;
              const color = entityColors[log.entityType] || "bg-slate-100 text-slate-600";
              return (
                <div key={log.id} className="flex items-start gap-4 p-5">
                  <div className={`p-2.5 rounded-xl shrink-0 ${color}`}>
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700">
                      <span className="font-semibold">{log.adminName}</span>{" "}
                      {log.action.toLowerCase()}
                    </p>
                    {log.metadata && (
                      <p className="text-xs text-slate-500 mt-0.5">{log.metadata}</p>
                    )}
                    <p className="text-xs text-slate-400 mt-1.5">
                      {new Date(log.createdAt).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <Badge variant="secondary" className="capitalize text-xs shrink-0">
                    {log.entityType.replace("_", " ")}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
