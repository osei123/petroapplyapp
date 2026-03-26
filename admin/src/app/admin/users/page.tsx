"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { users } from "@/lib/mock-data";

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const filtered = users.filter((u) => {
    const matchesSearch = u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.university.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">All Users</h2>
        <p className="text-sm text-slate-500">{users.length} registered users</p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input placeholder="Search users..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="flex gap-2">
              {["all", "student", "admin", "super_admin"].map((r) => (
                <button key={r} onClick={() => setRoleFilter(r)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    roleFilter === r ? "bg-sky-50 text-sky-700" : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                  }`}>
                  {r === "super_admin" ? "Super Admin" : r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>University</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Profile</TableHead>
            <TableHead>Apps</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.length === 0 ? (
            <TableRow><TableCell colSpan={8} className="text-center py-12 text-slate-400">No users found.</TableCell></TableRow>
          ) : (
            filtered.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {user.fullName.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{user.fullName}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-slate-600 text-sm">{user.university}</TableCell>
                <TableCell className="text-slate-600 text-sm">{user.country}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full bg-sky-500" style={{ width: `${user.profileCompletion}%` }} />
                    </div>
                    <span className="text-xs text-slate-500">{user.profileCompletion}%</span>
                  </div>
                </TableCell>
                <TableCell className="text-slate-600 text-sm">{user.applicationsCount}</TableCell>
                <TableCell>
                  <Badge variant={user.role === "super_admin" ? "default" : user.role === "admin" ? "outline" : "secondary"} className="capitalize text-xs">
                    {user.role.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.status === "active" ? "success" : user.status === "suspended" ? "destructive" : "warning"} className="capitalize">
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/admin/users/${user.id}`}>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Eye size={14} /></Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
