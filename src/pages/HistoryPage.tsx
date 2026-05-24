import React from "react";
import HistoryTab from "../components/HistoryTab";
import { AnalysisHistoryItem } from "../types";

interface HistoryPageProps {
  history: AnalysisHistoryItem[];
  onLoadHistoryItem: (item: AnalysisHistoryItem) => void;
  deleteHistoryItem: (id: string, e: React.MouseEvent) => void;
}

export default function HistoryPage({
  history,
  onLoadHistoryItem,
  deleteHistoryItem
}: HistoryPageProps) {
  return (
    <HistoryTab
      history={history}
      onLoadHistoryItem={onLoadHistoryItem}
      deleteHistoryItem={deleteHistoryItem}
    />
  );
}
