import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import multer from "multer";

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

// A. Endpoint for parsing & semantic extraction of CV + Fallback detection & Validation
app.post("/api/parse-cv", async (req, res) => {
  try {
    const { cvText, jobDescription } = req.body;

    if (!cvText || !cvText.trim()) {
      res.status(400).json({ error: "Teks Curriculum Vitae (CV) wajib diisi." });
      return;
    }

    const ai = getGeminiClient();

    const systemInstruction = `Kamu adalah Real-time Semantic Parser, ATS Expert, Smart CV Analyzer, dan Ahli Data Profiling Karir di sistem "CareerElevate AI".
Tugas utamamu adalah mengekstrak data dari teks CV kasar secara semantik (Semantic Parsing) dengan akurasi 105% dan mengelompokkannya ke dalam format JSON terstruktur.

BERIKUT ADALAH ATURAN PARSING DAN DETEKSI SEMANTIK HARUS KAMU PATUHI:

1. INTELLIGENT HEADING LOOKUP:
   - Banyak CV tidak memakai judul bagian (heading) standar seperti "Education" atau "Pendidikan".
   - Pindai variasi-variasi terdekat dari heading berikut:
     * Pendidikan: Riwayat Pendidikan, Academic Background, Edukasi, Pendidikan Formal, Education History, Sekolah / Universitas, Degree / Major, Academic History, Latar Belakang Pendidikan.
     * Pengalaman Kerja: Experience, Riwayat Kerja, Riwayat Karir, Employment, Work Experience, Professional History, Internship, Magang, Asisten, Pengalaman Organisasi, Proyek Kerja.
     * Keahlian: Skills, Keahlian, Kompetensi, Keahlian Teknis, Core Competencies, Area of Expertise, Tech Stack, Spesialisasi.
     * Sertifikasi: Certifications, Sertifikat, Lisensi, Licenses, Credentials, Training.
     * Proyek: Projects, Portofolio, Karya, Proyek Personal, Project Portfolio.
     * Prestasi: Achievements, Penghargaan, Awards, Prestasi Akademik, Honors.

2. FALLBACK DETECTION JIKA HEADING TIDAK TERPECAH (COMPLEX RULE):
   - Jika bagian "Education / Pendidikan" tidak ditemukan sebagai heading khusus, lakukan pencarian semantik terhadap pola baris di seluruh CV teks:
     * Cari kata bersinggungan level studi: "S1", "S2", "S3", "D3", "SMK", "SMA", "Bachelor", "Diploma", "Vocational School", "Master", "Associate Degree".
     * Cari nama-nama institusi, universitas, sekolah (contoh kata kunci: "Universitas", "STT", "Institut", "Sekolah", "Politeknik", "College", "Academy", "Nurul Fikri", "UI", "ITB", dsb).
     * Cari nama jurusan atau konsentrasi (contoh: "Teknik Informatika", "Sistem Informasi", "Akuntansi", "Manajemen", dsb).
     * Cari tahun (seperti "2020", "2024", "Lulus").
     * CONTOH EKSTRAKSI: Jika ditemui teks "S1 Teknik Informatika - STT Terpadu Nurul Fikri (2020 - 2024)" maka ekstrak sebagai:
       - institution: "STT Terpadu Nurul Fikri"
       - degree: "S1"
       - major: "Teknik Informatika"
       - period: "2020 - 2024"
       - gpa: "" (kosong jika tidak tertulis)

3. STRUKTUR PERSONAL INFO LITERAL:
   - Ekstrak nama kandidat ("candidate_name") secara literal dari baris-baris awal teks CV. Jangan dikarang. Jika benar-benar misterius atau tidak ditemukan, beri nilai "Kandidat".
   - Kumpulkan email, kontak telepon, sosial media (Linkedin, Github, website) ke dalam array "candidate_socials".

4. KETENTUAN MULTI-BAHASA & TYPO HANDLER:
   - Pahami kalimat campuran (Indonesia-Inggris) draf aslinya.
   - Bersihkan typo ringan dalam keywords/bahasa (cth: "reactjs" / "React JS" -> "React.js").

5. ZERO FABRICATION (ANTI-HALUSINASI):
   - JANGAN PERNAH MENGARANG DATA PALSU YANG SAMA SEKALI TIDAK ADA DI CV TEKS.
   - Jika database sertifikasi, IPK, proyek, atau pengalaman tidak tertulis secara implisit atau eksplisit di CV asli, biarkan array-nya KOSONG ([] atau "").
   - JAWABLAH DENGAN JUJUR. Jangan menambahkan pengalaman kerja fiktif, IPK bohongan (misal mengarang IPK 3.8), atau prestasi palsu.

6. VALIDATION AND OVERALL STATUS:
   - Lakukan pengecekan validitas struktur data yang berhasil di-parse:
     * is_education_valid: bernilai true jika berhasil menemukan minimal 1 riwayat pendidikan formal (melalui heading atau fallback detection).
     * is_experience_valid: bernilai true jika berhasil menemukan minimal 1 riwayat pengalaman kerja/organisasi.
     * is_skills_valid: bernilai true jika terdapat keahlian/skills yang diekstrak.
     * missing_sections: daftarkan array yang kosong dari bagian primer seperti: "Pendidikan", "Pengalaman", "Keahlian".
     * overall_status: "VALID" jika bagian pendidikan dan pengalaman/organisasi terdeteksi cukup (tidak kosong). Jika kosong, berikan status "INVALID_MISSING_DATA".
     * validation_message: berikan pesan feedback bahasa Indonesia yang sopan dan tajam. Jika ada bagian yang kosong, mintalah user dengan sopan untuk melengkapinya secara manual pada kolom review atau memeriksa format CV-nya.

Tulis respon JSON terstruktur secara tuntas dan formal.`;

    const prompt = `Berikut adalah data teks CV kasar Pengguna untuk di-ekstrak secara semantik dan diverifikasi:
=== DESKRIPSI DATA CV KASAR ===
${cvText}
================================

Sila lakukan parsing, deteksi fallback pendidikan, serta validasi data.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            candidate_name: {
              type: Type.STRING,
              description: "Nama kandidat yang ditemukan secara literal di baris atas CV. Jangan mengarang."
            },
            candidate_socials: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Daftar email, nomor telepon, portfolio, github atau linkedin yang tertera di teks CV."
            },
            education: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  institution: { type: Type.STRING, description: "Nama universitas, sekolah, institut, boot camp akademis." },
                  degree: { type: Type.STRING, description: "Derajat kelulusan (S1, S2, D3, SMK, SMA, Bachelor, Diploma, dsb) hasil analisis fallback." },
                  major: { type: Type.STRING, description: "Jurusan, program studi, atau konsentrasi spesifik sekolah." },
                  period: { type: Type.STRING, description: "Tahun / jangka waktu studi." },
                  gpa: { type: Type.STRING, description: "IPK atau GPA asli jika dicantumkan di CV. Jangan membuat nilai palsu!" },
                  activities: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Kegiatan organisasi, mata kuliah relevan, kualifikasi akademik." }
                },
                required: ["institution", "major"]
              }
            },
            experience: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  company: { type: Type.STRING, description: "Nama perusahaan, instansi, BEM, kepanitiaan, magang." },
                  role: { type: Type.STRING, description: "Jabatan atau jenis peran kerja." },
                  period: { type: Type.STRING, description: "Masa/periode kerja." },
                  tools: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Stack teknologi, peralatan, software, atau frameworks yang dipakai." },
                  highlights: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Deskripsi tanggung jawab, kontribusi nyata, pencapaian." }
                },
                required: ["company", "role"]
              }
            },
            skills: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Kumpulan list kata kunci keahlian teknis (programming language, tools, metodologi, soft skills) yang berhasil dipetakan dari CV."
            },
            projects: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Daftar proyek mandiri, komersial, open source yang dicantumkan asli di CV."
            },
            certifications: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Daftar sertifikat kompetensi asli."
            },
            achievements: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Daftar award, prestasi, kejuaraan, atau pencapaian kompetitif."
            },
            validation: {
              type: Type.OBJECT,
              properties: {
                is_education_valid: { type: Type.BOOLEAN },
                is_experience_valid: { type: Type.BOOLEAN },
                is_skills_valid: { type: Type.BOOLEAN },
                missing_sections: { type: Type.ARRAY, items: { type: Type.STRING } },
                overall_status: { type: Type.STRING, description: "Status validitas parsing: 'VALID' atau 'INVALID_MISSING_DATA'" },
                validation_message: { type: Type.STRING }
              },
              required: ["is_education_valid", "is_experience_valid", "is_skills_valid", "missing_sections", "overall_status", "validation_message"]
            },
            confidence: {
              type: Type.OBJECT,
              properties: {
                level: { type: Type.STRING },
                score: { type: Type.INTEGER },
                remarks: { type: Type.STRING }
              },
              required: ["level", "score", "remarks"]
            }
          },
          required: [
            "candidate_name",
            "candidate_socials",
            "education",
            "experience",
            "skills",
            "projects",
            "certifications",
            "achievements",
            "validation",
            "confidence"
          ]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Received empty response from Parser AI.");
    }

    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error("Parse CV CV error:", error);
    res.status(500).json({ error: error.message || "Gagal mengekstrak data semantik CV." });
  }
});

// B. Endpoint for running ATS Matcher and Optimizer based STRICTLY on validated parsed data
app.post("/api/optimize-cv", async (req, res) => {
  try {
    const { parsedData, jobDescription } = req.body;

    if (!parsedData) {
      res.status(400).json({ error: "Data parsed CV yang tervalidasi wajib disertakan." });
      return;
    }
    if (!jobDescription || !jobDescription.trim()) {
      res.status(400).json({ error: "Deskripsi pekerjaan target (Job Description) wajib diisi." });
      return;
    }

    const ai = getGeminiClient();

    const systemInstruction = `Kamu adalah HRD Senior Tech Recruiter, ATS Optimizer, dan Konsultan Karier di CareerElevate AI.
Tugas utamamu adalah memetakan dan mengoptimalkan penulisan CV serta merumuskan rekomendasi profil LinkedIn berdasarkan data CV terstruktur asli yang dikirimkan pengguna.

BERIKUT ADALAH PRINSIP DAN RESTRICKSI KETAT PENGOPTIMALAN:

1. DILARANG KERAS MENGARANG DATA PALSU (FAITHFUL OPTIMIZER):
   - Kamu hanya boleh bekerja dengan data terstruktur asli (Pendidikan, Pengalaman, Sertifikasi, Proyek, Prestasi, Keahlian) yang dikirimkan oleh pengguna dalam objek 'parsedData'.
   - JANGAN PERNAH MENAMBAHKAN pengalaman kerja baru di perusahaan fiktif, sertifikat bergengsi palsu (misal AWS Cloud Practitioner jika tidak ada di CV), IPK palsu (jika asli tidak dicantumkan, jangan diisi, atau jelaskan apa adanya), proyek imajiner, atau peran baru lainnya.
   - Jika CV hanya memiliki sedikit data (data minim), berikan penilaian jujur, andalkan data asli tersebut, dan berikan panduan konkret serta rekomendasi perbaikan agar pengguna melengkapinya di draf mereka, daripada kamu mengarang data fiktif baru.

2. PENYELARASAN OUTPUT:
   - Output optimasi harus 100% konsisten dan sinkron dengan CV asli kandidat.
   - Jika CV memiliki riwayat pendidikan, draf optimasi akademis wajib menampilkan institusi dan jurusan asli yang sama.
   - Jika CV memiliki riwayat pengalaman kerja, ulasan XYZ formula wajib merefleksikan peran di instansi kerja aslinya.
   - Jika CV memiliki skill, polislah list skill secara teratur tanpa menambahkan teknologi acak berisiko tinggi yang tidak dikuasai.

3. STRUKTUR CV IMPROVEMENTS (XYZ FORMULA):
   - Buatlah 3-5 ulasan perbaikan (improvements) kalimat asli dari riwayat kerja, proyek, atau pendidikan kandidat.
   - Kolom "before" wajib diisi kalimat rujukan asli dari parsedData.
   - Kolom "after" dipoles menggunakan XYZ Formula (Accomplished [X] as measured by [Y], by doing [Z]). Tambahkan peningkatan persentase efisiensi, durasi, kecepatan atau volume performa secara logis dan masuk akal untuk memperindah tata bahasa, sepanjang substansi pekerjaannya tetap setia pada riwayat aslinya.
   - Sediakan argumentasi ilmiah mengapa revisi di "after" lebih disukai sistem ATS rekruter pada kolom "reason".

4. OPTIMASI LINKEDIN YANG INTEGRATIF:
   - Rekomendasikan headline, summary (kisah About Me berkategori profesional modern Indonesia/Jakarta style yang asyik tapi formal), serta draf experience dan education yang ditarik dari data parsedData yang sah saja.

Tanggapi dalam bentuk format JSON rapi sesuai schema yang didefinisikan secara tuntas dalam bahasa Indonesia yang berwibawa, tajam, objektif dan profesional.`;

    const prompt = `Berikut adalah data CV terstruktur pengguna hasil verifikasi parsing semantik:
=== DATA PARSED CV TERVALIDASI ===
${JSON.stringify(parsedData, null, 2)}
===================================

Berikut adalah Kriteria Karir Pekerjaan Target (Job Description):
=== JOB DESCRIPTION ===
${jobDescription}
=======================

Tolong buat kalkulasi ATS Score yang jujur, analisis keyword gapped, ulasan rewrite XYZ CV manual (improvements), serta optimasi profil LinkedIn yang rapi berdasarkan riwayat asli di atas.`;

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
                  description: "ATS matching score dari 0 - 100 berdasarkan kesesuaian data CV asli dengan JD target."
                },
                candidate_name: {
                  type: Type.STRING,
                  description: "Nama kandidat dari parsedData."
                },
                candidate_socials: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                target_optimizations: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Aspek konkrit yang butuh dioptimalkan berdasarkan data asli pengguna yang minim."
                },
                keyword_gap: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Teknologi/metrik penting dari lowongan yang belum dicantumkan di CV asli."
                },
                improvements: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      section: { type: Type.STRING, description: "Judul seksi, cth: 'Pengalaman Kerja', 'Portofolio Proyek', 'Pendidikan'." },
                      main_issue: { type: Type.STRING, description: "Kelemahan deskripsi awal." },
                      before: { type: Type.STRING, description: "Deskripsi asli kandidat sesuai data parser." },
                      after: { type: Type.STRING, description: "Deskripsi yang teroptimasi dengan XYZ formula (memakai metrik angka masuk akal) berbasis peran asli." },
                      reason: { type: Type.STRING, description: "Argumen mengapa kalimat baru ini jauh lebih persuasif bagi rekruter hrd." }
                    },
                    required: ["section", "main_issue", "before", "after", "reason"]
                  }
                }
              },
              required: ["ats_score", "candidate_name", "candidate_socials", "target_optimizations", "keyword_gap", "improvements"]
            },
            linkedin_optimization: {
              type: Type.OBJECT,
              properties: {
                headline_recommendations: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "3 draf headline LinkedIn CTR tinggi, berbasis murni pada kualifikasi riil parsedData."
                },
                summary_before_snippet: {
                  type: Type.STRING,
                  description: "Snippet analisis kelemahan ringkasan profil lama."
                },
                summary_after: {
                  type: Type.STRING,
                  description: "Komposisi naratif About Me LinkedIn yang komprehensif, bercerita, profesional, berbasis 100% pada rincian data asli, dengan call-to-action draf."
                },
                summary_improvement_notes: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                experience_recommendations: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Usulan penulisan bagian pengalaman kerja di LinkedIn."
                },
                education_recommendations: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Usulan penulisan pendidikan di LinkedIn."
                }
              },
              required: ["headline_recommendations", "summary_before_snippet", "summary_after", "summary_improvement_notes", "experience_recommendations", "education_recommendations"]
            }
          },
          required: ["cv_analysis", "linkedin_optimization"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Received empty response from Optimizer AI.");
    }

    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error("Optimize CV route error:", error);
    res.status(500).json({ error: error.message || "Gagal menjalankan optimasi data CV setia fakta." });
  }
});

// 2. Extra endpoints for LinkedIn Profile Parsing & Optimization
app.post("/api/parse-linkedin", async (req, res) => {
  try {
    const { headlineLama, summaryLama, targetRole, profileText } = req.body;

    const ai = getGeminiClient();

    const systemInstruction = `Kamu adalah Ahli Data Profiling Karir dan Real-time Semantic Parser di CareerElevate AI.
Tugas utamamu adalah mendeteksi secara cerdas dan mengekstrak rincian profil LinkedIn / CV pengguna ke dalam format JSON terstruktur yang tervalidasi.

BERIKUT ADALAH PRINSIP DAN KETENTUAN KHUSUS PARSING DATA SEMANTIK:
1. JANGAN PERNAH HANYA BACA HEADING EXACT:
   Parser harus bisa membaca variasi data dari mana saja termasuk CV, profile summary, experience, education, certification, project, skills, achievement, dan teks bebas user yang tidak teratur.
   
2. DETEKSI DENGAN KONTEKS (CONTEXT-AWARE FALLBACK DETECTION):
   Jika format tidak rapi hibrida atau tidak memakai heading, kamu harus mendeteksi secara kontekstual:
   - Jika ada teks mengandung institusi/sekolah dan jurusan/program, contoh: "STT Terpadu Nurul Fikri - Teknik Informatika", maka teks ini wajib masuk ke kategori Education.
   - Jika terdapat teks yang memuat list sertifikat atau sebutan teknis spesifik lulusan, contoh: "MTCNA, MTCRE, MTCTCE" atau "CCNA, AWS Certified", maka wajib dideteksi dengan benar dan dimasukkan ke kategori Certifications.
   - Jika terdapat baris prestasi atau kompetisi seperti "NXCTF" atau "Hackathon Juara 2", maka wajib dideteksi secara cerdas dan dimasukkan ke Projects atau Achievements sesuai konteks data.

3. ZERO FABRICATION (ANTI-HALUSINASI):
   - Isi seluruh field hanya berdasarkan bukti empiris dalam teks yang dikirimkan.
   - Jika data suatu bagian (seperti prestasi atau sertifikasi) tidak ditemukan sama sekali di dalam input, kembalikan nilai kosong (string kosong "" atau array kosong []). Jangan mengarang data imajiner!
`;

    const prompt = `Berikut adalah data profil LinkedIn / CV kasar Pengguna:
=== ANALISIS SUMBER INPUT ===
Headline Lama Manual: ${headlineLama || ""}
Summary Lama Manual: ${summaryLama || ""}
Target Role yang Dituju: ${targetRole || ""}

Teks Berkas PDF / Profil Bebas:
${profileText || ""}
=============================

Tolong lakukan parsing data semantik, terapkan aturan deteksi dengan konteks untuk institusi/sertifikasi/nama kompetisi, dan hasilkan output JSON terstruktur yang valid.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            current_headline: { 
              type: Type.STRING, 
              description: "Headline lama pengguna. Jika tidak ada dan ada targetRole, formulasikan draf ringkas awal tanpa mengarang data palsu." 
            },
            about_summary: { 
              type: Type.STRING, 
              description: "Rangkuman profil atau ringkasan saat ini. Jika tidak ada, kembalikan string kosong." 
            },
            experience: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  company: { type: Type.STRING, description: "Nama instansi kerja/organisasi" },
                  role: { type: Type.STRING, description: "Jabatan" },
                  period: { type: Type.STRING, description: "Periode kerja" },
                  tools: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Sistem, software, frameworks yang tertulis" },
                  highlights: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Tugas, tanggung jawab, rincian aktivitas" }
                },
                required: ["company", "role"]
              }
            },
            education: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  institution: { type: Type.STRING },
                  major: { type: Type.STRING },
                  period: { type: Type.STRING },
                  gpa: { type: Type.STRING },
                  activities: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["institution", "major"]
              }
            },
            skills: { type: Type.ARRAY, items: { type: Type.STRING } },
            certifications: { type: Type.ARRAY, items: { type: Type.STRING } },
            projects: { type: Type.ARRAY, items: { type: Type.STRING } },
            achievements: { type: Type.ARRAY, items: { type: Type.STRING } },
            keywords: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: [
            "current_headline", 
            "about_summary", 
            "experience", 
            "education", 
            "skills", 
            "certifications", 
            "projects", 
            "achievements", 
            "keywords"
          ]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Received empty response from LinkedIn Parser AI.");
    }
    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error("Parse LinkedIn Error:", error);
    res.status(500).json({ error: error.message || "Gagal mengurai profil LinkedIn." });
  }
});

