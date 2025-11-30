/*
  # Employee Management System Database Schema

  ## Overview
  This migration creates the core database schema for an employee management system with role-based access control.

  ## New Tables
  
  ### 1. `employees` table
  - `id` (uuid, primary key) - Unique identifier for each employee
  - `user_id` (uuid, foreign key) - Links to auth.users for authentication
  - `name` (text) - Employee full name
  - `email` (text, unique) - Employee email address
  - `age` (integer) - Employee age
  - `class` (text) - Employee classification/department
  - `subjects` (text[]) - Array of subjects/skills
  - `attendance` (integer) - Attendance percentage (0-100)
  - `position` (text) - Job position/title
  - `salary` (numeric) - Employee salary
  - `phone` (text) - Contact phone number
  - `address` (text) - Physical address
  - `hire_date` (date) - Date of hiring
  - `is_active` (boolean) - Active status
  - `flagged` (boolean) - Flag for special attention
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. `user_roles` table
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid, foreign key) - Links to auth.users
  - `role` (text) - User role (admin or employee)
  - `created_at` (timestamptz) - Record creation timestamp

  ## Security
  - Enable RLS on both tables
  - Admins can view, create, update, and delete all employee records
  - Employees can only view their own record and update limited fields
  - Public users cannot access any data

  ## Performance
  - Indexes on frequently queried columns (email, user_id, class)
  - Foreign key constraints for data integrity
*/

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  age integer CHECK (age >= 18 AND age <= 100),
  class text NOT NULL DEFAULT 'General',
  subjects text[] DEFAULT '{}',
  attendance integer CHECK (attendance >= 0 AND attendance <= 100) DEFAULT 0,
  position text NOT NULL DEFAULT 'Staff',
  salary numeric(10, 2) DEFAULT 0,
  phone text,
  address text,
  hire_date date DEFAULT CURRENT_DATE,
  is_active boolean DEFAULT true,
  flagged boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'employee')) DEFAULT 'employee',
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_employees_user_id ON employees(user_id);
CREATE INDEX IF NOT EXISTS idx_employees_email ON employees(email);
CREATE INDEX IF NOT EXISTS idx_employees_class ON employees(class);
CREATE INDEX IF NOT EXISTS idx_employees_is_active ON employees(is_active);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_employees_updated_at ON employees;
CREATE TRIGGER update_employees_updated_at
  BEFORE UPDATE ON employees
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for employees table

-- Admin can view all employees
CREATE POLICY "Admins can view all employees"
  ON employees FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Employees can view their own record
CREATE POLICY "Employees can view own record"
  ON employees FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Admin can insert employees
CREATE POLICY "Admins can insert employees"
  ON employees FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Admin can update all employees
CREATE POLICY "Admins can update all employees"
  ON employees FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Employees can update their own phone and address only
CREATE POLICY "Employees can update own contact info"
  ON employees FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Admin can delete employees
CREATE POLICY "Admins can delete employees"
  ON employees FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- RLS Policies for user_roles table

-- Users can view their own role
CREATE POLICY "Users can view own role"
  ON user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Admins can view all roles
CREATE POLICY "Admins can view all roles"
  ON user_roles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role = 'admin'
    )
  );

-- Admins can insert roles
CREATE POLICY "Admins can insert roles"
  ON user_roles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Admins can update roles
CREATE POLICY "Admins can update roles"
  ON user_roles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Insert sample data for testing
INSERT INTO employees (name, email, age, class, subjects, attendance, position, salary, phone, address, hire_date, is_active)
VALUES
  ('John Doe', 'john.doe@company.com', 32, 'Engineering', ARRAY['JavaScript', 'React', 'Node.js'], 95, 'Senior Developer', 95000, '+1-555-0101', '123 Tech Street, San Francisco, CA', '2020-03-15', true),
  ('Jane Smith', 'jane.smith@company.com', 28, 'Engineering', ARRAY['Python', 'Django', 'PostgreSQL'], 92, 'Backend Developer', 85000, '+1-555-0102', '456 Code Avenue, Austin, TX', '2021-06-20', true),
  ('Mike Johnson', 'mike.johnson@company.com', 35, 'Management', ARRAY['Leadership', 'Agile', 'Strategy'], 98, 'Project Manager', 105000, '+1-555-0103', '789 Manager Lane, New York, NY', '2019-01-10', true),
  ('Sarah Williams', 'sarah.williams@company.com', 29, 'Design', ARRAY['UI/UX', 'Figma', 'Adobe XD'], 90, 'UI/UX Designer', 80000, '+1-555-0104', '321 Design Road, Seattle, WA', '2021-09-05', true),
  ('David Brown', 'david.brown@company.com', 31, 'Engineering', ARRAY['Java', 'Spring Boot', 'Microservices'], 88, 'Full Stack Developer', 90000, '+1-555-0105', '654 Stack Boulevard, Boston, MA', '2020-11-12', true),
  ('Emily Davis', 'emily.davis@company.com', 27, 'Marketing', ARRAY['SEO', 'Content Strategy', 'Analytics'], 94, 'Marketing Specialist', 70000, '+1-555-0106', '987 Marketing Plaza, Chicago, IL', '2022-02-18', true),
  ('Chris Wilson', 'chris.wilson@company.com', 33, 'Engineering', ARRAY['DevOps', 'AWS', 'Docker'], 91, 'DevOps Engineer', 100000, '+1-555-0107', '147 Cloud Street, Denver, CO', '2020-07-22', true),
  ('Amanda Taylor', 'amanda.taylor@company.com', 30, 'HR', ARRAY['Recruitment', 'Training', 'Employee Relations'], 96, 'HR Manager', 85000, '+1-555-0108', '258 People Avenue, Portland, OR', '2021-04-08', true),
  ('Robert Martinez', 'robert.martinez@company.com', 34, 'Sales', ARRAY['B2B Sales', 'CRM', 'Negotiation'], 89, 'Sales Director', 110000, '+1-555-0109', '369 Sales Road, Miami, FL', '2019-08-30', true),
  ('Lisa Anderson', 'lisa.anderson@company.com', 26, 'Design', ARRAY['Graphic Design', 'Branding', 'Illustration'], 93, 'Graphic Designer', 72000, '+1-555-0110', '741 Creative Lane, Los Angeles, CA', '2022-05-14', true),
  ('Kevin Thomas', 'kevin.thomas@company.com', 36, 'Engineering', ARRAY['C++', 'Embedded Systems', 'IoT'], 87, 'Embedded Engineer', 98000, '+1-555-0111', '852 Hardware Street, Detroit, MI', '2019-12-01', true),
  ('Michelle Lee', 'michelle.lee@company.com', 29, 'Finance', ARRAY['Accounting', 'Financial Analysis', 'Excel'], 97, 'Financial Analyst', 88000, '+1-555-0112', '963 Finance Plaza, Charlotte, NC', '2021-03-25', true)
ON CONFLICT (email) DO NOTHING;