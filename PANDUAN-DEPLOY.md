# Panduan Deploy Web Sisi Kreatif (Gratis, Tanpa Coding)

Panduan ini mengasumsikan Anda tidak punya pengalaman teknis sama sekali. Ikuti dari atas ke bawah, jangan lompat.

**Yang akan Anda pakai (semua gratis):**
- **Supabase** — tempat menyimpan data layanan + sistem login admin
- **Netlify** — tempat web Anda "tinggal" di internet (hosting)

Total waktu: sekitar 30–45 menit untuk pertama kali.

---

## Langkah 1 — Siapkan folder project

1. Download semua file yang saya buatkan (folder `sisikreatif`).
2. Simpan folder itu di tempat yang mudah Anda temukan, misalnya di Desktop.
3. Pastikan isinya seperti ini:
   ```
   sisikreatif/
     index.html
     admin.html
     supabase-setup.sql
     css/style.css
     js/main.js
     js/admin.js
     js/supabase-client.js
   ```

Jangan ubah nama file atau struktur foldernya — biarkan seperti ini.

---

## Langkah 2 — Buat backend di Supabase (database + login admin)

### 2.1 Daftar akun
1. Buka **https://supabase.com** di browser.
2. Klik **"Start your project"**.
3. Daftar pakai akun Google atau email Anda (gratis, tidak perlu kartu kredit).

### 2.2 Buat project baru
1. Setelah masuk ke dashboard, klik **"New project"**.
2. Isi:
   - **Name**: `sisikreatif` (bebas)
   - **Database Password**: buat password baru, **simpan di catatan** — ini bukan password login admin Anda, hanya untuk keamanan database.
   - **Region**: pilih yang terdekat, misal **Southeast Asia (Singapore)**.
3. Klik **"Create new project"**. Tunggu 1–2 menit sampai project selesai dibuat.

### 2.3 Buat tabel layanan
1. Di sidebar kiri, klik ikon **"SQL Editor"**.
2. Klik **"New query"**.
3. Buka file `supabase-setup.sql` yang saya buatkan, **copy semua isinya**.
4. **Paste** ke SQL Editor di Supabase.
5. Klik tombol **"Run"** (atau tekan Ctrl+Enter).
6. Harus muncul tulisan **"Success. No rows returned"** — artinya tabel berhasil dibuat.

### 2.4 Buat akun login admin (untuk Anda sendiri)
1. Di sidebar kiri, klik **"Authentication"**.
2. Klik tab **"Users"**, lalu klik **"Add user"** → **"Create new user"**.
3. Isi:
   - **Email**: email yang akan Anda pakai untuk login ke halaman admin (boleh `sisikreatif_gsk@gmail.com`)
   - **Password**: buat password khusus untuk login admin, **simpan baik-baik**.
   - Centang **"Auto Confirm User"** supaya tidak perlu verifikasi email.
4. Klik **"Create user"**.

Ini adalah email + password yang nanti Anda pakai untuk login di `admin.html`.

### 2.5 Ambil URL dan Anon Key project
1. Di sidebar kiri, klik ikon **gerigi (Project Settings)**.
2. Klik **"API"** (atau **"Data API"**).
3. Anda akan melihat dua nilai penting:
   - **Project URL** — contoh: `https://abcxyz.supabase.co`
   - **anon public key** — deretan huruf/angka panjang
4. Copy keduanya, Anda akan pakai di langkah berikutnya.

---

## Langkah 3 — Sambungkan web ke Supabase

1. Buka folder `sisikreatif` di komputer Anda.
2. Buka folder `js`, lalu buka file **`supabase-client.js`** menggunakan Notepad (Windows) atau TextEdit (Mac) — klik kanan file → **Open with** → pilih aplikasi teks biasa.
3. Anda akan melihat:
   ```js
   const SUPABASE_URL = "GANTI_DENGAN_PROJECT_URL_ANDA";
   const SUPABASE_ANON_KEY = "GANTI_DENGAN_ANON_KEY_ANDA";
   ```
4. Ganti bagian di antara tanda kutip `" "` dengan **Project URL** dan **anon public key** yang Anda copy di langkah 2.5. Hasilnya kurang lebih seperti:
   ```js
   const SUPABASE_URL = "https://abcxyz.supabase.co";
   const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
   ```
5. **Simpan file** (Ctrl+S / Cmd+S).

---

## Langkah 4 — Deploy ke internet dengan Netlify

Ini adalah bagian yang membuat web Anda bisa diakses siapa saja lewat link.

1. Buka **https://app.netlify.com/drop** di browser.
2. Jika diminta, daftar/login (bisa pakai akun Google, gratis).
3. Anda akan melihat kotak besar bertuliskan **"Drag and drop your site output folder here"**.
4. Buka folder tempat Anda menyimpan project (misal Desktop), lalu **drag (seret) folder `sisikreatif`** langsung ke kotak tersebut.
5. Tunggu beberapa detik — Netlify akan otomatis meng-upload dan mempublikasikan web Anda.
6. Anda akan mendapat link acak, contoh: `https://random-name-12345.netlify.app` — **web Anda sudah LIVE di internet!**

### (Opsional) Ganti nama link jadi lebih rapi
1. Di dashboard Netlify, klik project Anda.
2. Klik **"Site configuration"** → **"Change site name"**.
3. Ganti jadi misalnya `sisikreatif` → link menjadi `https://sisikreatif.netlify.app`.

### (Opsional) Pakai domain sendiri (misal sisikreatif.com)
Kalau nanti Anda beli domain sendiri, di Netlify buka **"Domain management"** → **"Add a domain"**, lalu ikuti instruksi yang muncul untuk mengarahkan domain Anda ke Netlify.

---

## Langkah 5 — Coba web Anda

1. Buka link Netlify Anda (contoh: `https://sisikreatif.netlify.app`) — ini halaman yang dilihat calon klien.
2. Tambahkan `/admin.html` di belakang link, contoh: `https://sisikreatif.netlify.app/admin.html`.
3. Login pakai email & password yang Anda buat di Langkah 2.4.
4. Coba **tambah satu layanan** lewat form di kiri.
5. Buka lagi halaman utama (tanpa `/admin.html`) — layanan yang baru Anda tambahkan harus muncul di bagian "Layanan".

Selamat — web Anda sudah bisa dipakai untuk jualan jasa secara online.

---

## Cara pakai sehari-hari

- **Tambah/edit/hapus jasa**: buka `[link-anda]/admin.html`, login, kelola dari situ. Perubahan langsung muncul di halaman utama, tidak perlu upload ulang.
- **Update tampilan (warna, teks, logo)**: edit file HTML/CSS di komputer Anda, lalu drag & drop ulang folder `sisikreatif` ke https://app.netlify.com/drop menimpa yang lama (atau saya bisa bantu edit lalu Anda upload ulang).
- **Lupa password admin**: buka Supabase → Authentication → Users → klik user Anda → reset password.

---

## Kalau ada yang error

- **Layanan tidak muncul di halaman utama**: cek kembali `js/supabase-client.js`, pastikan URL dan key sudah benar (tanpa spasi tambahan) dan sudah disimpan sebelum di-upload ke Netlify.
- **Tidak bisa login di admin**: pastikan email & password sama persis dengan yang dibuat di Supabase → Authentication → Users, dan "Auto Confirm User" sudah dicentang saat membuatnya.
- **Ingin ganti isi/tampilan**: tinggal balik lagi ke chat ini dan minta saya ubah, nanti saya kasih file baru untuk Anda upload ulang.
