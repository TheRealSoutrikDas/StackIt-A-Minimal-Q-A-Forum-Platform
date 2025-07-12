# StackIt - A Minimal Q&A Forum Platform

StackIt is a minimal question-and-answer platform that supports collaborative learning and structured knowledge sharing. It’s designed to be simple, user-friendly, and focused on the core experience of asking and answering questions within a community. StackIt is a modern web app built with Next.js 15 using the App Router, TypeScript, TailwindCSS, and Quill.js for rich text editing. It provides a clean interface for content creation and includes a responsive dashboard with metric cards.

## Problem Statement

StackIt – A Minimal Q&A Forum Platform

## Demo Video Link: [Google Drive](https://drive.google.com/file/d/1WPNx8QfpBxPdkxXYUHrZutN6URRQBPxW/view?usp=sharing)

## Overview

StackIt is a minimal question-and-answer platform that supports collaborative learning and structured knowledge sharing. It’s designed to be simple, user-friendly, and focused on the core experience of asking and answering questions within a community.

## Team : Team 0849

## 🚀 Features

### ✅ Implemented Features

-   **User Authentication**: Complete JWT-based auth system with login, register, and logout
-   **Question Management**: Create, view, and manage questions with rich text formatting
-   **Answer System**: Post answers to questions with voting capabilities
-   **Voting System**: Upvote and downvote questions and answers
-   **Tag System**: Organize content with searchable tags
-   **Search Functionality**: Find questions by title and description
-   **Responsive Design**: Mobile-first design that works on all devices
-   **Real-time Updates**: Dynamic content updates without page refresh
-   **User Profiles**: View user information and reputation
-   **Notification System**: Real-time notifications for user interactions

### 🔄 In Progress

-   **Comment System**: Add comments to questions and answers
-   **Admin Dashboard**: Content moderation and user management
-   **Email Notifications**: Email alerts for important events

## 🛠️ Tech Stack

### Frontend

-   **Framework**: Next.js 15 with App Router
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS
-   **Rich Text Editor**: TipTap (TipTapEditor)
-   **Icons**: Lucide React
-   **State Management**: React Context API
-   **Package Manager**: pnpm

### Backend

-   **Runtime**: Node.js with Next.js API Routes
-   **Database**: MongoDB with Mongoose ODM
-   **Authentication**: JWT (JSON Web Tokens)
-   **Validation**: Zod schema validation
-   **Middleware**: Custom authentication middleware

### Development Tools

-   **Linting**: ESLint with TypeScript rules
-   **Code Formatting**: Prettier
-   **Type Checking**: TypeScript strict mode

## 📦 Installation & Setup

### Prerequisites

-   Node.js 18+
-   pnpm (recommended) or npm
-   MongoDB database

### 1. Clone the Repository

```bash
git clone https://github.com/TheRealSoutrikDas/StackIt-A-Minimal-Q-A-Forum-Platform.git
cd StackIt-A-Minimal-Q-A-Forum-Platform
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/stackit
# or your MongoDB Atlas connection string

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 4. Start Development Server

```bash
pnpm dev
```

### 5. Open Your Browser

Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
StackIt-A-Minimal-Q-A-Forum-Platform/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── api/                      # API Routes
│   │   │   ├── auth/                 # Authentication endpoints
│   │   │   │   ├── login/route.ts
│   │   │   │   ├── logout/route.ts
│   │   │   │   └── me/route.ts
│   │   │   ├── questions/            # Question management
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts
│   │   │   │       └── vote/route.ts
│   │   │   ├── answers/              # Answer management
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts
│   │   │   │       └── vote/route.ts
│   │   │   ├── tags/route.ts         # Tag management
│   │   │   ├── users/route.ts        # User management
│   │   │   └── search/route.ts       # Search functionality
│   │   ├── ask/page.tsx              # Ask question page
│   │   ├── login/page.tsx            # Login page
│   │   ├── register/page.tsx         # Registration page
│   │   ├── questions/
│   │   │   └── [id]/page.tsx         # Question detail page
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Homepage
│   │   └── globals.css               # Global styles
│   ├── components/                   # React Components
│   │   ├── ui/                       # UI Components
│   │   │   ├── Navigation.tsx        # Main navigation
│   │   │   ├── QuestionCard.tsx      # Question display card
│   │   │   ├── button.tsx            # Button component
│   │   │   ├── card.tsx              # Card component
│   │   │   ├── input.tsx             # Input component
│   │   │   ├── label.tsx             # Label component
│   │   │   └── badge.tsx             # Badge component
│   │   ├── forms/                    # Form Components
│   │   │   ├── AskQuestionForm.tsx   # Question creation form
│   │   │   └── TagInput.tsx          # Tag selection input
│   │   └── editor/                   # Rich Text Editor
│   │       ├── RichTextEditor.tsx    # Main editor component
│   │       ├── TiptapEditor.tsx      # TipTap implementation
│   │       └── EnhancedRichTextEditor.tsx
│   ├── contexts/                     # React Contexts
│   │   └── AuthContext.tsx           # Authentication context
│   ├── lib/                          # Utilities and Configuration
│   │   ├── api-client.ts             # API client utilities
│   │   ├── api-utils.ts              # API helper functions
│   │   ├── auth.ts                   # Authentication utilities
│   │   ├── dbConnect.ts              # Database connection
│   │   ├── utils.ts                  # General utilities
│   │   └── types/                    # TypeScript type definitions
│   │       └── index.ts
│   ├── models/                       # MongoDB Models
│   │   ├── Question.ts               # Question model
│   │   ├── Answer.ts                 # Answer model
│   │   ├── User.ts                   # User model
│   │   ├── Tag.ts                    # Tag model
│   │   ├── Vote.ts                   # Vote model
│   │   └── Notification.ts           # Notification model
│   └── schemas/                      # Zod Validation Schemas
│       ├── questionSchema.ts         # Question validation
│       ├── answerSchema.ts           # Answer validation
│       ├── userSchema.ts             # User validation
│       └── tagSchema.ts              # Tag validation
├── public/                           # Static assets
├── middleware.ts                     # Next.js middleware
├── next.config.ts                    # Next.js configuration
├── tailwind.config.ts                # Tailwind CSS configuration
├── tsconfig.json                     # TypeScript configuration
├── package.json                      # Dependencies and scripts
└── README.md                         # Project documentation
```

