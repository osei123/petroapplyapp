"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, Eye, Pencil, Trash2, ClipboardList, Loader2 } from "lucide-react";
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
import { supabase } from "@/lib/supabase/client";

export default function ContentOrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    const { data, error } = await supabase
      .from("content_orders")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Failed to load content orders", error);
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this content order?")) return;
    const { error } = await supabase.from("content_orders").delete().eq("id", id);
    if (error) {
      alert("Failed to delete order");
    } else {
      setOrders(orders.filter((o) => o.id !== id));
    }
  }

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.title?.toLowerCase().includes(search.toLowerCase()) ||
      o.assigned_to?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-rose-100 text-rose-700 hover:bg-rose-100";
      case "high": return "bg-orange-100 text-orange-700 hover:bg-orange-100";
      case "medium": return "bg-amber-100 text-amber-700 hover:bg-amber-100";
      default: return "bg-emerald-100 text-emerald-700 hover:bg-emerald-100";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-emerald-100 text-emerald-700";
      case "in_progress": return "bg-sky-100 text-sky-700";
      default: return "bg-slate-100 text-slate-700"; // pending
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Content Orders</h2>
          <p className="text-sm text-slate-500">Manage internal content tasks and assignments</p>
        </div>
        <Link href="/admin/content-orders/new">
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
            <Plus size={16} /> New Order
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
                placeholder="Search orders..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {["all", "pending", "in_progress", "completed"].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize ${
                    statusFilter === s
                      ? "bg-blue-50 text-blue-700"
                      : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  {s.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-visible">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[300px]">Task Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-48 text-center">
                  <Loader2 className="h-6 w-6 animate-spin text-slate-400 mx-auto" />
                </TableCell>
              </TableRow>
            ) : filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <ClipboardList className="h-10 w-10 text-slate-300" />
                    <p>No content orders found.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id} className="cursor-pointer hover:bg-slate-50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                        <ClipboardList size={18} />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 line-clamp-1">{order.title}</p>
                        <p className="text-xs text-slate-500 line-clamp-1">{order.description}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize text-slate-600 font-medium">
                      {order.order_type.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-600 font-medium">{order.assigned_to || "Unassigned"}</TableCell>
                  <TableCell>
                    <Badge className={`capitalize shadow-none ${getPriorityColor(order.priority)}`}>
                      {order.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`capitalize border-none shadow-none ${getStatusColor(order.status)}`}>
                      {order.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-500 font-medium whitespace-nowrap">
                    {order.due_date ? new Date(order.due_date).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Link href={`/admin/content-orders/${order.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900">
                          <Eye size={16} />
                        </Button>
                      </Link>
                      <Link href={`/admin/content-orders/${order.id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600">
                          <Pencil size={16} />
                        </Button>
                      </Link>
                      <Button onClick={() => handleDelete(order.id)} variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
