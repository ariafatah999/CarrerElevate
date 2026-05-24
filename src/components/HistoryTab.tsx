import React from "react";
import { History, Trash2, Linkedin, FileText, CheckCircle } from "lucide-react";
import { AnalysisHistoryItem } from "../types";

interface HistoryTabProps {
  history: AnalysisHistoryItem[];
  onLoadHistoryItem: (item: AnalysisHistoryItem) => void;
  deleteHistoryItem: (id: string, e: React.MouseEvent) => void;
}

export default function HistoryTab({
  history,
  onLoadHistoryItem,
  deleteHistoryItem
}: HistoryTabProps) {
  const getScoreBgColor = (score: number) => {
    if (score < 55) return "bg-amber-500/10 border-amber-500/20 text-amber-400";
    if (score < 75) return "bg-cyan-500/10 border-cyan-500/20 text-cyan-400";
    return "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";
  };

  return (
    <div className="space-y-6" id="history-tab">
      <div className="space-y-1">
        <h3 className="text-xl font-bold text-white">Riwayat Audit Tersimpan</h3>
        <p className="text-xs text-slate-400 font-sans">
          Berikut adalah riwayat evaluasi CV dan profil LinkedIn yang tersimpan di browser Anda saat ini.
        </p>
      </div>

      {history.length === 0 ? (
        <div className="bg-[#1F293D] p-12 rounded-2xl border border-slate-800 text-center flex flex-col items-center shadow-md">
          <History className="w-12 h-12 text-slate-600 mb-4 animate-pulse" />
          <p className="text-slate-400 text-sm font-sans">Belum ada riwayat audit tersimpan.</p>
          <p className="text-xs text-slate-500 mt-1 font-sans">Lakukan evaluasi pada tab "CV ATS Auditor" atau "LinkedIn Optimizer" untuk mulai menyimpan data.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {history.map((item) => {
            const isLinkedin = item.type === "linkedin";

            return (
              <div
                key={item.id}
                onClick={() => onLoadHistoryItem(item)}
                className="bg-[#1F293D] p-5 rounded-xl border border-slate-800 hover:border-cyan-500/20 transition-all flex items-center justify-between gap-4 cursor-pointer hover:bg-[#1F293D]/80 group shadow-md animate-fade-in"
              >
                <div className="space-y-2 min-w-0 flex-1">
                  <div className="text-[10px] font-mono text-slate-500 flex flex-wrap items-center gap-2">
                    <span className="text-zinc-400">{item.timestamp}</span>
                    <span className="text-slate-700">•</span>
                    {isLinkedin ? (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold">
                        <Linkedin className="w-2.5 h-2.5 shrink-0" /> LINKEDIN OPTIMIZATION
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
                        <FileText className="w-2.5 h-2.5 shrink-0" /> CV ATS AUDIT
                      </span>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-sm text-slate-200 truncate pr-2 group-hover:text-cyan-400 transition-colors">
                      {item.jobTitle}
                    </h4>
                    <p className="text-xs text-slate-405 font-mono mt-0.5">
                      {isLinkedin ? "Sumber: Dokumen LinkedIn" : `Target Perusahaan: ${item.companyName}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-5 shrink-0">
                  {/* Status or Score display */}
                  {isLinkedin ? (
                    <div className="px-3 py-1.5 rounded-lg border border-[#06b6d4]/20 bg-[#06b6d4]/10 font-mono text-[10px] font-bold text-cyan-400 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 shrink-0" /> OPTIMAL
                    </div>
                  ) : (
                    <div className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-bold ${getScoreBgColor(item.ats_score)}`}>
                      ATS: {item.ats_score}%
                    </div>
                  )}

                  {/* Action delete btn */}
                  <button
                    onClick={(e) => deleteHistoryItem(item.id, e)}
                    className="p-2 border border-slate-800 text-slate-400 hover:text-red-400 rounded-lg hover:border-red-500/20 cursor-pointer transition-colors"
                    title="Hapus Catatan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
