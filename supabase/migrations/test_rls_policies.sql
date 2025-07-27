-- Test script to verify RLS policies are working correctly

-- 1. Test if a user can access their own profile (should work for all users)
SELECT * FROM profiles WHERE id = auth.uid();

-- 2. Test if departments are accessible (should work for all users)
SELECT * FROM departments;

-- 3. Test if a super_admin can view all profiles
-- This will only work if you're logged in as a super_admin
SELECT * FROM profiles;

-- 4. Test if a department_head can view profiles in their department
-- This will only work if you're logged in as a department_head
SELECT p.* 
FROM profiles p
WHERE p.department_id IN (
  SELECT department_id FROM profiles 
  WHERE id = auth.uid() AND role = 'department_head'
);

-- 5. Test if a regular user can only view their own profile
-- This will only return the user's own profile if they're not a super_admin or department_head
SELECT * FROM profiles;

-- Note: Run these queries one by one in the Supabase SQL Editor
-- while logged in as different user types to verify the policies