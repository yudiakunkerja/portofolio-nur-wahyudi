import React, { useState, useRef, useEffect } from "react";
import {
  Shield,
  Share2,
  Check,
  Eye,
  ChevronDown,
  User,
  ScrollText,
  Briefcase,
  Award,
  Layers,
  Cloud,
  FileText,
  SlidersHorizontal
} from "lucide-react";
import { EditorTab } from "./PortfolioEditorModal";

interface AdminBarProps {
  isHrdView: boolean;
  onToggleHrdView: () => void;
  onOpenEditor: (tab?: EditorTab) => void;
  onOpenDossierBuilder: () => void;
}

export const AdminBar: React.FC<AdminBarProps> = ({
  isHrdView,
  onToggleHrdView,
  onOpenEditor,
  onOpenDossierBuilder,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getHrdShareUrl = () => {
    if (typeof window === "undefined") return "";
    const url = new URL(window.location.href);
    url.searchParams.set("view", "hrd");
    return url.toString();
  };

  const handleCopyHrdLink = () => {
    const link = getHrdShareUrl();
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  if (isHrdView) {
    return (
      <div className="bg-emerald-950/90 border-b border-emerald-800/80 px-6 py-2.5 text-xs text-emerald-200 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-50 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-white">Mode Tampilan Khusus Review HRD & Perusahaan</span>
          <span className="text-emerald-400/80 hidden sm:inline">· Portofolio Resmi Nur Wahyudi</span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://wa.me/62881024040191?text=Halo%20Nur%20Wahyudi,%20kami%20telah%20meninjau%20portofolio%20Anda."
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 bg-emerald-400 text-slate-950 rounded-lg font-bold hover:bg-emerald-300 transition-colors"
          >
            Hubungi via WhatsApp
          </a>
          <button
            onClick={onToggleHrdView}
            className="text-[11px] text-emerald-300/80 hover:text-white underline transition-colors"
          >
            Beralih ke Panel Pemilik (Admin)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border-b border-slate-800 px-6 py-2.5 sticky top-0 z-50 text-xs text-slate-200 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: Admin Identifier */}
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <Shield size={13} />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-white tracking-tight">Panel Pengelola Portofolio</span>
            <span className="text-[11px] text-emerald-400 font-mono hidden sm:inline">(Aplikasi Utama Nur Wahyudi)</span>
          </div>
        </div>

        {/* Right: Unified Single Dropdown & Actions */}
        <div className="flex items-center gap-2">
          
          {/* SINGLE DROPDOWN BUTTON FOR CLEAN UI */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold transition-all shadow-md shadow-emerald-500/20 active:scale-[0.98]"
            >
              <SlidersHorizontal size={13} />
              <span>Kelola & Edit Portofolio</span>
              <ChevronDown size={13} className={`transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown Menu Popup */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl py-2 z-50 animate-fadeIn divide-y divide-slate-800/80">
                <div className="px-3.5 py-2">
                  <p className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                    Pilih Bagian untuk Diedit / Dikelola:
                  </p>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      onOpenEditor("profile");
                      setIsDropdownOpen(false);
                    }}
                    className="w-full px-3.5 py-2 text-left hover:bg-slate-800 flex items-center gap-2.5 text-xs text-slate-200 hover:text-white transition-colors"
                  >
                    <User size={14} className="text-emerald-400 shrink-0" />
                    <div>
                      <p className="font-semibold">Edit Profil & Bio Hero</p>
                      <p className="text-[10px] text-slate-400">Nama, gelar, foto, dan ringkasan AI</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onOpenEditor("summary");
                      setIsDropdownOpen(false);
                    }}
                    className="w-full px-3.5 py-2 text-left hover:bg-slate-800 flex items-center gap-2.5 text-xs text-slate-200 hover:text-white transition-colors"
                  >
                    <ScrollText size={14} className="text-emerald-400 shrink-0" />
                    <div>
                      <p className="font-semibold">Edit Executive Summary</p>
                      <p className="text-[10px] text-slate-400">Komitmen kerja & pilar nilai keunggulan</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onOpenEditor("experience");
                      setIsDropdownOpen(false);
                    }}
                    className="w-full px-3.5 py-2 text-left hover:bg-slate-800 flex items-center gap-2.5 text-xs text-slate-200 hover:text-white transition-colors"
                  >
                    <Briefcase size={14} className="text-emerald-400 shrink-0" />
                    <div>
                      <p className="font-semibold">Kelola Pengalaman Kerja</p>
                      <p className="text-[10px] text-slate-400">Tambah baru / edit tugas & pencapaian</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onOpenEditor("certificates");
                      setIsDropdownOpen(false);
                    }}
                    className="w-full px-3.5 py-2 text-left hover:bg-slate-800 flex items-center gap-2.5 text-xs text-slate-200 hover:text-white transition-colors"
                  >
                    <Award size={14} className="text-cyan-400 shrink-0" />
                    <div>
                      <p className="font-semibold">Kelola Sertifikat & Berkas</p>
                      <p className="text-[10px] text-slate-400">Upload berkas / kelola bukti kualifikasi</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onOpenEditor("skills");
                      setIsDropdownOpen(false);
                    }}
                    className="w-full px-3.5 py-2 text-left hover:bg-slate-800 flex items-center gap-2.5 text-xs text-slate-200 hover:text-white transition-colors"
                  >
                    <Layers size={14} className="text-emerald-400 shrink-0" />
                    <div>
                      <p className="font-semibold">Kelola Keahlian & Kompetensi</p>
                      <p className="text-[10px] text-slate-400">Akuntansi, Excel, Kasir, dan Etika</p>
                    </div>
                  </button>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      onOpenEditor("imgbb");
                      setIsDropdownOpen(false);
                    }}
                    className="w-full px-3.5 py-2 text-left hover:bg-slate-800 flex items-center gap-2.5 text-xs text-slate-200 hover:text-white transition-colors"
                  >
                    <Cloud size={14} className="text-cyan-400 shrink-0" />
                    <div>
                      <p className="font-semibold">Auto-Upload Akun ImgBB</p>
                      <p className="text-[10px] text-cyan-300">Hubungkan akun Google ImgBB pribadi</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onOpenDossierBuilder();
                      setIsDropdownOpen(false);
                    }}
                    className="w-full px-3.5 py-2 text-left hover:bg-slate-800 flex items-center gap-2.5 text-xs text-slate-200 hover:text-white transition-colors"
                  >
                    <FileText size={14} className="text-emerald-400 shrink-0" />
                    <div>
                      <p className="font-semibold">Gabung Berkas Lamaran (Dossier)</p>
                      <p className="text-[10px] text-slate-400">Satukan Surat, CV & Lampiran Sertifikat</p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Share HRD Link Button */}
          <button
            onClick={handleCopyHrdLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors font-medium"
            title="Salin Link Khusus untuk Diberikan ke HRD atau Perusahaan"
          >
            {copiedLink ? (
              <>
                <Check size={13} className="text-emerald-400" />
                <span className="text-emerald-400 font-bold">Link HRD Tersalin!</span>
              </>
            ) : (
              <>
                <Share2 size={13} />
                <span className="hidden sm:inline">Salin Link HRD</span>
              </>
            )}
          </button>

          {/* Toggle HRD Preview View */}
          <button
            onClick={onToggleHrdView}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Pratinjau tampilan yang dilihat HRD"
          >
            <Eye size={13} />
            <span className="hidden md:inline">Pratinjau HRD</span>
          </button>

        </div>

      </div>
    </div>
  );
};
