"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Search, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase/client";

const pageTitles: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/companies": "Companies",
  "/admin/jobs": "Jobs",
  "/admin/users": "Users",
  "/admin/applications": "Applications",
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
  const router = useRouter();

  const [adminProfile, setAdminProfile] = React.useState<any>(null);
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const [showNotifications, setShowNotifications] = React.useState(false);

  const fetchNotifications = async (userId: string) => {
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10);
    if (data) setNotifications(data);
  };

  React.useEffect(() => {
    async function fetchAdmin() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        if (profile) setAdminProfile(profile);
        fetchNotifications(user.id);
      }
    }
    fetchAdmin();
  }, []);

  const markAllAsRead = async () => {
    if (!adminProfile) return;
    await supabase.from("notifications").update({ read: true }).eq("user_id", adminProfile.id).eq("read", false);
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const clearAll = async () => {
    if (!adminProfile) return;
    const confirmed = window.confirm("Are you sure you want to clear all notifications?");
    if (!confirmed) return;
    await supabase.from("notifications").delete().eq("user_id", adminProfile.id);
    setNotifications([]);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const initials = adminProfile?.full_name 
    ? adminProfile.full_name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase()
    : "PA";

  const unreadCount = notifications.filter(n => !n.read).length;

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
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-full hover:bg-slate-50 transition-colors"
          >
            <Bell size={20} className="text-slate-500" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden z-50">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-900">Notifications</h3>
                <div className="flex items-center gap-3">
                  {notifications.length > 0 && (
                    <button onClick={clearAll} className="text-xs text-red-500 font-medium hover:text-red-600 transition-colors">
                      Clear all
                    </button>
                  )}
                  {unreadCount > 0 && (
                    <button onClick={markAllAsRead} className="text-xs text-sky-600 font-medium hover:text-sky-700 transition-colors">
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell size={32} className="text-slate-200 mx-auto mb-3" />
                    <p className="text-sm font-medium text-slate-900">No new notifications</p>
                    <p className="text-xs text-slate-500 mt-1">You're all caught up!</p>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    {notifications.map((notif) => (
                      <div key={notif.id} className={`p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors ${!notif.read ? 'bg-sky-50/50' : ''}`}>
                        <div className="flex justify-between items-start mb-1">
                          <p className={`text-sm ${!notif.read ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>{notif.title}</p>
                          {!notif.read && <span className="w-2 h-2 rounded-full bg-sky-500 mt-1 shrink-0" />}
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">{notif.body}</p>
                        <p className="text-[10px] text-slate-400 mt-2">
                          {new Date(notif.created_at).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
            {initials}
          </div>
          <div className="hidden lg:block">
            <p className="text-sm font-semibold text-slate-900 leading-tight">
              {adminProfile?.full_name || "Platform Admin"}
            </p>
            <p className="text-xs text-slate-500">
              {adminProfile?.email || "Admin Access"}
            </p>
          </div>
          <button 
            onClick={handleLogout} 
            className="ml-2 p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors" 
            title="Log out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
