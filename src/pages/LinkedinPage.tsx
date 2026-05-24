import React from "react";
import LinkedinInput from "../components/LinkedinInput";
import LinkedinResults from "../components/LinkedinResults";
import LinkedinValidationScreen, { ParsedLinkedinResultData } from "../components/LinkedinValidationScreen";
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
  triggerLinkedinParser: () => Promise<void>;

  // Flow baru states
  parsedLinkedinResult: ParsedLinkedinResultData | null;
  setParsedLinkedinResult: (val: ParsedLinkedinResultData | null) => void;
  linkedinParsingStage: "input" | "validation" | "results";
  setLinkedinParsingStage: (val: "input" | "validation" | "results") => void;
  triggerLinkedinOptimize: (payload: ParsedLinkedinResultData) => Promise<void>;
  loadingLinkedinOptimize: boolean;

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
  triggerLinkedinParser,

  parsedLinkedinResult,
  setParsedLinkedinResult,
  linkedinParsingStage,
  setLinkedinParsingStage,
  triggerLinkedinOptimize,
  loadingLinkedinOptimize,

  copyToClipboard,
  copiedText
}: LinkedinPageProps) {
  
  if (linkedinLoading) {
    return (
      <div className="bg-[#1F293D] p-12 rounded-2xl border border-slate-800 flex flex-col items-center text-center space-y-6 animate-fade-in" id="linkedin-loading">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-cyan-500 border-r-transparent border-b-[#06B6D4] border-l-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-4 rounded-full bg-[#0B0F19] flex items-center justify-center text-cyan-400 font-mono text-sm font-bold">
            in
          </div>
        </div>
        <div className="space-y-4 max-w-lg">
          <h3 className="text-lg font-bold text-white">Mengekstrak Data Semantik LinkedIn</h3>
          <p className="text-[#06B6D4] font-semibold font-mono text-xs animate-pulse">
            Melakukan scanning data profil, riwayat karir, sertifikasi, kompetensi tersembunyi...
          </p>
          <p className="text-xs text-slate-400 leading-relaxed italic">
            "Sistem sedang membaca seluruh file input Anda secara komprehensif tanpa melewatkan detail riwayat pendidikan, skill, maupun sertifikasi resmi Anda."
          </p>
        </div>
      </div>
    );
  }

  // Stage 1: Input Page
  if (linkedinParsingStage === "input" || !parsedLinkedinResult) {
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
        triggerLinkedinOptimization={triggerLinkedinParser}
      />
    );
  }

  // Stage 2: Verification and Validation Page ("Detected LinkedIn Data")
  if (linkedinParsingStage === "validation" && parsedLinkedinResult) {
    return (
      <LinkedinValidationScreen
        parsedData={parsedLinkedinResult}
        onUpdate={setParsedLinkedinResult}
        onBack={() => setLinkedinParsingStage("input")}
        onSubmitOptimization={triggerLinkedinOptimize}
        loadingOptimize={loadingLinkedinOptimize}
      />
    );
  }

  // Stage 3: Comparison Results Layout Page
  return (
    <LinkedinResults
      activeAnalysis={activeAnalysis!}
      setActiveAnalysis={setActiveAnalysis}
      setActiveTab={setActiveTab}
      copyToClipboard={copyToClipboard}
      copiedText={copiedText}
      parsedLinkedinResult={parsedLinkedinResult}
      linkedinTargetRole={linkedinTargetRole}
      linkedinTone={linkedinTone}
    />
  );
}
