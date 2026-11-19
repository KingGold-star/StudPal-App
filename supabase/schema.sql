-- ==============================================================================
-- STUDPAL SUPABASE BACKEND DATABASE SCHEMA
-- Project: https://yzyartppzcsazwkqtjbw.supabase.co
-- Run this in the Supabase Dashboard -> SQL Editor
-- ==============================================================================

-- 1. Enable Extensions
create extension if not exists "uuid-ossp";

-- ==============================================================================
-- 2. PROFILES TABLE (User Profile linked to Supabase Auth)
-- ==============================================================================
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  username text unique,
  full_name text,
  avatar_url text,
  avatar_emoji text default '🎓',
  country text default 'Nigeria',
  country_code text default 'NG',
  academic_level text default 'undergraduate',
  daily_goal_minutes integer default 60,
  current_streak integer default 0,
  longest_streak integer default 0,
  total_xp integer default 0,
  current_level integer default 1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Policies for profiles
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ==============================================================================
-- 3. USER ONBOARDING PREFERENCES
-- ==============================================================================
create table if not exists public.user_onboarding (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  name text,
  goal text,
  phone_time text,
  target_data jsonb,
  subjects jsonb default '[]'::jsonb,
  confidence_rating text,
  daily_study_time text,
  study_days jsonb default '["mon","wed","fri","sat"]'::jsonb,
  session_length text,
  study_time_of_day text,
  seriousness_level text,
  hear_about_us text,
  study_protection boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.user_onboarding enable row level security;

create policy "Users can manage their own onboarding data"
  on public.user_onboarding for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ==============================================================================
-- 4. USER SETTINGS
-- ==============================================================================
create table if not exists public.user_settings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  settings jsonb not null default '{}'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.user_settings enable row level security;

create policy "Users can manage their own settings"
  on public.user_settings for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ==============================================================================
-- 5. USER SUBJECTS & ENROLLMENT
-- ==============================================================================
create table if not exists public.user_subjects (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  subject_name text not null,
  color text default '#2563EB',
  icon text default 'book',
  mastery_percentage integer default 0,
  study_time_minutes integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, subject_name)
);

alter table public.user_subjects enable row level security;

create policy "Users can manage their subjects"
  on public.user_subjects for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ==============================================================================
-- 6. STUDY SESSIONS
-- ==============================================================================
create table if not exists public.study_sessions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  subject_name text not null,
  topic text,
  duration_minutes integer not null default 25,
  session_type text default 'focus', -- 'focus' | 'flashcards' | 'quiz' | 'revision'
  xp_earned integer default 0,
  notes text,
  completed_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.study_sessions enable row level security;

create policy "Users can manage their study sessions"
  on public.study_sessions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ==============================================================================
-- 7. GAMIFICATION PROGRESS & XP HISTORY
-- ==============================================================================
create table if not exists public.gamification_progress (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  total_xp integer default 0,
  current_level integer default 1,
  current_streak integer default 0,
  longest_streak integer default 0,
  completed_sessions integer default 0,
  completed_reviews integer default 0,
  mastered_topics integer default 0,
  completed_quizzes integer default 0,
  completed_goals integer default 0,
  perfect_days integer default 0,
  consistency_score integer default 50,
  highest_celebrated_level integer default 1,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.gamification_progress enable row level security;

create policy "Public leaderboard view for gamification progress"
  on public.gamification_progress for select
  using (true);

create policy "Users can manage their gamification progress"
  on public.gamification_progress for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create table if not exists public.xp_history (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  activity_type text not null,
  xp_amount integer not null,
  title text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.xp_history enable row level security;

create policy "Users can manage their xp history"
  on public.xp_history for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ==============================================================================
-- 8. USER ACHIEVEMENTS
-- ==============================================================================
create table if not exists public.user_achievements (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  achievement_id text not null,
  title text not null,
  unlocked_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, achievement_id)
);

alter table public.user_achievements enable row level security;

create policy "Users can view and unlock achievements"
  on public.user_achievements for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ==============================================================================
-- 9. COMMUNITIES & MEMBERSHIP
-- ==============================================================================
create table if not exists public.communities (
  id text primary key,
  title text not null,
  category text not null,
  description text,
  member_count integer default 1,
  icon_name text default 'users',
  color text default '#2563EB',
  is_verified boolean default false,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.communities enable row level security;

create policy "Communities are viewable by all authenticated and anonymous users"
  on public.communities for select
  using (true);

create policy "Authenticated users can create communities"
  on public.communities for insert
  with check (auth.role() = 'authenticated');

create table if not exists public.community_members (
  id uuid default uuid_generate_v4() primary key,
  community_id text references public.communities(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (community_id, user_id)
);

alter table public.community_members enable row level security;

create policy "Anyone can view community memberships"
  on public.community_members for select
  using (true);

create policy "Users can join/leave communities"
  on public.community_members for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ==============================================================================
-- 10. AI COACH CHATS & CONVERSATIONS
-- ==============================================================================
create table if not exists public.ai_conversations (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  persona_id text default 'all_round',
  messages jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.ai_conversations enable row level security;

create policy "Users can manage their AI conversations"
  on public.ai_conversations for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ==============================================================================
-- 11. PUSH NOTIFICATION TOKENS
-- ==============================================================================
create table if not exists public.push_tokens (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  expo_push_token text not null unique,
  device_type text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.push_tokens enable row level security;

create policy "Users can manage their push tokens"
  on public.push_tokens for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ==============================================================================
-- 12. AUTOMATIC PROFILE CREATION TRIGGER ON AUTH SIGNUP
-- ==============================================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  -- 1. Create Profile
  insert into public.profiles (
    id,
    email,
    username,
    full_name,
    avatar_url,
    country,
    country_code
  ) values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'Student'),
    new.raw_user_meta_data->>'avatar_url',
    coalesce(new.raw_user_meta_data->>'country', 'Nigeria'),
    coalesce(new.raw_user_meta_data->>'country_code', 'NG')
  );

  -- 2. Create Initial Gamification Progress
  insert into public.gamification_progress (
    user_id,
    total_xp,
    current_level,
    current_streak
  ) values (
    new.id,
    0,
    1,
    1
  );

  return new;
end;
$$ language plpgsql security definer;

-- Trigger execution
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ==============================================================================
-- 13. SEED DEFAULT COMMUNITIES (IF EMPTY)
-- ==============================================================================
insert into public.communities (id, title, category, description, member_count, icon_name, color, is_verified)
values
  ('comm_waec_2026', 'WAEC & WASSCE Champions 2026', 'National Exams', 'Past questions, group study sessions, and daily drills for West African Senior School Certificate candidates.', 1240, 'award', '#2563EB', true),
  ('comm_jamb_aces', 'JAMB / UTME Top Scorers', 'Entrance Exams', 'Aiming for 300+ in UTME! Daily CBT practice questions, syllabus breakdowns, and speed drills.', 2890, 'zap', '#7C3AED', true),
  ('comm_stem_club', 'STEM & Pure Sciences Collective', 'Academics', 'Deep dives into Further Mathematics, Organic Chemistry, Mechanics, and Biology diagrams.', 940, 'cpu', '#059669', true),
  ('comm_code_builders', 'App Builders & Tech Studs', 'Computer Science', 'Learning Python, React Native, algorithms, and collaborating on real-world projects.', 1580, 'terminal', '#D97706', true)
on conflict (id) do nothing;
