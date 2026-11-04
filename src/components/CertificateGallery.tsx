import React, { useState } from "react";
import { Award, ExternalLink, Eye, ShieldCheck, CheckCircle2 } from "lucide-react";
import { CERTIFICATES, Certificate } from "../data/portfolioData";
import { CertificateModal } from "./CertificateModal";

export const CertificateGallery: React.FC = () => {
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  return (
    <section id="sertifikat" className="py-20 border-b border-slate-900 bg-slate-950/30">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14 space-y-3">
          <p className="text-xs font-semibold text-emerald-400 tracking-wider uppercase font-mono">
            Bukti Kualifikasi & Uji Kompetensi
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Sertifikasi Resmi & Berkas Terverifikasi
          </h2>
          <p className="text-base text-slate-400 leading-relaxed">
            Seluruh keahlian akuntansi, rekam jejak industri retail, dan kepengurusan organisasi didukung bukti dokumen fisik otentik. Klik sertifikat untuk memperbesar dan meninjau detail.
          </p>
        </div>

        {/* Certificate Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CERTIFICATES.map((cert, index) => (
            <div
              key={cert.id}
              onClick={() => setSelectedCert(cert)}
              className="group cursor-pointer rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/5 transition-all overflow-hidden flex flex-col justify-between"
            >
              {/* Image Preview Container */}
              <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden border-b border-slate-800">
                <img
                  src={cert.url}
                  alt={cert.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain p-3 transition-transform duration-500 group-hover:scale-105"
                />

                {/* Scrim overlay with view button on hover */}
                <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <span className="flex items-center gap-1.5 px-4 py-2 bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold shadow-lg">
                    <Eye size={14} />
                    <span>Lihat Fullscreen</span>
                  </span>
                </div>

                {/* Badge Category */}
                <div className="absolute top-3 left-3">
                  <span className="text-[11px] font-mono font-medium px-2.5 py-1 bg-slate-950/80 backdrop-blur-sm border border-slate-700/80 rounded-md text-emerald-400">
                    {cert.category}
                  </span>
                </div>
              </div>

              {/* Certificate Info */}
              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="font-display text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {cert.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {cert.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <ShieldCheck size={14} />
                    <span>Terverifikasi</span>
                  </span>
                  <span className="group-hover:translate-x-0.5 transition-transform text-slate-400 flex items-center gap-1">
                    Detail <ExternalLink size={12} />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      <CertificateModal
        certificate={selectedCert}
        onClose={() => setSelectedCert(null)}
      />
    </section>
  );
};
