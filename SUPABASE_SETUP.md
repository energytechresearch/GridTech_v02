# Supabase Setup Guide

This guide will help you set up Supabase for the GridTech application.

## Overview

Supabase has been configured for:
- **Database**: PostgreSQL with all necessary tables
- **Authentication**: Email/password authentication with user roles
- **Row Level Security (RLS)**: Secure data access based on user roles

## Setup Steps

### 1. Database Schema Setup

Run the migration SQL file in your Supabase project:

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/pmvgqvdszgalvbyeifka
2. Navigate to **SQL Editor**
3. Create a new query
4. Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
5. Click **Run** to execute

This will create:
- **7 tables**: profiles, technologies, intake_submissions, pilots, market_watchlist, vendors, industry_insights
- **Indexes** for better query performance
- **Triggers** for automatic `updated_at` timestamp updates
- **Row Level Security (RLS)** policies for secure data access
- **Auto-profile creation** trigger when new users sign up

### 2. Environment Variables

Environment variables are already configured in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Public anonymous key (safe for client-side)
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key (server-side only, never expose to client)

### 3. Authentication Setup

#### Email Provider Configuration
1. Go to **Authentication > Providers** in Supabase Dashboard
2. Enable **Email** provider (should be enabled by default)
3. Configure email templates if needed

#### User Roles
The system supports 4 roles (defined in the `profiles` table):
- **admin**: Full access to all features
- **reviewer**: Can review and approve submissions, manage technologies
- **submitter**: Can submit new technologies
- **viewer**: Read-only access

New users are assigned the `viewer` role by default.

### 4. Test the Connection

You can test the Supabase connection by running the dev server:

```bash
npm run dev
```

The middleware will automatically handle authentication session management.

## File Structure

```
lib/
├── supabase/
│   ├── client.ts          # Client-side Supabase client (for React components)
│   ├── server.ts          # Server-side Supabase client (for API routes, Server Components)
│   └── middleware.ts      # Session refresh middleware
├── auth/
│   ├── actions.ts         # Server actions for auth (signIn, signUp, signOut)
│   └── hooks.ts           # Client hooks (useUser)
└── types/
    └── database.types.ts  # TypeScript types for all database tables

middleware.ts              # Next.js middleware for auth session management

supabase/
└── migrations/
    └── 001_initial_schema.sql  # Database schema SQL
```

## Usage Examples

### Client-Side (React Components)

```typescript
'use client'

import { createClient } from '@/lib/supabase/client'
import { useUser } from '@/lib/auth/hooks'

export function MyComponent() {
  const { user, loading } = useUser()
  const supabase = createClient()

  // Fetch data
  const { data, error } = await supabase
    .from('technologies')
    .select('*')
    .eq('status', 'active')
}
```

### Server-Side (Server Components, API Routes)

```typescript
import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/auth/actions'

export async function ServerComponent() {
  const supabase = await createClient()
  const user = await getUser()

  // Fetch data
  const { data, error } = await supabase
    .from('technologies')
    .select('*')
}
```

### Server Actions

```typescript
'use server'

import { signIn, signUp, signOut } from '@/lib/auth/actions'

// Sign in
await signIn('user@example.com', 'password')

// Sign up
await signUp('user@example.com', 'password', 'Full Name')

// Sign out
await signOut()
```

## Database Tables

### profiles
- User profile information linked to `auth.users`
- Fields: email, full_name, department, role, avatar_url

### technologies
- Technology library entries
- Fields: tech_id, title, description, category, type, status, tags, owner, grid_layer, benefits

### intake_submissions
- Technology intake form submissions
- Fields: submission_id, title, description, category, type, status, submitter info, feasibility_score, reviewer_notes

### pilots
- Pilot project management
- Fields: pilot_id, title, technology_id, phase, status, sponsor, location, dates, objectives, progress, lessons_learned

### market_watchlist
- Market intelligence watchlist items
- Fields: watchlist_id, technology, vendor, signal, priority, notes

### vendors
- Vendor landscape tracking
- Fields: vendor_id, name, focus, maturity, region, active_pilots, related_technologies

### industry_insights
- Industry reports and insights
- Fields: insight_id, title, source, date, summary, url

## Row Level Security (RLS)

All tables have RLS enabled with policies based on user roles:

- **Viewers**: Can read all data
- **Submitters**: Can read all data + insert intake submissions
- **Reviewers**: Can read all data + manage technologies, pilots, market intelligence
- **Admins**: Full CRUD access to all tables

## Next Steps

1. Run the migration SQL in Supabase Dashboard
2. Create a test user in **Authentication > Users**
3. Manually set the user's role in the `profiles` table to 'admin' for testing
4. Start building API routes and components that use Supabase

## Troubleshooting

### Can't connect to Supabase
- Verify `.env.local` has the correct credentials
- Restart the dev server after changing env variables

### RLS errors
- Make sure you're authenticated
- Check your user's role in the `profiles` table
- Verify RLS policies match your use case

### Migration errors
- Run migrations in order
- Check for syntax errors in SQL
- Ensure UUID extension is enabled
