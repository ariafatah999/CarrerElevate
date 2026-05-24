import React, { useState } from "react";
import { Upload, CheckCircle, Sparkles, Plus } from "lucide-react";
import { PREDEFINED_JOBS, renderJobIcon } from "../data/jobs";
import { EXAMPLES } from "../data/examples";

interface CvAuditorInputProps {
  cvText: string;
  setCvText: (text: string) => void;
  jobDescription: string;
  setJobDescription: (text: string) => void;
  selectedJobId: string;
  setSelectedJobId: (id: string) => void;
  customJobTitle: string;
  setCustomJobTitle: (title: string) => void;
  errorMessage: string | null;
  setErrorMessage: (msg: string | null) => void;
  pdfFileName: string | null;
  setPdfFileName: (name: string | null) => void;
  isParsingPdf: boolean;
  setIsParsingPdf: (parsing: boolean) => void;
  handlePdfUpload: (file: File) => Promise<void>;
  handleInjectSampleCv: () => void;
  triggerAudit: () => Promise<void>;
  setLinkedinTargetRole: (role: string) => void;
}

export default function CvAuditorInput({
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
  handlePdfUpload,
  handleInjectSampleCv,
  triggerAudit,
  setLinkedinTargetRole
}: CvAuditorInputProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  return (
    <div className="space-y-10 animate-fade-in text-zinc-100" id="cv-auditor-input">
      {/* Intro Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 bg-zinc-800/40 border border-white/[0.05] text-zinc-300 text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-md font-mono font-semibold">
          Step 1 of 2 • CV Diagnostic System
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          CV ATS Auditor &amp; Deep Parser
        </h2>
        <p className="text-sm text-zinc-400 max-w-2xl leading-relaxed">
          Uraikan dan optimalkan kecocokan berkas portofolio CV Anda terhadap parameter penelusuran rekrutir perusahaan sebelum mengirim aplikasi lamaran kerja.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-950/20 border border-red-900/40 text-red-100 flex items-start gap-4">
          <div className="shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-xs font-mono uppercase tracking-wider text-red-400">Gagal Memproses Dokumen</h4>
            <p className="text-xs text-zinc-300 leading-relaxed">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Dropzone PDF */}
      <div className="bg-[#090d16] p-6 rounded-2xl border border-white/[0.04] space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <label className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#06B6D4] flex items-center gap-2">
            <Upload className="w-4 h-4 text-[#06B6D4]" />
            Dokumen Curriculum Vitae (CV)
          </label>
          <span className="text-[9px] bg-zinc-800 text-zinc-400 border border-white/[0.04] px-2.5 py-0.5 rounded-full font-mono">
            ATS FORMAT ONLY
          </span>
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragOver(false);
            const file = e.dataTransfer.files[0];
            if (file) handlePdfUpload(file);
          }}
          onClick={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "application/pdf";
            input.onchange = (e) => {
              const file = (e.target as HTMLInputElement).files?.[0];
              if (file) handlePdfUpload(file);
            };
            input.click();
          }}
          className={`border-2 border-dashed rounded-xl p-8.5 text-center cursor-pointer transition-all ${
            isDragOver 
              ? "border-[#06b6d4] bg-[#06b6d4]/[0.02]" 
              : pdfFileName 
              ? "border-emerald-500/40 bg-emerald-500/[0.02]" 
              : "border-white/[0.06] bg-[#030712]/50 hover:border-white/[0.12]"
          }`}
        >
          {isParsingPdf ? (
            <div className="flex flex-col items-center space-y-3 py-4">
              <div className="w-8 h-8 border-2 border-zinc-800 border-t-[#06b6d4] rounded-full animate-spin"></div>
              <span className="text-xs font-mono text-zinc-400">AI sedang mengekstrak metadata dokumen...</span>
            </div>
          ) : pdfFileName ? (
            <div className="space-y-2 animate-fade-in py-2">
              <CheckCircle className="w-7 h-7 text-emerald-400 mx-auto" />
              <p className="text-xs font-semibold text-white">Sukses Mengekstrak: {pdfFileName}</p>
              <p className="text-[10px] text-emerald-400 font-mono">Seluruh modul portofolio kualitatif tersimpan sempurna.</p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setPdfFileName(null);
                  setCvText("");
                }}
                className="mt-3 text-[10px] text-zinc-500 hover:text-red-400 hover:underline font-mono cursor-pointer transition-colors"
              >
                Hapus &amp; Ganti File
              </button>
            </div>
          ) : (
            <div className="space-y-2 py-4">
              <Upload className="w-7 h-7 text-zinc-500 mx-auto" />
              <p className="text-xs font-semibold text-zinc-300">Tarik dari folder / drop berkas PDF Anda disini</p>
              <p className="text-[10px] text-zinc-500 font-mono">Atau klik untuk menelusuri folder komputer</p>
            </div>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 justify-between items-start sm:items-center pt-3 border-t border-white/[0.04]">
          <p className="text-[10px] text-zinc-500 font-mono">Format PDF terstruktur memberi tingkat akurasi parser tertinggi.</p>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleInjectSampleCv();
            }}
            className="text-[10px] sm:text-xs font-mono font-bold text-cyan-400 hover:text-[#06b6d4] hover:underline cursor-pointer transition-colors"
          >
            ⚡ Coba Sample CV
          </button>
        </div>
      </div>

      {/* Target Position Grid */}
      <div className="bg-[#090d16] p-6 rounded-2xl border border-white/[0.04] space-y-5">
        <div className="flex justify-between items-center">
          <label className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#06b6d4] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#06b6d4]" />
            Langkah 2: Pilih Sasaran Posisi Pekerjaan
          </label>
          <span className="text-[9px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded font-mono">
            10 PREDEFINED SPACES
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {PREDEFINED_JOBS.map((job) => {
            const isSelected = selectedJobId === job.id;
            return (
              <button
                key={job.id}
                type="button"
                onClick={() => {
                  setSelectedJobId(job.id);
                  setLinkedinTargetRole(job.title);
                }}
                className={`p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between h-[115px] group hover:bg-white/[0.02] ${
                  isSelected
                    ? "bg-white/[0.04] border-white text-white"
                    : "bg-[#030712]/40 text-zinc-400 border-white/[0.04] hover:border-white/[0.12]"
                }`}
              >
                <div className="space-y-2 z-10 w-full">
                  <div className={`p-1 rounded w-fit ${
                    isSelected ? "text-white" : "text-zinc-500 group-hover:text-zinc-400"
                  }`}>
                    {renderJobIcon(job.iconKey)}
                  </div>
                  <h4 className="text-[11.5px] font-bold font-sans line-clamp-2 leading-tight group-hover:text-white transition-colors">
                    {job.title}
                  </h4>
                </div>

                <span className="text-[8px] text-zinc-500 font-mono uppercase tracking-wider block">
                  {job.category}
                </span>
              </button>
            );
          })}

          {/* Custom Option Card */}
          <button
            type="button"
            onClick={() => setSelectedJobId("custom")}
            className={`p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between h-[115px] group hover:bg-white/[0.02] ${
              selectedJobId === "custom"
                ? "bg-white/[0.04] border-white text-white"
                : "bg-[#030712]/40 text-zinc-400 border-white/[0.04] hover:border-white/[0.12]"
            }`}
          >
            <div className="space-y-2 z-10 w-full">
              <div className="p-1 rounded w-fit text-zinc-500 group-hover:text-zinc-400">
                <Plus className="w-4 h-4 text-zinc-400" />
              </div>
              <h4 className="text-[11.5px] font-bold font-sans leading-tight group-hover:text-white transition-colors">
                Posisi Lainnya (Custom Input)
              </h4>
            </div>
            <span className="text-[8px] text-zinc-500 font-mono uppercase tracking-wider block">
              CUSTOM TARGET
            </span>
          </button>
        </div>

        {/* Input for custom style */}
        {selectedJobId === "custom" && (
          <div className="p-4 bg-[#030712]/50 rounded-xl border border-white/[0.04] space-y-2.5 animate-fade-in">
            <label htmlFor="custom-job-title-input" className="text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-widest block">
              Tulis spesifikasi nama jabatan karir target:
            </label>
            <input
              id="custom-job-title-input"
              type="text"
              value={customJobTitle}
              onChange={(e) => setCustomJobTitle(e.target.value)}
              placeholder="Contoh: Staff Keberlanjutan Data, Cloud SysOps, DevOps SecOps..."
              className="w-full bg-[#090d16] text-white px-4 py-2.5 rounded-lg border border-white/[0.05] focus:outline-none focus:border-white text-xs font-mono"
            />
          </div>
        )}

        {/* Calibrated description box */}
        <div className="p-4 bg-[#030712]/40 rounded-xl border border-white/[0.04] space-y-1.5 text-xs text-zinc-400">
          <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider">
            <span>PARAMETER RELEVANSI LOWONGAN:</span>
            <span className="text-white">
              {selectedJobId === "custom" 
                ? (customJobTitle.trim() || "Kunci Posisi Kustom") 
                : PREDEFINED_JOBS.find(j => j.id === selectedJobId)?.title}
            </span>
          </div>
          <p className="text-[11px] leading-relaxed font-sans text-zinc-400">
            {selectedJobId === "custom" 
              ? `Penilaian kesesuaian modul dan parsing data personal akan dioptimalkan sejalan dengan tren kriteria ${customJobTitle.trim() || "'Kustom'"} versi rekrutir terbaru.`
              : PREDEFINED_JOBS.find(j => j.id === selectedJobId)?.description}
          </p>
        </div>
      </div>

      <button
        onClick={triggerAudit}
        className="w-full py-4 bg-white text-[#030712] hover:bg-zinc-200 transition-all font-bold text-xs rounded-xl flex items-center justify-center gap-2.5 cursor-pointer uppercase tracking-wider"
      >
        <Sparkles className="w-4 h-4 text-[#030712]" />
        <span>Jalankan Audit Portofolio CV &amp; Ekstraksi AI</span>
      </button>
    </div>
  );
}
