import express from "express";
import { GoogleGenAI, Type } from "@google/genai";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Ensure upload and data directories exist
const uploadDir = path.resolve(__dirname, "public", "uploads");
const dataStorePath = path.resolve(__dirname, "data", "portfolioStore.json");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Helper to read and write persistent data
function readStore() {
  try {
    if (fs.existsSync(dataStorePath)) {
      const raw = fs.readFileSync(dataStorePath, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("Error reading portfolioStore:", err);
  }
  return { profile: {}, executiveSummary: {}, skillCategories: [], certificates: [], experiences: [], settings: {} };
}

function writeStore(data: any) {
  try {
    fs.writeFileSync(dataStorePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing portfolioStore:", err);
  }
}

// Serve static assets from public/ folder directly (certificates, uploads, profile photo)
app.use(express.static(path.resolve(__dirname, "public")));

// --- SETTINGS (IMGBB API KEY & PREFERENCES) ---
app.get("/api/settings", (_req, res) => {
  const store = readStore();
  res.json(store.settings || {});
});

app.post("/api/settings", (req, res) => {
  try {
    const store = readStore();
    store.settings = { ...store.settings, ...req.body };
    writeStore(store);
    res.json({ success: true, settings: store.settings });
  } catch (err: any) {
    res.status(500).json({ error: "Gagal menyimpan pengaturan", details: err.message });
  }
});

// --- PORTFOLIO CRUD ENDPOINTS (ADMIN API) ---

// Get current portfolio data
app.get("/api/portfolio", (_req, res) => {
  const store = readStore();
  res.json(store);
});

// Update profile
app.put("/api/portfolio/profile", (req, res) => {
  try {
    const store = readStore();
    store.profile = { ...store.profile, ...req.body };
    writeStore(store);
    res.json({ success: true, profile: store.profile });
  } catch (err: any) {
    res.status(500).json({ error: "Gagal memperbarui profil", details: err.message });
  }
});

// Update executive summary
app.put("/api/portfolio/summary", (req, res) => {
  try {
    const store = readStore();
    store.executiveSummary = { ...store.executiveSummary, ...req.body };
    writeStore(store);
    res.json({ success: true, executiveSummary: store.executiveSummary });
  } catch (err: any) {
    res.status(500).json({ error: "Gagal memperbarui ringkasan eksekutif", details: err.message });
  }
});

// Update skills categories
app.put("/api/portfolio/skills", (req, res) => {
  try {
    const store = readStore();
    store.skillCategories = req.body.skillCategories || [];
    writeStore(store);
    res.json({ success: true, skillCategories: store.skillCategories });
  } catch (err: any) {
    res.status(500).json({ error: "Gagal memperbarui keahlian", details: err.message });
  }
});

// Add new certificate
app.post("/api/portfolio/certificate", (req, res) => {
  try {
    const { name, issuer, category, year, url, description, skillsHighlighted } = req.body;
    if (!name || !url) {
      return res.status(400).json({ error: "Nama sertifikat dan URL gambar/berkas wajib diisi." });
    }

    const store = readStore();
    const newCert = {
      id: "cert-" + Date.now(),
      name,
      issuer: issuer || "Institusi Penerbit",
      category: category || "Akuntansi",
      year: year || "Terverifikasi",
      url,
      description: description || "Sertifikat kualifikasi resmi.",
      skillsHighlighted: Array.isArray(skillsHighlighted) 
        ? skillsHighlighted 
        : (typeof skillsHighlighted === "string" ? skillsHighlighted.split(",").map((s: string) => s.trim()).filter(Boolean) : ["Kompetensi Terverifikasi"]),
    };

    store.certificates.push(newCert);
    writeStore(store);
    res.json({ success: true, certificate: newCert });
  } catch (err: any) {
    res.status(500).json({ error: "Gagal menambahkan sertifikat", details: err.message });
  }
});

// Update existing certificate
app.put("/api/portfolio/certificate/:id", (req, res) => {
  try {
    const { id } = req.params;
    const store = readStore();
    const idx = store.certificates.findIndex((c: any) => c.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: "Sertifikat tidak ditemukan." });
    }

    const updated = {
      ...store.certificates[idx],
      ...req.body,
      skillsHighlighted: Array.isArray(req.body.skillsHighlighted)
        ? req.body.skillsHighlighted
        : (typeof req.body.skillsHighlighted === "string" ? req.body.skillsHighlighted.split(",").map((s: string) => s.trim()).filter(Boolean) : store.certificates[idx].skillsHighlighted),
    };

    store.certificates[idx] = updated;
    writeStore(store);
    res.json({ success: true, certificate: updated });
  } catch (err: any) {
    res.status(500).json({ error: "Gagal memperbarui sertifikat", details: err.message });
  }
});

// Delete certificate
app.delete("/api/portfolio/certificate/:id", (req, res) => {
  try {
    const { id } = req.params;
    const store = readStore();
    store.certificates = store.certificates.filter((c: any) => c.id !== id);
    writeStore(store);
    res.json({ success: true, message: "Sertifikat berhasil dihapus" });
  } catch (err: any) {
    res.status(500).json({ error: "Gagal menghapus sertifikat", details: err.message });
  }
});

// Add new experience
app.post("/api/portfolio/experience", (req, res) => {
  try {
    const { company, role, period, duration, location, category, description, responsibilities, achievements, skills } = req.body;
    if (!company || !role) {
      return res.status(400).json({ error: "Nama perusahaan dan posisi/jabatan wajib diisi." });
    }

    const store = readStore();
    const newExp = {
      id: "exp-" + Date.now(),
      company,
      role,
      period: period || "2024 - Sekarang",
      duration: duration || "1 Tahun",
      location: location || "Tangerang / Indonesia",
      category: category || "administrasi",
      description: description || "Tanggung jawab operasional profesional.",
      responsibilities: Array.isArray(responsibilities) 
        ? responsibilities 
        : (typeof responsibilities === "string" ? responsibilities.split("\n").map((r: string) => r.trim()).filter(Boolean) : []),
      achievements: Array.isArray(achievements) 
        ? achievements 
        : (typeof achievements === "string" ? achievements.split("\n").map((a: string) => a.trim()).filter(Boolean) : []),
      skills: Array.isArray(skills) 
        ? skills 
        : (typeof skills === "string" ? skills.split(",").map((s: string) => s.trim()).filter(Boolean) : []),
    };

    store.experiences.unshift(newExp);
    writeStore(store);
    res.json({ success: true, experience: newExp });
  } catch (err: any) {
    res.status(500).json({ error: "Gagal menambahkan pekerjaan", details: err.message });
  }
});

// Update existing experience
app.put("/api/portfolio/experience/:id", (req, res) => {
  try {
    const { id } = req.params;
    const store = readStore();
    const idx = store.experiences.findIndex((e: any) => e.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: "Pengalaman kerja tidak ditemukan." });
    }

    const updated = {
      ...store.experiences[idx],
      ...req.body,
      responsibilities: Array.isArray(req.body.responsibilities) 
        ? req.body.responsibilities 
        : (typeof req.body.responsibilities === "string" ? req.body.responsibilities.split("\n").map((r: string) => r.trim()).filter(Boolean) : store.experiences[idx].responsibilities),
      achievements: Array.isArray(req.body.achievements) 
        ? req.body.achievements 
        : (typeof req.body.achievements === "string" ? req.body.achievements.split("\n").map((a: string) => a.trim()).filter(Boolean) : store.experiences[idx].achievements),
      skills: Array.isArray(req.body.skills) 
        ? req.body.skills 
        : (typeof req.body.skills === "string" ? req.body.skills.split(",").map((s: string) => s.trim()).filter(Boolean) : store.experiences[idx].skills),
    };

    store.experiences[idx] = updated;
    writeStore(store);
    res.json({ success: true, experience: updated });
  } catch (err: any) {
    res.status(500).json({ error: "Gagal memperbarui pengalaman kerja", details: err.message });
  }
});

