-- PAKAI FILE INI kalau Anda SUDAH pernah menjalankan supabase-setup.sql
-- sebelumnya (tabel "services" sudah ada). Script ini hanya menambahkan
-- yang baru, tidak menghapus data lama.
-- Jalankan seluruhnya sekaligus di Supabase SQL Editor.

-- Tambah kolom gambar ke tabel layanan yang sudah ada
alter table services add column if not exists image_url text;

-- ================= PORTOFOLIO (baru) =================
create table if not exists portfolios (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  media_url text,
  media_type text, -- 'image' | 'video' | 'document'
  created_at timestamp with time zone default now()
);

alter table portfolios enable row level security;

create policy "Public read portfolio" on portfolios for select using (true);
create policy "Authenticated insert portfolio" on portfolios for insert to authenticated with check (true);
create policy "Authenticated update portfolio" on portfolios for update to authenticated using (true);
create policy "Authenticated delete portfolio" on portfolios for delete to authenticated using (true);

-- ================= REVIEW (baru) =================
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  review_text text not null,
  rating int default 5,
  created_at timestamp with time zone default now()
);

alter table reviews enable row level security;

create policy "Public read reviews" on reviews for select using (true);
create policy "Authenticated insert reviews" on reviews for insert to authenticated with check (true);
create policy "Authenticated update reviews" on reviews for update to authenticated using (true);
create policy "Authenticated delete reviews" on reviews for delete to authenticated using (true);

-- ================= STORAGE (gambar/video/dokumen) =================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "Public read media" on storage.objects for select using (bucket_id = 'media');
create policy "Authenticated upload media" on storage.objects for insert to authenticated with check (bucket_id = 'media');
create policy "Authenticated update media" on storage.objects for update to authenticated using (bucket_id = 'media');
create policy "Authenticated delete media" on storage.objects for delete to authenticated using (bucket_id = 'media');
