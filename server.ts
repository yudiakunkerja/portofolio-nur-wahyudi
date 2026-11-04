import express from "express";
import { GoogleGenAI, Type } from "@google/genai";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// Contextual Knowledge Base for Nur Wahyudi
const NUR_WAHYUDI_PROFILE = `
Informasi Profil Kandidat:
- Nama Lengkap: Nur Wahyudi
- Domisili: Pagedangan, Tangerang, Banten, Indonesia
- Kontak: WhatsApp +62881024040191 | Email: yudi02012001@gmail.com
- Spesialisasi: Administrative Specialist, Finance & Accounting Assistant, Cashier / Retail Operations Professional
- Pengalaman Kerja:
  1. PT KOVALEN MINING (Desember 2020 - Januari 2025, ~5 tahun)
     - Posisi: Staff Administrasi & Keuangan
     - Tanggung Jawab & Pencapaian:
       * Mengelola arus kas harian (petty cash) dan verifikasi bukti transaksi operasional.
       * Mengatur sistem pengarsipan berkas dokumen penting, kontrak, dan surat-menyurat perusahaan dengan rapi dan terstruktur.
       * Membantu penyusunan laporan keuangan bulanan dan tahunan dengan ketelitian tinggi tanpa selisih.
       * Bekerja sama dengan berbagai divisi internal untuk kelancaran administrasi proyek pertambangan.
  2. TRANSMART CARREFOUR (Januari 2020 - Maret 2020)
     - Posisi: Kasir (Cashier)
     - Tanggung Jawab & Pencapaian:
       * Memproses ratusan transaksi pembayaran tunai, kartu debit/kredit, dan e-wallet per hari dengan zero discrepancy pada closing kasir.
       * Menyusun laporan pertanggungjawaban fisik kas dan register harian.
       * Menerapkan standar pelayanan prima (service excellence) ramah dan cekatan.
  3. PT AEON MALL BSD (April 2019 - November 2019)
     - Posisi: Pramuniaga
     - Tanggung Jawab & Pencapaian:
       * Melayani kebutuhan informasi dan pembelian konsumen secara profesional.
       * Menata visual merchandising display produk sesuai SOP retail Jepang AEON yang ketat.
       * Melakukan stock opname rutin dan kontrol inventaris barang dagangan.
- Pendidikan & Sertifikasi:
  1. Sertifikat Kompetensi Akuntansi (Uji Kompetensi Nasional Akuntansi)
  2. Sertifikat Organisasi Kepengurusan OSIS (Bukti kepemimpinan, integritas, dan kerja tim)
  3. Sertifikat Prakerin PT Kompas Gramedia (Administrasi dan retail)
  4. Sertifikat PT AEON Store Indonesia
  5. Sertifikat PT Trans Retail Indonesia (Transmart Carrefour)
- Keahlian Utama:
  * Akuntansi Dasar & Menengah, Buku Besar, Jurnal, Arus Kas
  * Microsoft Excel (VLOOKUP, HLOOKUP, PivotTable, SUMIFS, Logika IF, Rumus Finansial)
  * Manajemen Dokumen & Pengarsipan Digital/Fisik
  * Pelayanan Pelanggan & Administrasi Perkantoran
  * Ketelitian tingkat tinggi, kejujuran, dan loyalitas kerja
- Status: Siap bekerja segera (Available for Hire / Open to New Opportunities).
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

// 1. AI Recruiter Assistant / Chat Endpoint
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Pesan tidak boleh kosong." });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Fallback answer if no key configured in test environment
      return res.json({
        reply: `Halo! Saya adalah asisten AI profil Nur Wahyudi. Nur Wahyudi adalah spesialis administrasi dan akuntansi berpengalaman 5 tahun di PT Kovalen Mining serta memiliki pengalaman retail di Transmart dan AEON Store BSD. Beliau memiliki Sertifikat Kompetensi Akuntansi resmi dan siap bekerja segera. Silakan hubungi langsung via WhatsApp di 0881024040191.`,
      });
    }

    const systemInstruction = `
Kamu adalah "NW Career AI", asisten profesional dan representasi karier virtual resmi dari Nur Wahyudi.
Gunakan data berikut sebagai fakta dasar:
${NUR_WAHYUDI_PROFILE}

