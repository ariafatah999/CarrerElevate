import React from "react";

interface HeaderProps {
  activeAnalysisMetadata: { jobTitle: string; companyName: string } | null;
}

export default function Header({ activeAnalysisMetadata }: HeaderProps) {
  return (
    <header className="h-14 border-b border-white/[0.04] px-8 flex items-center justify-between bg-[#030712]/60 backdrop-blur-md sticky top-0 z-10 shrink-0" id="app-header">
      <div className="flex items-center gap-4">
        <div className="text-xs">
          {activeAnalysisMetadata ? (
            <div className="flex items-center gap-2 text-zinc-400">
              <span className="font-medium tracking-wide">CV Workspace</span>
              <span className="text-zinc-750">/</span>
              <span className="font-semibold text-white tracking-wide">{activeAnalysisMetadata.jobTitle}</span>
              <span className="text-zinc-700">|</span>
              <span className="text-[10px] font-mono text-zinc-500 hidden sm:inline">{activeAnalysisMetadata.companyName}</span>
            </div>
          ) : (
            <span className="text-zinc-400 font-mono text-[10px] uppercase tracking-widest">
              Workspace / Analyzer Dashboard
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Balanced right end spacing */}
        <div className="flex items-center gap-1.5 bg-[#090d16] border border-white/[0.04] px-2.5 py-1 rounded-full text-[10px] font-mono text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>SaaS Engine Online</span>
        </div>
      </div>
    </header>
  );
}
