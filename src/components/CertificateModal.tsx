import React, { useEffect } from "react";
import { X, ExternalLink, Award, CheckCircle, ShieldCheck } from "lucide-react";
import { Certificate } from "../data/portfolioData";

interface CertificateModalProps {
  certificate: Certificate | null;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ certificate, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!certificate) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-5xl max-h-[92vh] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Award size={18} />
            </div>
            <div>
              <h3 className="font-display text-base sm:text-lg font-bold text-white line-clamp-1">
                {certificate.name}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {certificate.issuer} · {certificate.year}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={certificate.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
            >
              <ExternalLink size={14} />
              <span>Buka Resolusi Asli</span>
            </a>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Tutup Pratinjau Sertifikat"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body: Scrollable Image & Metadata */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          
          {/* Certificate Image View */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center min-h-[360px] max-h-[65vh]">
            <img
              src={certificate.url}
              alt={certificate.name}
              referrerPolicy="no-referrer"
              className="max-h-[65vh] w-auto max-w-full object-contain p-2"
            />
          </div>

          {/* Details & Competencies */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-950/60 p-5 rounded-2xl border border-slate-800/80">
            <div className="md:col-span-2 space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">Deskripsi & Ruang Lingkup</h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                {certificate.description}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">Kompetensi Terkait</h4>
              <div className="flex flex-wrap gap-1.5">
                {certificate.skillsHighlighted.map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-md text-xs font-mono text-emerald-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