Panduan Berbicara:
- Jawab dengan bahasa Indonesia yang santun, profesional, meyakinkan, ramah, dan percaya diri.
- Selalu sorot bukti konkret: 5 tahun rekam jejak di PT Kovalen Mining, sertifikasi akuntansi kompetensi resmi, keahlian Microsoft Excel, ketelitian kas harian di Transmart/AEON, dan kesiapannya untuk diwawancarai.
- Jika pengguna bertanya tentang kesiapan kerja, sampaikan Nur Wahyudi berdomisili di Pagedangan, Tangerang dan siap bekerja segera (Available for Hire) baik di area Tangerang, Jakarta, maupun sekitarnya.
- Jangan mengarang data yang bertentangan dengan profil di atas.
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

    const reply = response.text || "Terima kasih atas pertanyaannya. Nur Wahyudi siap berdiskusi lebih lanjut melalui WhatsApp.";
    return res.json({ reply });
  } catch (error: any) {
    console.error("Error in /api/ai/chat:", error);
    return res.status(500).json({
      error: "Gagal memproses permintaan AI.",
      details: error?.message,
    });
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
        matchScore: 92,
        summary: "Profil Nur Wahyudi memiliki kecocokan yang sangat tinggi dengan kebutuhan administrasi, pencatatan transaksi, dan akurasi keuangan.",
        matchedSkills: [
          "Pengalaman 5 tahun administrasi operasional & kas harian",
          "Sertifikasi Kompetensi Akuntansi resmi",
          "Keahlian pengarsipan dokumen dan rekonsiliasi data",
          "Kemampuan komunikasi dan pelayanan prima",
        ],
        whyHire: "Nur Wahyudi telah terbiasa menangani volume administrasi dan kas secara presisi tanpa selisih selama 5 tahun di PT Kovalen Mining.",
        recommendedQuestions: [
          "Bagaimana cara Anda mengelola petty cash dan meminimalisir selisih transaksi harian?",
          "Bisa ceritakan pengalaman Anda dalam merapikan sistem filing dokumen di perusahaan sebelumnya?",
        ],
      });
    }

    const prompt = `
Analisis kecocokan profil Nur Wahyudi terhadap lowongan berikut:
Perusahaan: ${companyName || "Perusahaan Perekrut"}
Posisi: ${jobTitle || "Posisi Terkait"}
Deskripsi Lowongan Pekerjaan:
"""
${jobDescription}
"""

Data Kandidat (Nur Wahyudi):
${NUR_WAHYUDI_PROFILE}

Berikan output JSON terstruktur yang mengevaluasi seberapa cocok Nur Wahyudi untuk posisi ini.
Berikan skor persentase (integer 60-98 berdasarkan relevansi), ringkasan analisis yang objektif, poin-poin keahlian yang cocok, alasan kuat kenapa kandidat ini layak direkrut (value proposition), serta 2-3 pertanyaan wawancara rekomendasi untuk recruiter menguji kompetensinya.
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
    return res.status(500).json({
      error: "Gagal menganalisis lowongan pekerjaan.",
      details: error?.message,
    });
  }
});

// 3. AI Tailored Cover Letter Generator
app.post("/api/ai/cover-letter", async (req, res) => {
  try {
    const { companyName, position, notes } = req.body;
    if (!companyName || !position) {
      return res.status(400).json({ error: "Nama perusahaan dan posisi harus diisi." });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        coverLetter: `Yth. Tim Rekrutmen / HRD ${companyName},\n\nMelalui surat ini, saya menyampaikan minat mendalam untuk melamar pada posisi ${position} di ${companyName}. Dengan latar belakang pendidikan Akuntansi bersertifikat resmi serta pengalaman kerja lebih dari 5 tahun sebagai Staff Administrasi di PT Kovalen Mining dan operasional retail di Transmart serta AEON Store, saya yakin dapat memberikan kontribusi nyata bagi tim Anda.\n\nSaya terbiasa bekerja dengan ketelitian tinggi dalam pengelolaan kas harian, rekonsiliasi keuangan, serta pengarsipan dokumen perusahaan secara terstruktur. Saya siap bergabung segera dan sangat menantikan kesempatan untuk berdiskusi lebih lanjut dalam sesi wawancara.\n\nHormat saya,\nNur Wahyudi\nWhatsApp: 0881024040191\nEmail: yudi02012001@gmail.com`,
      });
    }

    const prompt = `
Tuliskan surat lamaran kerja (Cover Letter) resmi dan bernilai persuasif tinggi dalam bahasa Indonesia untuk:
- Pelamar: Nur Wahyudi
- Perusahaan Tujuan: ${companyName}
- Posisi yang Dilamar: ${position}
- Catatan Tambahan dari Recruiter/User: ${notes || "Standar profesional"}

Gunakan data kualifikasi nyata Nur Wahyudi:
${NUR_WAHYUDI_PROFILE}

Susun surat yang elegan, berbobot, langsung to-the-point mengenai pencapaian nyata (5 tahun di PT Kovalen Mining, ketelitian kas tanpa selisih, sertifikat kompetensi akuntansi, etika kerja prima), dan akhiri dengan call-to-action wawancara yang percaya diri serta informasi kontak (WhatsApp 0881024040191 / yudi02012001@gmail.com).
Kembalikan teks surat yang siap disalin atau diunduh.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
    });

    return res.json({ coverLetter: response.text });
  } catch (error: any) {
    console.error("Error in /api/ai/cover-letter:", error);
    return res.status(500).json({
      error: "Gagal membuat surat lamaran.",
      details: error?.message,
    });
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
