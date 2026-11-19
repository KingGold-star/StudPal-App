-- ==============================================================================
-- STUDPAL AI INTEGRATION MIGRATION
-- Adds ai_usage_logs and private math-uploads storage bucket configuration
-- ==============================================================================

-- 1. AI Usage Logs for cost controls and rate tracking
create table if not exists public.ai_usage_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  feature text not null, -- 'ai-tutor' | 'analyze-math-image' | 'generate-speech'
  tokens_used integer default 0,
  status text default 'success',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.ai_usage_logs enable row level security;

create policy "Users can view their own AI usage"
  on public.ai_usage_logs for select
  using (auth.uid() = user_id);

create policy "Users can insert their own AI usage"
  on public.ai_usage_logs for insert
  with check (auth.uid() = user_id);

-- 2. Storage Bucket for Private Math Homework & Scans
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'math-uploads',
  'math-uploads',
  false,
  10485760, -- 10MB limit
  array['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
on conflict (id) do update set
  public = false,
  file_size_limit = 10485760;

-- Storage policies: Users can only upload and read files in their own user folder (auth.uid()/*)
create policy "Users can upload their own math images"
  on storage.objects for insert
  with check (
    bucket_id = 'math-uploads' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can view their own math images"
  on storage.objects for select
  using (
    bucket_id = 'math-uploads' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can delete their own math images"
  on storage.objects for delete
  using (
    bucket_id = 'math-uploads' and
    auth.uid()::text = (storage.foldername(name))[1]
  );
