-- Run this in your Supabase SQL Editor to add the new fields to registrations

ALTER TABLE public.registrations
ADD COLUMN IF NOT EXISTS player_name text,
ADD COLUMN IF NOT EXISTS whatsapp_no text,
ADD COLUMN IF NOT EXISTS dob date,
ADD COLUMN IF NOT EXISTS gender text,
ADD COLUMN IF NOT EXISTS event_type text,
ADD COLUMN IF NOT EXISTS location text;
