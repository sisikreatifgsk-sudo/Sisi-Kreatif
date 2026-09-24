-- Menambahkan kolom yang belum ada di tabel "reviews", dan melonggarkan
-- kolom lama yang mungkin masih wajib-isi (NOT NULL) padahal tidak dipakai.
-- Aman dijalankan, tidak menghapus data.

alter table reviews add column if not exists client_name text;
alter table reviews add column if not exists review_text text;
alter table reviews add column if not exists rating int default 5;

-- Kalau ada kolom lama lain yang wajib-isi (misal dari template berbeda),
-- baris di bawah ini melonggarkannya supaya tidak mengganjal saat simpan.
-- Aman dijalankan walau kolomnya tidak ada NOT NULL sama sekali.
do $$
begin
  if exists (select 1 from information_schema.columns where table_name = 'reviews' and column_name = 'title') then
    alter table reviews alter column title drop not null;
  end if;
  if exists (select 1 from information_schema.columns where table_name = 'reviews' and column_name = 'description') then
    alter table reviews alter column description drop not null;
  end if;
  if exists (select 1 from information_schema.columns where table_name = 'reviews' and column_name = 'category') then
    alter table reviews alter column category drop not null;
  end if;
  if exists (select 1 from information_schema.columns where table_name = 'reviews' and column_name = 'image_url') then
    alter table reviews alter column image_url drop not null;
  end if;
end $$;
