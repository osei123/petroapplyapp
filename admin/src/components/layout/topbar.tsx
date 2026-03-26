"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const pageTitles: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/companies": "Companies",
  "/admin/jobs": "Jobs",
  "/admin/users": "Users",
  "/admin/applications": "Applications",
  "/admin/content-orders": "Content Orders",
  "/admin/settings": "Settings",
  "/admin/activity-logs": "Activity Logs",
};

function getPageTitle(pathname: string): string {
  // Exact match
  if (pageTitles[pathname]) return pageTitles[pathname];
  // Check if it starts with a known path
  for (const [path, title] of Object.entries(pageTitles)) {
    if (pathname.startsWith(path + "/")) return title;
  }
  return "Admin";
}

export function Topbar() {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <header className="flex items-center justify-between px-8 h-16 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-30">
      {/* Page Title */}
      <h1 className="text-xl font-bold text-slate-900">{title}</h1>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search..."
            className="pl-9 w-64 h-9 rounded-full bg-slate-50 border-slate-100"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-full hover:bg-slate-50 transition-colors">
          <Bell size={20} className="text-slate-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-sky-500 rounded-full" />
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
            PA
          </div>
          <div className="hidden lg:block">
            <p className="text-sm font-semibold text-slate-900 leading-tight">Platform Admin</p>
            <p className="text-xs text-slate-500">Super Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
