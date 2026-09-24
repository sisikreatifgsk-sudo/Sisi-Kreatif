# Panduan Update — Keranjang, Checkout & QRIS

Fitur baru: setiap layanan sekarang punya tombol **"+ Keranjang"** dan tombol **WA langsung**, plus bisa checkout dengan pembayaran QRIS (sama seperti web Ayam Geprek — saya pakai QRIS yang sama karena nama merchant-nya "Miftahul Arif, Digital & Kreatif").

## Langkah 1 — Update database
1. Buka Supabase → **SQL Editor** → **New query**.
2. Copy isi file **`supabase-update-v3.sql`**, paste, klik **Run**.
   
   Ini menambah kolom `price_numeric` ke tabel layanan (dipakai untuk menghitung total keranjang).

## Langkah 2 — Isi harga angka di setiap layanan (PENTING)
Kolom harga lama (teks, misal "Mulai dari Rp500.000") tetap dipakai untuk tampilan. Tapi supaya total di keranjang bisa dihitung, Anda perlu isi juga **harga angka**:

1. Buka `/admin.html` → login.
2. Untuk **setiap layanan yang sudah ada**, klik **Edit** → isi field baru **"Harga (angka, untuk keranjang & checkout)"** dengan angka saja, contoh `500000` untuk Rp500.000 → **Simpan perubahan**.
3. Lakukan ini untuk semua layanan. Layanan yang belum diisi harga angkanya akan dihitung Rp0 di keranjang.

## Langkah 3 — Isi ulang Supabase config & upload ke Netlify
Sama seperti update sebelumnya:
1. Isi `js/supabase-client.js` dengan URL & key Supabase Anda.
2. Drag & drop folder `sisikreatif` ke tab **Deploys** di project Netlify Anda (menimpa versi lama).

## Cara kerja untuk pelanggan
1. Klik **"+ Keranjang"** pada layanan yang diinginkan (bisa lebih dari satu, dan ubah jumlah di keranjang).
2. Klik ikon **Keranjang** di kanan atas → **Checkout**.
3. Isi nama → lanjut pembayaran → muncul **QRIS** dengan total tagihan.
4. Pelanggan scan & bayar, lalu klik **"Saya Sudah Bayar"** → otomatis terbuka WhatsApp dengan rincian pesanan siap dikirim ke nomor Anda.
5. Anda cek mutasi pembayaran, lalu proses/konfirmasi pesanan.

Tombol **WA hijau** di setiap layanan tetap ada untuk pelanggan yang mau tanya-tanya dulu / pesan langsung tanpa checkout, dengan pesan otomatis yang otomatis menyebut nama layanan yang diklik.

## Kalau ada yang salah
- **Total di keranjang selalu Rp0**: berarti layanan itu belum diisi "Harga (angka)" di admin — lihat Langkah 2.
- **Nomor WA checkout salah**: buka `js/main.js`, cari baris `const WA_NUMBER = "6289510579739";` di bagian paling atas, ganti dengan nomor WA Anda (format 62xxx, tanpa 0 di depan).