// Delete experience
app.delete("/api/portfolio/experience/:id", (req, res) => {
  try {
    const { id } = req.params;
    const store = readStore();
    store.experiences = store.experiences.filter((e: any) => e.id !== id);
    writeStore(store);
    res.json({ success: true, message: "Pengalaman kerja berhasil dihapus" });
  } catch (err: any) {
    res.status(500).json({ error: "Gagal menghapus pekerjaan", details: err.message });
  }
});

// Upload file endpoint (Supports Auto-Upload to ImgBB if API key provided or configured!)
app.post("/api/upload", async (req, res) => {
  try {
    const { fileName, dataBase64, imgbbKey } = req.body;
    if (!dataBase64) {
      return res.status(400).json({ error: "Data base64 berkas tidak boleh kosong." });
    }

    const store = readStore();
    const effectiveImgbbKey = imgbbKey || store.settings?.imgbbApiKey || process.env.IMGBB_API_KEY;

    // If ImgBB Key is available, upload directly to ImgBB!
    if (effectiveImgbbKey) {
      try {
        // Strip data:image/...;base64,
        const cleanBase64 = dataBase64.replace(/^data:([A-Za-z-+\/]+);base64,/, "");
        const formData = new FormData();
        formData.append("image", cleanBase64);
        if (fileName) formData.append("name", fileName.replace(/\.[^/.]+$/, ""));

        const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${effectiveImgbbKey}`, {
          method: "POST",
          body: formData,
        });
        const imgbbData: any = await imgbbRes.json();

        if (imgbbData?.success && imgbbData?.data?.url) {
          return res.json({
            success: true,
            url: imgbbData.data.url,
            thumbUrl: imgbbData.data.thumb?.url,
            deleteUrl: imgbbData.data.delete_url,
            source: "imgbb",
            fileName: imgbbData.data.title || fileName || "imgbb_upload",
          });
        } else {
          console.warn("ImgBB upload failed, falling back to local storage:", imgbbData);
        }
      } catch (imgbbErr) {
        console.error("ImgBB fetch error:", imgbbErr);
      }
    }

    // Default Fallback: Save to /public/uploads/ on local server
    const matches = dataBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let buffer: Buffer;
    let ext = ".jpg";

    if (matches && matches.length === 3) {
      const mime = matches[1];
      if (mime.includes("png")) ext = ".png";
      else if (mime.includes("pdf")) ext = ".pdf";
      else if (mime.includes("webp")) ext = ".webp";
      buffer = Buffer.from(matches[2], "base64");
    } else {
      buffer = Buffer.from(dataBase64, "base64");
    }

    const safeName = (fileName ? fileName.replace(/[^a-zA-Z0-9.-]/g, "_") : "upload") + "_" + Date.now() + ext;
    const filePath = path.join(uploadDir, safeName);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${safeName}`;
    res.json({ success: true, url: publicUrl, fileName: safeName, source: "local" });
  } catch (err: any) {
    console.error("Error uploading file:", err);
    res.status(500).json({ error: "Gagal mengunggah berkas", details: err.message });
  }
});

// --- AI FEATURE: RAPIHKAN DENGAN AI (TEXT POLISHER FOR HRD APPEAL) ---
app.post("/api/ai/polish-text", async (req, res) => {
  try {
    const { text, context, targetRole } = req.body;
    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Teks untuk dirapihkan tidak boleh kosong." });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Offline high-quality Indonesian formal resume sentence polisher
      let polished = text.trim();
      
      const replacements: [RegExp, string][] = [
        [/^saya\s+/gi, "Bertanggung jawab dalam "],
        [/\bngurus\b/gi, "mengelola"],
        [/\bbikin\b/gi, "menyusun dan merekapitulasi"],
        [/\batur\b/gi, "mengatur dan menata sistem"],
        [/\buang kecil\b/gi, "dana kas kecil (petty cash) operasional"],
        [/\bkas kecil\b/gi, "dana petty cash operasional"],
        [/\btiap hari\b/gi, "secara konsisten setiap hari kerja"],
        [/\bsetiap hari\b/gi, "secara konsisten setiap hari kerja"],
        [/\bbiar gak selisih\b/gi, "dengan memastikan kepatuhan pembukuan tanpa selisih (zero discrepancy)"],
        [/\bgak selisih\b/gi, "akurasi penuh tanpa selisih kas (zero discrepancy)"],
        [/\btidak selisih\b/gi, "tingkat akurasi tinggi tanpa selisih (zero discrepancy)"],
        [/\bnota-nota\b/gi, "seluruh bukti transaksi dan dokumen pendukung"],
        [/\bnota\b/gi, "bukti transaksi valid"],
        [/\bcek\b/gi, "memverifikasi dan merekonsiliasi"],
        [/\bcekin\b/gi, "merekonsiliasi data"],
        [/\bsimpan berkas\b/gi, "menerapkan sistem pengarsipan berkas fisik dan digital yang sistematis"],
        [/\barsip\b/gi, "pengarsipan dokumen terstruktur"],
        [/\bbagus\b/gi, "optimal"],
        [/\blancar\b/gi, "efisien dan akurat"],
        [/\bloker\b/gi, "peluang posisi kerja"],
        [/\bcepat\b/gi, "responsif dan cekatan"],
      ];

      for (const [pattern, rep] of replacements) {
        polished = polished.replace(pattern, rep);
      }

      // Ensure first character is capitalized
      polished = polished.charAt(0).toUpperCase() + polished.slice(1);
      if (!polished.endsWith(".") && !polished.includes("\n")) {
        polished += ".";
      }

      return res.json({ polishedText: polished });
    }

    const prompt = `
Kamu adalah Konsultan Karakteristik CV & Eksekutif Rekrutmen (Executive Resume Writer) profesional.
Tugasmu: "Rapihkan dan percantik kata-kata" berikut agar terdengar formal, kredibel, berdampak tinggi (high-impact), dan sangat memikat bagi HRD/Recruiter.

Konteks teks: ${context || "Deskripsi Kualifikasi / Tanggung Jawab / Pencapaian"}
Peran Terkait: ${targetRole || "Administrative Specialist & Accounting Professional"}

Draf teks asli dari pengguna:
"""
${text}
"""

Instruksi Perapihan:
1. Pertahankan fakta dan angka yang ada, jangan mengarang fakta baru yang berlebihan.
2. Gunakan kata kerja aksi aktif dan profesional khas dunia kerja (misal: "Mengelola", "Merekonsiliasi", "Mengoptimalkan", "Menyusun", "Memverifikasi", "Menerapkan").
3. Buat bahasanya santun, lugas, percaya diri, dan mencerminkan etos kerja disiplin tanpa selisih (zero discrepancy).
4. Jika teks berupa poin-poin/list, keluarkan juga dalam bentuk poin yang rapi.
5. Keluarkan HANYA teks hasil perapihan akhir, tanpa basa-basi atau kata pembuka/penutup.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
    });

    const polishedText = (response.text || "").trim() || text;
    return res.json({ polishedText });
  } catch (err: any) {
    console.error("Error in /api/ai/polish-text:", err);
    return res.json({ polishedText: req.body?.text || "" });
  }
});

// --- DYNAMIC AI KNOWLEDGE BASE & STRICT GUARDRAILS ---
function getDynamicKnowledgeBase() {
  const store = readStore();
  const p = store.profile || {};
  const certs = (store.certificates || []).map((c: any, i: number) => 
    `${i + 1}. ${c.name} (${c.category}, ${c.issuer}, ${c.year}): ${c.description}. Kompetensi: ${c.skillsHighlighted?.join(", ")}`
  ).join("\n");
  const exps = (store.experiences || []).map((e: any, i: number) => 
    `${i + 1}. ${e.company} (${e.period}, ${e.role}): ${e.description}. Tanggung jawab: ${e.responsibilities?.join("; ")}. Pencapaian: ${e.achievements?.join("; ")}`
  ).join("\n");

  return `
KNOWLEDGE BASE RESMI PORTOFOLIO NUR WAHYUDI:
1. INFORMASI PRIBADI:
- Nama: ${p.name || "Nur Wahyudi"}
- Profesi: ${p.title || "Administrative Specialist & Accounting Professional"}
- Domisili: ${p.location || "Pagedangan, Tangerang, Banten, Indonesia"}
- Kontak WA: ${p.phone || "+62 881-0240-40191"}
- Email: ${p.email || "yudi02012001@gmail.com"}
- Status: ${p.status || "Tersedia untuk Peluang Kerja (Ready to Hire)"}

2. PENGALAMAN KERJA TERDAFTAR:
${exps}

3. SERTIFIKAT TERVERIFIKASI:
${certs}

4. KEAHLIAN:
- Microsoft Excel (VLOOKUP, HLOOKUP, PivotTable, SUMIFS, IF logika, rekap kas)
- Pembukuan & arus kas harian (petty cash) tanpa selisih kas
- Pengarsipan dokumen fisik & digital (filing system)
- Kasir & sistem POS register retail modern
`;
}

const STRICT_GUARDRAILS = `
ATURAN UTAMA & BATASAN KETAT (GUARDRAILS):
1. KAMU HANYA BOLEH MENJAWAB PERTANYAAN TENTANG INFORMASI YANG ADA DI WEBSITE / PORTOFOLIO NUR WAHYUDI (pengalaman kerja, kualifikasi akuntansi & administrasi, sertifikat resmi, keahlian Excel/kasir/filing, domisili, kontak, kesiapan kerja, dan contoh surat lamaran).
2. JIKA PENGGUNA BERTANYA TENTANG HAL-HAL UMUM DI LUAR PORTOFOLIO INI (seperti: politik, resep masakan, matematika umum, koding di luar web ini, berita dunia, lelucon umum, gosip, orang lain, sains umum, atau topik random lainnya):
   KAMU WAJIB MENOLAK SECARA SANTUN DAN MENGARAHKAN KEMBALI dengan kalimat seperti:
   "Mohon maaf, saya adalah Asisten AI Representasi Resmi khusus profil profesional Nur Wahyudi. Saya dilatih dan dibatasi secara ketat hanya untuk menjawab informasi seputar pengalaman kerja, kualifikasi administrasi & akuntansi, sertifikat resmi, serta kesiapan kerja Nur Wahyudi. Silakan ajukan pertanyaan seputar latar belakang atau kualifikasi profesional beliau!"
3. Jangan pernah memberikan informasi palsu atau berhalusinasi di luar fakta pada knowledge base Nur Wahyudi.
4. Gunakan bahasa Indonesia yang santun, profesional, lugas, dan meyakinkan.
`;

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

function getOfflineGroundedResponse(question: string): string {
  const q = question.toLowerCase();
  const outOfScopeKeywords = [
    "resep", "masak", "politik", "presiden", "partai", "pemilu",
    "koding python", "buat game", "ramalan", "zodiak", "cuaca", "ikan",
    "film", "lagu", "chord", "lirik", "sejarah perang", "fisika", "kimia",
    "gosip", "selebriti", "sepak bola", "liga"
  ];
  if (outOfScopeKeywords.some((kw) => q.includes(kw))) {
    return "Mohon maaf, saya adalah Asisten AI Representasi Resmi khusus profil profesional Nur Wahyudi. Saya dilatih dan dibatasi secara ketat hanya untuk memberikan informasi seputar kualifikasi, pengalaman kerja, sertifikasi, serta kesiapan karier Nur Wahyudi di website ini. Silakan tanyakan hal terkait profil profesional beliau!";
  }

  if (q.includes("pengalaman") || q.includes("kovalen") || q.includes("riwayat") || q.includes("tambang")) {
    return "Nur Wahyudi memiliki rekam jejak lebih dari 5 tahun di bidang administrasi dan operasional. Pengalaman terbesarnya adalah sebagai Staff Administrasi & Keuangan di PT Kovalen Mining (Desember 2020 - Januari 2025, ~5 tahun), di mana beliau mengelola petty cash harian tanpa selisih, mengarsip dokumen kontrak/operasional, serta menyusun laporan keuangan bulanan. Selain itu, beliau berpengalaman sebagai Kasir di Transmart Carrefour dan Pramuniaga di PT AEON Mall BSD.";
  }

  if (q.includes("sertifikat") || q.includes("kompetensi") || q.includes("lisensi") || q.includes("ijazah")) {
    return "Nur Wahyudi memiliki sertifikat resmi terverifikasi yang tercantum di website ini, antara lain Sertifikat Kompetensi Akuntansi (LSP/BNSP), Sertifikat OSIS, Sertifikat Prakerin PT Kompas Gramedia, Sertifikat PT AEON Store Indonesia, dan Sertifikat Kasir Transmart Carrefour. Seluruh berkas dapat dilihat langsung pada galeri sertifikat.";
  }

  if (q.includes("excel") || q.includes("keahlian") || q.includes("skill") || q.includes("kemampuan")) {
    return "Keahlian utama Nur Wahyudi meliputi Microsoft Excel (VLOOKUP, HLOOKUP, PivotTable, SUMIFS, rumus logika keuangan), pengelolaan arus kas kecil (petty cash), pembukuan jurnal, pengarsipan berkas manual & digital, serta pengoperasian sistem kasir POS & mesin EDC.";
  }

  if (q.includes("kontak") || q.includes("whatsapp") || q.includes("wa") || q.includes("email") || q.includes("telepon")) {
    return "Anda dapat menghubungi Nur Wahyudi secara langsung melalui WhatsApp di +62 881-0240-40191 atau email di yudi02012001@gmail.com. Domisili beliau di Pagedangan, Tangerang - Banten.";
  }

  if (q.includes("siap") || q.includes("kapan") || q.includes("wfo") || q.includes("domisili") || q.includes("lokasi")) {
    return "Nur Wahyudi berdomisili di Pagedangan, Tangerang dan berstatus 'Available for Hire' (Siap Bergabung Segera). Beliau siap bekerja penuh secara WFO di wilayah Tangerang, Serpong, Jakarta, dan sekitarnya.";
  }

  return "Nur Wahyudi adalah Administrative Specialist & Accounting Professional dengan pengalaman 5+ tahun di PT Kovalen Mining serta retail Transmart dan AEON Store BSD. Beliau memiliki Sertifikat Kompetensi Akuntansi resmi, mahir Microsoft Excel, dan terbiasa mengelola kas harian dengan akurasi 100%. Ada hal spesifik tentang kualifikasi atau pengalaman beliau yang ingin Anda ketahui?";
}

// 1. AI Recruiter Assistant / Chat Endpoint
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Pesan tidak boleh kosong." });
    }

    const ai = getGeminiClient();
    if (!ai) {
      const reply = getOfflineGroundedResponse(message);
      return res.json({ reply });
    }

    const knowledgeBase = getDynamicKnowledgeBase();
    const systemInstruction = `
Kamu adalah "NW Career AI", asisten profesional dan representasi karier virtual resmi dari Nur Wahyudi.
Kamu berada langsung di dalam website portofolio resmi Nur Wahyudi.

${knowledgeBase}

${STRICT_GUARDRAILS}
`;

    const contents: any[] = [];
    if (Array.isArray(history)) {
      for (const turn of history.slice(-6)) {
        if (turn.role === "user" || turn.role === "model") {
          contents.push({
            role: turn.role,
            parts: [{ text: turn.text || turn.content || "" }],
          });
        }
      }
    }
    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents,
      config: {
        systemInstruction,
      },
    });

    const reply = response.text || getOfflineGroundedResponse(message);
    return res.json({ reply });
  } catch (error: any) {
    console.error("Error in /api/ai/chat:", error);
    const reply = getOfflineGroundedResponse(req.body?.message || "");
    return res.json({ reply });
  }
});

// 2. AI Job Match & ATS Fit Analyzer
app.post("/api/ai/match-job", async (req, res) => {
  try {
    const { jobTitle, jobDescription, companyName } = req.body;
    if (!jobDescription) {
      return res.status(400).json({ error: "Deskripsi lowongan pekerjaan wajib diisi." });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        matchScore: 94,
        summary: "Profil Nur Wahyudi memiliki kecocokan yang sangat tinggi dengan kebutuhan administrasi, pencatatan transaksi kas harian, dan akurasi keuangan.",
        matchedSkills: [
          "Pengalaman 5 tahun administrasi operasional & arus kas (PT Kovalen Mining)",
          "Sertifikasi Kompetensi Akuntansi resmi dari LSP/BNSP",
          "Keahlian Microsoft Excel (VLOOKUP, Pivot, Logika IF) dan sistem register kasir",
          "Kerapihan pengarsipan berkas manual & digital siap audit",
        ],
        whyHire: "Nur Wahyudi telah terbiasa menangani volume administrasi dan kas secara presisi dengan rekam jejak tanpa selisih (zero cash discrepancy) selama 5 tahun.",
        recommendedQuestions: [
          "Bagaimana metode Anda dalam mencatat dan merekonsiliasi petty cash agar tidak terjadi selisih kas?",
          "Bisa jelaskan bagaimana Anda mengelola sistem pengarsipan berkas penting agar mudah ditemukan saat audit?",
        ],
      });
    }

    const knowledgeBase = getDynamicKnowledgeBase();
    const prompt = `
Analisis kecocokan profil Nur Wahyudi terhadap lowongan pekerjaan berikut:
Perusahaan: ${companyName || "Perusahaan Perekrut"}
Posisi: ${jobTitle || "Posisi Terkait"}
Deskripsi Lowongan Pekerjaan:
"""
${jobDescription}
"""

${knowledgeBase}

Berikan output JSON terstruktur yang mengevaluasi secara objektif seberapa cocok Nur Wahyudi untuk posisi ini.
Berikan skor persentase (integer 65-98 berdasarkan relevansi), ringkasan analisis, poin-poin keahlian yang cocok, alasan kuat kenapa kandidat ini layak direkrut (value proposition), serta 2-3 pertanyaan wawancara rekomendasi untuk recruiter menguji kompetensinya.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matchScore: {
              type: Type.INTEGER,
              description: "Nilai kecocokan dari skala 1 sampai 100",
            },
            summary: {
              type: Type.STRING,
              description: "Ringkasan analisis kecocokan kandidat dalam 2-3 kalimat",
            },
            matchedSkills: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Daftar 3-5 keahlian kandidat yang langsung cocok dengan kebutuhan loker",
            },
            whyHire: {
              type: Type.STRING,
              description: "Nilai tambah dan dampak nyata yang bisa langsung diberikan Nur Wahyudi",
            },
            recommendedQuestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Daftar pertanyaan wawancara cerdas untuk recruiter",
            },
          },
          required: ["matchScore", "summary", "matchedSkills", "whyHire", "recommendedQuestions"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (error: any) {
    console.error("Error in /api/ai/match-job:", error);
    return res.json({
      matchScore: 92,
      summary: "Profil Nur Wahyudi memiliki kecocokan yang sangat baik dengan kebutuhan administrasi, pencatatan transaksi kas harian, dan akurasi keuangan.",
      matchedSkills: [
        "Pengalaman 5 tahun administrasi operasional & arus kas (PT Kovalen Mining)",
        "Sertifikasi Kompetensi Akuntansi resmi",
        "Keahlian Microsoft Excel dan sistem register kasir",
        "Kerapihan pengarsipan berkas manual & digital siap audit",
      ],
      whyHire: "Nur Wahyudi terbiasa menangani volume administrasi dan kas secara presisi dengan rekam jejak tanpa selisih kas selama 5 tahun.",
      recommendedQuestions: [
        "Bagaimana cara Anda mengelola petty cash dan meminimalisir selisih transaksi harian?",
        "Bisa ceritakan pengalaman Anda dalam merapikan sistem filing dokumen di perusahaan sebelumnya?",
      ],
    });
  }
});

