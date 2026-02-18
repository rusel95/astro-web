-- ============================================================
-- Зоря — Supabase schema
-- Run this in the Supabase SQL Editor after creating a project
-- ============================================================

-- users table (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade,
  name text,
  created_at timestamptz default now(),
  primary key (id)
);

-- saved charts
create table public.charts (
  id text primary key,
  user_id uuid references auth.users on delete cascade,
  name text,
  birth_date text,
  birth_time text,
  city text,
  country_code text,
  latitude float,
  longitude float,
  gender text,
  chart_data jsonb,
  created_at timestamptz default now()
);

-- RLS
alter table public.profiles enable row level security;
alter table public.charts enable row level security;

create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can view own charts" on public.charts for select using (auth.uid() = user_id);
create policy "Users can insert own charts" on public.charts for insert with check (auth.uid() = user_id);
create policy "Users can delete own charts" on public.charts for delete using (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Global chart calculation counter (no auth required)
create table if not exists public.chart_counter (
  id integer primary key default 1,
  count bigint not null default 0,
  constraint single_row check (id = 1)
);
insert into public.chart_counter (id, count) values (1, 0) on conflict do nothing;
alter table public.chart_counter enable row level security;
create policy "Anyone can read counter" on public.chart_counter for select using (true);
create policy "Anyone can update counter" on public.chart_counter for update using (true);

-- Function to safely increment counter
create or replace function public.increment_chart_counter()
returns void as $$
  update public.chart_counter set count = count + 1 where id = 1;
$$ language sql security definer;
