-- 1) Backfill missing profile emails from Supabase Auth
UPDATE profiles AS p
SET email = u.email
FROM auth.users AS u
WHERE p.id = u.id
  AND p.email IS NULL;

-- 2) Now that every row has an email, enforce NOT NULL
ALTER TABLE profiles
  ALTER COLUMN email SET NOT NULL;