app.post("/api/optimize-linkedin", async (req, res) => {
  try {
    const { parsedData, tone, targetRole } = req.body;

    if (!parsedData) {
      res.status(400).json({ error: "Data LinkedIn tervalidasi wajib disertakan." });
      return;
    }

    const ai = getGeminiClient();

    const systemInstruction = `Kamu adalah Senior Tech Recruiter, LinkedIn Brand Specialist, dan Career Consultant.
Tugas utamamu adalah memformulasikan optimasi profil LinkedIn (Headline, About/Summary, Experience, Education, Skills, Certifications, Projects) secara berkesinambungan dan setia pada data valid pengguna.

BERIKUT ADALAH PRINSIP KETAT PENULISAN & FORMAT YANG WAJIB DIPATUHI:
1. OPTIMIZER HANYA BOLEH MEMAKAI DETECTED DATA (ANTI HALUSINASI):
   - Kamu DILARANG KERAS menghasilkan, menyimulasikan, atau mengarang pendidikan palsu, skill palsu, sertifikasi palsu, dan pengalaman serta pencapaian fiktif di resume kanan/optimized.
   - Gunakan murni fakta empiris dari 'parsedData'. Jika suatu bagian riwayat tersebut kosong, maka di kolom Optimized wajib ditulis: "Data belum terdeteksi dari input." Jangan menggantinya dengan template dummy atau data karangan! 
   - Jaga orisinalitas metrik. Jika data aslinya tidak mencantumkan persentase angka pencapaian, draf LinkedIn baru harus tetap profesional dan tertulis logis tanpa disandarkan pada kebohongan publik.

2. REKOMENDASI HARUS SIMPLE & ACTIONABLE:
   Hadirkan daftar ulasan 'summary_improvement_notes' yang praktis, pendek, ringkas tanpa bertele-tele.
   - Contoh rekomendasi yang baik:
     * Tambahkan keyword role utama di headline.
     * Kelompokkan skills berdasarkan kategori.
     * Perjelas impact pengalaman kerja.
     * Tambahkan sertifikasi yang sudah terdeteksi.
   - Hindari secara mutlak: penggunaan diagnostic matrix, ATS index rating, parser integrity, formula XYZ, jargon AI panjang lebar, template random, serta kalimat ulasan teoretis.

3. SINKRONISASI TATA BAHASA (Indonesian Professional Tone: ${tone || "Professional"}):
   Buatlah About section (summary_after) yang memikat berbasis silsilah asli dengan gaya menulis karir modern, asyik, berbobot, ramah SEO pencocokan rekruter LinkedIn.`;

    const prompt = `Berikut adalah data profil LinkedIn / CV tervalidasi milik pengguna:
=== DATA VALID SENSITIF FAKTA ===
${JSON.stringify(parsedData, null, 2)}
=================================

Kriteria Optimasi Target:
Target Role: ${targetRole || "Software Engineer"}
Tone Bahasa: ${tone || "Professional"}

Silakan formulasikan rekomendasi headline (3 opsi CTR tinggi), ringkasan About Me (summary_after) bercerita asyik tapi formal, draf pemolesan seksi Experience (bila ada), dan Education (bila ada) berdasarkan data asli di atas.`;

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
              description: "3 draf rekomendasi headline LinkedIn CTR tinggi berdasarkan keahlian riil dan peran target."
            },
            summary_before_snippet: {
              type: Type.STRING,
              description: "Snippet analisis singkat kelemahan ringkasan profil lama."
            },
            summary_after: {
              type: Type.STRING,
              description: "Draf ringkasan About Me LinkedIn lengkap (storytelling) berdasarkan murni data valid."
            },
            summary_improvement_notes: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "4 poin rekomendasi pendek, ringkas, dan actionable saja."
            },
            experience_recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Rekomendasi penulisan / bullet point seksi Pengalaman di LinkedIn sesuai dengan data asli. Jika kosong pada data aslinya, kembalikan hanya ['Data belum terdeteksi dari input.']"
            },
            education_recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Rekomendasi penulisan seksi Pendidikan di LinkedIn. Jika kosong pada data aslinya, kembalikan hanya ['Data belum terdeteksi dari input.']"
            }
          },
          required: [
            "headline_recommendations", 
            "summary_before_snippet", 
            "summary_after", 
            "summary_improvement_notes", 
            "experience_recommendations", 
            "education_recommendations"
          ]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Received empty response from LinkedIn Optimizer AI.");
    }
    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error("Optimize LinkedIn route error:", error);
    res.status(500).json({ error: error.message || "Gagal mengoptimasi profil LinkedIn." });
  }
});

// 3. Endpoint to extract text from actual PDF files using Gemini API (100% serverless compatible & OCR supportive)
app.post("/api/parse-pdf", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "Silakan unggah file PDF." });
      return;
    }

    const dataBuffer = req.file.buffer;
    const ai = getGeminiClient();

    // Prepare PDF as inline data for Gemini
    const pdfPart = {
      inlineData: {
        mimeType: "application/pdf",
        data: dataBuffer.toString("base64")
      }
    };

    // Ask Gemini to extract text literally
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        pdfPart,
        "Extract all plain text from this PDF file. Do not summarize, explain, or format. Preserve original information, words, spelling and structure as literal text, suitable for processing with our ATS scanner."
      ]
    });

    const extractedText = response.text || "";

    if (!extractedText.trim()) {
      res.json({ text: "", warning: "Tidak berhasil mengekstrak teks dari PDF. Cek apakah berkas dokumen Anda kosong atau rusak." });
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

export default app;
