import React from "react";
import { MessageCircle, Sparkles, Play } from "lucide-react";
import { PROFILE_INFO } from "../data/portfolioData";

interface NavbarProps {
  onStartPitch: () => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onStartPitch, activeSection }) => {
  const handleWhatsApp = () => {
    window.open(`https://wa.me/${PROFILE_INFO.whatsappNumber}?text=Halo%20Nur%20Wahyudi,%20kami%20tertarik%20dengan%20profil%20Anda%20dan%20ingin%20mengundang%20sesi%20interview.`, "_blank");
  };

  const navItems = [
    { label: "Tentang", href: "#tentang", id: "tentang" },
    { label: "Pengalaman", href: "#pengalaman", id: "pengalaman" },
    { label: "Sertifikat", href: "#sertifikat", id: "sertifikat" },
    { label: "Keahlian", href: "#keahlian", id: "keahlian" },
    { label: "Fitur AI", href: "#fitur-ai", id: "fitur-ai" },
    { label: "Kontak", href: "#kontak", id: "kontak" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-950/85 border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single element brand wordmark */}
        <a 
          href="#" 
          className="font-display text-lg font-bold tracking-tight text-white hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <span>NUR WAHYUDI</span>
          <span className="text-xs font-normal text-slate-500 font-sans hidden sm:inline">· Portofolio</span>
        </a>

        {/* Zone 2: Concise single-line navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-400">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 relative ${
                activeSection === item.id ? "text-emerald-400 font-semibold" : ""
              }`}
            >
              {item.label}
              {activeSection === item.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full" />
              )}
            </a>
          ))}
        </nav>

        {/* Zone 3: Actions - Mode Pitch & WhatsApp CTA */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onStartPitch}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-700/80 rounded-lg hover:border-slate-600 transition-colors whitespace-nowrap shrink-0"
            title="Buka Mode Presentasi Suara Interaktif"
          >
            <Play size={13} className="text-emerald-400 fill-emerald-400/20" />
            <span className="hidden sm:inline">Mode Presentasi Suara</span>
            <span className="sm:hidden">Presentasi</span>
          </button>

          <button
            onClick={handleWhatsApp}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm shadow-emerald-500/20"
          >
            <MessageCircle size={14} />
            <span>Hubungi via WhatsApp</span>
          </button>
        </div>

      </div>
    </header>
  );
};
