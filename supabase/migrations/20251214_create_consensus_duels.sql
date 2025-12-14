create table if not exists consensus_duel_votes (
  id uuid default uuid_generate_v4() primary key,
  user_name text not null,
  course text not null,
  duel_id text not null, -- logical id, e.g. "dishA_dishB" sorted
  dish_a_id uuid not null references dishes(id),
  dish_b_id uuid not null references dishes(id),
  winner_id uuid not null references dishes(id),
  created_at timestamptz default now(),
  constraint check_winner check (winner_id = dish_a_id or winner_id = dish_b_id),
  unique(user_name, course, duel_id)
);

-- Policy to allow public access (or restrict as needed)
alter table consensus_duel_votes enable row level security;

create policy "Enable all access for now" on consensus_duel_votes
  for all using (true) with check (true);
