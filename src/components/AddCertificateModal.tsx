import React, { useState } from "react";
import { X, Award, Upload, Link as LinkIcon, Loader2, Check, Eye, Cloud } from "lucide-react";
import { AIPolishButton } from "./AIPolishButton";

interface AddCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newCert: any) => void;
}

export const AddCertificateModal: React.FC<AddCertificateModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [name, setName] = useState("");
  const [issuer, setIssuer] = useState("");
  const [category, setCategory] = useState<"Akuntansi" | "Organisasi" | "Retail & Magang" | "Pelayanan">("Akuntansi");
  const [year, setYear] = useState("Terverifikasi");
  const [description, setDescription] = useState("");
  const [skillsText, setSkillsText] = useState("");
  
  // Image input options: File upload or URL (imgbb)
  const [inputType, setInputType] = useState<"upload" | "url">("upload");
  const [imageUrl, setImageUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploadSource, setUploadSource] = useState<string>("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  // Handle local file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 15MB)
    if (file.size > 15 * 1024 * 1024) {
      setError("Ukuran berkas maksimal 15 MB.");
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        setPreviewUrl(base64);

        // Upload to server (automatically uses ImgBB key if user connected it!)
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name,
            dataBase64: base64,
          }),
        });

        const data = await res.json();
        if (data.success && data.url) {
          setImageUrl(data.url);
          setUploadSource(data.source || "local");
        } else {
          setError("Gagal mengunggah berkas ke server.");
        }
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setError("Gagal memproses berkas.");
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalUrl = inputType === "upload" ? imageUrl : previewUrl;
    if (!name.trim() || !finalUrl.trim()) {
      setError("Nama sertifikat dan gambar/berkas wajib dilengkapi.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const skills = skillsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await fetch("/api/portfolio/certificate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          issuer: issuer || "Lembaga Sertifikasi",
          category,
          year: year || "Terverifikasi",
          url: finalUrl,
          description: description || "Sertifikat uji kompetensi profesional resmi.",
          skillsHighlighted: skills.length > 0 ? skills : ["Kompetensi Terverifikasi"],
        }),
      });

      const data = await res.json();
      if (data.success && data.certificate) {
        onSuccess(data.certificate);
        onClose();
      } else {
        setError(data.error || "Gagal menyimpan sertifikat.");
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
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Award size={16} />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-white">
                Tambah Sertifikat / Dokumen Kualifikasi
              </h3>
              <p className="text-xs text-slate-400">Dapat berupa upload file langsung atau tautan dari imgbb</p>
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

          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-300">Nama Sertifikat *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Sertifikat Perpajakan Brevet A/B / Sertifikat Pelatihan Keuangan"
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">Penerbit / Lembaga</label>
              <input
                type="text"
                value={issuer}
                onChange={(e) => setIssuer(e.target.value)}
                placeholder="Contoh: Ikatan Akuntan / BNSP"
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">Kategori</label>
              <select
                value={category}
                onChange={(e: any) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
              >
                <option value="Akuntansi">Akuntansi</option>
                <option value="Organisasi">Organisasi</option>
                <option value="Retail & Magang">Retail & Magang</option>
                <option value="Pelayanan">Pelayanan</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-slate-300">Tahun / Status</label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="Contoh: Terverifikasi / 2024"
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Image Source Selection */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-slate-300 font-semibold">
                Lampiran Gambar Sertifikat *
              </label>
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                <button
                  type="button"
                  onClick={() => setInputType("upload")}
                  className={`px-2.5 py-1 text-[11px] rounded font-medium transition-colors ${
                    inputType === "upload" ? "bg-cyan-500 text-slate-950" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Upload size={12} className="inline mr-1" />
                  Upload Berkas
                </button>
                <button
                  type="button"
                  onClick={() => setInputType("url")}
                  className={`px-2.5 py-1 text-[11px] rounded font-medium transition-colors ${
                    inputType === "url" ? "bg-cyan-500 text-slate-950" : "text-slate-400 hover:text-white"
                  }`}
                >
                  <LinkIcon size={12} className="inline mr-1" />
                  Link imgbb / URL
                </button>
              </div>
            </div>

            {inputType === "upload" ? (
              <div className="p-4 rounded-xl border border-dashed border-slate-700 bg-slate-950/60 text-center space-y-2">
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="cert-file-input"
                  disabled={isUploading}
                />
                <label
                  htmlFor="cert-file-input"
                  className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition-colors border border-slate-700"
                >
                  {isUploading ? (
                    <>
                      <Loader2 size={14} className="animate-spin text-cyan-400" />
                      <span>Mengunggah...</span>
                    </>
                  ) : (
                    <>
                      <Upload size={14} className="text-cyan-400" />
                      <span>Pilih Berkas Gambar Sertifikat</span>
                    </>
                  )}
                </label>
                <p className="text-[11px] text-slate-500">Mendukung file JPG, PNG, atau scan PDF (maksimal 15 MB)</p>
              </div>
            ) : (
              <div className="space-y-1">
                <input
                  type="url"
                  value={previewUrl}
                  onChange={(e) => {
                    setPreviewUrl(e.target.value);
                    setImageUrl(e.target.value);
                  }}
                  placeholder="Tempel tautan gambar, contoh: https://i.ibb.co.com/..."
                  className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                />
                <p className="text-[11px] text-slate-500 font-mono">Bisa menggunakan link gambar dari imgbb atau web hosting lainnya</p>
              </div>
            )}

            {/* Thumbnail Preview if available */}
            {previewUrl && (
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-3">
                <div className="w-16 h-12 rounded bg-slate-900 overflow-hidden border border-slate-800 shrink-0 flex items-center justify-center">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                </div>
                <div className="text-xs text-slate-300 flex-1 truncate">
                  <p className="font-semibold text-white">Pratinjau Berkas</p>
                  {uploadSource === "imgbb" ? (
                    <p className="text-[11px] text-cyan-400 font-mono flex items-center gap-1">
                      <Cloud size={11} />
                      <span>Terupload otomatis ke Akun ImgBB Pribadi</span>
                    </p>
                  ) : (
                    <p className="text-[11px] text-emerald-400 font-mono">Berkas siap disimpan</p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-1 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-slate-300">Deskripsi & Ruang Lingkup Sertifikat</label>
              <AIPolishButton
                compact
                textToPolish={description}
                onPolished={setDescription}
                context={`Deskripsi sertifikat keahlian ${name}`}
              />
            </div>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan kompetensi yang diuji, nilai yang diperoleh, atau materi keahlian..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl p-3 text-xs text-white focus:outline-none resize-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono text-slate-300">Kompetensi yang Disorot (pisahkan koma)</label>
            <input
              type="text"
              value={skillsText}
              onChange={(e) => setSkillsText(e.target.value)}
              placeholder="Contoh: Siklus Akuntansi, Rekonsiliasi, Buku Besar, Kepatuhan"
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
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
              disabled={isLoading || isUploading}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-md"
            >
              {isLoading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Check size={14} />
                  <span>Simpan Sertifikat</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
