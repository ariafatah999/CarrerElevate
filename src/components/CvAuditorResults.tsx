import React, { useState } from "react";
import { 
  RefreshCcw, 
  ChevronLeft, 
  CheckCircle, 
  Copy, 
  BookOpen, 
  Layers, 
  Award, 
  Sparkles, 
  Check, 
  AlertCircle,
  Briefcase
} from "lucide-react";
import { AnalysisResponse } from "../types";

interface CvAuditorResultsProps {
  activeAnalysis: AnalysisResponse;
  setActiveAnalysis: React.Dispatch<React.SetStateAction<AnalysisResponse | null>>;
  setActiveTab: (tab: "cv-auditor" | "linkedin" | "history") => void;
  copyToClipboard: (text: string, label: string) => void;
  copiedText: string | null;
  cvText?: string;
  jobDescription?: string;
}

type CvTabSection = "summary" | "experience" | "education" | "skills" | "projects" | "certifications";

export default function CvAuditorResults({
  activeAnalysis,
  setActiveAnalysis,
  setActiveTab,
  copyToClipboard,
  copiedText,
  cvText = "",
  jobDescription = ""
}: CvAuditorResultsProps) {
  const score = activeAnalysis.cv_analysis.ats_score;
  const cv = activeAnalysis.cv_analysis;
  const improvements = cv.improvements || [];

  const [activeTabSection, setActiveTabSection] = useState<CvTabSection>("summary");

  // Fallback and unified recommendation result structure (Robust backwards-compatibility)
  const parsedData = cv.parsed_data || {
    summary: "",
    skills: [],
    experience: [],
    education: [],
    projects: [],
    certifications: []
  };

  const recs = cv.recommendations || {
    summary: {
      original: parsedData.summary || "Data belum tersedia",
      optimized: improvements.find(i => (i.section || "").toLowerCase().includes("summary"))?.after || parsedData.summary || "Data belum tersedia"
    },
    education: (parsedData.education || []).map((edu) => ({
      original: edu,
      optimized: {
        ...edu,
        activities: improvements.find(i => (i.section || "").toLowerCase().includes("education"))?.after 
          ? [improvements.find(i => (i.section || "").toLowerCase().includes("education"))!.after]
          : edu.activities || []
      }
    })),
    experience: (parsedData.experience || []).map((exp) => ({
      original: exp,
      optimized: {
        ...exp,
        highlights: improvements.find(i => (i.section || "").toLowerCase().includes("experience"))?.after
          ? [improvements.find(i => (i.section || "").toLowerCase().includes("experience"))!.after]
          : exp.highlights || []
      }
    })),
    skills: {
      original: parsedData.skills || [],
      optimized: improvements.find(i => (i.section || "").toLowerCase().includes("skill"))?.after?.split(",").map(s => s.trim()) || parsedData.skills || []
    },
    projects: (parsedData.projects || []).map(proj => ({
      original: proj,
      optimized: proj
    })),
    certifications: (parsedData.certifications || []).map(cert => ({
      original: cert,
      optimized: cert
    }))
  };

  // Simple, short recommendations based on tab type
  const getTabRecommendations = (): string[] => {
    switch (activeTabSection) {
      case "summary":
        return [
          "Buat ringkasan yang singkat, padat, dan langsung menjelaskan keahlian teknis andalan Anda.",
          "Sematkan langsung kaitan antara nilai keahlian utama Anda dengan solusi di perusahaan target.",
          "Hindari kalimat deskriptif umum berlebih seperti 'pekerja keras' atau 'berdedikasi tinggi'."
        ];
      case "experience":
        return [
          "Tambahkan tools dan teknologi yang digunakan secara spesifik untuk setiap pekerjaan.",
          "Tambahkan hasil kerja yang riil dan dapat diukur untuk memperjelas pencapaian Anda.",
          "Gunakan kata kerja aktif profesional (seperti: Mengembangkan, Memimpin, Merancang).",
          "Rapikan urutan poin pengalaman kerja mulai dari yang paling terbaru."
        ];
      case "education":
        return [
          "Tambahkan fokus studi atau proyek akademik utama jika detail pendidikan minim.",
          "Sertifikasi relevan dapat diletakkan berdampingan untuk memperkuat background akademis.",
          "Hindari mengarang IPK atau prestasi penunjang lainnya jika tidak dicantumkan di CV asli."
        ];
      case "skills":
        return [
          "Kelompokkan keahlian ke dalam kategori terarah (contoh: Frontend, Backend, DevTools).",
          "Tuliskan nama tools/bahasa pemrograman yang baku dan konsisten (e.g. React.js, TypeScript).",
          "Hanya tampilkan keahlian yang terverifikasi dan benar-benar Anda kuasai."
        ];
      case "projects":
        return [
          "Tulis rincian kontribusi spesifik Anda dalam tim atau arsitektur utama proyek.",
          "Sebutkan tautan repositori kode atau deployment aktif jika ada untuk verifikasi.",
          "Tampilkan proyek-proyek yang paling relevan dengan target lowongan pekerjaan."
        ];
      case "certifications":
        return [
          "Urutkan sertifikasi mulai dari yang memiliki masa berlaku aktif terlama.",
          "Cantumkan penerbit resmi sertifikat (seperti Google, Microsoft, AWS, dsb).",
          "Hindari mencantumkan sertifikat lama yang keterampilannya sudah usang."
        ];
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-zinc-100" id="cv-auditor-results">
      
      {/* 1. HEADER CONTROL ACTION BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#090d16] p-4 rounded-xl border border-white/[0.04] backdrop-blur-sm shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center font-bold text-[#030712] shadow-sm font-mono">
            CV
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-tight font-mono">Resume Analysis Result</h3>
            <p className="text-[11px] text-emerald-400 font-mono flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Analisis Komparatif Sukses Diekstraksi
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button 
            onClick={() => setActiveAnalysis(null)}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 text-xs font-semibold text-zinc-300 hover:text-white bg-[#030712] border border-white/[0.04] px-4.5 py-2.5 rounded-lg cursor-pointer transition-colors"
          >
            <RefreshCcw className="w-3.5 h-3.5 text-zinc-400" />
            <span>Mulai Ulang / Ganti CV</span>
          </button>
          <button 
            onClick={() => setActiveTab("cv-auditor")}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 text-xs font-semibold text-zinc-400 hover:text-white bg-[#030712] border border-white/[0.04] px-4.5 py-2.5 rounded-lg cursor-pointer transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-zinc-400" />
            <span>Kembali</span>
          </button>
        </div>
      </div>

      {/* 2. REAL ATMOSPHERE SCORE OVERVIEW BANNER */}
      <div className="bg-[#090d16] p-6 rounded-2xl border border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-xl" id="summary-score-card">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 rounded text-emerald-405 text-[10px] font-bold font-mono tracking-widest uppercase text-emerald-400">
            COMPATIBILITY SCORE
          </div>
          <h4 className="text-xl font-extrabold text-white leading-tight tracking-tight">
            Kesesuaian Karir CV &amp; Target Pekerjaan
          </h4>
          <p className="text-zinc-400 text-xs max-w-xl font-sans leading-relaxed">
            Skor kecocokan ini dihitung secara real dari perbandingan kata kunci kompetensi pada CV Anda dengan deskripsi lowongan pekerjaan yang ditargetkan.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-[#030712]/90 p-5 rounded-2xl border border-white/[0.03] w-full md:w-auto shrink-0 justify-center shadow-lg">
          <div className="relative w-16 h-16 flex items-center justify-center select-none">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="32" cy="32" r="28" stroke="rgba(255,255,255,0.04)" strokeWidth="5" fill="transparent" />
              <circle cx="32" cy="32" r="28" stroke="#10b981" strokeWidth="5" fill="transparent" strokeDasharray="176" strokeDashoffset={176 - (176 * score) / 100} strokeLinecap="round" />
            </svg>
            <div className="absolute font-black text-lg text-[#10B981] font-mono">
              {score}%
            </div>
          </div>
          <div className="space-y-0.5">
            <span className="text-[9px] font-mono font-bold text-zinc-500 block uppercase">ATS Match rate</span>
            <div className="text-xs font-bold font-mono text-zinc-200">
              {score >= 75 ? "Kategori Sangat Sesuai" : "Butuh Sedikit Penyesuaian"}
            </div>
            <p className="text-[10px] text-zinc-400 font-sans">Saran optimal kompetitif: &gt;75%</p>
          </div>
        </div>
      </div>

      {/* 2.5 DETECTED FROM CV (SEMANTIC DATA LAYER) */}
      <div className="bg-[#090d16] p-6 rounded-2xl border border-white/[0.04] space-y-4 shadow-xl" id="detected-cv-layer">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/[0.03] pb-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-bold text-zinc-100 uppercase tracking-widest font-mono">
                Detected from CV (Data Layer)
              </h4>
            </div>
            <p className="text-[11px] text-zinc-400 font-sans">
              Parser semantik berhasil mendeteksi dan menstrukturkan poin-poin berikut dari CV asli Anda.
            </p>
          </div>

          {/* Confidence Indicator */}
          <div className="flex items-center gap-2 bg-[#030712] border border-white/[0.03] px-3 py-1.5 rounded-lg font-mono">
            <span className="text-[10px] text-zinc-500 font-bold uppercase">Confidence Score:</span>
            <span className={`text-[11px] font-bold ${
              (cv.parsed_data?.confidence_score ?? 80) >= 75 
                ? "text-emerald-400" 
                : (cv.parsed_data?.confidence_score ?? 80) >= 50 
                ? "text-amber-400" 
                : "text-rose-400"
            }`}>
              {cv.parsed_data?.confidence_level ?? "Tinggi"} ({cv.parsed_data?.confidence_score ?? 80}%)
            </span>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Box 1: Skills */}
          <div className="bg-[#030712]/50 p-4 rounded-xl border border-white/[0.02] space-y-2.5">
            <span className="text-[10px] text-zinc-500 font-mono font-bold uppercase tracking-wider block">Skills Terdeteksi</span>
            <div className="flex flex-wrap gap-1 max-h-[140px] overflow-y-auto pr-1">
              {cv.parsed_data?.skills && cv.parsed_data.skills.length > 0 ? (
                cv.parsed_data.skills.map((skill, i) => (
                  <span key={i} className="text-[10px] bg-white/[0.03] hover:bg-white/[0.06] text-zinc-300 px-2 py-0.5 rounded font-mono border border-white/[0.02] transition-colors">
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-zinc-500 italic">Tidak ditemui skill teknis</span>
              )}
            </div>
          </div>

          {/* Box 2: Experience */}
          <div className="bg-[#030712]/50 p-4 rounded-xl border border-white/[0.02] space-y-2.5">
            <span className="text-[10px] text-zinc-500 font-mono font-bold uppercase tracking-wider block">Pengalaman</span>
            <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
              {cv.parsed_data?.experience && cv.parsed_data.experience.length > 0 ? (
                cv.parsed_data.experience.map((exp, i) => (
                  <div key={i} className="border-l border-emerald-500/20 pl-2 space-y-0.5">
                    <h5 className="text-[11px] font-bold text-white leading-tight font-sans">{exp.role}</h5>
                    <p className="text-[10px] text-zinc-400 font-mono">{exp.company}</p>
                    {exp.period && <p className="text-[9px] text-zinc-500 font-mono">{exp.period}</p>}
                    {exp.tools && exp.tools.length > 0 && (
                      <p className="text-[8px] text-emerald-400 font-mono">Stack: {exp.tools.join(", ")}</p>
                    )}
                  </div>
                ))
              ) : (
                <span className="text-xs text-zinc-500 italic block">Tidak ada pengalaman terekstrak</span>
              )}
            </div>
          </div>

          {/* Box 3: Education */}
          <div className="bg-[#030712]/50 p-4 rounded-xl border border-white/[0.02] space-y-2.5">
            <span className="text-[10px] text-zinc-500 font-mono font-bold uppercase tracking-wider block">Pendidikan</span>
            <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
              {cv.parsed_data?.education && cv.parsed_data.education.length > 0 ? (
                cv.parsed_data.education.map((edu, i) => (
                  <div key={i} className="border-l border-cyan-500/20 pl-2 space-y-0.5">
                    <h5 className="text-[11px] font-bold text-white leading-tight font-sans">{edu.institution}</h5>
                    <p className="text-[10px] text-zinc-400 font-mono">{edu.major}</p>
                    {edu.period && <p className="text-[9px] text-zinc-500 font-mono">{edu.period}</p>}
                    {edu.gpa && (
                      <p className="text-[9px] text-cyan-400 font-mono font-bold">IPK: {edu.gpa}</p>
                    )}
                  </div>
                ))
              ) : (
                <span className="text-xs text-zinc-500 italic block">Tidak terdeteksi riwayat studi</span>
              )}
            </div>
          </div>

          {/* Box 4: Certifications & Projects */}
          <div className="bg-[#030712]/50 p-4 rounded-xl border border-white/[0.02] space-y-2.5">
            <span className="text-[10px] text-zinc-500 font-mono font-bold uppercase tracking-wider block">Sertifikasi & Proyek</span>
            <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1 text-[10px] text-zinc-300 font-sans">
              {/* Projects */}
              {cv.parsed_data?.projects && cv.parsed_data.projects.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[8px] font-mono text-zinc-550 uppercase tracking-widest block font-bold">Proyek Utama</span>
                  {cv.parsed_data.projects.map((proj, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-zinc-300">
                      <span className="w-1 h-1 bg-emerald-500 rounded-full mt-1.5 shrink-0"></span>
                      <span className="truncate">{proj}</span>
                    </div>
                  ))}
                </div>
              )}
              {/* Certifications */}
              {cv.parsed_data?.certifications && cv.parsed_data.certifications.length > 0 && (
                <div className="space-y-1 pt-1.5 border-t border-white/[0.02]">
                  <span className="text-[8px] font-mono text-zinc-550 uppercase tracking-widest block font-bold">Sertifikasi</span>
                  {cv.parsed_data.certifications.map((cert, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-zinc-300">
                      <span className="w-1 h-1 bg-cyan-500 rounded-full mt-1.5 shrink-0"></span>
                      <span className="truncate">{cert}</span>
                    </div>
                  ))}
                </div>
              )}
              {(!cv.parsed_data?.projects || cv.parsed_data.projects.length === 0) &&
               (!cv.parsed_data?.certifications || cv.parsed_data.certifications.length === 0) && (
                <span className="text-xs text-zinc-505 italic block text-zinc-500">Tidak ada proyek/sertifikat terdeteksi</span>
              )}
            </div>
          </div>
        </div>

        {/* Remarks Banner: Especially critical if confidence level is Low or there's specific feedback */}
        {cv.parsed_data?.confidence_remarks && (
          <div className={`p-3.5 rounded-xl border flex items-start gap-2.5 ${
            (cv.parsed_data?.confidence_score ?? 80) < 60
              ? "bg-rose-500/10 border-rose-500/20 text-rose-200"
              : "bg-emerald-500/5 border-emerald-500/15 text-emerald-250"
          }`}>
            <AlertCircle className={`w-4 h-4 shrink-0 mt-0.5 ${
              (cv.parsed_data?.confidence_score ?? 80) < 60 ? "text-rose-400" : "text-emerald-400"
            }`} />
            <div className="space-y-0.5 font-sans">
              <span className="font-bold block text-[10px] font-mono uppercase tracking-wider">
                {(cv.parsed_data?.confidence_score ?? 80) < 60 ? "Data Belum Terbaca Jelas / Format CV Sulit Diparsing" : "Saran Akurasi Parser"}
              </span>
              <p className="text-zinc-400 font-sans text-xs leading-relaxed">
                {cv.parsed_data.confidence_remarks}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 3. COHESIVE TAB NAVIGATION */}
      <div className="bg-[#090d16] p-1.5 rounded-xl border border-white/[0.04] flex flex-wrap gap-1">
        <button
          onClick={() => setActiveTabSection("summary")}
          className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTabSection === "summary" 
              ? "bg-white/[0.04] border border-white/[0.08] text-white" 
              : "text-zinc-400 hover:text-white hover:bg-white/[0.01]"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Summary</span>
        </button>

        <button
          onClick={() => setActiveTabSection("experience")}
          className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTabSection === "experience" 
              ? "bg-white/[0.04] border border-white/[0.08] text-white" 
              : "text-zinc-400 hover:text-white hover:bg-white/[0.01]"
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Experience</span>
        </button>

        <button
          onClick={() => setActiveTabSection("education")}
          className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTabSection === "education" 
              ? "bg-white/[0.04] border border-white/[0.08] text-white" 
              : "text-zinc-400 hover:text-white hover:bg-white/[0.01]"
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Education</span>
        </button>

        <button
          onClick={() => setActiveTabSection("skills")}
          className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTabSection === "skills" 
              ? "bg-white/[0.04] border border-white/[0.08] text-white" 
              : "text-zinc-400 hover:text-white hover:bg-white/[0.01]"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Skills</span>
        </button>

        <button
          onClick={() => setActiveTabSection("projects")}
          className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTabSection === "projects" 
              ? "bg-white/[0.04] border border-white/[0.08] text-white" 
              : "text-zinc-400 hover:text-white hover:bg-white/[0.01]"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Projects</span>
        </button>

        <button
          onClick={() => setActiveTabSection("certifications")}
          className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTabSection === "certifications" 
              ? "bg-white/[0.04] border border-white/[0.08] text-white" 
              : "text-zinc-400 hover:text-white hover:bg-white/[0.01]"
          }`}
        >
          <CheckCircle className="w-3.5 h-3.5" />
          <span>Certifications</span>
        </button>
      </div>

      {/* 4. SPLIT TWO-COLUMN WORKSPACE COMPARISON */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* LEFT COLUMN: Current/Original Data */}
        <div className="bg-[#090d16] p-5.5 rounded-2xl border border-white/[0.04] space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.03] pb-3">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-wider">
                CURRENT DATA (CV ASLI)
              </span>
            </div>
            <span className="text-[9px] bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded font-mono font-bold uppercase text-amber-400">
              Original Draft
            </span>
          </div>

          <div className="min-h-[220px] space-y-4">
            {/* Summary Left */}
            {activeTabSection === "summary" && (
              <div className="p-4.5 bg-[#030712] rounded-xl border border-white/[0.03] text-zinc-350 leading-relaxed font-sans text-xs whitespace-pre-wrap">
                {recs.summary.original}
              </div>
            )}

            {/* Experience Left */}
            {activeTabSection === "experience" && (
              <div className="space-y-3">
                {recs.experience.length > 0 ? (
                  recs.experience.map((item, idx) => (
                    <div key={idx} className="p-4 bg-[#030712] rounded-xl border border-white/[0.03] space-y-2">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-1">
                        <h5 className="text-xs font-bold text-white font-sans">{item.original.role || "Peran"}</h5>
                        <span className="text-[10px] text-zinc-500 font-mono">{item.original.period}</span>
                      </div>
                      <p className="text-[11px] text-[#06b6d4] font-medium font-mono">{item.original.company}</p>
                      {item.original.tools && item.original.tools.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {item.original.tools.map((t, i) => (
                            <span key={i} className="text-[9px] bg-white/[0.02] text-zinc-400 px-1.5 py-0.5 rounded border border-white/[0.02] font-mono">{t}</span>
                          ))}
                        </div>
                      )}
                      <ul className="list-disc list-inside space-y-1 pt-1.5">
                        {(item.original.highlights || []).map((h, i) => (
                          <li key={i} className="text-[11px] text-zinc-450 leading-relaxed font-sans text-zinc-405">{h}</li>
                        ))}
                      </ul>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-zinc-500 italic font-mono p-4 bg-[#030712] rounded-xl border border-white/[0.03] text-center">
                    Data belum tersedia. Silakan lengkapi riwayat pengalaman kerja pada CV asli Anda.
                  </p>
                )}
              </div>
            )}

            {/* Education Left */}
            {activeTabSection === "education" && (
              <div className="space-y-3 text-zinc-350">
                {recs.education.length > 0 ? (
                  recs.education.map((item, idx) => (
                    <div key={idx} className="p-4 bg-[#030712] rounded-xl border border-white/[0.03] space-y-2">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-1">
                        <h5 className="text-xs font-bold text-white font-sans">{item.original.institution}</h5>
                        <span className="text-[10px] text-zinc-500 font-mono">{item.original.period}</span>
                      </div>
                      <p className="text-[11px] text-[#06b6d4] font-mono">{item.original.degree} {item.original.major}</p>
                      {item.original.gpa && (
                        <p className="text-[10px] text-zinc-350 font-mono">GPA/IPK: <span className="font-bold text-zinc-200">{item.original.gpa}</span></p>
                      )}
                      {item.original.activities && item.original.activities.length > 0 && (
                        <div className="pt-1.5 border-t border-white/[0.02]">
                          <span className="text-[9px] text-zinc-500 font-mono font-bold uppercase tracking-wider block mb-1">Kegiatan / Detail akademik</span>
                          <ul className="list-disc list-inside space-y-0.5">
                            {item.original.activities.map((act, i) => (
                              <li key={i} className="text-[10px] text-zinc-455 font-sans">{act}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-zinc-500 italic font-mono p-4 bg-[#030712] rounded-xl border border-white/[0.03] text-center">
                    Data belum tersedia. Silakan lengkapi bagian riwayat pendidikan pada CV asli Anda.
                  </p>
                )}
              </div>
            )}

            {/* Skills Left */}
            {activeTabSection === "skills" && (
              <div className="p-4 bg-[#030712] rounded-xl border border-white/[0.03] space-y-3">
                {recs.skills.original && recs.skills.original.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {recs.skills.original.map((skill, idx) => (
                      <span key={idx} className="text-[10px] bg-white/[0.03] text-zinc-300 border border-white/[0.02] px-2.5 py-1 rounded font-mono font-semibold flex items-center gap-1">
                        <span className="w-1 h-1 bg-zinc-400 rounded-full"></span>
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-500 italic font-mono p-4 bg-[#030712] rounded-xl border border-white/[0.03] text-center">
                    Data belum tersedia. Silakan cantumkan keahlian teknis secara berurutan dalam CV Anda.
                  </p>
                )}
              </div>
            )}

            {/* Projects Left */}
            {activeTabSection === "projects" && (
              <div className="space-y-3">
                {recs.projects.length > 0 ? (
                  <div className="space-y-2">
                    {recs.projects.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300 bg-white/[0.01] p-2.5 rounded border border-white/[0.01]">
                        <span className="w-5 h-5 rounded-full bg-zinc-800 text-zinc-450 text-[9px] font-bold shrink-0 mt-0.5 flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed font-sans text-zinc-350">{item.original}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-500 italic font-mono p-4 bg-[#030712] rounded-xl border border-white/[0.03] text-center">
                    Data belum tersedia. Silakan cantumkan proyek portofolio Anda.
                  </p>
                )}
              </div>
            )}

            {/* Certifications Left */}
            {activeTabSection === "certifications" && (
              <div className="space-y-3">
                {recs.certifications.length > 0 ? (
                  <div className="space-y-2">
                    {recs.certifications.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300 bg-white/[0.01] p-2.5 rounded border border-white/[0.01]">
                        <span className="w-5 h-5 rounded-full bg-zinc-800 text-zinc-450 text-[9px] font-bold shrink-0 mt-0.5 flex items-center justify-center font-mono">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed font-sans text-zinc-350">{item.original}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-500 italic font-mono p-4 bg-[#030712] rounded-xl border border-white/[0.03] text-center">
                    Data belum tersedia. Silakan sertakan sertifikasi yang Anda miliki.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Optimized Version */}
        <div className="bg-[#090d16] p-5.5 rounded-2xl border border-emerald-500/20 shadow-sm relative space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.03] pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-[10px] font-mono font-black uppercase tracking-widest text-emerald-400">
                OPTIMIZED VERSION
              </span>
            </div>
            
            <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-mono font-bold px-2 py-0.5 rounded uppercase flex items-center gap-1">
              <Check className="w-3 h-3" />
              Professional Rewrite
            </span>
          </div>

          <div className="min-h-[220px] space-y-4">
            {/* Summary Right */}
            {activeTabSection === "summary" && (
              <div className="bg-[#030712] p-4.5 rounded-xl border border-white/[0.03] hover:border-emerald-500/15 transition-all space-y-3 animate-fade-in animate-duration-300">
                <p className="text-xs font-sans text-zinc-150 leading-relaxed whitespace-pre-wrap">
                  {recs.summary.optimized}
                </p>
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => copyToClipboard(recs.summary.optimized, "summary_copy")}
                    className="bg-white hover:bg-zinc-200 text-[#030712] px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    {copiedText === "summary_copy" ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Disalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Salin Ringkasan</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Experience Right */}
            {activeTabSection === "experience" && (
              <div className="space-y-4 animate-fade-in">
                {recs.experience.length > 0 ? (
                  recs.experience.map((item, idx) => (
                    <div key={idx} className="bg-[#030712] p-4 rounded-xl border border-white/[0.03] hover:border-emerald-500/15 transition-all space-y-3">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h5 className="text-xs font-bold text-zinc-100 font-sans">{item.optimized.role || item.original.role}</h5>
                          <p className="text-[10px] text-[#10b981] font-mono leading-tight mt-0.5">{item.optimized.company || item.original.company}</p>
                        </div>
                        
                        <button
                          onClick={() => copyToClipboard((item.optimized.highlights || []).join("\n"), `exp_copy_${idx}`)}
                          className="bg-white hover:bg-zinc-200 text-[#030712] px-2.5 py-1 rounded-md text-[10px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0"
                        >
                          {copiedText === `exp_copy_${idx}` ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>Disalin</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Salin</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="text-[9px] font-mono font-bold uppercase tracking-wider bg-emerald-500/5 text-emerald-400 border border-emerald-500/10 px-2 py-0.5 rounded block w-max select-none">
                        Optimasi XYZ Formula
                      </div>
                      <ul className="list-disc list-inside space-y-1.5 pl-1">
                        {(item.optimized.highlights || item.original.highlights || []).map((h, i) => (
                          <li key={i} className="text-[11px] text-zinc-205 leading-relaxed font-sans">{h}</li>
                        ))}
                      </ul>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-zinc-500 italic font-mono p-4 bg-[#030712] rounded-xl border border-white/[0.03] text-center">
                    Data belum tersedia untuk dioptimasi.
                  </p>
                )}
              </div>
            )}

            {/* Education Right */}
            {activeTabSection === "education" && (
              <div className="space-y-4 animate-fade-in">
                {recs.education.length > 0 ? (
                  recs.education.map((item, idx) => (
                    <div key={idx} className="bg-[#030712] p-4.5 rounded-xl border border-white/[0.03] hover:border-emerald-500/15 transition-all space-y-3">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h5 className="text-xs font-bold text-zinc-100 font-sans">{item.optimized.institution || item.original.institution}</h5>
                          <p className="text-[10px] text-emerald-400 font-mono mt-0.5">{item.optimized.degree || item.original.degree} {item.optimized.major || item.original.major}</p>
                        </div>
                        
                        <button
                          onClick={() => copyToClipboard(`${item.optimized.degree || item.original.degree} ${item.optimized.major || item.original.major} - ${item.optimized.institution || item.original.institution}`, `edu_copy_${idx}`)}
                          className="bg-white hover:bg-zinc-200 text-[#030712] px-2.5 py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                        >
                          {copiedText === `edu_copy_${idx}` ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>Disalin</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Salin</span>
                            </>
                          )}
                        </button>
                      </div>

                      {item.optimized.gpa && (
                        <p className="text-[10px] text-emerald-400 font-mono font-medium">IPK Dioptimasi: <span className="font-bold">{item.optimized.gpa}</span></p>
                      )}
                      {item.optimized.activities && item.optimized.activities.length > 0 && (
                        <div className="pt-1.5 border-t border-white/[0.02]/50 space-y-1">
                          <span className="text-[9px] text-[#10b981] font-mono font-bold uppercase block">Pelajaran Akademik Relevan</span>
                          <ul className="list-disc list-inside space-y-0.5">
                            {item.optimized.activities.map((act, i) => (
                              <li key={i} className="text-[10px] text-zinc-250 font-sans">{act}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-zinc-500 italic font-mono p-4 bg-[#030712] rounded-xl border border-white/[0.03] text-center">
                    Data belum tersedia untuk dioptimasi.
                  </p>
                )}
              </div>
            )}

            {/* Skills Right */}
            {activeTabSection === "skills" && (
              <div className="space-y-4 animate-fade-in">
                <div className="bg-[#030712] p-4.5 rounded-xl border border-white/[0.03] hover:border-emerald-500/15 transition-all space-y-3.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-emerald-400 block uppercase font-bold">
                      Pengelompokan &amp; Penyelarasan Keahlian
                    </span>
                    {recs.skills.optimized && recs.skills.optimized.length > 0 && (
                      <button
                        onClick={() => copyToClipboard(recs.skills.optimized.join(", "), "skills_copy")}
                        className="bg-white hover:bg-zinc-200 text-[#030712] px-2.5 py-1 rounded-md text-[10px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        {copiedText === "skills_copy" ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>Disalin</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Salin Semua</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                  {recs.skills.optimized && recs.skills.optimized.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {recs.skills.optimized.map((skill, idx) => (
                        <span key={idx} className="text-[10px] bg-emerald-500/5 text-emerald-300 border border-emerald-500/10 px-2.5 py-1 rounded font-mono font-semibold flex items-center gap-1 transition-transform">
                          <span className="w-1 h-1 bg-emerald-400 rounded-full"></span>
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-500 italic font-mono text-center py-2">
                      Tidak ada data keahlian untuk dioptimasi.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Projects Right */}
            {activeTabSection === "projects" && (
              <div className="space-y-4 animate-fade-in">
                {recs.projects.length > 0 ? (
                  <div className="space-y-3">
                    {recs.projects.map((item, idx) => (
                      <div key={idx} className="p-3 bg-[#030712] rounded-lg border border-white/[0.02] hover:border-emerald-500/10 space-y-2.5">
                        <div className="flex justify-between items-center gap-3">
                          <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono font-bold uppercase">
                            Proyek {idx + 1}
                          </span>
                          <button
                            onClick={() => copyToClipboard(item.optimized, `proj_copy_${idx}`)}
                            className="bg-white hover:bg-zinc-200 text-[#030712] px-2.5 py-1 rounded text-[9px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0"
                          >
                            {copiedText === `proj_copy_${idx}` ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span>Disalin</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Salin</span>
                              </>
                            )}
                          </button>
                        </div>
                        <p className="text-xs font-mono text-zinc-200 leading-relaxed whitespace-pre-wrap">
                          "{item.optimized}"
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-500 italic font-mono p-4 bg-[#030712] rounded-xl border border-white/[0.03] text-center">
                    Data belum tersedia untuk dioptimasi.
                  </p>
                )}
              </div>
            )}

            {/* Certifications Right */}
            {activeTabSection === "certifications" && (
              <div className="space-y-4 animate-fade-in">
                {recs.certifications.length > 0 ? (
                  <div className="space-y-3">
                    {recs.certifications.map((item, idx) => (
                      <div key={idx} className="p-3 bg-[#030712] rounded-lg border border-white/[0.02] hover:border-emerald-500/10 space-y-2">
                        <div className="flex justify-between items-center gap-3">
                          <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono font-bold uppercase">
                            Sertifikasi {idx + 1}
                          </span>
                          <button
                            onClick={() => copyToClipboard(item.optimized, `cert_copy_${idx}`)}
                            className="bg-white hover:bg-zinc-200 text-[#030712] px-2 py-1 rounded text-[9px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0"
                          >
                            {copiedText === `cert_copy_${idx}` ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span>Disalin</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Salin</span>
                              </>
                            )}
                          </button>
                        </div>
                        <p className="text-xs font-mono text-[#e4e4e7] leading-relaxed">
                          "{item.optimized}"
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-500 italic font-mono p-4 bg-[#030712] rounded-xl border border-white/[0.03] text-center">
                    Data belum tersedia untuk dioptimasi.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* 5. RECOMMENDATIONS PANEL - Short, Clear & Actionable Only */}
      <div className="bg-[#090d16] p-5.5 rounded-2xl border border-white/[0.04] space-y-3">
        <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-widest font-mono flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          Rekomendasi Penyesuaian Karir
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-1">
          {getTabRecommendations().map((rec, i) => (
            <div key={i} className="p-3 bg-[#030712] rounded-xl border border-white/[0.02] flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center text-[10px] font-bold font-mono shrink-0 mt-0.5 animate-pulse">
                {i + 1}
              </span>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                {rec}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 6. CLEAN PERSISTENT COMPLIANCE FOOTER */}
      <div className="bg-[#090d16] p-6 rounded-2xl border border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-xl font-sans text-zinc-400">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <CheckCircle className="w-4.5 h-4.5 text-emerald-400 animate-pulse" />
            Audit Resume Selesai Dievaluasi
          </h4>
          <p className="text-xs leading-normal">
            Bandingkan penulisan asli Anda di kolom kiri dengan hasil penulisan profesional di kolom kanan secara cermat. Salin teks kanan untuk memperbarui CV asli Anda sebelum mendaftar lowongan pekerjaan target Anda.
          </p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto font-mono text-xs">
          <button 
            onClick={() => setActiveTab("linkedin")}
            className="flex-1 md:flex-none py-3 px-6 bg-[#030712] hover:bg-zinc-900 border border-white/[0.04] hover:border-white/[0.08] text-zinc-300 font-bold rounded-lg cursor-pointer transition-all uppercase tracking-wide flex items-center justify-center gap-1.5"
          >
            <span>Optimasi LinkedIn</span>
          </button>
          <button 
            onClick={() => setActiveAnalysis(null)}
            className="flex-1 md:flex-none py-3 px-6 bg-white hover:bg-zinc-200 text-[#030712] font-bold rounded-lg cursor-pointer transition-all uppercase tracking-wide flex items-center justify-center"
          >
            Selesai / Tutup
          </button>
        </div>
      </div>

    </div>
  );
}
