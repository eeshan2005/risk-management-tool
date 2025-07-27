-- Create risks table with department_id for RLS policies
CREATE TABLE risks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sr_no INTEGER NOT NULL,
  business_process TEXT,
  date_risk_identified DATE,
  risk_description TEXT,
  threats TEXT,
  vulnerabilities TEXT,
  existing_controls TEXT,
  risk_owner TEXT,
  controls_clause_no TEXT,
  iso_27001_controls_reference TEXT,
  confidentiality INTEGER,
  integrity INTEGER,
  availability INTEGER,
  max_cia_value INTEGER,
  vulnerability_rating INTEGER,
  threat_frequency INTEGER,
  threat_impact INTEGER,
  threat_value INTEGER,
  risk_value INTEGER,
  planned_mitigation_completion_date DATE,
  risk_treatment_action TEXT,
  revised_vulnerability_rating INTEGER,
  revised_threat_frequency INTEGER,
  revised_threat_impact INTEGER,
  revised_threat_value INTEGER,
  revised_risk_value INTEGER,
  actual_mitigation_completion_date DATE,
  risk_treatment_option TEXT,
  department_id UUID REFERENCES departments(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on department_id for faster queries
CREATE INDEX risks_department_id_idx ON risks(department_id);

-- Enable Row Level Security
ALTER TABLE risks ENABLE ROW LEVEL SECURITY;

-- Create policies for different roles

-- Super Admin has full access to all rows
CREATE POLICY "super_admin_select_all" 
  ON risks FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'super_admin'
  ));

CREATE POLICY "super_admin_insert_all" 
  ON risks FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'super_admin'
  ));

CREATE POLICY "super_admin_update_all" 
  ON risks FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'super_admin'
  ));

CREATE POLICY "super_admin_delete_all" 
  ON risks FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'super_admin'
  ));

-- Department Head can access only their department's rows
CREATE POLICY "department_head_select_own" 
  ON risks FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'department_head'
    AND profiles.department_id = risks.department_id
  ));

CREATE POLICY "department_head_insert_own" 
  ON risks FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'department_head'
    AND profiles.department_id = risks.department_id
  ));

CREATE POLICY "department_head_update_own" 
  ON risks FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'department_head'
    AND profiles.department_id = risks.department_id
  ));

CREATE POLICY "department_head_delete_own" 
  ON risks FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'department_head'
    AND profiles.department_id = risks.department_id
  ));

-- Assessor can access only their department's rows
CREATE POLICY "assessor_select_own" 
  ON risks FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'assessor'
    AND profiles.department_id = risks.department_id
  ));

CREATE POLICY "assessor_insert_own" 
  ON risks FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'assessor'
    AND profiles.department_id = risks.department_id
  ));

CREATE POLICY "assessor_update_own" 
  ON risks FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'assessor'
    AND profiles.department_id = risks.department_id
  ));

CREATE POLICY "assessor_delete_own" 
  ON risks FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'assessor'
    AND profiles.department_id = risks.department_id
  ));

-- Reviewer can only SELECT their department's rows (read-only)
CREATE POLICY "reviewer_select_own" 
  ON risks FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'reviewer'
    AND profiles.department_id = risks.department_id
  ));