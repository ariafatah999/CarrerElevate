export interface CvImprovement {
  section: string;     // e.g., "Pengalaman Kerja", "Proyek", "Pendidikan", "Sertifikasi"
  main_issue: string;  // e.g., "Terlalu pasif, tidak memiliki bukti metrik angka pencapaian."
  before: string;
  after: string;
  reason: string;
}

export interface ParsedExperience {
  company: string;
  role: string;
  period?: string;
  tools?: string[];
  highlights?: string[];
}

export interface ParsedEducation {
  institution: string;
  major: string;
  period?: string;
  gpa?: string;
  activities?: string[];
}

export interface ParsedData {
  skills: string[];
  experience: ParsedExperience[];
  education: ParsedEducation[];
  certifications: string[];
  projects: string[];
  confidence_level?: string;
  confidence_score?: number;
  confidence_remarks?: string;
}

export interface CvAnalysis {
  ats_score: number;
  keyword_gap: string[];
  improvements: CvImprovement[];
  candidate_name?: string;
  candidate_socials?: string[];
  target_optimizations?: string[];
  parsed_data?: ParsedData;
}

export interface LinkedinOptimization {
  headline_recommendations: string[];
  summary_before_snippet: string;
  summary_after: string;
  summary_improvement_notes: string[];
  experience_recommendations: string[];
  education_recommendations: string[];
}

export interface AnalysisResponse {
  cv_analysis: CvAnalysis;
  linkedin_optimization: LinkedinOptimization;
}

export interface AnalysisHistoryItem {
  id: string;
  timestamp: string;
  jobTitle: string;
  companyName: string;
  ats_score: number;
  data: AnalysisResponse;
}
