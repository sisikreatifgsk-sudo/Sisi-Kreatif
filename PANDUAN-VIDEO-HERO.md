# Cara Pasang Video Background di Hero

Section paling atas (hero) sekarang sudah siap menampilkan video looping sebagai background, seperti di web Adsfort. Anda tinggal menambahkan file videonya sendiri.

## Yang perlu disiapkan
1. **Video pendek** (5–15 detik cukup, akan otomatis diulang/loop), berisi cuplikan proses kerja studio Anda, hasil desain yang di-scroll, dsb. Idealnya:
   - Format **MP4**
   - Orientasi **landscape** (mendatar)
   - Ukuran file **di bawah 10MB** supaya loading cepat (kompres dulu kalau perlu, bisa pakai handbrake.fr atau convert online)
2. (Opsional tapi disarankan) **1 gambar poster** — screenshot/frame dari video itu, dipakai sebagai gambar yang muncul sebelum video selesai dimuat.

## Cara pasang
1. Beri nama file video Anda persis: **`hero-video.mp4`**
2. Beri nama file poster Anda (kalau ada) persis: **`hero-poster.jpg`**
3. Masukkan keduanya ke folder **`assets/`** di project (folder yang sama tempat `logo.png` dan `qris.jpg` berada), menimpa/menambah file yang ada.
4. Upload ulang folder `sisikreatif` ke Netlify seperti biasa.

## Kalau belum ada videonya
Tidak masalah — biarkan saja, hero akan tetap tampil dengan background gradient gold seperti sekarang (tidak akan error atau kosong). Anda bisa tambahkan videonya kapan saja nanti.
