export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  category: "Akuntansi" | "Organisasi" | "Retail & Magang" | "Pelayanan";
  year: string;
  url: string;
  description: string;
  skillsHighlighted: string[];
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  duration: string;
  location: string;
  category: "administrasi" | "retail";
  description: string;
  achievements: string[];
  responsibilities: string[];
  skills: string[];
}

export const PROFILE_INFO = {
  name: "Nur Wahyudi",
  shortName: "Yudi",
  title: "Administrative Specialist & Accounting Professional",
  summary: "Profesional administrasi dan akuntansi dengan lebih dari 5 tahun pengalaman di industri pertambangan (PT Kovalen Mining) dan retail terkemuka (Transmart Carrefour & AEON Store). Terbiasa mengelola arus kas harian, rekonsiliasi keuangan, pembukuan presisi, serta pengarsipan berkas terstruktur dengan integritas dan akurasi tinggi.",
  location: "Pagedangan, Tangerang - Banten",
  phone: "+62 881-0240-40191",
  whatsappNumber: "62881024040191",
  email: "yudi02012001@gmail.com",
  photoUrl: "https://i.ibb.co.com/tT5jSqmj/Nur-Wahyudi.jpg",
  status: "Tersedia untuk Peluang Kerja (Ready to Hire)",
  education: "SMK / Kejuruan Akuntansi Keuangan (Bersertifikat Kompetensi)",
};

export const CERTIFICATES: Certificate[] = [
  {
    id: "cert-akuntansi",
    name: "Sertifikat Kompetensi Akuntansi",
    issuer: "Badan Nasional Sertifikasi / Lembaga Sertifikasi Profesi",
    category: "Akuntansi",
    year: "Terverifikasi",
    url: "https://i.ibb.co.com/v4RWFG4F/Sertifikat-Competensi-page-0001.jpg",
    description: "Sertifikasi resmi kompetensi keahlian akuntansi meliputi pencatatan jurnal, penyusunan buku besar, siklus akuntansi perusahaan dagang/jasa, dan pembuatan laporan keuangan sesuai standar.",
    skillsHighlighted: ["Siklus Akuntansi", "Buku Besar & Jurnal", "Rekonsiliasi Kas", "Kepatuhan Finansial"]
  },
  {
    id: "cert-osis",
    name: "Sertifikat Organisasi (Pengurus OSIS)",
    issuer: "Organisasi Siswa Intra Sekolah (OSIS)",
    category: "Organisasi",
    year: "Terverifikasi",
    url: "https://i.ibb.co.com/VYFC0gMJ/Sertifikat-OSIS-Nur-Wahyudi-page-0001.jpg",
    description: "Penghargaan keaktifan dan dedikasi dalam kepengurusan organisasi sekolah, membuktikan kepemimpinan, integritas, etika komunikasi, dan kemampuan koordinasi antar divisi.",
    skillsHighlighted: ["Kepemimpinan", "Kerja Sama Tim", "Manajemen Kegiatan", "Etika Komunikasi"]
  },
  {
    id: "cert-gramedia",
    name: "Sertifikat Prakerin PT Kompas Gramedia",
    issuer: "PT Kompas Gramedia",
    category: "Retail & Magang",
    year: "Terverifikasi",
    url: "https://i.ibb.co.com/wZpZ0tBQ/Sertifikat-PT-KOMPAS-GRAMEDIA-page-0001.jpg",
    description: "Sertifikat pelaksanaan praktik kerja industri di jaringan retail penerbitan terbesar di Indonesia, mencakup administrasi gudang, inventaris buku, dan pelayanan pelanggan.",
    skillsHighlighted: ["Administrasi Gudang", "Stock Control", "Pelayanan Pelanggan", "Etos Kerja Industri"]
  },
  {
    id: "cert-aeon",
    name: "Sertifikat PT AEON Store Indonesia",
    issuer: "PT AEON Store Indonesia",
    category: "Retail & Magang",
    year: "Terverifikasi",
    url: "https://i.ibb.co.com/ZR6n6TF9/Sertifikat-PT-AEON-STORE-INDONESIA-page-0001.jpg",
    description: "Sertifikat pengalaman kerja di jaringan ritel multinasional Jepang dengan penekanan pada standar pelayanan prima, ketertiban visual merchandising, dan kepatuhan SOP.",
    skillsHighlighted: ["Standar SOP Retail Jepang", "Visual Merchandising", "Inventory Control", "Customer Service"]
  },
  {
    id: "cert-transmart",
    name: "Sertifikat PT Trans Retail Indonesia (Transmart)",
    issuer: "PT Trans Retail Indonesia (Transmart Carrefour)",
    category: "Pelayanan",
    year: "Terverifikasi",
    url: "https://i.ibb.co.com/Q7FD6tRD/Sertifikat-PT-Trans-Retail-Indonesia-page-0001.jpg",
    description: "Sertifikat profesional sebagai Kasir (Cashier) yang memproses volume transaksi harian tinggi dengan rekam jejak akurasi penutupan kas tanpa selisih.",
    skillsHighlighted: ["Akurasi Kasir & EDC", "Laporan Register Kas", "Ketelitian Zero-Discrepancy", "Kecepatan Transaksi"]
  }
];

