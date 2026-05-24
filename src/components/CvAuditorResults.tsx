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

type CvTabSection = "experience" | "education" | "skills" | "summary";

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

  const [activeTabSection, setActiveTabSection] = useState<CvTabSection>("experience");

  // Filter improvements based on actual sections cleanly
  const expImps = improvements.filter(imp => {
    const s = (imp.section || "").toLowerCase();
    return s.includes("kerja") || s.includes("experience") || s.includes("work") || s.includes("proyek") || s.includes("project") || s.includes("pengalaman") || s.includes("jabatan") || s.includes("karir") || s.includes("intern");
  });

  const eduImps = improvements.filter(imp => {
    const s = (imp.section || "").toLowerCase();
    return s.includes("pendidikan") || s.includes("education") || s.includes("akad") || s.includes("kuliah") || s.includes("sekolah") || s.includes("universitas") || s.includes("grade") || s.includes("ipk") || s.includes("gpa");
  });

  const skillsImps = improvements.filter(imp => {
    const s = (imp.section || "").toLowerCase();
    return s.includes("skill") || s.includes("keahlian") || s.includes("teknologi") || s.includes("tools") || s.includes("bahasa") || s.includes("programming");
  });

  const summaryImps = improvements.filter(imp => {
    const s = (imp.section || "").toLowerCase();
    return s.includes("summary") || s.includes("profile") || s.includes("ringkasan") || s.includes("tentang") || s.includes("about") || s.includes("diri") || s.includes("objektif") || s.includes("eksekutif") || s.includes("headline");
  });

  // Simple, short recommendations based on tab type
  const getTabRecommendations = (): string[] => {
    switch (activeTabSection) {
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
      case "summary":
        return [
          "Buat ringkasan yang singkat, padat, dan langsung menjelaskan keahlian teknis andalan Anda.",
          "Sematkan langsung kaitan antara nilai keahlian utama Anda dengan solusi di perusahaan target.",
          "Hindari kalimat deskriptif umum berlebih seperti 'pekerja keras' atau 'berdedikasi tinggi'."
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
            <span className="text-[9px] bg-amber-500/10 text-amber-450 border border-amber-500/20 px-2 py-0.5 rounded font-mono font-bold uppercase text-amber-400">
              Original Draft
            </span>
          </div>

          <div className="min-h-[220px]">
            {/* Experience Left */}
            {activeTabSection === "experience" && (
              <div className="space-y-3 animate-fade-in text-zinc-300">
                {expImps.length > 0 ? (
                  expImps.map((imp, idx) => (
                    <div key={idx} className="p-3.5 bg-[#030712] rounded-xl border border-white/[0.03] space-y-1">
                      {imp.section && (
                        <span className="text-[8px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded font-mono font-extrabold uppercase block w-max mb-1">
                          {imp.section}
                        </span>
                      )}
                      <p className="text-xs font-mono text-zinc-300 whitespace-pre-wrap leading-relaxed italic">
                        "{imp.before || "Data sebelum tersedia"}"
                      </p>
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
              <div className="space-y-3 animate-fade-in text-zinc-300">
                {eduImps.length > 0 ? (
                  eduImps.map((imp, idx) => (
                    <div key={idx} className="p-3.5 bg-[#030712] rounded-xl border border-white/[0.03] space-y-1">
                      {imp.section && (
                        <span className="text-[8px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded font-mono font-extrabold uppercase block w-max mb-1">
                          {imp.section}
                        </span>
                      )}
                      <p className="text-xs font-mono text-zinc-300 whitespace-pre-wrap leading-relaxed italic">
                        "{imp.before || "Data akademis sebelum tersedia"}"
                      </p>
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
              <div className="space-y-4 animate-fade-in text-zinc-300">
                {skillsImps.length > 0 ? (
                  <div className="space-y-3">
                    {skillsImps.map((imp, idx) => (
                      <div key={idx} className="p-3.5 bg-[#030712] rounded-xl border border-white/[0.03] space-y-1">
                        <span className="text-[9px] font-mono text-xs text-zinc-400 block uppercase font-bold text-cyan-400">
                          {imp.section || "Skill / Kompetensi"}
                        </span>
                        <p className="text-xs font-mono text-zinc-300 leading-normal">
                          {imp.before}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs text-zinc-400 font-medium">Kata kunci/Keahlian terdeteksi dari draf asli Anda:</p>
                    {cv.keyword_gap && cv.keyword_gap.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {cv.keyword_gap.slice(0, 8).map((word, idx) => (
                          <span key={idx} className="text-[10px] bg-zinc-800 text-zinc-350 border border-white/[0.04] px-2.5 py-1 rounded font-mono font-semibold flex items-center gap-1.5">
                            <span className="w-1 h-1 bg-zinc-400 rounded-full"></span>
                            {word}
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
              </div>
            )}

            {/* Summary Left */}
            {activeTabSection === "summary" && (
              <div className="space-y-3 animate-fade-in text-zinc-300">
                {summaryImps.length > 0 ? (
                  summaryImps.map((imp, idx) => (
                    <div key={idx} className="p-3.5 bg-[#030712] rounded-xl border border-white/[0.03] space-y-1">
                      {imp.section && (
                        <span className="text-[8px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded font-mono font-extrabold uppercase block w-max mb-1">
                          {imp.section}
                        </span>
                      )}
                      <p className="text-xs font-mono text-zinc-300 whitespace-pre-wrap leading-relaxed italic">
                        "{imp.before || "Data ringkasan eksekutif sebelum tersedia"}"
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs font-mono text-zinc-300 leading-relaxed whitespace-pre-wrap p-4 bg-[#030712] rounded-xl border border-white/[0.03]">
                    {cvText ? (cvText.length > 300 ? cvText.substring(0, 300) + "..." : cvText) : "Data belum tersedia di CV."}
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
            
            <span className="text-[9px] bg-emerald-505/10 border border-emerald-500/25 text-emerald-400 font-mono font-bold px-2 py-0.5 rounded uppercase flex items-center gap-1">
              <Check className="w-3 h-3" />
              Professional Rewrite
            </span>
          </div>

          <div className="min-h-[220px]">
            {/* Experience Right */}
            {activeTabSection === "experience" && (
              <div className="space-y-4 animate-fade-in">
                {expImps.length > 0 ? (
                  expImps.map((imp, idx) => (
                    <div key={idx} className="bg-[#030712] p-4.5 rounded-xl border border-white/[0.03] hover:border-emerald-500/15 transition-all block space-y-3">
                      <div className="flex justify-between items-start gap-4">
                        <span className="text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono font-bold uppercase">
                          POSISI: {imp.section || "Kerjaan"}
                        </span>
                        
                        <button
                          onClick={() => copyToClipboard(imp.after, `exp_copy_${idx}`)}
                          className="bg-white hover:bg-zinc-200 text-[#030712] px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                        >
                          {copiedText === `exp_copy_${idx}` ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-zinc-500">Disalin</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Salin</span>
                            </>
                          )}
                        </button>
                      </div>

                      <p className="text-xs font-mono text-zinc-100 leading-relaxed">
                        "{imp.after}"
                      </p>
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
                {eduImps.length > 0 ? (
                  eduImps.map((imp, idx) => (
                    <div key={idx} className="bg-[#030712] p-4.5 rounded-xl border border-white/[0.03] hover:border-emerald-500/15 transition-all block space-y-3">
                      <div className="flex justify-between items-start gap-4">
                        <span className="text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono font-bold uppercase">
                          STUDI: {imp.section || "Akademik"}
                        </span>
                        
                        <button
                          onClick={() => copyToClipboard(imp.after, `edu_copy_${idx}`)}
                          className="bg-white hover:bg-zinc-200 text-[#030712] px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                        >
                          {copiedText === `edu_copy_${idx}` ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-605" />
                              <span className="text-zinc-500">Disalin</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Salin</span>
                            </>
                          )}
                        </button>
                      </div>

                      <p className="text-xs font-mono text-zinc-100 leading-relaxed">
                        "{imp.after}"
                      </p>
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
                {skillsImps.length > 0 ? (
                  <div className="space-y-3.5">
                    {skillsImps.map((imp, idx) => (
                      <div key={idx} className="bg-[#030712] p-4.5 rounded-xl border border-white/[0.03] hover:border-emerald-500/15 transition-all block space-y-3">
                        <div className="flex justify-between items-start gap-4">
                          <span className="text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono font-bold uppercase">
                            PEMETAAN: {imp.section || "Keahlian"}
                          </span>
                          
                          <button
                            onClick={() => copyToClipboard(imp.after, `skills_copy_${idx}`)}
                            className="bg-white hover:bg-zinc-200 text-[#030712] px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                          >
                            {copiedText === `skills_copy_${idx}` ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span className="text-[#030712]">Disalin</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Salin</span>
                              </>
                            )}
                          </button>
                        </div>

                        <p className="text-xs font-mono text-zinc-100 leading-relaxed">
                          {imp.after}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-xs text-zinc-400">Rekomendasi grouping format yang rapi &amp; bebas mengarang:</p>
                    <div className="p-4 bg-[#030712] rounded-xl border border-white/[0.03] space-y-3 font-mono text-xs text-zinc-300">
                      <div>
                        <span className="text-white block font-bold mb-0.5">• Keahlian Fungsional Terpilih:</span>
                        <p className="text-zinc-400 font-medium">
                          {cv.keyword_gap && cv.keyword_gap.length > 0 
                            ? cv.keyword_gap.slice(0, 6).join(", ") 
                            : "Menunggu ekstraksi CV"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Summary Right */}
            {activeTabSection === "summary" && (
              <div className="space-y-4 animate-fade-in">
                {summaryImps.length > 0 ? (
                  summaryImps.map((imp, idx) => (
                    <div key={idx} className="bg-[#030712] p-4.5 rounded-xl border border-white/[0.03] hover:border-emerald-500/15 transition-all block space-y-3">
                      <div className="flex justify-between items-start gap-4">
                        <span className="text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono font-bold uppercase">
                          SINTESIS RINGKASAN
                        </span>
                        
                        <button
                          onClick={() => copyToClipboard(imp.after, `summary_copy_${idx}`)}
                          className="bg-white hover:bg-zinc-200 text-[#030712] px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                        >
                          {copiedText === `summary_copy_${idx}` ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-500" />
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

                      <p className="text-xs font-mono text-zinc-100 leading-relaxed whitespace-pre-wrap">
                        "{imp.after}"
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="bg-[#030712] p-4.5 rounded-xl border border-white/[0.03] space-y-3">
                    <p className="text-xs text-zinc-400">Ringkasan Karir Profesional:</p>
                    <p className="text-xs font-mono text-zinc-250 italic">
                      "Tuliskan deskripsi ringkas (3-4 kalimat) yang berisi latar belakang teknis Anda yang bersumber langsung dari CV tanpa menambahkan pencapaian di luar itu."
                    </p>
                  </div>
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
              <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center text-[10px] font-bold font-mono shrink-0 mt-0.5">
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
            <CheckCircle className="w-4.5 h-4.5 text-emerald-400" />
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
