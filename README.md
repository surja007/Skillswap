# SkillSwap 🔄

A modern peer-to-peer skill sharing platform that connects learners with teachers in their community. Built with React, TypeScript, and Supabase.

## 🌟 Features

### Core Functionality
- **User Authentication**: Secure registration and login with Supabase Auth
- **Profile Management**: Comprehensive user profiles with skills, bio, and location
- **Skill Marketplace**: Browse and search for available skills and teachers
- **Session Booking**: Schedule learning sessions with skill teachers
- **Real-time Chat**: Communicate with other users through integrated messaging
- **Achievement System**: Gamified experience with points, levels, and badges
- **Review System**: Rate and review completed learning sessions

### User Experience
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern UI**: Built with shadcn/ui components for consistency
- **Protected Routes**: Secure navigation with authentication guards
- **Real-time Updates**: Live data synchronization with Supabase
- **AI Integration**: Gemini 2.5 Pro integration for intelligent skill matching

## 🏗️ Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and building
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: React Query for server state, Context API for auth
- **Routing**: React Router DOM with protected routes
- **Animations**: Framer Motion for smooth interactions

### Backend & Database
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Authentication**: Supabase Auth with JWT tokens
- **Real-time**: Supabase Realtime for live updates
- **Edge Functions**: Supabase Edge Functions for AI integration
- **Storage**: Supabase Storage for file uploads

### Database Schema
- **Users & Profiles**: User authentication and profile management
- **Skills System**: Centralized skill catalog with categories
- **Sessions**: Booking system for learning sessions
- **Chat System**: Real-time messaging between users
- **Achievements**: Gamification with points and badges
- **Reviews**: Session feedback and rating system
- **Notifications**: System alerts and user notifications

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm (or use [nvm](https://github.com/nvm-sh/nvm))
- Supabase account for database and authentication

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SkillSwap
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Copy the `.env` file and update with your Supabase credentials:
   ```bash
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   VITE_SUPABASE_PROJECT_ID=your_project_id
   ```

4. **Database Setup**
   
   The project includes Supabase migrations. Run them in your Supabase project:
   ```bash
   npx supabase db push
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:8080`

## 📁 Project Structure

```
SkillSwap/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── AchievementsPage.tsx
│   │   ├── BookingSystem.tsx
│   │   ├── ChatInterface.tsx
│   │   ├── Navigation.tsx
│   │   ├── UserProfile.tsx
│   │   └── ...
│   ├── contexts/           # React contexts
│   │   └── AuthContext.tsx
│   ├── hooks/              # Custom React hooks
│   ├── integrations/       # External service integrations
│   │   └── supabase/
│   ├── lib/                # Utility functions
│   ├── pages/              # Page components
│   └── App.tsx
├── supabase/
│   ├── functions/          # Edge functions
│   │   └── gemini-chat/
│   ├── migrations/         # Database migrations
│   └── config.toml
├── public/                 # Static assets
└── package.json
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔧 Technology Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality React component library
- **Framer Motion** - Animation library
- **React Query** - Server state management
- **React Router** - Client-side routing

### Backend & Services
- **Supabase** - Backend-as-a-Service platform
- **PostgreSQL** - Relational database
- **Supabase Auth** - Authentication service
- **Supabase Realtime** - Real-time subscriptions
- **Edge Functions** - Serverless functions

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 🔐 Authentication

The application uses Supabase Auth for user management:
- Email/password authentication
- Protected routes with authentication guards
- Automatic session management
- User profile creation on registration

## 🗄️ Database

The database schema includes:
- **profiles** - Extended user information
- **skills** - Available skills catalog
- **user_skills** - Skills users can teach
- **sessions** - Learning session bookings
- **chats** - Chat conversations
- **messages** - Chat messages
- **achievements** - Gamification badges
- **reviews** - Session feedback
- **notifications** - User notifications

## 🚀 Deployment

The application is configured for deployment on various platforms:

### Supabase Hosting
1. Build the project: `npm run build`
2. Deploy to Supabase hosting or any static hosting service

### Environment Variables
Ensure all environment variables are properly configured in your deployment environment.
## 🔮 Future Enhancements

- Advanced skill matching algorithms
- Video call integration for sessions
- Payment processing for premium features
- Mobile app development
- Advanced analytics and reporting
- Multi-language support
