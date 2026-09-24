-- PAKAI FILE INI setelah supabase-update-v2.sql (untuk fitur keranjang & checkout QRIS).
-- Jalankan seluruhnya di Supabase SQL Editor.

-- Kolom harga angka, dipakai untuk menghitung total di keranjang.
-- Kolom "price" (teks) yang lama tetap ada dan tetap dipakai untuk tampilan.
alter table services add column if not exists price_numeric numeric default 0;
