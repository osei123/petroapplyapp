"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { contentOrders } from "@/lib/mock-data";

const priorityVariant: Record<string, "default" | "secondary" | "destructive" | "warning" | "outline"> = {
  low: "secondary", medium: "outline", high: "warning", urgent: "destructive",
};
const statusVariant: Record<string, "default" | "secondary" | "destructive" | "success" | "warning"> = {
  pending: "secondary", in_progress: "default", review: "warning", completed: "success", cancelled: "destructive",
};

export default function ContentOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const order = contentOrders.find((co) => co.id === params.id);

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg font-semibold text-slate-700">Order not found</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push("/admin/content-orders")}>Back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors">
        <ArrowLeft size={16} /> Back to Content Orders
      </button>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">{order.title}</h2>
              <div className="flex gap-2 mt-2">
                <Badge variant={priorityVariant[order.priority] || "secondary"} className="capitalize">{order.priority}</Badge>
                <Badge variant={statusVariant[order.status] || "secondary"} className="capitalize">{order.status.replace("_", " ")}</Badge>
                <Badge variant="secondary" className="capitalize text-xs">{order.orderType.replace("_", " ")}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Description</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 leading-relaxed">{order.description}</p>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Due Date</p>
                <p className="text-sm text-slate-700 mt-0.5">{order.dueDate}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Assigned To</p>
                <p className="text-sm text-slate-700 mt-0.5">{order.assignedTo || "Unassigned"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Created By</p>
                <p className="text-sm text-slate-700 mt-0.5">{order.createdBy}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Created</p>
                <p className="text-sm text-slate-700 mt-0.5">{order.createdAt}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Update Order</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Status</Label>
              <select defaultValue={order.status} className="flex h-11 w-full rounded-2xl border border-input bg-transparent px-4 py-2 text-sm shadow-sm mt-1.5">
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Review</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <Label>Assigned To</Label>
              <Input defaultValue={order.assignedTo || ""} placeholder="Team or person" className="mt-1.5" />
            </div>
            <div>
              <Label>Notes</Label>
              <textarea rows={3} placeholder="Internal notes..." className="flex w-full rounded-2xl border border-input bg-transparent px-4 py-3 text-sm shadow-sm mt-1.5 resize-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
            </div>
            <Button className="w-full">Update Order</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
