import React, { useState, useRef } from "react";
import { 
  X, FileText, Printer, Download, Share2, Upload, Link as LinkIcon, 
  Check, CheckSquare, Square, Plus, Trash2, Eye, ShieldCheck, 
  Sparkles, MessageCircle, Copy, AlertCircle, ExternalLink, Image as ImageIcon
} from "lucide-react";
import { Certificate, Experience } from "../data/portfolioData";
import { AIPolishButton } from "./AIPolishButton";

interface ApplicationDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: any;
  certificates: Certificate[];
  experiences: Experience[];
}

interface AdditionalAttachment {
  id: string;
  name: string;
  url: string;
  type: "upload" | "imgbb";
}

export const ApplicationDossierModal: React.FC<ApplicationDossierModalProps> = ({
  isOpen,
  onClose,
  profile,
  certificates,
  experiences,
}) => {
  // 1. Cover Letter State
  const [targetCompany, setTargetCompany] = useState("PT Nama Perusahaan Tujuan");
  const [targetPosition, setTargetPosition] = useState("Staff Administrasi & Keuangan");
  const [coverLetterText, setCoverLetterText] = useState(`Tangerang, ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}

Hal: Lamaran Pekerjaan – Staff Administrasi & Keuangan
Lampiran: Berkas CV & Sertifikat Kompetensi Resmi

Kepada Yth.
Tim Rekrutmen / Human Resources Department
PT Nama Perusahaan Tujuan
di Tempat

Dengan hormat,

Sehubungan dengan informasi lowongan pekerjaan untuk posisi Staff Administrasi & Keuangan di perusahaan yang Bapak/Ibu pimpin, melalui surat ini saya bermaksud untuk mengajukan diri guna bergabung dan berkontribusi secara nyata di perusahaan Bapak/Ibu.

Saya memiliki latar belakang pendidikan di bidang Akuntansi Keuangan serta telah mengantongi Sertifikat Kompetensi Akuntansi resmi dari Lembaga Sertifikasi Profesi. Selain itu, saya memiliki pengalaman kerja profesional selama lebih dari 5 tahun, dengan rekam jejak utama selama lebih dari 4 tahun sebagai Staff Administrasi & Keuangan di PT Kovalen Mining (Desember 2020 – Januari 2025). 

Selama menjalankan tugas di PT Kovalen Mining, saya terbiasa mengemban tanggung jawab dalam:
1. Pengelolaan Arus Kas Harian (Petty Cash): Mencatat dan merekonsiliasi seluruh pengeluaran operasional tambang dengan pencapaian zero cash discrepancy (tanpa selisih kas).
2. Sistem Pengarsipan Dokumen Terstruktur: Mengatur dan mendokumentasikan berkas kontrak kerja, surat legalitas, dan kuitansi operasional baik secara fisik maupun digital sehingga proses audit berjalan lancar.
3. Rekapitulasi & Pelaporan Keuangan: Menyusun data laporan keuangan bulanan dan tahunan dengan penguasaan software lembar kerja Microsoft Excel (VLOOKUP, HLOOKUP, PivotTable, dan rumus logika keuangan).
4. Rekam Jejak Ritel Modern: Sebelumnya saya juga memiliki pengalaman kasir di Transmart Carrefour dan pramuniaga di PT AEON Mall BSD yang semakin melatih ketelitian, kecepatan kerja, dan etika pelayanan prima.

Dengan integritas yang tinggi, kedisiplinan, ketelitian dalam bekerja dengan angka, serta kemauan untuk terus belajar, saya yakin dapat beradaptasi dengan cepat dan memberikan dampak positif bagi kelancaran operasional di perusahaan Bapak/Ibu. Saya berdomisili di Pagedangan, Tangerang, dan siap untuk mulai bekerja segera.

Besar harapan saya untuk diberikan kesempatan menghadiri sesi wawancara agar dapat menjelaskan lebih mendalam mengenai kualifikasi dan dedikasi yang dapat saya berikan. Atas perhatian dan kesempatan yang Bapak/Ibu berikan, saya sampaikan terima kasih.

Hormat saya,

Nur Wahyudi
Pagedangan, Tangerang - Banten
Telepon / WhatsApp: +62 881-0240-40191
Email: yudi02012001@gmail.com`);

  // 2. CV Inclusion State
  const [includeCv, setIncludeCv] = useState(true);

  // 3. Selected Certificates
  const [selectedCertIds, setSelectedCertIds] = useState<string[]>(
    certificates.map((c) => c.id)
  );

  // 4. Additional Uploaded / ImgBB Attachments
  const [attachments, setAttachments] = useState<AdditionalAttachment[]>([]);
  const [newAttachName, setNewAttachName] = useState("");
  const [newAttachUrl, setNewAttachUrl] = useState("");
  const [attachInputType, setAttachInputType] = useState<"upload" | "imgbb">("upload");
  const [isUploadingAttach, setIsUploadingAttach] = useState(false);

  // 5. Active Tab in Modal (Editor vs Preview)
  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");
  const [copiedText, setCopiedText] = useState(false);

  if (!isOpen) return null;

  // Toggle certificate checkbox
  const toggleCert = (id: string) => {
    setSelectedCertIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Add file attachment via upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAttach(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
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
          const newAtt: AdditionalAttachment = {
            id: "att-" + Date.now(),
            name: newAttachName.trim() || file.name.replace(/\.[^/.]+$/, ""),
            url: data.url,
            type: "upload",
          };
          setAttachments((prev) => [...prev, newAtt]);
          setNewAttachName("");
        }
        setIsUploadingAttach(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setIsUploadingAttach(false);
    }
  };

  // Add attachment via imgbb link
  const handleAddImgbbLink = () => {
    if (!newAttachUrl.trim()) return;
    const newAtt: AdditionalAttachment = {
      id: "att-" + Date.now(),
      name: newAttachName.trim() || "Lampiran Berkas Eksternal",
      url: newAttachUrl.trim(),
      type: "imgbb",
    };
    setAttachments((prev) => [...prev, newAtt]);
    setNewAttachName("");
    setNewAttachUrl("");
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  // Print 1 Complete Dossier as PDF
  const handlePrintDossier = () => {
    window.print();
  };

  // Copy full text
  const handleCopyText = () => {
    const certList = certificates
      .filter((c) => selectedCertIds.includes(c.id))
      .map((c, i) => `Lampiran ${i + 1}: ${c.name} (${c.issuer})`)
      .join("\n");

    const fullDossierText = `${coverLetterText}\n\n========================================\nRINGKASAN CV NUR WAHYUDI\n========================================\nNama: ${profile.name}\nProfesi: ${profile.title}\nDomisili: ${profile.location}\nKontak: ${profile.phone} | ${profile.email}\nStatus: ${profile.status}\n\nPENGALAMAN KERJA:\n${experiences.map((e) => `- ${e.company} (${e.period}): ${e.role}\n  ${e.description}`).join("\n\n")}\n\nDAFTAR BERKAS LAMPIRAN:\n${certList}\n${attachments.map((a, i) => `Berkas Tambahan ${i + 1}: ${a.name}`).join("\n")}`;

    navigator.clipboard.writeText(fullDossierText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  // Send via WhatsApp
  const handleSendWhatsApp = () => {
    const text = encodeURIComponent(
      `Halo Tim Rekrutmen ${targetCompany},\n\nSaya Nur Wahyudi bermaksud mengirimkan berkas lamaran lengkap untuk posisi *${targetPosition}*.\n\nBerikut ringkasan surat lamaran dan portofolio resmi terverifikasi saya:\nhttps://ais-dev-vbr3wwtkxyz7qsobhye66f-176187640998.asia-east1.run.app/?view=hrd\n\nTerima kasih, saya siap untuk tahapan wawancara.`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const selectedCertificates = certificates.filter((c) =>
    selectedCertIds.includes(c.id)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn print:p-0 print:bg-white print:static print:z-auto">
      {/* Backdrop */}
      <div className="absolute inset-0 print:hidden" onClick={onClose} />

      <div className="relative w-full max-w-6xl max-h-[96vh] bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10 print:border-none print:shadow-none print:max-h-none print:w-full print:bg-white print:rounded-none">
        
        {/* Top Header Controls (Hidden on Print) */}
        <div className="px-6 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 bg-slate-900 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <FileText size={18} />
            </div>
            <div>
              <h2 className="font-display text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Penyusun Berkas Lamaran Pekerjaan Lengkap</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Dossier Merger
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Gabungkan Surat Lamaran + CV + Lampiran Sertifikat & File Tambahan menjadi 1 Dokumen Utuh
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Toggle View Mode */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setViewMode("edit")}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  viewMode === "edit"
                    ? "bg-slate-800 text-white font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Atur & Pilih Berkas
              </button>
              <button
                onClick={() => setViewMode("preview")}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                  viewMode === "preview"
                    ? "bg-emerald-400 text-slate-950 font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Eye size={13} />
                <span>Pratinjau 1 Berkas</span>
              </button>
            </div>

            {/* Print / Download Button */}
            <button
              onClick={handlePrintDossier}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 rounded-xl font-bold text-xs transition-colors shadow-md shadow-emerald-500/20"
              title="Cetak atau Unduh Dokumen Lengkap ke PDF"
            >
              <Printer size={15} />
              <span>Cetak / Unduh PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto">
          
          {/* ================= EDIT / CONFIGURATION MODE ================= */}
          {viewMode === "edit" && (
            <div className="p-6 space-y-8 max-w-5xl mx-auto print:hidden">
              
              {/* Section 1: Target Perusahaan & Posisi */}
              <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-display text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center font-mono">1</span>
                    <span>Tujuan Lamaran & Surat Pengantar</span>
                  </h3>
                  <span className="text-xs text-slate-500 font-mono">Dapat diedit bebas</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-300">Nama Perusahaan Tujuan</label>
                    <input
                      type="text"
                      value={targetCompany}
                      onChange={(e) => setTargetCompany(e.target.value)}
                      placeholder="Contoh: PT Sumber Daya Mineral Indonesia"
                      className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-mono text-slate-300">Posisi yang Dilamar</label>
                    <input
                      type="text"
                      value={targetPosition}
                      onChange={(e) => setTargetPosition(e.target.value)}
                      placeholder="Contoh: Staff Keuangan & Administrasi"
                      className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono text-slate-300">Isi Teks Surat Lamaran Pekerjaan</label>
                    <AIPolishButton
                      compact
                      textToPolish={coverLetterText}
                      onPolished={setCoverLetterText}
                      context={`Surat Lamaran Kerja untuk posisi ${targetPosition} di ${targetCompany}`}
                      targetRole={targetPosition}
                    />
                  </div>
                  <textarea
                    rows={8}
                    value={coverLetterText}
                    onChange={(e) => setCoverLetterText(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-xl p-3.5 text-xs text-slate-200 focus:outline-none font-sans leading-relaxed resize-none"
                  />
                </div>
              </div>

              {/* Section 2: Ringkasan CV Nur Wahyudi */}
              <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-display text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center font-mono">2</span>
                    <span>Curriculum Vitae (CV) Nur Wahyudi</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIncludeCv(!includeCv)}
                    className="flex items-center gap-1.5 text-xs font-mono text-emerald-400"
                  >
                    {includeCv ? <CheckSquare size={16} /> : <Square size={16} />}
                    <span>{includeCv ? "Sertakan dalam Berkas" : "Jangan Sertakan"}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-400">
                  CV memuat biodata lengkap Nur Wahyudi, ringkasan keahlian, riwayat 5 tahun di PT Kovalen Mining, Transmart Carrefour, dan AEON Mall BSD.
                </p>
              </div>

              {/* Section 3: Pilihan Lampiran Sertifikat Resmi */}
              <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-display text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center font-mono">3</span>
                    <span>Pilih Lampiran Sertifikat Resmi ({selectedCertificates.length} Dipilih)</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedCertIds.length === certificates.length) {
                        setSelectedCertIds([]);
                      } else {
                        setSelectedCertIds(certificates.map((c) => c.id));
                      }
                    }}
                    className="text-xs text-emerald-400 underline font-mono"
                  >
                    {selectedCertIds.length === certificates.length ? "Hapus Semua" : "Pilih Semua"}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {certificates.map((cert) => {
                    const isChecked = selectedCertIds.includes(cert.id);
                    return (
                      <div
                        key={cert.id}
                        onClick={() => toggleCert(cert.id)}
                        className={`cursor-pointer p-3.5 rounded-xl border transition-all flex items-center gap-3 ${
                          isChecked
                            ? "bg-emerald-500/10 border-emerald-500/40 text-white"
                            : "bg-slate-900 border-slate-800 text-slate-400 opacity-60"
                        }`}
                      >
                        <div className="text-emerald-400 shrink-0">
                          {isChecked ? <CheckSquare size={18} /> : <Square size={18} />}
                        </div>
                        <div className="w-10 h-8 rounded bg-slate-950 overflow-hidden border border-slate-800 shrink-0 flex items-center justify-center">
                          <img src={cert.url} alt="" className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-1 truncate">
                          <p className="text-xs font-semibold truncate text-white">{cert.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{cert.issuer}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Section 4: Tambah Lampiran Berkas Upload / ImgBB Lainnya */}
              <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-display text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center font-mono">4</span>
                    <span>Tambah Berkas Lampiran Lainnya (Upload Berkas / Link imgbb)</span>
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">{attachments.length} Berkas Tambahan</span>
                </div>

                <p className="text-xs text-slate-400">
                  Anda dapat menyertakan berkas pendukung tambahan seperti KTP, Ijazah, Transkrip Nilai, SKCK, atau dokumen lain melalui upload langsung atau link gambar dari imgbb.
                </p>

                {/* Input Controls */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-mono text-slate-300">Nama Dokumen</label>
                      <input
                        type="text"
                        value={newAttachName}
                        onChange={(e) => setNewAttachName(e.target.value)}
                        placeholder="Contoh: Scan KTP / Ijazah Terakhir"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="flex items-end gap-2">
                      <div className="flex-1 space-y-1">
                        <label className="text-xs font-mono text-slate-300">Sumber Lampiran</label>
                        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                          <button
                            type="button"
                            onClick={() => setAttachInputType("upload")}
                            className={`flex-1 py-1 text-xs rounded-lg font-medium transition-colors ${
                              attachInputType === "upload" ? "bg-emerald-400 text-slate-950" : "text-slate-400"
                            }`}
                          >
                            <Upload size={12} className="inline mr-1" />
                            Upload File
                          </button>
                          <button
                            type="button"
                            onClick={() => setAttachInputType("imgbb")}
                            className={`flex-1 py-1 text-xs rounded-lg font-medium transition-colors ${
                              attachInputType === "imgbb" ? "bg-emerald-400 text-slate-950" : "text-slate-400"
                            }`}
                          >
                            <LinkIcon size={12} className="inline mr-1" />
                            Link imgbb
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {attachInputType === "upload" ? (
                    <div className="pt-2">
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={handleFileUpload}
                        id="dossier-extra-upload"
                        className="hidden"
                        disabled={isUploadingAttach}
                      />
                      <label
                        htmlFor="dossier-extra-upload"
                        className="cursor-pointer flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-slate-700 bg-slate-950 hover:bg-slate-900 text-xs text-emerald-400 font-semibold transition-colors"
                      >
                        <Upload size={14} />
                        <span>{isUploadingAttach ? "Mengunggah Berkas..." : "Pilih File Gambar / Scan Dokumen"}</span>
                      </label>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="url"
                        value={newAttachUrl}
                        onChange={(e) => setNewAttachUrl(e.target.value)}
                        placeholder="Tempel tautan imgbb, contoh: https://i.ibb.co.com/..."
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={handleAddImgbbLink}
                        className="px-4 py-2 bg-emerald-400 text-slate-950 rounded-xl font-bold text-xs"
                      >
                        Tambah
                      </button>
                    </div>
                  )}
                </div>

                {/* List of custom attachments */}
                {attachments.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-mono text-slate-400">Berkas Tambahan yang Telah Dimasukkan:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {attachments.map((att) => (
                        <div key={att.id} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 truncate">
                            <ImageIcon size={14} className="text-emerald-400 shrink-0" />
                            <span className="text-xs text-white truncate font-medium">{att.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAttachment(att.id)}
                            className="p-1 text-slate-400 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Trigger to Preview */}
              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setViewMode("preview")}
                  className="flex items-center gap-2 px-6 py-3 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-500/20"
                >
                  <Eye size={16} />
                  <span>Lihat Pratinjau 1 Berkas Lamaran Utuh</span>
                </button>
              </div>

            </div>
          )}

          {/* ================= PREVIEW 1 COMPLETE DOSSIER MODE ================= */}
          {/* This section is printable into clean multi-page PDF */}
          {(viewMode === "preview" || typeof window === "undefined") && (
            <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-12 print:p-0 print:space-y-0 print:max-w-none">
              
              {/* Action Banner (Hidden on Print) */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3 print:hidden">
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
                  <Check size={14} />
                  <span>1 Berkas Lamaran Siap Dicetak ke PDF atau Dikirim Langsung</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyText}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-white font-medium border border-slate-700"
                  >
                    {copiedText ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                    <span>{copiedText ? "Tersalin!" : "Salin Teks"}</span>
                  </button>
                  <button
                    onClick={handleSendWhatsApp}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs text-white font-semibold"
                  >
                    <MessageCircle size={13} />
                    <span>Kirim ke HRD (WA)</span>
                  </button>
                  <button
                    onClick={handlePrintDossier}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-bold"
                  >
                    <Printer size={14} />
                    <span>Cetak PDF</span>
                  </button>
                </div>
              </div>

              {/* ================= LEMBAR 1: SURAT LAMARAN PEKERJAAN ================= */}
              <div className="bg-white text-slate-900 p-8 sm:p-14 rounded-2xl shadow-xl space-y-6 font-sans text-xs sm:text-sm leading-relaxed border border-slate-200 print:shadow-none print:border-none print:rounded-none print:p-8 print:break-after-page">
                {/* Formal Letterhead */}
                <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-end">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900">
                      NUR WAHYUDI
                    </h1>
                    <p className="text-xs text-slate-600 font-medium">
                      Administrative Specialist & Accounting Professional
                    </p>
                  </div>
                  <div className="text-right text-[11px] text-slate-600 font-mono">
                    <p>Pagedangan, Tangerang - Banten</p>
                    <p>WhatsApp: +62 881-0240-40191</p>
                    <p>Email: yudi02012001@gmail.com</p>
                  </div>
                </div>

                {/* Surat Lamaran Body */}
                <div className="whitespace-pre-line leading-relaxed text-slate-800">
                  {coverLetterText}
                </div>

                {/* Tanda Tangan */}
                <div className="pt-8 flex justify-end">
                  <div className="text-center w-48">
                    <p className="text-xs text-slate-600 mb-12">Hormat saya,</p>
                    <p className="font-bold text-sm text-slate-900 border-b border-slate-900 pb-1">Nur Wahyudi</p>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">Pelamar Kerja</p>
                  </div>
                </div>
              </div>

              {/* ================= LEMBAR 2: CURRICULUM VITAE (CV) ================= */}
              {includeCv && (
                <div className="bg-white text-slate-900 p-8 sm:p-14 rounded-2xl shadow-xl space-y-6 font-sans text-xs sm:text-sm leading-relaxed border border-slate-200 print:shadow-none print:border-none print:rounded-none print:p-8 print:break-after-page">
                  {/* Header CV */}
                  <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-700 font-bold">Curriculum Vitae</span>
                      <h2 className="text-2xl font-black text-slate-900">NUR WAHYUDI</h2>
                      <p className="text-xs font-semibold text-slate-700">Administrative Specialist & Accounting Professional</p>
                      <p className="text-[11px] text-slate-600">Pagedangan, Tangerang · 0881024040191 · yudi02012001@gmail.com</p>
                    </div>
                    <div className="w-20 h-24 rounded border border-slate-300 overflow-hidden shrink-0 hidden sm:block">
                      <img src="/profile/nur-wahyudi.jpg" alt="Foto Nur Wahyudi" className="w-full h-full object-cover" />
                    </div>
                  </div>

                  {/* Ringkasan Profil */}
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
                      Ringkasan Profesional
                    </h3>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {profile.summary}
                    </p>
                  </div>

                  {/* Pengalaman Kerja */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
                      Pengalaman Kerja
                    </h3>
                    {experiences.map((exp) => (
                      <div key={exp.id} className="space-y-1">
                        <div className="flex justify-between items-baseline text-xs">
                          <span className="font-bold text-slate-900">{exp.company} — <span className="font-semibold text-slate-700">{exp.role}</span></span>
                          <span className="text-[11px] text-slate-500 font-mono">{exp.period}</span>
                        </div>
                        <p className="text-[11px] text-slate-600">{exp.description}</p>
                        <ul className="list-disc list-inside text-[11px] text-slate-700 pl-1 space-y-0.5">
                          {exp.responsibilities.slice(0, 3).map((r, rIdx) => (
                            <li key={rIdx}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* Keahlian & Pendidikan */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-900 font-mono uppercase">Keahlian Teknis:</h4>
                      <p className="text-[11px] text-slate-700 leading-relaxed">
                        Microsoft Excel (VLOOKUP, Pivot, Logika IF), Petty Cash & Arus Kas, Rekonsiliasi, Jurnal Akuntansi, Filing System, Kasir POS & Mesin EDC.
                      </p>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-900 font-mono uppercase">Sertifikasi Utama:</h4>
                      <p className="text-[11px] text-slate-700 leading-relaxed">
                        Sertifikat Kompetensi Akuntansi Resmi (LSP/BNSP), Sertifikat OSIS, Gramedia, AEON Store, Transmart Carrefour.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= LEMBAR 3+: LAMPIRAN SERTIFIKAT & BERKAS ================= */}
              {selectedCertificates.map((cert, index) => (
                <div 
                  key={cert.id} 
                  className="bg-white text-slate-900 p-8 sm:p-14 rounded-2xl shadow-xl space-y-4 border border-slate-200 print:shadow-none print:border-none print:rounded-none print:p-8 print:break-after-page"
                >
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-emerald-700 font-bold">
                        Lampiran {index + 1}
                      </span>
                      <h3 className="text-base font-bold text-slate-900">{cert.name}</h3>
                    </div>
                    <span className="text-xs text-slate-500 font-mono">{cert.issuer}</span>
                  </div>

                  {/* Full image of certificate */}
                  <div className="w-full flex items-center justify-center p-2 bg-slate-50 border border-slate-200 rounded-xl min-h-[450px]">
                    <img 
                      src={cert.url} 
                      alt={cert.name} 
                      referrerPolicy="no-referrer"
                      className="max-h-[680px] w-auto max-w-full object-contain" 
                    />
                  </div>

                  <p className="text-xs text-slate-600 italic">
                    {cert.description}
                  </p>
                </div>
              ))}

              {/* ================= LAMPIRAN TAMBAHAN (UPLOAD / IMGBB) ================= */}
              {attachments.map((att, index) => (
                <div 
                  key={att.id} 
                  className="bg-white text-slate-900 p-8 sm:p-14 rounded-2xl shadow-xl space-y-4 border border-slate-200 print:shadow-none print:border-none print:rounded-none print:p-8 print:break-after-page"
                >
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-cyan-700 font-bold">
                        Lampiran Tambahan {index + 1}
                      </span>
                      <h3 className="text-base font-bold text-slate-900">{att.name}</h3>
                    </div>
                    <span className="text-xs text-slate-500 font-mono">{att.type === "upload" ? "Unggahan Berkas" : "Tautan imgbb"}</span>
                  </div>

                  {/* Attachment Image Display */}
                  <div className="w-full flex items-center justify-center p-2 bg-slate-50 border border-slate-200 rounded-xl min-h-[450px]">
                    <img 
                      src={att.url} 
                      alt={att.name} 
                      referrerPolicy="no-referrer"
                      className="max-h-[680px] w-auto max-w-full object-contain" 
                    />
                  </div>
                </div>
              ))}

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
