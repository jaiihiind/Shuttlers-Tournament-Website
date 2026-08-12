-- 1. Create a storage bucket for the tournament draws/brackets
INSERT INTO storage.buckets (id, name, public)
VALUES ('draws', 'draws', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow anyone to view the draws
CREATE POLICY "Draws are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'draws');

-- 3. Allow admins to upload draws
CREATE POLICY "Admins can upload draws"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'draws' AND auth.role() = 'authenticated');

-- 4. Allow admins to delete/replace draws
CREATE POLICY "Admins can delete draws"
ON storage.objects FOR DELETE
USING (bucket_id = 'draws' AND auth.role() = 'authenticated');

-- 5. Add a column to our tournaments table to save the file link
ALTER TABLE public.tournaments
ADD COLUMN IF NOT EXISTS draws_url text;
