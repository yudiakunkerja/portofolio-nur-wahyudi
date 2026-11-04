import React, { useState } from "react";
import { Sparkles, Send, Bot, User, CheckCircle2, Copy, Check, FileText, ArrowRight, Loader2, MessageSquare, Briefcase, HelpCircle } from "lucide-react";
import { PROFILE_INFO } from "../data/portfolioData";

interface ChatMessage {
  role: "user" | "model";
  text: string;
}

interface MatchResult {
  matchScore: number;
  summary: string;
  matchedSkills: string[];
  whyHire: string;
  recommendedQuestions: string[];
}

export const AISuite: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"chat" | "matcher" | "cover-letter">("chat");

  // Tab 1: Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "model",
      text: "Halo! Saya adalah Asisten AI Representasi Karier Nur Wahyudi. Anda dapat menanyakan tentang riwayat pekerjaan beliau di PT Kovalen Mining, keahlian akuntansi dan Excel, sertifikasi kompetensi resmi, hingga kesiapannya untuk diwawancarai. Ada yang ingin Anda tanyakan?",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Tab 2: Job Matcher State
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isMatchLoading, setIsMatchLoading] = useState(false);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);

  // Tab 3: Cover Letter State
  const [clCompany, setClCompany] = useState("");
  const [clPosition, setClPosition] = useState("");
  const [clNotes, setClNotes] = useState("");
  const [isClLoading, setIsClLoading] = useState(false);
  const [coverLetterResult, setCoverLetterResult] = useState("");
  const [copiedCl, setCopiedCl] = useState(false);

  // Helper: Send Chat Message
  const handleSendMessage = async (msgText?: string) => {
    const textToSend = msgText || inputMessage;
    if (!textToSend.trim() || isChatLoading) return;

    const newHistory: ChatMessage[] = [...messages, { role: "user", text: textToSend }];
    setMessages(newHistory);
    setInputMessage("");
    setIsChatLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: newHistory,
        }),
      });
      const data = await res.json();
      if (data.reply) {
        setMessages((prev) => [...prev, { role: "model", text: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "model", text: "Maaf, terjadi kendala saat memproses respons. Silakan ajukan pertanyaan lain atau hubungi langsung via WhatsApp." },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "model", text: "Terjadi kesalahan jaringan. Silakan hubungi langsung Nur Wahyudi di WhatsApp 0881024040191." },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Helper: Run Job Match
  const handleRunMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDescription.trim() || isMatchLoading) return;

    setIsMatchLoading(true);
    setMatchResult(null);

    try {
      const res = await fetch("/api/ai/match-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName,
          jobTitle,
          jobDescription,
        }),
      });
      const data = await res.json();
      setMatchResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsMatchLoading(false);
    }
  };

  // Helper: Run Cover Letter Generator
  const handleGenerateCoverLetter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clCompany.trim() || !clPosition.trim() || isClLoading) return;

    setIsClLoading(true);
    setCoverLetterResult("");

    try {
      const res = await fetch("/api/ai/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: clCompany,
          position: clPosition,
          notes: clNotes,
        }),
      });
      const data = await res.json();
      setCoverLetterResult(data.coverLetter || "");
    } catch (err) {
      console.error(err);
    } finally {
      setIsClLoading(false);
    }
  };

  const handleCopyCl = () => {
    if (!coverLetterResult) return;
    navigator.clipboard.writeText(coverLetterResult);
    setCopiedCl(true);
    setTimeout(() => setCopiedCl(false), 2500);
  };

  // Preset Questions
  const presetQuestions = [
    "Apa pengalaman terkuat Nur di bidang administrasi & kas?",
    "Bagaimana cara Nur menjaga petty cash tanpa selisih di tambang?",
    "Apakah Nur Wahyudi siap bekerja WFO di wilayah Tangerang/Jakarta?",
    "Ceritakan penguasaan Microsoft Excel yang dimiliki Nur.",
  ];

  return (
    <section id="fitur-ai" className="py-20 border-b border-slate-900 bg-gradient-to-b from-slate-950 via-slate-900/60 to-slate-950">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="max-w-3xl mb-12 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 tracking-wider uppercase font-mono">
            <Sparkles size={14} />
            <span>AI Recruiter Intelligence Suite</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Eksplorasi Profil Interaktif Berbasis AI
          </h2>
          <p className="text-base text-slate-400 leading-relaxed">
            Ditenagai model kecerdasan buatan Gemini. Recruiter atau tim HR dapat berinteraksi langsung, menguji kecocokan deskripsi loker, hingga membuat surat lamaran kerja terpersonalisasi secara instan.
          </p>
        </div>

        {/* Tab Navigation (Segmented Interactive Control) */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-900/90 border border-slate-800 rounded-2xl mb-8 max-w-2xl">
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
              activeTab === "chat"
                ? "bg-emerald-400 text-slate-950 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <MessageSquare size={14} />
            <span>Tanya AI Karier</span>
          </button>

          <button
            onClick={() => setActiveTab("matcher")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
              activeTab === "matcher"
                ? "bg-emerald-400 text-slate-950 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Briefcase size={14} />
            <span>Cek Kecocokan Loker (ATS Matcher)</span>
          </button>

          <button
            onClick={() => setActiveTab("cover-letter")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
              activeTab === "cover-letter"
                ? "bg-emerald-400 text-slate-950 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <FileText size={14} />
            <span>Generator Surat Lamaran</span>
          </button>
        </div>

        {/* Tab 1: AI Chat Assistant */}
        {activeTab === "chat" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Chat Box (8 cols) */}
            <div className="lg:col-span-8 bg-slate-900/70 border border-slate-800 rounded-3xl p-6 flex flex-col h-[560px]">
              {/* Messages Scroll Area */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4">
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-3 ${
                      m.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {m.role === "model" && (
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                        <Bot size={16} />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                        m.role === "user"
                          ? "bg-emerald-500 text-slate-950 font-medium"
                          : "bg-slate-950/80 border border-slate-800 text-slate-200"
                      }`}
                    >
                      {m.text}
                    </div>
                    {m.role === "user" && (
                      <div className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                        <User size={16} />
                      </div>
                    )}
                  </div>
                ))}
                {isChatLoading && (
                  <div className="flex items-center gap-2 text-xs text-slate-400 italic py-2">
                    <Loader2 size={14} className="animate-spin text-emerald-400" />
                    <span>NW Career AI sedang menyusun jawaban...</span>
                  </div>
                )}
              </div>

              {/* Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2 border-t border-slate-800 pt-3"
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ketik pertanyaan tentang kualifikasi Nur Wahyudi..."
                  className="flex-1 bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:outline-none rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500"
                  disabled={isChatLoading}
                />
                <button
                  type="submit"
                  disabled={isChatLoading || !inputMessage.trim()}
                  className="px-4 py-3 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 text-slate-950 rounded-xl font-bold transition-colors shrink-0"
                  aria-label="Kirim Pesan"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>

            {/* Quick Prompts Panel (4 cols) */}
            <div className="lg:col-span-4 bg-slate-900/50 border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider">
                <HelpCircle size={14} />
                <span>Pertanyaan Cepat untuk Recruiter</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Klik pertanyaan siap pakai berikut untuk langsung menguji wawasan dan rekam jejak Nur Wahyudi:
              </p>
              <div className="space-y-2.5">
                {presetQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(q)}
                    disabled={isChatLoading}
                    className="w-full text-left p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900/80 transition-all text-xs text-slate-300 leading-snug flex items-center justify-between group"
                  >
                    <span>{q}</span>
                    <ArrowRight size={13} className="text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                  </button>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 font-mono">
                Data terverifikasi berdasarkan portofolio resmi Nur Wahyudi.
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Job Matcher & ATS Fit Analyzer */}
        {activeTab === "matcher" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Input Form (5 cols) */}
            <div className="lg:col-span-5 bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
              <div className="space-y-1">
                <h3 className="font-display text-lg font-bold text-white">
                  Tempel Lowongan Pekerjaan Anda
                </h3>
                <p className="text-xs text-slate-400">
                  AI akan menghitung kecocokan latar belakang Nur Wahyudi terhadap kualifikasi yang Anda cari.
                </p>
              </div>

              <form onSubmit={handleRunMatch} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300">Nama Perusahaan (Opsional)</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Contoh: PT Sumber Rezeki Mandiri"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300">Posisi / Jabatan</label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="Contoh: Staff Administrasi & Finance / Kasir Supervisor"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300">Kualifikasi / Deskripsi Pekerjaan *</label>
                  <textarea
                    rows={6}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Tempel syarat loker di sini, contoh:
- Pendidikan min. SMK Akuntansi
- Pengalaman kerja min. 1 tahun di bidang administrasi
- Menguasai Microsoft Excel dan petty cash
- Teliti, jujur, dan bertanggung jawab..."
                    required
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-3.5 text-xs text-white placeholder-slate-600 focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isMatchLoading || !jobDescription.trim()}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
                >
                  {isMatchLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Sedang Menganalisis dengan Gemini AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      <span>Analisis Kecocokan Kandidat</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Results Panel (7 cols) */}
            <div className="lg:col-span-7 bg-slate-900/50 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-center min-h-[440px]">
              {!matchResult && !isMatchLoading && (
                <div className="text-center p-8 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 mx-auto">
                    <Briefcase size={24} />
                  </div>
                  <h4 className="text-base font-bold text-white">Hasil Analisis Akan Ditampilkan di Sini</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                    Masukkan rincian posisi atau tempel teks deskripsi lowongan pekerjaan di sebelah kiri untuk melihat skor kecocokan dan rekomendasi wawancara.
                  </p>
                </div>
              )}

              {isMatchLoading && (
                <div className="text-center p-12 space-y-4">
                  <Loader2 size={32} className="animate-spin text-emerald-400 mx-auto" />
                  <p className="text-sm font-semibold text-white">
                    Membandingkan 5+ tahun pengalaman Nur Wahyudi dengan kebutuhan loker Anda...
                  </p>
                  <p className="text-xs text-slate-500 font-mono">
                    Memeriksa keahlian petty cash, filing, sertifikat akuntansi, dan rekam jejak industri.
                  </p>
                </div>
              )}

              {matchResult && !isMatchLoading && (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* Score & Summary Banner */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
                    <div className="space-y-1">
                      <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
                        Tingkat Kecocokan Profil
                      </span>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                        {matchResult.summary}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-display text-4xl sm:text-5xl font-black text-emerald-400 font-mono tabular-nums">
                        {matchResult.matchScore}%
                      </span>
                      <p className="text-[10px] text-emerald-300/80 font-mono uppercase">Match Score</p>
                    </div>
                  </div>

                  {/* Matched Competencies */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                      Kualifikasi yang Langsung Terpenuhi:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {matchResult.matchedSkills.map((sk, idx) => (
                        <div key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-200">
                          <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                          <span>{sk}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Why Hire Value Proposition */}
                  <div className="space-y-2 p-4 rounded-xl bg-slate-950/50 border border-slate-800">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-emerald-400">
                      Mengapa Nur Wahyudi Sangat Tepat untuk Peran Ini:
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {matchResult.whyHire}
                    </p>
                  </div>

                  {/* Recommended Interview Questions */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                      Rekomendasi Pertanyaan Wawancara untuk Recruiter:
                    </h4>
                    <ul className="space-y-2">
                      {matchResult.recommendedQuestions.map((q, idx) => (
                        <li key={idx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300">
                          <span className="text-emerald-400 font-semibold font-mono">Q{idx + 1}: </span>
                          {q}
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              )}
            </div>

          </div>
        )}

        {/* Tab 3: Tailored Cover Letter Generator */}
        {activeTab === "cover-letter" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Input Form (5 cols) */}
            <div className="lg:col-span-5 bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
              <div className="space-y-1">
                <h3 className="font-display text-lg font-bold text-white">
                  Buat Surat Lamaran Resmi Instan
                </h3>
                <p className="text-xs text-slate-400">
                  Hasilkan surat lamaran kerja terstruktur dan persuasif untuk posisi incaran Anda di perusahaan tujuan.
                </p>
              </div>

              <form onSubmit={handleGenerateCoverLetter} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300">Nama Perusahaan Tujuan *</label>
                  <input
                    type="text"
                    value={clCompany}
                    onChange={(e) => setClCompany(e.target.value)}
                    placeholder="Contoh: PT Astra Graphia Tbk"
                    required
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300">Posisi yang Dituju *</label>
                  <input
                    type="text"
                    value={clPosition}
                    onChange={(e) => setClPosition(e.target.value)}
                    placeholder="Contoh: Staff Keuangan & Administrasi"
                    required
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-slate-300">Catatan Khusus (Opsional)</label>
                  <textarea
                    rows={3}
                    value={clNotes}
                    onChange={(e) => setClNotes(e.target.value)}
                    placeholder="Contoh: Penekanan pada pengalaman cash flow 5 tahun dan keahlian rumus Excel..."
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-3.5 text-xs text-white placeholder-slate-600 focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isClLoading || !clCompany.trim() || !clPosition.trim()}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
                >
                  {isClLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Sedang Menyusun Surat Lamaran...</span>
                    </>
                  ) : (
                    <>
                      <FileText size={16} />
                      <span>Generate Surat Lamaran</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Output Preview (7 cols) */}
            <div className="lg:col-span-7 bg-slate-900/50 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between min-h-[440px]">
              {!coverLetterResult && !isClLoading && (
                <div className="text-center p-8 space-y-3 my-auto">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 mx-auto">
                    <FileText size={24} />
                  </div>
                  <h4 className="text-base font-bold text-white">Draf Surat Lamaran</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                    Isi nama perusahaan dan posisi yang dilamar di sebelah kiri untuk menghasilkan surat lamaran kerja resmi siap kirim.
                  </p>
                </div>
              )}

              {isClLoading && (
                <div className="text-center p-12 space-y-4 my-auto">
                  <Loader2 size={32} className="animate-spin text-emerald-400 mx-auto" />
                  <p className="text-sm font-semibold text-white">
                    Menyusun surat lamaran profesional dengan kualifikasi riil Nur Wahyudi...
                  </p>
                </div>
              )}

              {coverLetterResult && !isClLoading && (
                <div className="space-y-4 flex flex-col flex-1 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                      Surat Lamaran Kerja Resmi
                    </span>
                    <button
                      onClick={handleCopyCl}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
                    >
                      {copiedCl ? (
                        <>
                          <Check size={14} className="text-emerald-400" />
                          <span className="text-emerald-400">Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          <span>Salin Teks</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex-1 bg-slate-950 p-5 rounded-2xl border border-slate-800 text-xs sm:text-sm text-slate-200 whitespace-pre-line leading-relaxed max-h-[380px] overflow-y-auto font-sans">
                    {coverLetterResult}
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </section>
  );
};
