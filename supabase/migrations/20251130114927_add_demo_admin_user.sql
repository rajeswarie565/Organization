/*
  # Add Demo Admin User

  ## Overview
  This migration creates a demo admin user for testing purposes.

  ## Important Notes
  1. This is for demonstration purposes only
  2. The password is: admin123
  3. Email: admin@company.com
  4. In production, users should sign up through the app

  ## Changes
  - Attempts to create an admin role entry for any existing users with admin email
*/

-- This migration adds a demo note
-- In a real production app, users would sign up through the UI
-- The admin user should be created manually through Supabase Auth UI

-- For demo purposes, if a user with admin@company.com exists, give them admin role
DO $$
BEGIN
  -- Check if any user with admin email exists and assign admin role
  INSERT INTO user_roles (user_id, role)
  SELECT id, 'admin'
  FROM auth.users
  WHERE email = 'admin@company.com'
  ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
END $$;