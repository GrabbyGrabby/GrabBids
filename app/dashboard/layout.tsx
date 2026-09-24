"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BrainCircuit, Search, Plus, Home, Terminal, FileText, 
  Tags, Share2, Activity, Users, Plug, Download, HelpCircle, FileJson, 
  MoreHorizontal
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: "Overview", href: "/dashboard", icon: Home },
  { name: "Playground", href: "/dashboard/playground", icon: Terminal },
  { name: "Documents", href: "/dashboard/documents", icon: FileText },
  { name: "Container Tags", href: "/dashboard/tags", icon: Tags },
  { name: "Memory Graph", href: "/dashboard/graph", icon: Share2 },
  { name: "Requests", href: "/dashboard/requests", icon: Activity },
];

const analyticsItems = [
  { name: "User Insights", href: "/dashboard/insights", icon: Users },
];

const dataItems = [
  { name: "Connectors", href: "/dashboard/connectors", icon: Plug },
  { name: "Import", href: "/dashboard/import", icon: Download },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-[#0A0A0A] text-gray-400 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-[260px] flex-shrink-0 flex flex-col border-r border-white/5 bg-[#0A0A0A]">
        {/* Header */}
        <div className="p-4 flex items-center gap-2 text-white">
          <BrainCircuit className="w-5 h-5" />
          <span className="font-semibold tracking-tight text-lg">grafz™</span>
        </div>

        {/* Scrollable Nav */}
        <div className="flex-1 overflow-y-auto py-2 px-3 space-y-6">
          
          {/* Actions */}
          <div className="space-y-2">
            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-gray-300 hover:bg-white/5 rounded-md transition-colors">
              <Search className="w-4 h-4" />
              <span>Search...</span>
              <span className="ml-auto text-xs bg-white/10 px-1.5 py-0.5 rounded border border-white/10">⌘K</span>
            </button>
            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-md transition-colors">
              <Plus className="w-4 h-4" />
              <span>Create API key</span>
            </button>
          </div>

          {/* Main Nav */}
          <nav className="space-y-0.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors group",
                    isActive 
                      ? "bg-blue-600/10 text-blue-400 font-medium" 
                      : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                  )}
                >
                  <item.icon className={cn("w-4 h-4", isActive ? "text-blue-400" : "text-gray-500 group-hover:text-gray-400")} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Analytics Nav */}
          <div>
            <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-600">Analytics</div>
            <nav className="space-y-0.5">
              {analyticsItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center justify-between px-3 py-2 text-sm rounded-lg text-gray-400 hover:text-gray-200 hover:bg-white/5 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-4 h-4 text-gray-500 group-hover:text-gray-400" />
                    {item.name}
                  </div>
                  <div className="w-2 h-2 rounded-full bg-transparent group-hover:bg-gray-600/30 border border-gray-600 flex items-center justify-center">
                    <div className="w-1 h-1 bg-gray-500 rounded-full" />
                  </div>
                </Link>
              ))}
            </nav>
          </div>

          {/* Data Nav */}
          <div>
            <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-600">Data</div>
            <nav className="space-y-0.5">
              {dataItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg text-gray-400 hover:text-gray-200 hover:bg-white/5 transition-colors group"
                >
                  <item.icon className="w-4 h-4 text-gray-500 group-hover:text-gray-400" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Footer Area */}
        <div className="p-4 border-t border-white/5 space-y-4">
          <div className="bg-gradient-to-r from-blue-900/20 to-transparent p-3 rounded-xl border border-blue-900/30 cursor-pointer hover:bg-blue-900/30 transition-colors">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-white">What's new</span>
              <span className="text-[10px] text-gray-500">5 Sept</span>
            </div>
            <div className="text-sm text-gray-300 font-medium mb-1">Buy credits in one step</div>
            <div className="text-xs text-gray-500 leading-snug">Pick an amount and pay with your saved card without leaving Billing.</div>
          </div>
          
          <div className="flex items-center justify-between px-2 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded bg-blue-900/50 flex items-center justify-center text-blue-400 font-semibold text-xs">TC</div>
              <span className="text-sm font-medium text-gray-200">thedead Curse</span>
            </div>
            <MoreHorizontal className="w-4 h-4 text-gray-500" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0A0A0A]">
        {/* Topbar */}
        <header className="h-14 flex-shrink-0 flex items-center justify-between px-6">
          <div className="flex items-center gap-2 bg-[#121212] px-3 py-1.5 rounded-full border border-white/10 text-sm cursor-pointer hover:bg-white/5 transition-colors">
            <div className="w-4 h-4 bg-blue-500 rounded-sm flex items-center justify-center text-[10px] text-white font-bold">G</div>
            <span className="text-gray-200 font-medium">Grabby</span>
            <span className="text-[10px] uppercase bg-white/10 px-1.5 py-0.5 rounded text-gray-400">Free</span>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium">
            <button className="text-gray-400 hover:text-gray-200 transition-colors">Help</button>
            <button className="text-gray-400 hover:text-gray-200 transition-colors">Docs ↗</button>
          </div>
        </header>

        {/* Page Content Container */}
        <div className="flex-1 overflow-auto p-2">
          <div className="bg-[#121212] border border-white/5 rounded-2xl min-h-full p-8 md:p-12 relative overflow-hidden">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
