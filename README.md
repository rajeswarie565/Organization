# 🚀 Employee Management System

A modern, full-stack employee management system with GraphQL API, role-based access control, and a beautiful React Native interface.

![Built with React Native](https://img.shields.io/badge/React%20Native-0.81.4-blue)
![Expo SDK](https://img.shields.io/badge/Expo-54.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Supabase](https://img.shields.io/badge/Supabase-Backend-green)

## ✨ Features

### Frontend
- 🎨 **Beautiful UI** with modern gradients and animations
- 📱 **Responsive Design** for all screen sizes
- 🗂️ **Multiple Views**: Dashboard, Tile, Grid, and Detail views
- 🔍 **Search & Filter** employees in real-time
- 🍔 **Hamburger Menu** with sub-navigation
- 🔄 **Pull-to-Refresh** on all screens
- ⚡ **Fast Performance** with optimized rendering

### Backend
- 🔐 **GraphQL API** for efficient data fetching
- 👥 **Role-Based Access Control** (Admin/Employee)
- 🛡️ **Row Level Security** for data protection
- 📊 **12 Sample Employees** pre-loaded
- 🔑 **JWT Authentication** with Supabase Auth
- 📈 **Pagination & Sorting** support

## 🎯 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd employee-management-system

# Install dependencies
npm install

# Start development server
npm run dev
```

Open in your browser at `http://localhost:8081`

### Build for Production

```bash
npm run build:web
```

The output will be in the `dist/` folder, ready for deployment.

## 🔐 Authentication

### Create Admin User

1. Click "Create New Account" on login screen
2. Fill in your details and select "Admin" role
3. Sign up and start managing employees

Or use the demo credentials:
- **Email**: Create your own admin account
- **Password**: (your choice, min 6 characters)

See [SETUP_ADMIN.md](./SETUP_ADMIN.md) for detailed instructions.

## 📊 Features by Role

### Admin Access
- ✅ View all employees
- ✅ Create, update, delete employees
- ✅ Flag employees for attention
- ✅ Access all menu items
- ✅ View complete statistics

### Employee Access
- ✅ View all employees (read-only)
- ✅ View own profile details
- ✅ Update own contact information
- ❌ Limited administrative functions

## 🛠️ Tech Stack

### Frontend
- **React Native** - Cross-platform framework
- **Expo** - Development platform
- **TypeScript** - Type safety
- **Expo Router** - File-based routing
- **Lucide Icons** - Beautiful icons

### Backend
- **Supabase** - Backend as a Service
- **PostgreSQL** - Database
- **GraphQL** - API layer
- **Edge Functions** - Serverless API
- **Row Level Security** - Data protection

## 📱 Screenshots & Demo

### Dashboard View
- Real-time statistics
- Quick action cards
- Role-based information

### Tile View
- Employee cards with essential info
- 3-dot menu for actions (admin)
- Search and filter functionality

### Grid View
- Comprehensive data table
- 10+ columns of information
- Sortable and scrollable

### Detail Modal
- Complete employee information
- Contact details
- Skills and performance metrics

## 🔌 API Documentation

### GraphQL Endpoint
```
https://noxerzipfnhvkueblzhc.supabase.co/functions/v1/graphql
```

### Example Queries

**Get All Employees:**
```graphql
query GetEmployees {
  employees
}
```

**Get Paginated Results:**
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

See full API documentation in [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🚀 Deployment

This app can be deployed to:

### Vercel (Recommended)
```bash
vercel
```

### Netlify
```bash
npm run build:web
netlify deploy --prod --dir=dist
```

### Other Platforms
Build and upload the `dist/` folder to any static hosting service.

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment guide.

## 📁 Project Structure

```
├── app/
│   ├── (tabs)/           # Main app screens
│   ├── auth/             # Authentication screens
│   └── _layout.tsx       # Root layout
├── components/           # Reusable components
├── contexts/             # React contexts
├── lib/                  # Utilities & API
├── supabase/
│   ├── functions/        # Edge Functions
│   └── migrations/       # Database migrations
└── types/                # TypeScript types
```

## 🔒 Security Features

- ✅ JWT authentication
- ✅ Row Level Security (RLS)
- ✅ Role-based access control
- ✅ Secure password requirements
- ✅ Protected API endpoints
- ✅ Input validation

## 📈 Performance

- **Database**: Optimized with indexes
- **Frontend**: Memoized components
- **API**: Efficient GraphQL queries
- **Build**: Production-ready optimization

## 🎨 Design Highlights

- Modern gradient themes
- Smooth animations and transitions
- Consistent 8px spacing grid
- Professional color scheme
- Clear visual hierarchy
- Accessible UI elements

## 📚 Documentation

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Complete deployment guide
- **[SETUP_ADMIN.md](./SETUP_ADMIN.md)** - Admin user setup
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Detailed project overview

## 🤝 Contributing

This is a proof-of-concept application. Feel free to fork and customize for your needs.

## 📄 License

This project is for demonstration purposes.

## 🎉 Acknowledgments

Built with:
- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [Supabase](https://supabase.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Lucide Icons](https://lucide.dev/)

## 📞 Support

For issues or questions:
1. Check the documentation files
2. Review Supabase Dashboard for API/database issues
3. Check browser console for errors

---

**Made with ❤️ using React Native and Supabase**
