import React, { useState } from "react";
import { Briefcase, Calendar, MapPin, CheckCircle2, ChevronRight, Layers, Trash2 } from "lucide-react";
import { EXPERIENCES as DEFAULT_EXPERIENCES, Experience } from "../data/portfolioData";

interface ExperienceSectionProps {
  experiences?: Experience[];
  isHrdView?: boolean;
  onDeleteExperience?: (id: string) => void;
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  experiences = DEFAULT_EXPERIENCES,
  isHrdView = false,
  onDeleteExperience,
}) => {
  const [filter, setFilter] = useState<"all" | "administrasi" | "retail">("all");

  const filteredExperiences = experiences.filter((exp) => {
    if (filter === "all") return true;
    return exp.category === filter;
  });

  return (
    <section id="pengalaman" className="py-20 border-b border-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header & Interactive Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-2xl">
            <p className="text-xs font-semibold text-emerald-400 tracking-wider uppercase font-mono">
              Rekam Jejak Profesional
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Pengalaman Kerja & Tanggung Jawab
            </h2>
            <p className="text-base text-slate-400 leading-relaxed">
              Pengalaman langsung di operasional industri pertambangan dan ritel modern berskala nasional hingga multinasional.
            </p>
          </div>

          {/* Interactive Segmented Filter Controls */}
          <div className="inline-flex items-center gap-1 p-1 bg-slate-900/90 border border-slate-800 rounded-xl shrink-0 self-start md:self-auto">
            <button
              onClick={() => setFilter("all")}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                filter === "all"
                  ? "bg-emerald-400 text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Semua Pengalaman ({experiences.length})
            </button>
            <button
              onClick={() => setFilter("administrasi")}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                filter === "administrasi"
                  ? "bg-emerald-400 text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Administrasi & Keuangan
            </button>
            <button
              onClick={() => setFilter("retail")}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                filter === "retail"
                  ? "bg-emerald-400 text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Retail & Pelayanan
            </button>
          </div>
        </div>

        {/* Experience Cards */}
        <div className="space-y-8">
          {filteredExperiences.map((exp) => (
            <div
              key={exp.id}
              className="p-8 sm:p-10 rounded-3xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 transition-all space-y-6 relative group"
            >
              {/* Header Info */}
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 border-b border-slate-800/80 pb-6">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                    <span className="text-emerald-400 font-semibold">{exp.period}</span>
                    <span aria-hidden="true" className="text-slate-700">·</span>
                    <span className="text-slate-300">{exp.duration}</span>
                    <span aria-hidden="true" className="text-slate-700">·</span>
                    <span>{exp.location}</span>
                  </div>

                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    {exp.company}
                  </h3>
                  <p className="text-base font-semibold text-emerald-400">
                    {exp.role}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start lg:self-center">
                  <span className="text-xs font-mono text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
                    {exp.category === "administrasi" ? "Sektor Pertambangan / Keuangan" : "Sektor Ritel Modern"}
                  </span>
                  
                  {/* Delete button (Admin mode only) */}
                  {!isHrdView && onDeleteExperience && (
                    <button
                      onClick={() => onDeleteExperience(exp.id)}
                      className="p-1.5 text-slate-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                      title="Hapus riwayat pekerjaan ini"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {exp.description}
              </p>

              {/* Responsibilities & Achievements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Responsibilities */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                    Tanggung Jawab Utama
                  </h4>
                  <ul className="space-y-2.5">
                    {exp.responsibilities.map((item, rIdx) => (
                      <li key={rIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                        <CheckCircle2 size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Achievements & Impact */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                    Hasil Nyata & Pencapaian
                  </h4>
                  <div className="space-y-3">
                    {exp.achievements.map((ach, aIdx) => (
                      <div 
                        key={aIdx} 
                        className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs sm:text-sm text-slate-300 leading-relaxed"
                      >
                        <span className="text-emerald-400 font-semibold">Pencapaian: </span>
                        {ach}
                      </div>
                    ))}

                    {/* Skill Tags */}
                    <div className="pt-2">
                      <p className="text-xs font-mono text-slate-500 mb-2">Keahlian yang Diterapkan:</p>
                      <div className="flex flex-wrap gap-1.5 text-xs text-slate-300">
                        {exp.skills.map((s, sIdx) => (
                          <span 
                            key={sIdx} 
                            className="px-2.5 py-1 bg-slate-800/70 border border-slate-700/60 rounded-md text-[11px] font-mono text-slate-300"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
