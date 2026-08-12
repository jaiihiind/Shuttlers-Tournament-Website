-- Run this in your Supabase SQL Editor to grant admin access
-- It allows the specific admin email to view ALL registrations

create policy "Admin can view all registrations"
  on public.registrations for select
  using (
    (auth.jwt() ->> 'email') = 'rishavray05@gmail.com'
  );

create policy "Admin can view all profiles"
  on public.profiles for select
  using (
    (auth.jwt() ->> 'email') = 'rishavray05@gmail.com'
  );
