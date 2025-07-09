/*
  # Study Resources Database Schema

  1. New Tables
    - `semesters`
      - `id` (uuid, primary key)
      - `name` (text, unique) - e.g., "1-1", "2-2"
      - `created_at` (timestamp)
    - `subjects`
      - `id` (uuid, primary key) 
      - `name` (text)
      - `semester_id` (uuid, foreign key)
      - `created_at` (timestamp)
    - `resources`
      - `id` (uuid, primary key)
      - `title` (text)
      - `drive_link` (text)
      - `subject_id` (uuid, foreign key)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
    - Add policies for authenticated admin operations

  3. Indexes
    - Add indexes for foreign keys and frequently queried columns
*/

-- Create semesters table
CREATE TABLE IF NOT EXISTS semesters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create subjects table  
CREATE TABLE IF NOT EXISTS subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  semester_id uuid NOT NULL REFERENCES semesters(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Create resources table
CREATE TABLE IF NOT EXISTS resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  drive_link text NOT NULL,
  subject_id uuid NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE semesters ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public can read semesters"
  ON semesters FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can read subjects"
  ON subjects FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can read resources"
  ON resources FOR SELECT
  TO public
  USING (true);

-- Create policies for authenticated admin operations
CREATE POLICY "Authenticated can manage semesters"
  ON semesters FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can manage subjects"
  ON subjects FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can manage resources"
  ON resources FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subjects_semester_id ON subjects(semester_id);
CREATE INDEX IF NOT EXISTS idx_resources_subject_id ON resources(subject_id);
CREATE INDEX IF NOT EXISTS idx_semesters_name ON semesters(name);

-- Insert default semesters
INSERT INTO semesters (name) VALUES 
  ('1-1'), ('1-2'), ('2-1'), ('2-2'), 
  ('3-1'), ('3-2'), ('4-1'), ('4-2')
ON CONFLICT (name) DO NOTHING;