# Supabase Setup Guide for FreshersBridge.in

This guide explains how to initialize and configure your Supabase Postgres database for the FreshersBridge MVP.

## Step 1: Create a Supabase Project
1. Log in to [Supabase](https://supabase.com).
2. Click **New Project** and select/create an organization.
3. Set your project name to `FreshersBridge`, set a secure Database Password (save this somewhere!), and choose a region closest to your target audience (e.g., `Mumbai / ap-south-1` for India).
4. Click **Create new project** and wait for database provisioning.

## Step 2: Initialize Database Schema
Navigate to the **SQL Editor** in the left sidebar of your Supabase dashboard, click **New query**, paste the SQL commands below, and click **Run**:

```sql
-- 1. Create Categories Table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) UNIQUE NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Jobs Table
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    company VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    salary VARCHAR(255),
    eligibility VARCHAR(255) NOT NULL,
    skills TEXT[] NOT NULL,
    description TEXT NOT NULL,
    apply_url TEXT NOT NULL,
    source_name VARCHAR(255) NOT NULL DEFAULT 'FreshersBridge',
    source_url TEXT,
    featured_job BOOLEAN NOT NULL DEFAULT FALSE,
    views_count INT NOT NULL DEFAULT 0,
    application_deadline DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Performance Optimization Indexes
CREATE INDEX idx_jobs_category_id ON jobs(category_id);
CREATE INDEX idx_jobs_featured_job ON jobs(featured_job);
CREATE INDEX idx_jobs_created_at ON jobs(created_at DESC);
CREATE INDEX idx_jobs_slug ON jobs(slug);
```

## Step 3: Seed Initial Categories
Run the following SQL statement in a new SQL editor query to seed default tech categories (which map to the dynamic category icons in the UI):

```sql
INSERT INTO categories (name, slug) VALUES
('Software Development', 'software-development'),
('Web Development', 'web-development'),
('Data Science & Analytics', 'data-analytics'),
('Database Administration', 'database-administration'),
('DevOps & Cloud', 'devops-cloud'),
('QA & Testing', 'qa-testing')
ON CONFLICT (slug) DO NOTHING;
```

## Step 4: Retrieve API Connection Credentials
1. Navigate to **Project Settings** -> **API** in the Supabase Sidebar.
2. Find the values for:
   - **Project URL** (under Project API keys)
   - **anon public** (under Project API keys)
3. Open your `.env.local` file in the project root and fill in the placeholders:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ADMIN_ACCESS_KEY=freshersbridgeadmin2026
   ```

*(Note: In Supabase, the default RLS rules block public reads if you enable them. For this MVP v1, RLS is disabled by default on new tables. If you choose to enable Row Level Security (RLS) on your tables, ensure you add a select policy allowing public read access, and insert/update/delete policies allowing operations using service role credentials or anon authorization if matching the admin dashboard checks).*
