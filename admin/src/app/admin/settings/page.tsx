"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Bell, Shield, Briefcase, Globe, Palette } from "lucide-react";

const tabs = [
  { id: "general", label: "General", icon: Settings },
  { id: "branding", label: "Branding", icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "jobs", label: "Jobs & Applications", icon: Briefcase },
  { id: "security", label: "Security", icon: Shield },
  { id: "support", label: "Support & Contact", icon: Globe },
];

function Toggle({ label, description, defaultChecked = false }: { label: string; description: string; defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
      <div>
        <p className="text-sm font-medium text-slate-900">{label}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
      <button
        onClick={() => setChecked(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors ${checked ? "bg-sky-500" : "bg-slate-200"}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : ""}`} />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Platform Settings</h2>
        <p className="text-sm text-slate-500">Configure your platform preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tab Navigation */}
        <Card className="lg:w-64 shrink-0">
          <CardContent className="p-3">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    activeTab === tab.id ? "bg-sky-50 text-sky-700" : "text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </CardContent>
        </Card>

        {/* Content */}
        <div className="flex-1">
          {activeTab === "general" && (
            <Card>
              <CardHeader><CardTitle className="text-base">General Settings</CardTitle></CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div><Label>Platform Name</Label><Input defaultValue="PetroApply" className="mt-1.5" /></div>
                  <div><Label>Platform URL</Label><Input defaultValue="https://petroapply.com" className="mt-1.5" /></div>
                  <div><Label>Support Email</Label><Input defaultValue="support@petroapply.com" className="mt-1.5" /></div>
                  <div><Label>Default Language</Label>
                    <select className="flex h-11 w-full rounded-2xl border border-input bg-transparent px-4 py-2 text-sm shadow-sm mt-1.5">
                      <option>English</option><option>French</option><option>Arabic</option>
                    </select>
                  </div>
                </div>
                <Toggle label="Maintenance Mode" description="Put the platform in maintenance mode" />
                <Toggle label="Public Registration" description="Allow new users to register" defaultChecked />
                <Button className="mt-2">Save Changes</Button>
              </CardContent>
            </Card>
          )}

          {activeTab === "branding" && (
            <Card>
              <CardHeader><CardTitle className="text-base">Branding</CardTitle></CardHeader>
              <CardContent className="space-y-5">
                <div><Label>Brand Color</Label><div className="flex gap-3 mt-1.5"><Input defaultValue="#0ea5e9" className="w-32" /><div className="w-11 h-11 rounded-2xl bg-sky-500 border border-slate-200" /></div></div>
                <div><Label>Logo Upload</Label><div className="mt-1.5 border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center"><p className="text-sm text-slate-500">Upload logo (PNG, SVG)</p></div></div>
                <div><Label>Favicon</Label><div className="mt-1.5 border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center"><p className="text-sm text-slate-500">Upload favicon (ICO, PNG)</p></div></div>
                <Button>Save Branding</Button>
              </CardContent>
            </Card>
          )}

          {activeTab === "notifications" && (
            <Card>
              <CardHeader><CardTitle className="text-base">Notification Settings</CardTitle></CardHeader>
              <CardContent>
                <Toggle label="Email Notifications" description="Send email notifications to users" defaultChecked />
                <Toggle label="Application Status Updates" description="Notify students when application status changes" defaultChecked />
                <Toggle label="New Job Alerts" description="Send alerts when new jobs are posted" defaultChecked />
                <Toggle label="Deadline Reminders" description="Send reminders before application deadlines" defaultChecked />
                <Toggle label="Admin Activity Alerts" description="Notify admins about important platform activity" />
                <Button className="mt-4">Save Notification Settings</Button>
              </CardContent>
            </Card>
          )}

          {activeTab === "jobs" && (
            <Card>
              <CardHeader><CardTitle className="text-base">Jobs & Application Settings</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <Toggle label="Allow Internal Applications" description="Allow students to apply directly through the platform" defaultChecked />
                <Toggle label="Allow External Applications" description="Allow redirects to external career pages" defaultChecked />
                <Toggle label="Require Resume" description="Require resume upload for all applications" defaultChecked />
                <Toggle label="Allow Cover Letter" description="Allow optional cover letter with applications" defaultChecked />
                <Toggle label="Featured Jobs" description="Enable featured job highlighting" defaultChecked />
                <div className="pt-2"><Label>Max Applications Per User Per Day</Label><Input type="number" defaultValue="10" className="mt-1.5 w-32" /></div>
                <Button className="mt-2">Save Settings</Button>
              </CardContent>
            </Card>
          )}

          {activeTab === "security" && (
            <Card>
              <CardHeader><CardTitle className="text-base">Security Settings</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <Toggle label="Two-Factor Authentication" description="Require 2FA for admin accounts" />
                <Toggle label="Session Timeout" description="Auto-logout after 30 minutes of inactivity" defaultChecked />
                <Toggle label="IP Whitelisting" description="Restrict admin access to specific IP addresses" />
                <Toggle label="Audit Logging" description="Log all admin actions for security review" defaultChecked />
                <div className="pt-2"><Label>Session Timeout Duration (minutes)</Label><Input type="number" defaultValue="30" className="mt-1.5 w-32" /></div>
                <Button className="mt-2">Save Security Settings</Button>
              </CardContent>
            </Card>
          )}

          {activeTab === "support" && (
            <Card>
              <CardHeader><CardTitle className="text-base">Support & Contact</CardTitle></CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div><Label>Contact Email</Label><Input defaultValue="contact@petroapply.com" className="mt-1.5" /></div>
                  <div><Label>Phone Number</Label><Input defaultValue="+1 (555) 123-4567" className="mt-1.5" /></div>
                  <div><Label>Help Desk URL</Label><Input defaultValue="https://help.petroapply.com" className="mt-1.5" /></div>
                  <div><Label>Social Media - LinkedIn</Label><Input defaultValue="https://linkedin.com/company/petroapply" className="mt-1.5" /></div>
                </div>
                <Button>Save Contact Info</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
