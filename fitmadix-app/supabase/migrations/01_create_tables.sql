-- Create tables for encyclopedias
CREATE TABLE IF NOT EXISTS foods (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  nutrients JSONB,
  source_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS medicines (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  indications JSONB,
  dosage TEXT,
  side_effects JSONB,
  source_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS diseases (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  symptoms JSONB,
  treatments JSONB,
  icd_code TEXT,
  source_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
