import React from "react";
import LoadingScreen from "../components/LoadingScreen";
import CvAuditorInput from "../components/CvAuditorInput";
import CvAuditorResults from "../components/CvAuditorResults";
import CvValidationScreen, { ParsedCvResultData } from "../components/CvValidationScreen";
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

  // New Validation and Parsed Data States
  parsedCvResult: ParsedCvResultData | null;
  setParsedCvResult: (data: ParsedCvResultData | null) => void;
  parsingStage: "input" | "validation" | "results";
  setParsingStage: (stage: "input" | "validation" | "results") => void;
  triggerOptimizeCv: (payload: ParsedCvResultData) => Promise<void>;
  loadingOptimize: boolean;
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
  setLinkedinTargetRole,

  // New Validation Props
  parsedCvResult,
  setParsedCvResult,
  parsingStage,
  setParsingStage,
  triggerOptimizeCv,
  loadingOptimize
}: CvAuditorPageProps) {
  if (loading) {
    return <LoadingScreen loading={loading} />;
  }

  // Display Validation Screen if parsed CV data exists and parsingStage is "validation"
  if (parsingStage === "validation" && parsedCvResult) {
    return (
      <CvValidationScreen
        parsedData={parsedCvResult}
        onUpdate={setParsedCvResult}
        onBack={() => setParsingStage("input")}
        onSubmitOptimization={triggerOptimizeCv}
        loadingOptimize={loadingOptimize}
      />
    );
  }

  if (!activeAnalysis || parsingStage === "input") {
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
      setActiveAnalysis={(val) => {
        setActiveAnalysis(val);
        if (val === null) {
          setParsingStage("input");
          setParsedCvResult(null);
        }
      }}
      setActiveTab={setActiveTab}
      copyToClipboard={copyToClipboard}
      copiedText={copiedText}
      cvText={cvText}
      jobDescription={jobDescription}
    />
  );
}
