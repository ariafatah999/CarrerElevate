import React from "react";
import { FileText, Linkedin, History, Sparkles } from "lucide-react";
import { AnalysisResponse, AnalysisHistoryItem } from "../types";

interface SidebarProps {
  activeTab: "cv-auditor" | "linkedin" | "history";
  setActiveTab: (tab: "cv-auditor" | "linkedin" | "history") => void;
  activeAnalysis: AnalysisResponse | null;
  history: AnalysisHistoryItem[];
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  activeAnalysis,
  history
}: SidebarProps) {
  return (
    <aside className="w-64 bg-[#090d16] border-r border-white/[0.04] flex flex-col shrink-0 sticky top-0 h-screen z-20" id="app-sidebar">
      {/* Brand & App Name */}
      <div className="p-6 border-b border-white/[0.04] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-b from-zinc-100 to-zinc-300 flex items-center justify-center font-bold text-[#030712] shadow-sm">
            <Sparkles className="w-4 h-4 text-[#030712]" />
          </div>
          <div>
            <span className="font-extrabold tracking-tight text-white text-base">
              CareerElevate
            </span>
            <span className="text-[10px] text-zinc-550 block font-mono font-medium -mt-1 tracking-wider text-amber-500/90">
              AI OPTIMIZER
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-8 space-y-7 overflow-y-auto">
        <div className="space-y-2">
          <div className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest px-3">
            Core Analyzers
          </div>

          <button
            onClick={() => setActiveTab("cv-auditor")}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 group cursor-pointer ${
              activeTab === "cv-auditor"
                ? "bg-white/[0.04] text-white border border-white/[0.08]"
                : "text-zinc-400 hover:text-white hover:bg-white/[0.02]"
            }`}
            id="nav-cv-auditor"
          >
            <div className="flex items-center gap-2.5">
              <FileText className={`w-4 h-4 ${activeTab === "cv-auditor" ? "text-white" : "text-zinc-400 group-hover:text-zinc-300"}`} />
              <span>CV ATS Auditor</span>
            </div>
            {activeAnalysis && (
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                {activeAnalysis.cv_analysis.ats_score}%
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("linkedin")}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 group cursor-pointer ${
              activeTab === "linkedin"
                ? "bg-white/[0.04] text-white border border-white/[0.08]"
                : "text-zinc-400 hover:text-white hover:bg-white/[0.02]"
            }`}
            id="nav-linkedin"
          >
            <div className="flex items-center gap-2.5">
              <Linkedin className={`w-4 h-4 ${activeTab === "linkedin" ? "text-white" : "text-zinc-400 group-hover:text-zinc-300"}`} />
              <span>LinkedIn Optimizer</span>
            </div>
            {activeAnalysis && (
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            )}
          </button>
        </div>

        {/* History Area */}
        <div className="space-y-2">
          <div className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest px-3">
            Stored History
          </div>
          
          <button
            onClick={() => setActiveTab("history")}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
              activeTab === "history"
                ? "bg-white/[0.04] text-white border border-white/[0.08]"
                : "text-zinc-400 hover:text-white hover:bg-white/[0.02]"
            }`}
            id="nav-history"
          >
            <div className="flex items-center gap-2.5">
              <History className="w-4 h-4 text-zinc-400" />
              <span>Saved Audits</span>
            </div>
            <span className="text-[10px] font-mono bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">
              {history.length}
            </span>
          </button>
        </div>
      </nav>

      {/* Premium minimal Footer Note */}
      <div className="p-4 border-t border-white/[0.03] text-center">
        <span className="text-[9px] font-mono text-zinc-600 block uppercase tracking-wider">
          Enterprise Security Active
        </span>
      </div>
    </aside>
  );
}
