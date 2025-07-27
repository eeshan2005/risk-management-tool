-- Script to verify current RLS policies

-- Check if RLS is enabled on profiles and departments tables
SELECT
  schemaname,
  tablename,
  rowsecurity
FROM
  pg_tables
WHERE
  tablename IN ('profiles', 'departments');

-- List all policies on the profiles table
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM
  pg_policies
WHERE
  tablename = 'profiles'
ORDER BY
  policyname;

-- List all policies on the departments table
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM
  pg_policies
WHERE
  tablename = 'departments'
ORDER BY
  policyname;

-- Test if the current user can access their own profile
SELECT
  'Can access own profile' as test,
  CASE
    WHEN EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid())
    THEN 'PASS'
    ELSE 'FAIL'
  END as result;

-- Test if the current user can access departments
SELECT
  'Can access departments' as test,
  CASE
    WHEN EXISTS (SELECT 1 FROM departments LIMIT 1)
    THEN 'PASS'
    ELSE 'FAIL'
  END as result;

-- Get current user's role from profiles
SELECT
  'Current user role' as info,
  role
FROM
  profiles
WHERE
  id = auth.uid();

-- Check if auth.uid() is returning a value
SELECT
  'auth.uid() value' as info,
  auth.uid() as uid;

-- Check if JWT token is valid
SELECT
  'JWT validation' as test,
  CASE
    WHEN auth.jwt() IS NOT NULL
    THEN 'PASS'
    ELSE 'FAIL'
  END as result;