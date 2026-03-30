"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase/client";

export default function NewContentOrderPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    order_type: "article",
    priority: "medium",
    assigned_to: "",
    due_date: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert("Task title is required.");
      return;
    }

    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();

    const { data: newOrder, error } = await supabase
      .from("content_orders")
      .insert([
        {
          title: formData.title,
          description: formData.description,
          order_type: formData.order_type,
          priority: formData.priority,
          assigned_to: formData.assigned_to,
          due_date: formData.due_date || null,
          status: "pending"
        },
      ])
      .select()
      .single();

    if (error) {
      alert(error.message);
    } else {
      if (userData.user && newOrder) {
        await supabase.from("activity_logs").insert({
          user_id: userData.user.id,
          entity_type: "content_order",
          entity_id: newOrder.id,
          action: "Created new content order",
          details: { title: newOrder.title }
        });
      }
      router.push("/admin/content-orders");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Content Orders
      </button>

      <div>
        <h2 className="text-lg font-bold text-slate-900">Add New Content Order</h2>
        <p className="text-sm text-slate-500">Create a new task assignment for the internal content team.</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="title">Task Title *</Label>
              <Input 
                id="title" 
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Write a blog post about Deepwater Drilling" 
                className="mt-1.5" 
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <Label htmlFor="order_type">Content Type</Label>
                <select
                  id="order_type"
                  value={formData.order_type}
                  onChange={handleChange}
                  className="flex w-full rounded-2xl border border-input bg-transparent px-4 py-2 text-sm shadow-sm mt-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="article">Article / Blog Post</option>
                  <option value="video">Video Production</option>
                  <option value="social_media">Social Media Post</option>
                  <option value="newsletter">Newsletter</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="priority">Priority Level</Label>
                <select
                  id="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="flex w-full rounded-2xl border border-input bg-transparent px-4 py-2 text-sm shadow-sm mt-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <Label htmlFor="assigned_to">Assignee Name</Label>
                <Input 
                  id="assigned_to" 
                  value={formData.assigned_to}
                  onChange={handleChange}
                  placeholder="e.g. John Doe" 
                  className="mt-1.5" 
                />
              </div>

              <div>
                <Label htmlFor="due_date">Due Date</Label>
                <Input 
                  id="due_date" 
                  type="date"
                  value={formData.due_date}
                  onChange={handleChange}
                  className="mt-1.5" 
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Task Details & Brief</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                className="flex w-full rounded-2xl border border-input bg-transparent px-4 py-3 text-sm shadow-sm mt-1.5 resize-none placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Provide detailed instructions, references, or context for this assignment..."
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                Create Order
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
