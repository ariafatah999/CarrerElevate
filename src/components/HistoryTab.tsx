import React from "react";
import { History, Trash2 } from "lucide-react";
import { AnalysisResponse, AnalysisHistoryItem } from "../types";

interface HistoryTabProps {
  history: AnalysisHistoryItem[];
  setActiveTab: (tab: "cv-auditor" | "linkedin" | "history") => void;
  setActiveAnalysis: React.Dispatch<React.SetStateAction<AnalysisResponse | null>>;
  setActiveAnalysisMetadata: (meta: { jobTitle: string; companyName: string } | null) => void;
  deleteHistoryItem: (id: string, e: React.MouseEvent) => void;
}

export default function HistoryTab({
  history,
  setActiveTab,
  setActiveAnalysis,
  setActiveAnalysisMetadata,
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
          <p className="text-xs text-slate-500 mt-1 font-sans">Lakukan audit pada tab "CV ATS Auditor" untuk mulai menyimpan data.</p>
          <button
            onClick={() => setActiveTab("cv-auditor")}
            className="mt-4 px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-xl text-xs font-bold text-white hover:scale-105 transition-all cursor-pointer"
          >
            Mulai Audit Pertama Anda
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {history.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                setActiveAnalysis(item.data);
                setActiveAnalysisMetadata({ jobTitle: item.jobTitle, companyName: item.companyName });
                setActiveTab("cv-auditor");
              }}
              className="bg-[#1F293D] p-5 rounded-xl border border-slate-800 hover:border-cyan-500/20 transition-all flex items-center justify-between gap-4 cursor-pointer hover:bg-[#1F293D]/80 group shadow-md animate-fade-in"
            >
              <div className="space-y-1 min-w-0">
                <div className="text-[10px] font-mono text-slate-500 flex items-center gap-2">
                  <span>{item.timestamp}</span>
                  <span className="text-slate-700">•</span>
                  <span className="text-slate-400 font-sans">Kandidat Web Developer</span>
                </div>
                <h4 className="font-bold text-sm text-slate-200 truncate pr-2 group-hover:text-cyan-400 transition-colors">
                  {item.jobTitle}
                </h4>
                <p className="text-xs text-slate-400 truncate">
                  Perusahaan: {item.companyName}
                </p>
              </div>

              <div className="flex items-center gap-5 shrink-0">
                {/* Static pill score */}
                <div className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-bold ${getScoreBgColor(item.ats_score)}`}>
                  ATS: {item.ats_score}%
                </div>

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
          ))}
        </div>
      )}
    </div>
  );
}
