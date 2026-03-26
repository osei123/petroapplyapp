"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function NewContentOrderPage() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/admin/content-orders");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors">
        <ArrowLeft size={16} /> Back to Content Orders
      </button>
      <div>
        <h2 className="text-lg font-bold text-slate-900">Create Content Order</h2>
        <p className="text-sm text-slate-500">Fill in the details for the new content order.</p>
      </div>
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input id="title" placeholder="e.g. Weekly Blog Post" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="orderType">Order Type</Label>
                <select id="orderType" className="flex h-11 w-full rounded-2xl border border-input bg-transparent px-4 py-2 text-sm shadow-sm mt-1.5">
                  <option value="blog_post">Blog Post</option>
                  <option value="job_description">Job Description</option>
                  <option value="company_profile">Company Profile</option>
                  <option value="social_media">Social Media</option>
                  <option value="email_template">Email Template</option>
                </select>
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <select id="priority" className="flex h-11 w-full rounded-2xl border border-input bg-transparent px-4 py-2 text-sm shadow-sm mt-1.5">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input id="dueDate" type="date" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="assignedTo">Assigned To</Label>
                <Input id="assignedTo" placeholder="e.g. Content Team" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <select id="status" className="flex h-11 w-full rounded-2xl border border-input bg-transparent px-4 py-2 text-sm shadow-sm mt-1.5">
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="review">Review</option>
                </select>
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <textarea id="description" rows={4} className="flex w-full rounded-2xl border border-input bg-transparent px-4 py-3 text-sm shadow-sm mt-1.5 resize-none placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" placeholder="Describe the content requirement..." />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit">Create Order</Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
