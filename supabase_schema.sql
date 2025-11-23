-- Create user_profile table
create table if not exists public.user_profile (
  user_id uuid references auth.users not null primary key,
  username text unique,
  symbol_locked text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create user_tool_unlocks table
create table if not exists public.user_tool_unlocks (
  user_id uuid references auth.users not null primary key,
  unlocked_tools text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create user_gamification table
create table if not exists public.user_gamification (
  user_id uuid references auth.users not null primary key,
  points integer default 0,
  level integer default 1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.user_profile enable row level security;
alter table public.user_tool_unlocks enable row level security;
alter table public.user_gamification enable row level security;

-- Drop existing policies to avoid errors
drop policy if exists "Public profiles are viewable by everyone." on public.user_profile;
drop policy if exists "Users can insert their own profile." on public.user_profile;
drop policy if exists "Users can update own profile." on public.user_profile;
drop policy if exists "Users can view own tool unlocks." on public.user_tool_unlocks;
drop policy if exists "Users can insert own tool unlocks." on public.user_tool_unlocks;
drop policy if exists "Users can view own gamification." on public.user_gamification;
drop policy if exists "Users can insert own gamification." on public.user_gamification;

-- Create policies
create policy "Public profiles are viewable by everyone."
  on public.user_profile for select
  using ( true );

create policy "Users can insert their own profile."
  on public.user_profile for insert
  with check ( auth.uid() = user_id );

create policy "Users can update own profile."
  on public.user_profile for update
  using ( auth.uid() = user_id );

create policy "Users can view own tool unlocks."
  on public.user_tool_unlocks for select
  using ( auth.uid() = user_id );

create policy "Users can insert own tool unlocks."
  on public.user_tool_unlocks for insert
  with check ( auth.uid() = user_id );

create policy "Users can view own gamification."
  on public.user_gamification for select
  using ( auth.uid() = user_id );

create policy "Users can insert own gamification."
  on public.user_gamification for insert
  with check ( auth.uid() = user_id );
