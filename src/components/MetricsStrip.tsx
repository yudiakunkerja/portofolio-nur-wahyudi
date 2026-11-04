import React from "react";
import { Briefcase, CheckCircle, Award, Building2 } from "lucide-react";

export const MetricsStrip: React.FC = () => {
  const metrics = [
    {
      value: "5+ Tahun",
      label: "Pengalaman Kerja Nyata",
      sublabel: "Administrasi operasional tambang & ritel modern",
      icon: Briefcase,
    },
    {
      value: "100%",
      label: "Akurasi Kas & Zero Error",
      sublabel: "Konsistensi pencatatan petty cash tanpa selisih",
      icon: CheckCircle,
    },
    {
      value: "5 Berkas",
      label: "Sertifikasi Resmi Terlampir",
      sublabel: "Kompetensi Akuntansi, OSIS, Gramedia, AEON, Transmart",
      icon: Award,
    },
    {
      value: "3 Korporasi",
      label: "Perusahaan Skala Besar",
      sublabel: "PT Kovalen Mining, Trans Retail, & AEON Store",
      icon: Building2,
    },
  ];

  return (
    <section className="border-b border-slate-900 bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {metrics.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index}
                className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700/80 transition-colors space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-3xl font-black text-white tracking-tight font-mono tabular-nums">
                    {item.value}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <Icon size={16} />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-200">
                    {item.label}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5 leading-snug">
                    {item.sublabel}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