export const EXPERIENCES: Experience[] = [
  {
    id: "exp-kovalen",
    company: "PT KOVALEN MINING",
    role: "Administrative & Finance Staff",
    period: "Des 2020 - Jan 2025",
    duration: "4 Tahun 2 Bulan (~5 Tahun)",
    location: "Indonesia",
    category: "administrasi",
    description: "Bertanggung jawab atas pengelolaan administrasi harian, pengawasan arus kas kecil (petty cash), dan koordinasi dokumen operasional pada perusahaan pertambangan.",
    responsibilities: [
      "Mengelola pencatatan arus kas keluar-masuk harian dan menyiapkan pertanggungjawaban petty cash operasional.",
      "Menyusun dan merapikan arsip dokumen legal, surat dinas, nota transaksi, dan perjanjian kontrak agar mudah diakses saat audit.",
      "Membantu verifikasi faktur tagihan supplier dan menyiapkan data untuk laporan keuangan bulanan dan tahunan.",
      "Berkoordinasi dengan tim operasional lapangan dan manajemen kantor pusat untuk sinkronisasi kebutuhan administratif."
    ],
    achievements: [
      "Mempertahankan rekam jejak tanpa selisih kas (zero cash discrepancy) pada pencatatan kas kecil selama bertahun-tahun.",
      "Mengoptimalkan sistem pengarsipan berkas manual dan digital sehingga waktu pencarian berkas dipersingkat hingga 50%."
    ],
    skills: ["Petty Cash Management", "Pengarsipan Dokumen", "Laporan Keuangan", "Microsoft Excel", "Rekonsiliasi Transaksi"]
  },
  {
    id: "exp-transmart",
    company: "TRANSMART CARREFOUR (PT Trans Retail Indonesia)",
    role: "Cashier",
    period: "Jan 2020 - Mar 2020",
    duration: "3 Bulan",
    location: "Tangerang, Banten",
    category: "retail",
    description: "Mengoperasikan terminal POS kasir untuk melayani pembayaran ratusan transaksi harian dengan standar kecepatan, ketelitian kasir, dan keramahan pelayanan retail modern.",
    responsibilities: [
      "Memproses pembayaran tunai, kartu debit/kredit, voucher, dan QRIS dengan teliti dan cepat.",
      "Menghitung fisik uang kas pada awal dan akhir shift kerja serta mencetak laporan register penutupan kas.",
      "Memberikan pelayanan pelanggan prima sesuai standar SOP Transmart Carrefour."
    ],
    achievements: [
      "Mencapai target closing harian dengan balance akurat tanpa minus/selisih uang kas.",
      "Mendapat umpan balik positif dari supervisor atas ketelitian dan keramahan dalam menangani antrean jam sibuk."
    ],
    skills: ["POS Cash Register", "Penghitungan Uang Fisik", "EDC & Digital Payment", "Customer Satisfaction"]
  },
  {
    id: "exp-aeon",
    company: "PT AEON MALL BSD (PT AEON Store Indonesia)",
    role: "Pramuniaga (Sales & Store Associate)",
    period: "Apr 2019 - Nov 2019",
    duration: "8 Bulan",
    location: "BSD City, Tangerang",
    category: "retail",
    description: "Melayani pengunjung mall, menata tampilan barang di rak penjualan sesuai standar merchandising ritel Jepang, dan menjaga ketersediaan stok produk.",
    responsibilities: [
      "Menyambut dan membantu pelanggan dalam menemukan kebutuhan produk secara informatif dan bersahabat.",
      "Menata display barang dagangan (visual merchandising) agar menarik, bersih, dan sesuai tata letak promosi.",
      "Melakukan pengecekan tanggal kedaluwarsa, stock opname berkala, dan input barang masuk."
    ],
    achievements: [
      "Konsisten menjaga kerapihan area penjualan dan kepatuhan standar 5S retail Jepang AEON.",
      "Membantu meningkatkan penjualan produk promo melalui pendekatan proaktif kepada pelanggan."
    ],
    skills: ["Visual Merchandising", "Stock Opname", "Pelayanan Pelanggan Jepang (Omotenashi)", "Inventory Tracking"]
  }
];

