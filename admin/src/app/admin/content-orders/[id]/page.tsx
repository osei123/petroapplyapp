"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Calendar, User, AlignLeft, CheckCircle2, Clock, MapPin, Tag, Flag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase/client";

export default function ContentOrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function fetchOrder() {
      const { data, error } = await supabase
        .from("content_orders")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error) {
        console.error("Failed to load content order details", error);
        router.push("/admin/content-orders");
      } else {
        setOrder(data);
      }
      setLoading(false);
    }
    fetchOrder();
  }, [params.id, router]);

  const updateStatus = async (newStatus: string) => {
    setUpdating(true);
    const { error } = await supabase
      .from("content_orders")
      .update({ status: newStatus })
      .eq("id", order.id);

    if (error) {
      alert(error.message);
    } else {
      setOrder({ ...order, status: newStatus });

      // Log the activity
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) {
        await supabase.from("activity_logs").insert({
          user_id: userData.user.id,
          entity_type: "content_order",
          entity_id: order.id,
          action: "Updated content order status",
          details: { status: newStatus }
        });
      }
    }
    setUpdating(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!order) return null;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-rose-100 text-rose-700";
      case "high": return "bg-orange-100 text-orange-700";
      case "medium": return "bg-amber-100 text-amber-700";
      default: return "bg-emerald-100 text-emerald-700";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-emerald-100 text-emerald-700";
      case "in_progress": return "bg-sky-100 text-sky-700";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Orders
      </button>

      {/* Header Profile */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge className={`capitalize shadow-none ${getStatusColor(order.status)}`}>
                  {order.status.replace("_", " ")}
                </Badge>
                <Badge variant="outline" className="capitalize text-slate-600">
                  {order.order_type.replace("_", " ")}
                </Badge>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">{order.title}</h2>
              <p className="text-sm text-slate-500 mt-2">
                Created on {new Date(order.created_at).toLocaleDateString()}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant={order.status === "in_progress" ? "default" : "outline"}
                className={order.status === "in_progress" ? "bg-sky-600 hover:bg-sky-700 text-white" : ""}
                size="sm"
                onClick={() => updateStatus("in_progress")}
                disabled={order.status === "in_progress" || updating}
              >
                <Clock size={16} className="mr-2" /> Mark In Progress
              </Button>
              <Button
                variant={order.status === "completed" ? "default" : "outline"}
                className={order.status === "completed" ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""}
                size="sm"
                onClick={() => updateStatus("completed")}
                disabled={order.status === "completed" || updating}
              >
                <CheckCircle2 size={16} className="mr-2" /> Mark Completed
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-base flex items-center gap-2 text-slate-800">
                <AlignLeft size={18} className="text-slate-400" />
                Task Description & Brief
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="prose prose-sm text-slate-600">
                {order.description ? (
                  <p className="whitespace-pre-wrap">{order.description}</p>
                ) : (
                  <p className="italic text-slate-400">No detailed brief provided for this order.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-base text-slate-800">Assignment Details</CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Assigned To
                </p>
                <div className="flex items-center gap-2">
                  <User size={16} className="text-slate-400" />
                  <span className="text-sm font-medium text-slate-800">
                    {order.assigned_to || "Unassigned"}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Priority level
                </p>
                <div className="flex items-center gap-2">
                  <Flag size={16} className="text-slate-400" />
                  <Badge className={`capitalize shadow-none ${getPriorityColor(order.priority)}`}>
                    {order.priority}
                  </Badge>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Due Date
                </p>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-slate-400" />
                  <span className="text-sm font-medium text-slate-800">
                    {order.due_date ? new Date(order.due_date).toLocaleDateString() : "No Deadline"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
