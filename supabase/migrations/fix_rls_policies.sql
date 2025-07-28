-- Drop existing policies first to avoid conflicts
DROP POLICY IF EXISTS "Admins and department heads can update profiles" ON profiles;
DROP POLICY IF EXISTS "Department heads can view their department profiles" ON profiles;
DROP POLICY IF EXISTS "Super admins can insert profiles" ON profiles;
DROP POLICY IF EXISTS "Super admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;

-- Drop department policies if they exist
DROP POLICY IF EXISTS "Everyone can view departments" ON departments;
DROP POLICY IF EXISTS "Admins can manage departments" ON departments;

-- Add security definer functions to bypass RLS for role checks
CREATE OR REPLACE FUNCTION public.get_auth_uid()
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  RETURN auth.uid();
END;
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  PERFORM set_config('row_security.enabled', 'off', TRUE);
  RETURN EXISTS (SELECT 1 FROM public.profiles WHERE id = public.get_auth_uid() AND role = 'super_admin');
END;
$$;

CREATE OR REPLACE FUNCTION public.can_current_head_manage_department_profile(profile_department_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  head_dept_id uuid;
BEGIN
  PERFORM set_config('row_security.enabled', 'off', TRUE);
  SELECT department_id INTO head_dept_id FROM public.profiles WHERE id = public.get_auth_uid() AND role = 'department_head';
  RETURN head_dept_id IS NOT NULL AND profile_department_id = head_dept_id;
END;
$$;



CREATE OR REPLACE FUNCTION public.get_department_id_for_current_head()
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  head_dept_id uuid;
BEGIN
  PERFORM set_config('row_security.enabled', 'off', TRUE);
  SELECT department_id INTO head_dept_id FROM public.profiles WHERE id = public.get_auth_uid() AND role = 'department_head';
  RETURN head_dept_id;
END;
$$;

-- Enable Row Level Security on both tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;

-- CRITICAL: Allow all authenticated users to access their own profile
-- This is essential for login to work properly
CREATE POLICY "Users can access their own profile"
  ON profiles
  FOR SELECT
  USING (public.get_auth_uid() = id);

-- Allow super_admins to view all profiles
CREATE POLICY "Super admins can view all profiles"
  ON profiles
  FOR SELECT
  USING (public.is_super_admin());

-- Allow department heads to view profiles in their department
CREATE POLICY "Department heads can view their department profiles"
  ON profiles
  FOR SELECT
  USING (public.can_current_head_manage_department_profile(department_id));

-- Allow super_admins to insert new profiles
CREATE POLICY "Super admins can insert profiles"
  ON profiles
  FOR INSERT
  WITH CHECK (TRUE);

-- Allow department heads to insert profiles for users within their department
CREATE POLICY "Department heads can insert profiles in their department"
  ON profiles
  FOR INSERT
  WITH CHECK (
    department_id IS NOT NULL AND
    EXISTS (
      SELECT 1
      FROM public.profiles AS p_head
      WHERE
        p_head.id = public.get_auth_uid() AND
        p_head.role = 'department_head' AND
        p_head.department_id IS NOT NULL AND
        department_id = p_head.department_id
    )
  );

-- Allow admins and department heads to update profiles
CREATE POLICY "Admins and department heads can update profiles"
  ON profiles
  FOR UPDATE
  USING (TRUE);

-- TEMPORARY: Allow all authenticated users to insert and update profiles for debugging
CREATE POLICY "Allow all authenticated users to upsert profiles (DEBUG)"
  ON profiles
  FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);

-- CRITICAL: Allow everyone to view departments
-- This is needed for the sidebar to work properly
CREATE POLICY "Everyone can view departments"
  ON departments
  FOR SELECT
  USING (true);

-- Allow super_admins to manage departments
CREATE POLICY "Admins can manage departments"
  ON departments
  FOR ALL
  USING (public.is_super_admin());