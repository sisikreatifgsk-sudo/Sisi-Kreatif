-- Jalankan ini untuk menambahkan policy yang belum ada di bucket "media".
-- Aman dijalankan sekali ini saja (bucket Anda saat ini punya 0 policy).

create policy "Public read media" on storage.objects for select using (bucket_id = 'media');
create policy "Authenticated upload media" on storage.objects for insert to authenticated with check (bucket_id = 'media');
create policy "Authenticated update media" on storage.objects for update to authenticated using (bucket_id = 'media');
create policy "Authenticated delete media" on storage.objects for delete to authenticated using (bucket_id = 'media');
