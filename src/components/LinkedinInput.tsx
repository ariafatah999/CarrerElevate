import React, { useState } from "react";
import { Linkedin, Upload, CheckCircle, Sparkles, ChevronDown } from "lucide-react";

interface LinkedinInputProps {
  linkedinHeadlineLama: string;
  setLinkedinHeadlineLama: (val: string) => void;
  linkedinSummaryLama: string;
  setLinkedinSummaryLama: (val: string) => void;
  linkedinTone: string;
  setLinkedinTone: (val: string) => void;
  linkedinTargetRole: string;
  setLinkedinTargetRole: (val: string) => void;
  linkedinErrorMessage: string | null;
  setLinkedinErrorMessage: (msg: string | null) => void;
  linkedinPdfFileName: string | null;
  setLinkedinPdfFileName: (name: string | null) => void;
  isParsingLinkedinPdf: boolean;
  setIsParsingLinkedinPdf: (parsing: boolean) => void;
  setLinkedinProfileText: (text: string) => void;
  handleLinkedinPdfUpload: (file: File) => Promise<void>;
  triggerLinkedinOptimization: () => Promise<void>;
  handleInjectSampleLinkedin: () => void;
}

export default function LinkedinInput({
  linkedinHeadlineLama,
  setLinkedinHeadlineLama,
  linkedinSummaryLama,
  setLinkedinSummaryLama,
  linkedinTone,
  setLinkedinTone,
  linkedinTargetRole,
  setLinkedinTargetRole,
  linkedinErrorMessage,
  setLinkedinErrorMessage,
  setLinkedinPdfFileName,
  linkedinPdfFileName,
  isParsingLinkedinPdf,
  handleLinkedinPdfUpload,
  triggerLinkedinOptimization,
  handleInjectSampleLinkedin
}: LinkedinInputProps) {
  const [isLinkedinDragOver, setIsLinkedinDragOver] = useState(false);

  return (
    <div className="space-y-10 animate-fade-in text-zinc-100" id="linkedin-input">
      {/* Intro Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 bg-zinc-800/40 border border-white/[0.05] text-zinc-300 text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-md font-mono font-semibold">
          LinkedIn Optimizer • Profile Boost
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          LinkedIn SEO Optimizer
        </h2>
        <p className="text-sm text-zinc-400 max-w-2xl leading-relaxed">
          Tunggangi algoritma pencarian bakat HRD. Temukan rekomendasi baris headline padat informasi, rangkuman About personal kualitatif, serta susunan bullet point karier Anda.
        </p>
      </div>

      {linkedinErrorMessage && (
        <div className="p-4 rounded-xl bg-red-950/20 border border-red-900/40 text-red-100 flex items-start gap-4">
          <div className="shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-xs font-mono uppercase tracking-wider text-red-400">Terjadi Kendala Optimasi</h4>
            <p className="text-xs text-zinc-350 leading-relaxed">{linkedinErrorMessage}</p>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="bg-[#090d16] p-6 rounded-2xl border border-white/[0.04] space-y-6">
        
        {/* Upload Column */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <label className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#06b6d4] flex items-center gap-2">
              <Upload className="w-4 h-4 text-[#06B6D4]" />
              Langkah 1: Unggah Profil PDF Berkas LinkedIn / Resume Anda
            </label>
            <span className="text-[9px] bg-zinc-85 * bg-zinc-800 text-zinc-400 border border-white/[0.04] px-2 py-0.5 rounded font-mono font-semibold">
              EASY LINKEDIN IMPORT
            </span>
          </div>

          {/* Collapsible Info Accordion styled beautifully */}
          <div className="p-4 bg-[#030712]/50 rounded-xl border border-white/[0.03] space-y-2 leading-relaxed text-xs">
            <p className="font-bold text-zinc-200">💡 Cara Mengekspor Profil LinkedIn Anda:</p>
            <ol className="list-decimal pl-4.5 space-y-1 text-zinc-400 font-sans text-[11px] leading-relaxed">
              <li>Kunjungi halaman profil utama akun <strong className="text-white">LinkedIn</strong> Anda.</li>
              <li>Temukan dan klik tombol <strong className="text-white">"More..."</strong> (Selengkapnya) yang terletak di bawah headline Anda.</li>
              <li>Pilih opsi <strong className="text-[#06B6D4]">"Save to PDF"</strong> (Simpan sebagai PDF).</li>
              <li>Seret dokumen PDF hasil ekspor Anda ke dalam area unggah berkas berikut ini.</li>
            </ol>
          </div>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsLinkedinDragOver(true);
            }}
            onDragLeave={() => setIsLinkedinDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsLinkedinDragOver(false);
              const file = e.dataTransfer.files[0];
              if (file) handleLinkedinPdfUpload(file);
            }}
            onClick={() => {
              const input = document.createElement("input");
              input.type = "file";
              input.accept = "application/pdf";
              input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) handleLinkedinPdfUpload(file);
              };
              input.click();
            }}
            className={`border-2 border-dashed rounded-xl p-8.5 text-center cursor-pointer transition-all ${
              isLinkedinDragOver 
                ? "border-[#06b6d4] bg-[#06b6d4]/[0.02]" 
                : linkedinPdfFileName 
                ? "border-emerald-500/40 bg-emerald-500/[0.02]" 
                : "border-white/[0.06] bg-[#030712]/50 hover:border-white/[0.12]"
            }`}
          >
            {isParsingLinkedinPdf ? (
              <div className="flex flex-col items-center space-y-3 py-2">
                <div className="w-8 h-8 border-2 border-zinc-850 border-t-[#06b6d4] rounded-full animate-spin"></div>
                <span className="text-xs font-mono text-zinc-400">AI sedangan mengurai struktur konten riwayat LinkedIn...</span>
              </div>
            ) : linkedinPdfFileName ? (
              <div className="space-y-2 animate-fade-in py-2">
                <CheckCircle className="w-7 h-7 text-emerald-400 mx-auto" />
                <p className="text-xs font-semibold text-white">LinkedIn PDF Berhasil Dibaca: {linkedinPdfFileName}</p>
                <p className="text-[10px] text-emerald-400 font-mono">Seluruh isian headline &amp; ringkasan terdeteksi dan diimpor otomatis.</p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLinkedinPdfFileName(null);
                  }}
                  className="mt-3 text-[10px] text-zinc-500 hover:text-red-400 hover:underline font-mono cursor-pointer transition-colors"
                >
                  Ganti Dokumen PDF
                </button>
              </div>
            ) : (
              <div className="space-y-2 py-4">
                <Upload className="w-7 h-7 text-zinc-500 mx-auto" />
                <p className="text-xs font-semibold text-zinc-300">Tarik dokumen PDF LinkedIn / Resume Anda di sini</p>
                <p className="text-[10px] text-zinc-500 font-mono">Atau klik untuk mengunggah dari penyimpanan lokal</p>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2 justify-between items-start sm:items-center pt-3 border-t border-white/[0.04]">
            <p className="text-[10px] text-zinc-500 font-mono">Ekspor PDF profil LinkedIn memberi tingkat optimasi tertinggi.</p>
            <div className="flex items-center gap-3">
              <a
                href="/samples/sample-linkedin.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] sm:text-xs font-mono text-zinc-400 hover:text-white underline cursor-pointer transition-colors flex items-center gap-1"
              >
                📄 Preview PDF
              </a>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleInjectSampleLinkedin();
                }}
                className="text-[10px] sm:text-xs font-mono font-bold text-cyan-400 hover:text-[#06b6d4] hover:underline cursor-pointer transition-colors"
               >
                ⚡ Coba Sample LinkedIn
              </button>
            </div>
          </div>
        </div>



        {/* Target Position */}
        <div className="space-y-2">
          <label htmlFor="linkedin-target-role" className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#06b6d4]">
            Langkah 2: Target Posisi Pekerjaan Fokus (Target Role)
          </label>
          <input
            id="linkedin-target-role"
            type="text"
            value={linkedinTargetRole}
            onChange={(e) => setLinkedinTargetRole(e.target.value)}
            placeholder="Contoh: Senior Full-Stack React Engineer, Junior Mobile Developer, dll..."
            className="w-full bg-[#030712] text-white px-4 py-3 rounded-xl border border-white/[0.04] focus:outline-none focus:border-white text-xs font-mono font-bold"
          />
        </div>

        {/* Tone Selection */}
        <div className="space-y-2">
          <label htmlFor="linkedin-tone-select" className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#06b6d4]">
            Langkah 3: Karakter Warna Bahasa (Tone)
          </label>
          <select
            id="linkedin-tone-select"
            value={linkedinTone}
            onChange={(e) => setLinkedinTone(e.target.value)}
            className="w-full bg-[#030712] text-zinc-300 px-4 py-3 rounded-xl border border-white/[0.04] focus:outline-none focus:border-white text-xs font-semibold cursor-pointer"
          >
            <option value="Professional">Profesional &amp; Korporat (Clean, Metrik-Sentris, Industri-Teruji)</option>
            <option value="Bold">Berani &amp; Kompetitif (Kreatif, Standout, Ambisius)</option>
            <option value="Tech-Enthusiast">Eksploratif Teknologi (Antusias, Edukatif, Tech-Stack Intensif)</option>
          </select>
        </div>

        <button
          onClick={triggerLinkedinOptimization}
          className="w-full mt-4 py-4 bg-white text-[#030712] hover:bg-zinc-200 transition-all font-bold text-xs rounded-xl flex items-center justify-center gap-2.5 cursor-pointer uppercase tracking-wider"
        >
          <Sparkles className="w-4 h-4 text-[#030712]" />
          <span>Mulai Sinkronisasi LinkedIn &amp; Optimasi AI</span>
        </button>
      </div>
    </div>
  );
}
