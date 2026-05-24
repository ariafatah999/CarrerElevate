import React, { useState, useEffect } from "react";
import { 
  CheckCircle, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  Sparkles, 
  User, 
  Award, 
  Briefcase, 
  Layers, 
  FileText, 
  PlusCircle, 
  ChevronLeft,
  X,
  FileCode,
  Globe,
  Tag
} from "lucide-react";
import { ParsedLinkedinResultData } from "../types";

interface LinkedinValidationScreenProps {
  parsedData: ParsedLinkedinResultData;
  onUpdate: (updated: ParsedLinkedinResultData) => void;
  onBack: () => void;
  onSubmitOptimization: (payload: ParsedLinkedinResultData) => Promise<void>;
  loadingOptimize: boolean;
}

export default function LinkedinValidationScreen({
  parsedData,
  onUpdate,
  onBack,
  onSubmitOptimization,
  loadingOptimize
}: LinkedinValidationScreenProps) {
  // Local state for full editability
  const [currentHeadline, setCurrentHeadline] = useState(parsedData.current_headline || "");
  const [aboutSummary, setAboutSummary] = useState(parsedData.about_summary || "");
  
  const [educations, setEducations] = useState(parsedData.education || []);
  const [experiences, setExperiences] = useState(parsedData.experience || []);
  
  const [skillsText, setSkillsText] = useState((parsedData.skills || []).join(", "));
  const [certificationsText, setCertificationsText] = useState((parsedData.certifications || []).join(", "));
  const [projectsText, setProjectsText] = useState((parsedData.projects || []).join(", "));
  const [achievementsText, setAchievementsText] = useState((parsedData.achievements || []).join(", "));
  const [keywordsText, setKeywordsText] = useState((parsedData.keywords || []).join(", "));

  // Auto check empty or poorly-parsed data
  const isHeadlineEmpty = currentHeadline.trim() === "";
  const isAboutEmpty = aboutSummary.trim() === "";
  const isEduEmpty = educations.length === 0;
  const isExpEmpty = experiences.length === 0;
  const isSkillsEmpty = skillsText.trim() === "";

  const hasAnyData = !isHeadlineEmpty || !isAboutEmpty || !isEduEmpty || !isExpEmpty || !isSkillsEmpty;

  const handleUpdateAndSync = () => {
    const updated: ParsedLinkedinResultData = {
      current_headline: currentHeadline,
      about_summary: aboutSummary,
      education: educations,
      experience: experiences,
      skills: skillsText.split(",").map(s => s.trim()).filter(Boolean),
      certifications: certificationsText.split(",").map(c => c.trim()).filter(Boolean),
      projects: projectsText.split(",").map(p => p.trim()).filter(Boolean),
      achievements: achievementsText.split(",").map(a => a.trim()).filter(Boolean),
      keywords: keywordsText.split(",").map(k => k.trim()).filter(Boolean),
    };
    onUpdate(updated);
    return updated;
  };

  // Run synchronization whenever any form values change
  useEffect(() => {
    handleUpdateAndSync();
  }, [
    currentHeadline, 
    aboutSummary, 
    educations, 
    experiences, 
    skillsText, 
    certificationsText, 
    projectsText, 
    achievementsText, 
    keywordsText
  ]);

  // Handler functions for adding/deleting rows
  const addEducation = () => {
    setEducations([
      ...educations,
      { institution: "", major: "", period: "", gpa: "", activities: [] }
    ]);
  };

  const removeEducation = (index: number) => {
    setEducations(educations.filter((_, i) => i !== index));
  };

  const updateEducation = (index: number, fields: Partial<typeof educations[0]>) => {
    const updated = [...educations];
    updated[index] = { ...updated[index], ...fields };
    setEducations(updated);
  };

  const addExperience = () => {
    setExperiences([
      ...experiences,
      { company: "", role: "", period: "", tools: [], highlights: [] }
    ]);
  };

  const removeExperience = (index: number) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  const updateExperience = (index: number, fields: Partial<typeof experiences[0]>) => {
    const updated = [...experiences];
    updated[index] = { ...updated[index], ...fields };
    setExperiences(updated);
  };

  const handleTriggerOptimize = () => {
    const finalPayload = handleUpdateAndSync();
    onSubmitOptimization(finalPayload);
  };

  return (
    <div className="space-y-8 animate-fade-in text-zinc-100" id="linkedin-validation-screen">
      
      {/* 1. Navigation and Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#090d16] p-4 rounded-xl border border-white/[0.04]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#0077b5] flex items-center justify-center font-bold text-white shadow-sm font-mono text-base">
            in
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-tight font-mono">Verifikasi &amp; Deteksi Data LinkedIn</h3>
            <p className="text-[11px] text-cyan-400 font-mono flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              Langkah 4: Sinkronisasi Data Profil Terdeteksi
            </p>
          </div>
        </div>

        <button 
          onClick={onBack}
          className="flex items-center justify-center gap-1 text-xs font-semibold text-zinc-400 hover:text-white bg-[#030712] border border-white/[0.04] px-4 py-2 rounded-lg cursor-pointer transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>
      </div>

      {/* 2. Intelligent Check: Status Banner */}
      {!hasAnyData ? (
        <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/20 text-red-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-xs font-mono uppercase tracking-wider text-red-400">
                Data Belum Terdeteksi Dari Input
              </h4>
              <p className="text-xs text-zinc-350 leading-relaxed font-semibold">
                Sistem parser tidak berhasil mengekstrak data apa pun secara otomatis. Silakan periksa kembali berkas PDF / draf isian manual yang Anda unggah, atau Anda dapat melengkapinya sendiri pada form isian di bawah.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/25 text-emerald-200">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-xs font-mono uppercase tracking-wider text-emerald-400">
                Pemetaan Data Semantik Sukses
              </h4>
              <p className="text-xs text-zinc-300 leading-relaxed font-semibold">
                Silakan lakukan penyesuaian atau koreksi pada komponen aslinya sebelum memulai generasi draf LinkedIn Premium baru. Ini menjamin rekruter mendapatkan data 100% otentik tanpa fabrikasi fiktif.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. Fields Section */}
      <div className="space-y-6">

        {/* Headline & Summary / About */}
        <div className="bg-[#090d16] p-5.5 rounded-2xl border border-white/[0.04] space-y-4">
          <div className="flex items-center gap-2 border-b border-white/[0.03] pb-3">
            <User className="w-4 h-4 text-cyan-400" />
            <span className="text-[10px] font-mono font-bold text-zinc-300 uppercase tracking-wider">
              1. Headline &amp; Summary / About Me
            </span>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-zinc-400 font-bold uppercase block">
                Current Headline (Headline LinkedIn Saat Ini)
              </label>
              <textarea
                value={currentHeadline}
                onChange={(e) => setCurrentHeadline(e.target.value)}
                placeholder="cth: Junior Frontend Developer | ReactJS &amp; VueJS Enthusiast"
                rows={2}
                className="w-full bg-[#030712] text-white p-3 rounded-lg border border-white/[0.05] focus:outline-none focus:border-cyan-500 text-xs font-mono leading-relaxed resize-none"
              />
              {isHeadlineEmpty && (
                <p className="text-[10px] text-zinc-500 italic font-mono">Data belum terdeteksi dari input.</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-zinc-400 font-bold uppercase block">
                About / Summary (Rangkuman Profil Saat Ini)
              </label>
              <textarea
                value={aboutSummary}
                onChange={(e) => setAboutSummary(e.target.value)}
                placeholder="Tulis draf personal profile summary Anda..."
                rows={4}
                className="w-full bg-[#030712] text-white p-3 rounded-lg border border-white/[0.05] focus:outline-none focus:border-cyan-500 text-xs font-mono leading-relaxed"
              />
              {isAboutEmpty && (
                <p className="text-[10px] text-zinc-500 italic font-mono">Data belum terdeteksi dari input.</p>
              )}
            </div>
          </div>
        </div>

        {/* Experience Section */}
        <div className="bg-[#090d16] p-5.5 rounded-2xl border border-white/[0.04] space-y-4">
          <div className="flex justify-between items-center border-b border-white/[0.03] pb-3">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-cyan-400" />
              <span className="text-[10px] font-mono font-bold text-zinc-300 uppercase tracking-wider">
                2. Experience (Daftar Pengalaman Kerja asli)
              </span>
            </div>
            <button
              type="button"
              onClick={addExperience}
              className="inline-flex items-center gap-1.5 text-[10px] uppercase font-mono font-bold text-emerald-450 hover:text-emerald-400 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Tambah Pengalaman</span>
            </button>
          </div>

          {experiences.length === 0 ? (
            <p className="text-xs text-zinc-500 italic bg-[#030712] p-4 rounded-xl border border-white/[0.02] text-center font-mono">
              Data belum terdeteksi dari input.
            </p>
          ) : (
            <div className="space-y-4">
              {experiences.map((exp, idx) => (
                <div key={idx} className="p-4 bg-[#030712] rounded-xl border border-white/[0.03] relative space-y-3">
                  <button
                    type="button"
                    onClick={() => removeExperience(idx)}
                    className="absolute top-4 right-4 text-zinc-500 hover:text-red-400 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <h5 className="text-[10px] font-mono text-cyan-400/80 block font-bold uppercase tracking-wider">
                    Pekerjaan / Organisasi #{idx + 1}
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-zinc-400 block">Nama Perusahaan / Organisasi</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => updateExperience(idx, { company: e.target.value })}
                        placeholder="cth: PT Solusi Utama"
                        className="w-full bg-[#090d16] text-white px-3 py-1.5 rounded border border-white/[0.04] text-[11px] font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-zinc-400 block">Posisi / Jabatan</label>
                      <input
                        type="text"
                        value={exp.role}
                        onChange={(e) => updateExperience(idx, { role: e.target.value })}
                        placeholder="cth: Fullstack Engineer"
                        className="w-full bg-[#090d16] text-white px-3 py-1.5 rounded border border-white/[0.04] text-[11px] font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-zinc-400 block">Periode Waktu</label>
                      <input
                        type="text"
                        value={exp.period || ""}
                        onChange={(e) => updateExperience(idx, { period: e.target.value })}
                        placeholder="cth: 2023 - 2024"
                        className="w-full bg-[#090d16] text-white px-3 py-1.5 rounded border border-white/[0.04] text-[11px] font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-zinc-400 block">Tools Terkait (Pisahkan koma)</label>
                      <input
                        type="text"
                        value={(exp.tools || []).join(", ")}
                        onChange={(e) => updateExperience(idx, { tools: e.target.value.split(",").map(t => t.trim()).filter(Boolean) })}
                        placeholder="cth: React, Redux, PostgreSQL"
                        className="w-full bg-[#090d16] text-white px-3 py-1.5 rounded border border-white/[0.04] text-[11px] font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-zinc-400 block">Tanggung Jawab / Pencapaian (Pisahkan titik koma ';')</label>
                      <textarea
                        value={(exp.highlights || []).join("; ")}
                        onChange={(e) => updateExperience(idx, { highlights: e.target.value.split(";").map(h => h.trim()).filter(Boolean) })}
                        placeholder="Memperbaiki arsitektur halaman; Menghemat bandwidth 25%"
                        rows={2}
                        className="w-full bg-[#090d16] text-white px-3 py-1.5 rounded border border-white/[0.04] text-[11px] font-mono"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Education Section */}
        <div className="bg-[#090d16] p-5.5 rounded-2xl border border-white/[0.04] space-y-4">
          <div className="flex justify-between items-center border-b border-white/[0.03] pb-3">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-cyan-400" />
              <span className="text-[10px] font-mono font-bold text-zinc-300 uppercase tracking-wider">
                3. Education (Riwayat Pendidikan asli)
              </span>
            </div>
            <button
              type="button"
              onClick={addEducation}
              className="inline-flex items-center gap-1.5 text-[10px] uppercase font-mono font-bold text-emerald-450 hover:text-emerald-400 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Tambah Pendidikan</span>
            </button>
          </div>

          {educations.length === 0 ? (
            <p className="text-xs text-zinc-500 italic bg-[#030712] p-4 rounded-xl border border-white/[0.02] text-center font-mono">
              Data belum terdeteksi dari input.
            </p>
          ) : (
            <div className="space-y-4">
              {educations.map((edu, idx) => (
                <div key={idx} className="p-4 bg-[#030712] rounded-xl border border-white/[0.03] relative space-y-3">
                  <button
                    type="button"
                    onClick={() => removeEducation(idx)}
                    className="absolute top-4 right-4 text-zinc-500 hover:text-red-400 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <h5 className="text-[10px] font-mono text-cyan-400/80 block font-bold uppercase tracking-wider">
                    Sekolah / Universitas #{idx + 1}
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-zinc-400 block">Institusi Pendidikan</label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => updateEducation(idx, { institution: e.target.value })}
                        placeholder="cth: Universitas Indonesia"
                        className="w-full bg-[#090d16] text-white px-3 py-1.5 rounded border border-white/[0.04] text-[11px] font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-zinc-400 block">Jurusan / Program Studi</label>
                      <input
                        type="text"
                        value={edu.major}
                        onChange={(e) => updateEducation(idx, { major: e.target.value })}
                        placeholder="cth: Teknik Elektro"
                        className="w-full bg-[#090d16] text-white px-3 py-1.5 rounded border border-white/[0.04] text-[11px] font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-zinc-400 block">Periode Studi</label>
                      <input
                        type="text"
                        value={edu.period || ""}
                        onChange={(e) => updateEducation(idx, { period: e.target.value })}
                        placeholder="cth: 2019 - 2023"
                        className="w-full bg-[#090d16] text-white px-3 py-1.5 rounded border border-white/[0.04] text-[11px] font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-zinc-400 block">IPK / GPA</label>
                      <input
                        type="text"
                        value={edu.gpa || ""}
                        onChange={(e) => updateEducation(idx, { gpa: e.target.value })}
                        placeholder="cth: 3.82 (kosongkan jika tidak ada)"
                        className="w-full bg-[#090d16] text-white px-3 py-1.5 rounded border border-white/[0.04] text-[11px] font-mono"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Skills */}
        <div className="bg-[#090d16] p-5.5 rounded-2xl border border-white/[0.04] space-y-4">
          <div className="flex items-center gap-2 border-b border-white/[0.03] pb-3">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span className="text-[10px] font-mono font-bold text-zinc-300 uppercase tracking-wider">
              4. Skills (Daftar Keahlian - Pisahkan dengan koma)
            </span>
          </div>
          <textarea
            value={skillsText}
            onChange={(e) => setSkillsText(e.target.value)}
            placeholder="cth: React, Node.js, Python, CSS3, Docker"
            rows={2}
            className="w-full bg-[#030712] text-white p-3 rounded-lg border border-white/[0.05] focus:outline-none focus:border-cyan-500 text-xs font-mono leading-relaxed"
          />
          {isSkillsEmpty && (
            <p className="text-[10px] text-zinc-500 italic font-mono">Data belum terdeteksi dari input.</p>
          )}
        </div>

        {/* Certifications */}
        <div className="bg-[#090d16] p-5.5 rounded-2xl border border-white/[0.04] space-y-4">
          <div className="flex items-center gap-2 border-b border-white/[0.03] pb-3">
            <Award className="w-4 h-4 text-cyan-400" />
            <span className="text-[10px] font-mono font-bold text-zinc-300 uppercase tracking-wider">
              5. Certifications (Sertifikasi &amp; Lisensi - Pisahkan dengan koma)
            </span>
          </div>
          <textarea
            value={certificationsText}
            onChange={(e) => setCertificationsText(e.target.value)}
            placeholder="cth: MTCNA, Google IT Support, AWS Certified Cloud Practitioner"
            rows={2}
            className="w-full bg-[#030712] text-white p-3 rounded-lg border border-white/[0.05] focus:outline-none focus:border-cyan-500 text-xs font-mono leading-relaxed"
          />
          {certificationsText.trim() === "" && (
            <p className="text-[10px] text-zinc-500 italic font-mono">Data belum terdeteksi dari input.</p>
          )}
        </div>

        {/* Projects */}
        <div className="bg-[#090d16] p-5.5 rounded-2xl border border-white/[0.04] space-y-4">
          <div className="flex items-center gap-2 border-b border-white/[0.03] pb-3">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span className="text-[10px] font-mono font-bold text-zinc-300 uppercase tracking-wider">
              6. Projects (Proyek Portofolio - Pisahkan dengan koma)
            </span>
          </div>
          <textarea
            value={projectsText}
            onChange={(e) => setProjectsText(e.target.value)}
            placeholder="cth: Landing page BEM, NXCTF, Mobile App, E-Wallet"
            rows={2}
            className="w-full bg-[#030712] text-white p-3 rounded-lg border border-white/[0.05] focus:outline-none focus:border-cyan-500 text-xs font-mono leading-relaxed"
          />
          {projectsText.trim() === "" && (
            <p className="text-[10px] text-zinc-500 italic font-mono">Data belum terdeteksi dari input.</p>
          )}
        </div>

        {/* Achievements */}
        <div className="bg-[#090d16] p-5.5 rounded-2xl border border-white/[0.04] space-y-4">
          <div className="flex items-center gap-2 border-b border-white/[0.03] pb-3">
            <Award className="w-4 h-4 text-cyan-400" />
            <span className="text-[10px] font-mono font-bold text-zinc-300 uppercase tracking-wider">
              7. Achievements (Prestasi &amp; Penghargaan - Pisahkan dengan koma)
            </span>
          </div>
          <textarea
            value={achievementsText}
            onChange={(e) => setAchievementsText(e.target.value)}
            placeholder="cth: Juara 1 CyberSecurity Hackathon, Top 10 GitHub Contributor Indonesia"
            rows={2}
            className="w-full bg-[#030712] text-white p-3 rounded-lg border border-white/[0.05] focus:outline-none focus:border-cyan-500 text-xs font-mono leading-relaxed"
          />
          {achievementsText.trim() === "" && (
            <p className="text-[10px] text-zinc-500 italic font-mono">Data belum terdeteksi dari input.</p>
          )}
        </div>

        {/* Keywords */}
        <div className="bg-[#090d16] p-5.5 rounded-2xl border border-white/[0.04] space-y-4">
          <div className="flex items-center gap-2 border-b border-white/[0.03] pb-3">
            <Tag className="w-4 h-4 text-cyan-400" />
            <span className="text-[10px] font-mono font-bold text-zinc-300 uppercase tracking-wider">
              8. Keywords (Kata Kunci Utama Industri - Pisahkan dengan koma)
            </span>
          </div>
          <textarea
            value={keywordsText}
            onChange={(e) => setKeywordsText(e.target.value)}
            placeholder="cth: SEO, Web Development, Cloud Computing, Agile Scrum"
            rows={2}
            className="w-full bg-[#030712] text-white p-3 rounded-lg border border-white/[0.05] focus:outline-none focus:border-cyan-500 text-xs font-mono leading-relaxed"
          />
          {keywordsText.trim() === "" && (
            <p className="text-[10px] text-zinc-500 italic font-mono">Data belum terdeteksi dari input.</p>
          )}
        </div>

      </div>

      {/* 4. Trigger Button */}
      <div className="bg-[#090d16] p-5.5 rounded-2xl border border-white/[0.04]">
        <button
          onClick={handleTriggerOptimize}
          disabled={loadingOptimize}
          className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-850 text-[#030712] hover:text-[#030712] disabled:text-zinc-500 transition-all font-extrabold text-xs rounded-xl flex items-center justify-center gap-2.5 cursor-pointer uppercase tracking-wider font-mono shadow-md"
        >
          {loadingOptimize ? (
            <>
              <div className="w-4 h-4 border-2 border-zinc-500 border-t-white rounded-full animate-spin"></div>
              <span>Sedang Mengoptimalkan Profil Berdasarkan Data Riil...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-[#030712]" />
              <span>Jalankan LinkedIn Profile Optimizer (Berdasarkan Data Valid)</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
