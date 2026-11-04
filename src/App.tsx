import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { MetricsStrip } from "./components/MetricsStrip";
import { ExecutiveSummary } from "./components/ExecutiveSummary";
import { ExperienceSection } from "./components/ExperienceSection";
import { CertificateGallery } from "./components/CertificateGallery";
import { SkillsMatrix } from "./components/SkillsMatrix";
import { AISuite } from "./components/AISuite";
import { PresentationMode } from "./components/PresentationMode";
import { ContactSection } from "./components/ContactSection";
import { AdminBar } from "./components/AdminBar";
import { AddExperienceModal } from "./components/AddExperienceModal";
import { AddCertificateModal } from "./components/AddCertificateModal";
import { ApplicationDossierModal } from "./components/ApplicationDossierModal";
import { PortfolioEditorModal, EditorTab } from "./components/PortfolioEditorModal";
import { 
  PROFILE_INFO as DEFAULT_PROFILE, 
  CERTIFICATES as DEFAULT_CERTS, 
  EXPERIENCES as DEFAULT_EXPS,
  SKILL_CATEGORIES as DEFAULT_SKILLS,
  Certificate,
  Experience
} from "./data/portfolioData";

export default function App() {
  // State for dynamic portfolio data
  const [profile, setProfile] = useState<any>(DEFAULT_PROFILE);
  const [executiveSummary, setExecutiveSummary] = useState<any>(null);
  const [skillCategories, setSkillCategories] = useState<any[]>(DEFAULT_SKILLS);
  const [certificates, setCertificates] = useState<Certificate[]>(DEFAULT_CERTS);
  const [experiences, setExperiences] = useState<Experience[]>(DEFAULT_EXPS);

  // View Mode: true if viewed by HRD/Reviewer, false if Owner/Admin mode
  const [isHrdView, setIsHrdView] = useState(false);

  // Modals state
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);
  const [isAddExperienceOpen, setIsAddExperienceOpen] = useState(false);
  const [isAddCertificateOpen, setIsAddCertificateOpen] = useState(false);
  const [isDossierBuilderOpen, setIsDossierBuilderOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorInitialTab, setEditorInitialTab] = useState<EditorTab>("profile");

  // Active section for navigation
  const [activeSection, setActiveSection] = useState("tentang");

  // Fetch persistent portfolio data from server on load
  useEffect(() => {
    // Check URL parameters for HRD / Review view
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const viewParam = params.get("view") || params.get("mode");
      if (viewParam === "hrd" || viewParam === "review") {
        setIsHrdView(true);
      }
    }

    const fetchPortfolioData = async () => {
      try {
        const res = await fetch("/api/portfolio");
        const data = await res.json();
        if (data.profile && Object.keys(data.profile).length > 0) {
          setProfile(data.profile);
        }
        if (data.executiveSummary) {
          setExecutiveSummary(data.executiveSummary);
        }
        if (Array.isArray(data.skillCategories) && data.skillCategories.length > 0) {
          setSkillCategories(data.skillCategories);
        }
        if (Array.isArray(data.certificates) && data.certificates.length > 0) {
          setCertificates(data.certificates);
        }
        if (Array.isArray(data.experiences) && data.experiences.length > 0) {
          setExperiences(data.experiences);
        }
      } catch (err) {
        console.error("Gagal memuat data dari server, menggunakan data cadangan:", err);
      }
    };

    fetchPortfolioData();
  }, []);

  // Scroll spy
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["tentang", "pengalaman", "sertifikat", "keahlian", "fitur-ai", "kontak"];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Open editor directly to specific section tab
  const handleOpenEditor = (tab: EditorTab = "profile") => {
    setEditorInitialTab(tab);
    setIsEditorOpen(true);
  };

  // CRUD Event Handlers
  const handleAddExperienceSuccess = (newExp: Experience) => {
    setExperiences((prev) => [newExp, ...prev]);
  };

  const handleDeleteExperience = async (id: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus pengalaman kerja ini?")) return;
    try {
      const res = await fetch(`/api/portfolio/experience/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setExperiences((prev) => prev.filter((e) => e.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddCertificateSuccess = (newCert: Certificate) => {
    setCertificates((prev) => [...prev, newCert]);
  };

  const handleDeleteCertificate = async (id: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus sertifikat ini?")) return;
    try {
      const res = await fetch(`/api/portfolio/certificate/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setCertificates((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const scrollToAI = () => {
    const el = document.getElementById("fitur-ai");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Admin Management Bar with SINGLE dropdown button for clean UI / HRD Review Banner */}
      <AdminBar
        isHrdView={isHrdView}
        onToggleHrdView={() => setIsHrdView(!isHrdView)}
        onOpenEditor={handleOpenEditor}
        onOpenDossierBuilder={() => setIsDossierBuilderOpen(true)}
      />

      {/* Top Bar Navigation */}
      <Navbar 
        onStartPitch={() => setIsPresentationOpen(true)} 
        activeSection={activeSection}
      />

      {/* Main Content Sections */}
      <main>
        {/* Split-screen Hero with Dynamic Profile & in-place edit */}
        <Hero 
          profile={profile}
          isHrdView={isHrdView}
          onStartPitch={() => setIsPresentationOpen(true)}
          onExploreAI={scrollToAI}
          onOpenEditor={() => handleOpenEditor("profile")}
        />

        {/* 4-Item Credibility & Metrics Strip */}
        <MetricsStrip />

        {/* Executive Summary & Work Philosophy with in-place edit */}
        <ExecutiveSummary 
          executiveSummary={executiveSummary}
          isHrdView={isHrdView}
          onOpenEditor={() => handleOpenEditor("summary")}
        />

        {/* Experience Timeline & Case Details with Filters and Dynamic Data */}
        <ExperienceSection 
          experiences={experiences}
          isHrdView={isHrdView}
          onDeleteExperience={handleDeleteExperience}
        />

        {/* Verified Certificate Gallery & Lightbox Viewer */}
        <CertificateGallery 
          certificates={certificates}
          isHrdView={isHrdView}
          onDeleteCertificate={handleDeleteCertificate}
        />

        {/* Technical & Administrative Competencies Matrix with in-place edit */}
        <SkillsMatrix 
          skillCategories={skillCategories}
          isHrdView={isHrdView}
          onOpenEditor={() => handleOpenEditor("skills")}
        />

        {/* AI Suite: Career Chatbot, ATS Job Matcher, and Instant Cover Letter */}
        <AISuite />

        {/* Contact & Professional Conclusion */}
        <ContactSection />
      </main>

      {/* Interactive Cinematic Presentation Slide Mode (with voice narration) */}
      <PresentationMode 
        isOpen={isPresentationOpen}
        onClose={() => setIsPresentationOpen(false)}
      />

      {/* Comprehensive Portfolio Editor Modal (Dropdown Central & in-place edit with AI Polish & ImgBB) */}
      <PortfolioEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        initialTab={editorInitialTab}
        profile={profile}
        setProfile={setProfile}
        executiveSummary={executiveSummary}
        setExecutiveSummary={setExecutiveSummary}
        skillCategories={skillCategories}
        setSkillCategories={setSkillCategories}
        certificates={certificates}
        setCertificates={setCertificates}
        experiences={experiences}
        setExperiences={setExperiences}
      />

      {/* Modal: Tambah Pekerjaan Baru */}
      <AddExperienceModal
        isOpen={isAddExperienceOpen}
        onClose={() => setIsAddExperienceOpen(false)}
        onSuccess={handleAddExperienceSuccess}
      />

      {/* Modal: Tambah Sertifikat Baru */}
      <AddCertificateModal
        isOpen={isAddCertificateOpen}
        onClose={() => setIsAddCertificateOpen(false)}
        onSuccess={handleAddCertificateSuccess}
      />

      {/* Modal: Penyusun Berkas Lamaran Lengkap (Dossier Merger) */}
      <ApplicationDossierModal
        isOpen={isDossierBuilderOpen}
        onClose={() => setIsDossierBuilderOpen(false)}
        profile={profile}
        certificates={certificates}
        experiences={experiences}
      />

    </div>
  );
}
