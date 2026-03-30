import React from "react";
import Link from "next/link";
import { ArrowRight, Briefcase, FileText, Globe2, Network, ShieldCheck, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-sky-200">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-blue-800">
              PetroApply
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors hidden sm:block">
              Admin Portal
            </Link>
            <Link 
              href="/login"
              className="px-5 py-2 rounded-full text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-sky-200/50 blur-[120px] rounded-full -z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-200/40 blur-[100px] rounded-full -z-10 pointer-events-none" />
        
        <div className="max-w-5xl mx-auto px-6 text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100/80 border border-sky-200 text-sky-700 text-sm font-semibold mb-4 mx-auto">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
            The Future of Petroleum Recruitment
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-black text-slate-900 tracking-tight leading-[1.1]">
            Accelerate your career in energy with <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-500 via-blue-600 to-violet-600">PetroApply.</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-600 leading-relaxed font-medium">
            The world's first dedicated platform connecting top-tier engineering talent directly with elite global petroleum enterprises. Experience frictionless hiring.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold text-lg hover:shadow-xl hover:shadow-blue-500/20 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
              Download the App <ArrowRight size={20} />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-slate-900 border border-slate-200 font-bold text-lg hover:bg-slate-50 transition-all shadow-sm">
              For Employers
            </button>
          </div>
        </div>
      </div>

      {/* Product Dashboard Preview (Mockup Area) */}
      <div className="max-w-7xl mx-auto px-6 relative -mt-4 pb-20">
        <div className="rounded-2xl border border-slate-200/60 bg-white/50 backdrop-blur-xl shadow-2xl overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-t from-white/90 to-transparent z-10 sm:hidden" />
          <div className="h-12 border-b border-slate-100 bg-slate-50/50 flex items-center px-4 gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <div className="w-3 h-3 rounded-full bg-emerald-400" />
            <div className="mx-auto px-4 py-1 rounded-md bg-white text-xs text-slate-400 font-medium shadow-sm border border-slate-100">
              admin.petroapply.com
            </div>
          </div>
          <div className="p-8 grid grid-cols-1 sm:grid-cols-3 gap-6 bg-slate-50/30">
            {/* Mock Dashboard UI */}
            <div className="col-span-2 space-y-4">
              <div className="h-6 w-48 bg-slate-200 rounded-md mb-8 animate-pulse" />
              <div className="grid grid-cols-2 gap-4">
                 <div className="h-32 bg-white rounded-xl border border-slate-100 shadow-sm p-4 space-y-3">
                   <div className="w-8 h-8 rounded-full bg-sky-100" />
                   <div className="h-4 w-24 bg-slate-100 rounded" />
                   <div className="h-8 w-16 bg-slate-200 rounded" />
                 </div>
                 <div className="h-32 bg-white rounded-xl border border-slate-100 shadow-sm p-4 space-y-3">
                   <div className="w-8 h-8 rounded-full bg-violet-100" />
                   <div className="h-4 w-24 bg-slate-100 rounded" />
                   <div className="h-8 w-16 bg-slate-200 rounded" />
                 </div>
              </div>
              <div className="h-48 bg-white rounded-xl border border-slate-100 shadow-sm w-full" />
            </div>
            <div className="space-y-4">
              <div className="h-6 w-32 bg-slate-200 rounded-md mb-8 animate-pulse" />
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-white rounded-xl border border-slate-100 shadow-sm flex items-center px-4 gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100" />
                  <div className="space-y-2 flex-1">
                    <div className="h-3 w-full bg-slate-100 rounded" />
                    <div className="h-2 w-2/3 bg-slate-50 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-white py-24 sm:py-32 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              An ecosystem designed for scale.
            </h2>
            <p className="text-slate-500 text-lg">
              Whether you're a recent graduate or a multinational corporation, PetroApply provides the infrastructure required to make meaningful connections instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Globe2,
                title: "Global Reach",
                desc: "Discover remote, offshore, and domestic roles across continents spanning the entire petroleum lifecycle.",
                color: "text-blue-600",
                bg: "bg-blue-50"
              },
              {
                icon: Network,
                title: "Smart Matching",
                desc: "Our proprietary algorithm surfaces candidates based on precise certifications, experience, and mobility.",
                color: "text-violet-600",
                bg: "bg-violet-50"
              },
              {
                icon: FileText,
                title: "Resume Vault",
                desc: "Securely store multiple CV variations and attach the perfect one instantly with a single tap.",
                color: "text-indigo-600",
                bg: "bg-indigo-50"
              },
              {
                icon: ShieldCheck,
                title: "Bank-Grade Security",
                desc: "Powered by Supabase RLS and Auth, ensuring that every applicant's PII remains completely private.",
                color: "text-emerald-600",
                bg: "bg-emerald-50"
              },
              {
                icon: Briefcase,
                title: "Seamless Applications",
                desc: "Internal screening pipelines that allow companies to process thousands of applications effortlessly.",
                color: "text-sky-600",
                bg: "bg-sky-50"
              },
              {
                icon: Zap,
                title: "Real-time Updates",
                desc: "Instant push notifications and live activity logs keep everyone in the loop 24/7.",
                color: "text-rose-600",
                bg: "bg-rose-50"
              }
            ].map((feature, idx) => (
              <div key={idx} className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 \${feature.bg} \${feature.color}`}>
                  <feature.icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed font-medium">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-4 gap-8">
          <div className="col-span-1 sm:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <Zap size={20} className="text-sky-500" />
              <span className="text-xl font-bold text-white tracking-tight">PetroApply</span>
            </div>
            <p className="text-sm max-w-sm">
              Empowering the energy sector with next-generation recruitment tools and seamless applicant tracking architectures.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">Student Mobile App</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Employer Dashboard</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Security & Privacy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="/" className="hover:text-white transition-colors">Contact Support</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-800 text-xs text-center sm:text-left flex flex-col sm:flex-row items-center justify-between">
          <p>© {new Date().getFullYear()} PetroApply Inc. All rights reserved.</p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <Link href="/" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/" className="hover:text-white transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
