# Fixing Login Issues with RLS Policies

## The Problem

Based on the error messages you're seeing:

```
Failed to load resource: the server responded with a status of 400 ()
AuthApiError: Invalid Refresh Token: Refresh Token Not Found
Error fetching profile
```

This indicates that your Row Level Security (RLS) policies are preventing the authentication flow from working properly. The specific issues are:

1. The refresh token is not being properly handled
2. The profile fetch is failing due to RLS restrictions

## Step-by-Step Solution

### 1. Temporarily Disable RLS

First, let's temporarily disable RLS on the profiles table to verify this is indeed the issue:

```sql
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
```

Run this in your Supabase SQL Editor and try logging in again. If you can log in successfully, then RLS is definitely the issue.

### 2. Apply the Fixed RLS Policies

Once you've confirmed RLS is the issue, apply the policies from the `fix_login_rls.sql` file:

1. Open your Supabase dashboard
2. Go to the SQL Editor
3. Copy and paste the contents of `fix_login_rls.sql`
4. Run the SQL script

### 3. Clear Browser Data

After applying the new policies, you should:

1. Clear your browser cookies and local storage
2. Close and reopen your browser
3. Try logging in again

## Key Changes in the Fixed Policies

1. **Temporarily Disable RLS**: This allows you to verify the issue and ensure you can log in.

2. **Critical User Access Policy**: The most important policy is:
   ```sql
   CREATE POLICY "Users can access their own profile"
     ON profiles
     FOR SELECT
     USING (auth.uid() = id);
   ```
   This ensures that any authenticated user can access their own profile, which is essential for the login process.

3. **Department Access**: We also ensure everyone can view departments:
   ```sql
   CREATE POLICY "Everyone can view departments"
     ON departments
     FOR SELECT
     USING (true);
   ```

## Troubleshooting

If you're still experiencing issues after applying these fixes:

1. **Check Console Errors**: Look for specific error messages in the browser console

2. **Verify Token Handling**: Make sure your Supabase client is properly configured:
   ```typescript
   // Check your supabaseClient.ts file
   import { createClient } from '@supabase/supabase-js';
   const supabase = createClient(supabaseUrl, supabaseAnonKey, {
     auth: {
       persistSession: true,
       autoRefreshToken: true,
     }
   });
   ```

3. **Check Profile Table**: Ensure your profiles table has the correct structure and that user IDs match between auth.users and profiles.

4. **Update Supabase JS Client**: Make sure you're using the latest version of the Supabase JavaScript client.

## Prevention

To prevent this issue in the future, always ensure that:

1. You have a policy that allows users to access their own profiles
2. You test authentication flows after making RLS changes
3. You have proper error handling in your authentication code