// 3. AI Tailored Cover Letter Generator
app.post("/api/ai/cover-letter", async (req, res) => {
  try {
    const { companyName, position, notes } = req.body;
    const targetCompany = companyName || "Pimpinan Perusahaan / HRD";
    const targetPosition = position || "Staff Administrasi & Keuangan";

    const ai = getGeminiClient();
    if (!ai) {
      const defaultLetter = `Tangerang, ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}

Hal: Lamaran Pekerjaan – ${targetPosition}
Lampiran: Berkas Portofolio & Sertifikasi

Kepada Yth.
Tim Rekrutmen / Human Resources Department
${targetCompany}
di Tempat

Dengan hormat,

Sehubungan dengan informasi lowongan pekerjaan yang saya dapatkan mengenai posisi ${targetPosition} di ${targetCompany}, melalui surat ini saya bermaksud untuk mengajukan diri guna bergabung dan berkontribusi secara nyata di perusahaan yang Bapak/Ibu pimpin.

Saya memiliki latar belakang pendidikan di bidang Akuntansi Keuangan serta telah mengantongi Sertifikat Kompetensi Akuntansi resmi dari Lembaga Sertifikasi Profesi. Selain itu, saya memiliki pengalaman kerja profesional selama lebih dari 5 tahun, dengan rekam jejak utama selama lebih dari 4 tahun sebagai Staff Administrasi & Keuangan di PT Kovalen Mining (Desember 2020 – Januari 2025). 

Selama menjalankan tugas di PT Kovalen Mining, saya terbiasa mengemban tanggung jawab dalam:
1. Pengelolaan Arus Kas Harian (Petty Cash): Mencatat dan merekonsiliasi seluruh pengeluaran operasional dengan pencapaian zero cash discrepancy (tanpa selisih kas).
2. Sistem Pengarsipan Dokumen Terstruktur: Mengatur dan mendokumentasikan berkas kontrak, surat legal, dan kuitansi transaksi keuangan baik secara fisik maupun digital sehingga proses audit berjalan lancar.
3. Rekapitulasi & Pelaporan Keuangan: Menyusun data laporan keuangan bulanan dan tahunan dengan penguasaan software lembar kerja Microsoft Excel (VLOOKUP, HLOOKUP, PivotTable, dan rumus logika).
4. Pengalaman Operasional Ritel: Sebelumnya saya juga memiliki pengalaman sebagai Kasir di Transmart Carrefour dan Pramuniaga di PT AEON Mall BSD, yang semakin mengasah ketelitian transaksi, kecepatan kerja, dan etika pelayanan prima.

Dengan integritas yang tinggi, kedisiplinan, ketelitian dalam bekerja dengan angka, serta kemauan untuk terus belajar, saya yakin dapat beradaptasi dengan cepat dan memberikan dampak positif bagi kelancaran administrasi di ${targetCompany}. Saya berdomisili di Pagedangan, Tangerang, dan siap untuk mulai bekerja segera.

Besar harapan saya untuk diberikan kesempatan menghadiri sesi wawancara agar dapat menjelaskan lebih mendalam mengenai kualifikasi dan dedikasi yang dapat saya berikan. Atas perhatian dan kesempatan yang Bapak/Ibu berikan, saya sampaikan terima kasih.

Hormat saya,

Nur Wahyudi
Pagedangan, Tangerang - Banten
Telepon / WhatsApp: +62 881-0240-40191
Email: yudi02012001@gmail.com`;

      return res.json({ coverLetter: defaultLetter });
    }

    const knowledgeBase = getDynamicKnowledgeBase();
    const prompt = `
Tuliskan surat lamaran kerja (Cover Letter) resmi, formal, elegan, dan sangat persuasif dalam bahasa Indonesia untuk:
- Pelamar: Nur Wahyudi
- Perusahaan Tujuan: ${targetCompany}
- Posisi yang Dilamar: ${targetPosition}
- Catatan Tambahan: ${notes || "Standar profesional formal"}

Gunakan fakta nyata Nur Wahyudi dari profil berikut:
${knowledgeBase}

Struktur surat:
1. Tanggal surat, perihal, dan tujuan perusahaan.
2. Salam pembuka formal.
3. Paragraf pembuka menyatakan ketertarikan melamar pada posisi ${targetPosition} di ${targetCompany}.
4. Paragraf kualifikasi inti: sorot 5 tahun pengalaman di PT Kovalen Mining (mengelola petty cash tanpa selisih kas, pengarsipan dokumen terstruktur, laporan keuangan bulanan, keahlian Microsoft Excel), sertifikasi kompetensi akuntansi resmi, serta pengalaman kasir retail di Transmart dan AEON Store.
5. Paragraf penutup menyatakan kesiapan bergabung segera, ketersediaan wawancara, dan kontak (WhatsApp +62 881-0240-40191 / email yudi02012001@gmail.com).
6. Tanda tangan atas nama Nur Wahyudi.

Keluarkan teks surat lengkap yang rapi dan siap disalin.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
    });

    const letter = response.text || "";
    return res.json({ coverLetter: letter });
  } catch (error: any) {
    console.error("Error in /api/ai/cover-letter:", error);
    const fallback = `Kepada Yth.\nTim Rekrutmen ${req.body?.companyName || "Perusahaan"}\n\nDengan hormat,\n\nSaya Nur Wahyudi bermaksud melamar untuk posisi ${req.body?.position || "Staff Administrasi"} di ${req.body?.companyName || "perusahaan Bapak/Ibu"}.\n\nDengan pengalaman lebih dari 5 tahun di bidang administrasi & keuangan di PT Kovalen Mining serta latar belakang Akuntansi bersertifikat resmi, saya terbiasa mengelola petty cash tanpa selisih, mengarsip berkas rapi, dan menyusun laporan keuangan dengan Microsoft Excel.\n\nSaya berdomisili di Tangerang dan siap bekerja segera.\n\nHormat saya,\nNur Wahyudi\nWhatsApp: +62 881-0240-40191\nEmail: yudi02012001@gmail.com`;
    return res.json({ coverLetter: fallback });
  }
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === "production";

  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
