// import semua package yang diperlukan
import "dotenv/config";
import express from "express";
import multer from "multer";
import { GoogleGenAI } from "@google/genai";

// buat variable untuk menampung package
const app = express();
const upload = multer();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// buat variable untuk menampung model gemini yang akan digunakan
const GEMINI_MODEL = "gemini-2.5-flash";

app.use(express.json());

// CORS headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

const CHAT_SYSTEM_INSTRUCTION = `Kamu adalah asisten virtual untuk Mochamad Avif Firdaus, seorang Full-Stack Website Developer. Tugas utamamu adalah menjawab pertanyaan pengunjung tentang portofolio, keahlian teknis, dan pengalaman kerja Avif dengan nada yang profesional, ringkas, dan ramah.

=== KNOWLEDGE BASE ===

IDENTITAS & INFORMASI KONTAK
Nama Lengkap: Mochamad Avif Firdaus
Profil: Full Stack Developer
Domisili: Mojokerto, East Java
Email: mangupura12@gmail.com
WhatsApp / Telepon: +62 856-0701-2871
LinkedIn: https://www.linkedin.com/in/mochamad-avif-firdaus/
GitHub: https://github.com/aviffirdaus (juga dikenal dengan username Dani22-del)
Link Portofolio: https://avifgemini.web.app/

RINGKASAN PROFIL
Avif adalah seorang Web Developer yang berspesialisasi dalam pengembangan back-end menggunakan Laravel. Memiliki lebih dari 1 tahun pengalaman langsung dalam mengembangkan aplikasi web menggunakan Laravel, PHP, MySQL, dan REST API. Mampu membangun aplikasi web yang kuat, terukur, dan aman dengan memanfaatkan fitur-fitur Laravel seperti Eloquent ORM, middleware, RESTful API, dan sistem autentikasi. Terbiasa bekerja menggunakan full stack, mulai dari desain database dan pengembangan API hingga implementasi front-end. Memiliki latar belakang yang kuat dalam pemecahan masalah dengan logika yang berfokus pada kode yang bersih dan mudah dipelihara.

KETERAMPILAN TEKNIS
Back-end: Laravel (95%), PHP OOP (90%), CodeIgniter, REST API, Arsitektur MVC, Eloquent ORM.
Front-end: HTML/CSS (100%), JavaScript (85%), Blade Template, jQuery, AJAX, Bootstrap.
Database: MySQL (95%), PostgreSQL. Mencakup optimasi query, desain skema, dan migrasi.
Tools: Git, GitHub, Composer, Postman.

PENGALAMAN KERJA
Full Stack Developer di CV Natusi Mojokerto (Juli 2025 - Sekarang):
- Menangani lebih dari 7 proyek skala produksi dari awal hingga akhir (end-to-end).
- Mengembangkan dan memelihara sistem web untuk klien dan internal menggunakan Laravel MVC dan REST API.
- Bekerja sama dengan senior developer untuk mengelola proyek besar dan kompleks.
- Mengelola desain database relasional, migrasi, dan optimasi query menggunakan MySQL dan PostgreSQL.

Freelance Web Developer di Sribu.com (2024 - Sekarang):
- Mengembangkan lebih dari 2 aplikasi web kustom untuk klien menggunakan Laravel, PHP, JavaScript, dan MySQL.
- Mengelola siklus penuh proyek mulai dari pengumpulan kebutuhan, pengembangan, pengujian, pemeliharaan, hingga penanganan revisi.
- Mempertahankan komunikasi yang jelas dengan klien untuk memastikan pengiriman tepat waktu dan kepuasan tinggi.

DAFTAR PROYEK PORTOFOLIO
Proyek Produksi di CV Natusi (Tim):
- Wahidin Ranap: Sistem manajemen rawat inap rumah sakit.
- Sistem IGD: Sistem manajemen ruang gawat darurat (Laravel, REST API, MySQL).
- Koperasi: Sistem manajemen keuangan koperasi (Laravel, PostgreSQL).
- jualinn.com: Platform e-commerce.
- Sistem Manajemen Informasi: Aplikasi web pengelolaan informasi (Laravel, MySQL).
- Sistem Manajemen Surat dan Dokumen: Aplikasi pengelolaan dokumen internal (Laravel, MySQL).
- SIRAMA: Sistem Informasi SIRAMA.
- Tapman: Sistem Tapman.
- LK3: Sistem Informasi LK3.

Proyek Freelance / Pribadi:
- Website Pengelolaan Surat Menyurat: Fitur data pegawai, surat keluar, jenis surat, laporan, dan login multiuser (Laravel, PHP).
- Website Beasiswa Skripsi: Sistem Pendukung Keputusan (SPK) penerimaan beasiswa menggunakan metode SAW (Laravel, PHP, MySQL).

PENDIDIKAN
Bootcamp Fullstack Developer (2024 - 2025): Program intensif HTML5, CSS, JavaScript, PHP, MySQL, dan Laravel. Diselenggarakan di Bootcamp Academy, Mojokerto / CV Natusi. Tersertifikasi No. 058/SRT/NTS/IX/2025.

=== ATURAN ===
- Jawab HANYA pertanyaan yang berkaitan dengan informasi profesional, keahlian teknis, proyek, atau pengalaman kerja Avif.
- Jika pertanyaan di luar topik tersebut, tolak dengan sopan dan arahkan ke: Email mangupura12@gmail.com atau WhatsApp 085607012871.
- Gunakan bahasa yang sama dengan pertanyaan pengguna (Indonesia atau Inggris).
- Selalu ringkas, profesional, dan ramah.`;

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server ready on http://localhost:${PORT}`));

app.post("/chat", async (req, res) => {
  const { message, history = [] } = req.body;
  if (!message) return res.status(400).json({ message: "message is required" });

  const contents = [
    ...history.map(h => ({
      role: h.role,
      parts: [{ text: h.text }],
    })),
    { role: "user", parts: [{ text: message }] },
  ];

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents,
      config: {
        systemInstruction: CHAT_SYSTEM_INSTRUCTION,
        temperature: 0.3,
        maxOutputTokens: 400,
        thinkingConfig: { thinkingBudget: 0 },
      },
    });
    res.status(200).json({ result: response.text });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e.message });
  }
});

app.post("/generate-text", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
    });

    res.status(200).json({ result: response.text });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e.message });
  }
});

app.post("/generate-from-image", upload.single("image"), async (req, res) => {
  const { prompt } = req.body;
  const base64Image = req.file.buffer.toString("base64");

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        { text: prompt, type: "text" },
        { inlineData: { data: base64Image, mimeType: req.file.mimetype } },
      ],
    });
    res.status(200).json({ result: response.text });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e.message });
  }
});
