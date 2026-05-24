import React from "react";
import LinkedinInput from "../components/LinkedinInput";
import LinkedinResults from "../components/LinkedinResults";
import { AnalysisResponse } from "../types";

interface LinkedinPageProps {
  linkedinLoading: boolean;
  activeAnalysis: AnalysisResponse | null;
  setActiveAnalysis: React.Dispatch<React.SetStateAction<AnalysisResponse | null>>;
  setActiveTab: (tab: "cv-auditor" | "linkedin" | "history") => void;
  linkedinHeadlineLama: string;
  setLinkedinHeadlineLama: (val: string) => void;
  linkedinSummaryLama: string;
  setLinkedinSummaryLama: (val: string) => void;
  linkedinTone: string;
  setLinkedinTone: (val: string) => void;
  linkedinTargetRole: string;
  setLinkedinTargetRole: (val: string) => void;
  linkedinErrorMessage: string | null;
  setLinkedinErrorMessage: (val: string | null) => void;
  linkedinPdfFileName: string | null;
  setLinkedinPdfFileName: (val: string | null) => void;
  isParsingLinkedinPdf: boolean;
  setIsParsingLinkedinPdf: (val: boolean) => void;
  setLinkedinProfileText: (val: string) => void;
  handleLinkedinPdfUpload: (file: File) => Promise<void>;
  triggerLinkedinOptimization: () => Promise<void>;
  copyToClipboard: (text: string, label: string) => void;
  copiedText: string | null;
}

export default function LinkedinPage({
  linkedinLoading,
  activeAnalysis,
  setActiveAnalysis,
  setActiveTab,
  linkedinHeadlineLama,
  setLinkedinHeadlineLama,
  linkedinSummaryLama,
  setLinkedinSummaryLama,
  linkedinTone,
  setLinkedinTone,
  linkedinTargetRole,
  setLinkedinTargetRole,
  linkedinErrorMessage,
  setLinkedinErrorMessage,
  linkedinPdfFileName,
  setLinkedinPdfFileName,
  isParsingLinkedinPdf,
  setIsParsingLinkedinPdf,
  setLinkedinProfileText,
  handleLinkedinPdfUpload,
  triggerLinkedinOptimization,
  copyToClipboard,
  copiedText
}: LinkedinPageProps) {
  if (linkedinLoading) {
    return (
      <div className="bg-[#1F293D] p-12 rounded-2xl border border-slate-800 flex flex-col items-center text-center space-y-6 animate-fade-in">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-cyan-500 border-r-transparent border-b-[#06B6D4] border-l-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-4 rounded-full bg-[#0B0F19] flex items-center justify-center text-cyan-400 font-mono text-sm font-bold">
            in
          </div>
        </div>
        <div className="space-y-2 max-w-lg">
          <h3 className="text-lg font-bold text-white">Menyusun Profil LinkedIn Premium</h3>
          <p className="text-[#06B6D4] font-semibold font-mono text-xs animate-pulse">
            Memformulasikan deskripsi personalitas tingkat tinggi berbasis SEO karir...
          </p>
          <p className="text-xs text-slate-400 mt-2 italic leading-relaxed">
            "Kami menggunakan rekayasa kata penarik rekrutmen profesional untuk meningkatkan kemunculan Anda di pencarian HRD."
          </p>
        </div>
      </div>
    );
  }

  if (!activeAnalysis?.linkedin_optimization) {
    return (
      <LinkedinInput
        linkedinHeadlineLama={linkedinHeadlineLama}
        setLinkedinHeadlineLama={setLinkedinHeadlineLama}
        linkedinSummaryLama={linkedinSummaryLama}
        setLinkedinSummaryLama={setLinkedinSummaryLama}
        linkedinTone={linkedinTone}
        setLinkedinTone={setLinkedinTone}
        linkedinTargetRole={linkedinTargetRole}
        setLinkedinTargetRole={setLinkedinTargetRole}
        linkedinErrorMessage={linkedinErrorMessage}
        setLinkedinErrorMessage={setLinkedinErrorMessage}
        linkedinPdfFileName={linkedinPdfFileName}
        setLinkedinPdfFileName={setLinkedinPdfFileName}
        isParsingLinkedinPdf={isParsingLinkedinPdf}
        setIsParsingLinkedinPdf={setIsParsingLinkedinPdf}
        setLinkedinProfileText={setLinkedinProfileText}
        handleLinkedinPdfUpload={handleLinkedinPdfUpload}
        triggerLinkedinOptimization={triggerLinkedinOptimization}
      />
    );
  }

  return (
    <LinkedinResults
      activeAnalysis={activeAnalysis}
      setActiveAnalysis={setActiveAnalysis}
      setActiveTab={setActiveTab}
      copyToClipboard={copyToClipboard}
      copiedText={copiedText}
      linkedinHeadlineLama={linkedinHeadlineLama}
      linkedinSummaryLama={linkedinSummaryLama}
      linkedinTargetRole={linkedinTargetRole}
      linkedinTone={linkedinTone}
    />
  );
}
