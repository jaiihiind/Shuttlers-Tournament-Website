-- ============================================
-- Shuttlers Badminton Tournament - Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================

-- 1. PROFILES TABLE
-- Extended user data linked to auth.users
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  phone text,
  role text default 'player' check (role in ('player', 'organizer', 'admin')),
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Auto-create a profile when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, phone, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'phone',.2
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to run after user creation
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. TOURNAMENTS TABLE
create table if not exists public.tournaments (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  location text,
  venue text,
  start_date date,
  end_date date,
  registration_deadline date,
  organizer_id uuid references public.profiles(id) on delete set null,
  status text default 'upcoming' check (status in ('upcoming', 'ongoing', 'completed', 'cancelled')),
  banner_url text,
  max_players integer default 32,
  entry_fee decimal(10,2) default 0,
  prize_pool text,
  categories text[] default '{"Men''s Singles", "Women''s Singles", "Men''s Doubles", "Women''s Doubles", "Mixed Doubles"}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);


-- 3. REGISTRATIONS TABLE
create table if not exists public.registrations (
  id uuid default gen_random_uuid() primary key,
  tournament_id uuid references public.tournaments(id) on delete cascade not null,
  player_id uuid references public.profiles(id) on delete cascade not null,
  category text not null,
  player_name text,
  partner_name text, -- for doubles
  whatsapp_no text,
  dob date,
  gender text,
  event_type text,
  location text,
  status text default 'registered' check (status in ('registered', 'confirmed', 'waitlisted', 'cancelled')),
  checked_in boolean default false,
  checked_in_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(tournament_id, player_id, category)
);


-- 4. MATCHES TABLE
create table if not exists public.matches (
  id uuid default gen_random_uuid() primary key,
  tournament_id uuid references public.tournaments(id) on delete cascade not null,
  category text not null,
  round text not null, -- 'Round of 16', 'Quarter Final', 'Semi Final', 'Final'
  match_number integer,
  court_number integer,
  match_time timestamp with time zone,
  player1_id uuid references public.profiles(id) on delete set null,
  player2_id uuid references public.profiles(id) on delete set null,
  player1_name text, -- fallback if player has no account
  player2_name text,
  winner_id uuid references public.profiles(id) on delete set null,
  score text, -- e.g., "21-15, 21-18"
  status text default 'scheduled' check (status in ('scheduled', 'in_progress', 'completed', 'cancelled', 'bye')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);


-- 5. SPONSORS TABLE
create table if not exists public.sponsors (
  id uuid default gen_random_uuid() primary key,
  tournament_id uuid references public.tournaments(id) on delete cascade not null,
  name text not null,
  logo_url text,
  website_url text,
  tier text default 'bronze' check (tier in ('title', 'gold', 'silver', 'bronze')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);


-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.tournaments enable row level security;
alter table public.registrations enable row level security;
alter table public.matches enable row level security;
alter table public.sponsors enable row level security;

-- PROFILES
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- TOURNAMENTS (publicly readable, organizer-managed)
create policy "Tournaments are viewable by everyone"
  on public.tournaments for select
  using (true);

create policy "Authenticated users can create tournaments"
  on public.tournaments for insert
  with check (auth.role() = 'authenticated');

create policy "Organizers can update own tournaments"
  on public.tournaments for update
  using (auth.uid() = organizer_id);

create policy "Organizers can delete own tournaments"
  on public.tournaments for delete
  using (auth.uid() = organizer_id);

-- REGISTRATIONS
create policy "Users can view own registrations"
  on public.registrations for select
  using (auth.uid() = player_id);

create policy "Organizers can view tournament registrations"
  on public.registrations for select
  using (
    exists (
      select 1 from public.tournaments
      where tournaments.id = registrations.tournament_id
      and tournaments.organizer_id = auth.uid()
    )
  );

create policy "Authenticated users can register for tournaments"
  on public.registrations for insert
  with check (auth.uid() = player_id);

create policy "Users can cancel own registrations"
  on public.registrations for update
  using (auth.uid() = player_id);

create policy "Organizers can manage registrations"
  on public.registrations for update
  using (
    exists (
      select 1 from public.tournaments
      where tournaments.id = registrations.tournament_id
      and tournaments.organizer_id = auth.uid()
    )
  );

-- MATCHES (publicly readable for transparency)
create policy "Matches are viewable by everyone"
  on public.matches for select
  using (true);

create policy "Organizers can manage matches"
  on public.matches for insert
  with check (
    exists (
      select 1 from public.tournaments
      where tournaments.id = matches.tournament_id
      and tournaments.organizer_id = auth.uid()
    )
  );

create policy "Organizers can update matches"
  on public.matches for update
  using (
    exists (
      select 1 from public.tournaments
      where tournaments.id = matches.tournament_id
      and tournaments.organizer_id = auth.uid()
    )
  );

-- SPONSORS (publicly readable)
create policy "Sponsors are viewable by everyone"
  on public.sponsors for select
  using (true);

create policy "Organizers can manage sponsors"
  on public.sponsors for insert
  with check (
    exists (
      select 1 from public.tournaments
      where tournaments.id = sponsors.tournament_id
      and tournaments.organizer_id = auth.uid()
    )
  );

create policy "Organizers can update sponsors"
  on public.sponsors for update
  using (
    exists (
      select 1 from public.tournaments
      where tournaments.id = sponsors.tournament_id
      and tournaments.organizer_id = auth.uid()
    )
  );


-- ============================================
-- STORAGE BUCKETS
-- ============================================

-- Create storage buckets (run in SQL Editor)
insert into storage.buckets (id, name, public)
values 
  ('avatars', 'avatars', true),
  ('tournament-banners', 'tournament-banners', true),
  ('fixtures', 'fixtures', false)
on conflict (id) do nothing;

-- Storage policies for avatars
create policy "Avatar images are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Users can upload their own avatar"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and auth.role() = 'authenticated');

create policy "Users can update their own avatar"
  on storage.objects for update
  using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for tournament banners
create policy "Tournament banners are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'tournament-banners');

create policy "Authenticated users can upload tournament banners"
  on storage.objects for insert
  with check (bucket_id = 'tournament-banners' and auth.role() = 'authenticated');

-- Storage policies for fixtures (private)
create policy "Organizers can manage fixture files"
  on storage.objects for insert
  with check (bucket_id = 'fixtures' and auth.role() = 'authenticated');

create policy "Organizers can read fixture files"
  on storage.objects for select
  using (bucket_id = 'fixtures' and auth.role() = 'authenticated');
