# Row Level Security (RLS) Policy Fix

## Problem

The current RLS policies are preventing:
1. Users from accessing their own profiles during login
2. The sidebar from loading departments
3. Super admins and department heads from viewing and managing profiles

## Solution

The `fix_rls_policies.sql` file contains corrected RLS policies that:

1. Allow all authenticated users to access their own profile (critical for login)
2. Allow everyone to view departments (needed for the sidebar)
3. Properly implement role-based access for super admins and department heads

## How to Apply

1. Open your Supabase dashboard
2. Go to the SQL Editor
3. Copy and paste the contents of `fix_rls_policies.sql`
4. Run the SQL script

## Key Changes

1. **Authentication Fix**: Added a policy that allows any authenticated user to access their own profile, which is essential for the login process to work.

2. **Department Access**: Added a policy that allows all authenticated users to view departments, which is needed for the sidebar to load properly.

3. **Improved Role Checks**: Changed from using `auth.role()` to using `EXISTS` subqueries that check the user's role in the profiles table. This is more reliable as it doesn't depend on the auth.role() function being properly set up.

4. **Proper Policy Hierarchy**: Structured policies to ensure that:
   - Super admins can view and manage all profiles and departments
   - Department heads can only view and manage profiles in their own department
   - Regular users can only view their own profile

## Testing

After applying these policies, you should be able to:

1. Log in successfully with any user
2. See the departments in the sidebar
3. Super admins should be able to view and manage all profiles
4. Department heads should be able to view and manage profiles in their department