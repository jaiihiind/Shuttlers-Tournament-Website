-- Run this in your Supabase SQL Editor to create a test tournament

INSERT INTO public.tournaments (
  id, 
  name, 
  description, 
  location, 
  venue, 
  start_date, 
  end_date, 
  status
)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Shuttlers Badminton Tournament',
  'The ultimate badminton showdown. Join us for a weekend of intense competition.',
  'Chandigarh',
  'Chandigarh Badminton Academy, Nabha, Zirakpur',
  '2026-08-23',
  '2026-08-24',
  'upcoming'
)
ON CONFLICT (id) DO NOTHING;
