import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Routes, Route, Navigate } from "react-router-dom";
import { EXAMPLES } from "./data/examples";
import { AnalysisResponse, AnalysisHistoryItem } from "./types";
import { PREDEFINED_JOBS } from "./data/jobs";
import { ParsedCvResultData } from "./components/CvValidationScreen";
import { ParsedLinkedinResultData } from "./components/LinkedinValidationScreen";

// Modular Sub-Components
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

// Lazy-Loaded Page Containers
const CvAuditorPage = React.lazy(() => import("./pages/CvAuditorPage"));
const LinkedinPage = React.lazy(() => import("./pages/LinkedinPage"));
const HistoryPage = React.lazy(() => import("./pages/HistoryPage"));

export default function App() {
  // Input states
  const [cvText, setCvText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [selectedExampleIndex, setSelectedExampleIndex] = useState<number | null>(null);
  
  // Job Target states
  const [selectedJobId, setSelectedJobId] = useState<string>("frontend");
  const [customJobTitle, setCustomJobTitle] = useState<string>("");

  // Sync JD state internally based on job target
  useEffect(() => {
    if (selectedJobId === "custom") {
      const title = customJobTitle.trim() || "Spesialis IT";
      setJobDescription(
        `Mengemban peran profesional penuh sebagai ${title}.\n` +
        `Bertanggung jawab merancang rancangan teknis berkualitas sesuai standar spesifikasi, memecahkan masalah (debugging), mengoptimalkan performa operational harian, kolaborasi erat dengan jajaran anggota tim internal, serta memastikan standar kualitas tinggi tercapai.`
      );
    } else {
      const matched = PREDEFINED_JOBS.find(j => j.id === selectedJobId);
      if (matched) {
        setJobDescription(matched.description);
      }
    }
  }, [selectedJobId, customJobTitle]);

  // App UI states (Derived dynamically from route URLs)
  const location = useLocation();
  const navigate = useNavigate();

  const activeTab = location.pathname.startsWith("/linkedin")
    ? "linkedin"
    : location.pathname.startsWith("/history")
    ? "history"
    : "cv-auditor";

  const setActiveTab = (tab: "cv-auditor" | "linkedin" | "history") => {
    if (tab === "linkedin") {
      navigate("/linkedin-optimizer");
    } else if (tab === "history") {
      navigate("/history");
    } else {
      navigate("/cv-ats-auditor");
    }
  };

  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [activeAnalysis, setActiveAnalysis] = useState<AnalysisResponse | null>(null);
  const [activeAnalysisMetadata, setActiveAnalysisMetadata] = useState<{ jobTitle: string; companyName: string } | null>(null);

  // Loading & error states
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // CV Parsing, Validation stage, and Optimization loader states
  const [parsedCvResult, setParsedCvResult] = useState<ParsedCvResultData | null>(null);
  const [parsingStage, setParsingStage] = useState<"input" | "validation" | "results">("input");
  const [loadingOptimize, setLoadingOptimize] = useState(false);

  // Overriding active analysis setter to synchronise validation and result stages
  const handleSetActiveAnalysis = (val: AnalysisResponse | null) => {
    setActiveAnalysis(val);
    if (val === null) {
      setParsingStage("input");
      setParsedCvResult(null);
    } else {
      setParsingStage("results");
    }
  };

  // Utility copy state
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Extra input states for PDF file simulation
  const [isParsingPdf, setIsParsingPdf] = useState(false);
  const [pdfFileName, setPdfFileName] = useState<string | null>(null);

  // LinkedIn branding optimizer states
  const [linkedinHeadlineLama, setLinkedinHeadlineLama] = useState("");
  const [linkedinSummaryLama, setLinkedinSummaryLama] = useState("");
  const [linkedinTone, setLinkedinTone] = useState("Professional");
  const [linkedinTargetRole, setLinkedinTargetRole] = useState("Junior Web Developer");
  const [linkedinLoading, setLinkedinLoading] = useState(false);
  const [linkedinErrorMessage, setLinkedinErrorMessage] = useState<string | null>(null);

  // LinkedIn PDF optimizer states
  const [linkedinPdfFileName, setLinkedinPdfFileName] = useState<string | null>(null);
  const [isParsingLinkedinPdf, setIsParsingLinkedinPdf] = useState(false);
  const [linkedinProfileText, setLinkedinProfileText] = useState("");

  // Flow baru states
  const [parsedLinkedinResult, setParsedLinkedinResult] = useState<ParsedLinkedinResultData | null>(null);
  const [linkedinParsingStage, setLinkedinParsingStage] = useState<"input" | "validation" | "results">("input");
  const [loadingLinkedinOptimize, setLoadingLinkedinOptimize] = useState(false);

  // Load history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("career_elevate_history");
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load search history", e);
    }
  }, []);

  // Save history helper
  const saveToHistory = (data: AnalysisResponse, rawJobDesc: string) => {
    try {
      let jobTitle = "Spesialis IT";
      let companyName = "Grup Perusahaan Target";

      if (selectedJobId === "custom") {
        jobTitle = customJobTitle.trim() || "Posisi Custom IT";
        companyName = "Sektor Kustom";
      } else {
        const matched = PREDEFINED_JOBS.find(j => j.id === selectedJobId);
        if (matched) {
          jobTitle = matched.title;
          companyName = matched.category;
        }
      }

      const newItem: AnalysisHistoryItem = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        }),
        jobTitle,
        companyName,
        ats_score: data.cv_analysis.ats_score,
        data
      };

      const updatedHistory = [newItem, ...history];
      setHistory(updatedHistory);
      localStorage.setItem("career_elevate_history", JSON.stringify(updatedHistory));
      setActiveAnalysisMetadata({ jobTitle, companyName });
    } catch (e) {
      console.error("Failed to save item to history", e);
    }
  };

  // Safe error extraction from HTTP response
  const safeGetErrorMessage = async (response: Response, defaultMsg: string): Promise<string> => {
    try {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        return data.error || defaultMsg;
      } else {
        const text = await response.text();
        return text.substring(0, 150) || `${response.status} ${response.statusText}`;
      }
    } catch {
      return `${response.status} ${response.statusText}`;
    }
  };

  // Main audit trigger (Step 1: Parse, Extract Semantic details, and Validate)
  const triggerAudit = async () => {
    if (!cvText.trim()) {
      setErrorMessage("Silakan masukkan teks CV Anda terlebih dahulu.");
      return;
    }
    if (!jobDescription.trim()) {
      setErrorMessage("Silakan masukkan teks Job Description terlebih dahulu.");
      return;
    }

    setErrorMessage(null);
    setLoading(true);

    try {
      const response = await fetch("/api/parse-cv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cvText, jobDescription }),
      });

      if (!response.ok) {
        const errorMsg = await safeGetErrorMessage(response, "Gagal melakukan ekstraksi data semantik CV. Pastikan GEMINI_API_KEY Anda valid.");
        throw new Error(errorMsg);
      }

      const result: ParsedCvResultData = await response.json();
      setParsedCvResult(result);
      setParsingStage("validation");
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Koneksi ke sistem parser gagal. Periksa log server.");
    } finally {
      setLoading(false);
    }
  };

  // Optimization Step (Step 2: Core ATS Matcher + LinkedIn Branding using validated details)
  const triggerOptimizeCv = async (payload: ParsedCvResultData) => {
    if (!jobDescription.trim()) {
      setErrorMessage("Silakan masukkan target deskripsi pekerjaan terlebih dahulu.");
      return;
    }

    setErrorMessage(null);
    setLoadingOptimize(true);

    try {
      const response = await fetch("/api/optimize-cv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ parsedData: payload, jobDescription }),
      });

      if (!response.ok) {
        const errorMsg = await safeGetErrorMessage(response, "Gagal menjalankan optimasi. Pastikan parameter aslinya valid.");
        throw new Error(errorMsg);
      }

      const result: AnalysisResponse = await response.json();

      // Ensure the validated parsed data is synchronized back into the activeAnalysis so results page can render it
      if (result.cv_analysis) {
        result.cv_analysis.parsed_data = {
          summary: payload.summary,
          skills: payload.skills,
          experience: payload.experience,
          education: payload.education,
          certifications: payload.certifications,
          projects: payload.projects,
          confidence_level: payload.confidence?.level || "Tinggi",
          confidence_score: payload.confidence?.score || 90,
          confidence_remarks: payload.confidence?.remarks || ""
        };
      }

      setActiveAnalysis(result);
      saveToHistory(result, jobDescription);
      
      setParsingStage("results");
      // Auto switch target tab focus
      setActiveTab("cv-auditor");
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Koneksi ke backend optimizer gagal.");
    } finally {
      setLoadingOptimize(false);
    }
  };

  // PDF Loading Real Parser Handler
  const handlePdfUpload = async (file: File) => {
    if (!file) return;
    setIsParsingPdf(true);
    setPdfFileName(file.name);
    setErrorMessage(null);
    
    try {
      const formData = new FormData();
      formData.append("pdf", file);

      const response = await fetch("/api/parse-pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorMsg = await safeGetErrorMessage(response, "Gagal memproses unggahan berkas.");
        throw new Error(errorMsg);
      }

      const result = await response.json();
      if (result.warning) {
        setErrorMessage(result.warning);
      }
      
      setCvText(result.text || "");
    } catch (err: any) {
      console.error(err);
      setErrorMessage(`Gagal mendeteksi teks PDF Anda secara otomatis: ${err.message}.`);
    } finally {
      setIsParsingPdf(false);
    }
  };

  // Helper for quick trial testing by fetching and parsing real sample-cv.pdf
  const handleInjectSampleCv = async () => {
    setIsParsingPdf(true);
    setPdfFileName("sample-cv.pdf");
    setErrorMessage(null);
    setCvText("");

    try {
      const response = await fetch("/samples/sample-cv.pdf");
      if (!response.ok) {
        throw new Error("File contoh belum tersedia. Tambahkan file PDF ke folder public/samples.");
      }
      const blob = await response.blob();
      const file = new File([blob], "sample-cv.pdf", { type: "application/pdf" });

      const formData = new FormData();
      formData.append("pdf", file);

      const parseResponse = await fetch("/api/parse-pdf", {
        method: "POST",
        body: formData,
      });

      if (!parseResponse.ok) {
        const errorMsg = await safeGetErrorMessage(parseResponse, "Gagal memproses unggah berkas contoh CV.");
        throw new Error(errorMsg);
      }

      const result = await parseResponse.json();
      if (result.warning) {
        setErrorMessage(result.warning);
      }

      setCvText(result.text || "");
    } catch (err: any) {
      console.error(err);
      const displayMsg = err.message.includes("File contoh belum tersedia")
        ? "File contoh belum tersedia. Tambahkan file PDF ke folder public/samples."
        : `Gagal memproses berkas contoh CV secara otomatis: ${err.message}.`;
      setErrorMessage(displayMsg);
      setPdfFileName(null);
    } finally {
      setIsParsingPdf(false);
    }
  };

  // Helper for quick trial testing by fetching and parsing real sample-linkedin.pdf
  const handleInjectSampleLinkedin = async () => {
    setIsParsingLinkedinPdf(true);
    setLinkedinPdfFileName("sample-linkedin.pdf");
    setLinkedinErrorMessage(null);
    setLinkedinProfileText("");

    try {
      const response = await fetch("/samples/sample-linkedin.pdf");
      if (!response.ok) {
        throw new Error("File contoh belum tersedia. Tambahkan file PDF ke folder public/samples.");
      }
      const blob = await response.blob();
      const file = new File([blob], "sample-linkedin.pdf", { type: "application/pdf" });

      const formData = new FormData();
      formData.append("pdf", file);

      const parseResponse = await fetch("/api/parse-pdf", {
        method: "POST",
        body: formData,
      });

      if (!parseResponse.ok) {
        const errorMsg = await safeGetErrorMessage(parseResponse, "Gagal memproses analisis berkas contoh LinkedIn.");
        throw new Error(errorMsg);
      }

      const result = await parseResponse.json();
      if (result.warning) {
        setLinkedinErrorMessage(result.warning);
      }

      setLinkedinProfileText(result.text || "");
    } catch (err: any) {
      console.error(err);
      const displayMsg = err.message.includes("File contoh belum tersedia")
        ? "File contoh belum tersedia. Tambahkan file PDF ke folder public/samples."
        : `Gagal mengekstrak teks PDF contoh LinkedIn: ${err.message}.`;
      setLinkedinErrorMessage(displayMsg);
      setLinkedinPdfFileName(null);
    } finally {
      setIsParsingLinkedinPdf(false);
    }
  };

  // LinkedIn PDF Loader Handler
  const handleLinkedinPdfUpload = async (file: File) => {
    if (!file) return;
    setIsParsingLinkedinPdf(true);
    setLinkedinPdfFileName(file.name);
    setLinkedinErrorMessage(null);
    
    try {
      const formData = new FormData();
      formData.append("pdf", file);

      const response = await fetch("/api/parse-pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorMsg = await safeGetErrorMessage(response, "Gagal memproses unggah berkas PDF LinkedIn.");
        throw new Error(errorMsg);
      }

      const result = await response.json();
      if (result.warning) {
        setLinkedinErrorMessage(result.warning);
      }
      
      setLinkedinProfileText(result.text || "");
    } catch (err: any) {
      console.error(err);
      setLinkedinErrorMessage(`Gagal mengekstrak teks PDF LinkedIn: ${err.message}. Silakan isi atau edit data manual di kolom bawah.`);
    } finally {
      setIsParsingLinkedinPdf(false);
    }
  };

  // Step 1/2/3: Parse & Extract Semantic LinkedIn Profile information
  const triggerLinkedinParser = async () => {
    if (!linkedinProfileText.trim() && !linkedinHeadlineLama.trim() && !linkedinSummaryLama.trim()) {
      setLinkedinErrorMessage("Silakan unggah dokumen PDF LinkedIn Anda atau isi kolom manual.");
      return;
    }
    setLinkedinErrorMessage(null);
    setLinkedinLoading(true);

    try {
      const response = await fetch("/api/parse-linkedin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          headlineLama: linkedinHeadlineLama,
          summaryLama: linkedinSummaryLama,
          profileText: linkedinProfileText,
          targetRole: linkedinTargetRole
        })
      });

      if (!response.ok) {
        const errorMsg = await safeGetErrorMessage(response, "Gagal mengurai profil LinkedIn dengan AI.");
        throw new Error(errorMsg);
      }

      const result = await response.json();
      setParsedLinkedinResult(result);
      setLinkedinParsingStage("validation");
    } catch (err: any) {
      console.error(err);
      setLinkedinErrorMessage(err.message || "Gagal menghubungi server untuk mendeteksi profil LinkedIn.");
    } finally {
      setLinkedinLoading(false);
    }
  };

  // Step 5: Optimize LinkedIn based on Validated semantic data
  const triggerLinkedinOptimize = async (payload: ParsedLinkedinResultData) => {
    setLinkedinErrorMessage(null);
    setLoadingLinkedinOptimize(true);

    try {
      const response = await fetch("/api/optimize-linkedin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          parsedData: payload,
          tone: linkedinTone,
          targetRole: linkedinTargetRole
        })
      });

      if (!response.ok) {
        const errorMsg = await safeGetErrorMessage(response, "Gagal mengoptimasi LinkedIn berdasarkan data tervalidasi.");
        throw new Error(errorMsg);
      }

      const result = await response.json();

      // Update active analysis with the newly returned LinkedIn optimizations
      setActiveAnalysis((prev) => {
        const fallbackCv = prev?.cv_analysis || {
          ats_score: 85,
          keyword_gap: payload.skills.slice(0, 4),
          improvements: [
            {
              section: "Pengalaman & Profil Utama",
              main_issue: "Headline lama kurang merepresentasikan kekuatan teknis.",
              before: payload.current_headline,
              after: result.headline_recommendations[0],
              reason: "Persona profesional berbasis SEO dan CTR modern."
            }
          ]
        };
        return {
          cv_analysis: fallbackCv,
          linkedin_optimization: result
        };
      });

      setActiveAnalysisMetadata({ jobTitle: linkedinTargetRole, companyName: "LinkedIn Optimizer" });
      setLinkedinParsingStage("results");
    } catch (err: any) {
      console.error(err);
      setLinkedinErrorMessage(err.message || "Gagal menghubungi server untuk optimasi akhir LinkedIn.");
    } finally {
      setLoadingLinkedinOptimize(false);
    }
  };

  // Delete item from history
  const deleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = history.filter(item => item.id !== id);
    setHistory(updated);
    localStorage.setItem("career_elevate_history", JSON.stringify(updated));
    if (activeAnalysis && history.find(h => h.id === id)?.data === activeAnalysis) {
      setActiveAnalysis(null);
      setActiveAnalysisMetadata(null);
    }
  };

  // Helper copy to clipboard
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => {
      setCopiedText(null);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex font-sans">
      
      {/* 1. STICKY LEFT SIDEBAR */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeAnalysis={activeAnalysis}
        history={history}
      />

      {/* 2. MAIN SCROLLABLE CONTENT BODY */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header Information Indicator */}
        <Header activeAnalysisMetadata={activeAnalysisMetadata} />

        {/* Dynamic Content Area based on Tab */}
        <div className="p-8 max-w-5xl mx-auto w-full flex-1">
          
          <React.Suspense fallback={
            <div className="flex flex-col items-center justify-center p-12 min-h-[400px]">
              <div className="w-10 h-10 border-4 border-t-cyan-500 border-slate-800 rounded-full animate-spin"></div>
              <p className="mt-4 text-xs font-mono text-slate-405">Memuat komponen halaman...</p>
            </div>
          }>
            <Routes>
              {/* Fallback routes and redirects */}
              <Route path="/" element={<Navigate replace to="/cv-ats-auditor" />} />
              <Route path="/cv-auditor" element={<Navigate replace to="/cv-ats-auditor" />} />
              <Route path="/linkedin" element={<Navigate replace to="/linkedin-optimizer" />} />

              {/* Core Feature Paths */}
              <Route 
                path="/cv-ats-auditor" 
                element={
                  <CvAuditorPage
                    loading={loading}
                    activeAnalysis={activeAnalysis}
                    setActiveAnalysis={handleSetActiveAnalysis}
                    setActiveTab={setActiveTab}
                    copyToClipboard={copyToClipboard}
                    copiedText={copiedText}
                    cvText={cvText}
                    setCvText={setCvText}
                    jobDescription={jobDescription}
                    setJobDescription={setJobDescription}
                    selectedJobId={selectedJobId}
                    setSelectedJobId={setSelectedJobId}
                    customJobTitle={customJobTitle}
                    setCustomJobTitle={setCustomJobTitle}
                    errorMessage={errorMessage}
                    setErrorMessage={setErrorMessage}
                    pdfFileName={pdfFileName}
                    setPdfFileName={setPdfFileName}
                    isParsingPdf={isParsingPdf}
                    setIsParsingPdf={setIsParsingPdf}
                    handlePdfUpload={handlePdfUpload}
                    handleInjectSampleCv={handleInjectSampleCv}
                    triggerAudit={triggerAudit}
                    setLinkedinTargetRole={setLinkedinTargetRole}

                    parsedCvResult={parsedCvResult}
                    setParsedCvResult={setParsedCvResult}
                    parsingStage={parsingStage}
                    setParsingStage={setParsingStage}
                    triggerOptimizeCv={triggerOptimizeCv}
                    loadingOptimize={loadingOptimize}
                  />
                }
              />

              <Route 
                path="/linkedin-optimizer" 
                element={
                  <LinkedinPage
                    linkedinLoading={linkedinLoading}
                    activeAnalysis={activeAnalysis}
                    setActiveAnalysis={handleSetActiveAnalysis}
                    setActiveTab={setActiveTab}
                    linkedinHeadlineLama={linkedinHeadlineLama}
                    setLinkedinHeadlineLama={setLinkedinHeadlineLama}
                    linkedinSummaryLama={linkedinSummaryLama}
                    setLinkedinSummaryLama={setLinkedinSummaryLama}
                    linkedinTone={linkedinTone}
                    setLinkedinTone={setLinkedinTone}
                    linkedinTargetRole={linkedinTargetRole}
                    setLinkedinTargetRole={setLinkedinTargetRole}
                    linkedinErrorMessage={linkedinErrorMessage}
                    setLinkedinErrorMessage={setLinkedinErrorMessage}
                    linkedinPdfFileName={linkedinPdfFileName}
                    setLinkedinPdfFileName={setLinkedinPdfFileName}
                    isParsingLinkedinPdf={isParsingLinkedinPdf}
                    setIsParsingLinkedinPdf={setIsParsingLinkedinPdf}
                    setLinkedinProfileText={setLinkedinProfileText}
                    handleLinkedinPdfUpload={handleLinkedinPdfUpload}
                    triggerLinkedinParser={triggerLinkedinParser}
                    handleInjectSampleLinkedin={handleInjectSampleLinkedin}

                    parsedLinkedinResult={parsedLinkedinResult}
                    setParsedLinkedinResult={setParsedLinkedinResult}
                    linkedinParsingStage={linkedinParsingStage}
                    setLinkedinParsingStage={setLinkedinParsingStage}
                    triggerLinkedinOptimize={triggerLinkedinOptimize}
                    loadingLinkedinOptimize={loadingLinkedinOptimize}

                    copyToClipboard={copyToClipboard}
                    copiedText={copiedText}
                  />
                }
              />

              <Route 
                path="/history" 
                element={
                  <HistoryPage
                    history={history}
                    setActiveTab={setActiveTab}
                    setActiveAnalysis={handleSetActiveAnalysis}
                    setActiveAnalysisMetadata={setActiveAnalysisMetadata}
                    deleteHistoryItem={deleteHistoryItem}
                  />
                }
              />

              {/* Automatic Wildcard redirection */}
              <Route path="*" element={<Navigate replace to="/cv-ats-auditor" />} />
            </Routes>
          </React.Suspense>

        </div>


      </main>

    </div>
  );
}
