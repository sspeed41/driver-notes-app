-- Driver Notes App Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drivers table
CREATE TABLE drivers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Note takers table
CREATE TABLE note_takers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Athlete profiles table
CREATE TABLE athlete_profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  driver_id UUID REFERENCES drivers(id) ON DELETE CASCADE,
  age INTEGER,
  gym_time VARCHAR(20),
  crew_chief VARCHAR(100),
  spotter VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(100),
  birthday DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notes table
CREATE TABLE notes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  driver_id UUID REFERENCES drivers(id) ON DELETE CASCADE,
  note_taker_id UUID REFERENCES note_takers(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  type VARCHAR(20) DEFAULT 'Note' CHECK (type IN ('Note', 'Focus')),
  tags TEXT[], -- Array of strings
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comments table (for replies to notes)
CREATE TABLE comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  note_id UUID REFERENCES notes(id) ON DELETE CASCADE,
  author_id UUID REFERENCES note_takers(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reminders table
CREATE TABLE reminders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  note_id UUID REFERENCES notes(id) ON DELETE CASCADE,
  created_by UUID REFERENCES note_takers(id) ON DELETE CASCADE,
  reminder_message TEXT NOT NULL,
  reminder_datetime TIMESTAMPTZ NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  is_dismissed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_notes_driver_id ON notes(driver_id);
CREATE INDEX idx_notes_note_taker_id ON notes(note_taker_id);
CREATE INDEX idx_notes_created_at ON notes(created_at);
CREATE INDEX idx_notes_type ON notes(type);
CREATE INDEX idx_comments_note_id ON comments(note_id);
CREATE INDEX idx_reminders_note_id ON reminders(note_id);
CREATE INDEX idx_reminders_created_by ON reminders(created_by);

-- Enable Row Level Security (RLS)
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_takers ENABLE ROW LEVEL SECURITY;
ALTER TABLE athlete_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all operations for now - you can restrict later)
CREATE POLICY "Allow all operations on drivers" ON drivers FOR ALL USING (true);
CREATE POLICY "Allow all operations on note_takers" ON note_takers FOR ALL USING (true);
CREATE POLICY "Allow all operations on athlete_profiles" ON athlete_profiles FOR ALL USING (true);
CREATE POLICY "Allow all operations on notes" ON notes FOR ALL USING (true);
CREATE POLICY "Allow all operations on comments" ON comments FOR ALL USING (true);
CREATE POLICY "Allow all operations on reminders" ON reminders FOR ALL USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_drivers_updated_at BEFORE UPDATE ON drivers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_note_takers_updated_at BEFORE UPDATE ON note_takers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_athlete_profiles_updated_at BEFORE UPDATE ON athlete_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 