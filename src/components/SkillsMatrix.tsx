import React from "react";
import { CheckCircle2, FileSpreadsheet, Calculator, ShoppingBag, ShieldCheck } from "lucide-react";
import { SKILL_CATEGORIES } from "../data/portfolioData";

export const SkillsMatrix: React.FC = () => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Administrasi & Akuntansi":
        return Calculator;
      case "Perangkat & Digital Tools":
        return FileSpreadsheet;
      case "Operasional & Retail":
        return ShoppingBag;
      default:
        return ShieldCheck;
    }
  };

  return (
    <section id="keahlian" className="py-20 border-b border-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="max-w-3xl mb-14 space-y-3">
          <p className="text-xs font-semibold text-emerald-400 tracking-wider uppercase font-mono">
            Katalog Kompetensi
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Keahlian Teknis & Integritas Profesional
          </h2>
          <p className="text-base text-slate-400 leading-relaxed">
            Kombinasi kemampuan akuntansi presisi, penguasaan software lembar kerja, operasional kasir, serta karakter etika kerja yang andal.
          </p>
        </div>

        {/* 4 Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SKILL_CATEGORIES.map((cat, idx) => {
            const Icon = getCategoryIcon(cat.category);
            return (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 transition-colors space-y-5 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                      <Icon size={18} />
                    </div>
                    <h3 className="font-display text-base font-bold text-white leading-snug">
                      {cat.category}
                    </h3>
                  </div>

                  <ul className="space-y-3">
                    {cat.items.map((item, iIdx) => (
                      <li key={iIdx} className="space-y-1">
                        <div className="flex items-start justify-between gap-2 text-xs">
                          <span className="text-slate-200 font-medium leading-tight">
                            {item.name}
                          </span>
                          <span className="font-mono text-[10px] text-emerald-400 shrink-0">
                            {item.level}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 text-[11px] font-mono text-slate-500 border-t border-slate-800/60">
                  Teruji dalam 5+ Tahun Pengalaman
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
