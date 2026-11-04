import React from "react";
import { ScrollText, CheckCircle2, Target, Shield, HeartHandshake } from "lucide-react";
import { PROFILE_INFO } from "../data/portfolioData";

export const ExecutiveSummary: React.FC = () => {
  const principles = [
    {
      title: "Presisi & Nol Selisih (Zero Discrepancy)",
      desc: "Menjaga keakuratan setiap transaksi keuangan, pencatatan petty cash, dan input data tanpa margin error.",
      icon: Target,
    },
    {
      title: "Integritas & Kejujuran Finansial",
      desc: "Memiliki rekam jejak tepercaya selama 5 tahun mengelola dana operasional dan berkas berharga perusahaan.",
      icon: Shield,
    },
    {
      title: "Kerapihan Sistem Pengarsipan",
      desc: "Menerapkan struktur filing dokumen fisik dan digital yang sistematis, mempermudah audit dan penelusuran bukti.",
      icon: ScrollText,
    },
    {
      title: "Pelayanan & Kolaborasi Tim",
      desc: "Terlatih dalam service excellence retail modern dan koordinasi lintas departemen dengan komunikasi santun dan cekatan.",
      icon: HeartHandshake,
    },
  ];

  return (
    <section id="tentang" className="py-20 border-b border-slate-900 relative">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14 space-y-3">
          <p className="text-xs font-semibold text-emerald-400 tracking-wider uppercase font-mono">
            Executive Summary
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Dedikasi Ketelitian & Disiplin Administrasi Finansial
          </h2>
          <p className="text-base text-slate-400 leading-relaxed">
            Mengenal lebih dekat dedikasi kerja, filosofi profesional, dan nilai tambah yang siap saya berikan untuk organisasi Anda.
          </p>
        </div>

        {/* Narrative & Quote Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Main Statement Box */}
          <div className="lg:col-span-7 p-8 sm:p-10 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">
                Komitmen Profesional
              </span>
              <p className="text-xl sm:text-2xl font-light text-slate-200 leading-relaxed italic">
                "Bagi saya, administrasi dan keuangan adalah fondasi keteraturan operasional. Bekerja dengan disiplin tinggi, integritas tanpa kompromi, dan pembukuan tanpa selisih adalah standar wajib yang selalu saya pegang teguh."
              </p>
              <p className="text-sm text-slate-400 leading-relaxed">
                Dengan latar belakang pendidikan Akuntansi bersertifikat resmi serta pengalaman kerja nyata di lingkungan tambang yang dinamis dan retail yang serba cepat, saya mampu beradaptasi cepat dengan alur kerja, software pembukuan, maupun standar SOP perusahaan Anda.
              </p>
            </div>

            <div className="border-t border-slate-800/80 pt-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs text-slate-500 font-mono">Penandatangan Profil</p>
                <p className="text-lg font-bold text-white font-display">Nur Wahyudi</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 font-mono">Status Ketersediaan</p>
                <p className="text-sm font-semibold text-emerald-400">Siap Bergabung Segera</p>
              </div>
            </div>
          </div>

          {/* 4 Pillars of Excellence */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {principles.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div 
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700 transition-colors flex gap-4 items-start"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/60 flex items-center justify-center text-emerald-400 shrink-0">
                    <Icon size={18} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-white">
                      {p.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
