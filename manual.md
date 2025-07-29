# AssureGate Risk Management Tool - User Guide

This guide provides a detailed explanation of the AssureGate Risk Management Dashboard, outlining the functionality of each page and how to interact with its features.

## 1. Login Page (Assumed)

While no specific login page image was provided, a typical login process for AssureGate would involve:

*   **Username/Email Input:** A field to enter your registered username or email address.
*   **Password Input:** A field to enter your corresponding password.
*   **Login Button:** A button to submit your credentials and access the application.
*   **Forgot Password/Reset Link:** An option to recover or reset your password if forgotten.

Upon successful login, you will be redirected to the Dashboard.

## 2. Dashboard

**Purpose:** The Dashboard provides an overview of your organization's risk landscape, offering key metrics and distributions at a glance.

**Key Sections:**

*   **Total Risks:** Displays the total number of risks identified (e.g., `201 Total Risks`).
    *   **Active Monitoring:** Indicates if active monitoring is in place.
*   **Most Common Level:** Shows the most frequently occurring risk level (e.g., `Negligible`).
    *   **Primary risk category:** Identifies the primary category of risk.
*   **Common Treatment:** Highlights the most common risk treatment strategy (e.g., `Accept`).
    *   **Preferred strategy:** Indicates the preferred strategy for risk treatment.
*   **Risk Level Distribution (Pie Chart):** A visual representation of risks categorized by their level (Negligible, Medium, Low, High, Very High).
    *   **Distribution Legend:** Shows the count for each risk level (e.g., Negligible: 190, Medium: 6, Low: 5).
    *   **Total Items:** Confirms the total number of risks displayed in the distribution.
*   **Risk Treatment Options (Pie Chart):** A visual breakdown of how risks are being treated (Accept, Mitigate, Monitor, Terminate).
    *   **Distribution Legend:** Shows the count for each treatment option (e.g., Accept: 190, Mitigate: 5, Monitor: 5, Terminate: 1).

**How to Use:** This page is primarily for quick insights and monitoring. You can quickly grasp the overall risk posture and identify areas that might require more attention based on the distribution charts.

## 3. Risk Assessment

**Purpose:** The Risk Assessment page allows you to manage and evaluate individual organizational risks. It provides a tabular view of all risks and tools for data management.

**Key Sections & Actions:**

*   **Search Risks:** A search bar to filter risks by keywords.
*   **Create Risk Button:** Click to add a new risk entry to the system.
*   **Upload Mode:**
    *   **Replace:** Replaces existing risk data with the uploaded file.
    *   **Append:** Adds new risk data from the uploaded file to the existing data.
*   **Download Template Button:** Downloads a CSV template for risk data, useful for bulk uploads.
*   **Upload CSV/Excel Button:** Allows you to upload risk data from a CSV or Excel file.
*   **Delete CSV Button:** Deletes the currently displayed CSV data.
*   **Export CSV Button:** Exports the current risk data to a CSV file.
*   **Export Excel Button:** Exports the current risk data to an Excel file.
*   **Save to Database Button:** Saves the current risk data to the database.
*   **Risk Value Legend:** Explains the numerical ranges corresponding to different risk levels (e.g., `1-16 Negligible`, `103-256 Very High`).
*   **Risk Table:** Displays a detailed list of risks with columns such as:
    *   `S#`: Serial Number
    *   `Business Process`
    *   `Data Risk Iden...`
    *   `Risk Description`
    *   `Threats`
    *   `Vulnerabili...`
    *   `Existing ...`
    *   `Risk Owner`
    *   `Controls ...`
    *   `ISO 2700...`
    *   `Conflic...`
*   **Pagination:** Allows navigation through multiple pages of risk records (e.g., `Showing 1 to 50 of 201 results`, with page numbers `1, 2, 3, 4, 5`).

**How to Use:** This page is central for data entry, bulk operations, and detailed review of individual risks. You can search for specific risks, add new ones, or manage your entire risk dataset through import/export functionalities.

## 4. Query Builder

**Purpose:** The Query Builder enables users to construct custom queries to analyze risk data and extract actionable insights.

**Key Sections & Actions:**

*   **Query Filters:** This section allows you to define criteria for your search.
    *   **Dropdowns:** Select a risk attribute (e.g., `Risk Description`), an operator (e.g., `Select operator`), and enter a `value`.
    *   **Red 'X' Button:** Removes a filter row.
