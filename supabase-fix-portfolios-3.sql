-- Sama seperti fix reviews, tapi untuk tabel "portfolios" — jaga-jaga
-- kalau masih ada kolom sisa lain (selain image_url, category) yang
-- wajib-isi padahal tidak dipakai kode. Aman, tidak menghapus data.

do $$
declare
  col record;
begin
  for col in
    select column_name
    from information_schema.columns
    where table_name = 'portfolios'
      and table_schema = 'public'
      and is_nullable = 'NO'
      and column_name not in ('id', 'title', 'description', 'media_url', 'media_type', 'created_at')
  loop
    execute format('alter table portfolios alter column %I drop not null', col.column_name);
  end loop;
end $$;