## 🎯 Key Components & Architecture

### Authentication System

-   **JWT-based**: Secure token-based authentication
-   **Context API**: Global auth state management
-   **Protected Routes**: Middleware-based route protection
-   **Auto-login**: Persistent session management

### Database Design

-   **MongoDB**: NoSQL database with Mongoose ODM
-   **Relationships**: Proper references between collections
-   **Indexing**: Optimized queries with database indexes
-   **Validation**: Schema-level data validation

### API Architecture

-   **RESTful**: Standard REST API design
-   **Type Safety**: Full TypeScript coverage
-   **Error Handling**: Comprehensive error responses
-   **Validation**: Request/response validation with Zod

### Frontend Architecture

-   **Component-based**: Modular, reusable components
-   **Type Safety**: Full TypeScript integration
-   **Responsive**: Mobile-first design approach
-   **Accessibility**: WCAG compliant components

## 🔧 Configuration

### Environment Variables

```env
# Required
MONGODB_URI=mongodb://localhost:27017/stackit
JWT_SECRET=your-super-secret-jwt-key-here

# Optional
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### Database Setup

1. Install MongoDB locally or use MongoDB Atlas
2. Create a database named `stackit`
3. The application will automatically create collections and indexes

### Development Commands

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm type-check       # Run TypeScript type checking
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Environment Variables for Production

```env
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production
```

## 🧪 Testing Strategy

### Manual Testing Checklist

-   [ ] User registration and login
-   [ ] Question creation with rich text
-   [ ] Answer posting and voting
-   [ ] Search functionality
-   [ ] Tag system
-   [ ] Responsive design on mobile/tablet
-   [ ] Authentication flow
-   [ ] Error handling

### API Testing

Use tools like Postman or Thunder Client to test:

-   Authentication endpoints
-   CRUD operations for questions/answers
-   Voting functionality
-   Search and filtering

## 🔮 Development Roadmap

### Phase 1: Core Features ✅

-   [x] User authentication system
-   [x] Question and answer CRUD
-   [x] Voting system
-   [x] Tag management
-   [x] Search functionality
-   [x] Responsive UI

### Phase 2: Enhanced Features 🚧

-   [ ] Comment system on questions and answers
-   [ ] User reputation and badges
-   [ ] Question bookmarking
-   [ ] Advanced search filters
-   [ ] Email notifications

### Phase 3: Advanced Features 📋

-   [ ] Admin dashboard and moderation
-   [ ] Real-time notifications
-   [ ] Question categories
-   [ ] User profiles and settings
-   [ ] API rate limiting

### Phase 4: Platform Features 📋

-   [ ] Dark mode support
-   [ ] Internationalization (i18n)
-   [ ] Progressive Web App (PWA)
-   [ ] Advanced analytics
-   [ ] Mobile app (React Native)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

-   Follow TypeScript best practices
-   Use ESLint and Prettier for code formatting
-   Write meaningful commit messages
-   Test your changes thoroughly
-   Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/TheRealSoutrikDas/StackIt-A-Minimal-Q-A-Forum-Platform/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 👥 Team & Contributors

### Core Team

**Team 0849** - Building the future of collaborative learning platforms.

### Contributors

<!-- Add contributors here with their GitHub profiles -->

-   [Soutrik Das](https://github.com/TheRealSoutrikDas) - Full Stack Developer
-   [Arnab Santra](https://github.com/Arnab-cloud) - Full Stack Developer

### Collaborators

-   [Ravi Bhingradiya](https://github.com/ravb-odoo)

### How to Contribute

We welcome contributions! Please see our [Contributing Guidelines](#🤝-contributing) for details.

<!--
To add yourself as a contributor:
1. Fork the repository
2. Make your changes
3. Submit a pull request
4. Add your name to this list in the PR
-->

---

Built with ❤️ using Next.js 15, TypeScript, MongoDB, and Tailwind CSS
