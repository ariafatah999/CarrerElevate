import React, { useState } from "react";
import { 
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
  Briefcase,
  User,
  FileText
} from "lucide-react";
import { AnalysisResponse, ParsedLinkedinResultData } from "../types";

interface LinkedinResultsProps {
  activeAnalysis: AnalysisResponse;
  setActiveAnalysis: React.Dispatch<React.SetStateAction<AnalysisResponse | null>>;
  setActiveTab: (tab: "cv-auditor" | "linkedin" | "history") => void;
  copyToClipboard: (text: string, label: string) => void;
  copiedText: string | null;
  parsedLinkedinResult: ParsedLinkedinResultData;
  linkedinTargetRole: string;
  linkedinTone: string;
}

type ActiveSection = "headline" | "about" | "experience" | "education" | "skills" | "certifications" | "projects" | "achievements";

export default function LinkedinResults({
  activeAnalysis,
  setActiveAnalysis,
  setActiveTab,
  copyToClipboard,
  copiedText,
  parsedLinkedinResult,
  linkedinTargetRole,
  linkedinTone
}: LinkedinResultsProps) {
  const opt = activeAnalysis.linkedin_optimization;

  const [activeTabSection, setActiveTabSection] = useState<ActiveSection>("headline");

  const originalHeadline = parsedLinkedinResult.current_headline?.trim() || "";
  const originalSummary = parsedLinkedinResult.about_summary?.trim() || "";

  const getTabRecommendations = (): string[] => {
    switch (activeTabSection) {
      case "headline":
        return [
          "Gunakan headline yang mengandung kata kunci pencarian rekruter (SEO friendly).",
          "Opsi CTR tinggi memadukan peran utama, spesialisasi teknis, dan value pencapaian."
        ];
      case "about":
        return [
          "Tulis rincian dengan nada personal tetapi profesional (storytelling).",
          "Sertakan daftar teknologi utama dan kontak/email di akhir draf About me."
        ];
      case "experience":
        return [
          "Fokus pada tindakan (action verbs) dan pencapaian metrik bila ada.",
          "Gunakan poin rincian terukur agar mudah dipindai rekruter dalam 6 detik."
        ];
      case "education":
        return [
          "Cantumkan institusi, jurusan, serta IPK jika di atas rata-rata kelompok.",
          "Anda dapat memperjelas kegiatan eksternal atau himpunan untuk memperkuat profil."
        ];
      case "skills":
        return [
          "Urutkan daftar keahlian utama agar sesuai dengan filter pencarian HRD.",
          "Fokuskan pada rumpun teknologi modern yang divalidasi di pasar kerja."
        ];
      case "certifications":
        return [
          "Sertifikasi resmi seperti MTCNA, CCNA, atau AWS mempercepat seleksi berkas.",
          "Sebutkan instansi penerbit lisensi secara resmi untuk memicu badge LinkedIn."
        ];
      case "projects":
        return [
          "Showcase proyek nyata yang menunjukkan penguasaan teknologi Anda.",
          "Sebutkan kontribusi krusial Anda dan tech-stack yang dipakai di proyek bersangkutan."
        ];
      case "achievements":
        return [
          "Tulis prestasi Anda dengan menyisipkan angka keberhasilan konkret jika ada.",
          "Gunakan penulisan formal dan sebutkan tingkat persaingan demi menaikkan kredibilitas."
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
            <span>CV ATS Auditor</span>
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
          onClick={() => setActiveTabSection("headline")}
          className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTabSection === "headline" 
              ? "bg-white/[0.04] border border-white/[0.08] text-white" 
              : "text-zinc-400 hover:text-white hover:bg-white/[0.01]"
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Headline</span>
        </button>

        <button
          onClick={() => setActiveTabSection("about")}
          className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTabSection === "about" 
              ? "bg-white/[0.04] border border-white/[0.08] text-white" 
              : "text-zinc-400 hover:text-white hover:bg-white/[0.01]"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>About</span>
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
          onClick={() => setActiveTabSection("certifications")}
          className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTabSection === "certifications" 
              ? "bg-white/[0.04] border border-white/[0.08] text-white" 
              : "text-zinc-400 hover:text-white hover:bg-white/[0.01]"
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Certifications</span>
        </button>

        <button
          onClick={() => setActiveTabSection("projects")}
          className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTabSection === "projects" 
              ? "bg-white/[0.04] border border-white/[0.08] text-white" 
              : "text-zinc-400 hover:text-white hover:bg-white/[0.01]"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Projects</span>
        </button>

        <button
          onClick={() => setActiveTabSection("achievements")}
          className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTabSection === "achievements" 
              ? "bg-white/[0.04] border border-white/[0.08] text-white" 
              : "text-zinc-400 hover:text-white hover:bg-white/[0.01]"
          }`}
        >
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>Achievements</span>
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
                CURRENT PROFILE (DATA UTAMA)
              </span>
            </div>
            <span className="text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/10 px-2 py-0.5 rounded font-mono font-semibold">
              Needs Sync
            </span>
          </div>

          <div className="min-h-[220px]">
            {/* Headline Left */}
            {activeTabSection === "headline" && (
              <div className="space-y-3 animate-fade-in text-zinc-300">
                {originalHeadline ? (
                  <div className="p-3.5 bg-[#030712] rounded-xl border border-white/[0.03] text-xs font-mono text-zinc-300">
                    {originalHeadline}
                  </div>
                ) : (
                  <p className="text-xs text-amber-500 italic font-mono p-4 bg-[#030712] rounded-xl border border-white/[0.03] text-center">
                    Data belum terdeteksi dari input.
                  </p>
                )}
              </div>
            )}

            {/* About Left */}
            {activeTabSection === "about" && (
              <div className="space-y-3 animate-fade-in text-zinc-300">
                {originalSummary ? (
                  <div className="p-3.5 bg-[#030712] rounded-xl border border-white/[0.03] text-xs font-mono text-zinc-350 whitespace-pre-wrap leading-relaxed">
                    {originalSummary}
                  </div>
                ) : (
                  <p className="text-xs text-amber-500 italic font-mono p-4 bg-[#030712] rounded-xl border border-white/[0.03] text-center">
                    Data belum terdeteksi dari input.
                  </p>
                )}
              </div>
            )}

            {/* Experience Left */}
            {activeTabSection === "experience" && (
              <div className="space-y-3 animate-fade-in text-zinc-300">
                {parsedLinkedinResult.experience && parsedLinkedinResult.experience.length > 0 ? (
                  <div className="space-y-3">
                    {parsedLinkedinResult.experience.map((exp, idx) => (
                      <div key={idx} className="p-4 bg-[#030712] rounded-xl border border-white/[0.03] space-y-2">
                        <div className="flex justify-between items-start">
                          <h5 className="text-xs font-bold font-mono text-cyan-400">{exp.role}</h5>
                          <span className="text-[9px] font-mono text-zinc-550">{exp.period}</span>
                        </div>
                        <p className="text-[10px] font-mono text-zinc-400 font-semibold">{exp.company}</p>
                        {exp.tools && exp.tools.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {exp.tools.map((tool, i) => (
                              <span key={i} className="text-[9px] bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded font-mono">
                                {tool}
                              </span>
                            ))}
                          </div>
                        )}
                        {exp.highlights && exp.highlights.length > 0 && (
                          <ul className="list-disc pl-4 space-y-1 text-[11px] text-zinc-400">
                            {exp.highlights.map((high, i) => (
                              <li key={i}>{high}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-amber-500 italic font-mono p-4 bg-[#030712] rounded-xl border border-white/[0.03] text-center-imp text-center w-full">
                    Data belum terdeteksi dari input.
                  </p>
                )}
              </div>
            )}

            {/* Education Left */}
            {activeTabSection === "education" && (
              <div className="space-y-3 animate-fade-in text-zinc-300">
                {parsedLinkedinResult.education && parsedLinkedinResult.education.length > 0 ? (
                  <div className="space-y-3">
                    {parsedLinkedinResult.education.map((edu, idx) => (
                      <div key={idx} className="p-4 bg-[#030712] rounded-xl border border-white/[0.03] space-y-1">
                        <div className="flex justify-between items-start">
                          <h5 className="text-xs font-bold font-mono text-cyan-400">{edu.institution}</h5>
                          <span className="text-[9px] font-mono text-zinc-500">{edu.period}</span>
                        </div>
                        <p className="text-[10px] font-mono text-zinc-300">{edu.major}</p>
                        {edu.gpa && (
                          <p className="text-[10px] font-mono text-zinc-400 font-semibold">IPK: {edu.gpa}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-amber-500 italic font-mono p-4 bg-[#030712] rounded-xl border border-white/[0.03] text-center-imp text-center w-full">
                    Data belum terdeteksi dari input.
                  </p>
                )}
              </div>
            )}

            {/* Skills Left */}
            {activeTabSection === "skills" && (
              <div className="space-y-4 animate-fade-in text-zinc-300">
                {parsedLinkedinResult.skills && parsedLinkedinResult.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {parsedLinkedinResult.skills.map((skill, idx) => (
                      <span key={idx} className="text-[10px] bg-[#030712] text-zinc-300 border border-white/[0.04] px-2.5 py-1.5 rounded font-mono font-medium flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-amber-500 italic font-mono p-4 bg-[#030712] rounded-xl border border-white/[0.03] text-center w-full">
                    Data belum terdeteksi dari input.
                  </p>
                )}
              </div>
            )}

            {/* Certifications Left */}
            {activeTabSection === "certifications" && (
              <div className="space-y-4 animate-fade-in text-zinc-300">
                {parsedLinkedinResult.certifications && parsedLinkedinResult.certifications.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {parsedLinkedinResult.certifications.map((cert, idx) => (
                      <span key={idx} className="text-[10px] bg-[#030712] text-zinc-300 border border-white/[0.04] px-2.5 py-1.5 rounded font-mono font-medium flex items-center gap-1.5">
                        <Award className="w-3 h-3 text-cyan-400 animate-pulse" />
                        {cert}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-amber-500 italic font-mono p-4 bg-[#030712] rounded-xl border border-white/[0.03] text-center w-full">
                    Data belum terdeteksi dari input.
                  </p>
                )}
              </div>
            )}

            {/* Projects Left */}
            {activeTabSection === "projects" && (
              <div className="space-y-4 animate-fade-in text-zinc-300">
                {parsedLinkedinResult.projects && parsedLinkedinResult.projects.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {parsedLinkedinResult.projects.map((proj, idx) => (
                      <span key={idx} className="text-[10px] bg-[#030712] text-zinc-300 border border-white/[0.04] px-2.5 py-1.5 rounded font-mono font-medium flex items-center gap-1.5">
                        <FileText className="w-3 h-3 text-cyan-400" />
                        {proj}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-amber-500 italic font-mono p-4 bg-[#030712] rounded-xl border border-white/[0.03] text-center w-full">
                    Data belum terdeteksi dari input.
                  </p>
                )}
              </div>
            )}

            {/* Achievements Left */}
            {activeTabSection === "achievements" && (
              <div className="space-y-4 animate-fade-in text-zinc-300">
                {parsedLinkedinResult.achievements && parsedLinkedinResult.achievements.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {parsedLinkedinResult.achievements.map((ach, idx) => (
                      <span key={idx} className="text-[10px] bg-[#030712] text-zinc-300 border border-white/[0.04] px-2.5 py-1.5 rounded font-mono font-medium flex items-center gap-1.5">
                        <Award className="w-3 h-3 text-amber-500" />
                        {ach}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-amber-500 italic font-mono p-4 bg-[#030712] rounded-xl border border-white/[0.03] text-center w-full">
                    Data belum terdeteksi dari input.
                  </p>
                )}
              </div>
            )}
            
          </div>
        </div>

        {/* RIGHT COLUMN: OPTIMIZED VERSION */}
        <div className="bg-[#090d16] p-5.5 rounded-2xl border border-emerald-500/20 shadow-sm relative space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.03] pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-[#10B981]">
                OPTIMIZED VERSION
              </span>
            </div>
            
            <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/25 text-[#10B981] font-mono font-bold px-2 py-0.5 rounded uppercase flex items-center gap-1">
              <Check className="w-3 h-3" />
              Sesuai Profil LinkedIn
            </span>
          </div>

          <div className="min-h-[220px]">
            {/* Headline Right Section */}
            {activeTabSection === "headline" && (
              <div className="space-y-3.5 animate-fade-in">
                {opt?.headline_recommendations && opt.headline_recommendations.length > 0 ? (
                  <div className="space-y-3.5">
                    {opt.headline_recommendations.map((headline, idx) => (
                      <div key={idx} className="bg-[#030712] p-4 rounded-xl border border-white/[0.03] flex justify-between items-center gap-4 transition-all hover:border-emerald-500/10">
                        <div className="flex-1 space-y-1">
                          <span className="text-[8px] font-mono text-emerald-400 block font-bold">PILIHAN HERO #{idx + 1}</span>
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
                ) : (
                  <p className="text-zinc-500 text-xs italic font-mono p-4 bg-[#030712] rounded-xl border border-white/[0.04] text-center">
                    Data belum terdeteksi dari input.
                  </p>
                )}
              </div>
            )}

            {/* About Right Section */}
            {activeTabSection === "about" && (
              <div className="space-y-5 animate-fade-in">
                {opt?.summary_after ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono text-zinc-400 block font-bold uppercase">Draf Deskripsi Ringkas (About):</span>
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
                    </div>
                    <div className="bg-[#030712] p-4.5 rounded-xl border border-white/[0.03] border-l-2 border-emerald-500/40 text-xs leading-relaxed text-zinc-200 font-mono whitespace-pre-wrap">
                      {opt.summary_after}
                    </div>
                  </div>
                ) : (
                  <p className="text-zinc-500 text-xs italic font-mono p-4 bg-[#030712] rounded-xl border border-white/[0.04] text-center">
                    Data belum terdeteksi dari input.
                  </p>
                )}
              </div>
            )}

            {/* Experience Right Section */}
            {activeTabSection === "experience" && (
              <div className="space-y-4 animate-fade-in text-zinc-100">
                {opt?.experience_recommendations && opt.experience_recommendations.length > 0 && opt.experience_recommendations[0] !== "Data belum terdeteksi dari input." && parsedLinkedinResult.experience.length > 0 ? (
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
                  <p className="text-zinc-500 text-xs italic font-mono p-4 bg-[#030712] rounded-xl border border-white/[0.04] text-center w-full">
                    Data belum terdeteksi dari input.
                  </p>
                )}
              </div>
            )}

            {/* Education Right Section */}
            {activeTabSection === "education" && (
              <div className="space-y-4 animate-fade-in">
                {opt?.education_recommendations && opt.education_recommendations.length > 0 && opt.education_recommendations[0] !== "Data belum terdeteksi dari input." && parsedLinkedinResult.education.length > 0 ? (
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
                              <Check className="w-3 h-3 text-emerald-500" />
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
                  <p className="p-4 bg-[#030712] text-xs text-zinc-500 italic font-mono rounded-xl border border-white/[0.04] text-center w-full">
                    Data belum terdeteksi dari input.
                  </p>
                )}
              </div>
            )}

            {/* Skills Right Section */}
            {activeTabSection === "skills" && (
              <div className="space-y-4 animate-fade-in text-zinc-100">
                {opt?.skills_recommendations && opt.skills_recommendations.length > 0 && opt.skills_recommendations[0] !== "Data belum terdeteksi dari input." ? (
                  <div className="bg-[#030712] p-4 rounded-xl border border-white/[0.03] space-y-3">
                    <p className="text-[10px] font-mono text-zinc-400 leading-normal">
                      Rekomendasi kata kunci optimasi & pengelompokkan skill LinkedIn hasil analisis:
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {opt.skills_recommendations.map((skText, idx) => (
                        <span key={idx} className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-[#10B981] px-2.5 py-1 rounded font-mono font-semibold flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
                          {skText}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : parsedLinkedinResult.skills && parsedLinkedinResult.skills.length > 0 ? (
                  <div className="bg-[#030712] p-4 rounded-xl border border-white/[0.03] space-y-3">
                    <p className="text-[10px] font-mono text-zinc-400 leading-normal">
                      Rekomendasi kata kunci optimasi & pengelompokkan skill LinkedIn yang selaras untuk meningkatkan pencocokan filter rekruter pada peran target <strong className="text-emerald-400">{linkedinTargetRole}</strong>:
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {parsedLinkedinResult.skills.map((skText, idx) => (
                        <span key={idx} className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-[#10B981] px-2.5 py-1 rounded font-mono font-semibold flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
                          {skText}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="p-4 bg-[#030712] text-xs text-zinc-550 italic font-mono rounded-xl border border-white/[0.04] text-center w-full">
                    Data belum terdeteksi dari input.
                  </p>
                )}
              </div>
            )}

            {/* Certifications Right Section */}
            {activeTabSection === "certifications" && (
              <div className="space-y-4 animate-fade-in text-zinc-100">
                {opt?.certifications_recommendations && opt.certifications_recommendations.length > 0 && opt.certifications_recommendations[0] !== "Data belum terdeteksi dari input." ? (
                  <div className="bg-[#030712] p-4 rounded-xl border border-white/[0.03] space-y-3">
                    <p className="text-[10px] font-mono text-zinc-400 leading-normal">
                      Rekomendasi penulisan sertifikasi pihak ketiga untuk profil LinkedIn Anda:
                    </p>
                    <div className="space-y-2">
                      {opt.certifications_recommendations.map((cert, idx) => (
                        <div key={idx} className="p-2.5 bg-zinc-900 border border-white/[0.02] rounded text-xs font-mono text-zinc-200 flex items-start gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{cert}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : parsedLinkedinResult.certifications && parsedLinkedinResult.certifications.length > 0 ? (
                  <div className="bg-[#030712] p-4 rounded-xl border border-white/[0.03] space-y-3">
                    <p className="text-[10px] font-mono text-[#10B981] font-semibold leading-normal flex items-center gap-1.5 uppercase tracking-wide">
                      <Check className="w-3.5 h-3.5" /> Sertifikasi Anda Terasosiasi Sukses!
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {parsedLinkedinResult.certifications.map((cert, idx) => (
                        <span key={idx} className="text-[10px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/15 px-2.5 py-1.5 rounded font-mono font-semibold flex items-center gap-1.5">
                          <CheckCircle className="w-3 h-3 text-emerald-450" />
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="p-4 bg-[#030712] text-xs text-zinc-550 italic font-mono rounded-xl border border-white/[0.04] text-center w-full">
                    Data belum terdeteksi dari input.
                  </p>
                )}
              </div>
            )}

            {/* Projects Right Section */}
            {activeTabSection === "projects" && (
              <div className="space-y-4 animate-fade-in text-zinc-100">
                {opt?.projects_recommendations && opt.projects_recommendations.length > 0 && opt.projects_recommendations[0] !== "Data belum terdeteksi dari input." ? (
                  <div className="bg-[#030712] p-4 rounded-xl border border-white/[0.03] space-y-3">
                    <p className="text-[10px] font-mono text-zinc-400 leading-normal">
                      Rincian formula penulisan portofolio proyek terstruktur untuk LinkedIn:
                    </p>
                    <div className="space-y-2">
                      {opt.projects_recommendations.map((proj, idx) => (
                        <div key={idx} className="p-2.5 bg-[#030712] border border-white/[0.04] rounded text-xs font-mono text-zinc-200 space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] text-emerald-400 uppercase font-bold font-mono">Draf Optimasi Proyek {idx + 1}</span>
                            <button
                              onClick={() => copyToClipboard(proj, `proj_copy_${idx}`)}
                              className="bg-white hover:bg-zinc-200 text-[#030712] px-2 py-0.5 rounded text-[8px] font-mono font-bold cursor-pointer transition-all shrink-0"
                            >
                              {copiedText === `proj_copy_${idx}` ? "Disalin" : "Salin"}
                            </button>
                          </div>
                          <p className="text-zinc-200 leading-relaxed">"{proj}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : parsedLinkedinResult.projects && parsedLinkedinResult.projects.length > 0 ? (
                  <div className="bg-[#030712] p-4 rounded-xl border border-white/[0.03] space-y-3">
                    <p className="text-[10px] font-mono text-zinc-400 leading-normal">
                      Rekomendasi taktik memajang proyek portofolio Anda di bagian Project LinkedIn agar menarik rekruter:
                    </p>
                    <div className="space-y-2">
                      {parsedLinkedinResult.projects.map((proj, idx) => (
                        <div key={idx} className="p-2 bg-zinc-900 border border-white/[0.02] rounded text-[11px] font-mono text-zinc-350 flex items-start gap-1 justify-between">
                          <div className="flex-1">
                            • <strong className="text-emerald-400">{proj}</strong>: Jabarkan tech stack dan tunjukkan link fungsional/GitHub live.
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="p-4 bg-[#030712] text-xs text-zinc-550 italic font-mono rounded-xl border border-white/[0.04] text-center w-full">
                    Data belum terdeteksi dari input.
                  </p>
                )}
              </div>
            )}

            {/* Achievements Right Section */}
            {activeTabSection === "achievements" && (
              <div className="space-y-4 animate-fade-in text-zinc-100">
                {opt?.achievements_recommendations && opt.achievements_recommendations.length > 0 && opt.achievements_recommendations[0] !== "Data belum terdeteksi dari input." ? (
                  <div className="bg-[#030712] p-4 rounded-xl border border-white/[0.03] space-y-3">
                    <p className="text-[10px] font-mono text-zinc-400 leading-normal">
                      Usulan penulisan prestasi & penghargaan karir terukur di LinkedIn:
                    </p>
                    <div className="space-y-2">
                      {opt.achievements_recommendations.map((ach, idx) => (
                        <div key={idx} className="p-2.5 bg-[#030712] border border-white/[0.04] rounded text-xs font-mono text-zinc-200 space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] text-emerald-400 uppercase font-bold font-mono">Draf Optimasi Prestasi {idx + 1}</span>
                            <button
                              onClick={() => copyToClipboard(ach, `ach_copy_${idx}`)}
                              className="bg-white hover:bg-zinc-200 text-[#030712] px-2 py-0.5 rounded text-[8px] font-mono font-bold cursor-pointer transition-all shrink-0"
                            >
                              {copiedText === `ach_copy_${idx}` ? "Disalin" : "Salin"}
                            </button>
                          </div>
                          <p className="text-zinc-200 leading-relaxed">"{ach}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : parsedLinkedinResult.achievements && parsedLinkedinResult.achievements.length > 0 ? (
                  <div className="bg-[#030712] p-4 rounded-xl border border-white/[0.03] space-y-3">
                    <p className="text-[10px] font-mono text-zinc-400 leading-normal">
                      Daftar prestasi terdeteksi yang siap disalin ke bagian Honors &amp; Awards LinkedIn Anda:
                    </p>
                    <div className="flex flex-wrap gap-1.5 font-mono">
                      {parsedLinkedinResult.achievements.map((ach, idx) => (
                        <span key={idx} className="text-[10px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/15 px-2.5 py-1.5 rounded font-mono font-semibold flex items-center gap-1.5">
                          <CheckCircle className="w-3 h-3 text-emerald-450" />
                          {ach}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="p-4 bg-[#030712] text-xs text-zinc-550 italic font-mono rounded-xl border border-white/[0.04] text-center w-full">
                    Data belum terdeteksi dari input.
                  </p>
                )}
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
            Kembali ke CV ATS Auditor
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
