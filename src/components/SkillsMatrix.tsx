import React from "react";
import { CheckCircle2, FileSpreadsheet, Calculator, ShoppingBag, ShieldCheck, Edit2, Briefcase, Layers, Sparkles } from "lucide-react";
import { SKILL_CATEGORIES as DEFAULT_CATEGORIES } from "../data/portfolioData";

interface SkillsMatrixProps {
  skillCategories?: any[];
  isHrdView?: boolean;
  onOpenEditor?: () => void;
}

export const SkillsMatrix: React.FC<SkillsMatrixProps> = ({
  skillCategories,
  isHrdView = false,
  onOpenEditor,
}) => {
  const categories = (skillCategories && skillCategories.length > 0) ? skillCategories : DEFAULT_CATEGORIES;

  const getCategoryIcon = (category: string, idx: number) => {
    const lower = (category || "").toLowerCase();
    if (lower.includes("akuntansi") || lower.includes("keuangan") || lower.includes("kas")) {
      return Calculator;
    }
    if (lower.includes("tools") || lower.includes("excel") || lower.includes("digital") || lower.includes("software")) {
      return FileSpreadsheet;
    }
    if (lower.includes("retail") || lower.includes("toko") || lower.includes("kasir") || lower.includes("operasional")) {
      return ShoppingBag;
    }
    if (lower.includes("karakter") || lower.includes("etos") || lower.includes("integritas") || lower.includes("sikap")) {
      return ShieldCheck;
    }
    const icons = [Layers, Briefcase, Sparkles, ShieldCheck];
    return icons[idx % icons.length];
  };

  return (
    <section id="keahlian" className="py-20 border-b border-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
          <div className="max-w-3xl space-y-3">
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

          {!isHrdView && onOpenEditor && (
            <button
              onClick={onOpenEditor}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-medium transition-colors shrink-0"
              title="Edit Daftar Keahlian & Kategori"
            >
              <Edit2 size={12} className="text-emerald-400" />
              <span>Edit Keahlian</span>
            </button>
          )}
        </div>

        {/* Dynamic Category Grid */}
        <div className={`grid gap-6 ${
          categories.length === 1 
            ? "grid-cols-1 max-w-xl mx-auto" 
            : categories.length === 2 
            ? "grid-cols-1 md:grid-cols-2" 
            : categories.length === 3 
            ? "grid-cols-1 md:grid-cols-3" 
            : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
        }`}>
          {categories.map((cat, idx) => {
            const Icon = getCategoryIcon(cat.category, idx);
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
                    {(cat.items || []).map((item: any, iIdx: number) => (
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
