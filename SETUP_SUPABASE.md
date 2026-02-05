
# Supabase Setup for Pathly

To enable the database connection and full user authentication, you need to provide your Supabase keys.

1.  **Create a .env.local file** in the root directory (`d:\learnhub`).
2.  Add the following keys:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Database Schema (SQL)

Run this SQL in your Supabase SQL Editor to create the necessary tables:

```sql
-- Profiles table linked to auth.users
create table profiles (
  id uuid references auth.users not null primary key,
  username text unique,
  avatar_url text,
  xp_points integer default 0,
  streak_count integer default 0,
  last_activity_date timestamp with time zone
);

-- User Progress tracking
create table user_progress (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id),
  unit_id text not null,
  status text check (status in ('locked', 'unlocked', 'completed')) default 'unlocked',
  completed_at timestamp with time zone,
  score integer, -- for quizzes
  unique(user_id, unit_id)
);

-- RLS Policies (Security)
alter table profiles enable row level security;
alter table user_progress enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

create policy "Users can view own progress"
  on user_progress for select
  using ( auth.uid() = user_id );

create policy "Users can update own progress"
  on user_progress for insert
  with check ( auth.uid() = user_id );
```

Once added, the application will automatically switch from using mock data to real database data.

### 💡 Pro Tip: Stop "Email rate limit" errors
During testing, the email confirmation can cause rate limit errors. To disable it:
1. Go to your **Supabase Dashboard**.
2. Navigate to **Authentication** -> **Providers** -> **Email**.
3. Turn OFF **"Confirm email"**.
4. Click **Save**.
Now you can sign up and login instantly without checking email!
