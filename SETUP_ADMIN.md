# Admin User Setup Guide

## Creating an Admin User

To create an admin user for the Employee Management System, follow these steps:

### Method 1: Sign Up Through the App (Recommended)

1. Open the application
2. Click "Create New Account" on the login screen
3. Fill in your details:
   - Full Name: Your name
   - Email: admin@company.com (or any email)
   - Password: admin123 (or your choice, min 6 chars)
   - Role: Select **Admin**
4. Click "Create Account"

**Done!** Your admin user is now created with full permissions.

### Method 2: Using Supabase Dashboard (Manual)

If you need to manually upgrade an existing user to admin:

1. Go to Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **SQL Editor**
4. Run this SQL query (replace the email with your user's email):

```sql
-- Update role to admin
UPDATE user_roles
SET role = 'admin'
WHERE user_id = (
  SELECT id
  FROM auth.users
  WHERE email = 'your-email@example.com'
);

-- If no role exists, insert one
INSERT INTO user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'your-email@example.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
```

## Testing Admin Access

Once logged in as admin, you should have access to:

- ✅ View all employees
- ✅ Create new employees
- ✅ Edit employee details
- ✅ Delete employees
- ✅ Flag/unflag employees
- ✅ All menu items
- ✅ Full dashboard statistics

## Employee User Access

Regular employees have limited access:

- ✅ View all employees (read-only)
- ✅ View their own details
- ❌ Cannot create employees
- ❌ Cannot edit other employees
- ❌ Cannot delete employees
- ❌ Cannot flag employees

## Sample Data

The database comes pre-populated with 12 sample employees for testing:

1. John Doe - Senior Developer
2. Jane Smith - Backend Developer
3. Mike Johnson - Project Manager
4. Sarah Williams - UI/UX Designer
5. David Brown - Full Stack Developer
6. Emily Davis - Marketing Specialist
7. Chris Wilson - DevOps Engineer
8. Amanda Taylor - HR Manager
9. Robert Martinez - Sales Director
10. Lisa Anderson - Graphic Designer
11. Kevin Thomas - Embedded Engineer
12. Michelle Lee - Financial Analyst

All sample employees are from various departments with realistic data including:
- Contact information
- Skills and subjects
- Attendance records
- Salary information
- Hire dates

## GraphQL API Testing

You can test the GraphQL API using these example queries:

### Authentication Required
All API requests require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

### Example Queries

**Get All Employees:**
```graphql
query GetEmployees {
  employees
}
```

**Get Employee by ID:**
```graphql
query GetEmployee($id: String!) {
  employee
}
```

**Get Paginated Employees:**
```graphql
query GetEmployeesPaginated($page: Int, $limit: Int) {
  employees
  pagination
}
```

### Example Mutations (Admin Only)

**Create Employee:**
```graphql
mutation CreateEmployee($input: EmployeeInput!) {
  employee
}
```

**Update Employee:**
```graphql
mutation UpdateEmployee($id: String!, $input: EmployeeInput!) {
  employee
}
```

**Delete Employee:**
```graphql
mutation DeleteEmployee($id: String!) {
  success
}
```

**Toggle Flag:**
```graphql
mutation ToggleFlagEmployee($id: String!) {
  employee
}
```

## Security Notes

1. **Never commit sensitive credentials** to version control
2. The `.env` file contains your Supabase credentials
3. Change default admin passwords in production
4. Review RLS policies before going to production
5. Enable email confirmation in production (currently disabled for demo)

## Troubleshooting

### Cannot Sign Up
- Check that Supabase is properly configured
- Verify environment variables are set
- Check browser console for errors

### Cannot Access Admin Features
- Verify your role in the database
- Log out and log back in
- Check that you're using the correct email

### API Errors
- Ensure you're logged in
- Check that the JWT token is valid
- Verify the GraphQL endpoint is accessible

## Need Help?

If you encounter issues:
1. Check the browser console for errors
2. Verify database connections in Supabase Dashboard
3. Review the DEPLOYMENT.md file for additional information
4. Check that all migrations have been applied successfully
