-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create driver_notes table
CREATE TABLE driver_notes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    driver TEXT NOT NULL,
    note_taker TEXT NOT NULL,
    note TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    type TEXT CHECK (type IN ('Note', 'Focus')) DEFAULT 'Note',
    tags TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create reminders table
CREATE TABLE reminders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    note_id UUID REFERENCES driver_notes(id) ON DELETE CASCADE,
    driver TEXT NOT NULL,
    original_note TEXT NOT NULL,
    reminder_message TEXT NOT NULL,
    reminder_datetime TEXT NOT NULL,
    created_by TEXT NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    is_dismissed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_driver_notes_driver ON driver_notes(driver);
CREATE INDEX idx_driver_notes_note_taker ON driver_notes(note_taker);
CREATE INDEX idx_driver_notes_type ON driver_notes(type);
CREATE INDEX idx_driver_notes_created_at ON driver_notes(created_at DESC);
CREATE INDEX idx_reminders_note_id ON reminders(note_id);
CREATE INDEX idx_reminders_driver ON reminders(driver);
CREATE INDEX idx_reminders_created_by ON reminders(created_by);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_driver_notes_updated_at 
    BEFORE UPDATE ON driver_notes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reminders_updated_at 
    BEFORE UPDATE ON reminders 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE driver_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

-- Create policies (allowing all operations for now - you can restrict later)
CREATE POLICY "Allow all operations on driver_notes" ON driver_notes
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on reminders" ON reminders
    FOR ALL USING (true) WITH CHECK (true); 