-- Otomatis melonggarkan (drop NOT NULL) SEMUA kolom di tabel "reviews"
-- yang bukan client_name, review_text, rating, id, atau created_at.
-- Jadi kolom sisa apa pun namanya (comment, category, dst) tidak akan
-- mengganjal lagi saat simpan review. Aman, tidak menghapus data.

do $$
declare
  col record;
begin
  for col in
    select column_name
    from information_schema.columns
    where table_name = 'reviews'
      and table_schema = 'public'
      and is_nullable = 'NO'
      and column_name not in ('id', 'client_name', 'review_text', 'rating', 'created_at')
  loop
    execute format('alter table reviews alter column %I drop not null', col.column_name);
  end loop;
end $$;
