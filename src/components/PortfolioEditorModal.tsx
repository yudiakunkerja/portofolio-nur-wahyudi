import React, { useState, useEffect } from "react";
import {
  X,
  User,
  ScrollText,
  Briefcase,
  Award,
  Layers,
  Cloud,
  Check,
  Loader2,
  Trash2,
  Plus,
  Upload,
  ExternalLink,
  Edit2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { AIPolishButton } from "./AIPolishButton";
import { Certificate, Experience } from "../data/portfolioData";

export type EditorTab = "profile" | "summary" | "experience" | "certificates" | "skills" | "imgbb";

interface PortfolioEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: EditorTab;
  profile: any;
  setProfile: React.Dispatch<React.SetStateAction<any>>;
  executiveSummary: any;
  setExecutiveSummary: React.Dispatch<React.SetStateAction<any>>;
  skillCategories: any[];
  setSkillCategories: React.Dispatch<React.SetStateAction<any[]>>;
  certificates: Certificate[];
  setCertificates: React.Dispatch<React.SetStateAction<Certificate[]>>;
  experiences: Experience[];
  setExperiences: React.Dispatch<React.SetStateAction<Experience[]>>;
}

export const PortfolioEditorModal: React.FC<PortfolioEditorModalProps> = ({
  isOpen,
  onClose,
  initialTab = "profile",
  profile,
  setProfile,
  executiveSummary,
  setExecutiveSummary,
  skillCategories,
  setSkillCategories,
  certificates,
  setCertificates,
  experiences,
  setExperiences,
}) => {
  const [activeTab, setActiveTab] = useState<EditorTab>(initialTab);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Update activeTab when initialTab changes on open
  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  // Form states for Profile
  const [profForm, setProfForm] = useState(profile || {});
  useEffect(() => {
    setProfForm(profile || {});
  }, [profile]);

  // Form states for Executive Summary
  const [sumForm, setSumForm] = useState(executiveSummary || {});
  useEffect(() => {
    setSumForm(executiveSummary || {});
  }, [executiveSummary]);

  // Form states for Skills
  const [skillsForm, setSkillsForm] = useState<any[]>(skillCategories || []);
  useEffect(() => {
    setSkillsForm(skillCategories || []);
  }, [skillCategories]);

  // Settings: ImgBB Key
  const [imgbbKey, setImgbbKey] = useState("");
  const [isTestingImgbb, setIsTestingImgbb] = useState(false);
  const [imgbbStatus, setImgbbStatus] = useState<"idle" | "connected" | "failed">("idle");
  const [imgbbStatusMsg, setImgbbStatusMsg] = useState("");

  // Experience edit state
  const [editingExpId, setEditingExpId] = useState<string | null>(null);
  const [expForm, setExpForm] = useState<any>({
    company: "",
    role: "",
    period: "",
    duration: "",
    location: "Tangerang, Banten",
    category: "administrasi",
    description: "",
    responsibilitiesText: "",
    achievementsText: "",
    skillsText: "",
  });

  // Certificate edit state
  const [editingCertId, setEditingCertId] = useState<string | null>(null);
  const [certForm, setCertForm] = useState<any>({
    name: "",
    issuer: "",
    category: "Akuntansi",
    year: "Terverifikasi",
    url: "",
    description: "",
    skillsText: "",
  });
  const [isCertUploading, setIsCertUploading] = useState(false);

  // Fetch settings on open
  useEffect(() => {
    if (isOpen) {
      fetch("/api/settings")
        .then((res) => res.json())
        .then((data) => {
          if (data.imgbbApiKey) {
            setImgbbKey(data.imgbbApiKey);
            setImgbbStatus("connected");
            setImgbbStatusMsg("Kunci API ImgBB aktif. Setiap upload otomatis tersimpan di akun ImgBB pribadi Anda.");
          }
        })
        .catch((err) => console.error("Error fetching settings:", err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const showNotification = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(""), 3500);
  };

  // 1. SAVE PROFILE
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage("");
    try {
      const res = await fetch("/api/portfolio/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profForm),
      });
      const data = await res.json();
      if (data.success && data.profile) {
        setProfile(data.profile);
        showNotification("Profil berhasil disimpan & diperbarui!");
      } else {
        setErrorMessage(data.error || "Gagal menyimpan profil.");
      }
    } catch (err: any) {
      setErrorMessage("Terjadi kesalahan jaringan.");
    } finally {
      setIsSaving(false);
    }
  };

  // 2. SAVE EXECUTIVE SUMMARY
  const handleSaveSummary = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage("");
    try {
      const res = await fetch("/api/portfolio/summary", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sumForm),
      });
      const data = await res.json();
      if (data.success && data.executiveSummary) {
        setExecutiveSummary(data.executiveSummary);
        showNotification("Executive Summary berhasil diperbarui!");
      } else {
        setErrorMessage(data.error || "Gagal menyimpan summary.");
      }
    } catch (err: any) {
      setErrorMessage("Terjadi kesalahan jaringan.");
    } finally {
      setIsSaving(false);
    }
  };

  // 3. SAVE SKILLS
  const handleSaveSkills = async () => {
    setIsSaving(true);
    setErrorMessage("");
    try {
      const res = await fetch("/api/portfolio/skills", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skillCategories: skillsForm }),
      });
      const data = await res.json();
      if (data.success && data.skillCategories) {
        setSkillCategories(data.skillCategories);
        showNotification("Katalog Keahlian & Kompetensi berhasil diperbarui!");
      } else {
        setErrorMessage(data.error || "Gagal menyimpan keahlian.");
      }
    } catch (err: any) {
      setErrorMessage("Terjadi kesalahan jaringan.");
    } finally {
      setIsSaving(false);
    }
  };

  // 4. SAVE IMGBB SETTINGS
  const handleSaveImgbbSettings = async () => {
    setIsTestingImgbb(true);
    setErrorMessage("");
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imgbbApiKey: imgbbKey.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        if (imgbbKey.trim()) {
          setImgbbStatus("connected");
          setImgbbStatusMsg("Berhasil! Kunci API ImgBB terpasang. Gambar yang diunggah akan otomatis masuk ke akun ImgBB pribadi Anda.");
        } else {
          setImgbbStatus("idle");
          setImgbbStatusMsg("Kunci API ImgBB dinonaktifkan. Gambar akan disimpan di penyimpanan server lokal.");
        }
        showNotification("Pengaturan ImgBB berhasil disimpan!");
      }
    } catch (err: any) {
      setImgbbStatus("failed");
      setImgbbStatusMsg("Gagal menyimpan pengaturan API Key ImgBB.");
    } finally {
      setIsTestingImgbb(false);
    }
  };

  // Handle Photo Profile Upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name,
            dataBase64: base64,
            imgbbKey: imgbbKey.trim() || undefined,
          }),
        });
        const data = await res.json();
        if (data.success && data.url) {
          setProfForm((prev: any) => ({ ...prev, photoUrl: data.url }));
          showNotification(data.source === "imgbb" ? "Foto terupload ke Akun ImgBB!" : "Foto tersimpan!");
        }
      } catch (err) {
        console.error(err);
      }
    };
    reader.readAsDataURL(file);
  };

  // EXPERIENCE MANAGEMENT
  const startEditExp = (exp: Experience) => {
    setEditingExpId(exp.id);
    setExpForm({
      company: exp.company,
      role: exp.role,
      period: exp.period,
      duration: exp.duration,
      location: exp.location,
      category: exp.category,
      description: exp.description,
      responsibilitiesText: (exp.responsibilities || []).join("\n"),
      achievementsText: (exp.achievements || []).join("\n"),
      skillsText: (exp.skills || []).join(", "),
    });
  };

  const cancelEditExp = () => {
    setEditingExpId(null);
    setExpForm({
      company: "",
      role: "",
      period: "",
      duration: "",
      location: "Tangerang, Banten",
      category: "administrasi",
      description: "",
      responsibilitiesText: "",
      achievementsText: "",
      skillsText: "",
    });
  };

  const handleSaveExp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expForm.company.trim() || !expForm.role.trim()) {
      setErrorMessage("Nama perusahaan dan posisi wajib diisi.");
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    const payload = {
      company: expForm.company,
      role: expForm.role,
      period: expForm.period,
      duration: expForm.duration,
      location: expForm.location,
      category: expForm.category,
      description: expForm.description,
      responsibilities: expForm.responsibilitiesText.split("\n").map((r: string) => r.trim()).filter(Boolean),
      achievements: expForm.achievementsText.split("\n").map((a: string) => a.trim()).filter(Boolean),
      skills: expForm.skillsText.split(",").map((s: string) => s.trim()).filter(Boolean),
    };

    try {
      if (editingExpId && editingExpId !== "new") {
        // Update existing
        const res = await fetch(`/api/portfolio/experience/${editingExpId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success && data.experience) {
          setExperiences((prev) => prev.map((item) => (item.id === editingExpId ? data.experience : item)));
          showNotification("Pengalaman kerja berhasil diperbarui!");
          cancelEditExp();
        }
      } else {
        // Add new
        const res = await fetch("/api/portfolio/experience", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success && data.experience) {
          setExperiences((prev) => [data.experience, ...prev]);
          showNotification("Pengalaman kerja baru berhasil ditambahkan!");
          cancelEditExp();
        }
      }
    } catch (err: any) {
      setErrorMessage("Gagal menyimpan pengalaman kerja.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteExp = async (id: string) => {
    if (!window.confirm("Hapus pengalaman kerja ini?")) return;
    try {
      const res = await fetch(`/api/portfolio/experience/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setExperiences((prev) => prev.filter((item) => item.id !== id));
        showNotification("Pengalaman kerja berhasil dihapus.");
        if (editingExpId === id) cancelEditExp();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // CERTIFICATE MANAGEMENT
  const startEditCert = (cert: Certificate) => {
    setEditingCertId(cert.id);
    setCertForm({
      name: cert.name,
      issuer: cert.issuer,
      category: cert.category,
      year: cert.year,
      url: cert.url,
      description: cert.description,
      skillsText: (cert.skillsHighlighted || []).join(", "),
    });
  };

  const cancelEditCert = () => {
    setEditingCertId(null);
    setCertForm({
      name: "",
      issuer: "",
      category: "Akuntansi",
      year: "Terverifikasi",
      url: "",
      description: "",
      skillsText: "",
    });
  };

  const handleCertFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCertUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name,
            dataBase64: base64,
            imgbbKey: imgbbKey.trim() || undefined,
          }),
        });
        const data = await res.json();
        if (data.success && data.url) {
          setCertForm((prev: any) => ({ ...prev, url: data.url }));
          showNotification(data.source === "imgbb" ? "Sertifikat terupload otomatis ke Akun ImgBB!" : "Sertifikat tersimpan!");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsCertUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveCert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certForm.name.trim() || !certForm.url.trim()) {
      setErrorMessage("Nama sertifikat dan gambar berkas wajib diisi.");
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    const payload = {
      name: certForm.name,
      issuer: certForm.issuer,
      category: certForm.category,
      year: certForm.year,
      url: certForm.url,
      description: certForm.description,
      skillsHighlighted: certForm.skillsText.split(",").map((s: string) => s.trim()).filter(Boolean),
    };

    try {
      if (editingCertId && editingCertId !== "new") {
        // Update existing
        const res = await fetch(`/api/portfolio/certificate/${editingCertId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success && data.certificate) {
          setCertificates((prev) => prev.map((item) => (item.id === editingCertId ? data.certificate : item)));
          showNotification("Sertifikat berhasil diperbarui!");
          cancelEditCert();
        }
      } else {
        // Add new
        const res = await fetch("/api/portfolio/certificate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success && data.certificate) {
          setCertificates((prev) => [...prev, data.certificate]);
          showNotification("Sertifikat baru berhasil ditambahkan!");
          cancelEditCert();
        }
      }
    } catch (err: any) {
      setErrorMessage("Gagal menyimpan sertifikat.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCert = async (id: string) => {
    if (!window.confirm("Hapus sertifikat ini?")) return;
    try {
      const res = await fetch(`/api/portfolio/certificate/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setCertificates((prev) => prev.filter((item) => item.id !== id));
        showNotification("Sertifikat berhasil dihapus.");
        if (editingCertId === id) cancelEditCert();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] z-10">
        
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/95 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
              <Edit2 size={16} />
            </div>
            <div>
              <h2 className="font-display text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Pusat Kelola & Edit Portofolio</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Panel Admin
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Pilih menu untuk mengubah setiap bagian portofolio & gunakan AI untuk mempercantik tulisan
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Success / Error Banners */}
        {saveSuccessMsg && (
          <div className="bg-emerald-500/15 border-b border-emerald-500/30 px-6 py-2.5 text-xs text-emerald-300 flex items-center gap-2 animate-fadeIn font-medium">
            <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}
        {errorMessage && (
          <div className="bg-red-500/15 border-b border-red-500/30 px-6 py-2.5 text-xs text-red-300 flex items-center gap-2 animate-fadeIn font-medium">
            <AlertCircle size={15} className="text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="px-6 pt-3 bg-slate-950/60 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-colors border-b-2 whitespace-nowrap ${
              activeTab === "profile"
                ? "bg-slate-900 text-emerald-400 border-emerald-400"
                : "text-slate-400 hover:text-white border-transparent"
            }`}
          >
            <User size={14} />
            <span>Profil & Hero</span>
          </button>

          <button
            onClick={() => setActiveTab("summary")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-colors border-b-2 whitespace-nowrap ${
              activeTab === "summary"
                ? "bg-slate-900 text-emerald-400 border-emerald-400"
                : "text-slate-400 hover:text-white border-transparent"
            }`}
          >
            <ScrollText size={14} />
            <span>Executive Summary</span>
          </button>

          <button
            onClick={() => setActiveTab("experience")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-colors border-b-2 whitespace-nowrap ${
              activeTab === "experience"
                ? "bg-slate-900 text-emerald-400 border-emerald-400"
                : "text-slate-400 hover:text-white border-transparent"
            }`}
          >
            <Briefcase size={14} />
            <span>Pengalaman Kerja ({experiences.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("certificates")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-colors border-b-2 whitespace-nowrap ${
              activeTab === "certificates"
                ? "bg-slate-900 text-cyan-400 border-cyan-400"
                : "text-slate-400 hover:text-white border-transparent"
            }`}
          >
            <Award size={14} />
            <span>Sertifikat ({certificates.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("skills")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-colors border-b-2 whitespace-nowrap ${
              activeTab === "skills"
                ? "bg-slate-900 text-emerald-400 border-emerald-400"
                : "text-slate-400 hover:text-white border-transparent"
            }`}
          >
            <Layers size={14} />
            <span>Keahlian & Kompetensi</span>
          </button>

          <button
            onClick={() => setActiveTab("imgbb")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-colors border-b-2 whitespace-nowrap ${
              activeTab === "imgbb"
                ? "bg-slate-900 text-cyan-400 border-cyan-400"
                : "text-slate-400 hover:text-white border-transparent"
            }`}
          >
            <Cloud size={14} />
            <span>Auto-Upload ImgBB</span>
            {imgbbKey && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* ===================== TAB 1: PROFILE ===================== */}
          {activeTab === "profile" && (
            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-white">Edit Informasi Profil & Hero</h3>
                  <p className="text-xs text-slate-400">Ubah nama, gelar jabatan, status ketersediaan, kontak, dan ringkasan bio.</p>
                </div>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md"
                >
                  {isSaving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                  <span>Simpan Perubahan Profil</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300">Nama Lengkap</label>
                  <input
                    type="text"
                    value={profForm.name || ""}
                    onChange={(e) => setProfForm({ ...profForm, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300">Gelar / Sub-judul Profesional</label>
                  <input
                    type="text"
                    value={profForm.title || ""}
                    onChange={(e) => setProfForm({ ...profForm, title: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Bio Summary with AI Polish */}
              <div className="space-y-2 p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="text-xs font-mono text-slate-300 font-semibold">
                    Ringkasan Narasi Profil (Bio Hero)
                  </label>
                  <AIPolishButton
                    textToPolish={profForm.summary || ""}
                    onPolished={(polished) => setProfForm({ ...profForm, summary: polished })}
                    context="Bio Hero Profil Portofolio Profesional"
                    targetRole={profForm.title}
                  />
                </div>
                <textarea
                  rows={4}
                  value={profForm.summary || ""}
                  onChange={(e) => setProfForm({ ...profForm, summary: e.target.value })}
                  placeholder="Tulis ringkasan profil Anda..."
                  className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl p-3 text-xs text-white focus:outline-none leading-relaxed"
                />
                <p className="text-[11px] text-slate-500">
                  Tip: Anda bisa menulis draf santai Anda terlebih dahulu, lalu klik tombol <strong>"✨ Rapihkan dengan AI"</strong> untuk mengubahnya menjadi kalimat resmi dan memikat bagi HRD.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300">Domisili</label>
                  <input
                    type="text"
                    value={profForm.location || ""}
                    onChange={(e) => setProfForm({ ...profForm, location: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300">No. WhatsApp</label>
                  <input
                    type="text"
                    value={profForm.whatsappNumber || ""}
                    onChange={(e) => setProfForm({ ...profForm, whatsappNumber: e.target.value })}
                    placeholder="Contoh: 62881024040191"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300">Email Resmi</label>
                  <input
                    type="email"
                    value={profForm.email || ""}
                    onChange={(e) => setProfForm({ ...profForm, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300">Status Ketersediaan</label>
                  <input
                    type="text"
                    value={profForm.status || ""}
                    onChange={(e) => setProfForm({ ...profForm, status: e.target.value })}
                    placeholder="Contoh: Tersedia untuk Peluang Kerja (Ready to Hire)"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300">Latar Belakang Pendidikan Utama</label>
                  <input
                    type="text"
                    value={profForm.education || ""}
                    onChange={(e) => setProfForm({ ...profForm, education: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Photo Upload & Preview */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <label className="text-xs font-mono text-slate-300 font-semibold block">
                  Foto Profil Utama
                </label>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-900 border border-slate-700 shrink-0">
                    <img src={profForm.photoUrl} alt="Foto" className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-1.5 flex-1 min-w-[200px]">
                    <input
                      type="text"
                      value={profForm.photoUrl || ""}
                      onChange={(e) => setProfForm({ ...profForm, photoUrl: e.target.value })}
                      placeholder="URL Foto atau upload file di bawah"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
                    />
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium border border-slate-700">
                        <Upload size={13} className="text-emerald-400" />
                        <span>Ganti Foto dari Komputer / HP</span>
                        <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                      </label>
                      {imgbbKey && (
                        <span className="text-[11px] text-cyan-400 font-mono flex items-center gap-1">
                          <Cloud size={11} />
                          Auto-upload ke Akun ImgBB aktif
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}

          {/* ===================== TAB 2: EXECUTIVE SUMMARY ===================== */}
          {activeTab === "summary" && (
            <form onSubmit={handleSaveSummary} className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-white">Edit Executive Summary & Filosofi Kerja</h3>
                  <p className="text-xs text-slate-400">Atur kutipan komitmen profesional dan pilar nilai keunggulan Anda.</p>
                </div>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md"
                >
                  {isSaving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                  <span>Simpan Perubahan Summary</span>
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-slate-300">Judul Utama</label>
                <input
                  type="text"
                  value={sumForm.title || ""}
                  onChange={(e) => setSumForm({ ...sumForm, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              {/* Quote with AI Polish */}
              <div className="space-y-2 p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="text-xs font-mono text-slate-300 font-semibold">
                    Kutipan Komitmen Profesional
                  </label>
                  <AIPolishButton
                    textToPolish={sumForm.quote || ""}
                    onPolished={(polished) => setSumForm({ ...sumForm, quote: polished })}
                    context="Kutipan Filosofi Kerja dan Komitmen Integritas Profesional"
                  />
                </div>
                <textarea
                  rows={3}
                  value={sumForm.quote || ""}
                  onChange={(e) => setSumForm({ ...sumForm, quote: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl p-3 text-xs text-white focus:outline-none italic"
                />
              </div>

              {/* Details Paragraph with AI Polish */}
              <div className="space-y-2 p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="text-xs font-mono text-slate-300 font-semibold">
                    Narasi Nilai Tambah & Kesiapan Kerja
                  </label>
                  <AIPolishButton
                    textToPolish={sumForm.details || ""}
                    onPolished={(polished) => setSumForm({ ...sumForm, details: polished })}
                    context="Pernyataan Nilai Tambah dan Kesiapan Adaptasi di Perusahaan"
                  />
                </div>
                <textarea
                  rows={3}
                  value={sumForm.details || ""}
                  onChange={(e) => setSumForm({ ...sumForm, details: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl p-3 text-xs text-white focus:outline-none"
                />
              </div>

              {/* Pillars of Excellence (Dynamic) */}
              <div className="space-y-3 pt-2">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-2.5">
                  <div>
                    <label className="text-xs font-mono text-slate-300 font-semibold block">
                      Pilar Keunggulan ({sumForm.principles?.length || 0})
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Tambah, ubah nama, rapikan deskripsi dengan AI, atau hapus pilar nilai keunggulan Anda.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const currentP = [...(sumForm.principles || [])];
                      currentP.push({
                        title: `Pilar Keunggulan #${currentP.length + 1}`,
                        desc: "Deskripsi komitmen atau keunggulan profesional Anda."
                      });
                      setSumForm({ ...sumForm, principles: currentP });
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-semibold transition-colors"
                  >
                    <Plus size={13} />
                    <span>+ Tambah Pilar Keunggulan</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(sumForm.principles || []).map((p: any, idx: number) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 relative group">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono text-emerald-400 font-medium">Pilar #{idx + 1}</span>
                        <div className="flex items-center gap-1.5">
                          <AIPolishButton
                            compact
                            textToPolish={p.desc}
                            onPolished={(polished) => {
                              const newP = [...sumForm.principles];
                              newP[idx].desc = polished;
                              setSumForm({ ...sumForm, principles: newP });
                            }}
                            context={`Pilar keunggulan: ${p.title}`}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newP = sumForm.principles.filter((_: any, i: number) => i !== idx);
                              setSumForm({ ...sumForm, principles: newP });
                            }}
                            className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Hapus Pilar Ini"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                      <input
                        type="text"
                        value={p.title}
                        placeholder="Judul Pilar (misal: Presisi & Nol Selisih)"
                        onChange={(e) => {
                          const newP = [...sumForm.principles];
                          newP[idx].title = e.target.value;
                          setSumForm({ ...sumForm, principles: newP });
                        }}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-lg px-2.5 py-1.5 text-xs font-bold text-white focus:outline-none"
                      />
                      <textarea
                        rows={2}
                        value={p.desc}
                        placeholder="Deskripsi pilar keunggulan..."
                        onChange={(e) => {
                          const newP = [...sumForm.principles];
                          newP[idx].desc = e.target.value;
                          setSumForm({ ...sumForm, principles: newP });
                        }}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-lg p-2 text-xs text-slate-300 resize-none focus:outline-none"
                      />
                    </div>
                  ))}
                </div>

                {(sumForm.principles || []).length === 0 && (
                  <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl space-y-2">
                    <p>Belum ada pilar keunggulan.</p>
                    <button
                      type="button"
                      onClick={() => {
                        setSumForm({
                          ...sumForm,
                          principles: [
                            { title: "Pilar Keunggulan #1", desc: "Deskripsi keunggulan profesional Anda." }
                          ]
                        });
                      }}
                      className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg font-mono text-xs inline-flex items-center gap-1.5"
                    >
                      <Plus size={12} />
                      Tambah Pilar Pertama
                    </button>
                  </div>
                )}
              </div>
            </form>
          )}

          {/* ===================== TAB 3: WORK EXPERIENCE ===================== */}
          {activeTab === "experience" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-white">Kelola Riwayat Pengalaman Kerja</h3>
                  <p className="text-xs text-slate-400">Tambah riwayat baru, edit peran/deskripsi, atau rapikan poin tanggung jawab dengan AI.</p>
                </div>
                {!editingExpId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingExpId("new");
                      setExpForm({
                        company: "",
                        role: "",
                        period: "2025 - Sekarang",
                        duration: "1 Tahun",
                        location: "Tangerang, Banten",
                        category: "administrasi",
                        description: "",
                        responsibilitiesText: "",
                        achievementsText: "",
                        skillsText: "",
                      });
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md"
                  >
                    <Plus size={14} />
                    <span>+ Tambah Pekerjaan Baru</span>
                  </button>
                )}
              </div>

              {/* Editing / Adding Form */}
              {editingExpId && (
                <form onSubmit={handleSaveExp} className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/30 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs font-bold text-emerald-400">
                      {editingExpId === "new" ? "Tambah Pekerjaan Baru" : `Edit Pengalaman: ${expForm.company}`}
                    </span>
                    <button type="button" onClick={cancelEditExp} className="text-xs text-slate-400 hover:text-white">
                      Batal
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-slate-300">Nama Perusahaan *</label>
                      <input
                        type="text"
                        required
                        value={expForm.company}
                        onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-slate-300">Posisi / Jabatan *</label>
                      <input
                        type="text"
                        required
                        value={expForm.role}
                        onChange={(e) => setExpForm({ ...expForm, role: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-slate-300">Periode</label>
                      <input
                        type="text"
                        value={expForm.period}
                        onChange={(e) => setExpForm({ ...expForm, period: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-slate-300">Durasi</label>
                      <input
                        type="text"
                        value={expForm.duration}
                        onChange={(e) => setExpForm({ ...expForm, duration: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-slate-300">Kategori</label>
                      <select
                        value={expForm.category}
                        onChange={(e: any) => setExpForm({ ...expForm, category: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                      >
                        <option value="administrasi">Administrasi & Keuangan</option>
                        <option value="retail">Retail & Pelayanan</option>
                      </select>
                    </div>
                  </div>

                  {/* Description with AI Polish */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono text-slate-300">Deskripsi Ringkas Peran</label>
                      <AIPolishButton
                        compact
                        textToPolish={expForm.description}
                        onPolished={(polished) => setExpForm({ ...expForm, description: polished })}
                        context={`Deskripsi umum peran posisi ${expForm.role} di ${expForm.company}`}
                      />
                    </div>
                    <textarea
                      rows={2}
                      value={expForm.description}
                      onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                    />
                  </div>

                  {/* Responsibilities with AI Polish */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono text-slate-300">Tanggung Jawab Utama (1 per baris)</label>
                      <AIPolishButton
                        compact
                        textToPolish={expForm.responsibilitiesText}
                        onPolished={(polished) => setExpForm({ ...expForm, responsibilitiesText: polished })}
                        context={`Daftar tanggung jawab harian posisi ${expForm.role}`}
                      />
                    </div>
                    <textarea
                      rows={3}
                      value={expForm.responsibilitiesText}
                      onChange={(e) => setExpForm({ ...expForm, responsibilitiesText: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white font-mono text-[11px]"
                    />
                  </div>

                  {/* Achievements with AI Polish */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono text-slate-300">Pencapaian & Hasil Nyata (1 per baris)</label>
                      <AIPolishButton
                        compact
                        textToPolish={expForm.achievementsText}
                        onPolished={(polished) => setExpForm({ ...expForm, achievementsText: polished })}
                        context={`Hasil kerja nyata dan pencapaian ${expForm.role}`}
                      />
                    </div>
                    <textarea
                      rows={2}
                      value={expForm.achievementsText}
                      onChange={(e) => setExpForm({ ...expForm, achievementsText: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white font-mono text-[11px]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-300">Keahlian (pisahkan koma)</label>
                    <input
                      type="text"
                      value={expForm.skillsText}
                      onChange={(e) => setExpForm({ ...expForm, skillsText: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                    <button type="button" onClick={cancelEditExp} className="px-3 py-1.5 text-xs text-slate-400 hover:text-white">
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5"
                    >
                      {isSaving && <Loader2 size={12} className="animate-spin" />}
                      <span>{editingExpId === "new" ? "Simpan Pekerjaan Baru" : "Perbarui Data Pekerjaan"}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* List of Experiences */}
              <div className="space-y-3">
                {experiences.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{exp.company}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {exp.period} ({exp.duration})
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-emerald-400">{exp.role}</p>
                      <p className="text-xs text-slate-400 line-clamp-1">{exp.description}</p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        onClick={() => startEditExp(exp)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
                      >
                        <Edit2 size={12} className="text-emerald-400" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteExp(exp.id)}
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors"
                        title="Hapus"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================== TAB 4: CERTIFICATES ===================== */}
          {activeTab === "certificates" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-white">Kelola Sertifikat & Dokumen Kualifikasi</h3>
                  <p className="text-xs text-slate-400">Tambah sertifikat baru, upload berkas (auto-upload ke ImgBB), atau perbarui deskripsi.</p>
                </div>
                {!editingCertId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCertId("new");
                      setCertForm({
                        name: "",
                        issuer: "",
                        category: "Akuntansi",
                        year: "Terverifikasi",
                        url: "",
                        description: "",
                        skillsText: "",
                      });
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md"
                  >
                    <Plus size={14} />
                    <span>+ Tambah Sertifikat Baru</span>
                  </button>
                )}
              </div>

              {/* Editing / Adding Certificate Form */}
              {editingCertId && (
                <form onSubmit={handleSaveCert} className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs font-bold text-cyan-400">
                      {editingCertId === "new" ? "Tambah Sertifikat Baru" : `Edit: ${certForm.name}`}
                    </span>
                    <button type="button" onClick={cancelEditCert} className="text-xs text-slate-400 hover:text-white">
                      Batal
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-slate-300">Nama Sertifikat *</label>
                      <input
                        type="text"
                        required
                        value={certForm.name}
                        onChange={(e) => setCertForm({ ...certForm, name: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-slate-300">Lembaga Penerbit</label>
                      <input
                        type="text"
                        value={certForm.issuer}
                        onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-slate-300">Kategori</label>
                      <select
                        value={certForm.category}
                        onChange={(e: any) => setCertForm({ ...certForm, category: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
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
                        value={certForm.year}
                        onChange={(e) => setCertForm({ ...certForm, year: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  {/* Certificate Image Upload & ImgBB auto upload */}
                  <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 space-y-2">
                    <label className="text-xs font-mono text-slate-300 font-semibold block">
                      Berkas Gambar Sertifikat *
                    </label>
                    <div className="flex flex-wrap items-center gap-3">
                      {certForm.url ? (
                        <div className="w-16 h-12 bg-slate-950 rounded border border-slate-700 overflow-hidden shrink-0">
                          <img src={certForm.url} alt="Sertifikat" className="w-full h-full object-contain" />
                        </div>
                      ) : null}
                      <input
                        type="text"
                        value={certForm.url}
                        onChange={(e) => setCertForm({ ...certForm, url: e.target.value })}
                        placeholder="Tautan gambar atau upload berkas"
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                      />
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium border border-slate-700 shrink-0">
                        {isCertUploading ? (
                          <>
                            <Loader2 size={12} className="animate-spin text-cyan-400" />
                            <span>Mengunggah...</span>
                          </>
                        ) : (
                          <>
                            <Upload size={12} className="text-cyan-400" />
                            <span>Pilih Berkas</span>
                          </>
                        )}
                        <input type="file" accept="image/*,application/pdf" onChange={handleCertFileUpload} className="hidden" />
                      </label>
                    </div>
                    {imgbbKey && (
                      <p className="text-[11px] text-cyan-400 font-mono">
                        ✓ Terintegrasi ImgBB: Gambar akan otomatis terunggah ke akun ImgBB pribadi Anda
                      </p>
                    )}
                  </div>

                  {/* Description with AI Polish */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono text-slate-300">Deskripsi & Ruang Lingkup</label>
                      <AIPolishButton
                        compact
                        textToPolish={certForm.description}
                        onPolished={(polished) => setCertForm({ ...certForm, description: polished })}
                        context={`Deskripsi sertifikat keahlian ${certForm.name}`}
                      />
                    </div>
                    <textarea
                      rows={2}
                      value={certForm.description}
                      onChange={(e) => setCertForm({ ...certForm, description: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-300">Kompetensi yang Disorot (pisahkan koma)</label>
                    <input
                      type="text"
                      value={certForm.skillsText}
                      onChange={(e) => setCertForm({ ...certForm, skillsText: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                    <button type="button" onClick={cancelEditCert} className="px-3 py-1.5 text-xs text-slate-400 hover:text-white">
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving || isCertUploading}
                      className="px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5"
                    >
                      {isSaving && <Loader2 size={12} className="animate-spin" />}
                      <span>{editingCertId === "new" ? "Simpan Sertifikat Baru" : "Perbarui Sertifikat"}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* List of Certificates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {certificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 flex gap-3 items-start justify-between transition-colors"
                  >
                    <div className="w-14 h-14 bg-slate-900 rounded-lg overflow-hidden border border-slate-800 shrink-0 flex items-center justify-center">
                      <img src={cert.url} alt={cert.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-1 flex-1 min-w-0">
                      <h4 className="font-bold text-white text-xs truncate">{cert.name}</h4>
                      <p className="text-[11px] text-cyan-400 font-mono">{cert.issuer} · {cert.year}</p>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{cert.description}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => startEditCert(cert)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                        title="Edit Sertifikat"
                      >
                        <Edit2 size={13} className="text-cyan-400" />
                      </button>
                      <button
                        onClick={() => handleDeleteCert(cert.id)}
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                        title="Hapus Sertifikat"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================== TAB 5: SKILLS ===================== */}
          {activeTab === "skills" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Kelola Katalog Keahlian & Kompetensi</span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {skillsForm.length} Bidang
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Tambah atau hapus bidang/kelompok keahlian, ubah nama kategori, serta atur nama skill dan tingkat kemahiran.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [
                        ...skillsForm,
                        {
                          category: `Bidang Keahlian Baru #${skillsForm.length + 1}`,
                          items: [
                            { name: "Keahlian Utama", level: "Mahir" }
                          ]
                        }
                      ];
                      setSkillsForm(updated);
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 font-semibold rounded-xl text-xs border border-slate-700 transition-all shadow-sm"
                  >
                    <Plus size={13} />
                    <span>+ Tambah Bidang Baru</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveSkills}
                    disabled={isSaving}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md"
                  >
                    {isSaving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                    <span>Simpan Perubahan Keahlian</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {skillsForm.map((cat, catIdx) => (
                  <div key={catIdx} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 relative group">
                    <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="text-[11px] font-mono text-emerald-400 font-bold shrink-0">
                          #{catIdx + 1}
                        </span>
                        <input
                          type="text"
                          value={cat.category}
                          placeholder="Nama Bidang Keahlian (Contoh: Administrasi & Akuntansi)"
                          onChange={(e) => {
                            const updated = [...skillsForm];
                            updated[catIdx].category = e.target.value;
                            setSkillsForm(updated);
                          }}
                          className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-lg px-2.5 py-1 font-bold text-white text-xs focus:outline-none"
                        />
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...skillsForm];
                            updated[catIdx].items.push({ name: "Keahlian Baru", level: "Mahir" });
                            setSkillsForm(updated);
                          }}
                          className="text-[11px] font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors"
                          title="Tambah Skill ke Bidang ini"
                        >
                          <Plus size={11} />
                          <span>Skill</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = skillsForm.filter((_, i) => i !== catIdx);
                            setSkillsForm(updated);
                          }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Hapus Seluruh Bidang Ini"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {(cat.items || []).map((item: any, itemIdx: number) => (
                        <div key={itemIdx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={item.name}
                            placeholder="Nama keahlian / kompetensi..."
                            onChange={(e) => {
                              const updated = [...skillsForm];
                              updated[catIdx].items[itemIdx].name = e.target.value;
                              setSkillsForm(updated);
                            }}
                            className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                          />
                          <select
                            value={item.level}
                            onChange={(e) => {
                              const updated = [...skillsForm];
                              updated[catIdx].items[itemIdx].level = e.target.value;
                              setSkillsForm(updated);
                            }}
                            className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-[11px] text-emerald-400 font-mono focus:outline-none focus:border-emerald-500 shrink-0"
                          >
                            <option value="Mahir">Mahir</option>
                            <option value="Kompeten">Kompeten</option>
                            <option value="Karakter Utama">Karakter Utama</option>
                            <option value="Menengah">Menengah</option>
                            <option value="Dasar">Dasar</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...skillsForm];
                              updated[catIdx].items.splice(itemIdx, 1);
                              setSkillsForm(updated);
                            }}
                            className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                            title="Hapus Skill Ini"
                          >
                            <X size={13} />
                          </button>
                        </div>
                      ))}
                      {(cat.items || []).length === 0 && (
                        <p className="text-[11px] text-slate-500 italic py-2 text-center bg-slate-900/40 rounded-lg border border-dashed border-slate-800">
                          Belum ada keahlian di bidang ini. Klik "+ Skill" di kanan atas bidang untuk menambah.
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {skillsForm.length === 0 && (
                <div className="p-10 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-2xl space-y-3">
                  <p className="text-slate-400">Belum ada bidang keahlian di katalog Anda.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setSkillsForm([
                        {
                          category: "Administrasi & Akuntansi",
                          items: [
                            { name: "Pengelolaan Petty Cash & Arus Kas", level: "Mahir" },
                            { name: "Penyusunan Jurnal & Buku Besar", level: "Kompeten" }
                          ]
                        }
                      ]);
                    }}
                    className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-semibold rounded-xl text-xs inline-flex items-center gap-1.5 transition-colors border border-emerald-500/30"
                  >
                    <Plus size={13} />
                    <span>Tambah Bidang Keahlian Pertama</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ===================== TAB 6: IMGBB INTEGRATION ===================== */}
          {activeTab === "imgbb" && (
            <div className="space-y-6 max-w-3xl">
              <div className="space-y-1 pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Cloud size={16} className="text-cyan-400" />
                  <span>Integrasi Otomatis Akun ImgBB Pribadi</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Hubungkan akun ImgBB pribadi Anda agar semua gambar sertifikat & berkas yang Anda upload langsung otomatis tersimpan di akun ImgBB Anda tanpa perlu salin tautan manual!
                </p>
              </div>

              {/* Status Alert Box */}
              <div
                className={`p-4 rounded-2xl border flex items-start gap-3 ${
                  imgbbStatus === "connected"
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                    : "bg-slate-950 border-slate-800 text-slate-300"
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center shrink-0">
                  {imgbbStatus === "connected" ? (
                    <CheckCircle2 size={18} className="text-emerald-400" />
                  ) : (
                    <Cloud size={18} className="text-cyan-400" />
                  )}
                </div>
                <div className="space-y-1 flex-1">
                  <p className="text-xs font-bold text-white">
                    {imgbbStatus === "connected"
                      ? "Akun ImgBB Pribadi Terhubung!"
                      : "Belum Terhubung ke ImgBB Pribadi"}
                  </p>
                  <p className="text-xs leading-relaxed text-slate-300">
                    {imgbbStatusMsg ||
                      "Saat ini gambar disimpan di server lokal aplikasi. Anda dapat mengaktifkan penyimpanan langsung ke akun ImgBB pribadi Anda di bawah ini."}
                  </p>
                </div>
              </div>

              {/* Step by step instructions with direct Google Login guidance */}
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Panduan Menghubungkan Akun ImgBB (Hanya 1 Menit):
                </h4>

                <div className="space-y-3 text-xs text-slate-300">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-cyan-400 font-bold flex items-center justify-center shrink-0 text-xs">
                      1
                    </span>
                    <div className="space-y-1 flex-1">
                      <p className="font-semibold text-white">Masuk ke situs ImgBB dengan Akun Google Anda</p>
                      <p className="text-slate-400">
                        Klik tombol di bawah untuk membuka halaman API ImgBB di tab baru. Jika belum login, klik tombol <strong>"Masuk"</strong> lalu pilih <strong>"Lanjutkan dengan Google"</strong>.
                      </p>
                      <a
                        href="https://api.imgbb.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 mt-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-lg text-xs font-semibold transition-colors"
                      >
                        <span>Buka api.imgbb.com (Login Akun Google)</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-cyan-400 font-bold flex items-center justify-center shrink-0 text-xs">
                      2
                    </span>
                    <div className="space-y-1 flex-1">
                      <p className="font-semibold text-white">Salin Kunci API (API Key) Anda</p>
                      <p className="text-slate-400">
                        Setelah login di halaman <code>api.imgbb.com</code>, klik tombol biru <strong>"Ambil kunci API"</strong> (Get API Key). Salin rangkaian kode 32 karakter tersebut.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-cyan-400 font-bold flex items-center justify-center shrink-0 text-xs">
                      3
                    </span>
                    <div className="space-y-1 flex-1">
                      <p className="font-semibold text-white">Tempelkan Kunci API di Bawah Ini & Simpan</p>
                      <p className="text-slate-400">
                        Setelah disimpan, setiap kali Anda mengupload foto sertifikat atau profil di aplikasi ini, sistem secara otomatis mengunggah dan menyimpannya langsung di akun ImgBB pribadi Anda!
                      </p>
                    </div>
                  </div>
                </div>

                {/* API Key Input Form */}
                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <label className="text-xs font-mono text-slate-300 font-semibold block">
                    Kunci API ImgBB Pribadi (ImgBB API Key)
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="password"
                      value={imgbbKey}
                      onChange={(e) => setImgbbKey(e.target.value)}
                      placeholder="Contoh: 4a2b9f87c123456789abcdef01234567"
                      className="flex-1 bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleSaveImgbbSettings}
                      disabled={isTestingImgbb}
                      className="px-5 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md shrink-0"
                    >
                      {isTestingImgbb ? (
                        <>
                          <Loader2 size={13} className="animate-spin" />
                          <span>Menyimpan...</span>
                        </>
                      ) : (
                        <>
                          <Check size={13} />
                          <span>Simpan & Aktifkan Auto-Upload</span>
                        </>
                      )}
                    </button>
                  </div>
                  {imgbbKey && (
                    <button
                      type="button"
                      onClick={() => {
                        setImgbbKey("");
                        fetch("/api/settings", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ imgbbApiKey: "" }),
                        }).then(() => {
                          setImgbbStatus("idle");
                          setImgbbStatusMsg("Kunci API ImgBB dihapus.");
                        });
                      }}
                      className="text-[11px] text-red-400 hover:underline pt-1 block"
                    >
                      Hapus / Putuskan Kunci API ImgBB
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 flex items-center justify-between bg-slate-950/80">
          <p className="text-[11px] text-slate-500">
            Perubahan disimpan langsung ke database aplikasi portofolio resmi Nur Wahyudi.
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl transition-colors"
          >
            Tutup Panel
          </button>
        </div>

      </div>
    </div>
  );
};
