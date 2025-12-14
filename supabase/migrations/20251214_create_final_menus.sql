create table if not exists final_menus (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamptz default now(),
  starter_id uuid references dishes(id),
  main_id uuid references dishes(id),
  dessert_id uuid references dishes(id),
  final_text text -- Optional JSON or text summary
);

-- Allow anyone to insert for now
alter table final_menus enable row level security;

create policy "Enable insert for all" on final_menus
  for insert with check (true);
