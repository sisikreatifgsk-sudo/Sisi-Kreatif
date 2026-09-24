-- Menambahkan kolom yang belum ada di tabel "portfolios".
-- Aman dijalankan, tidak menghapus data atau kolom yang sudah ada.

alter table portfolios add column if not exists description text;
alter table portfolios add column if not exists media_url text;
alter table portfolios add column if not exists media_type text;
