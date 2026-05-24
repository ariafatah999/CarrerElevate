import React, { useState } from "react";
import { 
  Linkedin, 
  RefreshCcw, 
  ChevronLeft, 
  Sparkles, 
  Copy, 
  BookOpen, 
  CheckCircle, 
  Check, 
  Award,
  Layers,
  AlertCircle,
  Briefcase
} from "lucide-react";
import { AnalysisResponse } from "../types";

interface LinkedinResultsProps {
  activeAnalysis: AnalysisResponse;
  setActiveAnalysis: React.Dispatch<React.SetStateAction<AnalysisResponse | null>>;
  setActiveTab: (tab: "cv-auditor" | "linkedin" | "history") => void;
  copyToClipboard: (text: string, label: string) => void;
  copiedText: string | null;
  linkedinHeadlineLama: string;
  linkedinSummaryLama: string;
  linkedinTargetRole: string;
  linkedinTone: string;
}

type ActiveSection = "experience" | "education" | "skills" | "summary";

export default function LinkedinResults({
  activeAnalysis,
  setActiveAnalysis,
  setActiveTab,
  copyToClipboard,
  copiedText,
  linkedinHeadlineLama,
  linkedinSummaryLama,
  linkedinTargetRole,
  linkedinTone
}: LinkedinResultsProps) {
  const opt = activeAnalysis.linkedin_optimization;
  const cv = activeAnalysis.cv_analysis;

  // Tabs matched to CvAuditorResults format
  const [activeTabSection, setActiveTabSection] = useState<ActiveSection>("experience");

  // Determine original profile references with precise, non-random fallbacks
  const originalHeadline = linkedinHeadlineLama?.trim() || "";
  const originalSummary = linkedinSummaryLama?.trim() || "";
  
  // Extract key technologies or skills detected without adding random technologies
  const detectedSkills = cv.improvements
    ?.filter(imp => {
      const s = (imp.section || "").toLowerCase();
      return s.includes("skill") || s.includes("keahlian") || s.includes("teknologi") || s.includes("tools");
    })
    .map(imp => imp.before)
    .filter(Boolean) || [];

  // Fallback to keyword_gap if improvements doesn't have skill sections
  const skillsToRender = detectedSkills.length > 0 
    ? detectedSkills 
    : (cv.keyword_gap?.slice(0, 8) || []);

  // Simple, short recommendations based on tab type for LinkedIn
  const getTabRecommendations = (): string[] => {
    switch (activeTabSection) {
      case "experience":
        return [
          "Format deskripsi untuk LinkedIn disarankan lebih ringkas daripada di resume.",
          "Gunakan poin pencapaian terukur untuk menyederhanakan pemindaian profil.",
          "Cantumkan nama instansi perusahaan/institusi yang terhubung dengan akun official LinkedIn."
        ];
      case "education":
        return [
          "Sertakan nama universitas dan tahun kelulusan secara akurat.",
          "Tuliskan deskripsi singkat murni untuk memperjelas spesifikasi fokus pembelajaran Anda.",
          "Gunakan pencapaian nyata akademis tanpa melebih-lebihkannya."
        ];
      case "skills":
        return [
          "Tambahkan keahlian teknis terfokus ke seksi pencarian LinkedIn Skills.",
          "Mintalah persetujuan kualifikasi (Endorsements) dari rekan kerja atau atasan jika ada.",
          "Gunakan kategori keahlian yang disetujui standar pencarian LinkedIn."
        ];
      case "summary":
        return [
          "Buat ringkasan yang ramah rekruter serta mencakup kontak profesional di baris akhir.",
          "Pilih variasi Headline yang paling representatif dengan target peran baru Anda.",
          "Atur setelan pencarian menjadi 'Open To Work' agar memicu tanggapan rekruter."
        ];
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-zinc-100" id="linkedin-results-panel">
      
      {/* 1. Header Navigation & Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#090d16] p-4 rounded-xl border border-white/[0.04] backdrop-blur-sm shadow-sm">
        <div className="flex items-center gap-2.5 flex-1">
          <div className="w-8 h-8 rounded-lg bg-[#0077b5] flex items-center justify-center font-bold text-white shadow-sm font-mono text-base">
            in
          </div>
          <div>
            <h4 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-tight">LinkedIn Optimizer Profile</h4>
            <p className="text-[10px] text-cyan-400 font-mono flex items-center gap-1.5 font-bold mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              Profil LinkedIn Selesai Dipetakan
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button 
            onClick={() => {
              setActiveAnalysis((prev: AnalysisResponse | null) => {
                if (!prev) return null;
                return {
                  ...prev,
                  linkedin_optimization: null as any
                };
              });
            }}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 text-xs font-semibold text-zinc-300 hover:text-white bg-[#030712] border border-white/[0.04] px-4.5 py-2.5 rounded-lg cursor-pointer transition-colors"
          >
            <RefreshCcw className="w-3.5 h-3.5 text-zinc-400" />
            <span>Ketik Ulang / Reset Parameter</span>
          </button>
          <button 
            onClick={() => setActiveTab("cv-auditor")}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white bg-[#030712] border border-white/[0.04] px-4.5 py-2.5 rounded-lg cursor-pointer transition-all"
          >
            <ChevronLeft className="w-4 h-4 text-zinc-400" />
            <span>CV Auditor</span>
          </button>
        </div>
      </div>

      {/* 2. LinkedIn Headline Theme Banner */}
      <div className="bg-[#090d16] p-6 rounded-2xl border border-white/[0.04] relative overflow-hidden shadow-sm">
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between relative z-10">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 bg-cyan-500/10 border border-cyan-500/25 text-[#06B6D4] text-[10px] font-mono font-bold px-2.5 py-1 rounded uppercase tracking-widest">
              LINKEDIN RESUME SYNCHRONIZATION
            </div>
            <h3 className="text-xl font-extrabold text-white tracking-tight leading-tight">
              Profil LinkedIn Berbasis Data Riil
            </h3>
            <p className="text-zinc-400 text-xs leading-relaxed max-w-xl font-sans font-medium">
              Tinjau draf tertulis untuk profil LinkedIn Anda. Seluruh usulan di seksi kanan bersandar penuh pada data riwayat hidup asli Anda tanpa penambahan kualifikasi imajiner.
            </p>
          </div>
          <div className="bg-[#030712]/95 border border-white/[0.03] p-4 rounded-xl flex items-center gap-4 shrink-0 shadow-lg w-full lg:w-auto">
            <div className="space-y-1">
              <span className="text-[8px] text-[#06B6D4] font-mono font-bold block uppercase tracking-wide">TARGET ROLE SPECIFIC</span>
              <p className="text-xs font-bold font-mono text-white">{linkedinTargetRole || "Spesialis Profesional"}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span className="text-[10px] text-zinc-500 font-mono">Tone: <strong className="text-zinc-300">{linkedinTone || "Professional"}</strong></span>
              </div>
            </div>
          </div>
        </div>
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
          <span>Summary / About</span>
        </button>
      </div>

      {/* 4. SPLIT COMPARISON WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* LEFT COLUMN: CURRENT PROFILE */}
        <div className="bg-[#090d16] p-5.5 rounded-2xl border border-white/[0.04] space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.03] pb-3">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              <span className="text-[10px] font-mono text-zinc-400 font-extrabold uppercase tracking-wider">
                CURRENT PROFILE (DRAF ASLI)
              </span>
            </div>
            <span className="text-[9px] bg-amber-500/10 text-amber-450 border border-amber-500/10 px-2 py-0.5 rounded font-mono font-semibold text-amber-405 text-amber-400">
              Needs Sync
            </span>
          </div>

          <div className="min-h-[220px]">
            {/* Experience Left */}
            {activeTabSection === "experience" && (
              <div className="space-y-3 animate-fade-in text-zinc-300">
                {cv.improvements?.filter(i => {
                  const s = (i.section || "").toLowerCase();
                  return s.includes("kerja") || s.includes("work") || s.includes("experience") || s.includes("pengalaman");
                }).length > 0 ? (
                  cv.improvements
                    ?.filter(i => {
                      const s = (i.section || "").toLowerCase();
                      return s.includes("kerja") || s.includes("work") || s.includes("experience") || s.includes("pengalaman");
                    })
                    .slice(0, 3)
                    .map((imp, idx) => (
                      <div key={idx} className="p-3.5 bg-[#030712] rounded-xl border border-white/[0.03] space-y-1">
                        <span className="text-[8px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded font-mono font-bold block w-max uppercase mb-1">
                          {imp.section || "Jabatan"}
                        </span>
                        <p className="text-xs font-mono text-zinc-300 leading-relaxed italic">
                          "{imp.before || "Data sebelum tersedia"}"
                        </p>
                      </div>
                    ))
                ) : (
                  <p className="text-xs text-zinc-500 italic font-mono p-4 bg-[#030712] rounded-xl border border-white/[0.03] text-center">
                    Data belum tersedia. Silakan isi riwayat pengalaman Anda.
                  </p>
                )}
              </div>
            )}

            {/* Education Left */}
            {activeTabSection === "education" && (
              <div className="space-y-3 animate-fade-in text-zinc-300">
                {cv.improvements?.filter(i => {
                  const s = (i.section || "").toLowerCase();
                  return s.includes("pendidikan") || s.includes("education") || s.includes("akad") || s.includes("kuliah");
                }).length > 0 ? (
                  cv.improvements
                    ?.filter(i => {
                      const s = (i.section || "").toLowerCase();
                      return s.includes("pendidikan") || s.includes("education") || s.includes("akad") || s.includes("kuliah");
                    })
                    .map((imp, idx) => (
                      <div key={idx} className="p-3.5 bg-[#030712] rounded-xl border border-white/[0.03] space-y-1">
                        <span className="text-[8px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded font-mono block w-max uppercase mb-1 font-bold">
                          {imp.section || "Pendidikan"}
                        </span>
                        <p className="text-xs font-mono text-zinc-300 leading-relaxed italic">
                          "{imp.before || "Data akademis sebelum tersedia"}"
                        </p>
                      </div>
                    ))
                ) : (
                  <p className="text-xs text-zinc-500 italic font-mono p-4 bg-[#030712] rounded-xl border border-white/[0.03] text-center font-bold">
                    Data belum tersedia. Silakan lampirkan tingkat pendidikan Anda.
                  </p>
                )}
              </div>
            )}

            {/* Skills Left */}
            {activeTabSection === "skills" && (
              <div className="space-y-4 animate-fade-in text-zinc-300">
                <span className="text-[10px] font-mono text-zinc-500 block font-bold uppercase">DAFTAR KEAHLIAN TERSEDIA (CV):</span>
                {skillsToRender.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {skillsToRender.map((skText, idx) => (
                      <span key={idx} className="text-[10px] bg-zinc-800 text-zinc-350 border border-white/[0.04] px-2.5 py-1 rounded font-mono font-semibold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full"></span>
                        {skText}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-500 italic font-mono p-4 bg-[#030712] rounded-xl border border-white/[0.03] text-center">
                    Data belum tersedia di CV.
                  </p>
                )}
              </div>
            )}

            {/* Summary Left */}
            {activeTabSection === "summary" && (
              <div className="space-y-4 animate-fade-in text-zinc-300">
                <div className="space-y-2">
                  <span className="text-[9px] font-mono text-zinc-500 block font-bold uppercase">Headline Profil LinkedIn Asli:</span>
                  <div className="p-3.5 bg-[#030712] rounded-xl border border-white/[0.03] text-xs font-mono leading-relaxed text-zinc-400">
                    {originalHeadline || "Headline belum ditentukan di setelan awal."}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[9px] font-mono text-zinc-500 block font-bold uppercase">Seksi About Me Asli:</span>
                  <div className="p-3.5 bg-[#030712] rounded-xl border border-white/[0.03] text-xs font-mono leading-relaxed text-zinc-400 whitespace-pre-wrap">
                    {originalSummary || "Draf About me asli belum dituliskan."}
                  </div>
                </div>
              </div>
            )}
            
          </div>
        </div>

        {/* RIGHT COLUMN: OPTIMIZED VERSION */}
        <div className="bg-[#090d16] p-5.5 rounded-2xl border border-emerald-500/20 shadow-sm relative space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.03] pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono text-zinc-400 font-extrabold uppercase tracking-widest text-[#10B981]">
                OPTIMIZED VERSION
              </span>
            </div>
            
            <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/25 text-[#10B981] font-mono font-bold px-2 py-0.5 rounded uppercase flex items-center gap-1">
              <Check className="w-3 h-3" />
              Sesuai Profil LinkedIn
            </span>
          </div>

          <div className="min-h-[220px]">
            {/* Experience Right Section */}
            {activeTabSection === "experience" && (
              <div className="space-y-4 animate-fade-in text-zinc-100">
                {opt?.experience_recommendations && opt.experience_recommendations.length > 0 ? (
                  opt.experience_recommendations.map((bullet, idx) => (
                    <div key={idx} className="bg-[#030712] p-4.5 rounded-xl border border-white/[0.03] hover:border-emerald-500/15 transition-all block space-y-3">
                      <div className="flex justify-between items-start gap-4">
                        <span className="text-[8px] text-emerald-400 font-mono font-bold uppercase py-0.5 px-1.5 bg-emerald-500/10 rounded border border-emerald-500/20">
                          PILIHAN REWRITE #{idx + 1}
                        </span>
                        
                        <button
                          onClick={() => copyToClipboard(bullet, `exp_copy_${idx}`)}
                          className="bg-white hover:bg-zinc-200 text-[#030712] px-3.5 py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          {copiedText === `exp_copy_${idx}` ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-500" />
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
                      
                      <p className="text-xs font-mono text-zinc-100 leading-relaxed pr-2">
                        "{bullet}"
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-zinc-550 text-xs italic font-mono p-4 bg-[#030712] rounded-xl border border-white/[0.04] text-center">
                    Data belum tersedia untuk dioptimalkan.
                  </p>
                )}
              </div>
            )}

            {/* Education Right Section */}
            {activeTabSection === "education" && (
              <div className="space-y-4 animate-fade-in">
                {opt?.education_recommendations && opt.education_recommendations.length > 0 ? (
                  opt.education_recommendations.map((eduText, idx) => (
                    <div key={idx} className="bg-[#030712] p-4.5 rounded-xl border border-white/[0.03] hover:border-emerald-500/15 transition-all block space-y-3">
                      <div className="flex justify-between items-start gap-4">
                        <span className="text-[8px] text-emerald-400 font-mono font-bold uppercase py-0.5 px-1.5 bg-emerald-500/10 rounded border border-emerald-500/20">
                          PENDIDIKAN OPTIMAL
                        </span>
                        
                        <button
                          onClick={() => copyToClipboard(eduText, `edu_copy_${idx}`)}
                          className="bg-white hover:bg-zinc-200 text-[#030712] px-3.5 py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          {copiedText === `edu_copy_${idx}` ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-505" />
                              <span className="text-zinc-500 font-semibold">Disalin</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Salin</span>
                            </>
                          )}
                        </button>
                      </div>
                      
                      <p className="text-xs font-mono text-white leading-relaxed">
                        "{eduText}"
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="p-4 bg-[#030712] text-xs text-zinc-500 italic font-mono rounded-xl border border-white/[0.04] text-center">
                    Data belum tersedia untuk dioptimalkan.
                  </p>
                )}
              </div>
            )}

            {/* Skills Right Section */}
            {activeTabSection === "skills" && (
              <div className="space-y-4 animate-fade-in text-zinc-100">
                <span className="text-[10px] font-mono text-zinc-400 block font-bold uppercase">REKOMENDASI PENULISAN KEAHLIAN LINKEDIN:</span>
                <div className="p-4.5 bg-[#030712] rounded-xl border border-white/[0.03] space-y-3.5 font-mono text-xs">
                  <div>
                    <span className="text-emerald-400 block font-bold text-[10px] uppercase mb-1">• Kelompok Keahlian Utama (Sesuai CV):</span>
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {skillsToRender.length > 0 ? (
                        skillsToRender.map((skText, idx) => (
                          <span key={idx} className="text-[10px] bg-zinc-800 text-zinc-200 px-2 py-0.5 rounded font-mono border border-white/[0.02]">
                            {skText}
                          </span>
                        ))
                      ) : (
                        <span className="text-zinc-500 italic">Data belum tersedia</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Summary Right Section */}
            {activeTabSection === "summary" && (
              <div className="space-y-5 animate-fade-in">
                {/* Headline Segment */}
                {opt?.headline_recommendations && opt.headline_recommendations.length > 0 && (
                  <div className="space-y-3.5">
                    <span className="text-[10px] font-mono text-zinc-400 block font-bold uppercase">Opsi Headline LinkedIn CTR Tinggi (SEO):</span>
                    {opt.headline_recommendations.slice(0, 2).map((headline, idx) => (
                      <div key={idx} className="bg-[#030712] p-4 rounded-xl border border-white/[0.03] flex justify-between items-center gap-4 transition-all hover:border-emerald-500/10">
                        <div className="flex-1 space-y-1">
                          <span className="text-[8px] font-mono text-emerald-400 block font-bold font-mono">PILIHAN HERO #{idx + 1}</span>
                          <p className="text-xs font-mono text-white leading-normal pr-2">
                            "{headline}"
                          </p>
                        </div>
                        <button
                          onClick={() => copyToClipboard(headline, `headline_copy_${idx}`)}
                          className="bg-white hover:bg-zinc-200 text-[#030712] px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-1 shrink-0"
                        >
                          {copiedText === `headline_copy_${idx}` ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* About me Summary */}
                <div className="space-y-3 pt-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-zinc-400 block font-bold uppercase">Draf Deskripsi Ringkas (About):</span>
                    {opt?.summary_after && (
                      <button
                        onClick={() => copyToClipboard(opt.summary_after || "", "summary_after_copy")}
                        className="bg-white hover:bg-zinc-200 text-[#030712] px-3 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        {copiedText === "summary_after_copy" ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-500" />
                            <span>Selesai Disalin</span>
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
                  <div className="bg-[#030712] p-4.5 rounded-xl border border-white/[0.03] border-l-2 border-emerald-500/40 text-xs leading-relaxed text-zinc-200 font-mono whitespace-pre-wrap">
                    {opt?.summary_after || "Data belum tersedia untuk dioptimalkan."}
                  </div>
                </div>
              </div>
            )}
            
          </div>
        </div>

      </div>

      {/* 5. RECOMMENDATIONS PANEL - Short & Actionable Only */}
      <div className="bg-[#090d16] p-5.5 rounded-2xl border border-white/[0.04] space-y-3">
        <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-widest font-mono flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          Rekomendasi Setelan LinkedIn
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

      {/* 6. Recruiter Visibility & Call to Action Footer */}
      <div className="bg-[#090d16] p-6 rounded-2xl border border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-xl font-sans text-zinc-400">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <CheckCircle className="w-4.5 h-4.5 text-emerald-400" />
            Integrasi Ke Profil LinkedIn Sukses
          </h4>
          <p className="text-xs leading-normal">
            Bandingkan penulisan usulan di draf tab kanan dengan draf kiri secara cermat. Dengan menyalin draf kanan, visibilitas profil LinkedIn Anda dipetakan melompat di portal HRD industri digital.
          </p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto font-mono text-xs">
          <button 
            onClick={() => setActiveTab("cv-auditor")}
            className="flex-1 md:flex-none py-3 px-6 bg-[#030712] hover:bg-zinc-900 border border-white/[0.04] hover:border-white/[0.08] text-zinc-300 font-bold rounded-lg cursor-pointer transition-all uppercase tracking-wide flex items-center justify-center"
          >
            Kembali ke CV Auditor
          </button>
          <button 
            onClick={() => {
              setActiveAnalysis((prev: AnalysisResponse | null) => {
                if (!prev) return null;
                return {
                  ...prev,
                  linkedin_optimization: null as any
                };
              });
            }}
            className="flex-1 md:flex-none py-3 px-6 bg-white hover:bg-zinc-200 text-[#030712] font-bold rounded-lg cursor-pointer transition-all uppercase tracking-wide flex items-center justify-center"
          >
            Reset Parameter
          </button>
        </div>
      </div>

    </div>
  );
}
