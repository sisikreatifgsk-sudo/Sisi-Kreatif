# Panduan Update Web Sisi Kreatif

Ini update besar: warna baru, logo, upload gambar layanan, portofolio, dan review. Ikuti urutan ini supaya tidak ada yang error.

## Langkah 1 — Update database Supabase
1. Buka project Supabase Anda → **SQL Editor** → **New query**.
2. Buka file **`supabase-update-v2.sql`**, copy semua isinya, paste ke SQL Editor.
3. Klik **Run**. Harus muncul "Success".

Ini akan otomatis:
- Menambah kolom gambar ke tabel layanan
- Membuat tabel baru untuk Portofolio dan Review
- Membuat storage bucket bernama **"media"** (tempat menyimpan gambar/video/dokumen yang Anda upload lewat admin) beserta izin aksesnya

## Langkah 2 — Cek bucket storage
1. Di sidebar Supabase, klik **"Storage"**.
2. Pastikan ada bucket bernama **`media`** dengan status **Public**. Kalau dari langkah 1 belum muncul, buat manual: klik **"New bucket"** → nama `media` → aktifkan toggle **Public bucket** → Save.

## Langkah 3 — Isi ulang URL & key Supabase (PENTING)
Folder baru yang saya kirim ini masih pakai file `js/supabase-client.js` kosong (placeholder) — **bukan** file lama Anda yang sudah terisi. Wajib diisi ulang, kalau tidak nanti data tidak muncul:

1. Buka file `js/supabase-client.js` di folder baru.
2. Isi `SUPABASE_URL` dan `SUPABASE_ANON_KEY` dengan nilai yang sama seperti sebelumnya (lihat di Supabase → Project Settings → API, atau lihat file lama di komputer Anda kalau masih ada).
3. Simpan file.

## Langkah 4 — Upload folder baru ke Netlify
1. Setelah folder `sisikreatif` sudah diisi ulang datanya (langkah di atas).
2. Buka **https://app.netlify.com/drop**
3. Drag & drop folder `sisikreatif` — ini akan **menimpa** versi lama di site yang sama (asalkan Anda login ke akun Netlify yang sama seperti sebelumnya, dan drop ke site yang sama).

   Alternatif lebih aman: buka dashboard Netlify → project Anda → tab **"Deploys"** → drag folder ke kotak **"Drag and drop your site output folder here"** di bagian atas halaman itu — ini memastikan yang ter-update adalah site yang sama, bukan bikin site baru.

## Langkah 5 — Cek semuanya jalan
- Buka web Anda → logo & warna baru harus muncul.
- Buka `/admin.html` → login → coba tambah layanan **dengan gambar** → cek muncul di halaman utama dan bisa diklik untuk lihat detail.
- Coba tambah **portofolio** (upload gambar/video/dokumen) → cek muncul di section Portofolio, bisa diklik.
- Coba tambah **review** → cek muncul di section Review.

## Kalau gambar tidak muncul / gagal upload
- Pastikan Langkah 1 dan 2 sudah benar-benar selesai (bucket `media` ada dan Public).
- Pastikan `js/supabase-client.js` masih berisi URL & key Supabase Anda yang benar (tidak berubah dari sebelumnya).
- Ukuran file upload sebaiknya di bawah 5MB per file untuk video/dokumen agar tidak lambat.
