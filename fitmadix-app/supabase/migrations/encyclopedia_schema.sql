-- Fitmadix Encyclopedia & Product Guide Schema

-- ENUMS
CREATE TYPE encyclopedia_category AS ENUM (
  'medicine',
  'food',
  'exercise',
  'condition',
  'nutrient',
  'test',
  'term',
  'product'
);

CREATE TYPE content_status AS ENUM (
  'draft',
  'in_review',
  'published',
  'archived'
);

-- MAIN ENTRIES TABLE
CREATE TABLE encyclopedia_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category encyclopedia_category NOT NULL,
  subcategory TEXT,
  description TEXT,
  image_url TEXT,
  content TEXT,
  benefits_uses TEXT,
  risks_limitations TEXT,
  warnings TEXT,
  status content_status DEFAULT 'draft' NOT NULL,
  language TEXT DEFAULT 'en' NOT NULL,
  last_reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- SOURCES
CREATE TABLE encyclopedia_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID REFERENCES encyclopedia_entries(id) ON DELETE CASCADE,
  source_name TEXT NOT NULL,
  source_url TEXT,
  accessed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RELATIONSHIPS
CREATE TABLE encyclopedia_relations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID REFERENCES encyclopedia_entries(id) ON DELETE CASCADE,
  target_id UUID REFERENCES encyclopedia_entries(id) ON DELETE CASCADE,
  relation_type TEXT,
  UNIQUE (source_id, target_id)
);

-- EXTENSION: MEDICINES
CREATE TABLE medicine_details (
  entry_id UUID PRIMARY KEY REFERENCES encyclopedia_entries(id) ON DELETE CASCADE,
  generic_name TEXT,
  brand_names TEXT[],
  drug_class TEXT,
  available_forms TEXT[],
  prescription_status TEXT,
  common_strengths TEXT[],
  possible_interactions TEXT,
  storage_info TEXT
);

-- EXTENSION: FOODS
CREATE TABLE food_details (
  entry_id UUID PRIMARY KEY REFERENCES encyclopedia_entries(id) ON DELETE CASCADE,
  calories_per_100g NUMERIC,
  protein_per_100g NUMERIC,
  carbs_per_100g NUMERIC,
  fat_per_100g NUMERIC,
  fiber_per_100g NUMERIC,
  serving_size_info TEXT,
  allergy_info TEXT
);

-- EXTENSION: EXERCISES
CREATE TABLE exercise_details (
  entry_id UUID PRIMARY KEY REFERENCES encyclopedia_entries(id) ON DELETE CASCADE,
  difficulty TEXT,
  primary_muscles TEXT[],
  secondary_muscles TEXT[],
  equipment TEXT[],
  instructions TEXT[],
  common_mistakes TEXT[],
  safety_considerations TEXT,
  beginner_modification TEXT,
  advanced_modification TEXT
);

-- EXTENSION: CONDITIONS
CREATE TABLE condition_details (
  entry_id UUID PRIMARY KEY REFERENCES encyclopedia_entries(id) ON DELETE CASCADE,
  common_symptoms TEXT[],
  common_causes TEXT[],
  evaluation_methods TEXT,
  management_approaches TEXT,
  emergency_warning_signs TEXT
);

-- EXTENSION: NUTRIENTS
CREATE TABLE nutrient_details (
  entry_id UUID PRIMARY KEY REFERENCES encyclopedia_entries(id) ON DELETE CASCADE,
  food_sources TEXT[],
  deficiency_info TEXT,
  toxicity_info TEXT,
  supplement_info TEXT,
  recommended_intake TEXT
);

-- EXTENSION: TESTS
CREATE TABLE test_details (
  entry_id UUID PRIMARY KEY REFERENCES encyclopedia_entries(id) ON DELETE CASCADE,
  why_ordered TEXT,
  what_it_measures TEXT,
  preparation TEXT,
  results_meaning TEXT,
  limitations TEXT
);

-- PRODUCTS
CREATE TABLE health_products (
  entry_id UUID PRIMARY KEY REFERENCES encyclopedia_entries(id) ON DELETE CASCADE,
  product_type TEXT,
  specifications JSONB,
  advantages TEXT[],
  limitations TEXT[],
  suitable_use_cases TEXT[]
);

-- PRODUCT SELLERS (WHERE TO BUY)
CREATE TABLE product_sellers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID REFERENCES encyclopedia_entries(id) ON DELETE CASCADE,
  seller_name TEXT NOT NULL,
  price NUMERIC,
  currency TEXT DEFAULT 'INR',
  availability TEXT,
  purchase_url TEXT,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- INDEXES
CREATE INDEX idx_encyclopedia_slug ON encyclopedia_entries(slug);
CREATE INDEX idx_encyclopedia_category ON encyclopedia_entries(category);
CREATE INDEX idx_encyclopedia_status ON encyclopedia_entries(status);

-- RLS POLICIES (Assuming basic public read, admin write)
ALTER TABLE encyclopedia_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON encyclopedia_entries FOR SELECT USING (status = 'published');
