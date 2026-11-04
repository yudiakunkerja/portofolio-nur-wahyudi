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

export default function App() {
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("tentang");

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

  const scrollToAI = () => {
    const el = document.getElementById("fitur-ai");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Top Bar Navigation */}
      <Navbar 
        onStartPitch={() => setIsPresentationOpen(true)} 
        activeSection={activeSection}
      />

      {/* Main Content Sections */}
      <main>
        {/* Split-screen Hero */}
        <Hero 
          onStartPitch={() => setIsPresentationOpen(true)}
          onExploreAI={scrollToAI}
        />

        {/* 4-Item Credibility & Metrics Strip */}
        <MetricsStrip />

        {/* Executive Summary & Work Philosophy */}
        <ExecutiveSummary />

        {/* Experience Timeline & Case Details with Filters */}
        <ExperienceSection />

        {/* Verified Certificate Gallery & Lightbox Viewer */}
        <CertificateGallery />

        {/* Technical & Administrative Competencies Matrix */}
        <SkillsMatrix />

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

    </div>
  );
}