*   **Add Filter Button:** Adds a new row to define an additional filter criterion.
*   **Execute Query Button:** Runs the defined query against the risk data.
*   **Export CSV Button:** Exports the results of the executed query to a CSV file.
*   **Export XLSX Button:** Exports the results of the executed query to an XLSX (Excel) file.
*   **Results Display:** Shows the results of the query (e.g., `No results found.` if no matches).

**How to Use:** This page is for advanced data analysis. You can combine multiple filters to narrow down your risk data and find specific patterns or risks that meet complex criteria. The export options allow you to further analyze the filtered data in external tools.

## 5. Guidelines

**Purpose:** The Guidelines page provides comprehensive information and definitions related to evaluating and managing organizational risks.

**Key Sections:**

*   **Threat Frequency** 💥
    *   `4 Very High`: Occurs frequently (multiple times a month)
    *   `3 High`: Might occur occasionally (multiple times a year)
    *   `2 Medium`: Could occur sometime (once a year)
    *   `1 Low`: Rare; may occur once every 2–5 years

*   **Threat Impact**
    *   `4 Very High`: Project viability threatened; legal or contractual risk
    *   `3 High`: Major delays or rework; client dissatisfaction likely
    *   `2 Medium`: Minor delays; client informed but trust remains
    *   `1 Low`: No impact on timeline or experience

*   **Confidentiality, Integrity & Availability (CIA) Ratings** 🔒
    *   `4 Very High`
    *   `3 High`
    *   `2 Medium`
    *   `1 Low`

*   **Vulnerability Rating** 🛡️
    *   `4 Critical`: No controls or serious lapses; easily exploitable
    *   `3 High`: Weak/outdated controls; plausible exploitation
    *   `2 Medium`: Minor gaps in controls; some risk of exploitation
    *   `1 Low`: Effective controls; exploitation unlikely

*   **Risk Evaluation and Acceptance Criteria** 📊
    *   `1-16 Negligible`: Acceptable. No action required.
    *   `17-64 Low`: Monitor. Document and observe.
    *   `65-128 Medium`: Treat. Implement controls and monitor.
    *   `129-192 High`: Act. Mitigate immediately with senior oversight.
    *   `193-256 Very High`: Critical. Unacceptable — escalate urgently.

**How to Use:** This page serves as a reference for understanding the terminology and criteria used within the AssureGate system, particularly for risk assessment and categorization. It helps ensure consistent understanding and application of risk management principles.

## 6. Admin Dashboard

**Purpose:** The Admin Dashboard provides administrative functionalities, primarily for managing departments and users within the system.

**Key Sections & Actions:**

*   **Overview/User Management Tabs:** Allows switching between different administrative views.
*   **Total Departments:** Displays the total number of departments configured (e.g., `7 Departments`).
    *   **Manage Departments Link:** Click to access a detailed department management interface.
*   **Total Users:** Displays the total number of users in the system (e.g., `7 Users`).
    *   **Manage Users Link:** Click to access a detailed user management interface.
*   **Quick Actions:** Provides shortcuts to frequently used administrative tasks.
    *   **User Management Button:** Directly navigates to the user management section.
    *   **Risk Assessment Button:** Directly navigates to the risk assessment section.
*   **Department Overview Table:** Lists departments and associated user counts.
    *   `Department Name`: Name of the department (e.g., Admin, CISO, HR, IT).
    *   `Users`: Number of users assigned to that department.
    *   `Actions`: Contains a `Manage Users` link for each department, allowing administrators to view and manage users within that specific department.

## 7. User Management

**Purpose:** The User Management section allows administrators to create, modify, and manage user accounts and their permissions within the AssureGate system.

**Key Sections & Actions:**

*   **User List Table:** Displays all registered users with their details:
    *   `Username`: The user's login name
    *   `Email`: The user's email address
    *   `Department`: The department the user belongs to
    *   `Role`: The user's access level (Admin, Manager, User)
    *   `Status`: Whether the account is active or inactive
    *   `Last Login`: Timestamp of the user's last login

*   **User Actions:**
    *   **Add User Button:** Opens a form to create a new user account
    *   **Edit Button:** Allows modifying an existing user's details
    *   **Deactivate/Activate Button:** Toggles user account status
    *   **Reset Password Button:** Sends a password reset link to the user

*   **User Creation/Edit Form Fields:**
    *   Username (required)
    *   Email (required)
    *   Password (required for new users)
    *   Department selection
    *   Role assignment
    *   Account status toggle

**How to Use:** This section is essential for maintaining proper access control and security within the system. Administrators should regularly review user accounts, update roles as needed, and deactivate accounts for users who no longer require access.
