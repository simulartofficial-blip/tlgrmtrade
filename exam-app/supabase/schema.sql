-- SınavAI — Supabase Veritabanı Şeması
-- Supabase Dashboard > SQL Editor'e yapıştırıp çalıştırın

-- Sınavlar tablosu
create table if not exists exams (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  title       text not null,
  grade       integer not null default 6,
  subject     text not null default 'Matematik',
  topic       text not null,
  difficulty  text not null check (difficulty in ('kolay', 'orta', 'zor')),
  yazili_bicimi text not null check (yazili_bicimi in ('test', 'klasik', 'karma')),
  questions   jsonb not null default '[]',
  created_at  timestamptz not null default now()
);

-- Sadece kendi sınavlarını görür/değiştirir
alter table exams enable row level security;

create policy "Kendi sınavlarını görüntüle"
  on exams for select
  using (auth.uid() = user_id);

create policy "Kendi sınavını oluştur"
  on exams for insert
  with check (auth.uid() = user_id);

create policy "Kendi sınavını sil"
  on exams for delete
  using (auth.uid() = user_id);

-- İndeks (hız için)
create index if not exists exams_user_id_idx on exams(user_id, created_at desc);
