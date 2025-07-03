
# Barangay Mo - Digital Community Platform

**Barangay Mo** is a comprehensive digital platform designed to modernize barangay (village/community) management and enhance citizen engagement in the Philippines. The platform connects residents, barangay officials, and administrators through a unified system that streamlines community services, facilitates local commerce, and improves communication.

## 🏘️ What is Barangay Mo?

Barangay Mo transforms traditional barangay operations by providing:
- **Digital resident registration and verification system**
- **Local marketplace for community commerce**
- **Job portal for employment opportunities**
- **RBI (Resident Basic Information) digital forms**
- **Real-time community notifications and updates**
- **Multi-level user management system**

## ✨ Key Features

### For Residents
- **Community Registration**: Digital barangay membership with verification process
- **RBI Form Submission**: Complete Resident Basic Information forms online
- **Local Marketplace**: Buy and sell products/services within your community
- **Job Search**: Find local employment opportunities
- **Community Feed**: Stay updated with barangay news and announcements
- **Service Requests**: Submit complaints and service requests digitally

### For Barangay Officials
- **Resident Management**: View and manage community members
- **Document Processing**: Review and approve RBI forms and requests
- **Budget Tracking**: Monitor community budget allocations
- **Announcement System**: Broadcast important community updates
- **Service Management**: Handle resident requests and complaints
- **Analytics Dashboard**: View community statistics and insights

### For System Administrators
- **Multi-Barangay Management**: Oversee multiple communities
- **User Role Management**: Assign and manage user permissions
- **Marketplace Administration**: Monitor and moderate local commerce
- **System Analytics**: Comprehensive reporting and data analysis
- **Content Management**: Manage platform-wide content and media

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Backend**: Supabase (PostgreSQL database, Authentication, Storage)
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router DOM
- **Build Tool**: Vite
- **Deployment**: Vercel
- **Icons**: Lucide React
- **Charts**: Recharts
- **Forms**: React Hook Form with Zod validation

## 🚀 Getting Started

### Prerequisites
- Node.js (version 18 or higher)
- npm or bun package manager
- Supabase account (for backend services)

### Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env.local`
   - Configure your Supabase credentials
   - Add any required API keys

4. **Start the development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` to see the application.

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── community/      # Community-related components
│   ├── marketplace/    # E-commerce components
│   ├── layout/         # Layout and navigation
│   └── ui/            # Base UI components
├── contexts/           # React contexts (Auth, Language, Theme)
├── hooks/             # Custom React hooks
├── integrations/      # External service integrations
├── pages/             # Page components and routes
├── services/          # API and business logic
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
```

## 🎯 Core Functionality

### Authentication System
- **Multi-role authentication** (Resident, Official, Super Admin)
- **Email verification** with confirmation flow
- **Role-based access control** with different permissions
- **Secure session management** with automatic token refresh

### RBI (Resident Basic Information) System
- **Step-by-step form completion** with progress tracking
- **Data validation and verification** 
- **Document upload capabilities**
- **Official review and approval workflow**
- **Automatic RBI number generation**

### Community Marketplace
- **Product and service listings** with images and descriptions
- **Category-based organization** 
- **Shopping cart and checkout system**
- **Vendor management** for local businesses
- **Order tracking and management**

### Job Portal
- **Local job postings** with detailed descriptions
- **Application management system**
- **Employer and job seeker dashboards**
- **Skills and experience matching**

### Communication Features
- **Community posts and discussions**
- **Real-time notifications**
- **Official announcements**
- **Direct messaging system**

## 🌐 Deployment

The application is configured for easy deployment on Vercel:

1. **Connect your repository** to Vercel
2. **Configure environment variables** in Vercel dashboard
3. **Deploy automatically** on every push to main branch

The `vercel.json` configuration ensures proper routing for the single-page application.

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style
- **TypeScript** for type safety
- **ESLint** for code quality
- **Tailwind CSS** for consistent styling
- **Component-based architecture** for maintainability

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use existing UI components from shadcn/ui
- Maintain responsive design for mobile users
- Write meaningful commit messages
- Test your changes thoroughly

## 📞 Support & Contact

- **Issues**: Report bugs and feature requests via GitHub Issues
- **Documentation**: Check the `/docs` folder for detailed guides
- **Community**: Join our discussions for community support

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Lovable](https://lovable.dev) - AI-powered web development
- UI components by [shadcn/ui](https://ui.shadcn.com/)
- Backend services by [Supabase](https://supabase.com/)
- Icons by [Lucide](https://lucide.dev/)

---

**Barangay Mo** - Empowering Filipino communities through digital innovation. 🇵🇭
