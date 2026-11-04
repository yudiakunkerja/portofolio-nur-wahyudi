import React, { useState } from "react";
import { X, Briefcase, Plus, Loader2, Check } from "lucide-react";
import { AIPolishButton } from "./AIPolishButton";

interface AddExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newExp: any) => void;
}

export const AddExperienceModal: React.FC<AddExperienceModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [period, setPeriod] = useState("");
  const [duration, setDuration] = useState("");
  const [location, setLocation] = useState("Tangerang, Banten");
  const [category, setCategory] = useState<"administrasi" | "retail">("administrasi");
  const [description, setDescription] = useState("");
  const [responsibilitiesText, setResponsibilitiesText] = useState("");
  const [achievementsText, setAchievementsText] = useState("");
  const [skillsText, setSkillsText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !role.trim()) {
      setError("Nama perusahaan dan posisi wajib diisi.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const responsibilities = responsibilitiesText
        .split("\n")
        .map((r) => r.trim())
        .filter(Boolean);
      const achievements = achievementsText
        .split("\n")
        .map((a) => a.trim())
        .filter(Boolean);
      const skills = skillsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch("/api/portfolio/experience", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company,
          role,
          period: period || "2025 - Sekarang",
          duration: duration || "1 Tahun",
          location,
          category,
          description: description || "Bertanggung jawab atas kelancaran operasional administrasi.",
          responsibilities: responsibilities.length > 0 ? responsibilities : ["Melaksanakan tugas operasional harian secara presisi"],
          achievements: achievements.length > 0 ? achievements : ["Menyelesaikan tugas tepat waktu tanpa selisih data"],
          skills: skills.length > 0 ? skills : ["Administrasi", "Microsoft Excel"],
        }),
      });

      const data = await res.json();
      if (data.success && data.experience) {
        onSuccess(data.experience);
        onClose();
      } else {
        setError(data.error || "Gagal menyimpan pengalaman kerja.");
      }
    } catch (err: any) {
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] z-10">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Briefcase size={16} />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-white">
                Tambah Riwayat Pengalaman Kerja
              </h3>
              <p className="text-xs text-slate-400">Data akan langsung tersimpan dan tampil di portofolio</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg">
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">Nama Perusahaan *</label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Contoh: PT Sumber Berkah Mandiri"
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">Posisi / Jabatan *</label>
              <input
                type="text"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Contoh: Staff Keuangan & Petty Cash"
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">Periode (Bulan/Tahun)</label>
              <input
                type="text"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                placeholder="Contoh: Feb 2025 - Sekarang"
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">Durasi Kerja</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Contoh: 1 Tahun 2 Bulan"
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">Kategori</label>
              <select
                value={category}
                onChange={(e: any) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
              >
                <option value="administrasi">Administrasi & Keuangan</option>
                <option value="retail">Retail & Pelayanan</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-slate-300">Deskripsi Singkat Peran</label>
              <AIPolishButton
                compact
                textToPolish={description}
                onPolished={setDescription}
                context={`Deskripsi umum peran posisi ${role} di ${company}`}
              />
            </div>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan ruang lingkup peran dan tanggung jawab Anda secara umum..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-3 text-xs text-white focus:outline-none resize-none"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-slate-300">Tanggung Jawab Utama (1 poin per baris)</label>
              <AIPolishButton
                compact
                textToPolish={responsibilitiesText}
                onPolished={setResponsibilitiesText}
                context={`Daftar tanggung jawab harian posisi ${role}`}
              />
            </div>
            <textarea
              rows={3}
              value={responsibilitiesText}
              onChange={(e) => setResponsibilitiesText(e.target.value)}
              placeholder="Contoh:
Mengelola arus kas masuk dan keluar harian
Merekonsiliasi nota pengeluaran operasional
Menyusun laporan bulanan dengan Excel"
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-3 text-xs text-white focus:outline-none resize-none font-mono text-[11px]"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-slate-300">Pencapaian Kunci / Hasil Nyata (1 poin per baris)</label>
              <AIPolishButton
                compact
                textToPolish={achievementsText}
                onPolished={setAchievementsText}
                context={`Hasil kerja nyata dan pencapaian ${role}`}
              />
            </div>
            <textarea
              rows={2}
              value={achievementsText}
              onChange={(e) => setAchievementsText(e.target.value)}
              placeholder="Contoh:
Mempertahankan penutupan kas tanpa selisih (zero discrepancy)
Mempercepat penataan berkas audit hingga 40%"
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-3 text-xs text-white focus:outline-none resize-none font-mono text-[11px]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-300">Keahlian yang Diterapkan (pisahkan dengan koma)</label>
            <input
              type="text"
              value={skillsText}
              onChange={(e) => setSkillsText(e.target.value)}
              placeholder="Contoh: Microsoft Excel, Petty Cash, Filing System, Rekonsiliasi"
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
            />
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-md"
            >
              {isLoading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Check size={14} />
                  <span>Simpan Pekerjaan</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
