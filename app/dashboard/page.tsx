"use client";

import React, { useState } from "react";
import { Copy, Terminal, Check, ArrowRight, Play, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

const editors = ["Claude Code", "Cursor", "Codex", "OpenCode", "Amp", "OpenClaw", "Hermes"];

export default function DashboardOverviewPage() {
  const [activeEditor, setActiveEditor] = useState("Claude Code");
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col relative z-10">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 mb-16 flex-1">
        
        {/* Left Column */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-6">
            {/* Tiny app icons */}
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-md bg-[#1E1E1E] border border-white/10 flex items-center justify-center">
                <Terminal className="w-4 h-4 text-gray-400" />
              </div>
              <div className="w-8 h-8 rounded-md bg-[#1E1E1E] border border-white/10 flex items-center justify-center">
                <div className="w-4 h-4 bg-gray-400 rounded-sm" />
              </div>
              <div className="w-8 h-8 rounded-md bg-[#1E1E1E] border border-white/10 flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-gray-400 rounded-full" />
              </div>
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
            Connect your tools
          </h1>
          <p className="text-gray-400 text-base md:text-lg mb-8 max-w-sm">
            One command installs the plugin for every editor you use.
          </p>

          <div 
            onClick={() => handleCopy("npx grafz plugin")}
            className="group flex items-center justify-between bg-[#0A0A0A] border border-white/10 rounded-xl p-4 cursor-pointer hover:border-white/20 transition-all mb-8 w-full max-w-sm"
          >
            <code className="text-gray-300 font-mono text-sm">npx grafz plugin</code>
            {copied ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4 text-gray-500 group-hover:text-gray-300 transition-colors" />
            )}
          </div>

          <div className="flex gap-6 text-sm font-medium">
            <button className="text-gray-400 hover:text-white transition-colors flex items-center gap-1">
              Connect over MCP <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button className="text-gray-400 hover:text-white transition-colors flex items-center gap-1">
              Building with the API? <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col justify-center">
          <p className="text-sm text-gray-400 mb-4">Or set one up by hand</p>
          
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {editors.map((editor) => (
              <button
                key={editor}
                onClick={() => setActiveEditor(editor)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-all flex items-center gap-2 ${
                  activeEditor === editor
                    ? "bg-[#1E1E1E] text-white border border-white/10"
                    : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                }`}
              >
                {editor === "Claude Code" && <div className="w-3 h-3 text-orange-500 text-xs font-bold leading-none">✻</div>}
                {editor}
              </button>
            ))}
          </div>

          <div className="space-y-6">
            <div>
              <div className="text-sm text-gray-300 mb-3">1. Add the marketplace</div>
              <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-4">
                <code className="text-gray-400 font-mono text-sm block overflow-x-auto">
                  /plugin marketplace add grafzai/claude-grafz
                </code>
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-300 mb-3">2. Install</div>
              <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-4 mb-2">
                <code className="text-gray-400 font-mono text-sm">
                  /plugin install grafz
                </code>
              </div>
              <p className="text-sm text-gray-500">
                Restart Claude Code and it opens your browser to sign in.
              </p>
            </div>

            <div className="h-px bg-white/5 w-full my-6" />

            <div>
              <div className="text-sm text-gray-300 mb-3">Check it worked</div>
              <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-4 mb-2">
                <code className="text-gray-400 font-mono text-sm">
                  what do you remember about me?
                </code>
              </div>
              <button className="text-sm text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1">
                Claude Code docs <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Explore Section */}
      <div className="mt-auto">
        <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Explore</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-[#0A0A0A] border border-white/5 hover:border-white/10 transition-colors rounded-xl p-5 cursor-pointer group flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Play className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                <h3 className="text-sm font-medium text-gray-200">Live Demo</h3>
              </div>
              <p className="text-xs text-gray-500">See grafz in action</p>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 self-end mt-4 transition-colors" />
          </div>

          <div className="bg-[#0A0A0A] border border-white/5 hover:border-white/10 transition-colors rounded-xl p-5 cursor-pointer group flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Terminal className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                <h3 className="text-sm font-medium text-gray-200">Playground</h3>
              </div>
              <p className="text-xs text-gray-500">Test the API interactively</p>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 self-end mt-4 transition-colors" />
          </div>

          <div className="bg-[#0A0A0A] border border-white/5 hover:border-white/10 transition-colors rounded-xl p-5 cursor-pointer group flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                <h3 className="text-sm font-medium text-gray-200">Documentation</h3>
              </div>
              <p className="text-xs text-gray-500">Read the full API reference</p>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 self-end mt-4 transition-colors" />
          </div>
        </div>
      </div>
      
      {/* Background decorations for main content */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
    </div>
  );
}
