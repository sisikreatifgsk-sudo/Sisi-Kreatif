-- Menghapus wajib-isi (NOT NULL) pada kolom sisa di tabel "portfolios"
-- yang tidak dipakai oleh form portofolio (image_url, category).
-- Aman dijalankan, tidak menghapus data.

alter table portfolios alter column image_url drop not null;
alter table portfolios alter column category drop not null;
