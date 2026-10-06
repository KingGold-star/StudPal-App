-- ==============================================================================
-- Supabase Schema for Expo Push Notifications
-- ==============================================================================

-- 1. Create push_tokens table supporting multiple devices per user
create table if not exists public.push_tokens (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  expo_push_token text not null unique,
  device_type text, -- 'ios' | 'android'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Indexes for efficient lookup by user_id
create index if not exists idx_push_tokens_user_id on public.push_tokens(user_id);

-- 3. Enable Row Level Security (RLS)
alter table public.push_tokens enable row level security;

-- 4. RLS Policies
-- Users can manage (select, insert, update, delete) their own tokens
create policy "Users can manage their own push tokens"
  on public.push_tokens
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Service role bypass for Edge Functions and Webhooks
create policy "Service role has full access to push_tokens"
  on public.push_tokens
  for all
  to service_role
  using (true)
  with check (true);
