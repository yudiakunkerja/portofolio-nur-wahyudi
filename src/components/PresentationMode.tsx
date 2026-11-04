import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Play, Pause, ChevronLeft, ChevronRight, Volume2, VolumeX, 
  Sparkles, Award, Briefcase, MessageCircle, Mail, MapPin, CheckCircle2 
} from "lucide-react";
import { PROFILE_INFO, SLIDES_PRESENTATION, CERTIFICATES } from "../data/portfolioData";

interface PresentationModeProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PresentationMode: React.FC<PresentationModeProps> = ({ isOpen, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const timerRef = useRef<any>(null);

  const totalSlides = SLIDES_PRESENTATION.length;
  const slide = SLIDES_PRESENTATION[currentSlide];

  // Voice narration callback
  const speakCurrentSlide = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    if (!isVoiceEnabled || !isOpen) return;

    const utterance = new SpeechSynthesisUtterance(slide.speechText);
    utterance.lang = "id-ID";
    utterance.rate = 1.0;

    utterance.onend = () => {
      if (isPlaying && currentSlide < totalSlides - 1) {
        timerRef.current = setTimeout(() => {
          setCurrentSlide((prev) => prev + 1);
        }, 1500);
      }
    };

    window.speechSynthesis.speak(utterance);
  }, [slide, isVoiceEnabled, isPlaying, currentSlide, totalSlides, isOpen]);

  useEffect(() => {
    if (isOpen) {
      speakCurrentSlide();
    } else {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      if (timerRef.current) clearTimeout(timerRef.current);
    }

    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentSlide, isOpen, speakCurrentSlide]);

  const handleNext = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      setIsPlaying(false);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  if (!isOpen) return null;

  const progress = ((currentSlide + 1) / totalSlides) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-[#070b14] text-white flex flex-col font-sans select-none overflow-hidden animate-fadeIn">
      
      {/* Top Progress Bar */}
      <div className="h-1.5 w-full bg-slate-900">
        <motion.div
          className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Top Control Bar */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-slate-900 bg-slate-950/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="font-display font-bold text-sm tracking-tight text-white">
            NUR WAHYUDI
          </span>
          <span className="text-xs text-slate-500 font-mono hidden sm:inline">· Pitch Deck Narasi Suara</span>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            Slide {currentSlide + 1} / {totalSlides}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
            className={`p-2.5 rounded-xl border transition-colors ${
              isVoiceEnabled
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                : "bg-slate-900 text-slate-500 border-slate-800"
            }`}
            title={isVoiceEnabled ? "Nonaktifkan Suara" : "Aktifkan Suara"}
          >
            {isVoiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-2.5 rounded-xl border transition-colors ${
              isPlaying
                ? "bg-slate-900 text-slate-300 border-slate-800"
                : "bg-emerald-400 text-slate-950 border-emerald-300 font-bold"
            }`}
            title={isPlaying ? "Jeda Otomatis" : "Lanjutkan Otomatis"}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>

          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
            title="Tutup Mode Presentasi (ESC)"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Center Slide Viewport */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative overflow-hidden">
        
        {/* Subtle Ambient Glow */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-4xl"
          >
            {/* Slide 1: Welcome Profile */}
            {currentSlide === 0 && (
              <div className="flex flex-col md:flex-row items-center gap-10 bg-slate-900/60 p-8 sm:p-12 rounded-3xl border border-slate-800">
                <div className="relative w-44 h-44 sm:w-56 sm:h-56 rounded-full overflow-hidden border-4 border-slate-800 shadow-2xl shrink-0">
                  <img
                    src={PROFILE_INFO.photoUrl}
                    alt="Nur Wahyudi"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-4 text-center md:text-left">
                  <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
                    Available for Hire
                  </div>
                  <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                    NUR WAHYUDI
                  </h2>
                  <p className="text-base sm:text-lg text-slate-300">
                    Administrative Specialist & Accounting Professional
                  </p>
                  <p className="text-xs sm:text-sm text-slate-400 max-w-lg leading-relaxed">
                    Lebih dari 5 tahun rekam jejak profesional di industri pertambangan (PT Kovalen Mining) dan ritel modern (Transmart, AEON Mall).
                  </p>
                </div>
              </div>
            )}

            {/* Slide 2: Executive Summary */}
            {currentSlide === 1 && (
              <div className="bg-slate-900/60 p-8 sm:p-12 rounded-3xl border border-slate-800 space-y-6">
                <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
                  Nilai & Filosofi Kerja
                </div>
                <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Ketelitian Tinggi & Integritas Tanpa Kompromi
                </h2>
                <p className="text-base sm:text-xl text-slate-300 leading-relaxed italic border-l-2 border-emerald-400 pl-6">
                  "Dengan latar belakang pendidikan Akuntansi serta pengalaman kerja profesional lebih dari 5 tahun, saya telah terbiasa bekerja dengan ketelitian tinggi, integritas, dan tanggung jawab penuh dalam mengelola administrasi serta keuangan."
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs text-slate-300">
                    <span className="text-emerald-400 font-semibold">100% </span>Akurasi Kas Harian
                  </div>
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs text-slate-300">
                    <span className="text-emerald-400 font-semibold">Zero </span>Discrepancy Closing
                  </div>
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs text-slate-300">
                    <span className="text-emerald-400 font-semibold">Sistematis </span>Pengarsipan Berkas
                  </div>
                </div>
              </div>
            )}

            {/* Slide 3: PT Kovalen Mining */}
            {currentSlide === 2 && (
              <div className="bg-slate-900/60 p-8 sm:p-12 rounded-3xl border border-slate-800 space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
                      Pengalaman Utama (Des 2020 - Jan 2025)
                    </span>
                    <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
                      PT KOVALEN MINING
                    </h2>
                    <p className="text-emerald-400 font-semibold text-sm">Staff Administrasi & Keuangan (5 Tahun)</p>
                  </div>
                  <span className="text-xs font-mono text-slate-400 bg-slate-800 px-3 py-1 rounded-lg">
                    Sektor Pertambangan
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1.5">
                    <CheckCircle2 size={18} className="text-emerald-400" />
                    <h3 className="text-sm font-bold text-white">Arus Kas Harian</h3>
                    <p className="text-xs text-slate-400">Pengelolaan petty cash operasional tanpa selisih.</p>
                  </div>
                  <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1.5">
                    <CheckCircle2 size={18} className="text-emerald-400" />
                    <h3 className="text-sm font-bold text-white">Pengarsipan Terstruktur</h3>
                    <p className="text-xs text-slate-400">Sistem berkas kontrak & nota legal siap audit.</p>
                  </div>
                  <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1.5">
                    <CheckCircle2 size={18} className="text-emerald-400" />
                    <h3 className="text-sm font-bold text-white">Laporan Keuangan</h3>
                    <p className="text-xs text-slate-400">Penyusunan rekapitulasi data keuangan bulanan/tahunan.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Slide 4: Transmart Carrefour */}
            {currentSlide === 3 && (
              <div className="bg-slate-900/60 p-8 sm:p-12 rounded-3xl border border-slate-800 space-y-6">
                <div>
                  <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
                    Pengalaman Retail (Jan 2020 - Mar 2020)
                  </span>
                  <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
                    TRANSMART CARREFOUR
                  </h2>
                  <p className="text-cyan-400 font-semibold text-sm">Cashier</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1.5">
                    <CheckCircle2 size={18} className="text-cyan-400" />
                    <h3 className="text-sm font-bold text-white">Akurasi Transaksi</h3>
                    <p className="text-xs text-slate-400">Memproses ratusan transaksi pembayaran per hari tanpa selisih register.</p>
                  </div>
                  <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1.5">
                    <CheckCircle2 size={18} className="text-cyan-400" />
                    <h3 className="text-sm font-bold text-white">Laporan Kas Fisik</h3>
                    <p className="text-xs text-slate-400">Rekapitulasi fisik uang dan bukti EDC saat closing shift.</p>
                  </div>
                  <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1.5">
                    <CheckCircle2 size={18} className="text-cyan-400" />
                    <h3 className="text-sm font-bold text-white">Service Excellence</h3>
                    <p className="text-xs text-slate-400">Pelayanan cepat dan ramah di jam antrean padat.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Slide 5: AEON Store BSD */}
            {currentSlide === 4 && (
              <div className="bg-slate-900/60 p-8 sm:p-12 rounded-3xl border border-slate-800 space-y-6">
                <div>
                  <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-widest">
                    Standar Retail Jepang (Apr 2019 - Nov 2019)
                  </span>
                  <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
                    PT AEON STORE INDONESIA (BSD)
                  </h2>
                  <p className="text-purple-400 font-semibold text-sm">Pramuniaga / Sales Associate</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1.5">
                    <CheckCircle2 size={18} className="text-purple-400" />
                    <h3 className="text-sm font-bold text-white">Visual Merchandising</h3>
                    <p className="text-xs text-slate-400">Penataan display produk rapi sesuai standar estetika retail Jepang.</p>
                  </div>
                  <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1.5">
                    <CheckCircle2 size={18} className="text-purple-400" />
                    <h3 className="text-sm font-bold text-white">Inventory Control</h3>
                    <p className="text-xs text-slate-400">Stock opname berkala dan pengecekan rotasi barang masuk.</p>
                  </div>
                  <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1.5">
                    <CheckCircle2 size={18} className="text-purple-400" />
                    <h3 className="text-sm font-bold text-white">Standar Pelayanan</h3>
                    <p className="text-xs text-slate-400">Komunikasi profesional menyambut kebutuhan pengunjung mall.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Slide 6: Sertifikat */}
            {currentSlide === 5 && (
              <div className="bg-slate-900/60 p-8 sm:p-12 rounded-3xl border border-slate-800 space-y-6">
                <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
                  Validasi Kredensial
                </div>
                <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  5 Sertifikasi Resmi Terverifikasi
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
                  {CERTIFICATES.map((cert) => (
                    <div key={cert.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center space-y-2">
                      <div className="aspect-[4/3] bg-slate-900 rounded-lg overflow-hidden border border-slate-800">
                        <img src={cert.url} alt={cert.name} referrerPolicy="no-referrer" className="w-full h-full object-contain p-1" />
                      </div>
                      <p className="text-[11px] font-semibold text-slate-200 line-clamp-2">{cert.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Slide 7: Call to Action */}
            {currentSlide === 6 && (
              <div className="bg-slate-900/60 p-8 sm:p-12 rounded-3xl border border-slate-800 text-center space-y-6">
                <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
                  Siap Bergabung Segera
                </div>
                <h2 className="font-display text-4xl sm:text-5xl font-black text-white tracking-tight">
                  Mari Berkolaborasi Bersama
                </h2>
                <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto leading-relaxed">
                  Saya siap memberikan kontribusi maksimal dan ketelitian penuh untuk tim Anda.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                  <a
                    href={`https://wa.me/${PROFILE_INFO.whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-500/20"
                  >
                    <MessageCircle size={18} />
                    <span>Jadwalkan Wawancara via WhatsApp</span>
                  </a>
                  <a
                    href={`mailto:${PROFILE_INFO.email}`}
                    className="flex items-center gap-2 px-5 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm rounded-xl transition-colors border border-slate-700"
                  >
                    <Mail size={18} />
                    <span>Kirim Email Resmi</span>
                  </a>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>

      </div>

      {/* Bottom Subtitle Narration Bar */}
      <div className="px-6 py-4 bg-slate-950/90 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Navigation Buttons */}
        <button
          onClick={handlePrev}
          disabled={currentSlide === 0}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
        >
          <ChevronLeft size={16} />
          <span>Slide Sebelumnya</span>
        </button>

        {/* Subtitle text display */}
        <div className="flex-1 max-w-2xl text-center">
          <p className="text-xs text-slate-300 italic font-sans leading-relaxed">
            "{slide.speechText}"
          </p>
        </div>

        <button
          onClick={handleNext}
          disabled={currentSlide === totalSlides - 1}
          className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 disabled:opacity-30 transition-colors"
        >
          <span>Slide Selanjutnya</span>
          <ChevronRight size={16} />
        </button>

      </div>

    </div>
  );
};
