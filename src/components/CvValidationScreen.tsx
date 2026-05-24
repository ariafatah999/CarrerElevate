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
  X 
} from "lucide-react";
import { ParsedEducation, ParsedExperience } from "../types";

// Extended interface of parsed CV data for editing in validation stage
export interface ParsedCvResultData {
  candidate_name: string;
  candidate_socials: string[];
  summary?: string;
  education: Array<{
    institution: string;
    degree: string;
    major: string;
    period: string;
    gpa: string;
    activities: string[];
  }>;
  experience: Array<{
    company: string;
    role: string;
    period: string;
    tools: string[];
    highlights: string[];
  }>;
  skills: string[];
  projects: string[];
  certifications: string[];
  achievements: string[];
  validation?: {
    is_education_valid: boolean;
    is_experience_valid: boolean;
    is_skills_valid: boolean;
    missing_sections: string[];
    overall_status: string;
    validation_message: string;
  };
  confidence?: {
    level: string;
    score: number;
    remarks: string;
  };
}

interface CvValidationScreenProps {
  parsedData: ParsedCvResultData;
  onUpdate: (updated: ParsedCvResultData) => void;
  onBack: () => void;
  onSubmitOptimization: (payload: ParsedCvResultData) => Promise<void>;
  loadingOptimize: boolean;
}

