import React, { useEffect, useState } from "react";

export const LOADING_INSIGHTS = [
  "Membaca isi CV dengan parser filter berstandar ATS modern...",
  "Memetakan kecocokan dengan kualifikasi dari Job Description...",
  "Menganalisis kesenjangan kata kunci (keyword gap) teknis...",
  "Merumuskan ulang kalimat kerja pasif menjadi standard formula XYZ (Accomplished X, Measured by Y, doing Z)...",
  "Menyusun rekomendasi headline LinkedIn berbasis SEO karier...",
  "Membangun ringkasan profil LinkedIn storytelling eksklusif profesional..."
];

interface LoadingScreenProps {
  loading: boolean;
}

export default function LoadingScreen({ loading }: LoadingScreenProps) {
  const [loadingStep, setLoadingStep] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % LOADING_INSIGHTS.length);
      }, 3500);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  if (!loading) return null;

  return (
    <div className="bg-[#1F293D] p-12 rounded-2xl border border-slate-800 flex flex-col items-center text-center space-y-6 animate-pulse" id="loading-screen">
      {/* Outer circle spinner */}
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-[#06B6D4] border-r-transparent border-b-[#10B981] border-l-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-4 rounded-full bg-[#0B0F19] flex items-center justify-center text-slate-500 font-mono text-xs">
          {Math.min(99, Math.round((loadingStep + 1) * 16.6))}%
        </div>
      </div>

      <div className="space-y-2 max-w-lg">
        <h3 className="text-lg font-bold text-white">Analisis Karier Sedang Diproses</h3>
        <p className="text-[#06B6D4] font-mono text-xs min-h-[40px] px-4 font-semibold animate-bounce">
          {LOADING_INSIGHTS[loadingStep]}
        </p>
        <p className="text-xs text-slate-500 mt-2 italic leading-relaxed">
          "Kami menggunakan AI untuk mensimulasikan sistem parse parser ATS rekrutmen perusahaan elit Indonesia."
        </p>
      </div>
    </div>
  );
}
