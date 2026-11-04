import React, { useState } from "react";
import { MessageCircle, Mail, MapPin, Copy, Check, ExternalLink, Sparkles, Phone } from "lucide-react";
import { PROFILE_INFO } from "../data/portfolioData";

export const ContactSection: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PROFILE_INFO.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${PROFILE_INFO.whatsappNumber}?text=Halo%20Nur%20Wahyudi,%20kami%20ingin%20berdiskusi%20mengenai%20kesempatan%20kerja.`, "_blank");
  };

  return (
    <footer id="kontak" className="py-20 bg-slate-950 text-white relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Main CTA Block */}
        <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800 space-y-8">
          
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
              Langkah Selanjutnya
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-black text-white tracking-tight">
              Siap Menjadi Aset Berharga Bagi Tim Anda
            </h2>
            <p className="text-base text-slate-300 leading-relaxed">
              Saya terbuka untuk posisi Staff Administrasi, Finance / Accounting Assistant, Kasir Supervisor, maupun peran operasional kantor lainnya. Terbiasa bekerja dengan target ketelitian tinggi dan siap bergabung segera.
            </p>
          </div>

          {/* Contact Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            
            {/* WhatsApp Card */}
            <div 
              onClick={handleWhatsApp}
              className="group cursor-pointer p-6 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/30 hover:border-emerald-400 transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
                  <MessageCircle size={24} />
                </div>
                <div>
                  <p className="text-xs font-mono font-bold text-emerald-300 uppercase tracking-wider">
                    WhatsApp Messenger
                  </p>
                  <p className="font-display text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {PROFILE_INFO.phone}
                  </p>
                  <p className="text-xs text-slate-400">Respons cepat untuk undangan interview</p>
                </div>
              </div>
              <ExternalLink size={18} className="text-emerald-400 group-hover:translate-x-1 transition-transform" />
            </div>

            {/* Email Card */}
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-colors flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-800 text-cyan-400 flex items-center justify-center shrink-0 border border-slate-700">
                  <Mail size={22} />
                </div>
                <div>
                  <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                    Alamat Email Resmi
                  </p>
                  <a 
                    href={`mailto:${PROFILE_INFO.email}`} 
                    className="font-display text-base sm:text-lg font-bold text-white hover:text-cyan-300 transition-colors block"
                  >
                    {PROFILE_INFO.email}
                  </a>
                  <p className="text-xs text-slate-500">Kirimkan penawaran kerja / inquiry resmi</p>
                </div>
              </div>
              <button
                onClick={handleCopyEmail}
                className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
                title="Salin Alamat Email"
              >
                {copiedEmail ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
              </button>
            </div>

          </div>

          {/* Location & Extra Details */}
          <div className="border-t border-slate-800/80 pt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-2">
              <MapPin size={15} className="text-red-400" />
              <span>Domisili: {PROFILE_INFO.location}</span>
            </div>
            <div className="text-emerald-400 font-semibold">
              Ketersediaan: {PROFILE_INFO.status}
            </div>
          </div>

        </div>

        {/* Quiet Clean Footer */}
        <div className="pt-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 border-t border-slate-900 mt-12 font-sans">
          <p>© {new Date().getFullYear()} Nur Wahyudi · Seluruh hak cipta dilindungi.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Administrative Specialist</span>
            <span aria-hidden="true">·</span>
            <span>Accounting Professional</span>
            <span aria-hidden="true">·</span>
            <span>Tangerang, Banten</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
