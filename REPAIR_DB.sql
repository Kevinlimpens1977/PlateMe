-- 1. Ensure UUID extension exists
create extension if not exists "uuid-ossp";

-- 2. Create the table public.final_menus
create table if not exists public.final_menus (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamptz default now(),
  starter_id uuid references public.dishes(id),
  main_id uuid references public.dishes(id),
  dessert_id uuid references public.dishes(id),
  final_text text
);

-- 3. DISABLE Row Level Security to allow all writes (simplest fix)
alter table public.final_menus disable row level security;

-- 4. Grant permissions just in case
grant all on public.final_menus to anon, authenticated, service_role;