export const SKILL_CATEGORIES = [
  {
    category: "Administrasi & Akuntansi",
    items: [
      { name: "Pengelolaan Petty Cash & Arus Kas", level: "Mahir" },
      { name: "Penyusunan Jurnal & Buku Besar", level: "Kompeten" },
      { name: "Rekonsiliasi Bank & Transaksi", level: "Kompeten" },
      { name: "Penyusunan Laporan Keuangan Bulanan", level: "Kompeten" },
      { name: "Siklus Akuntansi Perusahaan", level: "Kompeten" }
    ]
  },
  {
    category: "Perangkat & Digital Tools",
    items: [
      { name: "Microsoft Excel (VLOOKUP, Pivot, Rumus Logika)", level: "Mahir" },
      { name: "Microsoft Word & Korespondensi Bisnis", level: "Mahir" },
      { name: "Sistem Kasir POS & Mesin EDC", level: "Mahir" },
      { name: "Google Workspace (Drive, Docs, Sheets)", level: "Mahir" },
      { name: "Pengarsipan Digital (Cloud & Folder Server)", level: "Mahir" }
    ]
  },
  {
    category: "Operasional & Retail",
    items: [
      { name: "Pelayanan Konsumen (Service Excellence)", level: "Mahir" },
      { name: "Stock Opname & Kontrol Persediaan", level: "Kompeten" },
      { name: "Visual Merchandising Display", level: "Kompeten" },
      { name: "Pengarsipan Berkas Fisik (Filing System)", level: "Mahir" }
    ]
  },
  {
    category: "Karakter & Etos Kerja",
    items: [
      { name: "Ketelitian & Presisi Tinggi (Zero Error)", level: "Karakter Utama" },
      { name: "Integritas & Kejujuran Finansial", level: "Karakter Utama" },
      { name: "Disiplin Waktu & Tanggung Jawab", level: "Karakter Utama" },
      { name: "Daya Tahan Kerja di Bawah Tekanan", level: "Karakter Utama" }
    ]
  }
];

export const SLIDES_PRESENTATION = [
  {
    id: 1,
    title: "Profil & Pembuka",
    speechText: "Halo, salam kenal. Saya Nur Wahyudi, seorang profesional di bidang administrasi dan akuntansi. Terima kasih telah menyempatkan waktu untuk meninjau portofolio karier saya.",
    heading: "Profil Nur Wahyudi",
    subheading: "Administrative Specialist & Accounting Professional",
    highlight: "Berpengalaman 5+ Tahun di Industri Pertambangan & Retail Modern"
  },
  {
    id: 2,
    title: "Visi & Etos Kerja",
    speechText: "Bagi saya, akuntansi dan administrasi bukan sekadar mencatat angka, melainkan memastikan denyut nadi perusahaan berjalan tertib, aman, dan tanpa selisih.",
    heading: "Executive Summary",
    subheading: "Komitmen Ketelitian dan Integritas Penuh",
    highlight: "Ketelitian Tinggi · Zero Discrepancy · Pengarsipan Rapi"
  },
  {
    id: 3,
    title: "PT Kovalen Mining",
    speechText: "Di PT Kovalen Mining, saya dipercaya selama lebih dari 4 tahun mengelola arus kas harian, dokumen legal, serta rekonsiliasi pengeluaran operasional perusahaan tambang.",
    heading: "PT Kovalen Mining (Des 2020 - Jan 2025)",
    subheading: "Staff Administrasi & Keuangan",
    highlight: "5 Tahun Rekam Jejak Arus Kas & Pengarsipan Dokumen Tambang"
  },
  {
    id: 4,
    title: "Transmart Carrefour",
    speechText: "Sebelumnya di Transmart Carrefour, saya bertugas sebagai kasir yang memproses ratusan transaksi per hari dengan rekam jejak zero discrepancy pada saat closing register.",
    heading: "Transmart Carrefour (Jan 2020 - Mar 2020)",
    subheading: "Cashier",
    highlight: "Akurasi Penutupan Kas Harian & Kecepatan Layanan"
  },
  {
    id: 5,
    title: "PT AEON Mall BSD",
    speechText: "Pengalaman saya di PT AEON Mall BSD melatih disiplin visual merchandising, stock opname, dan standar keramahan pelayanan ritel berstandar Jepang.",
    heading: "PT AEON Mall BSD (Apr 2019 - Nov 2019)",
    subheading: "Pramuniaga",
    highlight: "Standar Pelayanan Jepang & Manajemen Stok"
  },
  {
    id: 6,
    title: "Sertifikasi Resmi",
    speechText: "Seluruh kompetensi saya didukung bukti fisik 5 sertifikat resmi, termasuk Sertifikat Kompetensi Akuntansi dan pengalaman di institusi terpercaya.",
    heading: "Sertifikat Keahlian Resmi",
    subheading: "5 Dokumen Terverifikasi",
    highlight: "Sertifikat Kompetensi Akuntansi, OSIS, Gramedia, AEON, & Transmart"
  },
  {
    id: 7,
    title: "Siap Bergabung Segera",
    speechText: "Saya berdomisili di Tangerang dan siap bergabung secepatnya untuk memberikan kontribusi nyata bagi kesuksesan perusahaan Bapak atau Ibu. Hubungi saya melalui WhatsApp.",
    heading: "Mari Berkolaborasi",
    subheading: "Tersedia untuk Sesi Wawancara",
    highlight: "WhatsApp: +62 881-0240-40191 · yudi02012001@gmail.com"
  }
];
