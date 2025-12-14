-- Enable RLS just in case it was automagically enabled
alter table consensus_votes enable row level security;

-- Create policy to allow all actions for now (since it's a simple app without auth headers being strict)
create policy "Allow public access" 
on consensus_votes 
for all 
using (true) 
with check (true);

-- Also ensure duplication doesn't fail uniquely without being handled if using just insert (we use upsert so it should be fine, but good to ensure constraints)
