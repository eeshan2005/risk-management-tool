# Troubleshooting RLS Issues

## Common RLS Problems and Solutions

### 1. Login Still Not Working

If you're still unable to log in after applying the fixed policies:

- **Check Console Errors**: Look for specific error messages in the browser console
- **Verify User Exists**: Make sure the user exists in both the `auth.users` and `profiles` tables
- **Check Profile ID**: Ensure the profile ID matches the auth user ID
- **Temporarily Disable RLS**: As a last resort, you can temporarily disable RLS to debug:
  ```sql
  ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
  -- After debugging, remember to enable it again:
  ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
  ```

### 2. Department Heads Can't See Their Department's Profiles

If department heads still can't see profiles in their department:

- **Verify Department Assignment**: Make sure the department head's profile has the correct `department_id`
- **Check Role Value**: Ensure the role is exactly `'department_head'` (case-sensitive)
- **Test Direct Query**: Run this query as the department head to verify access:
  ```sql
  SELECT p.* 
  FROM profiles p
  WHERE p.department_id IN (
    SELECT department_id FROM profiles 
    WHERE id = auth.uid() AND role = 'department_head'
  );
  ```

### 3. Super Admins Can't See All Profiles

If super admins can't see all profiles:

- **Verify Role**: Make sure the user's role is exactly `'super_admin'` (case-sensitive)
- **Check Policy Application**: Verify the policy was created successfully in the Supabase dashboard
- **Test Direct Query**: Run this query as the super admin to verify the role check works:
  ```sql
  SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin';
  ```

### 4. Can't Create New Users

If you can't create new users:

- **Check Service Role**: Make sure your edge function or server-side code is using the service role key for user creation
- **Verify Insert Policy**: Ensure the insert policy for profiles is correctly applied
- **Use Direct SQL**: If needed, you can insert directly using SQL with the service role:
  ```sql
  INSERT INTO profiles (id, email, role, department_id)
  VALUES ('user-id-from-auth', 'user@example.com', 'assessor', 'department-id');
  ```

## Advanced Debugging

### Viewing Applied Policies

To see all policies currently applied to a table:

```sql
SELECT * FROM pg_policies WHERE tablename = 'profiles';
```

### Testing Auth Context

To check what Supabase sees as your current user:

```sql
SELECT auth.uid(), auth.jwt();
```

### Checking Role in Profiles

To verify your role is correctly set in the profiles table:

```sql
SELECT id, email, role, department_id 
FROM profiles 
WHERE id = auth.uid();
```

## Getting Help

If you continue to experience issues with RLS policies:

1. Check the [Supabase documentation on RLS](https://supabase.com/docs/guides/auth/row-level-security)
2. Search the [Supabase GitHub issues](https://github.com/supabase/supabase/issues)
3. Ask for help in the [Supabase Discord community](https://discord.supabase.com/)