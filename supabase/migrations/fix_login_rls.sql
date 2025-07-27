-- Fix for login issues with RLS policies

-- First, temporarily disable RLS on profiles to ensure we can log in
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Check if you can log in now. If yes, then re-enable RLS and apply these policies:

-- Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- CRITICAL: Allow all authenticated users to access their own profile
-- This is essential for login to work properly
CREATE POLICY "Users can access their own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

-- CRITICAL: Allow everyone to view departments
-- This is needed for the sidebar to work properly
CREATE POLICY "Everyone can view departments"
  ON departments
  FOR SELECT
  USING (true);

-- Allow super_admins to view all profiles
CREATE POLICY "Super admins can view all profiles"
  ON profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- Allow department heads to view profiles in their department
CREATE POLICY "Department heads can view their department profiles"
  ON profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'department_head'
    ) AND 
    department_id IN (
      SELECT department_id FROM profiles 
      WHERE id = auth.uid() AND role = 'department_head'
    )
  );

-- Allow super_admins to insert new profiles
CREATE POLICY "Super admins can insert profiles"
  ON profiles
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- Allow admins and department heads to update profiles
CREATE POLICY "Admins and department heads can update profiles"
  ON profiles
  FOR UPDATE
  USING (
    -- Super admins can update any profile
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'super_admin'
    ) OR
    -- Department heads can only update profiles in their department
    (
      EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role = 'department_head'
      ) AND 
      department_id IN (
        SELECT department_id FROM profiles 
        WHERE id = auth.uid() AND role = 'department_head'
      )
    )
  );

-- Allow super_admins to manage departments
CREATE POLICY "Admins can manage departments"
  ON departments
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );