import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import multer from "multer";
import { PDFParse } from "pdf-parse";

dotenv.config();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Initialize Gemini API client lazily to prevent crashing on boot if key is temporarily missing.
let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("WARNING: GEMINI_API_KEY is not defined. AI features will fail until a key is supplied in the Settings > Secrets panel.");
      throw new Error("GEMINI_API_KEY is required but was not found. Please set it in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        }
      }
    });
  }
  return aiClient;
}

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "15mb" }));

// 1. Core endpoint for CV extraction & LinkedIn profile audit
app.post("/api/analyze", async (req, res) => {
  try {
    const { cvText, jobDescription } = req.body;

    if (!cvText || !cvText.trim()) {
      res.status(400).json({ error: "Curriculum Vitae (CV) text is required." });
      return;
    }
    if (!jobDescription || !jobDescription.trim()) {
      res.status(400).json({ error: "Job Description (JD) text is required." });
      return;
    }

    const ai = getGeminiClient();

    const systemInstruction = `Kamu adalah HRD Tech Recruiter Senior, ATS Expert, Real-time Semantic Parser, dan Konsultan Karier di sistem "CareerElevate AI".
Tugas utamamu adalah melakukan audit CV dengan akurasi maksimal, melakukan ekstraksi data semantik (Semantic Parsing), dan mengoptimalkan dokumen tersebut beserta profil LinkedIn pengguna tanpa mengarang data fiktif.

BERIKUT ADALAH PRINSIP DAN ATURAN EKSTRAKSI SEMANTIK YANG HARUS DIPATUHI:
1. INTELLIGENT PARSER & EXTRACTOR:
   - Pahami variasi format CV (bullet list, tabel teks, deskripsi singkat, singkatan, salah ketik ringan/typo seperti "javasript" -> JavaScript, dan campuran bahasa Indonesia & Inggris). 
   - Jangan hanya bergantung pada judul bagian/heading (seperti "SKILLS"). Kamu wajib mengaitkan dan mengekstrak info atau keterampilan (skills) yang tersebar di deskripsi proyek, riwayat kerja, deskripsi ringkasan, maupun prestasi akademik secara cerdas.
   - Deteksi semua keahlian tersembunyi: Jika pengguna menulis "mengelola server Linux", ini berarti mereka juga memiliki skill "Linux", "Server Administration", "Infrastructure", dan "DevOps basic". Jika pengguna menulis "Deployment menggunakan Docker dan GitHub Actions", deteksi sebagai "Docker", "CI/CD", dan "GitHub Actions".

2. PRIORITAS DATA ASLI & ANTI ARTIFAK PALSU (FAITHFUL/CORRECTNESS GUARANTEE):
   - JAWABLAH DENGAN JUJUR BERDASARKAN BERKAS ASLI. Kamu DILARANG KERAS mengarang, menyimulasikan, atau memalsukan data (seperti membuat IPK/GPA palsu misalnya 3.9, membuat proyek fiktif baru yang tidak dicantumkan, membuat pengalaman magang palsu, atau menambahkan sertifikasi mentereng seperti AWS/MTCNA jika tidak ada bukti tertulis atau implikasi riil di CV asli).
   - Optimasi perbaikan kata (improvements) harus memoles bahasa kalimat asli milik pengguna, bukan menggantinya dengan cerita fiktif. Tambahkan angka metrik peningkatan performa secara masuk akal pada rewrite XYZ formula untuk memperkuat poin prestasi asli yang kurang terpoles, namun JANGAN membuat peran baru.

3. EVALUASI TINGKAT KEYAKINAN PARSER (CONFIDENCE SCORING):
   - Evaluasi kelayakan teks CV. Jika teks CV sangat singkat, acak-acakan, terpotong, atau tidak terbaca dengan jelas, set "confidence_level" menjadi "Rendah", berikan "confidence_score" di bawah 50, dan tuliskan catatan/kritik membangun yang jujur serta instruksi aksi perbaikan pada "confidence_remarks" (misal: "Data CV Anda tidak terbaca dengan jelas. Silakan unggah versi lengkap Anda yang menerangkan program studi, proyek, dan riwayat kerja").
   - Jika teks berlimpah dan jelas terstruktur, berikan tingkat keyakinan "Tinggi" atau "Sedang" dan score di atas 70.

4. DETAIL EXTRACTOR STRUKTUR DATA:
   - Skills: Ekstrak secara semantik seluruh keahlian teknis (tools, stack, konsep, cloud, programming language) dari seluruh dokumen CV.
   - Experience: Tangkap nama perusahaan, jabatan/posisi, tools yang digunakan, tanggung jawab, pencapaian nyata, dan teknologi yang dipakai.
   - Education: Tangkap jurusan, nama institusi sekolah/universitas, konsentrasi, IPK/GPA (bila ada), aktivitas, organisasi, serta mata kuliah atau proyek akademik yang relevan.
   - Certifications & Projects: Daftarkan seluruh proyek (nama + deskripsi singkat jika ada) dan sertifikasi murni dari teks asli pengguna secara literal. Jika tidak ada, kembalikan array kosong, JANGAN perindah dengan data palsu.

Respon harus dalam format JSON sesuai skema dengan balasan dalam Bahasa Indonesia yang formal, tajam, profesional, dan objektif.`;

    const prompt = `Berikut adalah data CV Pengguna untuk dianalisis secara mendalam dan semantik:
=== DATA CV PENGGUNA ===
${cvText}
========================

Berikut adalah deskripsi pekerjaan (Job Description) target atau kualifikasi acuan:
=== JOB DESCRIPTION ===
${jobDescription}
=======================

Tolong lakukan audit CV, ekstraksi semantik (Parsed Data), dan kalkulasi ATS Matching score. Pastikan kamu selalu memprioritaskan data asli, tidak mengarang data palsu, dan mengisi parsed_data dengan kualifikasi dari CV pengguna secara detail. Buat pula optimasi LinkedIn terbaik yang sinkron dengan data asli CV tersebut.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            cv_analysis: {
              type: Type.OBJECT,
              properties: {
                ats_score: {
                  type: Type.INTEGER,
                  description: "ATS matching score dari 0 - 100 berdasarkan tingkat kesesuaian semantik dengan Lowongan Kerja."
                },
                candidate_name: {
                  type: Type.STRING,
                  description: "Nama lengkap yang ditemukan di CV. Jika tidak terdeteksi, sebut 'Kandidat'."
                },
                candidate_socials: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Daftar email, telepon, github, linkedin, portofolio yang ada di CV."
                },
                target_optimizations: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Aspek-aspek apa saja yang perlu dioptimalkan pada resume ini."
                },
                keyword_gap: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Keterampilan atau keyword penting dari JD yang belum ada atau masih lemah di CV."
                },
                parsed_data: {
                  type: Type.OBJECT,
                  properties: {
                    skills: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: "Daftar keahlian teknis (bahasa, tools, framework, konsep) yang berhasil diekstrak semantik dari SELURUH isi CV (tidak hanya dari header skill saja, termasuk dari proyek dan riwayat kerja)."
                    },
                    experience: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          company: { type: Type.STRING, description: "Nama perusahaan, organisasi, BEM, atau wadah kerja." },
                          role: { type: Type.STRING, description: "Posisi atau jabatan." },
                          period: { type: Type.STRING, description: "Periode waktu bekerja misalnya 'Jan 2024 - Sekarang'." },
                          tools: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Daftar tools, stack, atau teknologi yang dipakai pada pekerjaan ini." },
                          highlights: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Poin-poin tugas, kontribusi teknis, dan pencapaian pengguna yang tertera di CV." }
                        },
                        required: ["company", "role"]
                      }
                    },
                    education: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          institution: { type: Type.STRING, description: "Nama sekolah, universitas, akademi, boot camp." },
                          major: { type: Type.STRING, description: "Jurusan, program studi, konsentrasi studi." },
                          period: { type: Type.STRING, description: "Tahun / masa studi." },
                          gpa: { type: Type.STRING, description: "IPK atau GPA asli yang tercantum di CV (JANGAN mengarang jika kosong)." },
                          activities: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Organisasi, kepanitiaan, mata kuliah, atau prestasi akademik yang relevan." }
                        },
                        required: ["institution", "major"]
                      }
                    },
                    certifications: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: "Daftar sertifikasi atau lisensi profesi yang tertulis asli di CV. Kosongkan array jika tidak ada."
                    },
                    projects: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: "Daftar pengerjaan proyek / portofolio yang tertulis asli di CV. Kosongkan array jika tidak ada."
                    },
                    confidence_level: {
                      type: Type.STRING,
                      description: "Tingkat akurasi parser terhadap kelengkapan berkas CV: 'Tinggi', 'Sedang', atau 'Rendah'."
                    },
                    confidence_score: {
                      type: Type.INTEGER,
                      description: "Skor keyakinan parser dari 0 sampai 100."
                    },
                    confidence_remarks: {
                      type: Type.STRING,
                      description: "Umpan balik jika data terpotong atau minim. Contoh: 'CV terlalu minim rincian, disarankan menambah riwayat proyek' atau 'CV terbaca sangat lengkap dan terstruktur'."
                    }
                  },
                  required: ["skills", "experience", "education", "certifications", "projects", "confidence_level", "confidence_score", "confidence_remarks"]
                },
                improvements: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      section: { type: Type.STRING, description: "Seberkas bagian resume, contoh: 'Pengalaman Kerja', 'Portofolio Proyek', 'Ringkasan Diri'." },
                      main_issue: { type: Type.STRING, description: "Penjelasan mengapa penulisan aslinya kurang optimal atau tidak lolos scan ATS secara semantik." },
                      before: { type: Type.STRING, description: "Kalimat asli dari CV pengguna yang butuh polesan." },
                      after: { type: Type.STRING, description: "Kalimat rewrite profesional menggunakan format XYZ Formula yang menyisipkan performa terukur." },
                      reason: { type: Type.STRING, description: "Argumen mengapa revisi ini jauh lebih berbobot buat rekruter." }
                    },
                    required: ["section", "main_issue", "before", "after", "reason"]
                  },
                  description: "Polesan kalimat-kalimat di CV asli Anda (3-5 entri) agar lebih berdampak tanpa merubah substansi keahlian asli."
                }
              },
              required: ["ats_score", "candidate_name", "candidate_socials", "target_optimizations", "keyword_gap", "parsed_data", "improvements"]
            },
            linkedin_optimization: {
              type: Type.OBJECT,
              properties: {
                headline_recommendations: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "3 rekomendasi headline LinkedIn CTR tinggi yang sepenuhnya berbasis pada peran target dan keahlian riil yang diungkapkan di CV."
                },
                summary_before_snippet: {
                  type: Type.STRING,
                  description: "Ringkasan profil usang pengguna saat ini."
                },
                summary_after: {
                  type: Type.STRING,
                  description: "Komposisi ringkasan About Me LinkedIn yang komprehensif, berbasis data riil CV, disusun dengan gaya menulis profesional Jakarta/Modern yang asyik, menyertakan keahlian inti, proyek, serta call to action."
                },
                summary_improvement_notes: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Daftar catatan strategi optimasi LinkedIn profile."
                },
                experience_recommendations: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "2-3 rekomendasi / draf pembaruan penulisan seksi Pengalaman di LinkedIn sesuai dengan data empiris CV."
                },
                education_recommendations: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "1-2 rekomendasi atau draf ulasan seksi Pendidikan di LinkedIn."
                }
              },
              required: ["headline_recommendations", "summary_before_snippet", "summary_after", "summary_improvement_notes", "experience_recommendations", "education_recommendations"]
            }
          },
          required: ["cv_analysis", "linkedin_optimization"]
        },
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Received empty response from Gemini AI.");
    }

    // Safety parse just to ensure it's valid JSON
    const parsedData = JSON.parse(resultText);
    res.json(parsedData);
  } catch (error: any) {
    console.error("Analysis route error:", error);
    res.status(500).json({
      error: error.message || "Gagal melakukan analisis komparatif silsilah CV dengan AI.",
      details: error.stack
    });
  }
});

// 2. Extra endpoint for LinkedIn Profile Optimization
app.post("/api/optimize-linkedin", async (req, res) => {
  try {
    const { headlineLama, summaryLama, tone, targetRole, profileText } = req.body;

    const ai = getGeminiClient();

    const systemInstruction = `Kamu adalah HRD Tech Recruiter Senior, LinkedIn Branding Expert, dan Konsultan Karier di sistem "CareerElevate AI". Tugasmu adalah mengoptimalkan profil LinkedIn (Headline, Summary/About, Experience, dan Education) pengguna dengan Tone: ${tone || "Professional"}, untuk posisi target: ${targetRole || "Software Engineer"}.
Semua respon dalam bahasa Indonesia berkualitas tinggi, formal, profesional, dan tajam.`;

    let prompt = "";
    if (profileText) {
      prompt = `Berikut adalah seluruh konten profil/CV LinkedIn yang diunggah dari berkas PDF:
=== KONTEN PROFIL PDF ===
${profileText}
=========================

Posisi target: ${targetRole || "Web Developer"}
Tone yang diinginkan: ${tone || "Professional"}

Buatlah optimasi profil LinkedIn berdasarkan informasi teks profil/CV PDF di atas. Temukan info ringkasan atau detail pekerjaan di dalam teks tersebut dan formulasikan headline, summary, rekomendasi LinkedIn Experience (Pengalaman), serta rekomendasi LinkedIn Education (Pendidikan) yang jauh lebih baik dan dioptimalkan lengkap.
Berikan 3 rekomendasi headline menarik yang relevan dengan kata kunci optimasi algoritma LinkedIn (SEO) dan headline tingkat CTR tinggi.
Lalu buat ringkasan profil LinkedIn (summary_after) yang memikat berbasis storytelling profesional (about section) dengan format Jakarta/Modern style yang rapi, mencakup keterampilan, beberapa pencapaian/proyek, dan call to action (kontak/email).
Hasilkan pula 'experience_recommendations' berisi list rekomendasi penulisan / rewrite konkret untuk bagian pengalaman kerja, dan 'education_recommendations' berisi saran konkret untuk bagian pendidikan dari data CV. Serta sertakan 'summary_improvement_notes' secara list berisi penjelasan strategi optimasi.`;
    } else {
      prompt = `Berikut adalah data profil LinkedIn saat ini:
=== HEADLINE LAMA ===
${headlineLama || "Mahasiswa IT"}
=============

=== SUMMARY/ABOUT LAMA ===
${summaryLama || "Saya adalah mahasiswa IT S1."}
=============

Posisi target: ${targetRole || "Web Developer"}
Tone yang diinginkan: ${tone || "Professional"}

Buatlah optimasi profil LinkedIn berdasarkan informasi di atas. Berikan 3 rekomendasi headline menarik yang relevan dengan kata kunci optimasi algoritma LinkedIn (SEO) dan headline tingkat CTR tinggi.
Lalu buat ringkasan profil LinkedIn (summary_after) yang memikat berbasis storytelling profesional (about section) dengan format Jakarta/Modern style yang rapi, mencakup keterampilan, beberapa pencapaian/proyek, dan call to action (kontak/email).
Hasilkan pula 'experience_recommendations' berisi list rekomendasi penulisan / rewrite konkret untuk bagian pengalaman kerja, dan 'education_recommendations' berisi saran konkret untuk bagian pendidikan. Serta sertakan 'summary_improvement_notes' secara list berisi penjelasan strategi optimasi.`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headline_recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 distinct highly-optimized, modern headline recommendations with industry keywords."
            },
            summary_before_snippet: {
              type: Type.STRING,
              description: "A short snippet representing the key weak area of the before profile."
            },
            summary_after: {
              type: Type.STRING,
              description: "A comprehensive LinkedIn profile summary featuring storytelling, core tech skills, projects, and a call-to-action style contact."
            },
            summary_improvement_notes: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Strategy notes detailing what keywords were injected or storytelling tips."
            },
            experience_recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of 2-3 specific recommendations or rewritten experience bullets."
            },
            education_recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of 1-2 specific recommendations or rewritten education details."
            }
          },
          required: ["headline_recommendations", "summary_before_snippet", "summary_after", "summary_improvement_notes", "experience_recommendations", "education_recommendations"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Received empty response from Gemini AI.");
    }
    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error("Optimize LinkedIn route error:", error);
    res.status(500).json({ error: error.message || "Gagal mengoptimasi profil LinkedIn." });
  }
});

// 3. Endpoint to extract text from actual PDF files using pdf-parse Node library
app.post("/api/parse-pdf", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "Silakan unggah file PDF." });
      return;
    }

    const dataBuffer = req.file.buffer;
    // Instantiate PDFParse helper and extract text
    const pdfParser = new PDFParse({ data: dataBuffer });
    const parsedData = await pdfParser.getText();
    const extractedText = parsedData.text || "";

    if (!extractedText.trim()) {
      res.json({ text: "", warning: "Tidak berhasil mengekstrak teks dari PDF. Cek apakah dokumen Anda berupa scan gambar." });
      return;
    }

    res.json({ text: extractedText });
  } catch (error: any) {
    console.error("PDF Parsing Error:", error);
    res.status(500).json({ error: "Gagal memproses file PDF: " + (error.message || error) });
  }
});

// Global Error Handler to guarantee JSON responses of all uncaught errors
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Unhandled Express Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Terjadi kesalahan internal pada server.",
    details: process.env.NODE_ENV !== "production" ? err.stack : undefined
  });
});

// Setup Vite or static files based on environment
async function init() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[CareerElevate AI Server] Live on http://localhost:${PORT}`);
  });
}

init();
