CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE profiles
ADD COLUMN department_id UUID REFERENCES departments(id);

-- Optional: Migrate existing company_id to department_id if applicable
-- UPDATE profiles
-- SET department_id = company_id
-- WHERE company_id IS NOT NULL;

-- Optional: Drop company_id column if no longer needed after migration
-- ALTER TABLE profiles
-- DROP COLUMN company_id;