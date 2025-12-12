-- Add wine_suggestion column to dishes table
ALTER TABLE dishes 
ADD COLUMN IF NOT EXISTS wine_suggestion TEXT;

-- Create user_menus table to store final selections
CREATE TABLE IF NOT EXISTS user_menus (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_name TEXT NOT NULL,
  starter_id UUID REFERENCES dishes(id),
  main_id UUID REFERENCES dishes(id),
  dessert_id UUID REFERENCES dishes(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS (Optional but good practice)
ALTER TABLE user_menus ENABLE ROW LEVEL SECURITY;

-- Allow public insert (since users are anonymous in the app context but identified by name)
CREATE POLICY "Allow public insert" ON user_menus FOR INSERT WITH CHECK (true);

-- Allow public select (to show results list)
CREATE POLICY "Allow public select" ON user_menus FOR SELECT USING (true);
