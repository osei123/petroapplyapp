"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Search, Eye, Pencil } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { contentOrders } from "@/lib/mock-data";

const priorityVariant: Record<string, "default" | "secondary" | "destructive" | "success" | "warning" | "outline"> = {
  low: "secondary", medium: "outline", high: "warning", urgent: "destructive",
};
const statusVariant: Record<string, "default" | "secondary" | "destructive" | "success" | "warning" | "outline"> = {
  pending: "secondary", in_progress: "default", review: "warning", completed: "success", cancelled: "destructive",
};

export default function ContentOrdersPage() {
  const [search, setSearch] = useState("");

  const filtered = contentOrders.filter((co) =>
    co.title.toLowerCase().includes(search.toLowerCase()) ||
    co.orderType.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Content Orders</h2>
          <p className="text-sm text-slate-500">{contentOrders.length} orders</p>
        </div>
        <Link href="/admin/content-orders/new">
          <Button className="gap-2"><Plus size={16} /> Create Order</Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input placeholder="Search orders..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.length === 0 ? (
            <TableRow><TableCell colSpan={7} className="text-center py-12 text-slate-400">No orders found.</TableCell></TableRow>
          ) : (
            filtered.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-semibold text-slate-900">{order.title}</TableCell>
                <TableCell><Badge variant="secondary" className="capitalize text-xs">{order.orderType.replace("_", " ")}</Badge></TableCell>
                <TableCell><Badge variant={priorityVariant[order.priority]} className="capitalize">{order.priority}</Badge></TableCell>
                <TableCell className="text-slate-600 text-sm">{order.dueDate}</TableCell>
                <TableCell className="text-slate-600 text-sm">{order.assignedTo || "—"}</TableCell>
                <TableCell><Badge variant={statusVariant[order.status]} className="capitalize">{order.status.replace("_", " ")}</Badge></TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Link href={`/admin/content-orders/${order.id}`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Eye size={14} /></Button>
                    </Link>
                    <Link href={`/admin/content-orders/${order.id}`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><Pencil size={14} /></Button>
                    </Link>
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
