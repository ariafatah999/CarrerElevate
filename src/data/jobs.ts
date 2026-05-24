import React from "react";
import {
  Layout,
  Server,
  Globe,
  Shield,
  Smartphone,
  Database,
  Activity,
  Layers,
  Settings,
  Cpu
} from "lucide-react";

export interface PredefinedJob {
  id: string;
  title: string;
  category: string;
  iconKey: string;
  description: string;
}

export const PREDEFINED_JOBS: PredefinedJob[] = [
  {
    id: "frontend",
    title: "Frontend Web Developer (React / Next.js)",
    category: "Software Development",
    iconKey: "Layout",
    description: "Membangun antarmuka web yang responsif, interaktif, dan bergelimang performa tinggi menggunakan ReactJS, NextJS, CSS Fleksibel, dan TypeScript. Mengelola arsitektur modular, reusable components, koordinasi state management Redux atau Zustand, serta penanganan rest api integration dan SEO frontend ops."
  },
  {
    id: "backend",
    title: "Backend Software Engineer (Node.js / Go)",
    category: "Software Development",
    iconKey: "Server",
    description: "Merancang dan mengoptimalkan RESTful/GraphQL API berskala tinggi dengan Node.js (Express) atau Golang. Mengelola struktur data relasional (PostgreSQL, MySQL), optimasi kueri kompleks, sistem caching dengan Redis, autentikasi aman dengan JWT/OAuth2, dan event-driven microservices terdistribusi."
  },
  {
    id: "network",
    title: "Network Engineer",
    category: "Infrastructure & Net",
    iconKey: "Globe",
    description: "Mengonfigurasi perangkat keras routing/switching Cisco, Juniper, setup protokol jaringan dinamis OSPF dan BGP, manajemen skema VLAN, keamanan subnetting jaringan internal, pengaturan firewall, serta pemantauan dan analisis kesehatan trafik data dangan SNMP/Zabbix."
  },
  {
    id: "cyber",
    title: "Cyber Security / SOC Analyst",
    category: "Security & Operations",
    iconKey: "Shield",
    description: "Melakukan monitoring ancaman keamanan real-time menggunakan sistem SIEM/Splunk, melakukan analisis log sitem, deteksi malware, kerentanan sistem, vulnerability assessment & penetration testing (VAPT) berbasis standard OWASP Top 10, serta pengelolaan insiden respons."
  },
  {
    id: "devops",
    title: "DevOps Engineer (Cloud & CI/CD)",
    category: "Infrastructure & Platform",
    iconKey: "Cpu",
    description: "Mengotomasi alur deployment server dengan CI/CD pipeline GitLab CI atau GitHub Actions, kontainerisasi aplikasi menggunakan Docker, manajemen orkestrasi klaster Kubernetes, Infrastructure as Code dengan Terraform, serta konfigurasi server monitoring terpusat Prometheus/Grafana."
  },
  {
    id: "mobile",
    title: "Mobile App Developer (Flutter / React Native)",
    category: "Software Development",
    iconKey: "Smartphone",
    description: "Mengembangkan aplikasi mobile cross-platform Android dan iOS memakai SDK Flutter (Dart) atau React Native (TypeScript). Melakukan integrasi REST API, penyimpanan database lokal offline SQLite/Hive, push notifications, dan mengelola penerbitan rilis ke Google Play Store & Apple App Store."
  },
  {
    id: "data",
    title: "Data Analyst / Data Scientist",
    category: "Data & Systems",
    iconKey: "Database",
    description: "Melakukan analisis data historis untuk merumuskan wawasan bisnis cerdas menggunakan SQL, Python (Pandas/NumPy-dataframes). Membentuk dashboard visualisasi data interaktif Tableau, PowerBI, atau Metabase, serta merancang pipa data (data warehousing) dan peramalan prediktif ML."
  },
  {
    id: "qa",
    title: "QA Automation Engineer",
    category: "Quality Assurance",
    iconKey: "Activity",
    description: "Merancang skenario pengujian fungsional dan menulis automation test scripts modern dengan Playwright, Cypress, Selenium, atau Postman API. Mengatur integrasi pengujian dalam delivery modern pipelines CI/CD, mengidentifikasi regresi, bug tracking, serta melakukan manual QA."
  },
  {
    id: "uiux",
    title: "UI/UX Product Designer",
    category: "Product & Design",
    iconKey: "Layers",
    description: "Merancang visual wireframe terarah, interactive high-fidelity user flows, prototype di Figma. Melaksanakan pengujian eksplorasi (usability testing), menyusun arsitektur informasi produk yang intuitif, serta merancang design system komponen digital responsif yang teratur."
  },
  {
    id: "sysadmin",
    title: "IT Support / System Administrator",
    category: "Infrastructure & Support",
    iconKey: "Settings",
    description: "Mengelola server fisik dan virtual berbasis OS Linux/Windows Server, administrasi kontrol akses server dengan Active Directory, instalasi hardware internal perusahaan, backup & disaster recovery data berkala, serta menangani penyelesaian bantuan kendala user (Helpdesk tiket)."
  }
];

export const renderJobIcon = (iconKey: string, customClass: string = "w-5 h-5 text-[#06B6D4]") => {
  const props = { className: customClass };
  switch (iconKey) {
    case "Layout": return React.createElement(Layout, props);
    case "Server": return React.createElement(Server, props);
    case "Globe": return React.createElement(Globe, props);
    case "Shield": return React.createElement(Shield, props);
    case "Cpu": return React.createElement(Cpu, props);
    case "Smartphone": return React.createElement(Smartphone, props);
    case "Database": return React.createElement(Database, props);
    case "Activity": return React.createElement(Activity, props);
    case "Layers": return React.createElement(Layers, props);
    case "Settings": return React.createElement(Settings, props);
    default: return React.createElement(Cpu, props);
  }
};
