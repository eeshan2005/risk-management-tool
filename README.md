This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## Supabase Auth & Profiles Table Setup

### 1. Create `profiles` Table

```sql
create table profiles (
  id uuid primary key references auth.users(id),
  email text,
  role text check (role in ('super_admin', 'department_head', 'assessor', 'reviewer')) default 'reviewer',
  department_id uuid references departments(id),
  created_at timestamp default now()
);
```

### 2. Row Level Security (RLS) Policies

Enable RLS:
```sql
alter table profiles enable row level security;
```

#### Reviewer/Assessor: Only see their own profile
```sql
create policy "Allow user to view own profile" on profiles
  for select using (auth.uid() = id);
```

#### Reviewer/Assessor: Only see rows for their department in other tables (example for risks)
```sql
create policy "Department-based access for risks" on risks
  for select using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.department_id = department_id
    )
    or (
      exists (
        select 1 from profiles p
        where p.id = auth.uid() and p.role = 'admin'
      )
    )
  );
```

#### Admin: Access everything
Admins are allowed by default if you add them to the profiles table with role 'admin'.

---

### 3. Insert Hardcoded Admin
Manually insert an admin user in Supabase SQL editor:

```sql
-- First, create the user in the auth.users table via Supabase Auth UI or API
-- Then, insert into profiles:
insert into profiles (id, email, role) values ('<admin-user-uuid>', 'admin@assuregate.com', 'super_admin');
```

---

### 4. Reviewer Self-Signup
Reviewers can sign up and select a department. Their role defaults to 'reviewer'.

### 5. Assessor Creation
Only admins can create assessors via the admin dashboard.

---

### 6. Department Table
Make sure your `companies` table exists with at least `id` and `name` columns.

---

### 7. Auto-Insert Profile Logic
If you want to enforce auto-insert of profiles on signup, use a Supabase function/trigger or ensure the client always inserts into profiles after signup.

---
