import React from "react";
import HistoryTab from "../components/HistoryTab";
import { AnalysisHistoryItem, AnalysisResponse } from "../types";

interface HistoryPageProps {
  history: AnalysisHistoryItem[];
  setActiveTab: (tab: "cv-auditor" | "linkedin" | "history") => void;
  setActiveAnalysis: (analysis: AnalysisResponse | null) => void;
  setActiveAnalysisMetadata: (meta: { jobTitle: string; companyName: string } | null) => void;
  deleteHistoryItem: (id: string, e: React.MouseEvent) => void;
}

export default function HistoryPage({
  history,
  setActiveTab,
  setActiveAnalysis,
  setActiveAnalysisMetadata,
  deleteHistoryItem
}: HistoryPageProps) {
  return (
    <HistoryTab
      history={history}
      setActiveTab={setActiveTab}
      setActiveAnalysis={setActiveAnalysis}
      setActiveAnalysisMetadata={setActiveAnalysisMetadata}
      deleteHistoryItem={deleteHistoryItem}
    />
  );
}
