create table if not exists consensus_votes (
  id uuid default gen_random_uuid() primary key,
  user_name text not null,
  course text not null, -- 'voor', 'hoofd', 'na'
  dish_id uuid not null references dishes(id),
  rank int not null, -- 1, 2, 3 (1 is highest preference)
  points int not null, -- 3, 2, 1 (3 points for rank 1)
  created_at timestamptz default now(),
  constraint unique_vote unique(user_name, course, dish_id)
);
