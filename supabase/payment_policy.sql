-- Add policies to allow the admin to delete and update (confirm payments) registrations

CREATE POLICY "Admin can update registrations"
  ON public.registrations FOR UPDATE
  USING ((auth.jwt() ->> 'email') = 'rishavray05@gmail.com');

CREATE POLICY "Admin can delete registrations"
  ON public.registrations FOR DELETE
  USING ((auth.jwt() ->> 'email') = 'rishavray05@gmail.com');
