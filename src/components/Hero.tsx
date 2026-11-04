import React from "react";
import { motion } from "framer-motion";
import { Sparkles, MessageCircle, FileText, CheckCircle2, ChevronDown, Volume2, ShieldCheck, ArrowRight } from "lucide-react";
import { PROFILE_INFO } from "../data/portfolioData";

interface HeroProps {
  onStartPitch: () => void;
  onExploreAI: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartPitch, onExploreAI }) => {
  const handleWhatsApp = () => {
    window.open(`https://wa.me/${PROFILE_INFO.whatsappNumber}?text=Halo%20Nur%20Wahyudi,%20kami%20telah%20melihat%20portofolio%20Anda.`, "_blank");
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-slate-900">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column (Typographic Authority) */}
          <motion.div 
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-6"
          >
            {/* Unboxed Metadata Kicker (Anti-pill) */}
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 tracking-wider uppercase font-mono">
              <Sparkles size={14} className="text-emerald-400" />
              <span>Portofolio Karier Resmi</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-300">{PROFILE_INFO.status}</span>
            </div>

            {/* Display Headline with balanced text */}
            <div className="space-y-2">
              <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.05] text-balance">
                NUR WAHYUDI
              </h1>
              <p className="font-display text-xl sm:text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-cyan-200 to-slate-200">
                {PROFILE_INFO.title}
              </p>
            </div>

            {/* Lead Narrative */}
            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl">
              Spesialis administrasi dan keuangan berpengalaman lebih dari 5 tahun di industri pertambangan (PT Kovalen Mining) dan retail terkemuka. Terbiasa mengelola arus kas harian, rekonsiliasi keuangan, dan pengarsipan berkas terstruktur dengan integritas tinggi dan rekam jejak tanpa selisih.
            </p>

            {/* Unboxed Key Facts */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-400 border-t border-slate-800/80 pt-4">
              <span className="text-slate-200 font-medium">Pagedangan, Tangerang - Banten</span>
              <span aria-hidden="true" className="text-slate-700">·</span>
              <span className="text-slate-200 font-medium">Sertifikat Kompetensi Akuntansi</span>
              <span aria-hidden="true" className="text-slate-700">·</span>
              <span className="text-slate-200 font-medium">5 Tahun PT Kovalen Mining</span>
              <span aria-hidden="true" className="text-slate-700">·</span>
              <span className="text-emerald-400 font-medium">Siap Kerja Segera</span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={handleWhatsApp}
                className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
              >
                <MessageCircle size={17} />
                <span>Undang Wawancara (WhatsApp)</span>
              </button>

              <button
                onClick={onExploreAI}
                className="flex items-center gap-2 px-5 py-3 text-sm font-semibold text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-800/60 rounded-xl transition-all hover:border-cyan-600 active:scale-[0.98]"
              >
                <Sparkles size={16} />
                <span>Uji Kecocokan Loker dengan AI</span>
              </button>

              <button
                onClick={onStartPitch}
                className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-colors"
                title="Buka Slide Presentasi Suara Interaktif"
              >
                <Volume2 size={16} className="text-emerald-400" />
                <span>Dengarkan Presentasi</span>
              </button>
            </div>

          </motion.div>

          {/* Right Column: Visual Container with Photo of Nur Wahyudi */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex justify-center"
          >
            <div className="relative w-full max-w-md">
              {/* Outer Glow Halo */}
              <div className="absolute -inset-1.5 bg-gradient-to-b from-emerald-500/20 via-cyan-500/20 to-transparent rounded-3xl blur-xl" />

              <div className="relative rounded-3xl border border-slate-800 bg-slate-900/90 p-5 shadow-2xl backdrop-blur-sm">
                
                {/* Photo Frame */}
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 group">
                  <img
                    src={PROFILE_INFO.photoUrl}
                    alt="Nur Wahyudi - Administrative Specialist & Accounting Professional"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* High contrast gradient scrim for legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent opacity-85" />

                  {/* Overlaid Bottom Card on Photo */}
                  <div className="absolute bottom-0 inset-x-0 p-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                        <ShieldCheck size={16} />
                        <span>Kandidat Terverifikasi</span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">ID: NW-2025</span>
                    </div>

                    <p className="text-white font-bold text-lg leading-tight font-display">
                      Nur Wahyudi
                    </p>
                    <p className="text-xs text-slate-300 font-normal">
                      Ex-Staff Administrasi PT Kovalen Mining · Bersertifikat Akuntansi
                    </p>

                    <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80">
                      <span>Domisili: Pagedangan, Tangerang</span>
                      <span className="text-emerald-400 font-medium">Tersedia Segera</span>
                    </div>
                  </div>
                </div>

                {/* Sub-card: Interactive Voice Audio Pitch Trigger */}
                <div className="mt-4 p-3.5 bg-slate-950/80 border border-slate-800/80 rounded-xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                      <Volume2 size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">Audio Tur Profil Kandidat</p>
                      <p className="text-[11px] text-slate-400">Dengarkan narasi suara otomatis bahasa Indonesia</p>
                    </div>
                  </div>
                  <button
                    onClick={onStartPitch}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1"
                  >
                    <span>Mulai</span>
                    <ArrowRight size={12} />
                  </button>
                </div>

              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
