-- Jalankan seluruh script ini di Supabase SQL Editor
-- Dipakai untuk project Supabase yang BARU / belum pernah setup tabel apa pun.
-- Kalau tabel "services" sudah pernah dibuat sebelumnya, pakai file
-- supabase-update-v2.sql saja (jangan jalankan script ini, nanti error duplikat).

-- ================= LAYANAN =================
create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text,
  description text,
  price text,
  image_url text,
  created_at timestamp with time zone default now()
);

alter table services enable row level security;

create policy "Public read services" on services for select using (true);
create policy "Authenticated insert services" on services for insert to authenticated with check (true);
create policy "Authenticated update services" on services for update to authenticated using (true);
create policy "Authenticated delete services" on services for delete to authenticated using (true);

-- ================= PORTOFOLIO =================
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

-- ================= REVIEW =================
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
-- Membuat bucket "media" secara otomatis dan menjadikannya public
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "Public read media" on storage.objects for select using (bucket_id = 'media');
create policy "Authenticated upload media" on storage.objects for insert to authenticated with check (bucket_id = 'media');
create policy "Authenticated update media" on storage.objects for update to authenticated using (bucket_id = 'media');
create policy "Authenticated delete media" on storage.objects for delete to authenticated using (bucket_id = 'media');
