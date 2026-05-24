-- Kullanıcı profilleri
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  school text,
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Kullanıcı kendi profilini okuyabilir"
  on profiles for select using (auth.uid() = id);

create policy "Kullanıcı kendi profilini güncelleyebilir"
  on profiles for update using (auth.uid() = id);

create policy "Kullanıcı profil oluşturabilir"
  on profiles for insert with check (auth.uid() = id);

-- Yeni kullanıcı kaydolduğunda otomatik profil oluştur
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Sınavlar
create table if not exists exams (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  grade int not null default 6,
  subject text not null default 'Matematik',
  topic text not null,
  difficulty text not null,
  questions jsonb not null default '[]',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table exams enable row level security;

create policy "Kullanıcı kendi sınavlarını görebilir"
  on exams for select using (auth.uid() = user_id);

create policy "Kullanıcı sınav oluşturabilir"
  on exams for insert with check (auth.uid() = user_id);

create policy "Kullanıcı kendi sınavını güncelleyebilir"
  on exams for update using (auth.uid() = user_id);

create policy "Kullanıcı kendi sınavını silebilir"
  on exams for delete using (auth.uid() = user_id);

-- updated_at otomatik güncelle
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger exams_updated_at
  before update on exams
  for each row execute function update_updated_at();
