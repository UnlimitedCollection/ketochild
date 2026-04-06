# KetoKid Care - System Manual

## What is KetoKid Care?

KetoKid Care is a **Pediatric Ketogenic Therapy Management System** — a full-stack web application designed for doctors and clinical staff who manage children on ketogenic diets. It provides a centralized dashboard to track patient health, prescribe diet plans, monitor compliance, log ketone readings, and communicate with parents through a companion mobile app.

The system is built as a modern web application with a React frontend, Express.js backend, and PostgreSQL database.

---

## System Overview

| Component | Technology |
|-----------|-----------|
| Frontend | React + Vite, TanStack Query, Recharts |
| Backend API | Express 5 (Node.js) |
| Database | PostgreSQL + Drizzle ORM |
| Authentication | Session-based (express-session) |
| API Specification | OpenAPI 3.1 with Zod validation |
| Monorepo | pnpm workspaces |

---

## User Roles

### 1. Admin (Doctor - Full Access)
- Full create, read, update, and delete access to all resources
- Can manage staff accounts and user roles
- Can add/edit/delete patients, foods, and meal plans
- Can generate parent access tokens
- Access to all pages including User Management

### 2. Moderator (View-Only Staff)
- Read-only access to all patient data
- Cannot add, edit, or delete any records
- User Management page is hidden
- "Quick Add" button is hidden

### Default Login Credentials (Development)

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | 1234 |
| Moderator | admin1 | 12345 |

---

## Features

### 1. Dashboard (Clinical Overview)
- **KPI Cards**: Total children, unfilled meal records (24h and total), registered doctors, active parent tokens
- **Diet Distribution Charts**: Pie charts showing breakdown by diet type (Classic, MAD, MCT, Low GI) and Classic Ketogenic ratios (2:1, 2.5:1, 3:1, 3.5:1, 4:1)
- **Weekly Trends**: Compliance and weight delta trend lines
- **Recent Activity Feed**: Live timeline of notes, weight logs, and meal completions
- **Quick Actions**: Shortcuts to search children, add new child, log readings, and view analytics

### 2. Children (Patient List)
- Searchable and filterable directory of all enrolled patients
- **Table columns**: Patient Name, PHN No., Diet Type, Age, Side Effects, Compliance, Actions
- **PHN Format**: XXXX-XXXXXX-X (numeric with auto-dashes, e.g., 0180-498827-2)
- **Patient Overview Dialog**: Click any row to see a quick summary popup with key patient details
- **Side Effect Badges**: Individual pink/red pill badges showing each active side effect name (or green "Absent" badge)
- **Print View**: Print-ready formatted list of all patients
- **Add New Child Form** (Admin only): Register patients with PHN, name, date of birth, gender, parent contact, and initial diet settings

### 3. Analytics (Population-Level Insights)
- **Weekly Compliance Trend**: Line chart tracking meal compliance over the last 8 weeks
- **Ketone Distribution**: Bar chart showing patients in Low, Optimal (1-3 mmol/L), and High ketone ranges
- **Patient Compliance Overview Table**: Sortable table of all patients with compliance rate, risk level, and active side effects
- **Patient Overview Popup**: Click the eye icon to view detailed patient summary with weight trends, KPI cards, macro targets, and days on current diet

### 4. Foods (Food Library)
- Complete food database management
- **Macro data per 100g**: Calories, Fat, Protein, Carbs
- **Categorization**: Grouped by primary macro type (Carb, Fat, Protein)
- **Controls**: Toggle food visibility (Active/Inactive)
- **Image Upload**: Upload food images for parent app display
- **Search**: Find foods by name

### 5. Tokens (Parent Access Management) - Admin Only
- Generate secure login tokens for parents
- Default 90-day validity period
- Link tokens to specific children
- Reset or revoke parent access at any time

### 6. User Management - Admin Only
- Create and edit staff accounts (Doctors/Moderators)
- Assign roles (Admin or Moderator)
- Upload profile photos
- Generate secure temporary passwords

### 7. Settings (Personal Account)
- **Profile**: Update name, email, username, and specialty
- **Security**: Change personal login password

---

## Patient Profile (Kid Profile)

The patient profile is the core of the clinical workflow, organized into specialized tabs:

### Tab 1: Overview
- **Weight History Chart**: Interactive line chart showing weight trajectory over time
- **Add Weight Dialog**: Log new weight entries with date and kilogram value
- **Recent Activity Summary**: Meal completion rates and recent clinical events
- **Patient Info Header**: Name, PHN No., diet type, age, parent contact

### Tab 2: Medical Controls
- **Diet Configuration**: Set Diet Type (Classic Keto, MAD, MCT, Low GI) and Sub-category ratios (2:1, 2.5:1, 3:1, 3.5:1, 4:1)
- **Macro Prescriptions (Auto-Calculated)**:
  - Daily Calories, Fat (g), Protein (g), Carbs (g)
  - Auto-calculates based on patient weight using tiered formula:
    - Weight <= 10kg: 110 x Weight
    - 10 < Weight <= 20kg: 1100 + 70 x (Weight - 10)
    - Weight > 20kg: 1800 + 30 x (Weight - 20)
  - Macros auto-fill when diet type or ratio is changed
- **Keto Ratio**: Real-time mass-based calculation: Fat(g) / (Protein(g) + Carbs(g))
- **App Visibility Toggles**: Control if parents see "All Foods" or "All Recipes" in their mobile app
- **Save Button**: Positioned below visibility toggles

### Tab 3: Meal History
- **Daily Meal Log** (paginated, 10 per page): Expandable list of logged meals organized by date
- **Meal Details**: Specific foods consumed, portion sizes, actual vs. planned macros
- **Photo Evidence**: View meal images uploaded by parents
- **Nutrition Trends Chart**: Visual trends of macro intake over time