export default function CvValidationScreen({
  parsedData,
  onUpdate,
  onBack,
  onSubmitOptimization,
  loadingOptimize
}: CvValidationScreenProps) {
  // Local state for full editability
  const [candidateName, setCandidateName] = useState(parsedData.candidate_name || "Kandidat");
  const [socialsInput, setSocialsInput] = useState((parsedData.candidate_socials || []).join(", "));
  const [summary, setSummary] = useState(parsedData.summary || "");
  const [educations, setEducations] = useState(parsedData.education || []);
  const [experiences, setExperiences] = useState(parsedData.experience || []);
  const [skillsText, setSkillsText] = useState((parsedData.skills || []).join(", "));
  
  const [projects, setProjects] = useState(parsedData.projects || []);
  const [newProject, setNewProject] = useState("");
  
  const [certifications, setCertifications] = useState(parsedData.certifications || []);
  const [newCert, setNewCert] = useState("");
  
  const [achievements, setAchievements] = useState(parsedData.achievements || []);
  const [newAchievement, setNewAchievement] = useState("");

  // Auto validate local state
  const isEduEmpty = educations.length === 0;
  const isExpEmpty = experiences.length === 0;
  const isSkillsEmpty = skillsText.trim() === "";

  const isValid = !isEduEmpty && !isExpEmpty && !isSkillsEmpty;

  // Track any updates back to the parent to keep sync
  const synchronizeState = () => {
    const updated: ParsedCvResultData = {
      candidate_name: candidateName,
      candidate_socials: socialsInput.split(",").map(s => s.trim()).filter(Boolean),
      summary: summary,
      education: educations,
      experience: experiences,
      skills: skillsText.split(",").map(s => s.trim()).filter(Boolean),
      projects: projects,
      certifications: certifications,
      achievements: achievements,
      validation: {
        is_education_valid: !isEduEmpty,
        is_experience_valid: !isExpEmpty,
        is_skills_valid: !isSkillsEmpty,
        missing_sections: [
          ...(isEduEmpty ? ["Pendidikan"] : []),
          ...(isExpEmpty ? ["Pengalaman"] : []),
          ...(isSkillsEmpty ? ["Keahlian"] : [])
        ],
        overall_status: isValid ? "VALID" : "INVALID_MISSING_DATA",
        validation_message: isValid 
          ? "Semua komponen wajib CV berhasil diidentifikasi." 
          : "Beberapa komponen penting karir belum terdeteksi. Harap isi secara manual di bawah."
      },
      confidence: parsedData.confidence || {
        level: isValid ? "Tinggi" : "Rendah",
        score: isValid ? 85 : 40,
        remarks: parsedData.confidence?.remarks || ""
      }
    };
    onUpdate(updated);
    return updated;
  };

  // Run synchronization whenever locals change
  useEffect(() => {
    synchronizeState();
  }, [candidateName, socialsInput, summary, educations, experiences, skillsText, projects, certifications, achievements]);

  // Handler functions for adding/deleting rows
  const addEducation = () => {
    setEducations([
      ...educations,
      { institution: "", degree: "S1", major: "", period: "", gpa: "", activities: [] }
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

  const addProject = () => {
    if (newProject.trim()) {
      setProjects([...projects, newProject.trim()]);
      setNewProject("");
    }
  };

  const removeProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  const addCert = () => {
    if (newCert.trim()) {
      setCertifications([...certifications, newCert.trim()]);
      setNewCert("");
    }
  };

  const removeCert = (index: number) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  const addAchievement = () => {
    if (newAchievement.trim()) {
      setAchievements([...achievements, newAchievement.trim()]);
      setNewAchievement("");
    }
  };

  const removeAchievement = (index: number) => {
    setAchievements(achievements.filter((_, i) => i !== index));
  };

  const handleTriggerOptimize = () => {
    const finalPayload = synchronizeState();
    onSubmitOptimization(finalPayload);
  };

  return (
    <div className="space-y-8 animate-fade-in text-zinc-100" id="cv-validation-screen">
      
      {/* 1. Header with back button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#090d16] p-4 rounded-xl border border-white/[0.04]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#06B6D4] flex items-center justify-center font-bold text-white shadow-sm font-mono">
            V
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-tight font-mono">Verifikasi &amp; Deteksi Data CV</h3>
            <p className="text-[11px] text-[#06b6d4] font-mono flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#06b6d4] animate-pulse"></span>
              Saringan ATS Semantic Parser Terbuka
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

      {/* 2. Validation Status Banner */}
      {!isValid ? (
        <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/20 text-amber-200 space-y-2">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5 font-sans">
              <h4 className="font-bold text-xs font-mono uppercase tracking-wider text-amber-400">
                Peringatan Validitas Deteksi
              </h4>
              <p className="text-xs text-zinc-300 leading-relaxed font-semibold">
                “Data belum berhasil terdeteksi dari CV. Silakan cek format CV atau tambahkan detail manual.”
              </p>
              <p className="text-xs text-zinc-400 mt-1">
                Kami mendeteksi terdapat bagian yang masih kosong di CV Anda:{" "}
                <span className="text-amber-400 font-mono font-bold">
                  {[
                    ...(isEduEmpty ? ["Pendidikan"] : []),
                    ...(isExpEmpty ? ["Pengalaman"] : []),
                    ...(isSkillsEmpty ? ["Keahlian"] : [])
                  ].join(", ")}
                </span>. Silakan isi form di bawah sebelum melanjutkan proses optimasi agar hasil optimasi silsilah akurat dan tidak fiktif.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/25 text-emerald-200">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5 font-sans">
              <h4 className="font-bold text-xs font-mono uppercase tracking-wider text-emerald-400">
                Data CV Berhasil Validasi Otomatis
              </h4>
              <p className="text-xs text-zinc-300 leading-relaxed font-semibold">
                Semua bagian primer (Pendidikan, Pengalaman, dan Keahlian) terdeteksi secara valid. Anda dapat memverifikasi isi data di bawah atau langsung melanjutkan optimasi.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. Form Sections for "Detected CV Data" */}
      <div className="space-y-6">
        
        {/* SECTION A: Personal Info */}
        <div className="bg-[#090d16] p-5.5 rounded-2xl border border-white/[0.04] space-y-4">
          <div className="flex items-center gap-2 border-b border-white/[0.03] pb-3">
            <User className="w-4 h-4 text-[#06b6d4]" />
            <span className="text-[10px] font-mono font-bold text-zinc-300 uppercase tracking-wider">
              1. Personal Info
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-zinc-400 font-bold uppercase block">
                Nama Lengkap Kandidat
              </label>
              <input
                type="text"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                placeholder="cth: Budi Santoso"
                className="w-full bg-[#030712] text-white px-4 py-2.5 rounded-lg border border-white/[0.05] focus:outline-none focus:border-[#06b6d4] text-xs font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono text-zinc-400 font-bold uppercase block">
                Sosmed &amp; Kontak (Pisahkan dengan koma)
              </label>
              <input
                type="text"
                value={socialsInput}
                onChange={(e) => setSocialsInput(e.target.value)}
                placeholder="cth: budi@gmail.com, 081234567, github.com/budi"
                className="w-full bg-[#030712] text-white px-4 py-2.5 rounded-lg border border-white/[0.05] focus:outline-none focus:border-[#06b6d4] text-xs font-mono"
              />
            </div>
          </div>
        </div>

        {/* SECTION A2: Professional Summary */}
        <div className="bg-[#090d16] p-5.5 rounded-2xl border border-white/[0.04] space-y-4">
          <div className="flex items-center gap-2 border-b border-white/[0.03] pb-3">
            <FileText className="w-4 h-4 text-[#06b6d4]" />
            <span className="text-[10px] font-mono font-bold text-zinc-300 uppercase tracking-wider">
              1A. Professional Summary / Deskripsi Diri
            </span>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono text-zinc-400 font-bold uppercase block">
              Ringkasan Profil Karir Profesional
            </label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Tulis ringkasan profil profesional atau biarkan AI mengekstrak otomatis..."
              rows={4}
              className="w-full bg-[#030712] text-zinc-100 px-4 py-3 rounded-lg border border-white/[0.05] focus:outline-none focus:border-[#06b6d4] text-xs font-sans leading-relaxed"
            />
          </div>
        </div>

        {/* SECTION B: Education */}
        <div className="bg-[#090d16] p-5.5 rounded-2xl border border-white/[0.04] space-y-4">
          <div className="flex justify-between items-center border-b border-white/[0.03] pb-3">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#06b6d4]" />
              <span className="text-[10px] font-mono font-bold text-zinc-300 uppercase tracking-wider">
                2. Education (Riwayat Pendidikan)
              </span>
            </div>
            <button
              type="button"
              onClick={addEducation}
              className="inline-flex items-center gap-1.5 text-[10px] uppercase font-mono font-bold text-emerald-400 hover:text-emerald-350 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Tambah Pendidikan</span>
            </button>
          </div>

          {educations.length === 0 ? (
            <p className="text-xs text-amber-450 italic bg-amber-500/5 p-4 rounded-xl border border-amber-500/10 text-center font-mono">
              ⚠️ Pendidikan formal tidak terdeteksi di CV. Klik "Tambah Pendidikan" untuk menambah manual.
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

                  <h5 className="text-[10px] font-mono text-zinc-550 block font-bold uppercase tracking-wider">
                    Sekolah / Universitas #{idx + 1}
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-zinc-400 block">Institusi / Universitas</label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => updateEducation(idx, { institution: e.target.value })}
                        placeholder="cth: STT Terpadu Nurul Fikri"
                        className="w-full bg-[#090d16] text-white px-3 py-1.5 rounded border border-white/[0.04] text-[11px] font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-zinc-400 block">Titel / Derajat (Degree)</label>
                      <input
                        type="text"
                        value={edu.degree || "S1"}
                        onChange={(e) => updateEducation(idx, { degree: e.target.value })}
                        placeholder="cth: S1 / SMA / D3"
                        className="w-full bg-[#090d16] text-white px-3 py-1.5 rounded border border-white/[0.04] text-[11px] font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-zinc-400 block">Jurusan / Program Studi</label>
                      <input
                        type="text"
                        value={edu.major}
                        onChange={(e) => updateEducation(idx, { major: e.target.value })}
                        placeholder="cth: Teknik Informatika"
                        className="w-full bg-[#090d16] text-white px-3 py-1.5 rounded border border-white/[0.04] text-[11px] font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-zinc-400 block">Tahun / Periode Studi</label>
                      <input
                        type="text"
                        value={edu.period || ""}
                        onChange={(e) => updateEducation(idx, { period: e.target.value })}
                        placeholder="cth: 2020 - 2024"
                        className="w-full bg-[#090d16] text-white px-3 py-1.5 rounded border border-white/[0.04] text-[11px] font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-zinc-400 block">IPK / GPA asli</label>
                      <input
                        type="text"
                        value={edu.gpa || ""}
                        onChange={(e) => updateEducation(idx, { gpa: e.target.value })}
                        placeholder="cth: 3.55 (kosongkan jika tidak ada)"
                        className="w-full bg-[#090d16] text-white px-3 py-1.5 rounded border border-white/[0.04] text-[11px] font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-zinc-400 block">Aktivitas / Kegiatan (Pisahkan dengan koma)</label>
                      <input
                        type="text"
                        value={(edu.activities || []).join(", ")}
                        onChange={(e) => updateEducation(idx, { activities: e.target.value.split(",").map(a => a.trim()).filter(Boolean) })}
                        placeholder="BEM, Himpunan, Organisasi, dsb"
                        className="w-full bg-[#090d16] text-white px-3 py-1.5 rounded border border-white/[0.04] text-[11px] font-mono"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECTION C: Experience */}
        <div className="bg-[#090d16] p-5.5 rounded-2xl border border-white/[0.04] space-y-4">
          <div className="flex justify-between items-center border-b border-white/[0.03] pb-3">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#06b6d4]" />
              <span className="text-[10px] font-mono font-bold text-zinc-300 uppercase tracking-wider">
                3. Experience (Pengalaman Kerja / Organisasi)
              </span>
            </div>
            <button
              type="button"
              onClick={addExperience}
              className="inline-flex items-center gap-1.5 text-[10px] uppercase font-mono font-bold text-emerald-400 hover:text-emerald-350 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Tambah Pengalaman</span>
            </button>
          </div>

          {experiences.length === 0 ? (
            <p className="text-xs text-amber-450 italic bg-amber-500/5 p-4 rounded-xl border border-amber-500/10 text-center font-mono">
              ⚠️ Pengalaman kerja/organisasi tidak terdeteksi di CV. Klik "Tambah Pengalaman" untuk menambah manual.
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

                  <h5 className="text-[10px] font-mono text-zinc-550 block font-bold uppercase tracking-wider">
                    Pengalaman #{idx + 1}
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-zinc-400 block">Nama Perusahaan / Organisasi</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => updateExperience(idx, { company: e.target.value })}
                        placeholder="cth: PT Solusi Teknologi"
                        className="w-full bg-[#090d16] text-white px-3 py-1.5 rounded border border-white/[0.04] text-[11px] font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-zinc-400 block">Posisi / Jabatan</label>
                      <input
                        type="text"
                        value={exp.role}
                        onChange={(e) => updateExperience(idx, { role: e.target.value })}
                        placeholder="cth: Frontend Developer"
                        className="w-full bg-[#090d16] text-white px-3 py-1.5 rounded border border-white/[0.04] text-[11px] font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-zinc-400 block">Periode Waktu</label>
                      <input
                        type="text"
                        value={exp.period || ""}
                        onChange={(e) => updateExperience(idx, { period: e.target.value })}
                        placeholder="cth: Jan 2024 - Sekarang"
                        className="w-full bg-[#090d16] text-white px-3 py-1.5 rounded border border-white/[0.04] text-[11px] font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-zinc-400 block">Tools &amp; Stack Terpakai (Pisahkan koma)</label>
                      <input
                        type="text"
                        value={(exp.tools || []).join(", ")}
                        onChange={(e) => updateExperience(idx, { tools: e.target.value.split(",").map(t => t.trim()).filter(Boolean) })}
                        placeholder="cth: React, TypeScript, Tailwind"
                        className="w-full bg-[#090d16] text-white px-3 py-1.5 rounded border border-white/[0.04] text-[11px] font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-zinc-400 block">Pencapaian &amp; Tanggung Jawab (Pisahkan koma/titik)</label>
                      <textarea
                        value={(exp.highlights || []).join("; ")}
                        onChange={(e) => updateExperience(idx, { highlights: e.target.value.split(";").map(h => h.trim()).filter(Boolean) })}
                        placeholder="Mengembangkan tampilan dashboard administrasi; Merekayasa API gateway; Menghemat load time 20%"
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

        {/* SECTION D: Skills */}
        <div className="bg-[#090d16] p-5.5 rounded-2xl border border-white/[0.04] space-y-4">
          <div className="flex items-center gap-2 border-b border-white/[0.03] pb-3">
            <Layers className="w-4 h-4 text-[#06b6d4]" />
            <span className="text-[10px] font-mono font-bold text-zinc-300 uppercase tracking-wider">
              4. Skills (Keahlian asli - Pisahkan dengan koma)
            </span>
          </div>

          <div className="space-y-2">
            {skillsText.trim() === "" && (
              <p className="text-xs text-amber-400 italic font-mono mb-2">
                ⚠️ Mohon tuliskan setidaknya beberapa keahlian utama untuk keakuratan ATS Scanner.
              </p>
            )}
            <textarea
              value={skillsText}
              onChange={(e) => setSkillsText(e.target.value)}
              placeholder="cth: React.js, TypeScript, NodeJS, HTML5, CSS3, SQL, Git, Docker"
              rows={3}
              className="w-full bg-[#030712] text-white px-4 py-2.5 rounded-lg border border-white/[0.05] focus:outline-none focus:border-[#06b6d4] text-xs font-mono"
            />
          </div>
        </div>

        {/* SECTION E: Projects */}
        <div className="bg-[#090d16] p-5.5 rounded-2xl border border-white/[0.04] space-y-4">
          <div className="flex items-center gap-2 border-b border-white/[0.03] pb-3">
            <FileText className="w-4 h-4 text-[#06b6d4]" />
            <span className="text-[10px] font-mono font-bold text-zinc-300 uppercase tracking-wider">
              5. Projects (Proyek Portofolio Nyata)
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={newProject}
                onChange={(e) => setNewProject(e.target.value)}
                placeholder="cth: Aplikasi E-commerce Fullstack dengan NextJS"
                className="flex-1 bg-[#030712] text-white px-4 py-2 rounded-lg border border-white/[0.05] focus:outline-none focus:border-[#06b6d4] text-xs font-mono"
              />
              <button
                type="button"
                onClick={addProject}
                className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg text-xs font-mono font-bold cursor-pointer transition-colors"
              >
                Tambah
              </button>
            </div>

            {projects.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {projects.map((proj, i) => (
                  <span key={i} className="text-xs bg-zinc-900 border border-white/[0.04] pl-3 pr-2 py-1.5 rounded-lg inline-flex items-center gap-1.5 text-zinc-300 font-mono">
                    <span>{proj}</span>
                    <button
                      type="button"
                      onClick={() => removeProject(i)}
                      className="text-zinc-500 hover:text-red-400 shrink-0 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-zinc-500 italic font-mono pt-1">Tidak ada proyek spesifik yang ditambahkan.</p>
            )}
          </div>
        </div>

        {/* SECTION F: Certifications */}
        <div className="bg-[#090d16] p-5.5 rounded-2xl border border-white/[0.04] space-y-4">
          <div className="flex items-center gap-2 border-b border-white/[0.03] pb-3">
            <Award className="w-4 h-4 text-[#06b6d4]" />
            <span className="text-[10px] font-mono font-bold text-zinc-300 uppercase tracking-wider">
              6. Certifications (Sertifikasi Profesional Resmi)
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={newCert}
                onChange={(e) => setNewCert(e.target.value)}
                placeholder="cth: BNSP Junior Web Developer, HACKTIV8 React"
                className="flex-1 bg-[#030712] text-white px-4 py-2 rounded-lg border border-white/[0.05] focus:outline-none focus:border-[#06b6d4] text-xs font-mono"
              />
              <button
                type="button"
                onClick={addCert}
                className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg text-xs font-mono font-bold cursor-pointer transition-colors"
              >
                Tambah
              </button>
            </div>

            {certifications.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {certifications.map((cert, i) => (
                  <span key={i} className="text-xs bg-zinc-900 border border-white/[0.04] pl-3 pr-2 py-1.5 rounded-lg inline-flex items-center gap-1.5 text-zinc-300 font-mono">
                    <span>{cert}</span>
                    <button
                      type="button"
                      onClick={() => removeCert(i)}
                      className="text-zinc-500 hover:text-red-400 shrink-0 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-zinc-500 italic font-mono pt-1">Tidak ada sertifikat spesifik yang ditambahkan.</p>
            )}
          </div>
        </div>

        {/* SECTION G: Achievements */}
        <div className="bg-[#090d16] p-5.5 rounded-2xl border border-white/[0.04] space-y-4">
          <div className="flex items-center gap-2 border-b border-white/[0.03] pb-3">
            <Award className="w-4 h-4 text-[#06b6d4]" />
            <span className="text-[10px] font-mono font-bold text-zinc-300 uppercase tracking-wider">
              7. Achievements (Prestasi / Penghargaan Kompetitif Resmi)
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={newAchievement}
                onChange={(e) => setNewAchievement(e.target.value)}
                placeholder="cth: Juara 1 Hackathon Tingkat Nasional Ristek"
                className="flex-1 bg-[#030712] text-white px-4 py-2 rounded-lg border border-white/[0.05] focus:outline-none focus:border-[#06b6d4] text-xs font-mono"
              />
              <button
                type="button"
                onClick={addAchievement}
                className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg text-xs font-mono font-bold cursor-pointer transition-colors"
              >
                Tambah
              </button>
            </div>

            {achievements.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {achievements.map((ach, i) => (
                  <span key={i} className="text-xs bg-zinc-900 border border-white/[0.04] pl-3 pr-2 py-1.5 rounded-lg inline-flex items-center gap-1.5 text-zinc-300 font-mono">
                    <span>{ach}</span>
                    <button
                      type="button"
                      onClick={() => removeAchievement(i)}
                      className="text-zinc-500 hover:text-red-400 shrink-0 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-zinc-500 italic font-mono pt-1">Tidak ada prestasi spesifik yang ditambahkan.</p>
            )}
          </div>
        </div>

      </div>

      {/* 4. Trigger Optimization Button */}
      <div className="bg-[#090d16] p-5.5 rounded-2xl border border-white/[0.04]">
        <button
          onClick={handleTriggerOptimize}
          disabled={loadingOptimize}
          className="w-full py-4 bg-emerald-500 hover:bg-emerald-450 disabled:bg-emerald-800 text-[#030712] hover:text-[#030712] disabled:text-zinc-400 transition-all font-extrabold text-xs rounded-xl flex items-center justify-center gap-2.5 cursor-pointer uppercase tracking-wider font-mono shadow-md"
        >
          {loadingOptimize ? (
            <>
              <div className="w-4 h-4 border-2 border-zinc-800 border-t-white rounded-full animate-spin"></div>
              <span>Sedang Merumuskan Optimasi XYZ...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-[#030712]" />
              <span>Jalankan Optimasi CV &amp; LinkedIn (Berdasarkan Data Valid)</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
