# 🌐 Sanwanay Network - Portal ISP & Management System

![Status](https://img.shields.io/badge/Status-Ready_to_Push-green)
![Node.js](https://img.shields.io/badge/Node.js-v18+-blue)
![Express](https://img.shields.io/badge/Express-v4.x-lightgrey)

**Sanwanay Network** adalah platform web profesional untuk penyedia layanan internet (ISP) lokal yang berfokus melayani wilayah Rajeg, Kemiri, hingga Sukamulya. Website ini dirancang untuk meningkatkan kepercayaan pelanggan melalui tampilan yang modern (Gagah & Elegan) serta memudahkan manajemen pendaftaran pelanggan melalui sistem admin yang terintegrasi.

---

## 📝 Penjelasan Proyek

Website ini bukan hanya sekadar profil perusahaan, melainkan alat bantu operasional untuk Sanwanay Network:
1. **Branding & Edukasi:** Menjelaskan visi dan misi perusahaan untuk membangun kepercayaan warga lokal.
2. **Katalog Layanan:** Menampilkan paket internet Fiber Optic dengan harga transparan.
3. **Konversi Pelanggan:** Mempermudah calon pelanggan melakukan pendaftaran melalui tombol WhatsApp yang responsif.
4. **Dashboard Control:** Memberikan akses bagi admin untuk melihat siapa saja yang sudah mendaftar dan mengelola konten kegiatan perusahaan.

---

## 🚀 Fitur Unggulan

* **Modern Hero Section:** Tampilan header yang mencolok dengan slogan "Internet Cepat Untuk Rajeg".
* **Responsive Layout:** Website otomatis menyesuaikan tampilan saat dibuka di HP, Tablet, maupun Laptop.
* **Interactive Footer:** Dilengkapi link langsung ke TikTok, Instagram, dan lokasi kantor via Google Maps.
* **Admin Dashboard:** Sistem pengelolaan data pendaftar dan log kegiatan yang rapi dan mudah digunakan.
* **Floating Contact:** Tombol WhatsApp yang selalu ada di pojok layar untuk mempermudah komunikasi pelanggan.

---

## 🛠️ Teknologi (Tech Stack)

* **Runtime:** Node.js
* **Framework:** Express.js
* **View Engine:** EJS (Embedded JavaScript)
* **CSS Framework:** Tailwind CSS
* **Database:** SQLite (menggunakan `sqlite3` & `sqlite` wrapper)
* **Auth & Session:** Express-session untuk keamanan halaman admin

---

## ⚙️ Panduan Instalasi (Step-by-Step)

Ikuti langkah berikut untuk menjalankan proyek ini di komputer lokal atau server lu:

### 1. Persiapan Awal
Pastikan lu sudah menginstal **Node.js** dan **Git** di komputer lu.

### 2. Clone Repository
Buka terminal/CMD dan jalankan:
```bash
git clone [https://github.com/username_lu/sanwanay-network.git](https://github.com/username_lu/sanwanay-network.git)
cd sanwanay-network

3. Install Package (Dependencies)

Instal semua library yang dibutuhkan sesuai dengan package.json:
Bash

npm install

4. Konfigurasi Environment (.env)

Buat file baru bernama .env di folder utama (root) dan masukkan kode berikut:
Cuplikan kode

PORT=3000
SESSION_SECRET=sanwanay_rahasia_super
ADMIN_PASSWORD=admin123

5. Inisialisasi Database

Pastikan file database (misal: database.db) sudah ada atau akan dibuat otomatis oleh skrip app.js lu.
6. Jalankan Aplikasi

Gunakan perintah berikut untuk memulai server:
Bash

node app.js

Setelah itu, buka browser dan akses: http://localhost:3000
👨‍💻 Kontribusi

Proyek ini dikembangkan dengan semangat untuk memajukan konektivitas digital di wilayah Rajeg. Jika lu ingin berkontribusi, silakan lakukan Pull Request.
📞 Kontak Hubungi Kami

    Alamat: Jambu Karya, Kec. Rajeg, Tangerang

    WhatsApp: +62 895-6019-54444

    Website: www.sanwanay.net