### Tab 4: Ketones
- **Ketone Trend Chart**: Blood and urine ketone levels plotted over time
- **Log Reading Form**:
  - Type selector (Blood or Urine) shown first
  - Blood: Free-text mmol/L input (range 0-30)
  - Urine: Dropdown with predefined values (-2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2)
  - Date picker and optional notes
- **Reading History Table**: Filterable by type (Blood/Urine), status, and date range
- **Status Classification**: Automatic tagging — Below Range, Sub-therapeutic, Therapeutic, High, Dangerously High

### Tab 5: Meal Plan
- **Daily Macro KPI Cards**: Showing prescribed Daily Calories, Fat, Protein, and Carbs from medical settings
- **Diet-Type-Aware Meal Slots**:
  - Classic/MAD/Low GI: 3 meals (Breakfast, Lunch, Dinner)
  - MCT: 4 meals (Breakfast, Lunch, Dinner, Snack)
- **Compliance Comparison**: Planned vs. actual macros for each meal
- **Print-Ready View**: Formatted for printing with macro targets

### Tab 6: Compliance
- **Heatmap Calendar**: 2-month calendar view showing daily meal completion
  - Green = Full completion
  - Amber = Partial completion
  - Red = Missed
- **Hover Popup**: Shows date, completed/total meals, compliance %, and macro totals
- **Day Click Analytics**: Detailed popup with meal-by-meal completion, macro progress bars vs targets, donut chart of macro proportions, and ketone readings for that day

### Tab 7: Side Effects
- **Checklist**: Toggle predefined side effects (e.g., Constipation, Lethargy, Nausea, etc.)
- **Custom Effects**: Add new clinical observations — shared globally across the system
- **20 predefined side effects** seeded in the database

### Tab 8: Private Notes
- **Doctor Notes**: Add timestamped private notes about the patient
- **Management**: View and delete notes (admin only)

---

## Parent-Side Mobile App

The parent companion app works in tandem with the doctor dashboard:

### Access
- Token-based secure login — no traditional password needed
- Doctors generate 90-day access tokens from the Tokens page
- Each token is linked to a specific child

### Features
1. **Meal Logging**: Parents log specific food items and portion sizes for each meal
2. **Photo Upload**: Take and upload photos of meals for doctor review
3. **Daily Progress**: View progress toward prescribed macro targets (calories, fat, protein, carbs)
4. **Food Library**: Browse approved foods filtered by doctor's visibility settings
5. **Recipe Library**: Access approved recipes (controlled by doctor's visibility settings)

### How It Connects to the Doctor Dashboard
- Meals logged by parents appear in the **Meal History** tab
- Meal photos are viewable by doctors in the meal detail view
- Compliance data feeds into the **Compliance Heatmap** and **Analytics** page
- Doctors control what foods/recipes parents can see via **Medical Controls > App Visibility**
- Parent access can be revoked at any time from the **Tokens** page

---

## Keto Diet Calculations

### Supported Diet Types
| Diet Type | Description |
|-----------|-------------|
| Classic Ketogenic | Traditional high-fat, low-carb keto with specific ratios (2:1 to 4:1) |
| MAD (Modified Atkins Diet) | Less restrictive, focuses on carb limits |
| MCT (Medium Chain Triglyceride) | Uses MCT oil as primary fat source, includes snack meal |
| Low GI (Low Glycemic Index) | Emphasizes low-glycemic carbohydrates |

### Keto Ratio Formula
**Mass-based ratio**: Fat(g) / (Protein(g) + Carbs(g))

Example: A 2:1 diet with 80g fat, 30g protein, 10g carbs = 80 / (30 + 10) = 2.00:1

### Calorie Calculation (Weight-Tiered)
| Weight Range | Formula |
|-------------|---------|
| <= 10 kg | 110 x Weight |
| 10-20 kg | 1100 + 70 x (Weight - 10) |
| > 20 kg | 1800 + 30 x (Weight - 20) |

### Ketone Status Thresholds (Blood)
| Range (mmol/L) | Status |
|----------------|--------|
| < 0.5 | Below Range |
| 0.5 - 1.5 | Sub-therapeutic |
| 1.5 - 6.0 | Therapeutic |
| 6.0 - 8.0 | High |
| > 8.0 | Dangerously High |

---

## Security & Access Control

- **Session-based authentication** with secure cookies
- **Role-Based Access Control (RBAC)**: Admin (full access) and Moderator (read-only)
- **Doctor-scoped data**: Each doctor sees only their own patients (admins can see all)
- **API-level enforcement**: Write operations blocked for moderators at the API layer
- **CORS protection**: Configured origins in production
- **Duplicate PHN prevention**: Server-side uniqueness check on patient registration

---

## Print Features

- **Kids List**: Print-ready formatted list of all patients with PHN, diet type, age, and side effects
- **Meal Plan**: Print-ready meal plan with macro targets and food assignments
- **Patient Profile**: Printable patient summary

---

## Data Seeding

The system comes pre-loaded with sample data for demonstration:
- **52 sample patients** with varied diet types and demographics
- **62 foods** with complete macro nutritional data
- **51 recipes** linked to meal types
- **20 predefined side effects**
- **19 library meal plans**
- **3 meal types** (Breakfast, Lunch, Dinner) + Snack for MCT

---

## Environment Requirements

| Variable | Required | Description |
|----------|----------|-------------|
| DATABASE_URL | Yes | PostgreSQL connection string |
| SESSION_SECRET | Production | Secure random string for session signing |
| CORS_ORIGINS | Production | Comma-separated allowed origins |
| PORT | Auto | Set automatically by the platform |
| NODE_ENV | Production | Set to "production" for deployment |
