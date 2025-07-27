# Login Issue Fix Guide

## Problem Overview

After implementing Row Level Security (RLS) policies, users are unable to log in to the application. The console shows errors like "Invalid Refresh Token" and "Error fetching profile". This happens because the RLS policies are preventing the application from fetching the user's profile during the login process.

## Root Cause Analysis

The login flow works as follows:

1. User enters credentials and calls `supabase.auth.signInWithPassword()`
2. After successful authentication, `initializeAuth()` is called to fetch the user's profile
3. The profile fetch fails due to RLS policies preventing access to the user's own profile
4. The auth store resets the user state, causing login to fail

The key issue is that the original RLS policies did not include a rule allowing users to access their own profiles, which is critical for the login process to work.

## Solution

The solution involves three main components:

1. **Fix RLS Policies**: Update the RLS policies to allow users to access their own profiles
2. **Improve Error Handling**: Update the auth store to handle profile fetch errors better
3. **Enhance Supabase Client**: Improve token handling in the Supabase client

## Implementation Steps

### 1. Apply Fixed RLS Policies

The `fix_login_rls.sql` file contains the corrected RLS policies. The most important changes are:

- Temporarily disable RLS on the profiles table to ensure login works
- Re-enable RLS with the correct policies
- Add a policy allowing users to access their own profiles using `auth.uid() = id`
- Ensure everyone can view departments

To apply these changes:

1. Run the SQL commands in `fix_login_rls.sql` in your Supabase SQL editor
2. Verify the policies are applied using `verify_rls_policies.sql`

### 2. Update Code to Handle Errors Better

The following code changes have been made:

1. **useAuth.ts**: Updated to handle profile fetch errors better by keeping the user session even if profile fetch fails
2. **login/page.tsx**: Improved error handling during login and added support for users without profiles
3. **layout.tsx**: Updated to handle cases where a user is authenticated but has no profile
4. **Sidebar.tsx**: Improved error handling when fetching departments
5. **supabaseClient.ts**: Enhanced with better token handling configuration

### 3. Clear Browser Data

After applying the above changes, you may need to clear your browser data to remove any invalid tokens:

1. Open your browser's settings
2. Go to Privacy and Security
3. Clear browsing data
4. Select "Cookies and site data" and clear them
5. Restart your browser

## Troubleshooting

If you still experience login issues:

1. Check the browser console for specific error messages
2. Verify that the RLS policies are correctly applied using `verify_rls_policies.sql`
3. Temporarily disable RLS on the profiles table to confirm it's an RLS issue
4. Check if the user exists in the auth.users table and has a corresponding entry in the profiles table
5. Verify that the user's ID in the profiles table matches their ID in auth.users

## Key Policy Changes

The most important policy change is:

```sql
CREATE POLICY "Users can access their own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);
```

This allows users to access their own profiles, which is essential for the login process to work.

Another important policy is:

```sql
CREATE POLICY "Everyone can view departments"
  ON departments
  FOR SELECT
  USING (true);
```

This ensures that all users can view departments, which is needed for the sidebar to work properly.