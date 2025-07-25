# Project Documentation: Risk Management Tool

## 1. Project Overview

This project is a web-based Risk Management Tool designed to help organizations identify, assess, and manage risks. It provides functionalities for user authentication (login, signup), role-based access control (admins, reviewers), and a dashboard for managing risk data. The application leverages Supabase for backend services, including authentication, database management, and Row Level Security (RLS).

## 2. Key Features

-   **User Authentication**: Secure login and signup processes for different user roles.
-   **Role-Based Access Control (RBAC)**: Differentiates between `admin` and `reviewer` roles, with specific permissions for each.
-   **Risk Data Management**: Functionality to input, view, and manage risk-related data.
-   **Dashboard**: A central hub for users to interact with the application based on their roles.
-   **Supabase Integration**: Utilizes Supabase for database, authentication, and RLS.

## 3. Project Structure

The project follows a Next.js application structure, with key directories and files:

-   `app/`: Contains the main application pages and layouts.
    -   `(auth)/`: Authentication-related pages (e.g., login, signup).
    -   `(protected)/`: Pages requiring authentication.
    -   `admin/`: Admin-specific pages and functionalities.
    -   `dashboard/`: User dashboard.
    -   `login/`: Login page.
    -   `signup/`: Signup page.
    -   `page.tsx`: The landing page.
-   `components/`: Reusable UI components.
-   `lib/`: Utility functions and Supabase client initialization.
    -   <mcfile name="supabaseClient.ts" path="e:\web dev\risk-management-tool-main\lib\supabaseClient.ts"></mcfile>: Initializes the Supabase client.
-   `store/`: Zustand stores for state management (e.g., authentication state).

## 4. Core Functionalities and Working

### 4.1. Authentication Flow

-   **Signup**: When a new user signs up via <mcfile name="page.tsx" path="e:\web dev\risk-management-tool-main\app\signup\page.tsx"></mcfile>:
    1.  The `handleSignup` function is called.
    2.  `supabase.auth.signUp` is used to create a new user in Supabase's `auth.users` table.
    3.  Upon successful user creation, a new entry is inserted into the `profiles` table with the user's `id` (from `auth.uid()`), `email`, a default `role` (e.g., "reviewer"), and `department_id`.
    4.  **Row Level Security (RLS) for INSERT**: For this insertion to succeed, the `profiles` table must have an `INSERT` RLS policy that allows authenticated users to insert their own profile. The condition for this policy should typically be `auth.uid() = id`.

-   **Login**: When a user logs in via <mcfile name="page.tsx" path="e:\web dev\risk-management-tool-main\app\login\page.tsx"></mcfile>:
    1.  The `handleLogin` function is executed.
    2.  `supabase.auth.signInWithPassword` authenticates the user.
    3.  After successful authentication, the user's profile data (role, department_id, email) is fetched from the `profiles` table using `supabase.from("profiles").select(...).eq("id", data.user.id).single()`.
    4.  The user is then redirected to the appropriate dashboard based on their `role`.
    5.  **Row Level Security (RLS) for SELECT**: For the profile data to be fetched successfully, the `profiles` table must have a `SELECT` RLS policy that allows authenticated users to read their own profile. The condition for this policy should typically be `auth.uid() = id`.

### 4.2. Supabase Integration (<mcfile name="supabaseClient.ts" path="e:\web dev\risk-management-tool-main\lib\supabaseClient.ts"></mcfile>)

The `lib/supabaseClient.ts` file is responsible for initializing and exporting the Supabase client. It uses environment variables for the Supabase URL and anonymous key, ensuring secure access to the Supabase project.

```typescript:e:\web dev\risk-management-tool-main\lib\supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or Anon Key environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### 4.3. Row Level Security (RLS)

RLS is critical for securing data in Supabase. The `profiles` table, in particular, requires careful RLS configuration to ensure users can only access and modify their own data.

-   **`profiles` table RLS policies (as observed from the provided image)**:
    -   **INSERT Policies**:
        -   "Admins can insert profiles": Allows administrators to create new profiles.
        -   "Allow reviewers to insert into profiles": Intended to allow reviewers to create their own profiles during signup.
            -   **Crucial Note**: The condition for this policy must be `auth.uid() = id` to allow a user to insert a row where the `id` column matches their authenticated user ID.
    -   **SELECT Policies**:
        -   "Allow reviewers to select their own profile": Allows reviewers to retrieve their own profile data.
        -   "Allow user to view own profile": A general policy allowing any authenticated user to view their own profile.
            -   **Crucial Note**: The condition for both `SELECT` policies must be `auth.uid() = id` to ensure users can only read their own profile data.

### 4.4. UI Components and Pages

-   **Sidebar (<mcfile name="Sidebar.tsx" path="e:\web dev\risk-management-tool-main\components\Sidebar.tsx"></mcfile>)**: Provides navigation within the application. It dynamically renders links based on user roles and application routes.
-   **`app/page.tsx`**: The main landing page. It previously contained a "View Guidelines" button, which has been removed.

## 5. Development and Deployment

-   **Local Development**: The application can be run locally using `npm run dev`.
-   **Environment Variables**: Ensure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correctly set in your `.env.local` file for local development and in your deployment environment.

This documentation provides a high-level overview of the project. For detailed implementation, refer to the respective source code files.