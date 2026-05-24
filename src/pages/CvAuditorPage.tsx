import React from "react";
import LoadingScreen from "../components/LoadingScreen";
import CvAuditorInput from "../components/CvAuditorInput";
import CvAuditorResults from "../components/CvAuditorResults";
import { AnalysisResponse } from "../types";

interface CvAuditorPageProps {
  loading: boolean;
  activeAnalysis: AnalysisResponse | null;
  setActiveAnalysis: (val: AnalysisResponse | null) => void;
  setActiveTab: (tab: "cv-auditor" | "linkedin" | "history") => void;
  copyToClipboard: (text: string, label: string) => void;
  copiedText: string | null;
  cvText: string;
  setCvText: (text: string) => void;
  jobDescription: string;
  setJobDescription: (jd: string) => void;
  selectedJobId: string;
  setSelectedJobId: (id: string) => void;
  customJobTitle: string;
  setCustomJobTitle: (title: string) => void;
  errorMessage: string | null;
  setErrorMessage: (err: string | null) => void;
  pdfFileName: string | null;
  setPdfFileName: (name: string | null) => void;
  isParsingPdf: boolean;
  setIsParsingPdf: (val: boolean) => void;
  handlePdfUpload: (file: File) => Promise<void>;
  handleInjectSampleCv: () => void;
  triggerAudit: () => Promise<void>;
  setLinkedinTargetRole: (role: string) => void;
}

export default function CvAuditorPage({
  loading,
  activeAnalysis,
  setActiveAnalysis,
  setActiveTab,
  copyToClipboard,
  copiedText,
  cvText,
  setCvText,
  jobDescription,
  setJobDescription,
  selectedJobId,
  setSelectedJobId,
  customJobTitle,
  setCustomJobTitle,
  errorMessage,
  setErrorMessage,
  pdfFileName,
  setPdfFileName,
  isParsingPdf,
  setIsParsingPdf,
  handlePdfUpload,
  handleInjectSampleCv,
  triggerAudit,
  setLinkedinTargetRole
}: CvAuditorPageProps) {
  if (loading) {
    return <LoadingScreen loading={loading} />;
  }

  if (!activeAnalysis) {
    return (
      <CvAuditorInput
        cvText={cvText}
        setCvText={setCvText}
        jobDescription={jobDescription}
        setJobDescription={setJobDescription}
        selectedJobId={selectedJobId}
        setSelectedJobId={setSelectedJobId}
        customJobTitle={customJobTitle}
        setCustomJobTitle={setCustomJobTitle}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        pdfFileName={pdfFileName}
        setPdfFileName={setPdfFileName}
        isParsingPdf={isParsingPdf}
        setIsParsingPdf={setIsParsingPdf}
        handlePdfUpload={handlePdfUpload}
        handleInjectSampleCv={handleInjectSampleCv}
        triggerAudit={triggerAudit}
        setLinkedinTargetRole={setLinkedinTargetRole}
      />
    );
  }

  return (
    <CvAuditorResults
      activeAnalysis={activeAnalysis}
      setActiveAnalysis={setActiveAnalysis}
      setActiveTab={setActiveTab}
      copyToClipboard={copyToClipboard}
      copiedText={copiedText}
      cvText={cvText}
      jobDescription={jobDescription}
    />
  );
}
