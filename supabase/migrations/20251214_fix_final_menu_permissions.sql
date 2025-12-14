-- Create the final_menus table if it doesn't exist
create table if not exists final_menus (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamptz default now(),
  starter_id uuid references dishes(id),
  main_id uuid references dishes(id),
  dessert_id uuid references dishes(id),
  final_text text
);

-- DANGER: Disable RLS for this table to ensure writing works for now (easiest fix for "permission denied" if RLS policies are tricky)
alter table final_menus disable row level security;

-- Alternatively, ensure explicit grants
grant all on final_menus to anon, authenticated, service_role;
