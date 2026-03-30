"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Briefcase, Users, FileText, Settings, ClipboardList, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

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
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      try {
        const { data, error } = await supabase
          .from("activity_logs")
          .select(`*, user_profiles(full_name)`)
          .order("created_at", { ascending: false });

        if (data) {
          setLogs(data);
        }
      } catch (err) {
        console.error("Failed to fetch activity logs", err);
      } finally {
        setLoading(false);
      }
    }

    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Activity Logs</h2>
        <p className="text-sm text-slate-500">Track all admin actions on the platform</p>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-500">No activity logs found.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {logs.map((log) => {
                const entityType = log.entity_type || "user";
                const Icon = entityIcons[entityType] || FileText;
                const color = entityColors[entityType] || "bg-slate-100 text-slate-600";
                const adminName = log.user_profiles?.full_name || "Unknown Admin";

                return (
                  <div key={log.id} className="flex items-start gap-4 p-5">
                    <div className={`p-2.5 rounded-xl shrink-0 ${color}`}>
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-700">
                        <span className="font-semibold">{adminName}</span>{" "}
                        {log.action?.toLowerCase()}
                      </p>
                      {log.details && Object.keys(log.details).length > 0 && (
                        <p className="text-xs text-slate-500 mt-0.5">
                          {JSON.stringify(log.details)}
                        </p>
                      )}
                      <p className="text-xs text-slate-400 mt-1.5">
                        {new Date(log.created_at).toLocaleDateString("en-US", {
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
                      {entityType.replace("_", " ")}
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
