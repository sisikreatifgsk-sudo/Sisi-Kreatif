// ============================================
// ISI DENGAN DATA SUPABASE ANDA
// Lihat PANDUAN-DEPLOY.md langkah 2 untuk cara
// mendapatkan dua nilai di bawah ini.
// ============================================
const SUPABASE_URL = "https://xynppboumzexuqvxnrjr.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5bnBwYm91bXpleHVxdnhucmpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwNzkwNjksImV4cCI6MjEwNTY1NTA2OX0.kXsPP5pUf3RU4YLkk-j4X4mAXxvU4FVGsI6v9Im4wLA";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
