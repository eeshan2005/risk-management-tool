# AssureGate: Risk Management Tool

AssureGate is a comprehensive web-based risk management tool designed to help organizations identify, assess, and mitigate risks effectively. Built with Next.js and Supabase, it provides a robust platform for managing risk data, user roles, and departmental access.

## Features

*   **User Authentication & Authorization**: Secure login with Supabase, supporting multiple user roles (Super Admin, Department Head, Assessor, Reviewer).
*   **Role-Based Access Control (RBAC)**: Granular control over data access based on user roles and departmental assignments.
*   **Risk Data Management**: Functionality to input, view, and manage risk assessments.
*   **Departmental Segmentation**: Organize and manage risks by department.
*   **Admin Dashboard**: Tools for Super Admins to manage users and departments.

## Technologies Used

*   **Frontend**: Next.js (React Framework)
*   **Styling**: Tailwind CSS (or similar, based on `globals.css`)
*   **Database & Authentication**: Supabase (PostgreSQL, Auth, RLS)
*   **Package Manager**: npm / yarn / pnpm / bun

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

*   Node.js (LTS version recommended)
*   npm, yarn, pnpm, or bun
*   A Supabase account and project

### Installation

1.  **Clone the repository**:
    ```bash
    git clone <your-repository-url>
    cd Risk_management_tool_Assuregate
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    # or
    bun install
    ```

3.  **Set up Environment Variables**:
    Create a `.env.local` file in the root of the project and add your Supabase credentials:
    ```
    NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
    NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    ```
    You can find these in your Supabase project settings under `API`.

### Running the Development Server

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

## Supabase Setup

This project relies heavily on Supabase for authentication and data storage. Follow these steps to configure your Supabase project.

### 1. Create `profiles` Table

Navigate to the SQL Editor in your Supabase project and run the following SQL to create the `profiles` table:

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

Enable RLS for the `profiles` table:

```sql
alter table profiles enable row level security;
```

Apply the following RLS policies:

#### Reviewer/Assessor: Only see their own profile
```sql
create policy "Allow user to view own profile" on profiles
  for select using (auth.uid() = id);
```

#### Department-based access for other tables (example for `risks` table)
This policy allows users to see rows in other tables (e.g., `risks`) if they belong to the same department as the risk, or if they are an 'admin'.

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
        where p.id = auth.uid() and p.role = 'super_admin'
      )
    )
  );
```

### 3. Insert Hardcoded Super Admin

To get started, you might want to manually insert a super admin user. First, create the user via Supabase Auth UI or API, then insert their profile:

```sql
-- Replace <admin-user-uuid> with the actual UUID from auth.users
insert into profiles (id, email, role) values ('<admin-user-uuid>', 'admin@assuregate.com', 'super_admin');
```

### 4. Department Table

Ensure you have a `departments` table (or `companies` as mentioned in the original README) with at least `id` and `name` columns, as the `profiles` table references it.

```sql
create table departments (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  created_at timestamp default now()
);
```

### 5. Auto-Insert Profile Logic

For new sign-ups, ensure that a corresponding profile is created in the `profiles` table. This can be handled client-side after successful Supabase authentication or via a Supabase function/trigger.

## Usage

After setting up the project and Supabase:

1.  **Login**: Use the login page to access the application. If you created a super admin, use those credentials.
2.  **Admin Dashboard**: Super Admins can manage users, roles, and departments.
3.  **Risk Assessment**: Users can navigate to the risk assessment section to manage risk data relevant to their department and role.

## Learn More

To learn more about Next.js and Supabase, refer to their official documentation:

*   [Next.js Documentation](https://nextjs.org/docs)
*   [Supabase Documentation](https://supabase.com/docs)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
